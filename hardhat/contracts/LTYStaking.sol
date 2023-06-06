// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./libs/APRCheckpoints.sol";
import "./Blacklist.sol";
import "./abstracts/Blacklistable.sol";

/// @custom:security-contact security@ledgity.com
contract LTYStaking is
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    Blacklistable
{
    struct AccountInfos {
        APRCheckpoints.Reference depositCheckpointReference;
        uint40 depositTimestamp; // Allows representing datetime up to 20/02/36812
        uint88 unclaimedRewards; // Allows storing up to 309,485,009 $LTY which is far enough because it represents ~1/9 of the max supply.
    }

    IERC20Upgradeable public ltyContract;

    uint256 apr;

    APRCheckpoints.Pack[] packedAPRCheckpoints;
    mapping(address => AccountInfos) accountsInfos;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function setBlacklistContract(address _contract) public onlyOwner {
        _setBlacklistContract(_contract);
    }

    function setLTYContract(address ltyAddress) external onlyOwner {
        ltyContract = IERC20Upgradeable(ltyAddress);
    }

    function setAPR(uint16 aprUD3) public onlyOwner {
        APRCheckpoints.setAPR(packedAPRCheckpoints, aprUD3);
    }

    function stake(uint256 amount) external whenNotPaused notBlacklisted {}
}
