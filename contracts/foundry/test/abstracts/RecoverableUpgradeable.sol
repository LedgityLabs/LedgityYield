// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../lib/forge-std/src/Test.sol";
import {ModifiersExpectations} from "../_helpers/ModifiersExpectations.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {RecoverableUpgradeable} from "../../../src/abstracts/RecoverableUpgradeable.sol";
import {GlobalOwner} from "../../../src/GlobalOwner.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {GenericERC20} from "../../../src/GenericERC20.sol";

contract TestedContract is Initializable, UUPSUpgradeable, RecoverableUpgradeable {
    constructor() {
        _disableInitializers();
    }

    function initialize(address globalOwner_) public initializer {
        __UUPSUpgradeable_init();
        __Recoverable_init(globalOwner_);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}

contract Tests is Test, ModifiersExpectations {
    TestedContract tested;
    GlobalOwner globalOwner;
    GenericERC20 recoveredToken;

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

        // Deploy GenericERC20
        recoveredToken = new GenericERC20("Dummy Token", "DUMMY", 18);
    }

    // =============================
    // === initialize() function ===
    function test_initialize_1() public {
        console.log("Should properly set global owner");
        assertEq(tested.globalOwner(), address(globalOwner));
    }

    // ===============================
    // === recoverERC20() function ===
    function test_recoverERC20_1() public {
        console.log("Should fail if not called by owner");
        expectRevertOnlyOwner();
        vm.prank(address(1234));
        tested.recoverERC20(address(1234), 9999);
    }

    function test_recoverERC20_2() public {
        console.log("Should fail if there is 0 token to recover");
        vm.expectRevert(bytes("RecoverableUpgradeable: not enough tokens to recover"));
        tested.recoverERC20(address(1234), 9999);
    }

    function test_recoverERC20_3() public {
        console.log("Should fail if there is not enough token to recover");

        // Mint only 1000 tokens to recoverable contract
        deal(address(recoveredToken), address(tested), 1000);

        vm.expectRevert(bytes("RecoverableUpgradeable: not enough tokens to recover"));
        tested.recoverERC20(address(1234), 9999);
    }

    function test_recoverERC20_4(uint256 recoverableAmount, uint256 recoveredAmount) public {
        console.log("Should successfully recover tokens else");

        // Mint only 1000 tokens to recoverable contract
        deal(address(recoveredToken), address(tested), recoverableAmount);

        // Ensure recovered amount is lower than recoverable amount
        recoveredAmount = bound(recoveredAmount, 0, recoverableAmount);

        // Store current owner (this test contract) balance for later comparison
        uint256 oldOwnerBalance = recoveredToken.balanceOf(address(this));

        // Recover random amount of tokens
        tested.recoverERC20(address(1234), recoveredAmount);

        // Check that recovered amount is now in owner balance
        assertEq(recoveredToken.balanceOf(address(this)), oldOwnerBalance + recoveredAmount);
    }
}
