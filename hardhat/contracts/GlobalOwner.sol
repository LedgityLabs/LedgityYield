// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

/**
 * @title GlobalOwner
 * @author Lila Rest (lila@ledgity.com)
 * @notice This contract is used to maintain an owner account shared by all contracts of this
 * codebase. It is then read by all contracts that inherit from GlobalOwnableUpgradeable abstract
 * contract to restrict access to some functions to owner of this contract.
 * @dev For more details see "GlobalOwner" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
contract GlobalOwner is Initializable, UUPSUpgradeable, Ownable2StepUpgradeable {
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
     * @dev Replaces the constructor() function in context of an upgradeable contract.
     * See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     */
    function initialize() public initializer {
        __Ownable2Step_init();
        __UUPSUpgradeable_init();
    }

    /**
     * Override of UUPSUpgradeable._authorizeUpgrade() function restricted to the global
     * owner. Note that this function is called by the proxy contract while upgrading.
     * @param newImplementation The address of the new implementation contract
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
