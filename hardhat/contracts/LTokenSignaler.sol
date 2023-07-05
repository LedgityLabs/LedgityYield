// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "./abstracts/OwnableUpgradeable.sol";
import {LToken} from "./LToken.sol";

/**
 * @title LTokenSignaler
 * @author Lila Rest (lila@ledgity.com)
 * @dev This contract is used to signal a LToken contract to the TheGraph subgraph
 * of the current network. If the L-Token contract wasn't already indexed, it will
 * start being indexed after this signal. Else, the signal will be ignored.
 */
contract LTokenSignaler is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    event LTokenSignalEvent(address indexed lTokenAddress);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _globalOwner) public initializer {
        __Ownable_init(_globalOwner);
        __UUPSUpgradeable_init();
    }

    /**
     * @inheritdoc UUPSUpgradeable
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function signalLToken(address lTokenAddress) external onlyOwner {
        // Ensure this is a LToken contract
        LToken lToken = LToken(lTokenAddress);
        lToken; // Silent unused variable compiler warning

        // Signal the LToken contract
        emit LTokenSignalEvent(lTokenAddress);
    }
}
