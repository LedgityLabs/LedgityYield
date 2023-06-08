// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

library UDS3 {
    /**
     * @dev Converts a given UDx number (x = decimals()) into UDS3
     * @param nUDx The UDx number to convert
     * @return nUDS3 The number in UDS3 format
     */
    function scaleUp(uint256 nUDx) internal pure returns (uint256 nUDS3) {
        return nUDx * 10 ** 3;
    }

    /**
     * @dev Converts a given UDS3 number into UDx number (x = decimals())
     * @param nUDS3 The UDS3 number to convert
     * @return nUDx The number in UDx format
     */
    function scaleDown(uint256 nUDS3) internal pure returns (uint256 nUDx) {
        return nUDS3 / 10 ** 3;
    }

    /**
     * @dev Converts a given unisgned integer into USD3 number
     * @param n The unsigned integer to convert
     * @return nUDS3 The number in UDS3 format
     */
    function to(uint256 n, uint256 decimals) internal pure returns (uint256 nUDS3) {
        return scaleUp(n * 10 ** decimals);
    }
}
