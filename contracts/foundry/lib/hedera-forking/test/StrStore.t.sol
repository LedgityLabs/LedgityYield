// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {Store} from "../contracts/Store.sol";

contract StrStoreTest is Test {

    C private _c;

    function setUp() external {
        _c = new C();
    }

    function storeStringTest(string memory value) private {
        Store.storeString(address(_c), 0, value);
        assertEq(_c.name(), value);

        Store.storeString(address(_c), 2, value);
        assertEq(_c.symbol(), value);

        assertEq(_c.gap1(), 0);
    }

    function storeBytesTest(bytes memory value) private {
        Store.storeBytes(address(_c), 3, value);
        assertEq(_c.someBytes(), value);

        assertEq(_c.gap2(), 0);

        Store.storeBytes(address(_c), 5, value);
        assertEq(_c.someOtherBytes(), value);
    }

    function storeUintTest(uint256 value) private {
        Store.storeUint(address(_c), 1, value);
        assertEq(_c.gap1(), value);
        assertEq(_c.name(), "");
        assertEq(_c.symbol(), "");
    }

    function storeBoolTest(bool value) private {
        Store.storeBool(address(_c), 6, value);
        assertEq(_c.someBool(), value);
        assertEq(_c.someBytes32(), bytes32(0));
        assertEq(_c.someOtherBytes(), new bytes(0));
    }

    function storeAddressTest(address value) private {
        Store.storeAddress(address(_c), 8, value);
        assertEq(_c.someAddress(), value);
        assertEq(_c.gap3(), 0);
        assertEq(_c.someBytes32(), bytes32(0));
    }

    function storeBytes32Test(bytes32 value) private {
        Store.storeBytes32(address(_c), 7, value);
        assertEq(_c.someBytes32(), value);
        assertEq(_c.someBool(), false);
        assertEq(_c.someAddress(), address(0));
    }

    // Strings

    function test_store_string_empty_string() external {
        storeStringTest("");
    }

    function test_store_string_single_char() external {
        storeStringTest("a");
    }

    function test_store_string_some_string() external {
        storeStringTest("some string");
    }

    function test_store_string_with_len_32() external {
        storeStringTest("01234567890123456789012345678901");
    }

    function test_store_string_with_len_gt_32() external {
        storeStringTest("01234567890123456789012345678901 some string");
    }

    function test_store_string_with_len_64() external {
        storeStringTest("0123456789012345678901234567890101234567890123456789012345678901");
    }

    function test_store_string_with_len_gt_64() external {
        storeStringTest("0123456789012345678901234567890101234567890123456789012345678901 some string");
    }

    // Bytes

    function test_store_bytes_empty() external {
        storeBytesTest(bytes(""));
    }

    function test_store_bytes_some_bytes() external {
        storeBytesTest(bytes("some bytes"));
    }

    function test_store_bytes_some_other_bytes() external {
        storeBytesTest(abi.encodePacked(bytes32(0)));
    }

    // Unsigned integers

    function test_store_uint_zero() external {
        storeUintTest(0);
    }

    function test_store_uint_max() external {
        storeUintTest(type(uint256).max);
    }

    // Booleans
    function test_store_bool_true() external {
        storeBoolTest(true);
    }

    function test_store_bool_false() external {
        storeBoolTest(false);
    }

    // Addresses

    function test_store_address_zero() external {
        storeAddressTest(address(0));
    }

    function test_store_address_some_address() external {
        storeAddressTest(address(0x1234567890123456789012345678901234567890));
    }

    // Bytes32

    function test_store_bytes32_zero() external {
        storeBytes32Test(bytes32(0));
    }

    function test_store_bytes32_some_bytes32() external {
        storeBytes32Test(bytes32("some bytes32"));
    }

    function assert_offset_values(bool bool1, bool bool2, address addr, int64 val) view private {
        assertEq(_c.offsetBool1(), bool1);
        assertEq(_c.offsetBool2(), bool2);
        assertEq(_c.offsetAddress(), addr);
        assertEq(_c.offsetInt64(), val);
    }

    function test_store_with_offsets() external {
        Slot memory offsetBool1 = _c.offsetBool1Slot();
        Slot memory offsetBool2 = _c.offsetBool2Slot();
        Slot memory offsetAddress = _c.offsetAddressSlot();
        Slot memory offsetInt64 = _c.offsetInt64Slot();
        console.log("offsetBool1 slot:%d offset:%d", offsetBool1.slot, offsetBool1.offset);
        console.log("offsetBool2 slot:%d offset:%d", offsetBool2.slot, offsetBool2.offset);
        console.log("offsetAddress slot:%d offset:%d", offsetAddress.slot, offsetAddress.offset);
        console.log("offsetInt64 slot:%d offset:%d", offsetInt64.slot, offsetInt64.offset);

        assert_offset_values(false, false, address(0), 0);

        Store.storeBool(address(_c), offsetBool1.slot, offsetBool1.offset, true);
        assert_offset_values(true, false, address(0), 0);

        Store.storeBool(address(_c), offsetBool2.slot, offsetBool2.offset, true);
        assert_offset_values(true, true, address(0), 0);

        Store.storeBool(address(_c), offsetBool1.slot, offsetBool1.offset, false);
        assert_offset_values(false, true, address(0), 0);

        Store.storeAddress(address(_c), offsetAddress.slot, offsetAddress.offset, address(0x1234567890));
        assert_offset_values(false, true, address(0x1234567890), 0);

        Store.storeAddress(address(_c), offsetAddress.slot, offsetAddress.offset, address(0x12345));
        assert_offset_values(false, true, address(0x12345), 0);

        Store.storeAddress(address(_c), offsetAddress.slot, offsetAddress.offset, address(0x12345));
        assert_offset_values(false, true, address(0x12345), 0);

        Store.storeInt64(address(_c), offsetInt64.slot, offsetInt64.offset, 0x1122334455667788);
        assert_offset_values(false, true, address(0x12345), 0x1122334455667788);

        Store.storeInt64(address(_c), offsetInt64.slot, offsetInt64.offset, 0x12345678);
        assert_offset_values(false, true, address(0x12345), 0x12345678);

        Store.storeInt64(address(_c), offsetInt64.slot, offsetInt64.offset, 0x0);
        assert_offset_values(false, true, address(0x12345), 0x0);
    }

    function test_store_offset_at_end_of_slot() external {
        Slot memory offset12 = _c.offset12Slot();
        console.log("offset12 slot:%d offset:%d", offset12.slot, offset12.offset);

        assertEq(_c.offset12(), address(0));

        Store.storeAddress(address(_c), offset12.slot, offset12.offset, address(0x1234567890));
        assertEq(_c.offset12(), address(0x1234567890));
    }
}

