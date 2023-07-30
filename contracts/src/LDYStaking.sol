// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./abstracts/base/BaseUpgradeable.sol";
import {InvestUpgradeable} from "./abstracts/InvestUpgradeable.sol";
import {UDS3} from "./libs/UDS3.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title LDYStaking
 * @author Lila Rest (lila@ledgity.com)
 * @notice This contract powers the $LDY staking mechanism of the Ledgity DeFi app. It allows
 * users to stake their $LDY tokens and earn rewards in $LDY.
 * @dev
 * Security note: InvestmentUpgradeable.AccountInfos.virtualBalance (uint88) allows storing up
 * to 309,485,009 $LDY which is far enough because it represents more than 3 times $LDY max
 * supply.
 *
 * Design note: This contract considers that tiers start at 1, 0 is considered as not elligible
 * to any tier.
 *
 * For further details, see "LDYStaking" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 * @custom:oz-upgrades-unsafe-allow external-library-linking
 */
contract LDYStaking is BaseUpgradeable, InvestUpgradeable {
    /**
     * @dev Represents the stake infos of an account.
     * @param amount The amount of staked $LDY
     * @param lockEnd The timestamp at which the stake is unlocked
     */
    struct AccountStake {
        uint216 amount; // Allows storing more $LDY than its max supply
        uint40 lockEnd; // Allows datetime up to 20/02/36812
    }

    /// @dev Holds the time (in seconds) during which staked $LDY are locked
    uint40 public stakeLockDuration;

    /// @dev Holds the fees rate (in UDS3 format) taxed when account requests prematurate unlock
    uint32 public unlockFeesRateUD3;

    /// @dev Holds a mapping of account's stake infos
    mapping(address => AccountStake) private accountsStakes;

    /// @dev Holds amount of $LDY to be elligible to staking tier
    uint256[] private _tiers;

    /// @dev Holds the total amount staked
    uint256 public totalStaked;

    /// @dev Holds the total amount of $LDY to be distributed as rewards
    uint256 public rewardsReserve;

    /**
     * @dev Emitted to inform listeners of a change in the total amount staked
     * @param newTotalStaked The new total amount staked
     */
    event TotalStakedUpdateEvent(uint256 newTotalStaked);

    /**
     * @dev Replaces the constructor() function in context of an upgradeable contract.
     * See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param globalOwner_ The address of the GlobalOwner contract
     * @param globalPause_ The address of the GlobalPauser contract
     * @param globalBlacklist_ The address of the GlobalBlacklist contract
     * @param ldyTokenAddress The address of the $LDY token
     */
    function initialize(
        address globalOwner_,
        address globalPause_,
        address globalBlacklist_,
        address ldyTokenAddress
    ) public initializer {
        __Base_init(globalOwner_, globalPause_, globalBlacklist_);
        __Invest_init_unchained(ldyTokenAddress);

        // Initialize stakeLockDuration to 90 days
        stakeLockDuration = 90 days;
    }

    /**
     * @dev Override of RecoverableUpgradeable.recoverERC20() that prevents recovered
     * token from being the invested $LDY token.
     * @inheritdoc RecoverableUpgradeable
     */
    function recoverERC20(address tokenAddress, uint256 amount) public override onlyOwner {
        // Ensure the token is not the $LDY token
        require(tokenAddress != address(invested()), "L21");
        super.recoverERC20(tokenAddress, amount);
    }

    /**
     * @dev Allows recovering $LDY tokenS accidentally sent to this contract. To prevent
     * owner from draining funds from the contract, this function only allows recovering
     * "recoverable" underlying tokens, i.e., tokens that have neither been deposited
     * through `stake()` function nor through the `fund()` one.
     */
    function recoverLDY() public onlyOwner {
        // Compute the amount of $LDY that can be recovered by taking the difference between
        // the contract's $LDY balance and the total amount staked plus the rewards reserve
        uint256 recoverableAmount = invested().balanceOf(address(this)) - (totalStaked + rewardsReserve);

        // Revert if there are no recoverable $LDY
        require(recoverableAmount > 0, "L22");

        // Else transfer the recoverable $LDY to the owner
        super.recoverERC20(address(invested()), recoverableAmount);
    }

    /**
     * @dev Implementation of InvestUpgradeable._investmentOf(). Required by parent contract
     * to calculate rewards of an account. In this contract the investment of an account is
     * equal to the amount of $LDY staked by the given account.
     * @inheritdoc InvestUpgradeable
     */
    function _investmentOf(address account) internal view override returns (uint256) {
        return stakeOf(account);
    }

    /**
     * @dev External implementation of InvestmentUpgradeable._rewardsOf() allowing
     * off-chain apps to easily compute the unclaimed rewards of a given account.
     * @param account The account to check the rewards of
     * @return The amount of unclaimed rewards of the account
     */
    function rewardsOf(address account) external view returns (uint256) {
        return _rewardsOf(account, false);
    }

    /**
     * @dev Getter that reads and return the amount staked by a given account.
     * @param account The account to check the stake of
     */
    function stakeOf(address account) public view returns (uint256) {
        return accountsStakes[account].amount;
    }

    /**
     * @dev Getter that reads and return the lock end of a given account.
     * @param account The account to check the lock end of
     */
    function lockEndOf(address account) public view returns (uint40) {
        return accountsStakes[account].lockEnd;
    }

    /**
     * @dev Computes the increases of tier lock time for a given account extending
     * its staking by a given "added amount".
     * @param account The account to check the lock end increase of
     * @param addedAmount The amount of $LDY added by the account to its stake
     */
    function _getLockDurationIncrease(
        address account,
        uint256 addedAmount
    ) internal view returns (uint40 lockEndIncrease) {
        // Retrieve account's stake infos
        AccountStake memory accountStake = accountsStakes[account];

        // If the account has no previous stake, return a full lock duration
        if (accountStake.amount == 0) return stakeLockDuration;

        // Else, calculate the stake growth
        uint256 addedAmountUDS3 = UDS3.scaleUp(addedAmount);
        uint256 accountStakeUDS3 = UDS3.scaleUp(accountStake.amount);
        uint256 growthRateUDS3 = (addedAmountUDS3 * _toUDS3(100)) / accountStakeUDS3;

        // Then, calculate lock end increase proportionnally to amount growth
        uint256 stakeLockDurationUDS3 = _toUDS3(stakeLockDuration);
        uint256 lockEndIncreaseUDS3;
        // - If the lockEndIncrease is going to overflow (this helps supporting bigger growth rates)
        if (growthRateUDS3 > type(uint256).max / stakeLockDurationUDS3) {
            // Set it to the maximum possible value
            lockEndIncreaseUDS3 = type(uint256).max;
        }
        // - Else, compute the lockEndIncrease
        else {
            lockEndIncreaseUDS3 = (stakeLockDurationUDS3 * growthRateUDS3) / _toUDS3(100);
        }
        lockEndIncrease = uint40(_fromUDS3(lockEndIncreaseUDS3));

        // Compute the remaining lock duration of the account
        // If the lock end is in the past, the remaining lock duration is 0
        uint40 remainingLockDuration = accountStake.lockEnd < uint40(block.timestamp)
            ? 0
            : accountStake.lockEnd - uint40(block.timestamp);

        // Ensure the new lock duration will not exceed the stakeLockDuration
        lockEndIncrease = lockEndIncrease + remainingLockDuration > stakeLockDuration
            ? stakeLockDuration - remainingLockDuration
            : lockEndIncrease;
    }

    /**
     * @dev Computes the new lock end timestamp of a given account and amount added to
     * its stake.
     * @param account The account to check the new lock end of
     * @param addedAmount The amount of $LDY added by the account to its stake
     */
    function getNewLockEndFor(address account, uint216 addedAmount) public view returns (uint40) {
        return uint40(block.timestamp) + _getLockDurationIncrease(account, addedAmount);
    }

    /**
     * @dev Setter for the prematurate unlock fees/tax rate. Restricted to owner.
     * @param _unlockFeesRateUD3  The new unlock fees rate in UD3 format
     */
    function setUnlockFeesRate(uint32 _unlockFeesRateUD3) public onlyOwner {
        unlockFeesRateUD3 = _unlockFeesRateUD3;
    }

    /**
     * @dev Setter for the stake lock duration. Restricted to owner.
     * @param _stakeLockDuration  The new stake lock duration
     */
    function setStakeLockDuration(uint40 _stakeLockDuration) public onlyOwner {
        stakeLockDuration = _stakeLockDuration;
    }

    /**
     * @dev Allows the owner to fill the $LDY rewards reserve (used to reward stakers).
     * @param amount The amount of $LDY to deposit
     */
    function fuel(uint256 amount) external onlyOwner {
        // Ensure the amount is not 0
        require(amount > 0, "L23");

        // Transfer $LDY tokens from the caller to this contract
        invested().transferFrom(_msgSender(), address(this), amount);
        rewardsReserve += amount;
    }

    /**
     * @dev Prematurely unlocks the stake of the caller against a fee rate defined
     * by unlockFeesRateUD3. The entire fee is burned as a way to support the token's
     * ecosystem.
     */
    function unlock() external whenNotPaused notBlacklisted(_msgSender()) {
        // Retrieve account stake infos
        AccountStake memory accountStake = accountsStakes[_msgSender()];

        // Ensure the account has a locked stake
        require(accountStake.lockEnd > block.timestamp, "L24");

        // Unlock stake by setting lock time to now
        accountStake.lockEnd = uint40(block.timestamp);

        // Calculate unlock fees/tax
        uint256 amountUDS3 = UDS3.scaleUp(accountStake.amount);
        uint256 unlockFeesRateUDS3 = _toDecimals(unlockFeesRateUD3); // UD3 to UDS3
        uint256 feesUDS3 = (amountUDS3 * unlockFeesRateUDS3) / _toUDS3(100);
        uint256 fees = UDS3.scaleDown(feesUDS3);

        // Remove fees from the account stake
        accountStake.amount -= uint216(fees);

        // Write the new account stake infos
        accountsStakes[_msgSender()] = accountStake;

        // Burn unlock fees
        ERC20Burnable(address(invested())).burn(fees);
    }

    /**
     * @dev Allows a user to stake a given amount of $LDY tokens.
     * @param amount The amount of $LDY tokens to stake
     */
    function stake(uint216 amount) public whenNotPaused notBlacklisted(_msgSender()) {
        // Ensure the amount is not 0
        require(amount > 0, "L25");

        // Ensure the account has enough $LDY tokens to stake
        require(invested().balanceOf(_msgSender()) >= amount, "L26");

        // Reset account's investment period
        _onInvestmentChange(_msgSender(), false);

        // Retrieve account stake infos
        AccountStake memory accountStake = accountsStakes[_msgSender()];

        // Update the amount staked by the account and the total amount staked
        accountStake.amount += amount;
        totalStaked += amount;

        // Inform listeners about the change in total staked amount
        emit TotalStakedUpdateEvent(totalStaked);

        // Update the end of the lock period
        accountStake.lockEnd = getNewLockEndFor(_msgSender(), amount);

        // Write the new account stake infos
        accountsStakes[_msgSender()] = accountStake;

        // Transfer staked $LDY tokens to the contract
        invested().transferFrom(_msgSender(), address(this), amount);
    }

    /**
     * @dev Allows a user to unstaking (withdraw) a given amount of $LDY tokens.
     * @param amount The amount of $LDY tokens to unstake
     */
    function unstake(uint216 amount) external whenNotPaused notBlacklisted(_msgSender()) {
        // Ensure the amount is not 0
        require(amount > 0, "L27");

        // Ensure the account has enough $LDY tokens to unstake
        require(stakeOf(_msgSender()) >= amount, "L28");

        // Retrieve account stake infos
        AccountStake memory accountStake = accountsStakes[_msgSender()];

        // Ensure the account is not in lock period
        require(accountStake.lockEnd <= block.timestamp, "L29");

        // Reset its investment period
        _onInvestmentChange(_msgSender(), false);

        // Update the amount staked by the account and the total amount staked
        accountStake.amount -= amount;
        totalStaked -= amount;

        // Inform listeners about the change in total staked amount
        emit TotalStakedUpdateEvent(totalStaked);

        // Write the new account stake infos
        accountsStakes[_msgSender()] = accountStake;

        // Transfer withdrawn $LDY tokens to the account
        invested().transfer(_msgSender(), amount);
    }

    /**
     * @dev Allows the caller to claim its currently unclaimed rewards.
     */
    function claim() public whenNotPaused notBlacklisted(_msgSender()) {
        // Reset account investment period. This will accumualte current unclaimed
        // rewards into the account's virtual balance.
        _onInvestmentChange(_msgSender(), false);

        // Retrieve and reset account's unclaimed rewards from virtual balance
        uint256 rewards = accountsInfos[_msgSender()].virtualBalance;

        // Ensure there are some rewards to claim
        require(rewards > 0, "L30");

        // Reset account's virtual balance
        accountsInfos[_msgSender()].virtualBalance = 0;

        // Ensure the contract has enough rewards to distribute
        require(rewardsReserve >= rewards, "L31");

        // Decreases the total amount of remaining rewards to distribute
        rewardsReserve -= rewards;

        // Transfer rewards to the account
        invested().transfer(_msgSender(), rewards);
    }

    /**
     * @dev Allows the caller to compound its currently unclaimed rewards to its stake.
     * Note that we don't update the lock end here, as it applies only to $LDY deposited
     * through the stake() function, not to rewards.
     */
    function compound() external whenNotPaused notBlacklisted(_msgSender()) {
        // Retrieve account stake infos
        AccountStake memory accountStake = accountsStakes[_msgSender()];

        // Reset account investment period. This will accumualte current unclaimed
        // rewards into the account's virtual balance.
        _onInvestmentChange(_msgSender(), false);

        // Retrieve and reset account's unclaimed rewards from virtual balance
        uint256 rewards = accountsInfos[_msgSender()].virtualBalance;

        // Ensure there are some rewards to claim
        require(rewards > 0, "L32");

        // Reset account's virtual balance
        accountsInfos[_msgSender()].virtualBalance = 0;

        // Ensure the contract has enough rewards to distribute
        require(rewardsReserve >= rewards, "L33");

        // Decreases the total amount of remaining rewards to distribute
        rewardsReserve -= rewards;

        // Update the amount staked by the account and the total amount staked
        accountStake.amount += uint216(rewards);
        totalStaked += rewards;

        // Inform listeners about the change in total staked amount
        emit TotalStakedUpdateEvent(totalStaked);

        // Write the new account stake infos
        accountsStakes[_msgSender()] = accountStake;
    }

    /**
     * @dev Sets the amount of $LDY tokens that must be staked to be elligible to a given
     * staking tier.
     * @param tier The tier number (not its index in the array)
     * @param amount The amount of $LDY tokens to stake to be elligible to the tier
     */
    function setTier(uint256 tier, uint256 amount) public onlyOwner {
        // Ensure the tier is > 0 (as it shouldn't be an index)
        require(tier > 0, "L34");

        // Retrieve tier index from tier number
        uint256 tierIndex = tier - 1;

        // Create missing tiers in the tiers array
        for (uint256 i = _tiers.length; i < tier; i++) {
            _tiers.push(0);
        }

        // Ensure tier amount is not greater than next tier one (if next tier exists)
        if (tier != _tiers.length) {
            require(amount <= _tiers[tierIndex + 1], "L35");
        }

        // Ensure tier amount is not lower than previous tier one (if previous tier exists)
        if (tier != 1) {
            require(amount >= _tiers[tierIndex - 1], "L36");
        }

        // Set the new tier value
        _tiers[tierIndex] = amount;
    }

    /**
     * @dev Returns the amount of $LDY tokens that must be staked to be elligible to a given
     * staking tier.
     * @param tier The tier number (not its index in the array)
     * @return The amount of $LDY tokens to stake to be elligible to the tier
     */
    function getTier(uint256 tier) public view returns (uint256) {
        // Ensure the tier is > 0 (as it shouldn't be an index)
        require(tier > 0, "L37");

        // Ensure the staking tier exists
        require(tier <= _tiers.length, "L38");

        // Return the tier value
        return _tiers[tier - 1];
    }

    /**
     * @dev Returns the staking a given account is ellible to.
     * @param account The account to check the tier of
     * @return tier The tier number (not its index in the array)
     */
    function tierOf(address account) public view returns (uint256 tier) {
        // Retrieve user stake
        uint256 stakedAmount = stakeOf(account);

        // If the account has no stake or is not elligible to first tier, return 0
        if (stakedAmount == 0 || _tiers.length == 0 || stakedAmount < getTier(1)) return 0;

        // Else tier is at least equal to 1
        tier = 1;

        // Finally increment tier until there is no more tier or the staked amount doesn't fit in next one
        while (tier + 1 <= _tiers.length && stakedAmount >= getTier(tier + 1)) tier++;
    }
}
