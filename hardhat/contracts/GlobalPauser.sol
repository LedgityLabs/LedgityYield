// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {GlobalOwnableUpgradeable} from "./abstracts/GlobalOwnableUpgradeable.sol";

contract GlobalPauser is Initializable, UUPSUpgradeable, GlobalOwnableUpgradeable, PausableUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _globalOwner) public initializer {
        __GlobalOwnable_init(_globalOwner);
        __Pausable_init();
        __UUPSUpgradeable_init();
    }

    /**
     * @dev Public implementation of PausableUpgradeable's pausing and unpausing functions
     * but restricted to the contract's owner.
     */
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @inheritdoc UUPSUpgradeable
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
