// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/forge-std/src/Test.sol";
import {ModifiersExpectations} from "./_helpers/ModifiersExpectations.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import {GlobalPause} from "../../src/GlobalPause.sol";
import {GlobalOwner} from "../../src/GlobalOwner.sol";

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract Tests is Test, ModifiersExpectations {
    GlobalOwner globalOwner;
    GlobalPause globalPause;

    function setUp() public {
        // Deploy GlobalOwner
        GlobalOwner impl = new GlobalOwner();
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), "");
        globalOwner = GlobalOwner(address(proxy));
        globalOwner.initialize();
        vm.label(address(globalOwner), "GlobalOwner");

        // Deploy GlobalPause
        GlobalPause impl2 = new GlobalPause();
        ERC1967Proxy proxy2 = new ERC1967Proxy(address(impl2), "");
        globalPause = GlobalPause(address(proxy2));
        globalPause.initialize(address(globalOwner));
        vm.label(address(globalPause), "GlobalPause");
    }

    // =============================
    // === initialize() function ===
    function test_initialize_1() public {
        console.log("Shouldn't be re-initializable");
        vm.expectRevert(bytes("Initializable: contract is already initialized"));
        globalPause.initialize(address(globalOwner));
    }

    function test_initialize_2() public {
        console.log("Should properly set global owner");
        assertEq(globalPause.globalOwner(), address(globalOwner));
    }

    // ========================
    // === pause() function ===
    function test_pause_1() public {
        console.log("Should fail if not called by owner");
        expectRevertOnlyOwner();
        vm.prank(address(1234));
        globalPause.pause();
    }

    function test_pause_2() public {
        console.log("Should change output of paused() to 'false' else");
        globalPause.pause();
        assertEq(globalPause.paused(), true);
    }

    // ========================
    // === unpause() function ===
    function test_unpause_1() public {
        console.log("Should fail if not called by owner");
        expectRevertOnlyOwner();
        vm.prank(address(1234));
        globalPause.unpause();
    }

    function test_unpause_2() public {
        console.log("Should change output of paused() to 'false' else");

        globalPause.pause();
        assertEq(globalPause.paused(), true);
        globalPause.unpause();
        assertEq(globalPause.paused(), false);
    }

    // Other functions belong to OpenZeppelin PausableUpgradeable and are so tested in their repo
}
