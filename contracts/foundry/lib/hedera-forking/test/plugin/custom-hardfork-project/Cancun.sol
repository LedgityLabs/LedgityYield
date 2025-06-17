// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

contract Cancun {
    function getBlobBaseFee() external view returns (uint256) {
        return block.blobbasefee;
    }
}
