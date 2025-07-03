// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {Hsc} from "hedera-forking/Hsc.sol";
import {IERC721} from "hedera-forking/IERC721.sol";

contract NFTExampleTest is Test {
    // https://hashscan.io/mainnet/token/0.0.5083205
    address NFT_mainnet = 0x00000000000000000000000000000000004d9045;

    address private user;

    function setUp() external {
        Hsc.htsSetup();

        user = makeAddr("user");
        dealERC721(NFT_mainnet, user, 3);
    }

    function test_get_owner_of_existing_account() view external {
        address owner = IERC721(NFT_mainnet).ownerOf(1);
        assertNotEq(IERC721(NFT_mainnet).ownerOf(1), address(0));

        // The assertion below cannot be guaranteed, since we can only query the current owner of the NFT,
        // Note that the ownership of the NFT may change over time.
        assertEq(owner, 0x000000000000000000000000000000000006889a);
    }

    function test_dealt_nft_assigned_to_local_account() view external {
        assertEq(IERC721(NFT_mainnet).ownerOf(3), user);
    }

    function test_using_console_log() view external {
        string memory name = IERC721(NFT_mainnet).name();
        string memory symbol = IERC721(NFT_mainnet).symbol();
        string memory tokenURI = IERC721(NFT_mainnet).tokenURI(1);
        assertEq(name, "THE BARKANEERS");
        assertEq(symbol, "BARKANEERS");
        assertEq(tokenURI, "ipfs://bafkreif4hpsgflzzvd7c4abx5u5xwrrjl7wkimbjtndvkxodklxdam5upm");
        console.log("name: %s, symbol: %s, tokenURI: %s", name, symbol, tokenURI);
    }
}
