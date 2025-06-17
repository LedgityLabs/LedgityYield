// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.6.0;

/**
 * @dev This library provides utility functions that operate on `string`s.
 *
 * Notice we cannot use the `string.concat` function provided by Solidity because they have changed its signature.
 * From https://soliditylang.org/blog/2022/02/16/solidity-0.8.12-release-announcement/
 *
 * > General: `string.concat` now properly takes strings as arguments and returns string memory.
 * > It was accidentally introduced as a copy of `bytes.concat` before.
 * 
 * Therefore this library provides a `concat` function with support for different arities.
 */
library Str {
    function concat(string memory s1, string memory s2) internal pure returns (string memory) {
        return string(abi.encodePacked(s1, s2));
    }

    function concat(string memory s1, string memory s2, string memory s3) internal pure returns (string memory) {
        return string(abi.encodePacked(s1, s2, s3));
    }

    function concat(string memory s1, string memory s2, string memory s3, string memory s4) internal pure returns (string memory) {
        return string(abi.encodePacked(s1, s2, s3, s4));
    }

    function concat(string memory s1, string memory s2, string memory s3, string memory s4, string memory s5) internal pure returns (string memory) {
        return string(abi.encodePacked(s1, s2, s3, s4, s5));
    }

    function concat(string memory s1, string memory s2, string memory s3, string memory s4, string memory s5, string memory s6) internal pure returns (string memory) {
        return string(abi.encodePacked(s1, s2, s3, s4, s5, s6));
    }

    function concat(string memory s1, string memory s2, string memory s3, string memory s4, string memory s5, string memory s6, string memory s7) internal pure returns (string memory) {
        return string(abi.encodePacked(s1, s2, s3, s4, s5, s6, s7));
    }
}
