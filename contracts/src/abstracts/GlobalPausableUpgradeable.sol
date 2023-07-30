// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {GlobalPause} from "../GlobalPause.sol";

/**
 * @title GlobalPausableUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice This abstract contract allows inheriting children contracts to be paused and unpaused
 * following the pause state of the global Pause contract (see GlobalPause.sol).
 * @dev Note that children inheriting contract must set the globalPause at initialization
 * time. For obvious security reasons, the globalPause can't be changed afterwards.
 * For further details, see "GlobalPausableUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract GlobalPausableUpgradeable is PausableUpgradeable {
    /**
     * @dev The GlobalPause contract.
     * This state is private so children contracts cannot change its value.
     */
    GlobalPause private _globalPause;

    /**
     * @dev Initializer functions of the contract. They replace the constructor() function
     * in context of upgradeable contracts.
     * See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param globalPause_ The address of the GlobalPause contract
     */
    function __GlobalPausable_init(address globalPause_) internal onlyInitializing {
        __Pausable_init();
        __GlobalPausable_init_unchained(globalPause_);
    }

    function __GlobalPausable_init_unchained(address globalPause_) internal onlyInitializing {
        _globalPause = GlobalPause(globalPause_);
    }

    /**
     * @dev Getter for the GlobalPause contract.
     * @return The address of the GlobalPause contract
     */
    function globalPause() public view returns (address) {
        return address(_globalPause);
    }

    /**
     * @dev Override of PausableUpgradeable.paused() function that checks the pause status
     * on the GlobalPause contract instead of doing it locally.
     * @return Whether the contract is paused or not
     */
    function paused() public view virtual override returns (bool) {
        return _globalPause.paused();
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
