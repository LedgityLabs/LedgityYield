// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "../contracts/IERC20.sol";
import {TestSetup} from "./lib/TestSetup.sol";

contract DealERC20Test is Test, TestSetup {
    address private user1;

    // https://hashscan.io/testnet/account/0.0.1421
    address private alice = 0x4D1c823b5f15bE83FDf5adAF137c2a9e0E78fE15;

    function setUp() external {
        setUpMockStorageForNonFork();

        user1 = makeAddr("user1");

        deal(USDC, user1, 1000 * 10e8);
        deal(USDC, alice, 2000 * 10e8);
    }

    function test_DealERC20_get_dealt_balance_of_unknown_account() view external {
        assertEq(IERC20(USDC).balanceOf(user1), 1000 * 10e8);
    }

    function test_DealERC20_get_dealt_balance_of_existing_account() view external {
        assertEq(IERC20(USDC).balanceOf(alice), 2000 * 10e8);
    }
}
