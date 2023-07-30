// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../../lib/forge-std/src/Test.sol";
import {ModifiersExpectations} from "../_helpers/ModifiersExpectations.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {GlobalRestrictableUpgradeable} from "../../../src/abstracts/GlobalRestrictableUpgradeable.sol";
import {GlobalOwner} from "../../../src/GlobalOwner.sol";
import {GlobalBlacklist} from "../../../src/GlobalBlacklist.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract TestedContract is Initializable, UUPSUpgradeable, GlobalRestrictableUpgradeable {
    constructor() {
        _disableInitializers();
    }

    function initialize(address globalBlacklist_) public initializer {
        __UUPSUpgradeable_init();
        __GlobalRestrictable_init(globalBlacklist_);
    }

    function _authorizeUpgrade(address newImplementation) internal override {}

    function restrictedFunction() public view notBlacklisted(msg.sender) returns (bool) {
        return true;
    }

    function public_isBlacklisted(address account) public view returns (bool) {
        return isBlacklisted(account);
    }
}

contract Tests is Test, ModifiersExpectations {
    TestedContract tested;
    GlobalOwner globalOwner;
    GlobalBlacklist globalBlacklist;

    function setUp() public {
        // Deploy GlobalOwner
        GlobalOwner impl = new GlobalOwner();
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), "");
        globalOwner = GlobalOwner(address(proxy));
        globalOwner.initialize();
        vm.label(address(globalOwner), "GlobalOwner");

        // Deploy GlobalBlacklist
        GlobalBlacklist impl3 = new GlobalBlacklist();
        ERC1967Proxy proxy3 = new ERC1967Proxy(address(impl3), "");
        globalBlacklist = GlobalBlacklist(address(proxy3));
        globalBlacklist.initialize(address(globalOwner));
        vm.label(address(globalBlacklist), "GlobalBlacklist");

        // Deploy tested contract
        TestedContract impl2 = new TestedContract();
        ERC1967Proxy proxy2 = new ERC1967Proxy(address(impl2), "");
        tested = TestedContract(address(proxy2));
        tested.initialize(address(globalBlacklist));
        vm.label(address(tested), "TestedContract");
    }

    // ==================================
    // === globalBlacklist() function ===
    function test_globalBlacklist_1() public {
        console.log("Should return address given during initialization");
        assertEq(tested.globalBlacklist(), address(globalBlacklist));
    }

    // ===============================
    // === notBlacklisted modifier ===
    function test_notBlacklisted_1() public {
        console.log("Should allow calls from non-blacklisted account");
        assertEq(tested.restrictedFunction(), true);
    }

    function test_notBlacklisted_2() public {
        console.log("Should revert calls from blacklisted account");
        globalBlacklist.blacklist(address(1234));
        vm.prank(address(1234));
        expectRevertRestricted();
        tested.restrictedFunction();
    }

    // ===============================
    // === isBlacklisted() function ===
    function test_isBlacklisted_1() public {
        console.log("Should mirror globalBlacklist.isBlacklisted()");
        assertEq(tested.public_isBlacklisted(address(1)), globalBlacklist.isBlacklisted(address(1)));

        // Blacklist address(1) to ensure that tested.isBlacklisted() indeed mirrors globalBlacklist.isBlacklisted()
        assertEq(tested.public_isBlacklisted(address(1)), false);
        globalBlacklist.blacklist(address(1));
        assertEq(tested.public_isBlacklisted(address(1)), true);
    }
}
