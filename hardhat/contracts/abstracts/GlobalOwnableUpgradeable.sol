// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {GlobalOwner} from "../GlobalOwner.sol";

/**
 * @title GlobalOwnableUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice
 * @dev For more details see "GlobalOwnableUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract GlobalOwnableUpgradeable is OwnableUpgradeable {
    /// @dev The GlobalOwner contract.
    GlobalOwner public globalOwner;

    /**
     * @dev Initializer function
     * @param _globalOwner The globzl owner contract address.
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
     * @dev Set the pause contract address
     * @param contractAddress The address of the blacklist contract
     */
    function setGlobalOwner(address contractAddress) public onlyOwner {
        globalOwner = GlobalOwner(contractAddress);
    }

    function owner() public view override returns (address) {
        return globalOwner.owner();
    }

    function transferOwnership(address newOwner) public view override onlyOwner {
        newOwner; // Silence unused variable compiler warning
        revert("Can't change local owner. Change global owner instead.");
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
