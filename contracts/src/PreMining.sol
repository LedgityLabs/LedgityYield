// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {LToken} from "./LToken.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title PreMining
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com

 * @notice PreMining pool contract, allowing accounts to lock underlying tokens in a 
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
 * - the Recovery phase cannot start before 3 months after the end of rewards vesting,
 * - the Recovery phase cannot start before 3 months after the maximum lock end.
 * 
 * Finally, note that this contract proxies main L-Token contract's functions:
 * - lock() --> deposit()
 * - instantUnlock() --> instantWithdrawal()
 * - requestUnlock() --> requestWithdrawal()
 * This design enables users to interact with the PreMining contract in a similar fashion
 * to the L-Token contract.
 * 
 * @dev Definitions:
 * - Locker: An account that has locked underlying tokens in the pool.
 * 
 * @custom:security-contact security@ledgity.com
 */
contract PreMining is Ownable2Step, Pausable {
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

    /// @notice Holds the amount of LDY to be distributed to lockers.
    uint256 public immutable maxDistributedLDY;

    /// @notice Holds the maximum total amount of L-Tokens that can be locked.
    uint256 public immutable lockedHardCap;

    /// @notice Holds the minimum possible lock duration (in months).
    uint8 public immutable minLockDuration;

    /// @notice Holds the maximum possible lock duration (in months).
    uint8 public immutable maxLockDuration;

    /// @notice Holds the duration of LDY rewards vesting (in months).
    uint8 public immutable vestingDuration;

    /// @notice Holds a reference to the locked L-Token contract.
    LToken public immutable lToken;

    /// @notice Holds a reference to the L-Token underlying stablecoin.
    IERC20 public immutable underlyingToken;

    /// @notice Holds the max pool weight.
    uint256 public immutable maxWeight;

    /// @notice Holds a reference to the LDY token contract.
    IERC20 public ldyToken;

    /// @notice Holds lockers' participations informations.
    mapping(address => AccountLock) public accountsLocks;

    /// @notice Holds the total amount of locked underlying tokens.
    uint256 public totalLocked;

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

    /// @notice Emitted to inform about a new lock/deposit.
    event Lock(address indexed account, uint256 amount, uint8 duration);

    /// @notice Top-level checks and code shared by both unlock functions.
    modifier safeUnlock() {
        // Ensure that the account's lock has ended
        require(accountsLocks[msg.sender].lockEndTimestamp <= block.timestamp, "L68");

        // Ensure the account hasn't already unlocked its tokens
        require(!accountsLocks[msg.sender].hasUnlocked, "L69");

        // Ensure the account has something to unlock
        require(accountsLocks[msg.sender].amount > 0, "L70");

        // Indicate that account has unlocked its tokens
        accountsLocks[msg.sender].hasUnlocked = true;
        _;
    }

    /**
     * @notice This constructor function etches the lockdrop terms in immutable states.
     * Ensuring that those terms cannot be modified after deployment.
     * @param lTokenAddress_ Address of the L-Token contract to use.
     * @param maxDistributedLDY_ Amount of LDY to be distributed to lockers.
     * @param lockedHardCap_ Maximum total amount of L-Tokens that can be locked.
     * @param minLockDuration_ Minimum possible lock duration (in months).
     * @param maxLockDuration_ Maximum possible lock duration (in months).
     * @param vestingDuration_ Duration of LDY rewards vesting (in months).
     */
    constructor(
        address lTokenAddress_,
        uint256 maxDistributedLDY_,
        uint256 lockedHardCap_,
        uint8 minLockDuration_,
        uint8 maxLockDuration_,
        uint8 vestingDuration_
    ) {
        // Ensure minLockDuration is at least 1 month
        require(minLockDuration_ >= 1, "L72");

        // Ensure minLockDuration is not greater than maxLockDuration
        require(minLockDuration_ <= maxLockDuration_, "L73");

        // Set immutable states
        lToken = LToken(lTokenAddress_);
        underlyingToken = IERC20(address(lToken.underlying()));
        lockedHardCap = lockedHardCap_;
        maxDistributedLDY = maxDistributedLDY_;
        minLockDuration = minLockDuration_;
        maxLockDuration = maxLockDuration_;
        vestingDuration = vestingDuration_;
        maxWeight = lockedHardCap * uint256(maxLockDuration);
    }

    /**
     * @notice Public implementation of Pausable's pausing and unpausing functions, but
     * restricted to contract's owner.
     */
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
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
        require(!hasClaimPhaseStarted, "L74");

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
        // Ensure Claim phase has not already started
        require(!hasClaimPhaseStarted, "L76");

        // Ensure that LDY token address is available
        require(address(ldyToken) != address(0), "L77");

        // Set Claim phase as started and store the start timestamp
        hasClaimPhaseStarted = true;
        claimPhaseStartTimestamp = block.timestamp;
    }

    /**
     * @notice Opens the Recovery phase. After calling this function, the contract owner
     * will be able to recover remaining ERC20 tokens on the contract.
     * Note that this won't close the Claim phase and lockers will still be able to claim
     * their LDY rewards.
     */
    function startRecoveryPhase() external onlyOwner {
        // Ensure Claim phase has started
        require(hasClaimPhaseStarted, "L79");

        // Compute some durations in seconds
        uint256 threeMonthsInSecond = 3 * 30 days;
        uint256 vestingInSecond = uint256(vestingDuration) * 30 days;
        uint256 maxLockInSecond = uint256(maxLockDuration) * 30 days;

        // Compute timestamp of vesting end + 3 months
        uint256 afterVestingTimestamp = claimPhaseStartTimestamp +
            vestingInSecond +
            threeMonthsInSecond;

        // Ensure we are at least 3 months after the end of reward vesting
        // This prevents owner from recovering LDY before lockers can claim their rewards
        require(block.timestamp >= afterVestingTimestamp, "L80");

        // Compute end of maximum lock + 3 months
        // Note that claimPhaseStartTimestamp is used for simplicity even if it can exist a time
        // span between Deposit and Claim phases.
        uint256 afterMaxLockTimestamp = claimPhaseStartTimestamp +
            maxLockInSecond +
            threeMonthsInSecond;

        // Ensure we are at least 3 months after the maximum lock end
        // This prevents owner from recovering underlying tokens before lockers can unlock those
        require(block.timestamp >= afterMaxLockTimestamp, "L81");

        // Set recovery phase as started
        hasRecoveryPhaseStarted = true;
    }

    /**
     * @notice Recovers a specified amount of a given token address. Will revert if
     * recovery phase has not started yet or if the contract doesn't hold enough tokens.
     * @param tokenAddress The address of the token to recover.
     * @param amount The amount of token to recover.
     */
    function recoverERC20(address tokenAddress, uint256 amount) external onlyOwner {
        // Ensure recovery phase has started
        require(hasRecoveryPhaseStarted, "L82");

        // Create a reference to token's contract
        IERC20 tokenContract = IERC20(tokenAddress);

        // Ensure there is enough tokens to recover
        require(tokenContract.balanceOf(address(this)) >= amount, "L83");

        // Transfer the recovered token amount to the sender (owner)
        tokenContract.safeTransfer(msg.sender, amount);
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
        if (maxWeight == 0) return 0;
        else return (maxDistributedLDY * lockerWeight) / maxWeight;
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
        require(!hasDepositPhaseEnded, "L84");

        // Ensure account hasn't already unlocked a past lock
        require(!accountsLocks[msg.sender].hasUnlocked, "L71");

        // Ensure lock duration is in valid range
        require(duration >= minLockDuration && duration <= maxLockDuration, "L85");

        // Ensure it won't exceed the hardcap
        require(totalLocked + amount <= uint256(lockedHardCap), "L86");

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
            block.timestamp + uint40(appliedDuration) * 30 days
        );

        // Emit a Lock event
        emit Lock(msg.sender, amount, appliedDuration);

        // If amount is 0, skip deposit
        if (amount == 0) return;

        // Transfer underlyingToken from account to contract
        underlyingToken.safeTransferFrom(msg.sender, address(this), amount);

        // Deposit USDC in the L-Token contract
        underlyingToken.safeApprove(address(lToken), amount);
        lToken.deposit(amount);
    }

    /**
     * @notice Allows the caller to instaneously unlock its locked amount of underlying
     * tokens.
     * @dev In order to save some gas and time to users, frontends should propose this
     * function to users only when it has been verified that it will not revert. They
     * should propose the requestUnlock() function otherwise.
     */
    function instantUnlock() external whenNotPaused safeUnlock {
        // Retrieve underlying tokens from the L-Token contract
        uint256 unlockedAmount = accountsLocks[msg.sender].amount;
        lToken.instantWithdrawal(unlockedAmount);

        // Transfer underlying tokens back to caller
        underlyingToken.safeTransfer(msg.sender, unlockedAmount);
    }

    /**
     * @notice Allows the call to request for the unlocking of its locked amount of
     * underlying tokens. The request will be automatically processed later.
     * @dev The sender must attach 0.003 ETH to pre-pay the future processing gas fees
     * paid by the withdrawer wallet.
     */
    function requestUnlock() external payable whenNotPaused safeUnlock {
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
        // Store the current request ID to process
        uint256 processedId = unlockRequestsCursor;

        // Loop over remaining requests
        while (processedId < unlockRequests.length) {
            // Prevent OOG by stopping request processing if there is not enough gas left
            // to continue the loop and properly end the function call.
            if (gasleft() < 45000) break;

            // Retrieve the request account
            address unlockAccount = unlockRequests[processedId];

            // Retrieve the unlocked amount
            uint256 unlockAmount = accountsLocks[unlockAccount].amount;

            // If the request has already been processed, skip it
            if (unlockAccount != address(0)) {
                // If the contract doesn't hold enough underlying tokens to process the request, stop here
                if (underlyingToken.balanceOf(address(this)) < unlockAmount) break;

                // Delete the request
                delete unlockRequests[processedId];

                // Transfer underlying back to account
                underlyingToken.safeTransfer(unlockAccount, unlockAmount);
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

        // Compute vesting duration in seconds
        uint256 vestingInSeconds = uint256(vestingDuration) * 30 days;

        // Compute elapsed months since claim phase started, and cap it to vesting duration
        uint256 elapsedTime = block.timestamp - claimPhaseStartTimestamp;
        if (elapsedTime > vestingInSeconds) elapsedTime = vestingInSeconds;

        // Compute total available to claim (proportionally to elapsed time)
        uint256 totalAvailableToClaim = (totalEligibleRewards * elapsedTime) / vestingInSeconds;

        // Else return net claimable (available minus already claimed)
        return totalAvailableToClaim - accountsLocks[account].claimedRewards;
    }

    /// @notice Allows the caller to claim its available LDY rewards.
    function claimRewards() external whenNotPaused {
        // Ensure Claim phase has started
        require(hasClaimPhaseStarted, "L87");

        // Compute claimable LDY rewards
        uint256 claimableLDY = availableToClaim(msg.sender);

        // Increase account claimed amount accordingly
        accountsLocks[msg.sender].claimedRewards += uint216(claimableLDY);

        // Transfer rewards to account
        ldyToken.safeTransfer(msg.sender, claimableLDY);
    }
}
