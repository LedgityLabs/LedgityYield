// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../lib/forge-std/src/Test.sol";
import {APRCheckpoints as APRC} from "../../../src/libs/APRCheckpoints.sol";

contract Tests is Test {
    APRC.Pack[] packs;

    /**
     * @dev This function populate given number of packs with dummy data to the
     * array of packs. Note that dummy data are unique per pack and so can
     * be compared.
     * @param number Number of packs to populate
     */
    function populateDummyPacks(uint256 number) internal {
        // Fill packs with 20 dummy packs
        for (uint256 i = 0; i < number; i++) {
            APRC.Pack memory pack = APRC.Pack({
                aprsUD3: [uint16(i * 4 + 1), uint16(i * 4 + 2), uint16(i * 4 + 3), uint16(i * 4 + 4)],
                timestamps: [uint40(i * 4 + 1), uint40(i * 4 + 2), uint40(i * 4 + 3), uint40(i * 4 + 4)],
                cursor: 4
            });
            packs.push(pack);
        }
    }

    // =====================================
    // === incrementReference() function ===
    function testFuzz_incrementReference_1(uint256 packIndex, uint32 cursorIndex) public {
        console.log("Should revert if cursor index >3");

        vm.assume(cursorIndex > 3);
        vm.expectRevert(bytes("APRCheckpoints: cursor index overflow"));

        APRC.Reference memory ref = APRC.Reference(packIndex, cursorIndex);
        APRC.incrementReference(ref);
    }

    function testFuzz_incrementReference_2(uint256 packIndex, uint32 cursorIndex) public {
        console.log("Should increment cursor by 1 if given reference's cursor <3");

        vm.assume(cursorIndex < 3);

        APRC.Reference memory ref = APRC.Reference(packIndex, cursorIndex);
        APRC.Reference memory newRef = APRC.incrementReference(ref);

        assertEq(newRef.packIndex, ref.packIndex);
        assertEq(newRef.cursorIndex, ref.cursorIndex + 1);
    }

    function testFuzz_incrementReference_3(uint256 packIndex) public {
        console.log("Should increment pack by 1 and reset cursor if given reference's cursor == 3");

        vm.assume(packIndex < type(uint256).max);

        APRC.Reference memory ref = APRC.Reference(packIndex, 3);
        APRC.Reference memory newRef = APRC.incrementReference(ref);

        assertEq(newRef.packIndex, ref.packIndex + 1);
        assertEq(newRef.cursorIndex, 0);
    }

    // =======================================
    // === getDataFromReference() function ===
    function testFuzz_getDataFromReference_1(uint256 packIndex, uint32 cursorIndex) public {
        console.log("Should revert if cursor index <3");

        vm.assume(cursorIndex > 3);
        vm.expectRevert(bytes("APRCheckpoints: cursor index overflow"));

        APRC.Reference memory ref = APRC.Reference(packIndex, cursorIndex);
        APRC.getDataFromReference(packs, ref);
    }

    function testFuzz_getDataFromReference_2(uint256 packIndex, uint32 cursorIndex) public {
        console.log("Should revert if pack index is out of bound");

        populateDummyPacks(10);

        vm.assume(packIndex > packs.length - 1);
        vm.assume(cursorIndex <= 3);
        vm.expectRevert(bytes("APRCheckpoints: pack index out of bounds"));

        APRC.Reference memory ref = APRC.Reference(packIndex, cursorIndex);
        APRC.getDataFromReference(packs, ref);
    }

    function testFuzz_getDataFromReference_3(uint256 packIndex, uint32 cursorIndex) public {
        console.log("Should revert if cursor index has not been written yet");

        // Populate dummy data and flag all cursor index as unwritten
        populateDummyPacks(10);
        for (uint256 i = 0; i < packs.length; i++) {
            packs[i].cursor = 0;
        }

        vm.assume(packIndex < packs.length);
        vm.assume(cursorIndex <= 3);
        vm.expectRevert(bytes("APRCheckpoints: cursor index not written yet"));

        APRC.Reference memory ref = APRC.Reference(packIndex, cursorIndex);
        APRC.getDataFromReference(packs, ref);
    }

    function testFuzz_getDataFromReference_4(uint256 packIndex, uint32 cursorIndex) public {
        console.log("Should return right data");

        populateDummyPacks(10);

        vm.assume(packIndex < packs.length);
        vm.assume(cursorIndex <= 3);

        APRC.Reference memory ref = APRC.Reference(packIndex, cursorIndex);
        APRC.Checkpoint memory checkpoint = APRC.getDataFromReference(packs, ref);
        assertEq(checkpoint.aprUD3, packs[packIndex].aprsUD3[cursorIndex]);
        assertEq(checkpoint.timestamp, packs[packIndex].timestamps[cursorIndex]);
    }

    // =====================================
    // === getLatestReference() function ===
    function test_getLatestReference_1() public {
        console.log("Should revert if packs array is empty");
        vm.expectRevert(bytes("APRCheckpoints: no pack yet"));
        APRC.getLatestReference(packs);
    }

    function test_getLatestReference_2() public {
        console.log("Should revert if no checkpoint has been created yet");
        // Create a blank pack
        APRC.newBlankPack(packs);

        vm.expectRevert(bytes("APRCheckpoints: no checkpoint yet"));
        APRC.getLatestReference(packs);
    }

    function test_getLatestReference_3() public {
        console.log("Should return latest cursor of latest pack if latest is not empty");

        populateDummyPacks(10);

        APRC.Reference memory ref = APRC.getLatestReference(packs);
        assertEq(ref.packIndex, packs.length - 1);
        assertEq(ref.cursorIndex, packs[packs.length - 1].cursor - 1);
    }

    function test_getLatestReference_4() public {
        console.log("Should return cursor 3 of previous pack if latest pack is empty");

        populateDummyPacks(10);
        APRC.newBlankPack(packs);

        APRC.Reference memory ref = APRC.getLatestReference(packs);
        assertEq(ref.packIndex, packs.length - 2);
        assertEq(ref.cursorIndex, 3);
    }

    // ===============================
    // === newBlankPack() function ===
    function test_newBlankPack_1() public {
        console.log("Should revert latest pack is not full yet");

        // Populate dummy data and ensure latest pack is not full yet
        populateDummyPacks(10);
        packs[packs.length - 1].cursor = 2;

        vm.expectRevert(bytes("APRCheckpoints: latest pack not full yet"));

        APRC.newBlankPack(packs);
    }

    function test_newBlankPack_2() public {
        console.log("Should append a new empty pack else");

        populateDummyPacks(10);

        uint256 oldLength = packs.length;
        APRC.newBlankPack(packs);

        assertEq(packs.length, oldLength + 1);

        APRC.Pack memory newPack = packs[packs.length - 1];
        assertEq(newPack.cursor, 0);
        for (uint256 i = 0; i <= 3; i++) {
            assertEq(newPack.aprsUD3[i], 0);
        }
        for (uint256 i = 0; i <= 3; i++) {
            assertEq(newPack.timestamps[i], 0);
        }
    }

    // =========================
    // === setAPR() function ===
    function test_setAPR_1() public {
        console.log("Should create a first pack if packs array is empty");

        assertEq(packs.length, 0);
        APRC.setAPR(packs, 1234);
        assertEq(packs.length, 1);
    }

    function test_setAPR_2() public {
        console.log("Should write APR at first empty cursor slot if latest pack is not full");

        // Populate dummy data and ensure latest pack is not full yet
        populateDummyPacks(10);
        packs[packs.length - 1].cursor = 2;

        APRC.setAPR(packs, 1234);

        APRC.Pack memory writtenPack = packs[packs.length - 1];
        assertEq(writtenPack.aprsUD3[2], 1234);
        assertEq(writtenPack.timestamps[2], block.timestamp);
    }

    function test_setAPR_3() public {
        console.log(
            "Should create new blank pack and write its first cursor index if latest pack is full"
        );

        populateDummyPacks(10);

        uint256 oldLength = packs.length;
        APRC.setAPR(packs, 1234);

        assertEq(packs.length, oldLength + 1);
        APRC.Pack memory writtenPack = packs[packs.length - 1];
        assertEq(writtenPack.aprsUD3[0], 1234);
        assertEq(writtenPack.timestamps[0], block.timestamp);
    }

    function test_setAPR_4() public {
        console.log("Should increment pack cursor after writing if latest pack wasn't full");

        populateDummyPacks(10);
        packs[packs.length - 1].cursor = 2;

        uint32 oldCursor = packs[packs.length - 1].cursor;
        APRC.setAPR(packs, 1234);

        assertEq(packs[packs.length - 1].cursor, oldCursor + 1);
    }

    function test_setAPR_5() public {
        console.log("Should set cursor to 1 after writing a new blank pack");

        populateDummyPacks(10);

        APRC.setAPR(packs, 1234);

        assertEq(packs[packs.length - 1].cursor, 1);
    }

    function test_setAPR_6() public {
        console.log("Should change value of getAPR()");

        populateDummyPacks(10);

        uint256 oldAPR = APRC.getAPR(packs);
        APRC.setAPR(packs, 1234);

        assertFalse(oldAPR == 1234);
        assertEq(APRC.getAPR(packs), 1234);
    }

    // =========================
    // === getAPR() function ===
    function test_getAPR_1() public {
        console.log("Should return zero if packs array is empty");

        uint256 apr = APRC.getAPR(packs);
        assertEq(apr, 0);
    }

    function test_getAPR_2() public {
        console.log("Should return zero if no checkpoint has been created yet");

        APRC.newBlankPack(packs);

        uint256 apr = APRC.getAPR(packs);
        assertEq(apr, 0);
    }

    function test_getAPR_3() public {
        console.log("Should else return latest written cursor's APR of latest pack");

        populateDummyPacks(10);

        uint256 apr = APRC.getAPR(packs);
        APRC.Pack memory latestPack = packs[packs.length - 1];
        uint256 latestCursor = latestPack.cursor;

        assertEq(apr, latestPack.aprsUD3[latestCursor - 1]);
    }
}
