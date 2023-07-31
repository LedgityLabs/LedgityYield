// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface ITransfersListener {
    function onLTokenTransfers(address from, address to, uint256 amount) external;
}
