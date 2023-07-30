// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../../lib/forge-std/src/Test.sol";
import {ModifiersExpectations} from "../_helpers/ModifiersExpectations.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {GlobalPausableUpgradeable} from "../../../src/abstracts/GlobalPausableUpgradeable.sol";
import {GlobalOwner} from "../../../src/GlobalOwner.sol";
import {GlobalPause} from "../../../src/GlobalPause.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract TestedContract is Initializable, UUPSUpgradeable, GlobalPausableUpgradeable {
    constructor() {
        _disableInitializers();
    }

    function initialize(address globalPause_) public initializer {
        __UUPSUpgradeable_init();
        __GlobalPausable_init(globalPause_);
    }

    function _authorizeUpgrade(address newImplementation) internal override {}

    function restrictedFunction() public view whenNotPaused returns (bool) {
        return true;
    }
}

contract Tests is Test, ModifiersExpectations {
    TestedContract tested;
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
        GlobalPause impl3 = new GlobalPause();
        ERC1967Proxy proxy3 = new ERC1967Proxy(address(impl3), "");
        globalPause = GlobalPause(address(proxy3));
        globalPause.initialize(address(globalOwner));
        vm.label(address(globalPause), "GlobalPause");

        // Deploy tested contract
        TestedContract impl2 = new TestedContract();
        ERC1967Proxy proxy2 = new ERC1967Proxy(address(impl2), "");
        tested = TestedContract(address(proxy2));
        tested.initialize(address(globalPause));
        vm.label(address(tested), "TestedContract");
    }

    // ==================================
    // === globalPause() function ===
    function test_globalPause_1() public {
        console.log("Should return address given during initialization");
        assertEq(tested.globalPause(), address(globalPause));
    }

    // ===============================
    // === whenNotPaused modifier ===
    function test_whenNotPaused_1() public {
        console.log("Should allow calls when globalPause is not paused");
        assertEq(tested.restrictedFunction(), true);
    }

    function test_whenNotPaused_2() public {
        console.log("Should revert calls when globalPause is paused");
        globalPause.pause();
        expectRevertPaused();
        tested.restrictedFunction();
    }

    // ===============================
    // === paused() function ===
    function test_paused_1() public {
        console.log("Should mirror globalPause.paused()");
        assertEq(tested.paused(), globalPause.paused());

        // Pause globalPause to ensure that tested.paused() indeed mirrors globalPause.paused()
        assertEq(tested.paused(), false);
        globalPause.pause();
        assertEq(tested.paused(), true);
    }
}
