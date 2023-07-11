// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {GlobalOwnableUpgradeable} from "./GlobalOwnableUpgradeable.sol";
import {GlobalBlacklist} from "../GlobalBlacklist.sol";

/**
 * @title GlobalRestrictableUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice This abstract contract allows inheriting children contracts to be restricted to
 * addresses non-blacklisted by the GlobalBlacklist contract (see GlobalBlacklist.sol).
 * @dev Note that children inheriting contract must set the globalBlacklist at initialization
 * time. For obvious security reasons, the globalBlacklist can't be changed afterwards.
 * For further details, see "GlobalRestrictableUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract GlobalRestrictableUpgradeable is GlobalOwnableUpgradeable {
    /// @dev The GlobalBlacklist contract.
    GlobalBlacklist public globalBlacklist;

    /**
     * @dev Initializer functions of the contract. They replace the constructor() function
     * in context of upgradeable contracts.
     * See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param _globalOwner The address of the GlobalOwner contract
     */
    function __GlobalRestricted_init(
        address _globalOwner,
        address _globalBlacklist
    ) internal onlyInitializing {
        __GlobalOwnable_init(_globalOwner);
        __GlobalRestricted_init_unchained(_globalBlacklist);
    }

    function __GlobalRestricted_init_unchained(address _globalBlacklist) internal onlyInitializing {
        globalBlacklist = GlobalBlacklist(_globalBlacklist);
    }

    /**
     * @dev Modifier that reverts the wrapped function call if called by an account
     * blacklisted by the GlobalBlacklist contract.
     * @param account Address to check against the GlobalBlacklist contract.
     */
    modifier notBlacklisted(address account) {
        require(isBlacklisted(account) == false, "GlobalRestrictableUpgradeable: not permitted");
        _;
    }

    /**
     * @dev Tests against the GlobalBlacklist whether a given account is blacklisted.
     * @param account The account to check
     * @return (true/false) Whether the account is blacklisted
     */
    function isBlacklisted(address account) internal view returns (bool) {
        require(
            address(globalBlacklist) != address(0),
            "GlobalRestrictableUpgradeable: global blacklist not set"
        );
        return globalBlacklist.isBlacklisted(account);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
