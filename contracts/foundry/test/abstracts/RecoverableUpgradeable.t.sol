// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../../lib/forge-std/src/Test.sol";
import {ModifiersExpectations} from "../_helpers/ModifiersExpectations.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {RecoverableUpgradeable} from "../../../src/abstracts/RecoverableUpgradeable.sol";
import {GlobalOwner} from "../../../src/GlobalOwner.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {GenericERC20} from "../../../dev/GenericERC20.sol";

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
    function test_recoverERC20_1(
        address account,
        address tokenAddress,
        uint256 recoveredAmount
    ) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.recoverERC20(tokenAddress, recoveredAmount);
    }

    function test_recoverERC20_2() public {
        console.log("Should revert if call requests to recover 0 tokens");

        vm.expectRevert(bytes("L10"));
        tested.recoverERC20(address(recoveredToken), 0);
    }

    function test_recoverERC20_3() public {
        console.log("Should revert if given address is not an ERC20 contract");

        vm.expectRevert();
        tested.recoverERC20(address(1234), 0);
    }

    function test_recoverERC20_4() public {
        console.log("Should revert if there is 0 token to recover");

        vm.expectRevert(bytes("L11"));
        tested.recoverERC20(address(recoveredToken), 9999);
    }

    function test_recoverERC20_5() public {
        console.log("Should revert if there is not enough token to recover");

        // Mint only 1000 tokens to recoverable contract
        deal(address(recoveredToken), address(tested), 1000, true);

        vm.expectRevert(bytes("L11"));
        tested.recoverERC20(address(recoveredToken), 9999);
    }

    function test_recoverERC20_6(uint256 recoverableAmount, uint256 recoveredAmount) public {
        console.log("Should successfully recover tokens else");

        // Ensure recovered and recoverable is greater than 0
        vm.assume(recoverableAmount > 0);

        // Ensure recovered amount is lower than or equal recoverable amount
        recoveredAmount = bound(recoveredAmount, 1, recoverableAmount);

        // Mint only random number of tokens to recoverable contract
        deal(address(recoveredToken), address(tested), recoverableAmount, true);

        // Recover random amount of tokens
        tested.recoverERC20(address(recoveredToken), recoveredAmount);

        // Check that recovered amount is now in owner balance
        assertEq(recoveredToken.balanceOf(address(this)), recoveredAmount);
    }
}
