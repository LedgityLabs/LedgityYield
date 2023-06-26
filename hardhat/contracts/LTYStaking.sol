// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./abstracts/InvestUpgradeable.sol";
import "./abstracts/RestrictedUpgradeable.sol";
import "./abstracts/RecoverUpgradeable.sol";

/**
 * @title LToken
 * @author Lila Rest (lila@ledgity.com)
 * @notice
 * @dev For more details see "LTYStaking" section of whitepaper.
 * Note that InvestmentUpgradeable.AccountInfos.virtualBalance (uint88) allows storing up
 * to 309,485,009 $LTY which is far enough because it represents ~1/9 of the max supply and
 * the amount of accumulated rewards is very unlikely to exceed 1/9 of the max supply.
 * @custom:security-contact security@ledgity.com
 */
contract LTYStaking is
    Initializable,
    PausableUpgradeable,
    Ownable2StepUpgradeable,
    UUPSUpgradeable,
    RestrictedUpgradeable,
    InvestUpgradeable,
    RecoverUpgradeable
{
    /// @dev Holds the amount staked per account
    mapping(address => uint256) public stakeOf;

    /// @dev Holds amount of $LTY to be elligible to staking tier
    uint256[] public tiers;

    /// @dev Holds the total amount staked
    uint256 public totalStaked;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Pausable_init();
        __Ownable2Step_init();
        __UUPSUpgradeable_init();
        __Invest_init(address(0));
    }

    /**
     * @dev Implements a bunch of parent contract functions reserved to owner
     * See UUPSUpgradeable and PausableUpgradeable for more details about those.
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function setBlacklist(address _contract) external onlyOwner {
        _setBlacklist(_contract);
    }

    function setAPR(uint16 aprUD3) public override onlyOwner {
        super.setAPR(aprUD3);
    }

    /**
     * @dev A bunch states setters.
     */

    function setInvested(address tokenAddress) external onlyOwner {
        _setInvested(tokenAddress);
    }

    function setTier(uint256 tierIndex, uint256 amountUD18) public onlyOwner {
        tiers[tierIndex] = amountUD18;
    }

    /**
     * @dev Override of RecoverUpgradeable.recoverERC20() that ensures:
     * - the caller is the owner
     * - the token recovered token is not the invested token
     * @inheritdoc RecoverUpgradeable
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
        return stakeOf[account];
    }

    /**
     * @dev External implementation of the InvestmentUpgradeable._rewardsOf() allowing
     * off-chain actors to easily compute unclaimed rewards of an account.
     * @param account The account to check the rewards of
     * @return The amount of unclaimed rewards of the account
     */
    function rewardsOf(address account) external view returns (uint256) {
        return _rewardsOf(account, false);
    }

    /**
     * @dev Return whether an account is eligible to a given staking tier.
     * @param tierIndex The tier number (not its index in the array)
     * @param account The account to check the eligibility of
     */
    function isEligibleTo(uint256 tierIndex, address account) public view returns (bool) {
        return tiers[tierIndex - 1] >= stakeOf[account];
    }

    /**
     * @dev Allows staking a given amount of $LTY tokens.
     * @param amount The amount of $LTY tokens to stake
     */
    function stake(uint256 amount) external whenNotPaused notBlacklisted(_msgSender()) {
        // Ensure the account has enough $LTY tokens to stake
        require(invested().balanceOf(_msgSender()) >= amount, "Insufficient balance");

        // Reset its investment period
        _resetInvestmentPeriodOf(_msgSender(), false);

        // Update the amount staked by the account and the total amount staked
        stakeOf[_msgSender()] += amount;
        totalStaked += amount;

        // Transfer staked $LTY tokens to the contract
        invested().approve(_msgSender(), amount);
        invested().transferFrom(_msgSender(), address(this), amount);
    }

    /**
     * @dev Allows unstaking (withdrawing) a given amount of $LTY tokens.
     * @param amount The amount of $LTY tokens to stake
     */
    function unstake(uint256 amount) external whenNotPaused notBlacklisted(_msgSender()) {
        // Ensure the account has enough $LTY tokens to unstake
        require(stakeOf[_msgSender()] >= amount, "Insufficient balance");

        // Reset its investment period
        _resetInvestmentPeriodOf(_msgSender(), false);

        // Update the amount staked by the account and the total amount staked
        stakeOf[_msgSender()] -= amount;
        totalStaked -= amount;

        // Transfer withdrawn $LTY tokens to the account
        invested().transfer(_msgSender(), amount);
    }
}