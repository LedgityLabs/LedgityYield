// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {LToken} from "./LToken.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title Lockdrop
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com

 * @notice Lockdrop pool contract, allowing accounts to lock underlying tokens in a 
 * pre-defined L-Token contract, over a given duration (in months), in exchange of 
 * vested LDY rewards.
 * 
 * @dev Intuition
 * 
 * Lifecycle of a lockdrop pool is composed by 3 main phases:
 * 1) Deposit: During this phase, users can lock their underlying tokens.
 * 2) Claim: During this phase, users can claim their LDY rewards.
 * 3) Recovery: During this phase, owner can recover remaining ERC20 on the contract.
 * 
 * Transitioning between two phases is manually triggered by contract's owner.
 * To ensure fair usage of this power and prevent potential misuse:
 * - the Claim phase cannot start before Deposit phase has ended,
 * - the Recovery phase cannot start before 3 months after the end of rewards vesting,
 * - the Recovery phase cannot start before 3 months after the maximum lock end.
 * 
 * Finally, note that this contract proxies main L-Token contract's functions:
 * - lock() --> deposit()
 * - instantUnlock() --> instantWithdrawal()
 * - requestUnlock() --> requestWithdrawal()
 * This design enables users to interact with the Lockdrop contract in a similar fashion
 * to the L-Token contract.
 * 
 * @dev Definitions:
 * - Locker: An account that has locked underlying tokens in the pool.
 * 
 * @custom:security-contact security@ledgity.com
 */
