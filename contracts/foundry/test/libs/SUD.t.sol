// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../../lib/forge-std/src/Test.sol";
import {SUD} from "../../../src/libs/SUD.sol";
import {GenericERC20} from "../../../dev/GenericERC20.sol";

contract Tests is Test {
    // =============================
    // === decimalsOf() function ===
    function testFuzz_decimalsOf_1(uint8 decimals) public {
        console.log("Should return decimals of input token");

        // Deploy an ERC20 token with random amount of decimals
        GenericERC20 token = new GenericERC20("Test", "TEST", decimals);

        // Assert that the result is the token decimals
        assertEq(SUD.decimalsOf(address(token)), decimals);
    }

    // =============================
    // === fromAmount() function ===
    function testFuzz_fromAmount_1(uint8 decimals, uint256 nAmount) public {
        console.log("Should return UD71x6 if decimals <3 (non-overflow cases)");

        // Bound decimals to [0, 2]
        decimals = uint8(bound(decimals, 0, 2));

        // Compute missing decimals to reach UD71x6
        uint256 missingDecimals = 6 - decimals;

        // Bound nAmount to non-overflow cases
        nAmount = bound(nAmount, 0, type(uint256).max / 10 ** missingDecimals);

        // Assert that the result is input converted to UD71x6
        assertEq(SUD.fromAmount(nAmount, decimals), nAmount * 10 ** missingDecimals);
    }

    function testFuzz_fromAmount_2(uint8 decimals, uint256 nAmount) public {
        console.log("Should revert on overflow when decimals <3");

        // Bound decimals to [0, 2]
        decimals = uint8(bound(decimals, 0, 2));

        // Compute missing decimals to reach UD71x6
        uint256 missingDecimals = 6 - decimals;

        // Bound n to overflow cases
        nAmount = bound(nAmount, type(uint256).max / 10 ** missingDecimals + 1, type(uint256).max);

        // Assert that it reverts
        vm.expectRevert(stdError.arithmeticError);
        SUD.fromAmount(nAmount, decimals);
    }

    function testFuzz_fromAmount_3(uint8 decimals, uint256 nAmount) public {
        console.log("Should return input times 10^3 if decimals >=3 (non-overflow cases)");

        // Bound decimals to [3, 18]
        decimals = uint8(bound(decimals, 3, 18));

        // Bound n to non-overflow cases
        nAmount = bound(nAmount, 0, type(uint256).max / 10 ** 3);

        assertEq(SUD.fromAmount(nAmount, decimals), nAmount * 10 ** 3);
    }

    function testFuzz_fromAmount_4(uint8 decimals, uint256 nAmount) public {
        console.log("Should revert on overflow when decimals >=3");

        // Bound decimals to [3, 18]
        decimals = uint8(bound(decimals, 3, 18));

        // Bound n to overflow cases
        nAmount = bound(nAmount, type(uint256).max / 10 ** 3 + 1, type(uint256).max);

        // Assert that it reverts
        vm.expectRevert(stdError.arithmeticError);
        SUD.fromAmount(nAmount, decimals);
    }

    // ===========================
    // === toAmount() function ===
    function testFuzz_toAmount_1(uint8 decimals, uint256 nSUD) public {
        console.log(
            "Should return convert an UD71x6 to amount if decimals <3 (non-underflow cases)"
        );

        // Bound decimals to [0, 2]
        decimals = uint8(bound(decimals, 0, 2));

        // Compute missing decimals to reach UD71x6
        uint256 missingDecimals = 6 - decimals;

        // Bound n to non-underflow cases
        nSUD = bound(nSUD, 10 ** missingDecimals, type(uint256).max);

        // Assert that the result is input converted to amount
        assertEq(SUD.toAmount(nSUD, decimals), nSUD / 10 ** missingDecimals);
    }

    function testFuzz_toAmount_2(uint8 decimals, uint256 nSUD) public {
        console.log("Shouldn't revert for underflow and return 0 instead, when decimals <3");

        // Bound decimals to [0, 2]
        decimals = uint8(bound(decimals, 0, 2));

        // Compute missing decimals to reach UD71x6
        uint256 missingDecimals = 6 - decimals;

        // Bound n to underflow cases
        nSUD = bound(nSUD, 0, 10 ** missingDecimals - 1);

        // Assert output is 0
        assertEq(SUD.toAmount(nSUD, decimals), 0);
    }

    function testFuzz_toAmount_3(uint8 decimals, uint256 nSUD) public {
        console.log("Should return input divided by 10^3 if decimals >=3 (non-underflow cases)");

        // Bound decimals to [3, 18]
        decimals = uint8(bound(decimals, 3, 18));

        // Bound n to non-underflow cases
        nSUD = bound(nSUD, 10 ** 3, type(uint256).max);

        // Assert the result is input divided by 10^3
        assertEq(SUD.toAmount(nSUD, decimals), nSUD / 10 ** 3);
    }

    function testFuzz_toAmount_4(uint8 decimals, uint256 nSUD) public {
        console.log("Shouldn't revert for underflow and return 0 instead, when decimals >=3");

        // Bound decimals to [3, 18]
        decimals = uint8(bound(decimals, 3, 18));

        // Bound n to underflow cases
        nSUD = bound(nSUD, 0, 10 ** 3 - 1);

        // Assert output is 0
        assertEq(SUD.toAmount(nSUD, decimals), 0);
    }

    // ===========================
    // === fromRate() function ===
    function testFuzz_fromRate_1(uint8 decimals, uint256 nUD7x3) public {
        console.log("Should return UD71x6 if decimals <3 (non-overflow cases)");

        // Bound decimals to [0, 2]
        decimals = uint8(bound(decimals, 0, 2));

        // Bound n to non-overflow cases
        nUD7x3 = bound(nUD7x3, 0, type(uint256).max / 10 ** 3);

        // Assert that the result is input converted to UD71x6
        assertEq(SUD.fromRate(nUD7x3, decimals), nUD7x3 * 10 ** 3);
    }

    function testFuzz_fromRate_2(uint8 decimals, uint256 nUD7x3) public {
        console.log("Should revert on overflow when decimals <3");

        // Bound decimals to [0, 2]
        decimals = uint8(bound(decimals, 0, 2));

        // Bound n to overflow cases
        nUD7x3 = bound(nUD7x3, type(uint256).max / 10 ** 3 + 1, type(uint256).max);

        // Assert that it reverts
        vm.expectRevert(stdError.arithmeticError);
        SUD.fromRate(nUD7x3, decimals);
    }

    function testFuzz_fromRate_3(uint8 decimals, uint256 nUD7x3) public {
        console.log(
            "Should scale input rate by token decimals number if decimals >=3 (non-overflow cases)"
        );

        // Bound decimals to [3, 18]
        decimals = uint8(bound(decimals, 3, 18));

        // Bound n to non-overflow cases
        nUD7x3 = bound(nUD7x3, 0, type(uint256).max / 10 ** decimals);

        assertEq(SUD.fromRate(nUD7x3, decimals), nUD7x3 * 10 ** decimals);
    }

    function testFuzz_fromRate_4(uint8 decimals, uint256 nUD7x3) public {
        console.log("Should revert on overflow when decimals >=3");

        // Bound decimals to [3, 18]
        decimals = uint8(bound(decimals, 3, 18));

        // Bound n to overflow cases
        nUD7x3 = bound(nUD7x3, type(uint256).max / 10 ** decimals + 1, type(uint256).max);

        // Assert that it reverts
        vm.expectRevert(stdError.arithmeticError);
        SUD.fromRate(nUD7x3, decimals);
    }

    // =========================
    // === toRate() function ===
    function testFuzz_toRate_1(uint8 decimals, uint256 nSUD) public {
        console.log("Should return convert an UD71x6 to rate if decimals <3 (non-underflow cases)");

        // Bound decimals to [0, 2]
        decimals = uint8(bound(decimals, 0, 2));

        // Bound n to non-underflow cases
        nSUD = bound(nSUD, 10 ** 3, type(uint256).max);

        // Assert that the result is input converted to amount
        assertEq(SUD.toRate(nSUD, decimals), nSUD / 10 ** 3);
    }

    function testFuzz_toRate_2(uint8 decimals, uint256 nSUD) public {
        console.log("Shouldn't revert for underflow and return 0 instead, when decimals <3");

        // Bound decimals to [0, 2]
        decimals = uint8(bound(decimals, 0, 2));

        // Bound n to underflow cases
        nSUD = bound(nSUD, 0, 10 ** 3 - 1);

        // Assert output is 0
        assertEq(SUD.toRate(nSUD, decimals), 0);
    }

    function testFuzz_toRate_3(uint8 decimals, uint256 nSUD) public {
        console.log(
            "Should return input divided by 10^decimals if decimals >=3 (non-underflow cases)"
        );

        // Bound decimals to [3, 18]
        decimals = uint8(bound(decimals, 3, 18));

        // Bound n to non-underflow cases
        nSUD = bound(nSUD, 10 ** decimals, type(uint256).max);

        // Assert the result is input divided by 10^3
        assertEq(SUD.toRate(nSUD, decimals), nSUD / 10 ** decimals);
    }

    function testFuzz_toRate_4(uint8 decimals, uint256 nSUD) public {
        console.log("Shouldn't revert for underflow and return 0 instead, when decimals >=3");

        // Bound decimals to [3, 18]
        decimals = uint8(bound(decimals, 3, 18));

        // Bound n to underflow cases
        nSUD = bound(nSUD, 0, 10 ** decimals - 1);

        // Assert output is 0
        assertEq(SUD.toRate(nSUD, decimals), 0);
    }

    // ==========================
    // === fromInt() function ===
    function testFuzz_fromInt_1(uint8 decimals, uint256 n) public {
        console.log(
            "Should scale input by 6 decimals (UD71x6) if decimals <3 (non-overflow cases)"
        );

        // Bound decimals to [0, 2]
        decimals = uint8(bound(decimals, 0, 2));

        // Bound n to non-overflow cases
        n = bound(n, 0, type(uint256).max / 10 ** 6);

        // Assert that the result is input converted to UD71x6
        assertEq(SUD.fromInt(n, decimals), n * 10 ** 6);
    }

    function testFuzz_fromInt_2(uint8 decimals, uint256 n) public {
        console.log("Should revert on overflow when decimals <3");

        // Bound decimals to [0, 2]
        decimals = uint8(bound(decimals, 0, 2));

        // Bound n to overflow cases
        n = bound(n, type(uint256).max / 10 ** 6 + 1, type(uint256).max);

        // Assert that it reverts
        vm.expectRevert(stdError.arithmeticError);
        SUD.fromInt(n, decimals);
    }

    function testFuzz_fromInt_3(uint8 decimals, uint256 n) public {
        console.log(
            "Should return input times 10^decimals+3 number when decimals >=3 (non-overflow cases)"
        );

        // Bound decimals to [3, 18]
        decimals = uint8(bound(decimals, 3, 18));

        // Bound n to non-overflow cases
        n = bound(n, 0, type(uint256).max / 10 ** (decimals + 3));

        assertEq(SUD.fromInt(n, decimals), n * 10 ** (decimals + 3));
    }

    function testFuzz_fromInt_4(uint8 decimals, uint256 n) public {
        console.log("Should revert on overflow when decimals >=3");

        // Bound decimals to [3, 18]
        decimals = uint8(bound(decimals, 3, 18));

        // Bound n to overflow cases
        n = bound(n, type(uint256).max / 10 ** (decimals + 3) + 1, type(uint256).max);

        // Assert that it reverts
        vm.expectRevert(stdError.arithmeticError);
        SUD.fromInt(n, decimals);
    }

    // =========================
    // === toInt() function ===
    function testFuzz_toInt_1(uint8 decimals, uint256 n) public {
        console.log(
            "Should return convert an UD71x6 to integer if decimals <3 (non-underflow cases)"
        );

        // Bound decimals to [0, 2]
        decimals = uint8(bound(decimals, 0, 2));

        // Bound n to non-underflow cases
        n = bound(n, 10 ** 6, type(uint256).max);

        // Assert that the result is input converted to amount
        assertEq(SUD.toInt(n, decimals), n / 10 ** 6);
    }

    function testFuzz_toInt_2(uint8 decimals, uint256 n) public {
        console.log("Shouldn't revert for underflow and return 0 instead, when decimals <3");

        // Bound decimals to [0, 2]
        decimals = uint8(bound(decimals, 0, 2));

        // Bound n to underflow cases
        n = bound(n, 0, 10 ** 6 - 1);

        // Assert output is 0
        assertEq(SUD.toInt(n, decimals), 0);
    }

    function testFuzz_toInt_3(uint8 decimals, uint256 n) public {
        console.log(
            "Should return input divided by 10^decimals+3 if decimals >=3 (non-underflow cases)"
        );

        // Bound decimals to [3, 18]
        decimals = uint8(bound(decimals, 3, 18));

        // Bound n to non-underflow cases
        n = bound(n, 10 ** (decimals + 3), type(uint256).max);

        // Assert the result is input divided by 10^3
        assertEq(SUD.toInt(n, decimals), n / 10 ** (decimals + 3));
    }

    function testFuzz_toInt_4(uint8 decimals, uint256 n) public {
        console.log("Shouldn't revert for underflow and return 0 instead, when decimals >=3");

        // Bound decimals to [3, 18]
        decimals = uint8(bound(decimals, 3, 18));

        // Bound n to underflow cases
        n = bound(n, 0, 10 ** (decimals + 3) - 1);

        // Assert output is 0
        assertEq(SUD.toInt(n, decimals), 0);
    }
}
