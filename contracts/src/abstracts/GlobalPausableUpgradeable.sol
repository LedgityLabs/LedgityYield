// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {GlobalPause} from "../GlobalPause.sol";

/**
 * @title GlobalPausableUpgradeable
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com
 *
 * @notice Derived contracts will inherit pause state from the specified GlobalPause
 * contract (see GlobalPause.sol). This design facilitates centralized management of
 * pause state for all the Ledgity Yield contracts.
 *
 * @dev Note: The _globalPause state must be set at initialization-time and for evident
 * security reasons cannot be changed afterwards.
 *
 * @dev For further details, see "GlobalPausableUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract GlobalPausableUpgradeable is PausableUpgradeable {
    /**
     * @notice The GlobalPause contract the pause state will be inherited from.
     * @dev This state is private so derived contracts cannot change its value.
     */
    GlobalPause private _globalPause;

    /**
     * @notice Initializer functions of the contract. They replace the constructor()
     * function in the context of upgradeable contracts.
     * @dev See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
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
     * @notice Retrieves the address of GlobalPause contract.
     * @return The address of the GlobalPause contract
     */
    function globalPause() public view returns (address) {
        return address(_globalPause);
    }

    /**
     * @notice Override of PausableUpgradeable.pause() that retrieves the pause state
     * from the GlobalPause contract instead.
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
