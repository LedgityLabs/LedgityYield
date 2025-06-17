// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Vm} from "forge-std/Vm.sol";

/**
 * @dev This library provides utility functions to store values of different types
 * to an address' storage slot.
 * 
 * Values are stored using `vm.store`.
 * This allows `view` functions to modify the state.
 * Most notably this is used when fetching remote data and
 * stored in the address' storage slot before it can be returned.
 * 
 * For types smaller than 32 bytes,
 * it support storing them in a non-zero `offset`.
 * A non-zero `offset` is used by Solidity to pack many fields into a single storage slot.
 */
library Store {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function storeString(address target, uint256 slot, string memory strvalue) internal {
        bytes memory value = bytes(strvalue);
        storeBytes(target, slot, value);
    }

    function storeBytes(address target, uint256 slot, bytes memory value) internal {
        uint256 length = value.length;

        if (length <= 31) {
            bytes32 slotValue = bytes32(value) | bytes32(length * 2);
            storeBytes32(target, slot, slotValue);
            return;
        }

        storeBytes32(target, slot, bytes32(length * 2 + 1));
        uint256 numChunks = (length + 31) / 32;
        bytes32 baseSlot = keccak256(abi.encodePacked(slot));

        for (uint256 i = 0; i < numChunks; i++) {
            uint256 chunkStart = i * 32;
            uint256 chunkEnd = chunkStart + 32;
            if (chunkEnd > length) {
                chunkEnd = length;
            }

            bytes32 chunk;
            for (uint256 j = chunkStart; j < chunkEnd; j++) {
                chunk |= bytes32(value[j]) >> (8 * (j - chunkStart));
            }

            storeBytes32(target, uint256(baseSlot) + i, chunk);
        }
    }

    function storeUint(address target, uint256 slot, uint256 value) internal {
        bytes32 uintData = bytes32(value);
        storeBytes32(target, slot, uintData);
    }

    function storeInt64(address target, uint256 slot, int64 value) internal {
        bytes32 data = bytes32(uint256(uint64(value)));
        storeBytes32(target, slot, data);
    }

    function storeInt64(address target, uint256 slot, uint8 offset, int64 value) internal {
        require(offset + 8 <= 32, "int64: offset out of range");

        bytes32 mask = bytes32(uint256(~uint64(0))) << (offset * 8);
        bytes32 slotData = vm.load(target, bytes32(slot)) & ~mask;
        bytes32 data = bytes32(uint256(uint64(value)));
        data = data << (offset * 8);
        data = slotData | data;
        
        storeBytes32(target, slot, data);
    }

    function storeBool(address target, uint256 slot, bool value) internal {
        bytes32 boolData = value ? bytes32(uint256(1)) : bytes32(uint256(0));
        storeBytes32(target, slot, boolData);
    }

    function storeBool(address target, uint256 slot, uint8 offset, bool value) internal {
        require(offset + 1 <= 32, "bool: offset out of range");

        bytes32 mask = bytes32(uint256(~uint8(0))) << (offset * 8);
        bytes32 slotData = vm.load(target, bytes32(slot)) & ~mask;
        bytes32 data = bytes32(uint256(value ? 1 : 0));
        data = data << (offset * 8);
        data = slotData | data;

        storeBytes32(target, slot, data);
    }

    function storeAddress(address target, uint256 slot, address value) internal {
        bytes32 data = bytes32(uint256(uint160(value)));
        storeBytes32(target, slot, data);
    }

    function storeAddress(address target, uint256 slot, uint8 offset, address value) internal {
        require(offset + 20 <= 32, "address: offset out of range");

        bytes32 mask = bytes32(uint256(~uint160(0))) << (offset * 8);
        bytes32 slotData = vm.load(target, bytes32(slot)) & ~mask;
        bytes32 data = bytes32(uint256(uint160(value)));
        data = data << (offset * 8);
        data = slotData | data;
        
        storeBytes32(target, slot, data);
    }

    function storeBytes32(address target, uint256 slot, bytes32 value) internal {
        vm.store(target, bytes32(slot), value);
    }
}
