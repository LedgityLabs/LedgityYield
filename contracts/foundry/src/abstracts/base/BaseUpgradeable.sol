// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {GlobalPausableUpgradeable} from "../GlobalPausableUpgradeable.sol";
import {GlobalOwnableUpgradeable} from "../GlobalOwnableUpgradeable.sol";
import {GlobalRestrictableUpgradeable} from "../GlobalRestrictableUpgradeable.sol";
import {RecoverableUpgradeable} from "../RecoverableUpgradeable.sol";

/**
 * @title BaseUpgradeable
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com
 *
 * @notice This abstract contract acts as a base for numerous contracts in this codebase,
 * minimizing code repetition and enhancing readability and maintainability.
 *
 * @dev For further details, see "Base" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract BaseUpgradeable is
    Initializable,
    UUPSUpgradeable,
    GlobalOwnableUpgradeable,
    GlobalPausableUpgradeable,
    GlobalRestrictableUpgradeable,
    RecoverableUpgradeable
{
    /**
     * @notice Prevents implementation contract from being initialized as recommended by
     * OpenZeppelin.
     * @dev See: https://docs.openzeppelin.com/contracts/4.x/api/proxy#Initializable-_disableInitializers--
     * @custom:oz-upgrades-unsafe-allow constructor
     */
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initializer functions of the contract. They replace the constructor()
     * function in the context of upgradeable contracts.
     * @dev See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param globalOwner_ The address of the GlobalOwner contract.
     * @param globalPause_ The address of the GlobalPause contract.
     * @param globalBlacklist_ The address of the GlobalBlacklist contract.
     */
    function __Base_init(
        address globalOwner_,
        address globalPause_,
        address globalBlacklist_
    ) internal onlyInitializing {
        __UUPSUpgradeable_init();
        __GlobalOwnable_init(globalOwner_);
        __Pausable_init();
        __GlobalPausable_init_unchained(globalPause_);
        __GlobalRestrictable_init_unchained(globalBlacklist_);
        __Recoverable_init_unchained();
    }

    function __Base_init_unchained() internal onlyInitializing {}

    /**
     * @notice Override of UUPSUpgradeable._authorizeUpgrade() function restricted to
     * global owner. It is called by the proxy contract during an upgrade.
     * @param newImplementation The address of the new implementation contract.
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
