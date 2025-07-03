// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {Hsc} from "hedera-forking/Hsc.sol";
import {IERC20} from "hedera-forking/IERC20.sol";

contract USDCConsoleExampleTest is Test {
    function setUp() external {
        Hsc.htsSetup();
    }

    function test_using_console_log() view external {
        // https://hashscan.io/mainnet/token/0.0.456858
        address USDC_mainnet = 0x000000000000000000000000000000000006f89a;

        string memory name = IERC20(USDC_mainnet).name();
        string memory symbol = IERC20(USDC_mainnet).symbol();
        uint8 decimals = IERC20(USDC_mainnet).decimals();
        assertEq(name, "USD Coin");
        assertEq(symbol, "USDC");
        assertEq(decimals, 6);

        console.log("name: %s, symbol: %s, decimals: %d", name, symbol, decimals);
    }
}
