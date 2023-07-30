// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../lib/forge-std/src/Test.sol";
import {ModifiersExpectations} from "./_helpers/ModifiersExpectations.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import {GlobalBlacklist} from "../../src/GlobalBlacklist.sol";
import {GlobalOwner} from "../../src/GlobalOwner.sol";

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract TestedContract is GlobalBlacklist {
    function public_authorizeUpgrade(address newImplementation) public {
        _authorizeUpgrade(newImplementation);
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

        // Deploy GlobalBlacklist
        TestedContract impl2 = new TestedContract();
        ERC1967Proxy proxy2 = new ERC1967Proxy(address(impl2), "");
        tested = TestedContract(address(proxy2));
        tested.initialize(address(globalOwner));
        vm.label(address(tested), "GlobalBlacklist");
    }

    // =============================
    // === initialize() function ===
    function test_initialize_1() public {
        console.log("Shouldn't be re-initializable");
        vm.expectRevert(bytes("Initializable: contract is already initialized"));
        tested.initialize(address(globalOwner));
    }

    function test_initialize_2() public {
        console.log("Should properly set global owner");
        assertEq(tested.globalOwner(), address(globalOwner));
    }

    // ====================================
    // === _authorizeUpgrade() function ===
    function test_authorizeUpgrade_1() public {
        console.log("Should revert if called by non-owner account");
        vm.prank(address(1234));
        expectRevertOnlyOwner();
        tested.public_authorizeUpgrade(address(0));
    }

    // ============================
    // === blacklist() function ===
    // ========================
    function test_blacklist_1(address account) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.blacklist(address(4321));
    }

    function test_blacklist_2() public {
        console.log("Shouldn't allow blacklisting the zero address");

        vm.expectRevert(bytes("GlobalBlacklist: cannot blacklist zero address"));
        tested.blacklist(address(0));
    }

    function test_blacklist_3() public {
        console.log("Should change output of isBlacklisted() for a given address to 'true'");

        tested.blacklist(address(1234));
        assertEq(tested.isBlacklisted(address(1234)), true);
    }

    // ==============================
    // === unBlacklist() function ===
    function test_unBlacklist_1(address account, address blacklistedAccount) public {
        console.log("Should revert if not called by owner");
        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.unBlacklist(blacklistedAccount);
    }

    function test_unBlacklist_2() public {
        console.log("Should change output of isBlacklisted() for a given address to 'false'");

        tested.blacklist(address(1234));
        assertEq(tested.isBlacklisted(address(1234)), true);
        tested.unBlacklist(address(1234));
        assertEq(tested.isBlacklisted(address(1234)), false);
    }

    // ================================
    // === isBlacklisted() function ===
    function invariant_isBlacklisted_1() public {
        console.log("Should always return false for zero address");
        assertEq(tested.isBlacklisted(address(0)), false);
    }

    function test_isBlacklisted_2(bool blacklisted1, bool blacklisted2) public {
        console.log(
            "Should return true.false for a given address if the last call on it was respectively blacklist/unBlacklist"
        );

        if (blacklisted1) tested.blacklist(address(1234));
        else tested.unBlacklist(address(1234));
        assertEq(tested.isBlacklisted(address(1234)), blacklisted1);

        if (blacklisted2) tested.blacklist(address(1234));
        else tested.unBlacklist(address(1234));
        assertEq(tested.isBlacklisted(address(1234)), blacklisted2);
    }
}
