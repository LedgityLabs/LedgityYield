// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {TestSetup} from "./lib/TestSetup.sol";
import {IHRC719} from "../contracts/IHRC719.sol";

contract IHRC719TokenAssociationTest is Test, TestSetup {
    function setUp() external {
        setUpMockStorageForNonFork();
    }

    function test_IHRC719_isAssociated() external {
        vm.prank(MFCT_TREASURY);
        assertEq(IHRC719(USDC).isAssociated(), false);
    }

    function test_IHRC719_associate() external {
        vm.startPrank(MFCT_TREASURY);
        assertEq(IHRC719(USDC).associate(), 1);
        assertEq(IHRC719(USDC).isAssociated(), true);
        vm.stopPrank();
    }

    function test_IHRC719_dissociate() external {
        vm.startPrank(MFCT_TREASURY);
        assertEq(IHRC719(USDC).dissociate(), 1);
        assertEq(IHRC719(USDC).isAssociated(), false);
        vm.stopPrank();
    }

     function test_IHRC719_associate_then_dissociate() external {
        vm.startPrank(MFCT_TREASURY);
        assertEq(IHRC719(USDC).associate(), 1);
        assertEq(IHRC719(USDC).isAssociated(), true);
        assertEq(IHRC719(USDC).dissociate(), 1);
        assertEq(IHRC719(USDC).isAssociated(), false);
        vm.stopPrank();
    }

    function test_IHRC719_different_accounts() external {
        vm.startPrank(MFCT_TREASURY);
        assertEq(IHRC719(USDC).associate(), 1);
        assertEq(IHRC719(USDC).isAssociated(), true);

        vm.startPrank(CFNFTFF_TREASURY);
        assertEq(IHRC719(USDC).isAssociated(), false);
        assertEq(IHRC719(USDC).associate(), 1);
        assertEq(IHRC719(USDC).isAssociated(), true);

        vm.startPrank(MFCT_TREASURY);
        assertEq(IHRC719(USDC).dissociate(), 1);
        assertEq(IHRC719(USDC).isAssociated(), false);

        vm.stopPrank();
    }

    function test_IHRC719_with_real_accounts() external {
        vm.startPrank(USDC_TREASURY);
        assertEq(IHRC719(USDC).isAssociated(), true);
        assertEq(IHRC719(USDC).dissociate(), 1);
        assertEq(IHRC719(USDC).isAssociated(), false);

        vm.startPrank(MFCT_TREASURY);
        assertEq(IHRC719(MFCT).isAssociated(), true);
        assertEq(IHRC719(MFCT).dissociate(), 1);
        assertEq(IHRC719(MFCT).isAssociated(), false);

        vm.stopPrank();
    }

    function test_IHRC719_with_non_existing_account() external {
        address alice = makeAddr('alice');
        vm.prank(alice);
        vm.expectRevert();
        IHRC719(USDC).isAssociated();
    }
}
