// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {GlobalOwner} from "../GlobalOwner.sol";

/**
 * @title GlobalOwnableUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice This abstract contract allows inheriting children contracts to be owned by the
 * owner of the GlobalOwner contract (see GlobalOwner.sol).
 * @dev Note that children inheriting contract must set the globalOwner at initialization
 * time. For obvious security reasons, the globalOwner can't be changed afterwards.
 * For further details, see "GlobalOwnableUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract GlobalOwnableUpgradeable is OwnableUpgradeable {
    /// @dev The GlobalOwner contract.
    GlobalOwner public globalOwner;

    /**
     * @dev Initializer functions of the contract. They replace the constructor() function
     * in context of upgradeable contracts.
     * See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param _globalOwner The address of the GlobalOwner contract
     */
    function __GlobalOwnable_init(address _globalOwner) internal onlyInitializing {
        __GlobalOwnable_init_unchained(_globalOwner);
        // Note that __Ownable_init() doesn't have to be called as the overriden
        // owner() function don't rely anymore on _owner variable. So as __Ownable_init()
        // only set the initial owner, calling it would have no effect.
    }

    function __GlobalOwnable_init_unchained(address _globalOwner) internal onlyInitializing {
        globalOwner = GlobalOwner(_globalOwner);
    }

    /**
     * @dev Override of OwnableUpgradeable.owner() function that reads the owner address
     * from the GlobalOwner contract instead of doing it locally.
     * @return Whether the contract is paused or not
     */
    function owner() public view override returns (address) {
        require(address(globalOwner) != address(0), "GlobalOwnableUpgradeable: global owner not set");
        return globalOwner.owner();
    }

    /**
     * @dev Override of OwnableUpgradeable.transferOwnership() function that prevents any
     * ownership transfer. Ownership is managed by the GlobalOwner contract.
     * (see GlobalOwner.sol).
     */
    function transferOwnership(address newOwner) public view override onlyOwner {
        newOwner; // Silence unused variable compiler warning
        revert("GlobalOwnableUpgradeable: change global owner instead");
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
