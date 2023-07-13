// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {GlobalOwnableUpgradeable} from "./abstracts/GlobalOwnableUpgradeable.sol";

/**
 * @title GlobalPause
 * @author Lila Rest (lila@ledgity.com)
 * @notice This contract is used to maintain a pause state shared by all contracts of this
 * codebase. It is then read by all contracts that inherit from GlobalPausableUpgradeable 
 * abstract contract to restrict execution of some functions when this contract is not paused.
 * @dev For further details, see "GlobalPause" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
contract GlobalPause is Initializable, UUPSUpgradeable, GlobalOwnableUpgradeable, PausableUpgradeable {
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
     * @param globalOwner_ The address of the GlobalOwner contract
     */
    function initialize(address globalOwner_) public initializer {
        __GlobalOwnable_init(globalOwner_);
        __Pausable_init();
        __UUPSUpgradeable_init();
    }

    /**
     * @dev Override of UUPSUpgradeable._authorizeUpgrade() function restricted to the global
     * owner. Note that this function is called by the proxy contract while upgrading.
     * @param newImplementation The address of the new implementation contract
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /**
     * @dev Public implementation of PausableUpgradeable's pausing and unpausing functions
     * but restricted to contract's owner.
     */
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
