// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/Surl.sol";

contract SurlTest is Test {
    string constant VALID_URL = "https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.4436613?transactions=false";
    string constant NOT_FOUND_URL = "https://testnet.mirrornode.hedera.com/api/v1/accounts/9.0.0";

    modifier isFFI() {
        vm.skip(address(0x167).code.length != 1); // Only run these tests when the FFI is expected to be enabled anyway
        _;
    }

    function testGetRequestSuccess() isFFI external {
        (uint256 status, bytes memory data) = Surl.get(VALID_URL);
        assertEq(status, 200);
        assertTrue(bytes(string(data)).length > 0);
    }

    function testGetRequestNotFound() isFFI external {
        (uint256 status, bytes memory data) = Surl.get(NOT_FOUND_URL);
        assertEq(status, 404);
        assertTrue(bytes(string(data)).length > 0);
    }
}
