// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../../../lib/forge-std/src/Test.sol";
import {ModifiersExpectations} from "../../_helpers/ModifiersExpectations.sol";

import {ERC20BaseUpgradeable} from "../../../../src/abstracts/base/ERC20BaseUpgradeable.sol";
import {GlobalOwner} from "../../../../src/GlobalOwner.sol";
import {GlobalPause} from "../../../../src/GlobalPause.sol";
import {GlobalBlacklist} from "../../../../src/GlobalBlacklist.sol";

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract TestedContract is ERC20BaseUpgradeable {
    function initialize(
        address globalOwner_,
        address globalPause_,
        address globalBlacklist_,
        string memory name_,
        string memory symbol_
    ) public initializer {
        __ERC20Base_init(globalOwner_, globalPause_, globalBlacklist_, name_, symbol_);
    }

    /**
     * @dev Public version of _beforeTokenTransfer() used in tests
     */
    function public_beforeTokenTransfer(address from, address to, uint256 amount) public {
        _beforeTokenTransfer(from, to, amount);
    }
}

contract Tests is Test, ModifiersExpectations {
    TestedContract tested;
    GlobalOwner globalOwner;
    GlobalPause globalPause;
    GlobalBlacklist globalBlacklist;
    string nameAtInitTime = "Dummy Token";
    string symbolAtInitTime = "DUMMY";

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

        // Deploy GlobalBlacklist
        GlobalBlacklist impl3 = new GlobalBlacklist();
        ERC1967Proxy proxy3 = new ERC1967Proxy(address(impl3), "");
        globalBlacklist = GlobalBlacklist(address(proxy3));
        globalBlacklist.initialize(address(globalOwner));
        vm.label(address(globalBlacklist), "GlobalBlacklist");

        // Deploy tested contract
        TestedContract impl4 = new TestedContract();
        ERC1967Proxy proxy4 = new ERC1967Proxy(address(impl4), "");
        tested = TestedContract(address(proxy4));
        tested.initialize(
            address(globalOwner),
            address(globalPause),
            address(globalBlacklist),
            nameAtInitTime,
            symbolAtInitTime
        );
        vm.label(address(tested), "TestedContract");
    }

    // =============================
    // === initialize() function ===
    function test_initialize_1() public {
        console.log("Should properly set global owner");
        assertEq(tested.globalOwner(), address(globalOwner));
    }

    function test_initialize_2() public {
        console.log("Should properly set global pause");
        assertEq(tested.globalPause(), address(globalPause));
    }

    function test_initialize_3() public {
        console.log("Should properly set global blacklist");
        assertEq(tested.globalBlacklist(), address(globalBlacklist));
    }

    function test_initialize_4() public {
        console.log("Should properly set ERC20 symbol");
        assertEq(tested.symbol(), symbolAtInitTime);
    }

    function test_initialize_5() public {
        console.log("Should properly set ERC20 name");
        assertEq(tested.name(), nameAtInitTime);
    }

    // ==============================
    // === _beforeTokenTransfer() ===
    function testFuzz_beforeTokenTransfer_1(address from, address to, uint256 amount) public {
        console.log("Should prevent transfer when contract is paused");
        globalPause.pause();
        expectRevertPaused();
        tested.public_beforeTokenTransfer(from, to, amount);
    }

    function testFuzz_beforeTokenTransfer_2(
        address from,
        address to,
        uint256 amount,
        bool fromBlacklisted,
        bool toBlacklisted
    ) public {
        console.log("Should prevent transfer when one or both addresses are blacklisted");

        // Ensure from and to addresses are different and not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Randomly blacklist from address
        if (fromBlacklisted) globalBlacklist.blacklist(from);

        // Randomly blacklist to address
        if (toBlacklisted) globalBlacklist.blacklist(to);

        // Expect revert if one or both addresses are blacklisted
        if (fromBlacklisted || toBlacklisted) expectRevertRestricted();
        tested.public_beforeTokenTransfer(from, to, amount);
    }

    function testfuzz_beforeTokenTransfer_3(address from, address to, uint256 amount) public {
        console.log("Shouldn't revert else");
        tested.public_beforeTokenTransfer(from, to, amount);
    }
}
