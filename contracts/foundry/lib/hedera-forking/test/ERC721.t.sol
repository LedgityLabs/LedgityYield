// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {IERC721Events} from "../contracts/HtsSystemContract.sol";
import {Test, console} from "forge-std/Test.sol";
import {IERC721} from "../contracts/IERC721.sol";
import {TestSetup} from "./lib/TestSetup.sol";

contract ERC721TokenTest is Test, TestSetup {

    function setUp() external {
        setUpMockStorageForNonFork();
    }

    function test_ERC721_name() external view {
        assertEq(IERC721(CFNFTFF).name(), "Custom Fee NFT (Fixed Fee)");
    }

    function test_ERC721_symbol() external view {
        assertEq(IERC721(CFNFTFF).symbol(), "CFNFTFF");
    }

    function test_ERC721_totalSupply() external view {
        assertEq(IERC721(CFNFTFF).totalSupply(), 2);
    }

    function test_ERC721_balanceOf() external view {
        assertEq(IERC721(CFNFTFF).balanceOf(CFNFTFF_TREASURY), 2);
    }

    function test_ERC721_ownerOf() external view {
        uint256 tokenId = 1;
        assertEq(IERC721(CFNFTFF).ownerOf(tokenId), CFNFTFF_TREASURY);
    }

    function test_ERC721_transferFrom() external {
        address to = makeAddr("recipient");
        uint256 tokenId = 1;
        vm.startPrank(CFNFTFF_TREASURY);
        vm.expectEmit(CFNFTFF);
        emit IERC721Events.Transfer(CFNFTFF_TREASURY, to, tokenId);
        IERC721(CFNFTFF).transferFrom(CFNFTFF_TREASURY, to, tokenId);
        vm.stopPrank();
        assertEq(IERC721(CFNFTFF).ownerOf(tokenId), to);
    }

    function test_ERC721_approve() external {
        address spender = makeAddr("spender");
        uint256 tokenId = 1;
        vm.startPrank(CFNFTFF_TREASURY);
        vm.expectEmit(CFNFTFF);
        emit IERC721Events.Approval(CFNFTFF_TREASURY, spender, tokenId);
        IERC721(CFNFTFF).approve(spender, tokenId);
        vm.stopPrank();
        assertEq(IERC721(CFNFTFF).getApproved(tokenId), spender);
    }

    function test_ERC721_setApprovalForAll() external {
        address operator = makeAddr("operator");
        vm.prank(CFNFTFF_TREASURY);
        vm.expectEmit(CFNFTFF);
        emit IERC721Events.ApprovalForAll(CFNFTFF_TREASURY, operator, true);
        IERC721(CFNFTFF).setApprovalForAll(operator, true);
        assertTrue(IERC721(CFNFTFF).isApprovedForAll(CFNFTFF_TREASURY, operator));
    }

    function test_ERC721_getApproved() external view {
        uint256 tokenId = 1;
        assertEq(IERC721(CFNFTFF).getApproved(tokenId), CFNFTFF_ALLOWED_SPENDER);
    }

    function test_ERC721_isApprovedForAll() external view {
        assertFalse(IERC721(CFNFTFF).isApprovedForAll(CFNFTFF_TREASURY, CFNFTFF_ALLOWED_SPENDER));
    }

    function test_ERC721_tokenURI_shorter_than_31_bytes() external view {
        uint256 serialId = 2;
        string memory uri = "https://example.com/1";
        assertEq(IERC721(CFNFTFF).tokenURI(serialId), uri);
    }

    function test_ERC721_tokenURI_longer_than_31_bytes() external view {
        uint256 serialId = 1;
        string memory uri = "https://very-long-string-which-exceeds-31-bytes-and-requires-multiple-storage-slots.com/1";
        assertEq(IERC721(CFNFTFF).tokenURI(serialId), uri);
    }
}
