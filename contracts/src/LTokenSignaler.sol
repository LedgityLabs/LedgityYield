// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {GlobalOwnableUpgradeable} from "./abstracts/GlobalOwnableUpgradeable.sol";
import {LToken} from "./LToken.sol";

/**
 * @title LTokenSignaler
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com
 *
 * @notice Used to inform subgraph from the existence of a new L-Token contract. Once
 * signaled, a L-Token it will start being indexed.
 *
 * @dev Signal are ignored by the subgraph if the L-Token is already known by it.
 *
 * @custom:security-contact security@ledgity.com
 */
contract LTokenSignaler is Initializable, UUPSUpgradeable, GlobalOwnableUpgradeable {
    /**
     * @notice Emitted to inform subgraph of the existence of a new L-Token contract.
     * @param lTokenAddress The address of the L-Token contract to signal.
     */
    event LTokenSignalEvent(address indexed lTokenAddress);

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
     * @notice Initializer function of the contract. It replaces the constructor()
     * function in the context of upgradeable contracts.
     * @dev See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     */
    function initialize(address globalOwner_) public initializer {
        __GlobalOwnable_init(globalOwner_);
        __UUPSUpgradeable_init();
    }

    /**
     * @notice Override of UUPSUpgradeable._authorizeUpgrade() function restricted to
     * global owner. It is called by the proxy contract during an upgrade.
     * @param newImplementation The address of the new implementation contract.
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /**
     * @notice Signals a LToken contract to the TheGraph subgraph of the current chain.
     * @param lTokenAddress The address of the LToken contract to signal.
     */
    function signalLToken(address lTokenAddress) external onlyOwner {
        // Signal the LToken contract
        emit LTokenSignalEvent(lTokenAddress);
    }
}
