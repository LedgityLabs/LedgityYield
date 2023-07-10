// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {RestrictableUpgradeable} from "../RestrictableUpgradeable.sol";
import {RecoverableUpgradeable} from "../RecoverableUpgradeable.sol";
import {PausableUpgradeable} from "../pausable/PausableUpgradeable.sol";
import {OwnableUpgradeable} from "../OwnableUpgradeable.sol";

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
    OwnableUpgradeable,
    PausableUpgradeable,
    RestrictableUpgradeable,
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
     * @dev Initializer function of the contract. It replaces the constructor() function
     * in context of upgradeable contracts.
     * See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     */
    function __Base_init(address _globalOwner) internal onlyInitializing {
        __UUPSUpgradeable_init();
        __Pausable_init();
        __Ownable_init(_globalOwner);
    }

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
