// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../lib/forge-std/src/Test.sol";
import {UDS3} from "../../../src/libs/UDS3.sol";

contract Tests is Test {
    // ==============================
    // === scaleUp() function ===
    function testFuzz_scaleUp_1(uint256 n) public {
        console.log("Should return input times 10^3");
        vm.assume(n <= type(uint256).max / 10 ** 3);
        assertEq(UDS3.scaleUp(n), n * 10 ** 3);
    }

    function testFuzz_scaleUp_2(uint256 n) public {
        console.log("Should revert on overflow");
        vm.assume(n > type(uint256).max / 10 ** 3);
        vm.expectRevert();
        UDS3.scaleUp(n);
    }

    // ==============================
    // === scaleDown() function ===
    function testFuzz_scaleDown_1(uint256 n) public {
        console.log("Should return input divided 10^3");
        vm.assume(n <= type(uint256).max / 10 ** 3);
        assertEq(UDS3.scaleDown(UDS3.scaleUp(n)), n);
    }

    function testFuzz_scaleDown_2(uint256 n) public {
        console.log("Shouldn't revert on underflow");
        vm.assume(n < 1000);
        assertEq(UDS3.scaleDown(n), 0);
    }
}
