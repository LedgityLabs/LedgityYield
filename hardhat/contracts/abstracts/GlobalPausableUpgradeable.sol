// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {GlobalOwnableUpgradeable} from "./GlobalOwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {GlobalPauser} from "../GlobalPauser.sol";

/**
 * @title GlobalPausableUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice This abstract contract allows inheriting children contracts to be paused and unpaused
 * following the pause state of the global Pause contract (see GlobalPause.sol).
 * @dev Note that children inheriting contract must set the globalPauser at initialization
 * time. For obvious security reasons, the globalPauser can't be changed afterwards.
 * For further details, see "GlobalPausableUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract GlobalPausableUpgradeable is GlobalOwnableUpgradeable, PausableUpgradeable {
    /// @dev The GlobalPause contract.
    GlobalPauser public globalPauser;

    /**
     * @dev Initializer functions of the contract. They replace the constructor() function
     * in context of upgradeable contracts.
     * See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param _globalOwner The address of the GlobalOwner contract
     */
    function __GlobalPausable_init(
        address _globalOwner,
        address _globalPauser
    ) internal onlyInitializing {
        __GlobalOwnable_init(_globalOwner);
        __Pausable_init();
        __GlobalPausable_init_unchained(_globalPauser);
    }

    function __GlobalPausable_init_unchained(address _globalPauser) internal onlyInitializing {
        globalPauser = GlobalPauser(_globalPauser);
    }

    /**
     * @dev Override of PausableUpgradeable.paused() function that checks the pause status
     * on the GlobalPause contract instead of doing it locally.
     * @return Whether the contract is paused or not
     */
    function paused() public view virtual override returns (bool) {
        return globalPauser.paused();
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
