// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {OwnableUpgradeable as _OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {GlobalOwner} from "../GlobalOwner.sol";

/**
 * @title OwnableUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice
 * @dev For more details see "OwnableUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract OwnableUpgradeable is _OwnableUpgradeable {
    /// @dev The Pause contract.
    GlobalOwner public globalOwner;

    /**
     * @dev Set the pause contract address
     * @param contractAddress The address of the blacklist contract
     */
    function setGlobalOwner(address contractAddress) public onlyOwner {
        globalOwner = GlobalOwner(contractAddress);
    }

    function owner() public view override returns (address) {
        return globalOwner.owner();
    }

    function transferOwnership(address newOwner) public override onlyOwner {
        revert("Can't change local owner. Change global owner instead.");
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
