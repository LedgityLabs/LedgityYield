// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./libs/APRCheckpoints.sol";
import "./abstracts/InvestUpgradeable.sol";
import "./abstracts/RestrictedUpgradeable.sol";
import "./abstracts/RecoverUpgradeable.sol";

/**
 * Note that AccountInfos.unclaimedBalance (uint88) allows storing up to 309,485,009 $LTY which is far enough because it represents ~1/9 of the max supply.
 */
/// @custom:security-contact security@ledgity.com
contract LTYStaking is
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    RestrictedUpgradeable,
    InvestUpgradeable,
    RecoverUpgradeable
{
    mapping(address => uint256) public stakeOf;
    uint256[] public tiers; // Amount of $LTY to be staked to be elligible to each tier

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        __Invest_init(IERC20Upgradeable(address(0)));
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function setBlacklistContract(address _contract) external onlyOwner {
        _setBlacklistContract(_contract);
    }

    function setInvested(address tokenAddress) external onlyOwner {
        _setInvested(tokenAddress);
    }

    function recoverERC20(address tokenAddress, uint256 amount) external onlyOwner {
        // Ensure the token is not the staked token
        require(tokenAddress != address(invested()), "Use recoverStaked() instead");
        _recoverERC20(tokenAddress, amount);
    }

    function setAPR(uint16 aprUD3) public onlyOwner {
        APRCheckpoints.setAPR(packedAPRCheckpoints, aprUD3);
    }

    function investmentOf(address account) internal view override returns (uint256) {
        return stakeOf[account];
    }

    function setTier(uint256 tierIndex, uint256 amountUD18) public onlyOwner {
        tiers[tierIndex] = amountUD18;
    }

    function isEligibleTo(uint256 tierIndex, address account) public view returns (bool) {
        return tiers[tierIndex] >= stakeOf[account];
    }

    function stake(uint256 amount) external whenNotPaused notBlacklisted {}
}
