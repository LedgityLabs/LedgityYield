// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {GlobalRestrictableUpgradeable} from "../GlobalRestrictableUpgradeable.sol";
import {GlobalPausableUpgradeable} from "../GlobalPausableUpgradeable.sol";
import {GlobalOwnableUpgradeable} from "../GlobalOwnableUpgradeable.sol";
import {RecoverableUpgradeable} from "../RecoverableUpgradeable.sol";

/**
 * @title BaseUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice This abstract contract serves as a base for many contract in this code base. It
 * reduces code repetition, makes code more readable and so maintainable.
 * @dev For further details, see "Base contracts" section of whitepaper.
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
     * @dev Prevents implementation contract from being initialized as recommended by
     * OpenZeppelin.
     * See: https://docs.openzeppelin.com/contracts/4.x/api/proxy#Initializable-_disableInitializers--
     * @custom:oz-upgrades-unsafe-allow constructor
     */
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializer functions of the contract. They replace the constructor() function
     * in context of upgradeable contracts.
     * See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param _globalOwner The address of the GlobalOwner contract
     * @param _globalPauser The address of the GlobalPauser contract
     * @param _globalBlacklist The address of the GlobalBlacklist contract
     */
    function __Base_init(
        address _globalOwner,
        address _globalPauser,
        address _globalBlacklist
    ) internal onlyInitializing {
        __UUPSUpgradeable_init();
        __Pausable_init();
        __GlobalOwnable_init(_globalOwner);
        __GlobalPausable_init_unchained(_globalPauser);
        __GlobalRestricted_init_unchained(_globalBlacklist);
    }

    function __Base_init_unchained() internal onlyInitializing {}

    /**
     * Override of UUPSUpgradeable._authorizeUpgrade() function restricted to the global
     * owner. Note that this function is called by the proxy contract when upgrading.
     * @param newImplementation The address of the new implementation contract
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
