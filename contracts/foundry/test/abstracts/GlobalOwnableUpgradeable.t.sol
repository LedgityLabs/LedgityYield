// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../../lib/forge-std/src/Test.sol";
import {ModifiersExpectations} from "../_helpers/ModifiersExpectations.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {GlobalOwnableUpgradeable} from "../../../src/abstracts/GlobalOwnableUpgradeable.sol";
import {GlobalOwner} from "../../../src/GlobalOwner.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract TestedContract is Initializable, UUPSUpgradeable, GlobalOwnableUpgradeable {
    constructor() {
        _disableInitializers();
    }

    function initialize(address globalOwner_) public initializer {
        __UUPSUpgradeable_init();
        __GlobalOwnable_init(globalOwner_);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function restrictedFunction() public view onlyOwner returns (bool) {
        return true;
    }
}

contract Tests is Test, ModifiersExpectations {
    TestedContract tested;
    GlobalOwner globalOwner;

    function setUp() public {
        // Deploy GlobalOwner
        GlobalOwner impl = new GlobalOwner();
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), "");
        globalOwner = GlobalOwner(address(proxy));
        globalOwner.initialize();
        vm.label(address(globalOwner), "GlobalOwner");

        // Deploy tested contract
        TestedContract impl2 = new TestedContract();
        ERC1967Proxy proxy2 = new ERC1967Proxy(address(impl2), "");
        tested = TestedContract(address(proxy2));
        tested.initialize(address(globalOwner));
        vm.label(address(tested), "TestedContract");
    }

    // ==============================
    // === globalOwner() function ===
    function test_globalOwner_1() public {
        console.log("Should return address given during initialization");
        assertEq(tested.globalOwner(), address(globalOwner));
    }

    // ==============================
    // === owner() function ===
    function test_owner_1() public {
        console.log("Should mirror globalOwner.owner()");
        assertEq(tested.owner(), globalOwner.owner());

        // Transfer the ownsership to ensure that tested.owner() indeed mirrors globalOwner.owner()
        globalOwner.transferOwnership(address(1234));
        vm.prank(address(1234));
        globalOwner.acceptOwnership();
        assertEq(tested.owner(), address(1234));
    }

    // ============================
    // === onlyOwner modifier ===
    function test_onlyOwner_1() public {
        console.log("Should allow calls from owner");
        assertEq(tested.restrictedFunction(), true);
    }

    function test_onlyOwner_2() public {
        console.log("Should revert calls from non-owner account");
        expectRevertOnlyOwner();
        vm.prank(address(0));
        tested.restrictedFunction();
    }

    // ===========================
    // === transferOwnership() ===
    function testFuzz_transferOwnership_1(address newOwner) public {
        console.log("Should revert in any case");
        vm.expectRevert(bytes("GlobalOwnableUpgradeable: change global owner instead"));
        tested.transferOwnership(newOwner);
    }
}
