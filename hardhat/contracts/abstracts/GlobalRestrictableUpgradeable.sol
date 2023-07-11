// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {GlobalOwnableUpgradeable} from "./GlobalOwnableUpgradeable.sol";
import {GlobalBlacklist} from "../GlobalBlacklist.sol";

/**
 * @title GlobalRestrictableUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice This abstract contract provides a modifier called `notBlacklisted` allowing
 * to restrict some functions based on whether an account is blacklisted by the defined
 * `Blacklist` contract.
 * @dev For further details, see "GlobalRestrictableUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract GlobalRestrictableUpgradeable is GlobalOwnableUpgradeable {
    /// @dev The GlobalBlacklist contract.
    GlobalBlacklist public globalBlacklist;

    function __GlobalRestricted_init(address _globalOwner) internal onlyInitializing {
        __GlobalOwnable_init(_globalOwner);
    }

    function __GlobalRestricted_init_unchained() internal onlyInitializing {}

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
