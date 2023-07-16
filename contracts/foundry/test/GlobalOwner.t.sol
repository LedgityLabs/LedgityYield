// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/forge-std/src/Test.sol";
import {ModifiersExpectations} from "./_helpers/ModifiersExpectations.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {GlobalOwner} from "../../src/GlobalOwner.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract TestedContract is GlobalOwner {
    function public_authorizeUpgrade(address newImplementation) public {
        _authorizeUpgrade(newImplementation);
    }
}

contract Tests is Test, ModifiersExpectations {
    TestedContract tested;

    function setUp() public {
        // Deploy GlobalOwner
        GlobalOwner impl = new TestedContract();
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), "");
        tested = TestedContract(address(proxy));
        tested.initialize();
        vm.label(address(tested), "GlobalOwner");
    }

    // =============================
    // === initialize() function ===
    function test_initialize_1() public {
        console.log("Shouldn't be re-initializable");
        vm.expectRevert(bytes("Initializable: contract is already initialized"));
        tested.initialize();
    }

    // ====================================
    // === _authorizeUpgrade() function ===
    function test_authorizeUpgrade_1() public {
        console.log("Should revert if called by non-owner account");
        vm.prank(address(1234));
        expectRevertOnlyOwner();
        tested.public_authorizeUpgrade(address(0));
    }

    // Other functions belong to OpenZeppelin Ownable2StepUpgradeable and are so tested in their repo
}
