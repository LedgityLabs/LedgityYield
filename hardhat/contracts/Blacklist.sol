// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/// @custom:security-contact security@ledgity.com
contract Blacklist is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    mapping(address => bool) private _list;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /**
     * @dev Set given account as blacklisted.
     * @param account The account to blacklist
     */
    function blacklist(address account) external onlyOwner {
        _list[account] = true;
    }

    /**
     * @dev Remove given account from blacklist.
     * @param account The account to unblacklist
     */
    function unBacklist(address account) external onlyOwner {
        _list[account] = false;
    }

    /**
     * @dev Check if given account is blacklisted.
     * @param account The account to check
     * @return 'true' if the account is blacklisted, 'false' otherwise
     */
    function isBlacklisted(address account) external view returns (bool) {
        return _list[account];
    }
}
