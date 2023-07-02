// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "./abstracts/OwnableUpgradeable.sol";

/**
 * @title GlobalBlacklist
 * @author Lila Rest (lila@ledgity.com)
 * @notice This contract provides a way to maintain a mapping of blacklisted accounts
 * on chain.
 * @dev For more details see "GlobalBlacklist" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
contract GlobalBlacklist is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    /**
     * @dev This mapping is made private and the getter function isBlacklisted() function is
     * used instead to read it. This helps saving gas in some scenario. See isBlacklisted()
     * documentation for more details.
     */
    mapping(address => bool) private _list;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    /**
     * @inheritdoc UUPSUpgradeable
     */
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
    function unBlacklist(address account) external onlyOwner {
        _list[account] = false;
    }

    /**
     * @dev Check if given account is blacklisted.
     * @param account The account to check
     * @return 'true' if the account is blacklisted, 'false' otherwise
     */
    function isBlacklisted(address account) external view returns (bool) {
        // Avoir reading chain storage if account is the zero address
        if (account == address(0)) return false;
        // Else return current blacklist status of account
        return _list[account];
    }
}
