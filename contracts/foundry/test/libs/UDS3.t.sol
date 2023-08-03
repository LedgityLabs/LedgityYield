// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../../lib/forge-std/src/Test.sol";
import {AS3} from "../../../src/libs/AS3.sol";

contract Tests is Test {
    // ==============================
    // === scaleUp() function ===
    function testFuzz_scaleUp_1(uint256 n) public {
        console.log("Should return input times 10^3 (non-overflow cases)");

        // Bound n to non-overflow cases
        n = bound(n, 0, type(uint256).max / 10 ** 3);

        assertEq(AS3.scaleUp(n), n * 10 ** 3);
    }

    function testFuzz_scaleUp_2(uint256 n) public {
        console.log("Should revert on overflow");

        // Bound n to overflow cases
        n = bound(n, type(uint256).max / 10 ** 3 + 1, type(uint256).max);

        vm.expectRevert();
        AS3.scaleUp(n);
    }

    // ==============================
    // === scaleDown() function ===
    function testFuzz_scaleDown_1(uint256 n) public {
        console.log("Should return input divided 10^3 (non-overflow cases)");

        // Bound n to non-underflow cases
        n = bound(n, 1000, type(uint256).max / 10 ** 3);

        assertEq(AS3.scaleDown(AS3.scaleUp(n)), n);
    }

    function testFuzz_scaleDown_2(uint256 n) public {
        console.log("Shouldn't revert on underflow, just return 0");

        // Bound n to underflow cases
        n = bound(n, 0, 1000 - 1);

        assertEq(AS3.scaleDown(n), 0);
    }
}
