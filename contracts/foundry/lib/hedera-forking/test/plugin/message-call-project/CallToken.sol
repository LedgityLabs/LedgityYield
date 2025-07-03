// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {IHederaTokenService} from "./IHederaTokenService.sol";

interface IERC20 {
    function decimals() external view returns (uint8);
}

contract CallToken {

    event TokenCreated(address indexed tokenAddress);

    event GetTokenInfo(string name, string symbol, string memo);

    function getTokenDecimals(address tokenAddress) external view returns (uint8) {
        return IERC20(tokenAddress).decimals();
    }

    function createToken(string memory name, string memory symbol, int32 decimals, address treasury) external payable {
        IHederaTokenService.HederaToken memory token;
        token.name = name;
        token.symbol = symbol;
        token.treasury = treasury;

        (int64 responseCode, address tokenAddress) = IHederaTokenService(address(0x167)).createFungibleToken{value: msg.value}(token, 10000, decimals);
        require(responseCode == 22, "HTS createToken failed");
        emit TokenCreated(tokenAddress);
    }

    function logTokenInfo(address tokenAddress) external {
        (int64 responseCode, IHederaTokenService.TokenInfo memory tokenInfo) = IHederaTokenService(address(0x167)).getTokenInfo(tokenAddress);
        require(responseCode == 22, "HTS getTokenInfo failed");
        emit GetTokenInfo(tokenInfo.token.name, tokenInfo.token.symbol, tokenInfo.token.memo);
    }
}
