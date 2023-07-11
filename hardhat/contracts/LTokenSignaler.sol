// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {GlobalOwnableUpgradeable} from "./abstracts/GlobalOwnableUpgradeable.sol";
import {LToken} from "./LToken.sol";

/**
 * @title LTokenSignaler
 * @author Lila Rest (lila@ledgity.com)
 * @dev This contract is used to signal a L-Token contract to the TheGraph subgraph
 * of the current chain. If the L-Token contract wasn't already indexed, it will
 * start being indexed after this signal. Else, the signal will be ignored.
 */
contract LTokenSignaler is Initializable, UUPSUpgradeable, GlobalOwnableUpgradeable {
    /**
     * @dev Signal event catched by TheGraph subgraph to discover and start indexing
     * a L-Token contract.
     * @param lTokenAddress The address of the L-Token contract to signal
     */
    event LTokenSignalEvent(address indexed lTokenAddress);

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
        __UUPSUpgradeable_init();
    }

    /**
     * @dev Override of UUPSUpgradeable._authorizeUpgrade() function restricted to the global
     * owner. Note that this function is called by the proxy contract while upgrading.
     * @param newImplementation The address of the new implementation contract
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /**
     * @dev Signals a LToken contract to the TheGraph subgraph of the current chain.
     * @param lTokenAddress The address of the LToken contract to signal
     */
    function signalLToken(address lTokenAddress) external onlyOwner {
        // Ensure this is a LToken contract
        LToken lToken = LToken(lTokenAddress);
        lToken; // Silent unused variable compiler warning

        // Signal the LToken contract
        emit LTokenSignalEvent(lTokenAddress);
    }
}
