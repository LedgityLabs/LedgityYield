// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {LToken} from "./LToken.sol";

contract ArbitrumLocdrop is Ownable2Step {
    // @notice Represent the lock information of an account.
    struct AccountLock {
        uint248 amount;
        uint8 duration;
        uint216 claimedRewards;
        uint40 lockEndTimestamp;
    }

    /// @notice Represent an unlock request in the request queue.
    struct UnlockRequest {
        address account;
        uint256 amount;
    }

    /// @notice Number of seconds in a month.
    uint256 constant ONE_MONTH_IN_SECONDS = 60 * 60 * 24 * 30;

    /// @notice Amount of LDY to distribute to lockers
    uint256 immutable distributedLDY;

    /// @notice Hard cap of L-Tokens that can be locked in this contract.
    int256 immutable lockedHardCap;

    /// @notice Min lock duration (in months).
    uint8 immutable minLockDuration;

    /// @notice Max lock duration (in months).
    uint8 immutable maxLockDuration;

    /// @notice LDY rewards vesting (in months).
    uint8 immutable rewardsVesting;

    /// @notice Reference to the LDY token contract.
    IERC20 ldyToken;

    /// @notice Reference to the locked L-Token contract.
    // LToken lusdcToken;
    LToken lToken;

    /// @notice Holds lockers participations informations.
    mapping(address => AccountLock) accountsLocks;

    /// @notice Holds the total amount of locked L-Tokens.
    uint256 totalLocked;

    /// @notice Whether the deposit period has ended and user can start claiming their rewards
    bool hasDepositPeriodEnded;

    /// @notice Whether the claim period has started and lock can start claiming their LDY rewards
    bool hasClaimPeriodStarted;

    /// @notice Timestamp at which started the claim period
    uint256 claimPeriodStartTimestamp;

    /// @notice Holds the queue of requested unlocks
    UnlockRequest[] unlockRequests;

    /// @notice Holds the index of the next unlock request to process
    uint256 unlockRequestsCursor;

    /// @notice Constructor function
    constructor(
        address lTokenAddress_,
        uint256 distributedLDY_,
        int256 lockedHardCap_,
        uint8 minLockDuration_,
        uint8 maxLockDuration_,
        uint8 rewardsVesting_
    ) {
        // Ensure lockHardCap is in valid range.
        require(lockedHardCap_ >= -1, "Must be >= -1");

        // Set immutables data
        lToken = LToken(lTokenAddress_);
        lockedHardCap = lockedHardCap_;
        distributedLDY = distributedLDY_;
        minLockDuration = minLockDuration_;
        maxLockDuration = maxLockDuration_;
        rewardsVesting = rewardsVesting_;
    }

    /// @notice Setter for the LDY token address
    function setLDYToken(address ldyTokenAddress) public {
        ldyToken = IERC20(ldyTokenAddress);
    }

    /// @notice Compute total pool weight (used to determine rewards of an account)
    function totalWeight() public view returns (uint256) {
        // If a hardcap is given, return maximum pool weight
        if (lockedHardCap != -1) return uint256(lockedHardCap) * maxLockDuration;
        // Else, return current total pool weight
        else return totalLocked * maxLockDuration;
    }

    /// @notice Closes the deposit period.
    function endDepositPeriod() public onlyOwner {
        hasDepositPeriodEnded = true;
    }

    /// @notice Opens the claim period.
    function startClaimPeriod() public onlyOwner {
        // Ensure deposit period has ended
        require(hasDepositPeriodEnded == true, "Deposit period not ended yet");

        // Ensure LDY token address has been set
        require(address(ldyToken) != address(0), "LDY token address not set");

        // Set claim period as started and store the start timestamp
        hasClaimPeriodStarted = true;
        claimPeriodStartTimestamp = block.timestamp;
    }

    /// @notice Compute amount of LDY rewards not yet claimed by the given account
    /// @dev Note: This function neither considers vesting period nor already claimed rewards.
    function eligibleRewardsOf(address account) public view returns (uint256) {
        // Compute account's lock weight
        uint256 lockWeight = accountsLocks[account].amount * accountsLocks[account].duration;

        // Compute amount of LDY that this locker is eligible to
        return (distributedLDY * lockWeight) / totalWeight();
    }

    /**
     * @notice Used to participate to the lockdrop by providing some underlying tokens over a given period
     * @param amount USDC amount to lock
     * @param duration Numbre of months to lock
     */
    function lock(uint256 amount, uint8 duration) public {
        // Ensure deposit period has not ended yet
        require(hasDepositPeriodEnded == false, "Deposit period has ended");

        // Ensure lock duration is in valid range
        require(
            duration >= minLockDuration && duration <= maxLockDuration,
            "Invalid lock duration"
        );

        // Increase account locked amount
        accountsLocks[msg.sender].amount += uint248(amount);

        // Increase total locked amount
        totalLocked += amount;

        // Used lock duration if account already locked before for a longer duration
        uint256 appliedDuration = accountsLocks[msg.sender].amount > duration
            ? accountsLocks[msg.sender].duration
            : duration;

        // Set lock end of account
        accountsLocks[msg.sender].lockEndTimestamp = uint40(
            block.timestamp + appliedDuration * ONE_MONTH_IN_SECONDS
        );

        // Transfer underlyingToken from account to contract
        lToken.underlying().transferFrom(msg.sender, address(this), amount);

        // Deposit USDC in L-Token contract
        lToken.deposit(amount);
    }

    modifier unlockChecks() {
        // Ensure claiming period has started
        require(hasDepositPeriodEnded == true, "Deposit period has not ended yet");

        // Ensure the lock end of the user has ended
        require(
            accountsLocks[msg.sender].lockEndTimestamp <= block.timestamp,
            "Lock period not ended yet"
        );

        _;
    }

    function instantUnlock() public unlockChecks {
        // Ensure the account has something to unlock
        uint256 unlockedAmount = accountsLocks[msg.sender].amount;
        require(unlockedAmount > 0, "Nothing to unlock");

        // Reset account locked amount
        accountsLocks[msg.sender].amount = 0;

        // Retrieve USDC from L-Token contract
        lToken.instantWithdrawal(unlockedAmount);

        // Transfer USDC back to account
        lToken.underlying().transfer(msg.sender, unlockedAmount);
    }

    function requestUnlock() public unlockChecks {
        // Ensure the account has something to unlock
        uint256 unlockedAmount = accountsLocks[msg.sender].amount;
        require(unlockedAmount > 0, "Nothing to unlock");

        // Reset account locked amount
        accountsLocks[msg.sender].amount = 0;

        // Retrieve USDC from L-Token contract
        lToken.requestWithdrawal(unlockedAmount);

        // Put account in the unlock request queue
        unlockRequests.push(UnlockRequest(msg.sender, unlockedAmount));
    }

    function processUnlockRequests() public onlyOwner {
        // Ensure the claim period has started
        require(hasClaimPeriodStarted == true, "Claim period has not started yet");

        // Store the current request to process
        uint256 processedRequestId = unlockRequestsCursor;

        // Loop over remaining requests
        while (processedRequestId < unlockRequests.length) {
            // Retrieve the request
            UnlockRequest memory request = unlockRequests[unlockRequestsCursor];

            // If the contract doesn't hold enough underlying tokens to process the request, stop here
            if (lToken.underlying().balanceOf(address(this)) < request.amount) break;

            // Else, transfer underlying back to account
            lToken.underlying().transfer(request.account, request.amount);

            // Delete the request
            delete unlockRequests[unlockRequestsCursor];

            // Increment processed request ID cursor
            processedRequestId--;
        }

        // Write back the cursor
        unlockRequestsCursor = processedRequestId;
    }

    function availableToClaim(address account) public view returns (uint256) {
        // Compute total eligible rewards of the account
        uint256 totalEligibleRewards = eligibleRewardsOf(account);

        // Compute elapsed months since claim period started
        // Note: Numbers are scaled by 3 decimals to retain precision
        uint256 elapsedTimeS3 = (block.timestamp - claimPeriodStartTimestamp) * 10 ** 3;
        uint256 ONE_MONTH_IN_SECONDS_S3 = ONE_MONTH_IN_SECONDS * 10 ** 3;
        uint256 elapsedMonthsS3 = (elapsedTimeS3 * 10 ** 3) / ONE_MONTH_IN_SECONDS_S3;

        // Compute portion of those rewards that have been released
        uint256 rewardsVestingS3 = uint256(rewardsVesting) * 10 ** 3;
        uint256 totalAvailableToClaim = (totalEligibleRewards * elapsedMonthsS3) / rewardsVestingS3;

        // If claimed rewards are slightly greater than total available to claim, return unclaimed rewards
        // This prevent claiming being blocked by precision loss
        if (accountsLocks[msg.sender].claimedRewards > totalAvailableToClaim) {
            return totalEligibleRewards - accountsLocks[msg.sender].claimedRewards;
        }

        // Else return net claimable
        return totalAvailableToClaim - accountsLocks[msg.sender].claimedRewards;
    }

    function claimRewards() public {
        // Ensure claim period has started
        require(hasClaimPeriodStarted == true, "Claim period has not started yet");

        // Compute claimable LDY rewards
        uint256 claimableLDY = availableToClaim(msg.sender);

        // Increase account claimed amount by claimable amount
        accountsLocks[msg.sender].claimedRewards += uint216(claimableLDY);

        // Transfer rewards to account
        ldyToken.transfer(msg.sender, claimableLDY);
    }
}

/**
 * - Add OOG prevention in processUnlockRequests()
 * - Add way to recover LDY, underlying and L-Tokens
 */
