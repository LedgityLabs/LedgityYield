// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface ITransfersListener {
    function onLTokenTransfer(address from, address to, uint256 amount) external;
}
