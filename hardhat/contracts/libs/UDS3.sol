// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title UDS3
 * @author Lila Rest (lila@ledgity.com)
 * @notice This library provides utilities to perform precise calculation on unsigned decimal
 * fixed point numbers.
 * @dev For more details see "UDS3" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
library UDS3 {
    /**
     * @dev Scales up a given number by 3 decimals
     * @param n The number to scale up
     * @return nUDS3 The number in UDS3 format
     */
    function scaleUp(uint256 n) internal pure returns (uint256 nUDS3) {
        return n * 10 ** 3;
    }

    /**
     * @dev Scales down a given UDS3 number by 3 decimals
     * @param nUDS3 The UDS3 number to scale down
     * @return n The unscaled number
     */
    function scaleDown(uint256 nUDS3) internal pure returns (uint256 n) {
        return nUDS3 / 10 ** 3;
    }
}
