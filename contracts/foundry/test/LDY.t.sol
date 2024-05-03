// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";
import {LDY} from "../../src/LDY.sol";

contract Tests is Test {
    LDY tested;

    function setUp() public {
        // Deploy LDY contract
        tested = new LDY();
        vm.label(address(tested), "LDY");
    }

    // ===========================
    // === decimals() function ===
    function test_decimals_1() public {
        console.log("Should return 18");
        assertEq(tested.decimals(), 18);
    }

    // =======================
    // === name() function ===
    function test_name_1() public {
        console.log("Should return 'Ledgity Token'");
        assertEq(tested.name(), "Ledgity Token");
    }

    // =========================
    // === symbol() function ===
    function test_symbol_1() public {
        console.log("Should return 'LDY'");
        assertEq(tested.symbol(), "LDY");
    }

    // ==============================
    // === totalSupply() function ===
    function test_totalSupply_1() public {
        console.log("Should return 75,000,000 * 10 ** 18");
        assertEq(tested.totalSupply(), 75_000_000 * 10 ** 18);
    }

    // ====================
    // === balanceOf() ====
    function test_balanceOf_1() public {
        console.log("Should mint 75M LDY to contract deployer");
        assertEq(tested.balanceOf(address(this)), 75_000_000 * 10 ** 18);
    }
}
