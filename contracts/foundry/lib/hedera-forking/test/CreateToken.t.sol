// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {TestSetup} from "./lib/TestSetup.sol";
import {HTS_ADDRESS} from "../contracts/HtsSystemContract.sol";
import {IHederaTokenService} from "../contracts/IHederaTokenService.sol";
import {HederaResponseCodes} from "../contracts/HederaResponseCodes.sol";
import {IERC20} from "../contracts/IERC20.sol";
import {IERC721} from "../contracts/IERC721.sol";

contract CreateTokenTest is Test, TestSetup {

    function setUp() external {
        setUpMockStorageForNonFork();
    }

    function test_createFungibleToken_should_revert_if_value_is_not_provided() external {
        IHederaTokenService.HederaToken memory token;
        vm.expectRevert(bytes("HTS: must send HBARs"));
        IHederaTokenService(HTS_ADDRESS).createFungibleToken(token, 10000, 4);
    }

    function test_createFungibleToken_should_revert_if_name_is_not_provided() external {
        IHederaTokenService.HederaToken memory token;
        vm.expectRevert(bytes("HTS: name cannot be empty"));
        IHederaTokenService(HTS_ADDRESS).createFungibleToken{value: 1000}(token, 10000, 4);
    }

    function test_createFungibleToken_should_revert_if_symbol_is_not_provided() external {
        IHederaTokenService.HederaToken memory token;
        token.name = "Token name";
        vm.expectRevert(bytes("HTS: symbol cannot be empty"));
        IHederaTokenService(HTS_ADDRESS).createFungibleToken{value: 1000}(token, 10000, 4);
    }

    function test_createFungibleToken_should_revert_if_treasury_is_not_provided() external {
        IHederaTokenService.HederaToken memory token;
        token.name = "Token name";
        token.symbol = "Token symbol";
        vm.expectRevert(bytes("HTS: treasury cannot be zero-address"));
        IHederaTokenService(HTS_ADDRESS).createFungibleToken{value: 1000}(token, 10000, 4);
    }

    function test_createFungibleToken_should_revert_if_initialTotalSupply_is_negative() external {
        IHederaTokenService.HederaToken memory token;
        token.name = "Token name";
        token.symbol = "Token symbol";
        token.treasury = makeAddr("Token treasury");
        vm.expectRevert(bytes("HTS: initialTotalSupply cannot be negative"));
        IHederaTokenService(HTS_ADDRESS).createFungibleToken{value: 1000}(token, -1, 4);
    }

    function test_createFungibleToken_should_revert_if_decimals_is_negative() external {
        IHederaTokenService.HederaToken memory token;
        token.name = "Token name";
        token.symbol = "Token symbol";
        token.treasury = makeAddr("Token treasury");
        vm.expectRevert(bytes("HTS: decimals cannot be negative"));
        IHederaTokenService(HTS_ADDRESS).createFungibleToken{value: 1000}(token, 10000, -1);
    }

    function test_createFungibleToken_should_succeed_when_tokenInfo_is_valid() external {
        IHederaTokenService.HederaToken memory token;
        token.name = "Token name";
        token.symbol = "Token symbol";
        token.treasury = makeAddr("Token treasury");

        (int64 responseCode, address tokenAddress) = IHederaTokenService(HTS_ADDRESS).createFungibleToken{value: 1000}(token, 10000, 4);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);
        vm.assertNotEq(tokenAddress, address(0));

        bool isToken;
        (responseCode, isToken) = IHederaTokenService(HTS_ADDRESS).isToken(tokenAddress);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);
        vm.assertTrue(isToken);

        int32 tokenType;
        (responseCode, tokenType) = IHederaTokenService(HTS_ADDRESS).getTokenType(tokenAddress);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);
        vm.assertEq(tokenType, 0);

        IHederaTokenService.FungibleTokenInfo memory fungibleTokenInfo;
        (responseCode, fungibleTokenInfo) = IHederaTokenService(HTS_ADDRESS).getFungibleTokenInfo(tokenAddress);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);

        vm.assertEq(fungibleTokenInfo.decimals, 4);

        IHederaTokenService.TokenInfo memory tokenInfo = fungibleTokenInfo.tokenInfo;

        vm.assertEq(tokenInfo.token.name, token.name);
        vm.assertEq(tokenInfo.token.symbol, token.symbol);
        vm.assertEq(tokenInfo.token.treasury, token.treasury);
        vm.assertEq(tokenInfo.totalSupply, 10000);
        vm.assertEq(tokenInfo.fixedFees.length, 0);
        vm.assertEq(tokenInfo.fractionalFees.length, 0);
        vm.assertEq(tokenInfo.royaltyFees.length, 0);

        vm.assertEq(tokenInfo.ledgerId, "0x03");

        // Created token should be accessible through Proxy contract redirect calls
        vm.assertEq(IERC20(tokenAddress).name(), token.name);
        vm.assertEq(IERC20(tokenAddress).symbol(), token.symbol);
        vm.assertEq(IERC20(tokenAddress).decimals(), 4);
        vm.assertEq(IERC20(tokenAddress).totalSupply(), 10000);

        vm.assertEq(IERC20(tokenAddress).balanceOf(token.treasury), uint256(int256(tokenInfo.totalSupply)));
        vm.assertEq(IERC20(tokenAddress).balanceOf(makeAddr("no balance account")), 0);
    }

    function test_createFungibleToken_should_succeed_when_initialTotalSupply_is_zero() external {
        IHederaTokenService.HederaToken memory token;
        token.name = "Token name";
        token.symbol = "Token symbol";
        token.treasury = makeAddr("Token treasury");

        (int64 responseCode, address tokenAddress) = IHederaTokenService(HTS_ADDRESS).createFungibleToken{value: 1000}(token, 0, 4);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);

        IHederaTokenService.FungibleTokenInfo memory fungibleTokenInfo;
        (responseCode, fungibleTokenInfo) = IHederaTokenService(HTS_ADDRESS).getFungibleTokenInfo(tokenAddress);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);
        vm.assertEq(fungibleTokenInfo.decimals, 4);

        IHederaTokenService.TokenInfo memory tokenInfo = fungibleTokenInfo.tokenInfo;
        vm.assertEq(tokenInfo.totalSupply, 0);

        // Created token should be accessible through Proxy contract redirect calls
        vm.assertEq(IERC20(tokenAddress).name(), token.name);
        vm.assertEq(IERC20(tokenAddress).symbol(), token.symbol);
        vm.assertEq(IERC20(tokenAddress).decimals(), 4);
        vm.assertEq(IERC20(tokenAddress).totalSupply(), 0);

        vm.assertEq(IERC20(tokenAddress).balanceOf(token.treasury), 0);
        vm.assertEq(IERC20(tokenAddress).balanceOf(makeAddr("no balance account")), 0);
    }

    function test_createFungibleTokenWithCustomFees_should_succeed_when_tokenInfo_is_valid() external {
        IHederaTokenService.HederaToken memory token;
        token.name = "Token name";
        token.symbol = "Token symbol";
        token.treasury = makeAddr("Token treasury");

        IHederaTokenService.FixedFee[] memory fixedFees = new IHederaTokenService.FixedFee[](1);
        fixedFees[0].amount = 10;
        IHederaTokenService.FractionalFee[] memory fractionalFees = new IHederaTokenService.FractionalFee[](1);
        fractionalFees[0].numerator = 1;
        fractionalFees[0].denominator = 5;
        (int64 responseCode, address tokenAddress) = IHederaTokenService(HTS_ADDRESS).createFungibleTokenWithCustomFees{value: 1000}(token, 10000, 4, fixedFees, fractionalFees);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);
        vm.assertNotEq(tokenAddress, address(0));

        IHederaTokenService.TokenInfo memory tokenInfo;
        (responseCode, tokenInfo) = IHederaTokenService(HTS_ADDRESS).getTokenInfo(tokenAddress);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);

        vm.assertEq(tokenInfo.token.name, token.name);
        vm.assertEq(tokenInfo.token.symbol, token.symbol);
        vm.assertEq(tokenInfo.fixedFees.length, 1);
        vm.assertEq(tokenInfo.fixedFees[0].amount, fixedFees[0].amount);
        vm.assertEq(tokenInfo.fractionalFees.length, 1);
        vm.assertEq(tokenInfo.fractionalFees[0].numerator, fractionalFees[0].numerator);
        vm.assertEq(tokenInfo.fractionalFees[0].denominator, fractionalFees[0].denominator);
        vm.assertEq(tokenInfo.royaltyFees.length, 0);
    }

    function test_createFungibleToken_should_succeed_when_called_multiple_times() external {
        int64 responseCode;
        address tokenAddress;
        IHederaTokenService.HederaToken[2] memory token;

        token[0].name = "Token name 0";
        token[0].symbol = "Token symbol 0";
        token[0].treasury = makeAddr("Token treasury 0");

        (responseCode, tokenAddress) = IHederaTokenService(HTS_ADDRESS).createFungibleToken{value: 1000}(token[0], 10000, 4);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);
        address tokenAddress0 = tokenAddress;

        token[1].name = "Token name 1";
        token[1].symbol = "Token symbol 1";
        token[1].treasury = makeAddr("Token treasury 1");
        (responseCode, tokenAddress) = IHederaTokenService(HTS_ADDRESS).createFungibleToken{value: 1000}(token[1], 20000, 5);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);
        address tokenAddress1 = tokenAddress;

        vm.assertNotEq(tokenAddress0, tokenAddress1);

        IHederaTokenService.TokenInfo memory tokenInfo;

        (responseCode, tokenInfo) = IHederaTokenService(HTS_ADDRESS).getTokenInfo(tokenAddress0);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);
        vm.assertEq(tokenInfo.token.name, token[0].name);
        vm.assertEq(tokenInfo.token.symbol, token[0].symbol);
        vm.assertEq(tokenInfo.token.treasury, token[0].treasury);

        (responseCode, tokenInfo) = IHederaTokenService(HTS_ADDRESS).getTokenInfo(tokenAddress1);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);
        vm.assertEq(tokenInfo.token.name, token[1].name);
        vm.assertEq(tokenInfo.token.symbol, token[1].symbol);
        vm.assertEq(tokenInfo.token.treasury, token[1].treasury);
    }

    function test_createNonFungibleToken_should_succeed_when_tokenInfo_is_valid() external {
        IHederaTokenService.HederaToken memory token;
        token.name = "NFT name";
        token.symbol = "NFT symbol";
        token.treasury = makeAddr("NFT treasury");

        (int64 responseCode, address tokenAddress) = IHederaTokenService(HTS_ADDRESS).createNonFungibleToken{value: 1000}(token);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);
        vm.assertNotEq(tokenAddress, address(0));

        bool isToken;
        (responseCode, isToken) = IHederaTokenService(HTS_ADDRESS).isToken(tokenAddress);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);
        vm.assertTrue(isToken);

        int32 tokenType;
        (responseCode, tokenType) = IHederaTokenService(HTS_ADDRESS).getTokenType(tokenAddress);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);
        vm.assertEq(tokenType, 1);

        IHederaTokenService.TokenInfo memory tokenInfo;
        (responseCode, tokenInfo) = IHederaTokenService(HTS_ADDRESS).getTokenInfo(tokenAddress);
        vm.assertEq(responseCode, HederaResponseCodes.SUCCESS);

        vm.assertEq(tokenInfo.token.name, token.name);
        vm.assertEq(tokenInfo.token.symbol, token.symbol);
        vm.assertEq(tokenInfo.token.treasury, token.treasury);
        vm.assertEq(tokenInfo.totalSupply, 0);
        vm.assertEq(tokenInfo.fixedFees.length, 0);
        vm.assertEq(tokenInfo.fractionalFees.length, 0);
        vm.assertEq(tokenInfo.royaltyFees.length, 0);

        vm.assertEq(tokenInfo.ledgerId, "0x03");

        // Created token should be accessible through Proxy contract redirect calls
        vm.assertEq(IERC721(tokenAddress).name(), token.name);
        vm.assertEq(IERC721(tokenAddress).symbol(), token.symbol);
        vm.assertEq(IERC721(tokenAddress).totalSupply(), 0);
    }
}
