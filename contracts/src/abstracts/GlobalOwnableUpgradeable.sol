// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {GlobalOwner} from "../GlobalOwner.sol";

/**
 * @title GlobalOwnableUpgradeable
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com
 *
 * @notice Derived contracts will inherit ownership from the specified GlobalOwner
 * contract (see GlobalOwner.sol). This design facilitates centralized management
 * of ownership for all the Ledgity Yield contracts.
 *
 * @dev Note: The _globalOwner state must be set at initialization-time and for evident
 * security reasons cannot be changed afterwards.
 *
 * @dev For further details, see "GlobalOwnableUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract GlobalOwnableUpgradeable is Initializable, OwnableUpgradeable {
    /**
     * @notice The GlobalOwner contract the ownership will be inherited from.
     * @dev This state is private so derived contracts cannot change its value.
     */
    GlobalOwner private _globalOwner;

    /**
     * @notice Initializer functions of the contract. They replace the constructor()
     * function in the context of upgradeable contracts.
     * @dev See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param globalOwner_ The address of the GlobalOwner contract.
     */
    function __GlobalOwnable_init(address globalOwner_) internal onlyInitializing {
        __GlobalOwnable_init_unchained(globalOwner_);
        // Note: __Ownable_init() doesn't have to be called as the overriden owner()
        // function no longer rely on the _owner state. Since __Ownable_init() only sets
        // the initial _owner value, calling it would have no effect.
    }

    function __GlobalOwnable_init_unchained(address globalOwner_) internal onlyInitializing {
        _globalOwner = GlobalOwner(globalOwner_);
    }

    /**
     * @notice Retrieves the address of GlobalOwner contract.
     * @return The address of the GlobalOwner contract.
     */
    function globalOwner() public view returns (address) {
        return address(_globalOwner);
    }

    /**
     * @notice Override of OwnableUpgradeable.owner() that retrieves the owner's address
     * from the GlobalOwner contract instead.
     * @return The address of the owner
     */
    function owner() public view override returns (address) {
        return _globalOwner.owner();
    }

    /**
     * @notice Override of OwnableUpgradeable.transferOwnership() that always reverts.
     * Ownership is managed by the GlobalOwner contract and must be modified there.
     */
    function transferOwnership(address newOwner) public view override onlyOwner {
        newOwner; // Silence unused variable compiler warning
        revert("L8");
    }

    /**
     * @notice Override of OwnableUpgradeable.renounceOwnership() that always reverts.
     * Ownership is managed by the GlobalOwner contract and must be modified there.
     */
    function renounceOwnership() public view override onlyOwner {
        revert("L65");
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
