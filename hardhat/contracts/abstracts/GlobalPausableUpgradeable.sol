// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {GlobalOwnableUpgradeable} from "./GlobalOwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {GlobalPauser} from "../GlobalPauser.sol";

/**
 * @title GlobalPausableUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @dev This abstract contract allows inheriting children contracts to be paused and unpaused
 * following the pause state of the global Pause contract (see GlobalPause.sol).
 * For more details see "GlobalPausableUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract GlobalPausableUpgradeable is GlobalOwnableUpgradeable, PausableUpgradeable {
    /// @dev The GlobalPause contract.
    GlobalPauser public globalPauser;

    function __GlobalPausable_init(address _globalOwner) internal onlyInitializing {
        __GlobalOwnable_init(_globalOwner);
        __Pausable_init();
    }

    function __GlobalPausable_init_unchained() internal onlyInitializing {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Set the pause contract address
     * @param contractAddress The address of the blacklist contract
     */
    function setGlobalPauser(address contractAddress) public onlyOwner {
        globalPauser = GlobalPauser(contractAddress);
    }

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
