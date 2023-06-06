// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./libs/APRCheckpoints.sol";
import "./Blacklist.sol";

/// @custom:security-contact security@ledgity.com
contract LTYStaking is
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    IERC20Upgradeable public ltyContract;
    Blacklist blacklistContract;

    uint256 apr;
    APRCheckpoints.Pack[] packedAPRCheckpoints;

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

    modifier notBlacklisted() {
        require(
            blacklistContract.isBlacklisted(msg.sender) == false,
            "Account blacklisted"
        );
        _;
    }

    function setLTYContract(address ltyAddress) external onlyOwner {
        ltyContract = IERC20Upgradeable(ltyAddress);
    }

    function setBlacklistContract(address _contract) public onlyOwner {
        blacklistContract = Blacklist(_contract);
    }

    function setAPR(uint256 _apr) external onlyOwner {
        apr = _apr;
    }

    function stake(uint256 amount) external whenNotPaused notBlacklisted {}
}