struct Slot {
    uint256 slot;
    uint8 offset;
}

contract C {
    string public name;
    uint256 public gap1;
    string public symbol;
    bytes public someBytes;
    uint256 public gap2;
    bytes public someOtherBytes;
    bool public someBool;
    bytes32 public someBytes32;
    address public someAddress;
    uint256 public gap3;

    bool public offsetBool1;
    function offsetBool1Slot() external pure returns (Slot memory) {
        uint256 slot; uint8 offset;
        assembly {
            slot := offsetBool1.slot
            offset := offsetBool1.offset
        }
        return Slot(slot, offset);
    }

    bool public offsetBool2;
    function offsetBool2Slot() external pure returns (Slot memory) {
        uint256 slot; uint8 offset;
        assembly {
            slot := offsetBool2.slot
            offset := offsetBool2.offset
        }
        return Slot(slot, offset);
    }

    address public offsetAddress;
    function offsetAddressSlot() external pure returns (Slot memory) {
        uint256 slot; uint8 offset;
        assembly {
            slot := offsetAddress.slot
            offset := offsetAddress.offset
        }
        return Slot(slot, offset);
    }

    int64 public offsetInt64;
    function offsetInt64Slot() external pure returns (Slot memory) {
        uint256 slot; uint8 offset;
        assembly {
            slot := offsetInt64.slot
            offset := offsetInt64.offset
        }
        return Slot(slot, offset);
    }

    uint96 public __12_offset_span;
    address public offset12;
    function offset12Slot() external pure returns (Slot memory) {
        uint256 slot; uint8 offset;
        assembly {
            slot := offset12.slot
            offset := offset12.offset
        }
        return Slot(slot, offset);
    }
}
