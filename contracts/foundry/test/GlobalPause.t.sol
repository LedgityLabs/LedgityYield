// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";
import { ModifiersExpectations } from "./_helpers/ModifiersExpectations.sol";

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import { GlobalPause } from "../../src/GlobalPause.sol";
import { GlobalOwner } from "../../src/GlobalOwner.sol";

import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract TestedContract is GlobalPause {
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

    // Deploy GlobalPause
    TestedContract impl2 = new TestedContract();
    ERC1967Proxy proxy2 = new ERC1967Proxy(address(impl2), "");
    tested = TestedContract(address(proxy2));
    tested.initialize(address(globalOwner));
    vm.label(address(tested), "GlobalPause");
  }

  // =============================
  // === initialize() function ===
  function test_initialize_1() public {
    console.log("Shouldn't be re-initializable");
    vm.expectRevert(
      bytes("Initializable: contract is already initialized")
    );
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

  // ========================
  // === pause() function ===
  function testFuzz_pause_1(address account) public {
    console.log("Should revert if not called by owner");

    // Ensure the random account is not the fund wallet
    vm.assume(account != tested.owner());

    // Expect revert
    expectRevertOnlyOwner();
    vm.prank(account);
    tested.pause();
  }

  function test_pause_2() public {
    console.log("Should change output of paused() to 'false' else");
    tested.pause();
    assertEq(tested.paused(), true);
  }

  // ==========================
  // === unpause() function ===
  function testFuzz_unpause_1(address account) public {
    console.log("Should revert if not called by owner");

    // Ensure the random account is not the fund wallet
    vm.assume(account != tested.owner());

    // Expect revert
    expectRevertOnlyOwner();
    vm.prank(account);
    tested.unpause();
  }

  function test_unpause_2() public {
    console.log("Should change output of paused() to 'false' else");

    tested.pause();
    assertEq(tested.paused(), true);
    tested.unpause();
    assertEq(tested.paused(), false);
  }

  // Other functions belong to OpenZeppelin PausableUpgradeable and are so tested in their repo
}
