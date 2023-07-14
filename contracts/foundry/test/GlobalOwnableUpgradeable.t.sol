// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/forge-std/src/Test.sol";

import "../../src/abstracts/GlobalOwnableUpgradeable.sol";
import {GlobalOwner} from "../../src/GlobalOwner.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestedContract is GlobalOwnableUpgradeable {
    constructor() {
        _disableInitializers();
    }

    function initialize(address globalOwner_) public initializer {
        __GlobalOwnable_init(globalOwner_);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function restrictedFunction() public view onlyOwner returns (bool) {
        return true;
    }
}

contract TestsList is Test {
    TestedContract tested;
    address globalOwnerAtInitTime;

    function setUp() public {
        // Deploy GlobalOwner
        GlobalOwner impl = new GlobalOwner();
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), "");
        GlobalOwner globalOwner = GlobalOwner(address(proxy));
        globalOwner.initialize();
        vm.label(address(globalOwner), "GlobalOwner");
        globalOwnerAtInitTime = address(globalOwner);

        // Deploy tested contract
        TestedContract impl2 = new TestedContract();
        ERC1967Proxy proxy2 = new ERC1967Proxy(address(impl2), "");
        tested = TestedContract(address(proxy2));
        tested.initialize(globalOwnerAtInitTime);
        vm.label(address(tested), "TestedContract");
    }

    // ==============================
    // === globalOwner() function ===
    function test_globalOwner_1() public {
        console.log("Should return address given during initialization");
        assertEq(tested.globalOwner(), globalOwnerAtInitTime);
    }

    // ==============================
    // === owner() function ===
    function test_owner_1() public {
        console.log("Should return globalOwner's owner");
        assertEq(tested.owner(), GlobalOwner(globalOwnerAtInitTime).owner());
    }

    // ============================
    // === onlyOwner modifier ===
    function test_onlyOwner_1() public {
        console.log("Should allow calls from owner");
        assertEq(tested.restrictedFunction(), true);
    }

    function test_onlyOwner_2() public {
        console.log("Should revert calls from non-owner account");
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        vm.prank(address(0));
        tested.restrictedFunction();
    }

    // ===========================
    // === transferOwnership() ===
    function testFuzz_transferOwnership_1() public {
        console.log("Should revert in any case");
        vm.expectRevert(bytes("GlobalOwnableUpgradeable: change global owner instead"));
        tested.transferOwnership(msg.sender);
    }
}
