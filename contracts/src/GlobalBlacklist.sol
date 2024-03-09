// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {GlobalOwnableUpgradeable} from "./abstracts/GlobalOwnableUpgradeable.sol";

/**
 * @title GlobalBlacklist
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com
 *
 * @notice Holds a global mapping of blacklisted accounts shared by all contracts of the
 * Ledgity Yield codebase.
 *
 * @dev Specifically, some contracts within the codebase inherit from the
 * GlobalRestrictableUpgradeable abstract contract. This provides them with modifiers
 * and getter functions to easily check against this global blacklist.
 *
 * @dev For further details, see "GlobalBlacklist" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
contract GlobalBlacklist is Initializable, UUPSUpgradeable, GlobalOwnableUpgradeable {
    /**
     * @notice Mapping of accounts to their blacklist status.
     * @dev This mapping is made private and isBlacklisted() should be used instead.This
     * helps saving gas in some scenario. See isBlacklisted() documentation for more details.
     */
    mapping(address => bool) private _list;

    /// @dev Emitted when `account` is blacklisted.
    event Blacklisted(address account);

    /// @dev Emitted when `account` is unblacklisted.
    event Unblacklisted(address account);

    /**
     * @notice Prevents implementation contract from being initialized as recommended by
     * OpenZeppelin.
     * @dev See: https://docs.openzeppelin.com/contracts/4.x/api/proxy#Initializable-_disableInitializers--
     * @custom:oz-upgrades-unsafe-allow constructor
     */
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initializer function of the contract. It replaces the constructor()
     * function in the context of upgradeable contracts.
     * @dev See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param globalOwner_ The address of the GlobalOwner contract.
     */
    function initialize(address globalOwner_) public initializer {
        __GlobalOwnable_init(globalOwner_);
        __UUPSUpgradeable_init();
    }

    /**
     * @notice Override of UUPSUpgradeable._authorizeUpgrade() function restricted to
     * global owner. It is called by the proxy contract during an upgrade.
     * @param newImplementation The address of the new implementation contract.
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /**
     * @notice Adds a given account to the blacklist.
     * @param account The account's address to be blacklisted.
     */
    function blacklist(address account) external onlyOwner {
        require(account != address(0), "L20");
        _list[account] = true;
        emit Blacklisted(account);
    }

    /**
     * @notice Removes a given account from the blacklist.
     * @param account The account's address to be un-blacklisted.
     */
    function unBlacklist(address account) external onlyOwner {
        _list[account] = false;
        emit Unblacklisted(account);
    }

    /**
     * @notice Checks whether a given account is blacklisted.
     * @param account Address of the account to check.
     * @return 'true' if the account is blacklisted, 'false' otherwise
     */
    function isBlacklisted(address account) external view returns (bool) {
        // Gas optimization: Avoid accessing storage if account is the zero address
        // (e.g, during a mint or a burn of tokens)
        if (account == address(0)) return false;

        // Else, return current account's blacklist status
        return _list[account];
    }
}
