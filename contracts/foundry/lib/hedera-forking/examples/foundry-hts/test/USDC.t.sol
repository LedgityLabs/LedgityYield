// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {Hsc} from "hedera-forking/Hsc.sol";
import {IERC20} from "hedera-forking/IERC20.sol";
import {IHederaTokenService} from "hedera-forking/IHederaTokenService.sol";
import {HederaResponseCodes} from "hedera-forking/HederaResponseCodes.sol";

contract USDCExampleTest is Test {
    // https://hashscan.io/mainnet/token/0.0.456858
    address USDC_mainnet = 0x000000000000000000000000000000000006f89a;

    address private user1;

    function setUp() external {
        Hsc.htsSetup();

        user1 = makeAddr("user1");
        deal(USDC_mainnet, user1, 1000 * 10e8);
    }

    function test_get_balance_of_existing_account() view external {
        // https://hashscan.io/mainnet/account/0.0.1528
        address usdcHolder = 0x00000000000000000000000000000000000005f8;
        // Balance retrieved from mainnet at block 72433403
        assertEq(IERC20(USDC_mainnet).balanceOf(usdcHolder), 28_525_752677);
    }

    function test_dealt_balance_of_local_account() view external {
        assertEq(IERC20(USDC_mainnet).balanceOf(user1), 1000 * 10e8);
    }

    function test_HTS_getTokenInfo() external view {
        (int64 responseCode, IHederaTokenService.TokenInfo memory tokenInfo) = IHederaTokenService(address(0x167)).getTokenInfo(USDC_mainnet);
        assertEq(responseCode, HederaResponseCodes.SUCCESS);
        assertEq(tokenInfo.token.name, "USD Coin");
        assertEq(tokenInfo.token.symbol, "USDC");
        assertEq(tokenInfo.token.memo, "USDC HBAR");
    }
}
