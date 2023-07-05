// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./abstracts/base/BaseUpgradeable.sol";
import {InvestUpgradeable} from "./abstracts/InvestUpgradeable.sol";
import {UDS3} from "./libs/UDS3.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title LTYStaking
 * @author Lila Rest (lila@ledgity.com)
 * @notice
 * @dev For more details see "LTYStaking" section of whitepaper.
 * Note that InvestmentUpgradeable.AccountInfos.virtualBalance (uint88) allows storing up
 * to 309,485,009 $LTY which is far enough because it represents ~1/9 of the max supply and
 * the amount of accumulated rewards is very unlikely to exceed 1/9 of the max supply.
 * Note2: This contract considers that tiers start at 1, 0 is considered as not elligible
 * to any tier.
 * @custom:security-contact security@ledgity.com
 */
contract LTYStaking is BaseUpgradeable, InvestUpgradeable {
    uint40 public stakeLockDuration;
    uint32 public unlockFeesRateUD3;

    struct AccountStake {
        uint216 amount;
        uint40 lockEnd;
    }

    mapping(address => AccountStake) public accountsStakes;

    /// @dev Holds amount of $LTY to be elligible to staking tier
    uint256[] private _tiers;

    /// @dev Holds the total amount staked
    uint256 public totalStaked;

    event TotalStakedUpdateEvent(uint256 newTotalStaked);

    function initialize(address _globalOwner) public initializer {
        __Base_init(_globalOwner);
        __Invest_init(address(0));

        stakeLockDuration = 90 days;
    }

    /**
     * @dev Override of RecoverableUpgradeable.recoverERC20() that ensures:
     * - the caller is the owner
     * - the token recovered token is not the invested token
     * @inheritdoc RecoverableUpgradeable
     */
    function recoverERC20(address tokenAddress, uint256 amount) public override onlyOwner {
        // Ensure the token is not the $LTY token
        require(tokenAddress != address(invested()), "Use recoverLTY() instead");
        super.recoverERC20(tokenAddress, amount);
    }

    /**
     * @dev Allows recovering $LTY token accidentally sent to contract. To prevent
     * owner from draining funds from the contract, this function only allows recovering
     * "recoverable" underlying tokens, i.e., tokens that have not been deposited through
     * `stake()` function.
     */
    function recoverLTY() public onlyOwner {
        // Compute the amount of $LTY that can be recovered by making the difference
        // between the current balance of the contract and the total amount staked
        uint256 recoverable = invested().balanceOf(address(this)) - totalStaked;

        // If there are some unusable funds, recover them, else revert
        if (recoverable > 0) super.recoverERC20(address(invested()), recoverable);
        else revert("There is nothing to recover");
    }

    /**
     * @dev Implementation of InvestUpgradeable._investmentOf(). Required by parent contract
     * to calculate rewards of an account. In this contract the investment of an account is
     * equal to the amount of $LTY it staked.
     * @inheritdoc InvestUpgradeable
     */
    function _investmentOf(address account) internal view override returns (uint256) {
        return stakeOf(account);
    }

    /**
     * @dev External implementation of the InvestmentUpgradeable._rewardsOf() allowing
     * off-chain actors to easily retrieve unclaimed rewards of an account.
     * @param account The account to check the rewards of
     * @return The amount of unclaimed rewards of the account
     */
    function rewardsOf(address account) external view returns (uint256) {
        return _rewardsOf(account, false);
    }

    function stakeOf(address account) public view returns (uint256) {
        return accountsStakes[account].amount;
    }

    function lockEndOf(address account) public view returns (uint40) {
        return accountsStakes[account].lockEnd;
    }

    function getLockEndIncrease(address account, uint256 addedAmount) public view returns (uint40) {
        AccountStake memory accountStake = accountsStakes[account];
        if (accountStake.amount == 0) return 0;

        uint256 growthRateUDS3 = (UDS3.scaleUp(addedAmount) * toUDS3(1)) /
            UDS3.scaleUp(accountStake.amount);
        uint256 growthUDS3 = (toUDS3(stakeLockDuration) * growthRateUDS3) / toUDS3(100);
        uint40 lockEndIncrease = uint40(fromUDS3(growthUDS3));
        uint40 remainingLockDuration = accountStake.lockEnd < uint40(block.timestamp)
            ? 0
            : accountStake.lockEnd - uint40(block.timestamp);
        return
            (lockEndIncrease + remainingLockDuration) > stakeLockDuration
                ? stakeLockDuration - remainingLockDuration
                : lockEndIncrease;
    }

    function _getNewLockEnd(address account, uint216 addedAmount) internal view returns (uint40) {
        AccountStake memory accountStake = accountsStakes[account];
        // If the account has no previous stake, add full stakeLockDuration
        if (accountStake.amount == 0) return uint40(block.timestamp) + stakeLockDuration;
        // Or if the account increases a previous stake, add a proportional duration
        else return accountStake.lockEnd + getLockEndIncrease(account, addedAmount);
    }

    function setUnlockFeesRate(uint32 _unlockFeesRateUD3) public onlyOwner {
        unlockFeesRateUD3 = _unlockFeesRateUD3;
    }

    function setStakeLockDuration(uint40 _stakeLockDuration) public onlyOwner {
        stakeLockDuration = _stakeLockDuration;
    }

    function unlock() external {
        // Retrieve account stake
        AccountStake memory accountStake = accountsStakes[_msgSender()];

        // Ensure the account has a locked stake
        require(accountStake.lockEnd > block.timestamp, "Nothing to unlock");

        // Set unlock time to now
        accountStake.lockEnd = uint40(block.timestamp);

        // Calculate unlock fees and update account stake accordingly
        uint256 fees = (accountStake.amount * ud3ToDecimals(unlockFeesRateUD3)) / toDecimals(100);
        accountStake.amount -= uint216(fees);

        // Write the new account stake
        accountsStakes[_msgSender()] = accountStake;

        // Burn unlock fees
        ERC20Burnable(address(invested())).burn(fees);
    }

    /**
     * @dev Allows staking a given amount of $LTY tokens.
     * @param amount The amount of $LTY tokens to stake
     */
    function stake(uint216 amount) public whenNotPaused notBlacklisted(_msgSender()) {
        // Ensure the account has enough $LTY tokens to stake
        require(invested().balanceOf(_msgSender()) >= amount, "Insufficient balance");

        // Retrieve account stake
        AccountStake memory accountStake = accountsStakes[_msgSender()];

        // Reset its investment period
        _resetInvestmentPeriodOf(_msgSender(), false);

        // Update the amount staked by the account and the total amount staked
        accountStake.amount += amount;
        totalStaked += amount;
        emit TotalStakedUpdateEvent(totalStaked);

        // Update the end of the lock period
        accountStake.lockEnd = _getNewLockEnd(_msgSender(), amount);

        // Write the new account stake
        accountsStakes[_msgSender()] = accountStake;

        // Transfer staked $LTY tokens to the contract
        invested().transferFrom(_msgSender(), address(this), amount);
    }

    /**
     * @dev Allows unstaking (withdrawing) a given amount of $LTY tokens.
     * @param amount The amount of $LTY tokens to stake
     */
    function unstake(uint216 amount) external whenNotPaused notBlacklisted(_msgSender()) {
        // Ensure the account has enough $LTY tokens to unstake
        require(stakeOf(_msgSender()) >= amount, "Insufficient balance");

        // Retrieve account stake
        AccountStake memory accountStake = accountsStakes[_msgSender()];

        // Ensure the account is not in lock period
        require(accountStake.lockEnd <= block.timestamp, "Stake is still in lock period");

        // Reset its investment period
        _resetInvestmentPeriodOf(_msgSender(), false);

        // Update the amount staked by the account and the total amount staked
        accountStake.amount -= amount;
        totalStaked -= amount;
        emit TotalStakedUpdateEvent(totalStaked);

        // Write the new account stake
        accountsStakes[_msgSender()] = accountStake;

        // Transfer withdrawn $LTY tokens to the account
        invested().transfer(_msgSender(), amount);
    }

    /**
     * @dev
     */
    function claim() public whenNotPaused notBlacklisted(_msgSender()) {
        // Reset account investment period. This will compound current rewards into virtual balance.
        _resetInvestmentPeriodOf(_msgSender(), false);

        // Retrieve and reset account's unclaimed rewards
        uint256 rewards = accountsInfos[_msgSender()].virtualBalance;
        accountsInfos[_msgSender()].virtualBalance = 0;

        // Transfer rewards to the account
        invested().transfer(_msgSender(), rewards);
    }

    /**
     * @dev
     * Note that we don't update the lock end here, as it applies only to intially
     * deposited funds.
     */
    function compound() external whenNotPaused notBlacklisted(_msgSender()) {
        // Retrieve account stake
        AccountStake memory accountStake = accountsStakes[_msgSender()];

        // Reset its investment period
        _resetInvestmentPeriodOf(_msgSender(), false);

        // Retrieve and reset account's unclaimed rewards
        uint256 rewards = accountsInfos[_msgSender()].virtualBalance;
        accountsInfos[_msgSender()].virtualBalance = 0;

        // Update the amount staked by the account and the total amount staked
        accountStake.amount += uint216(rewards);
        totalStaked += rewards;
        emit TotalStakedUpdateEvent(totalStaked);

        // Write the new account stake
        accountsStakes[_msgSender()] = accountStake;
    }

    /**
     * @dev
     */
    function setTier(uint256 tier, uint256 amountUD18) public onlyOwner {
        require(tier > 0, "Tier must be > 0");

        // Create missing tiers
        for (uint256 i = _tiers.length; i < tier; i++) {
            _tiers.push(0);
        }

        // Set the tier
        _tiers[tier - 1] = amountUD18;
    }

    /**
     * @dev
     * @param tier The tier number (not its index in the array)
     */
    function getTier(uint256 tier) public view returns (uint256) {
        require(tier > 0, "Tier must be > 0");
        if (_tiers.length < tier) return 0;
        else return _tiers[tier - 1];
    }

    /**
     * @dev
     * @param account The account to check the tier of
     */
    function tierOf(address account) public view returns (uint256 tier) {
        if (stakeOf(account) == 0) return 0;
        while (tier < _tiers.length && stakeOf(account) >= _tiers[tier]) tier++;
    }
}
