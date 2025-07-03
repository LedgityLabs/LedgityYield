// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {IERC721} from "@hashgraph/system-contracts-forking/contracts/IERC721.sol";
import {console} from "hardhat/console.sol";

contract CallNFT {
    function getTokenName(address tokenAddress) external view returns (string memory) {
        return IERC721(tokenAddress).name();
    }

    function invokeTransferFrom(address tokenAddress, address to, uint256 serialId) external {
        // You can use `console.log` as usual
        // https://hardhat.org/tutorial/debugging-with-hardhat-network#solidity--console.log
        console.log("Transferring from %s to %s %s tokens", msg.sender, to, serialId);
        address owner = IERC721(tokenAddress).ownerOf(serialId);
        IERC721(tokenAddress).transferFrom(owner, to, serialId);
    }
}
