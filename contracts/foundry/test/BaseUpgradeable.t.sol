// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/forge-std/src/Test.sol";
import {ModifiersExpectations} from "./helpers/ModifiersExpectations.sol";

import {BaseUpgradeable} from "../../src/abstracts/base/BaseUpgradeable.sol";
import {GlobalOwner} from "../../src/GlobalOwner.sol";
import {GlobalPause} from "../../src/GlobalPause.sol";
import {GlobalBlacklist} from "../../src/GlobalBlacklist.sol";

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract TestedContract is BaseUpgradeable {
    function initialize(
        address globalOwner_,
        address globalPause_,
        address globalBlacklist_
    ) public initializer {
        __Base_init(globalOwner_, globalPause_, globalBlacklist_);
    }

    function publicAuthorizeUpgrade(address newImplementation) public {
        _authorizeUpgrade(newImplementation);
    }
}

contract Tests is Test, ModifiersExpectations {
    TestedContract tested;
    address globalOwnerAtInitTime;
    address globalPauseAtInitTime;
    address globalBlacklistAtInitTime;

    function setUp() public {
        // Deploy GlobalOwner
        GlobalOwner impl = new GlobalOwner();
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), "");
        GlobalOwner globalOwner = GlobalOwner(address(proxy));
        globalOwner.initialize();
        vm.label(address(globalOwner), "GlobalOwner");
        globalOwnerAtInitTime = address(globalOwner);

        // Deploy GlobalPause
        GlobalPause impl2 = new GlobalPause();
        ERC1967Proxy proxy2 = new ERC1967Proxy(address(impl2), "");
        GlobalPause globalPause = GlobalPause(address(proxy2));
        globalPause.initialize(address(globalOwner));
        vm.label(address(globalPause), "GlobalPause");
        globalPauseAtInitTime = address(globalPause);

        // Deploy GlobalBlacklist
        GlobalBlacklist impl3 = new GlobalBlacklist();
        ERC1967Proxy proxy3 = new ERC1967Proxy(address(impl3), "");
        GlobalBlacklist globalBlacklist = GlobalBlacklist(address(proxy3));
        globalBlacklist.initialize(address(globalOwner));
        vm.label(address(globalBlacklist), "GlobalBlacklist");
        globalBlacklistAtInitTime = address(globalBlacklist);

        // Deploy tested contract
        TestedContract impl4 = new TestedContract();
        ERC1967Proxy proxy4 = new ERC1967Proxy(address(impl4), "");
        tested = TestedContract(address(proxy4));
        tested.initialize(address(globalOwner), address(globalPause), address(globalBlacklist));
        vm.label(address(tested), "TestedContract");
    }

    // =============================
    // === initialize() function ===
    function test_initialize_1() public {
        console.log("Shouldn't be re-initializable");
        address globalOwner = tested.globalOwner();
        address globalPause = tested.globalPause();
        address globalBlacklist = tested.globalBlacklist();
        vm.expectRevert(bytes("Initializable: contract is already initialized"));
        tested.initialize(globalOwner, globalPause, globalBlacklist);
    }

    function test_initialize_2() public {
        console.log("Should properly set global owner");
        assertEq(tested.globalOwner(), globalOwnerAtInitTime);
    }

    function test_initialize_3() public {
        console.log("Should properly set global pause");
        assertEq(tested.globalPause(), globalPauseAtInitTime);
    }

    function test_initialize_4() public {
        console.log("Should properly set global blacklist");
        assertEq(tested.globalBlacklist(), globalBlacklistAtInitTime);
    }

    // =========================
    // === _authorizeUpgrade ===
    function test_authorizeUpgrade_1() public {
        console.log("Should revert if called by non-owner account");
        vm.prank(address(0));
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        tested.publicAuthorizeUpgrade(address(0));
    }
}
