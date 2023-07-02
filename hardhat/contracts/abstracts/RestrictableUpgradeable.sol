// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {OwnableUpgradeable} from "./OwnableUpgradeable.sol";
import {GlobalBlacklist} from "../GlobalBlacklist.sol";

/**
 * @title RestrictableUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice This abstract contract provides a modifier called `notBlacklisted` allowing
 * to restrict some functions based on whether an account is blacklisted by the defined
 * `Blacklist` contract.
 * @dev For more details see "RestrictableUpgradeable" section of whitepaper.
 * Children contracts must implement the _setBlacklistContract() function.
 * @custom:security-contact security@ledgity.com
 */
abstract contract RestrictableUpgradeable is OwnableUpgradeable {
    /// @dev The Blacklist contract.
    GlobalBlacklist public globalBlacklist;

    /**
     * @dev Throws if called by an account blacklisted by the Blacklist contract.
     * @param account The address to check against the Blacklist contract.
     */
    modifier notBlacklisted(address account) {
        require(globalBlacklist.isBlacklisted(account) == false, "Account blacklisted");
        _;
    }

    /**
     * @dev Set the blacklist contract address
     * @param contractAddress The address of the blacklist contract
     */
    function setGlobalBlacklist(address contractAddress) public onlyOwner {
        globalBlacklist = GlobalBlacklist(contractAddress);
    }

    /**
     * @dev Return whether a given account is blacklisted.
     * @param account The account to check
     */
    function isBlacklisted(address account) internal view returns (bool) {
        return globalBlacklist.isBlacklisted(account);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