contract Lockdrop is Ownable2Step, Pausable {
    using SafeERC20 for IERC20;

    /**
     * @notice Represents the lock information of an account.
     * @param amount Amount of underlying tokens locked.
     * @param duration Duration of the lock (in months).
     * @param hasUnlocked Whether the account has unlocked its locked tokens.
     * @param claimedRewards Amount of LDY rewards already claimed.
     * @param lockEndTimestamp Timestamp at which the account's lock ends.
     */
    struct AccountLock {
        uint240 amount;
        uint8 duration;
        bool hasUnlocked;
        uint216 claimedRewards;
        uint40 lockEndTimestamp;
    }

    /// @notice Holds the number of seconds in a month.
    uint256 constant ONE_MONTH_IN_SECONDS = 60 * 60 * 24 * 30;

    /// @notice Holds the amount of LDY to be distributed to lockers.
    uint256 public immutable maxDistributedLDY;

    /**
     * @notice Holds the maximum total amount of L-Tokens that can be locked.
     * @dev Can be set to -1 to disable hardcap.
     */
    int256 public immutable lockedHardCap;

    /// @notice Holds the minimum possible lock duration (in months).
    uint8 public immutable minLockDuration; // LToken lusdcToken;

    /// @notice Holds the maximum possible lock duration (in months).
    uint8 public immutable maxLockDuration;

    /// @notice Holds the duration of LDY rewards vesting (in months).
    uint8 public immutable vestingDuration;

    /// @notice Holds a reference to the locked L-Token contract.
    LToken public immutable lToken;

    /// @notice Holds a reference to the LDY token contract.
    IERC20 public ldyToken;

    /// @notice Holds lockers' participations informations.
    mapping(address => AccountLock) public accountsLocks;

    /// @notice Holds the total amount of locked underlying tokens.
    uint256 public totalLocked;

    /// @notice Holds the current total weight of the lockdrop pool.
    uint256 public totalWeight;

    /// @notice Holds whether the Deposit phase has ended.
    bool public hasDepositPhaseEnded;

    /// @notice Holds whether the Claim phase has started.
    bool public hasClaimPhaseStarted;

    /// @notice Holds whether the Recovery phase has started.
    bool public hasRecoveryPhaseStarted;

    /// @notice Holds the timestamp at which the Claim phase started.
    uint256 public claimPhaseStartTimestamp;

    /// @notice Holds an ordered queue of accounts that requested to unlock their tokens.
    address[] public unlockRequests;

    /// @notice Holds the index of the first request in the queue (a.k.a, next one to be processed).
    uint256 public unlockRequestsCursor;

    /// @notice Top-level checks and code shared by both unlock functions.
    modifier safeUnlock() {
        // Ensure that the Deposit phase has ended
        require(hasDepositPhaseEnded, "Deposit phase not ended yet");

        // Ensure that the account's lock has ended
        require(
            accountsLocks[msg.sender].lockEndTimestamp <= block.timestamp,
            "Lock period not ended yet"
        );

        // Ensure the account hasn't already unlocked its tokens
        require(!accountsLocks[msg.sender].hasUnlocked, "Already unlocked");

        // Ensure the account has something to unlock
        require(accountsLocks[msg.sender].amount > 0, "Nothing to unlock");

        // Indicate that account has unlocked its tokens
        accountsLocks[msg.sender].hasUnlocked = true;
        _;
    }

    /**
     * @notice This constructor function etches the lockdrop terms in immutable states.
     * Ensuring that those terms cannot be modified after deployment.
     * @param lTokenAddress_ Address of the L-Token contract to use.
     * @param distributedLDY_ Amount of LDY to be distributed to lockers.
     * @param lockedHardCap_ Maximum total amount of L-Tokens that can be locked.
     * @param minLockDuration_ Minimum possible lock duration (in months).
     * @param maxLockDuration_ Maximum possible lock duration (in months).
     * @param vestingDuration_ Duration of LDY rewards vesting (in months).
     */
    constructor(
        address lTokenAddress_,
        uint256 distributedLDY_,
        int256 lockedHardCap_,
        uint8 minLockDuration_,
        uint8 maxLockDuration_,
        uint8 vestingDuration_
    ) {
        // Ensure lockHardCap is in valid range [-1, +inf]
        require(lockedHardCap_ >= -1, "Locked hardhat cap must be >= -1");

        // Ensure minLockDuration is not greater than maxLockDuration
        require(
            minLockDuration_ <= maxLockDuration_,
            "Min lock duration must be <= max lock duration"
        );

        // Set immutable states
        lToken = LToken(lTokenAddress_);
        lockedHardCap = lockedHardCap_;
        maxDistributedLDY = distributedLDY_;
        minLockDuration = minLockDuration_;
        maxLockDuration = maxLockDuration_;
        vestingDuration = vestingDuration_;
    }

    /**
     * @notice Updates the LDY token contract address.
     * @dev As the first Ledgity Yield lockdrop campaigns will start before the LDY TGE,
     * this function allows the contract's owner to set the LDY token address once it
     * becomes available.
     * @param ldyTokenAddress Address of the LDY token contract.
     */
    function setLDYToken(address ldyTokenAddress) external onlyOwner {
        // Prevent owner from changing the LDY address after Claim phase has started
        require(!hasClaimPhaseStarted, "Cannot change LDY address after Claim phase has started");

        // Set LDY token address
        ldyToken = IERC20(ldyTokenAddress);
    }

    /**
     * @notice Closes the Deposit phase. After calling this function, account won't be
     * able to lock additional underlying tokens anymore.
     */
    function endDepositPhase() external onlyOwner {
        hasDepositPhaseEnded = true;
    }

    /**
     * @notice Opens the Claim phase. After calling this function, lockers will be able
     * to start claiming their LDY rewards.
     */
    function startClaimPhase() external onlyOwner {
        // Ensure Deposit phase has ended
        require(hasDepositPhaseEnded, "Deposit phase not ended yet");

        // Ensure Claim phase has not already started
        require(!hasClaimPhaseStarted, "Claim phase already started");

        // Ensure that LDY token address is available
        require(address(ldyToken) != address(0), "LDY token address not set");

        // Ensure LDY to be distributed are available on the contract
        uint256 distributedLDY = (maxDistributedLDY * totalWeight) / refWeight();
        require(ldyToken.balanceOf(address(this)) >= distributedLDY, "Not enough LDY tokens");

        // Set Claim phase as started and store the start timestamp
        hasClaimPhaseStarted = true;
        claimPhaseStartTimestamp = block.timestamp;
    }

    /**
     * @notice  Opens the Recovery phase. After calling this function, the contract owner
     * will be able to recover remaining ERC20 tokens on the contract.
     * Note that this won't close the Claim phase and lockers will still be able to claim
     * their LDY rewards.
     */
    function startRecoveryPhase() external onlyOwner {
        // Compute some durations in seconds
        uint256 threeMonthsInSecond = 3 * ONE_MONTH_IN_SECONDS;
        uint256 vestingDurationInSecond = uint256(vestingDuration) * ONE_MONTH_IN_SECONDS;
        uint256 maxLockInSecond = uint256(maxLockDuration) * ONE_MONTH_IN_SECONDS;

        // Ensure we are at least 3 months after the end of reward vesting
        // This prevents owner from recovering LDY before lockers can claim their rewards
        require(
            block.timestamp >=
                claimPhaseStartTimestamp + vestingDurationInSecond + threeMonthsInSecond,
            "Not enough far from rewards vesting end"
        );

        // Ensure we are at least 3 months after the maximum lock end
        // This prevents owner from recovering underlying tokens before lockers can unlock those
        require(
            block.timestamp >= claimPhaseStartTimestamp + maxLockInSecond + threeMonthsInSecond,
            "Not enough far from maximum lock end"
        );

        // Set recovery phase as started
        hasRecoveryPhaseStarted = true;
    }

    /**
     * @notice Recovers a specified amount of a given token address. Will revert if
     * recovery phase has not started yet or if the contract doesn't hold enough tokens.
     * @param tokenAddress The address of the token to recover.
     * @param amount The amount of token to recover.
     */
    function recoverERC20(address tokenAddress, uint256 amount) public onlyOwner {
        // Ensure recovery phase has started
        require(hasRecoveryPhaseStarted, "Recovery phase has not started yet");

        // Create a reference to token's contract
        IERC20 tokenContract = IERC20(tokenAddress);

        // Ensure there is enough tokens to recover
        require(tokenContract.balanceOf(address(this)) >= amount, "Not enough token to recover");

        // Transfer the recovered token amount to the sender (owner)
        tokenContract.safeTransfer(msg.sender, amount);
    }

    /**
     * @notice Computes the reference weight of the lockdrop pool, which is compared to
     * weight of a locker in eligibleRewardsOf() to dermine to determine the amount of
     * LDY rewards that locker is eligible to.
     * @dev For capped lockdrop pools, this function returns the maximum theoretical weight.
     * This design allows for a  linear distribution of LDY rewards relative to the amount
     * locked and average lock duration. It's also especially useful for displaying a
     * predictable a non-volatile LDY allocation on the lockdrop UI.
     * @return The total or max weight of the lockdrop pool.
     */
    function refWeight() public view returns (uint256) {
        // If the lockdrop pool is capped, return maximum pool weight
        if (lockedHardCap != -1) return uint256(lockedHardCap) * maxLockDuration;
        // Else, return current total pool weight
        else return totalWeight;
    }

    /**
     * @notice Compute the total amount of LDY rewards that a given account is eligible to.
     * @dev Note: This function neither considers vesting nor already claimed rewards.
     * @param account The account to compute the eligible rewards of.
     * @return The total amount of LDY rewards that the account is eligible to.
     */
    function eligibleRewardsOf(address account) public view returns (uint256) {
        // Compute account's lock weight
        uint256 lockerWeight = accountsLocks[account].amount * accountsLocks[account].duration;

        // Compute amount of LDY that this locker is eligible to
        return (maxDistributedLDY * lockerWeight) / refWeight();
    }

    /**
     * @notice Allows locking a specified amount of underlying tokens for a given duration.
     * By locking, an account became eligible to a portion of the distributed LDY rewards.
     * @dev This function proxies LToken.deposit()
     * @dev Lockers can extend their lock duration by calling this function again with a
     * greater duration and 0 as amount.
     * @param amount Amount of underlying tokens to lock.
     * @param duration Duration of the lock (in months).
     */
    function lock(uint256 amount, uint8 duration) external whenNotPaused {
        // Ensure Deposit phase has not ended yet
        require(!hasDepositPhaseEnded, "Deposit phase has ended");

        // Ensure lock duration is in valid range
        require(
            duration >= minLockDuration && duration <= maxLockDuration,
            "Lock duration out-of-bound"
        );

        // Remove previous locker's weight from total weight
        totalWeight -= accountsLocks[msg.sender].amount * accountsLocks[msg.sender].duration;

        // Increase account's locked amount
        accountsLocks[msg.sender].amount += uint240(amount);

        // Increase total locked amount accordingly
        totalLocked += amount;

        // Use existing lock duration if greater than the new one
        uint8 existingDuration = accountsLocks[msg.sender].duration;
        uint8 appliedDuration = existingDuration > duration ? existingDuration : duration;

        // Update account's lock duration
        accountsLocks[msg.sender].duration = appliedDuration;

        // Update account's lock end timestamp
        accountsLocks[msg.sender].lockEndTimestamp = uint40(
            block.timestamp + appliedDuration * ONE_MONTH_IN_SECONDS
        );

        // Add new locker's weight to total weight
        totalWeight += accountsLocks[msg.sender].amount * appliedDuration;

        // If amount is 0, skip deposit
        if (amount == 0) return;

        // Transfer underlyingToken from account to contract
        IERC20(address(lToken.underlying())).safeTransferFrom(msg.sender, address(this), amount);

        // Deposit USDC in the L-Token contract
        lToken.deposit(amount);
    }

    /**
     * @notice Allows the caller to instaneously unlock its locked amount of underlying
     * tokens.
     * @dev In order to save some gas and time to users, frontends should propose this
     * function to users only when it has been verified that it will not revert. They
     * should propose the requestUnlock() function otherwise.
     */
    function instantUnlock() external safeUnlock whenNotPaused {
        // Retrieve underlying tokens from the L-Token contract
        uint256 unlockedAmount = accountsLocks[msg.sender].amount;
        lToken.instantWithdrawal(unlockedAmount);

        // Transfer underlying tokens back to caller
        IERC20(address(lToken.underlying())).safeTransfer(msg.sender, unlockedAmount);
    }

    /**
     * @notice Allows the call to request for the unlocking of its locked amount of
     * underlying tokens. The request will be automatically processed later.
     * @dev The sender must attach 0.003 ETH to pre-pay the future processing gas fees
     * paid by the withdrawer wallet.
     */
    function requestUnlock() external payable safeUnlock whenNotPaused {
        // Put account in the unlock requests queue
        unlockRequests.push(msg.sender);

        // Request underlying tokens to the L-Token contract
        uint256 unlockedAmount = accountsLocks[msg.sender].amount;
        lToken.requestWithdrawal{value: msg.value}(unlockedAmount);
    }

    /**
     * @notice Processes queued unlock requests until there is else no more requests,
     * else not enough underlying tokens to continue.
     */
    function processUnlockRequests() external onlyOwner {
        // Ensure the Claim phase has started
        require(hasClaimPhaseStarted, "Claim phase has not started yet");

        // Store the current request ID to process
        uint256 processedId = unlockRequestsCursor;

        // Loop over remaining requests
        while (processedId < unlockRequests.length) {
            // Prevent OOG by stopping request processing if there is not enough gas left
            // to continue the loop and properly end the function call.
            if (gasleft() < 45000) break;

            // Retrieve the request account
            address unlockAccount = unlockRequests[unlockRequestsCursor];

            // Retrieve the unlocked amount
            uint256 unlockAmount = accountsLocks[unlockAccount].amount;

            // If the request has already been processed, skip it
            if (unlockAccount != address(0)) {
                // If the contract doesn't hold enough underlying tokens to process the request, stop here
                if (lToken.underlying().balanceOf(address(this)) < unlockAmount) break;

                // Delete the request
                delete unlockRequests[unlockRequestsCursor];

                // Transfer underlying back to account
                IERC20(address(lToken.underlying())).safeTransfer(unlockAccount, unlockAmount);
            }

            // Increment processed request ID
            processedId++;
        }

        // Write back the cursor in storage
        unlockRequestsCursor = processedId;
    }

    /**
     * @notice Computes the amount of LDY rewards available to claim for a given account.
     * @dev This function considers vesting and already claimed rewards.
     * @param account The account to compute the available rewards of.
     * @return The amount of LDY rewards available to claim.
     */
    function availableToClaim(address account) public view returns (uint256) {
        // Compute total amount of rewards allocated to this locker
        uint256 totalEligibleRewards = eligibleRewardsOf(account);

        // Compute elapsed months since claim phase started
        // Note: Numbers are scaled by 3 decimals to retain precision
        uint256 elapsedTimeS3 = (block.timestamp - claimPhaseStartTimestamp) * 10 ** 3;
        uint256 ONE_MONTH_IN_SECONDS_S3 = ONE_MONTH_IN_SECONDS * 10 ** 3;
        uint256 elapsedMonthsS3 = (elapsedTimeS3 * 10 ** 3) / ONE_MONTH_IN_SECONDS_S3;

        // Compute portion total rewards that have are released (vesting)
        uint256 vestingDurationS3 = uint256(vestingDuration) * 10 ** 3;
        uint256 totalAvailableToClaim = (totalEligibleRewards * elapsedMonthsS3) /
            vestingDurationS3;

        // If claimed rewards are slightly greater than total available to claim, return unclaimed rewards
        // This prevent claiming being blocked by precision loss
        if (accountsLocks[msg.sender].claimedRewards > totalAvailableToClaim) {
            return totalEligibleRewards - accountsLocks[msg.sender].claimedRewards;
        }

        // Else return net claimable (available minus already claimed)
        return totalAvailableToClaim - accountsLocks[msg.sender].claimedRewards;
    }

    /// @notice Allows the caller to claim its available LDY rewards.
    function claimRewards() external whenNotPaused {
        // Ensure Claim phase has started
        require(hasClaimPhaseStarted, "Claim phase has not started yet");

        // Compute claimable LDY rewards
        uint256 claimableLDY = availableToClaim(msg.sender);

        // Increase account claimed amount accordingly
        accountsLocks[msg.sender].claimedRewards += uint216(claimableLDY);

        // Transfer rewards to account
        ldyToken.safeTransfer(msg.sender, claimableLDY);
    }
}
