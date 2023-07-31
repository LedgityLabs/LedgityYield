// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../../lib/forge-std/src/Test.sol";

contract ModifiersExpectations is Test {
    function expectRevertOnlyOwner() public {
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
    }

    function expectRevertPaused() public {
        vm.expectRevert(bytes("Pausable: paused"));
    }

    function expectRevertRestricted() public {
        vm.expectRevert(bytes("L9"));
    }
}
