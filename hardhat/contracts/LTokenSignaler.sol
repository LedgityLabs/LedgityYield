// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./abstracts/OwnableUpgradeable.sol";
import {LToken} from "./LToken.sol";

/**
 * @title LTokenSignaler
 * @author Lila Rest (lila@ledgity.com)
 * @dev This contract is used to signal a LToken contract to the TheGraph subgraph
 * of the current network. If the L-Token contract wasn't already indexed, it will
 * start being indexed after this signal. Else, the signal will be ignored.
 */
contract LTokenSignaler is OwnableUpgradeable {
    event LTokenSignalEvent(address indexed lTokenAddress);

    function signalLToken(address lTokenAddress) external onlyOwner {
        // Ensure this is a LToken contract
        LToken lToken = LToken(lTokenAddress);
        lToken; // Silent unused variable compiler warning

        // Signal the LToken contract
        emit LTokenSignalEvent(lTokenAddress);
    }
}
