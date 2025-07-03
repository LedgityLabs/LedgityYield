// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {IERC20Events} from "../contracts/HtsSystemContract.sol";
import {IERC20} from "../contracts/IERC20.sol";
import {TestSetup} from "./lib/TestSetup.sol";

interface MethodNotSupported {
    function methodNotSupported() external view returns (uint256);
}

/**
 * HTS for Fungible Token methods test.
 * Fungible Token must implement the ERC20 standard.
 *
 * These tests use USDC, an already existing HTS Token.
 *
 * Test based on issue https://github.com/hashgraph/hedera-smart-contracts/issues/863.
 *
 * For more details about USDC on Hedera, see https://www.circle.com/en/multi-chain-usdc/hedera.
 *
 * To get USDC balances for a given account using the Mirror Node you can use
 * https://mainnet.mirrornode.hedera.com/api/v1/tokens/0.0.456858/balances?account.id=0.0.38047
 */
contract ERC20TokenTest is Test, TestSetup {

    function setUp() external {
        setUpMockStorageForNonFork();
    }

    function test_ERC20_name() view external {
        assertEq(IERC20(USDC).name(), "USD Coin");
    }

    function test_ERC20_large_name() view external {
        assertEq(IERC20(MFCT).name(), "My Crypto Token is the name which the string length is greater than 31");
    }

    function test_ERC20_symbol() view external {
        assertEq(IERC20(USDC).symbol(), "USDC");
    }

    function test_ERC20_decimals() view external {
        assertEq(IERC20(USDC).decimals(), 6);
    }

    function test_ERC20_totalSupply() view external {
        assertEq(IERC20(USDC).totalSupply(), 10000000005000000);
    }

    function test_ERC20_should_revert_for_method_not_supported() external {
        vm.expectRevert(bytes("redirectForToken: not supported"));
        MethodNotSupported(USDC).methodNotSupported();
    }

    function test_ERC20_balanceOf_deal() external {
        address alice = makeAddr("alice");
        address bob = makeAddr("bob");

        assertEq(IERC20(USDC).balanceOf(bob), 0);

        deal(USDC, alice, 1000 * 10e8);

        uint256 balance = IERC20(USDC).balanceOf(alice);
        console.log("alice's balance %s", balance);
        assertEq(balance, 1000 * 10e8);

        // Bob's balance should remain unchanged
        assertEq(IERC20(USDC).balanceOf(bob), 0);
    }

    function test_ERC20_balanceOf_should_return_zero_for_non_existent_account() external {
        address alice = makeAddr("alice");
        uint256 balance = IERC20(USDC).balanceOf(alice);
        assertEq(balance, 0);
    }

    function test_ERC20_balanceOf_call() view external {
        // https://hashscan.io/testnet/account/0.0.1421
        address alice = 0x4D1c823b5f15bE83FDf5adAF137c2a9e0E78fE15;
        uint256 balance = IERC20(USDC).balanceOf(alice);
        console.log("alice's balance %s", balance);
        assertEq(balance, 54_300000);

        // https://hashscan.io/testnet/account/0.0.2183
        address bob = 0x0000000000000000000000000000000000000887;
        balance = IERC20(USDC).balanceOf(bob);
        console.log("bob's balance %s", balance);
        assertEq(balance, 1153_080000);
    }

    function test_ERC20_allowance_from_remote() view external {
        // https://hashscan.io/testnet/account/0.0.4233295
        address owner = address(0x000000000000000000000000000000000040984F);
        // https://hashscan.io/testnet/account/0.0.1335
        address spender = 0x0000000000000000000000000000000000000537;
        assertEq(IERC20(USDC).allowance(owner, spender), 5_000000);
    }

    function test_ERC20_allowance_empty() external {
        // https://hashscan.io/testnet/account/0.0.4233295
        address owner = address(0x000000000000000000000000000000000040984F);
        address spender = makeAddr("alice");

        assertEq(IERC20(USDC).allowance(owner, spender), 0);
    }

    function test_ERC20_approve() external {
        address owner = makeAddr("alice");
        address spender = makeAddr("bob");
        uint256 amount = 4_000000;

        assertEq(IERC20(USDC).allowance(owner, spender), 0);

        vm.prank(owner);
        vm.expectEmit(USDC);
        emit IERC20Events.Approval(owner, spender, amount);
        IERC20(USDC).approve(spender, amount);

        assertEq(IERC20(USDC).allowance(owner, spender), amount);
    }

    function test_ERC20_approve_should_revert_when_invalid_spender() external {
        vm.expectRevert(bytes("_approve: invalid spender"));
        IERC20(USDC).approve(address(0), 4_000000);
    }

    function test_ERC20_transfer_invalid_receiver() external {
        vm.expectRevert(bytes("hts: invalid receiver"));
        IERC20(USDC).transfer(address(0), 4_000000);
    }

    function test_ERC20_transfer() external {
        // https://hashscan.io/testnet/account/0.0.1421
        address owner = 0x4D1c823b5f15bE83FDf5adAF137c2a9e0E78fE15;
        address to = makeAddr("bob");
        uint256 amount = 4_000000;

        uint256 balanceOfOwner = IERC20(USDC).balanceOf(owner);
        assertGt(balanceOfOwner, 0);
        assertEq(IERC20(USDC).balanceOf(to), 0);

        vm.prank(owner); // https://book.getfoundry.sh/cheatcodes/prank
        vm.expectEmit(USDC);
        emit IERC20Events.Transfer(owner, to, amount);
        IERC20(USDC).transfer(to, amount);

        assertEq(IERC20(USDC).balanceOf(owner), balanceOfOwner - amount);
        assertEq(IERC20(USDC).balanceOf(to), amount);
    }

    function test_ERC20_transferFrom_should_revert_when_insufficient_allowance() external {
        vm.expectRevert(bytes("_spendAllowance: insufficient"));
        address from = makeAddr("bob");
        address to = makeAddr("bob");
        IERC20(USDC).transferFrom(from, to, 4_000000);
    }

    function test_ERC20_transferFrom_should_revert_when_insufficient_balance() external {
        address owner = 0x4D1c823b5f15bE83FDf5adAF137c2a9e0E78fE15;
        address from = makeAddr("alice");
        address to = makeAddr("bob");
        vm.prank(owner);
        IERC20(USDC).approve(from, 70_000000);

        vm.expectRevert(bytes("_transfer: insufficient balance"));
        vm.prank(from);
        IERC20(USDC).transferFrom(owner, to, 60_000000);
    }

    function test_ERC20_transferFrom_should_transfer_and_spend_allowance() external {
        // https://hashscan.io/testnet/account/0.0.1421
        address alice = 0x4D1c823b5f15bE83FDf5adAF137c2a9e0E78fE15;
        address bob = makeAddr("bob");
        address charlie = makeAddr("charlie");

        uint256 allowanceAmount = 10_000000;
        uint256 transferAmount = 4_000000;

        vm.prank(alice);
        IERC20(USDC).approve(bob, allowanceAmount);

        assertEq(IERC20(USDC).balanceOf(alice), 54_300000);
        assertEq(IERC20(USDC).balanceOf(bob), 0);
        assertEq(IERC20(USDC).balanceOf(charlie), 0);

        vm.prank(bob);
        vm.expectEmit(USDC);
        emit IERC20Events.Transfer(alice, charlie, transferAmount);
        IERC20(USDC).transferFrom(alice, charlie, transferAmount);

        assertEq(IERC20(USDC).balanceOf(alice), 54_300000 - 4_000000);
        assertEq(IERC20(USDC).balanceOf(bob), 0);
        assertEq(IERC20(USDC).balanceOf(charlie), transferAmount);
        assertEq(IERC20(USDC).allowance(alice, bob), allowanceAmount - transferAmount);
    }
}
