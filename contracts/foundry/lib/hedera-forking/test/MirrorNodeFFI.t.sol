// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {MirrorNodeFFI} from "../contracts/MirrorNodeFFI.sol";

contract MirrorNodeFFITest is Test {

    address private constant USDC = 0x0000000000000000000000000000000000068cDa;

    // https://hashscan.io/testnet/account/0.0.1421
    address private constant alice = 0x4D1c823b5f15bE83FDf5adAF137c2a9e0E78fE15;

    MirrorNodeFFI private _mirrorNode;

    bool private _skip;

    function setUp() external {
        try vm.activeFork() {
            _skip = true;
            console.log("Active fork detected, this test runs only in non-forked mode");
        } catch {
            _skip = false;
            vm.chainId(296);
            vm.roll(13890397);

            string memory PATH = vm.envString("PATH");
            vm.setEnv("PATH", string.concat("./test/scripts:", PATH));

            _mirrorNode = new MirrorNodeFFI();
        }
    }

    modifier nonFork() {
        vm.skip(_skip);
        _;
    }

    function test_revert_when_get_token_data_for_invalid_token_address() nonFork external {
        vm.expectRevert(bytes("Invalid token address"));
        _mirrorNode.fetchTokenData(makeAddr("invalid-token-address"));
    }

    function test_revert_when_get_token_data_for_unknown_token() nonFork external {
        string memory json = _mirrorNode.fetchTokenData(address(0x12345678));
        assertEq('{"_status":{"messages":[{"message":"Not found"}]}}', json);
    }

    function test_get_data_for_existing_token() nonFork external {
        string memory json = _mirrorNode.fetchTokenData(USDC);
        assertEq(vm.parseJsonString(json, ".name"), "USD Coin");
        assertEq(vm.parseJsonString(json, ".symbol"), "USDC");
        assertEq(vm.parseJsonUint(json, ".decimals"), 6);
        assertEq(vm.parseJsonUint(json, ".total_supply"), 10000000005000000);
    }

    function test_revert_when_get_balance_for_invalid_token_address() nonFork external {
        vm.expectRevert(bytes("Invalid token address"));
        _mirrorNode.fetchBalance(makeAddr("invalid-token-address"), 1234);
    }

    function test_get_balance_for_unknown_account() nonFork external {
        uint256 amount = _mirrorNode.getBalance(address(0x12345678), makeAddr("account"));
        assertEq(amount, 0);
    }

    function test_revert_when_get_balance_for_unknown_token() nonFork external {
        uint256 amount = _mirrorNode.getBalance(address(0x12345678), alice);
        assertEq(amount, 0);
    }

    function test_get_balance_for_existing_account() nonFork external {
        uint256 amount = _mirrorNode.getBalance(USDC, alice);
        assertEq(amount, 54_300_000);
    }

    function test_revert_when_get_allowance_for_invalid_token_address() nonFork external {
        vm.expectRevert(bytes("Invalid token address"));
        _mirrorNode.fetchAllowance(makeAddr("invalid-token-address"), 1234, 5678);
    }

    function test_revert_when_get_allowance_for_unknown_owner() nonFork external {
        uint256 amount = _mirrorNode.getAllowance(address(0x12345678), makeAddr("owner"), makeAddr("spender"));
        assertEq(amount, 0);
    }

    function test_revert_when_get_allowance_for_unknown_spender() nonFork external {
        uint256 amount = _mirrorNode.getAllowance(address(0x12345678), alice, makeAddr("spender"));
        assertEq(amount, 0);
    }

    function test_get_allowance_for_unknown_token() nonFork external {
        assertEq(_mirrorNode.getAllowance(address(0x12345678), alice, alice), 0);
    }

    function test_get_allowance() nonFork external {
        // https://hashscan.io/testnet/account/0.0.4233295
        address owner = address(0x000000000000000000000000000000000040984F);
        // https://hashscan.io/testnet/account/0.0.1335
        address spender = 0x0000000000000000000000000000000000000537;
        uint256 amount = _mirrorNode.getAllowance(address(USDC), owner, spender);
        assertEq(amount, 5_000_000);
    }
}
