// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../../lib/forge-std/src/Test.sol";
import {ModifiersExpectations} from "../_helpers/ModifiersExpectations.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {InvestUpgradeable} from "../../../src/abstracts/InvestUpgradeable.sol";
import {GlobalOwner} from "../../../src/GlobalOwner.sol";
import {GlobalPause} from "../../../src/GlobalPause.sol";
import {GlobalBlacklist} from "../../../src/GlobalBlacklist.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {GenericERC20} from "../../../src/GenericERC20.sol";

import {UDS3} from "../../../src/libs/UDS3.sol";
import {APRCheckpoints as APRC} from "../../../src/libs/APRCheckpoints.sol";

contract TestedContract is InvestUpgradeable {
    mapping(address => uint256) public stakeOf;

    constructor() {
        _disableInitializers();
    }

    function initialize(
        address globalOwner_,
        address globalPause_,
        address globalBlacklist_,
        address invested_
    ) public initializer {
        __Invest_init(globalOwner_, globalPause_, globalBlacklist_, invested_);
    }

    /**
     * @dev Create simple stake and unstake functions to simulate investment.
     * Note that those functions doesn't even transfer invested token as
     * not necessary for the tests as no InvestUpgradeable function rely
     * on invested().balanceOf()
     */
    function stake(uint256 amount) public {
        _onInvestmentChange(msg.sender, false);
        stakeOf[msg.sender] += amount;
    }

    function unstake(uint256 amount) public {
        _onInvestmentChange(msg.sender, false);
        stakeOf[msg.sender] -= amount;
    }

    function _investmentOf(address account) internal view override returns (uint256) {
        return stakeOf[account];
    }

    /**
     * @dev Implementation of _distributeRewards() function that can be controlled by boolean
     * variables to simulate different scenarios.
     */
    uint256 public _distributeRewards_CallsCount;
    bool _distributeRewards_Implemented;
    bool _distributeRewards_ResetInvestmentPeriod;
    bool _distributeRewards_Autocompound;

    function set_distributeRewards_Implemented(bool value) public {
        _distributeRewards_Implemented = value;
    }

    function set_distributeRewards_ResetInvestmentPeriod(bool value) public {
        _distributeRewards_ResetInvestmentPeriod = value;
    }

    function set_distributeRewards_Autocompound(bool value) public {
        _distributeRewards_Autocompound = value;
    }

    function _distributeRewards(address account, uint256 amount) internal override returns (bool) {
        // Return false when not implemented
        if (!_distributeRewards_Implemented) return false;

        // Keep track of implemented calls count
        _distributeRewards_CallsCount++;

        // Reset investment period if requested
        if (_distributeRewards_ResetInvestmentPeriod) {
            _onInvestmentChange(account, _distributeRewards_Autocompound);
        }

        // In this implementation claiming == re-investing / compounding
        stakeOf[account] += amount;

        // Return true to simulate success
        return true;
    }

    function public_distributeRewards(address account, uint256 amount) public returns (bool) {
        return _distributeRewards(account, amount);
    }

    function public_toDecimals(uint256 n) public view returns (uint256) {
        return _toDecimals(n);
    }

    function public_fromDecimals(uint256 n) public view returns (uint256) {
        return _fromDecimals(n);
    }

    function public_toUDS3(uint256 n) public view returns (uint256) {
        return _toUDS3(n);
    }

    function public_fromUDS3(uint256 n) public view returns (uint256) {
        return _fromUDS3(n);
    }

    function public_calculatePeriodRewards(
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD3,
        uint256 investedAmount
    ) public view returns (uint256 rewards) {
        return _calculatePeriodRewards(beginTimestamp, endTimestamp, aprUD3, investedAmount);
    }

    function public_deepInvestmentOf(address account) public view returns (uint256 deepInvestedAmount) {
        return _deepInvestmentOf(account);
    }

    function public_rewardsOf(address account, bool autocompound) public view returns (uint256 rewards) {
        return _rewardsOf(account, autocompound);
    }

    function public_onInvestmentChange(address account, bool autocompound) public {
        _onInvestmentChange(account, autocompound);
    }

    function public_deepResetInvestmentPeriodOf(address account) public {
        _deepResetInvestmentPeriodOf(account);
    }

    function public_accountsInfos(address account) public view returns (AccountInfos memory) {
        return accountsInfos[account];
    }
}

contract Tests is Test, ModifiersExpectations {
    TestedContract tested;
    GlobalOwner globalOwner;
    GlobalPause globalPause;
    GlobalBlacklist globalBlacklist;
    GenericERC20 investedToken;

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

        // Deploy GenericERC20
        investedToken = new GenericERC20("Dummy Token", "DUMMY", 6);
        vm.label(address(investedToken), "Invested token");

        // Deploy tested contract
        TestedContract impl5 = new TestedContract();
        ERC1967Proxy proxy5 = new ERC1967Proxy(address(impl5), "");
        tested = TestedContract(address(proxy5));
        tested.initialize(
            address(globalOwner),
            address(globalPause),
            address(globalBlacklist),
            address(investedToken)
        );
        vm.label(address(tested), "TestedContract");
    }

    // =============================
    // === initialize() function ===
    function test_initialize_1() public {
        console.log("Shouldn't be re-initializable");
        vm.expectRevert(bytes("Initializable: contract is already initialized"));
        tested.initialize(
            address(globalOwner),
            address(globalPause),
            address(globalBlacklist),
            address(investedToken)
        );
    }

    function test_initialize_2() public {
        console.log("Should properly set global owner, pause and blacklist");
        assertEq(tested.globalOwner(), address(globalOwner));
        assertEq(tested.globalPause(), address(globalPause));
        assertEq(tested.globalBlacklist(), address(globalBlacklist));
    }

    // ==============================
    // === invested() function ===
    function test_invested_1() public {
        console.log("Should return address given during initialization");
        assertEq(address(tested.invested()), address(investedToken));
    }

    // =========================
    // === setAPR() function ===
    function testFuzz_setAPR_1(uint16 newAPRUD3) public {
        console.log("Should update the APR return by getAPR()");

        tested.setAPR(newAPRUD3);
        assertEq(tested.getAPR(), newAPRUD3);
    }

    // =======================================
    // === startRedirectRewards() function ===
    function testFuzz_startRedirectRewards_1(address from, address to) public {
        console.log("Should revert if contract is paused ");
        globalPause.pause();
        expectRevertPaused();
        tested.startRedirectRewards(from, to);
    }

    function testFuzz_startRedirectRewards_2(address from, address to) public {
        console.log("Should revert if from account is blacklisted");

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Blacklist account
        globalBlacklist.blacklist(from);

        // Expect revert
        expectRevertRestricted();
        tested.startRedirectRewards(from, to);
    }

    function testFuzz_startRedirectRewards_3(address from, address to) public {
        console.log("Should revert if to account is blacklisted");

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Blacklist account
        globalBlacklist.blacklist(to);

        // Expect revert
        expectRevertRestricted();
        tested.startRedirectRewards(from, to);
    }

    function testFuzz_startRedirectRewards_4(address to) public {
        console.log("Should revert if from account is zero address");

        // Ensure to is not the zero address
        vm.assume(to != address(0));

        // Expect revert
        vm.expectRevert(bytes("InvestUpgradeable: from cannot be zero address"));
        tested.startRedirectRewards(address(0), to);
    }

    function testFuzz_startRedirectRewards_5(address from) public {
        console.log("Should revert if to account is zero address");

        // Ensure from is not the zero address
        vm.assume(from != address(0));

        // Expect revert
        vm.expectRevert(bytes("InvestUpgradeable: to cannot be zero address"));
        tested.startRedirectRewards(from, address(0));
    }

    function testFuzz_startRedirectRewards_6(address account) public {
        console.log("Should revert if from and to are the same account");

        // Ensure account is not the zero address
        vm.assume(account != address(0));

        // Expect revert
        vm.expectRevert(bytes("InvestUpgradeable: cannot be the same address"));
        tested.startRedirectRewards(account, account);
    }

    function testFuzz_startRedirectRewards_7(address from, address to, address otherAccount) public {
        console.log("Should revert if caller is neither the owner nor the from account");

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Ensure other account is neither the owner nor the from account nor the zero address
        vm.assume(otherAccount != address(0));
        vm.assume(otherAccount != from);
        vm.assume(otherAccount != globalOwner.owner());

        // Expect revert
        vm.expectRevert(bytes("InvestUpgradeable: forbidden"));
        vm.prank(otherAccount);
        tested.startRedirectRewards(from, to);
    }

    function testFuzz_startRedirectRewards_8(uint16 aprUD3, address from, address to) public {
        console.log("Should success if caller is owner");
        // Set first random APR
        tested.setAPR(aprUD3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        tested.startRedirectRewards(from, to);
    }

    function testFuzz_startRedirectRewards_9(uint16 aprUD3, address from, address to) public {
        console.log("Should success if caller is from");
        // Set first random APR
        tested.setAPR(aprUD3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        vm.prank(from);
        tested.startRedirectRewards(from, to);
    }

    function testFuzz_startRedirectRewards_10(
        uint16 aprUD3,
        address from,
        address to,
        uint32 duration
    ) public {
        console.log("Should reset from and to accounts investment periods");
        // Set first random APR
        tested.setAPR(aprUD3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Move time forward to simulate investment period
        vm.assume(duration > 0);
        skip(duration);

        // Start redirect
        tested.startRedirectRewards(from, to);

        // Assert that block timestamp is not 0
        assertNotEq(block.timestamp, 0);

        // Assert that from and to accounts investment period is equal to block timestamp
        assertEq(tested.public_accountsInfos(from).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(to).period.timestamp, block.timestamp);
    }

    function testFuzz_startRedirectRewards_11(uint16 aprUD3, address from, address to) public {
        console.log("Should set to at from index in rewardsRedirectsFromTo");
        // Set first random APR
        tested.setAPR(aprUD3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        tested.startRedirectRewards(from, to);

        // Assert that to has properly been set in rewardsRedirectsFromTo
        assertEq(tested.rewardsRedirectsFromTo(from), to);
    }

    function testFuzz_startRedirectRewards_12(
        uint16 aprUD3,
        address from1,
        address from2,
        address to
    ) public {
        console.log("Should push from into at to index in rewardsRedirectsToFrom");
        // Set first random APR
        tested.setAPR(aprUD3);

        // Ensure accounts different and not not the zero address
        vm.assume(from1 != to);
        vm.assume(from2 != to);
        vm.assume(from1 != address(0));
        vm.assume(from2 != address(0));
        vm.assume(to != address(0));

        // Start redirect from from1 to to
        tested.startRedirectRewards(from1, to);

        // Assert that from1 has properly been set in rewardsRedirectsToFrom
        assertEq(tested.rewardsRedirectsToFrom(to, 0), from1);

        // Start redirect from from2 to to
        tested.startRedirectRewards(from2, to);

        // Assert that from2 has properly been set in rewardsRedirectsToFrom
        assertEq(tested.rewardsRedirectsToFrom(to, 1), from2);
    }

    // ======================================
    // === stopRedirectRewards() function ===
    function testFuzz_stopRedirectRewards_1(address from, address to) public {
        console.log("Should revert if contract is paused ");
        globalPause.pause();
        expectRevertPaused();
        tested.stopRedirectRewards(from, to);
    }

    function testFuzz_stopRedirectRewards_2(address from, address to) public {
        console.log("Should revert if from account is blacklisted");

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Blacklist account
        globalBlacklist.blacklist(from);

        // Expect revert
        expectRevertRestricted();
        tested.stopRedirectRewards(from, to);
    }

    function testFuzz_stopRedirectRewards_3(address from, address to) public {
        console.log("Should revert if to account is blacklisted");

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Blacklist account
        globalBlacklist.blacklist(to);

        // Expect revert
        expectRevertRestricted();
        tested.stopRedirectRewards(from, to);
    }

    function testFuzz_stopRedirectRewards_4(address to) public {
        console.log("Should revert if from account is zero address");

        // Ensure to is not the zero address
        vm.assume(to != address(0));

        // Expect revert
        vm.expectRevert(bytes("InvestUpgradeable: from cannot be zero address"));
        tested.stopRedirectRewards(address(0), to);
    }

    function testFuzz_stopRedirectRewards_5(address from) public {
        console.log("Should revert if to account is zero address");

        // Ensure from is not the zero address
        vm.assume(from != address(0));

        // Expect revert
        vm.expectRevert(bytes("InvestUpgradeable: to cannot be zero address"));
        tested.stopRedirectRewards(from, address(0));
    }

    function testFuzz_stopRedirectRewards_6(address from, address to, address otherAccount) public {
        console.log("Should revert if caller is neither the owner nor the from account");

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Ensure other account is neither the owner nor the from account nor the zero address
        vm.assume(otherAccount != address(0));
        vm.assume(otherAccount != from);
        vm.assume(otherAccount != globalOwner.owner());

        // Expect revert
        vm.expectRevert(bytes("InvestUpgradeable: forbidden"));
        vm.prank(otherAccount);
        tested.stopRedirectRewards(from, to);
    }

    function testFuzz_stopRedirectRewards_7(uint16 aprUD3, address from, address to) public {
        console.log("Should success if caller is owner");
        // Set first random APR
        tested.setAPR(aprUD3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        tested.startRedirectRewards(from, to);
        tested.stopRedirectRewards(from, to);
    }

    function testFuzz_stopRedirectRewards_8(uint16 aprUD3, address from, address to) public {
        console.log("Should success if caller is from");
        // Set first random APR
        tested.setAPR(aprUD3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        tested.startRedirectRewards(from, to);
        vm.prank(from);
        tested.stopRedirectRewards(from, to);
    }

    function testFuzz_stopRedirectRewards_9(address from, address to) public {
        console.log("Should revert there were no redirect for given from and to accounts");

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Expect revert
        vm.expectRevert(bytes("InvestUpgradeable: not redirected"));
        vm.prank(from);
        tested.stopRedirectRewards(from, to);
    }

    function testFuzz_stopRedirectRewards_10(
        uint16 aprUD3,
        address from,
        address to,
        uint32 duration
    ) public {
        console.log("Should reset from and to accounts investment periods");
        // Set first random APR
        tested.setAPR(aprUD3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        tested.startRedirectRewards(from, to);

        // Move time forward to simulate investment period
        vm.assume(duration > 0);
        skip(duration);

        // Stop redirect
        tested.stopRedirectRewards(from, to);

        // Assert that block timestamp is not 0
        assertNotEq(block.timestamp, 0);

        // Assert that from and to accounts investment period is equal to block timestamp
        assertEq(tested.public_accountsInfos(from).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(to).period.timestamp, block.timestamp);
    }

    function testFuzz_stopRedirectRewards_11(uint16 aprUD3, address from, address to) public {
        console.log("Should reset to address at index from in rewardsRedirectsFromTo to zero address");
        // Set first random APR
        tested.setAPR(aprUD3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        tested.startRedirectRewards(from, to);

        // Assert that rewardsRedirectsFromTo[from] is currently equal to to
        assertEq(tested.rewardsRedirectsFromTo(from), to);

        // Stop redirect
        tested.stopRedirectRewards(from, to);

        // Assert that rewardsRedirectsFromTo[from] is now equal to zero address
        assertEq(tested.rewardsRedirectsFromTo(from), address(0));
    }

    function testFuzz_stopRedirectRewards_12(uint16 aprUD3, address from, address to) public {
        console.log("Should properly remove from address from index to in rewardsRedirectsToFrom");
        // Set first random APR
        tested.setAPR(aprUD3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        tested.startRedirectRewards(from, to);

        // Assert that rewardsRedirectsToFrom[to][] is currently equal to from
        assertEq(tested.rewardsRedirectsToFrom(to, 0), from);

        // Stop redirect
        tested.stopRedirectRewards(from, to);

        // Assert that index doesn't exist anymore
        vm.expectRevert();
        tested.rewardsRedirectsToFrom(to, 0);
    }

    function testFuzz_stopRedirectRewards_13(
        uint16 aprUD3,
        address from1,
        address from2,
        address from3,
        address to
    ) public {
        console.log(
            "Shouldn't let empty array slot and fill them with last element of the rewardsRedirectsToFrom array"
        );
        // Set first random APR
        tested.setAPR(aprUD3);

        // Ensure accounts different and not not the zero address
        vm.assume(from1 != to);
        vm.assume(from2 != to);
        vm.assume(from3 != to);
        vm.assume(from1 != address(0));
        vm.assume(from2 != address(0));
        vm.assume(from3 != address(0));
        vm.assume(to != address(0));

        // Start redirect all from to to
        tested.startRedirectRewards(from1, to);
        tested.startRedirectRewards(from2, to);
        tested.startRedirectRewards(from3, to);

        // Assert that they have properly been set in rewardsRedirectsToFrom
        assertEq(tested.rewardsRedirectsToFrom(to, 0), from1);
        assertEq(tested.rewardsRedirectsToFrom(to, 1), from2);
        assertEq(tested.rewardsRedirectsToFrom(to, 2), from3);

        // Stop redirect from2 to to
        tested.stopRedirectRewards(from2, to);

        // Assert that index have been properly updated without letting blank slot
        assertEq(tested.rewardsRedirectsToFrom(to, 0), from1);
        assertEq(tested.rewardsRedirectsToFrom(to, 1), from3);

        // Assert that the array has not third item anymore
        vm.expectRevert();
        tested.rewardsRedirectsToFrom(to, 2);
    }

    // =========================
    // === getAPR() function ===
    function testFuzz_getAPR_1(uint16 newAPRUD3) public {
        console.log("Should return last set APR");

        // Ensure initial APR is 0
        assertEq(tested.getAPR(), 0);

        // Set a new latest APR and ensure getAPR() returns it
        vm.assume(newAPRUD3 > 0);
        tested.setAPR(newAPRUD3);
        assertEq(tested.getAPR(), newAPRUD3);
    }

    // ==================================
    // === _distributeRewards() function ===
    function testFuzz__distributeRewards_1(address account, uint256 amount) public {
        console.log("Should return false when not implemented");
        // Note: as we don't call set_distributeRewards_Implemented(true) the function
        // behave like it's not implemented
        assertFalse(tested.public_distributeRewards(account, amount));
    }

    // ==============================
    // === _toDecimals() function ===
    function testFuzz__toDecimals_1(uint8 decimals, uint256 n) public {
        console.log("Should return given number times 10^decimals when doesn't overflow");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Restrict n to non-overflowing values
        n = bound(n, 0, type(uint256).max / (10 ** decimals));

        assertEq(tested.public_toDecimals(n), n * 10 ** decimals);
    }

    function testFuzz__toDecimals_2(uint8 decimals, uint256 n) public {
        console.log("Should properly overflow on big numbers");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Restrict n to overflowing values
        n = bound(n, type(uint256).max / (10 ** decimals), type(uint256).max);
        vm.assume(n > type(uint256).max / (10 ** decimals));

        vm.expectRevert(stdError.arithmeticError);
        tested.public_toDecimals(n);
    }

    // ================================
    // === _fromDecimals() function ===
    function testFuzz__fromDecimals_1(uint8 decimals, uint256 n) public {
        console.log("Should return given number divided by 10^decimals and never revert");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        assertEq(tested.public_fromDecimals(n), n / 10 ** decimals);
    }

    // ==========================
    // === _toUDS3() function ===
    function testFuzz__toUDS3_1(uint8 decimals, uint256 n) public {
        console.log("Should return given number times 10^decimals+3 when doesn't overflow");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Restrict n to non-overflowing values
        n = bound(n, 0, type(uint256).max / 10 ** (decimals) / 10 ** 3);

        assertEq(tested.public_toUDS3(n), n * 10 ** (decimals + 3));
    }

    function testFuzz__toUDS3_2(uint8 decimals, uint256 n) public {
        console.log("Should properly overflow on big numbers");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Restrict n to overflowing values
        n = bound(n, type(uint256).max / 10 ** decimals / 10 ** 3, type(uint256).max);
        vm.assume(n > type(uint256).max / 10 ** decimals / 10 ** 3);

        vm.expectRevert(stdError.arithmeticError);
        tested.public_toUDS3(n);
    }

    // ============================
    // === _fromUDS3() function ===
    function testFuzz__fromUDS3_1(uint8 decimals, uint256 n) public {
        console.log("Should return given number divided by 10^decimals and never revert");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        assertEq(tested.public_fromUDS3(n), n / 10 ** decimals / 10 ** 3);
    }

    // ================================
    // === _calculatePeriodRewards() function ===
    function testFuzz__calculatePeriodRewards_1(
        uint8 decimals,
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD3,
        uint256 investedAmount
    ) public {
        console.log(
            "Shouldn't overflow/underflow before 100T of invested amount and up to 18 decimals."
        );

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Ensure beginTimestamp is before endTimestamp
        vm.assume(beginTimestamp < endTimestamp);

        // Calculate rewards (shouldn't revert)
        tested.public_calculatePeriodRewards(beginTimestamp, endTimestamp, aprUD3, investedAmount);
    }

    function testFuzz__calculatePeriodRewards_2(
        uint8 decimals,
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD3,
        uint256 investedAmount
    ) public {
        console.log("Should properly apply given APR");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Ensure beginTimestamp is before endTimestamp
        vm.assume(beginTimestamp < endTimestamp);

        // Get rewards
        uint256 rewards = tested.public_calculatePeriodRewards(
            beginTimestamp,
            endTimestamp,
            aprUD3,
            investedAmount
        );
        if (rewards == 0) return;

        // Compute applied APR from rewards, elapsed time and invested amount
        uint256 growthUDS3 = (UDS3.scaleUp(rewards) * tested.public_toUDS3(1)) /
            UDS3.scaleUp(investedAmount);

        uint256 elaspedTimeUDS3 = tested.public_toUDS3(endTimestamp - beginTimestamp);
        uint256 elapsedYearsUDS3 = (elaspedTimeUDS3 * tested.public_toUDS3(1)) /
            tested.public_toUDS3(365 days);

        uint256 appliedAPRUDS3 = (growthUDS3 * tested.public_toUDS3(1)) / elapsedYearsUDS3;
        uint256 appliedAPRUD3 = tested.public_fromDecimals(appliedAPRUDS3);

        // Ensure applied APR is equal to given APR
        if (UDS3.scaleDown(appliedAPRUD3) != 0) assertEq(appliedAPRUD3, aprUD3);
    }

    function testFuzz__calculatePeriodRewards_3(
        uint8 decimals,
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD3,
        uint256 investedAmount
    ) public {
        console.log("Should properly apply given period");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Ensure beginTimestamp is before endTimestamp
        vm.assume(beginTimestamp < endTimestamp);

        // Get rewards
        uint256 rewards = tested.public_calculatePeriodRewards(
            beginTimestamp,
            endTimestamp,
            aprUD3,
            investedAmount
        );
        if (rewards == 0) return;

        // Compute applied elapsed time from rewards, APR and invested amount
        uint256 growthUDS3 = (UDS3.scaleUp(rewards) * tested.public_toUDS3(1)) /
            UDS3.scaleUp(investedAmount);

        uint256 aprUDS3 = tested.public_toUDS3(aprUD3);

        uint256 appliedElapsedTimeUDS3 = (growthUDS3 * tested.public_toUDS3(1)) / aprUDS3;
        uint256 appliedElapsedTime = tested.public_fromUDS3(appliedElapsedTimeUDS3);

        // Ensure applied elapsed time is equal to given elapsed time
        if (appliedElapsedTime != 0) assertEq(appliedElapsedTime, endTimestamp - beginTimestamp);
    }

    /// forge-config: default.fuzz.runs = 1000
    function testFuzz__calculatePeriodRewards_4(
        uint8 decimals,
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD3,
        uint256 investedAmount
    ) public {
        console.log("Should properly apply given invested amount (when >5% APR and >365 days period)");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Ensure period is >365days and APR >5% to prevent failure because of precision loss
        aprUD3 = uint16(bound(aprUD3, UDS3.scaleUp(5), type(uint16).max));
        beginTimestamp = uint40(bound(beginTimestamp, 0, type(uint40).max - 365 days));
        endTimestamp = uint40(bound(endTimestamp, beginTimestamp + 365 days, type(uint40).max));

        // Get rewards
        uint256 rewards = tested.public_calculatePeriodRewards(
            beginTimestamp,
            endTimestamp,
            aprUD3,
            investedAmount
        );
        if (rewards == 0) return;

        // Compute applied invested amount from rewards, APR and elapsed time
        uint256 elaspedTimeUDS3 = tested.public_toUDS3(endTimestamp - beginTimestamp);
        uint256 elapsedYearsUDS3 = (elaspedTimeUDS3 * tested.public_toUDS3(1)) /
            tested.public_toUDS3(365 days);

        uint256 aprUDS3 = tested.public_toDecimals(aprUD3); // UD3 to UDS3
        uint256 growthUDS3 = (elapsedYearsUDS3 * aprUDS3) / tested.public_toUDS3(1);

        uint256 rewardsUDS3 = UDS3.scaleUp(rewards);
        uint256 appliedInvestedAmountUDS3 = (rewardsUDS3 * tested.public_toUDS3(100)) / growthUDS3;
        uint256 appliedInvestedAmount = UDS3.scaleDown(appliedInvestedAmountUDS3);

        // Ensure applied invested amount is near to invested amount
        if (appliedInvestedAmount != 0) {
            uint256 difference = appliedInvestedAmount > investedAmount
                ? appliedInvestedAmount - investedAmount
                : investedAmount - appliedInvestedAmount;
            assertTrue(difference <= tested.public_toDecimals(100));
        }
    }

    function testFuzz__calculatePeriodRewards_5(
        uint8 decimals,
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD3,
        uint256 investedAmount
    ) public {
        console.log("Should properly apply given invested amount (other cases)");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Ensure beginTimestamp is before endTimestamp
        vm.assume(beginTimestamp < endTimestamp);

        // Get rewards
        uint256 rewards = tested.public_calculatePeriodRewards(
            beginTimestamp,
            endTimestamp,
            aprUD3,
            investedAmount
        );
        if (rewards == 0) return;

        // Compute applied invested amount from rewards, APR and elapsed time
        uint256 elaspedTimeUDS3 = tested.public_toUDS3(endTimestamp - beginTimestamp);
        uint256 elapsedYearsUDS3 = (elaspedTimeUDS3 * tested.public_toUDS3(1)) /
            tested.public_toUDS3(365 days);

        uint256 aprUDS3 = tested.public_toDecimals(aprUD3); // UD3 to UDS3
        uint256 growthUDS3 = (elapsedYearsUDS3 * aprUDS3) / tested.public_toUDS3(1);

        uint256 rewardsUDS3 = UDS3.scaleUp(rewards);
        uint256 appliedInvestedAmountUDS3 = (rewardsUDS3 * tested.public_toUDS3(100)) / growthUDS3;
        uint256 appliedInvestedAmount = UDS3.scaleDown(appliedInvestedAmountUDS3);

        // Ensure applied invested amount is always smaller than real invested amount
        if (appliedInvestedAmount != 0) {
            assertTrue(appliedInvestedAmount <= investedAmount);
        }
    }

    // ====================================
    // === _deepInvestmentOf() function ===
    function testFuzz__deepInvestmentOf_1(address account) public {
        console.log("Should return 0 when no investment");

        assertEq(tested.public_deepInvestmentOf(account), 0);
    }

    function testFuzz__deepInvestmentOf_2(
        uint16 aprUD3,
        address account1,
        address account2,
        address account3,
        uint256 amount
    ) public {
        console.log(
            "Should return investment of account only if no other account redirect its rewards to to it"
        );

        // Ensure 3 accounts are different
        vm.assume(account1 != account2);
        vm.assume(account1 != account3);
        vm.assume(account2 != account3);

        // Cap amount to 100T
        amount = bound(amount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Set first random APR
        tested.setAPR(aprUD3);

        // Make the three accounts investing
        vm.prank(account1);
        tested.stake(amount + 1);
        vm.prank(account2);
        tested.stake(amount + 2);
        vm.prank(account3);
        tested.stake(amount + 3);

        // Assert that deep investment of account1 is equal to its investment
        assertEq(tested.public_deepInvestmentOf(account1), amount + 1);

        // Assert that deep investment of account2 is equal to its investment
        assertEq(tested.public_deepInvestmentOf(account2), amount + 2);

        // Assert that deep investment of account3 is equal to its investment
        assertEq(tested.public_deepInvestmentOf(account3), amount + 3);
    }

    function testFuzz__deepInvestmentOf_3(
        uint16 aprUD3,
        address account1,
        address account2,
        address account3,
        uint256 amount
    ) public {
        console.log(
            "Should return sum of account investment plus one of all other accounts that redirects to it"
        );

        // Ensure 3 accounts are different and not the zero address
        vm.assume(account1 != account2);
        vm.assume(account1 != account3);
        vm.assume(account2 != account3);
        vm.assume(account1 != address(0));
        vm.assume(account2 != address(0));
        vm.assume(account3 != address(0));

        // Cap amount to 100T
        amount = bound(amount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Set first random APR
        tested.setAPR(aprUD3);

        // Invest with account1
        vm.prank(account1);
        tested.stake(amount + 1);
        vm.prank(account2);
        tested.stake(amount + 2);
        vm.prank(account3);
        tested.stake(amount + 3);

        // Assert that deep investment of account1 is equal to its investment
        assertEq(tested.public_deepInvestmentOf(account1), amount + 1);

        // Redirect account2 rewards to account1
        tested.startRedirectRewards(account2, account1);

        // Assert that deep investment of account1 is equal to its investment plus account2 investment
        assertEq(tested.public_deepInvestmentOf(account1), amount + 1 + amount + 2);

        // Redirect account3 rewards to account2
        tested.startRedirectRewards(account3, account2);

        // Assert that deep investment of account1 is equal to its investment plus account2 investment plus account3 investment
        assertEq(tested.public_deepInvestmentOf(account1), amount + 1 + amount + 2 + amount + 3);

        // Stop redirect account2 rewards to account1
        tested.stopRedirectRewards(account2, account1);

        // Assert that deep investment of account1 is equal to its investment plus account3 investment
        assertEq(tested.public_deepInvestmentOf(account1), amount + 1);

        // Assert that deep investment of account2 is equal to its investment plus account3 investment
        assertEq(tested.public_deepInvestmentOf(account2), amount + 2 + amount + 3);
    }

    // =============================
    // === _rewardsOf() function ===
    function testFuzz__rewardsOf_1(uint8 decimals, bool autocompound) public {
        console.log("Should return 0 when not APR checkpoints");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        assertEq(tested.public_rewardsOf(address(1234), autocompound), 0);
    }

    function testFuzz__rewardsOf_2(uint8 decimals, uint16 aprUD3, bool autocompound) public {
        console.log("Should return 0 when APR checkpoints but no investment");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap APR to half its max value
        aprUD3 = uint16(bound(aprUD3, 0, type(uint16).max / 2));

        // Set first random APR value and ensure rewards of returns 0
        tested.setAPR(aprUD3);
        assertEq(tested.public_rewardsOf(address(1234), autocompound), 0);

        // Set second random APR value and ensure rewards of returns 0
        tested.setAPR(aprUD3 * 2);
        assertEq(tested.public_rewardsOf(address(1234), autocompound), 0);
    }

    function testFuzz__rewardsOf_3(
        uint8 decimals,
        uint16 aprUD3,
        uint256 investedAmount,
        uint256 investmentDuration,
        bool autocompound
    ) public {
        console.log("Should properly calculate rewards when no new APR checkpoint after investment");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Set random APR
        tested.setAPR(aprUD3);

        // Invest random amount of tokens
        vm.prank(address(1234));
        tested.stake(investedAmount);

        // Simulate investment period
        uint40 startTimestamp = uint40(block.timestamp);
        investmentDuration = bound(investmentDuration, 0, type(uint40).max - startTimestamp); // prevent overflow
        skip(investmentDuration);
        uint40 endTimestamp = uint40(block.timestamp);

        // Calculate expected rewards
        uint256 expectedRewards = tested.public_calculatePeriodRewards(
            startTimestamp,
            endTimestamp,
            aprUD3,
            investedAmount
        );

        assertEq(tested.public_rewardsOf(address(1234), autocompound), expectedRewards);
    }

    function testFuzz__rewardsOf_4(
        uint8 decimals,
        uint16 aprUD3,
        uint256 investedAmount,
        uint256 numberOfCheckpoints,
        bool autocompound,
        uint40 investmentDuration
    ) public {
        console.log(
            "Should properly calculate rewards when one or many checkpoints have been added after investment"
        );

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Cap interval between checkpoints to 365 days
        investmentDuration = uint40(bound(investmentDuration, 0, 365 days));

        // Cap number of checkpoints to 200
        numberOfCheckpoints = bound(numberOfCheckpoints, 1, 100);

        // Create random number of checkpoints after investment
        uint256 expectedRewards = 0;
        uint40 latestCheckpointTimestamp = uint40(block.timestamp);
        uint16 latestCheckpointApr = aprUD3;

        // Create first APR
        tested.setAPR(latestCheckpointApr);

        // Invest random amount of tokens
        vm.prank(address(1234));
        tested.stake(investedAmount);

        // Create random number of checkpoints after investment
        for (uint256 i = 0; i < numberOfCheckpoints; i++) {
            uint40 newCheckpointTimestamp = uint40(block.timestamp);
            uint16 newCheckpointApr = aprUD3;
            tested.setAPR(newCheckpointApr);

            // Move forward a random amount of time
            skip(investmentDuration);

            // Calculate expected rewards for this past period
            expectedRewards += tested.public_calculatePeriodRewards(
                latestCheckpointTimestamp,
                newCheckpointTimestamp,
                latestCheckpointApr,
                investedAmount + (autocompound ? expectedRewards : 0)
            );

            latestCheckpointTimestamp = newCheckpointTimestamp;
            latestCheckpointApr = newCheckpointApr;
        }

        // Calculate rewards from last checkpoint to now
        expectedRewards += tested.public_calculatePeriodRewards(
            latestCheckpointTimestamp,
            uint40(block.timestamp),
            latestCheckpointApr,
            investedAmount + (autocompound ? expectedRewards : 0)
        );

        // Ensure calculated rewards are equal to expected rewards
        uint256 rewards = tested.public_rewardsOf(address(1234), autocompound);
        assertEq(rewards, expectedRewards);
    }

    function testFuzz__rewardsOf_5(
        uint8 decimals,
        uint16 aprUD3,
        address account1,
        address account2,
        address account3,
        uint256 investedAmount,
        uint256 numberOfCheckpoints,
        bool autocompound,
        uint40 investmentDuration
    ) public {
        console.log(
            "Should properly calculate rewards when given account is the target of one or many rewards redirections"
        );

        // Ensure 3 accounts are different and not equal to zero address
        vm.assume(account1 != account2);
        vm.assume(account1 != account3);
        vm.assume(account2 != account3);
        vm.assume(account1 != address(0));
        vm.assume(account2 != address(0));
        vm.assume(account3 != address(0));

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Cap interval between checkpoints to 365 days
        investmentDuration = uint40(bound(investmentDuration, 0, 365 days));

        // Cap number of checkpoints to 200
        numberOfCheckpoints = bound(numberOfCheckpoints, 1, 100);

        // Create random number of checkpoints after investment
        uint256 expectedRewards = 0;
        uint40 latestCheckpointTimestamp = uint40(block.timestamp);
        uint16 latestCheckpointApr = aprUD3;

        // Create first APR
        tested.setAPR(latestCheckpointApr);

        // Invest random amount of tokens with 3 accounts
        vm.prank(account1);
        tested.stake(investedAmount + 1);
        vm.prank(account2);
        tested.stake(investedAmount + 2);
        vm.prank(account3);
        tested.stake(investedAmount + 3);

        // Redirect account2 rewards to account1
        tested.startRedirectRewards(account2, account1);

        // Redirect account3 rewards to account2
        tested.startRedirectRewards(account3, account2);

        // Consider that now account1 deposited amount is equal to account1 + account2 deposited amounts
        uint256 depositedAmount = investedAmount + 1 + investedAmount + 2 + investedAmount + 3;

        // Create random number of checkpoints after investment
        for (uint256 i = 0; i < numberOfCheckpoints; i++) {
            uint40 newCheckpointTimestamp = uint40(block.timestamp);
            uint16 newCheckpointApr = aprUD3;
            tested.setAPR(newCheckpointApr);

            // Move forward a random amount of time
            skip(investmentDuration);

            // Calculate expected rewards for this past period
            expectedRewards += tested.public_calculatePeriodRewards(
                latestCheckpointTimestamp,
                newCheckpointTimestamp,
                latestCheckpointApr,
                depositedAmount + (autocompound ? expectedRewards : 0)
            );

            latestCheckpointTimestamp = newCheckpointTimestamp;
            latestCheckpointApr = newCheckpointApr;
        }

        // Calculate rewards from last checkpoint to now
        expectedRewards += tested.public_calculatePeriodRewards(
            latestCheckpointTimestamp,
            uint40(block.timestamp),
            latestCheckpointApr,
            depositedAmount + (autocompound ? expectedRewards : 0)
        );

        // Ensure calculated rewards are equal to expected rewards
        uint256 rewards = tested.public_rewardsOf(account1, autocompound);
        assertEq(rewards, expectedRewards);
    }

    // ===============================================
    // === _deepResetInvestmentPeriodOf() function ===
    function testFuzz__deepResetInvestmentPeriodOf_1(
        uint16 aprUD3,
        address account,
        uint32 duration
    ) public {
        console.log("Should reset given account investment period");

        // Set random APR
        tested.setAPR(aprUD3);

        // Assert that current account investment period block timestamp is 0
        assertEq(tested.public_accountsInfos(account).period.timestamp, 0);

        // Skip random amount of time to simulate investment period
        skip(duration);

        // Call _deepResetInvestmentPeriodOf()
        tested.public_deepResetInvestmentPeriodOf(account);

        // Assert that account investment period has been reset
        assertEq(tested.public_accountsInfos(account).period.timestamp, block.timestamp);
    }

    function testFuzz__deepResetInvestmentPeriodOf_2(
        uint16 aprUD3,
        address account1,
        address account2,
        address account3,
        uint256 amount,
        uint32 duration
    ) public {
        console.log(
            "Should not reset account investment period (timestamp + apr) of accounts that aren't redirecting rewards to given account"
        );

        // Set random APR
        tested.setAPR(aprUD3);

        // Assert that accounts are different
        vm.assume(account1 != account2);
        vm.assume(account1 != account3);
        vm.assume(account2 != account3);

        // Cap amount to 100T
        amount = bound(amount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Invest random amount of tokens with 3 accounts
        // This will initialize their investment periods
        vm.prank(account1);
        tested.stake(amount + 1);
        vm.prank(account2);
        tested.stake(amount + 2);
        vm.prank(account3);
        tested.stake(amount + 3);

        // Assert that current accounts investment period is 1 (first block timestamp)
        assertEq(tested.public_accountsInfos(account1).period.timestamp, 1);
        assertEq(tested.public_accountsInfos(account2).period.timestamp, 1);
        assertEq(tested.public_accountsInfos(account3).period.timestamp, 1);

        // Skip random amount of time to simulate investment period
        skip(duration);

        // Set new APR
        uint16 newAPRUD3 = aprUD3 < type(uint16).max ? aprUD3 + 1 : aprUD3 - 1;
        tested.setAPR(newAPRUD3);

        // Call _deepResetInvestmentPeriodOf() on account
        tested.public_deepResetInvestmentPeriodOf(account1);

        // Assert that account investment period has been reset
        assertEq(tested.public_accountsInfos(account1).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(account1).period.ref.cursorIndex, 1);

        // Assert that other accounts investment period haven't been reset
        assertEq(tested.public_accountsInfos(account2).period.timestamp, 1);
        assertEq(tested.public_accountsInfos(account2).period.ref.cursorIndex, 0);

        assertEq(tested.public_accountsInfos(account3).period.timestamp, 1);
        assertEq(tested.public_accountsInfos(account3).period.ref.cursorIndex, 0);
    }

    function testFuzz__deepResetInvestmentPeriodOf_3(
        uint16 aprUD3,
        address account1,
        address account2,
        address account3,
        uint256 amount,
        uint32 duration
    ) public {
        console.log(
            "Should reset account investment period (timestamp + apr) of accounts that are redirecting rewards to given account"
        );

        // Set random APR
        tested.setAPR(aprUD3);

        // Assert that accounts are different and not zero addresses
        vm.assume(account1 != account2);
        vm.assume(account1 != account3);
        vm.assume(account2 != account3);
        vm.assume(account1 != address(0));
        vm.assume(account2 != address(0));
        vm.assume(account3 != address(0));

        // Cap amount to 100T
        amount = bound(amount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Invest random amount of tokens with 3 accounts
        // This will initialize their investment periods
        vm.prank(account1);
        tested.stake(amount + 1);
        vm.prank(account2);
        tested.stake(amount + 2);
        vm.prank(account3);
        tested.stake(amount + 3);

        // Redirect account2 rewards to account1
        tested.startRedirectRewards(account2, account1);

        // Redirect account3 rewards to account2
        tested.startRedirectRewards(account3, account2);

        // Assert that current accounts investment period is 1 (first block timestamp)
        assertEq(tested.public_accountsInfos(account1).period.timestamp, 1);
        assertEq(tested.public_accountsInfos(account2).period.timestamp, 1);
        assertEq(tested.public_accountsInfos(account3).period.timestamp, 1);

        // Skip random amount of time to simulate investment period
        duration = uint32(bound(duration, 1, type(uint32).max));
        skip(duration);

        // Set new APR
        uint16 newAPRUD3 = aprUD3 < type(uint16).max ? aprUD3 + 1 : aprUD3 - 1;
        tested.setAPR(newAPRUD3);

        // Call _deepResetInvestmentPeriodOf() on account
        tested.public_deepResetInvestmentPeriodOf(account1);

        // Assert that account investment period has been reset
        assertEq(tested.public_accountsInfos(account1).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(account1).period.ref.cursorIndex, 1);

        // Assert that other accounts investment period have been reset
        assertEq(tested.public_accountsInfos(account2).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(account2).period.ref.cursorIndex, 1);

        assertEq(tested.public_accountsInfos(account3).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(account3).period.ref.cursorIndex, 1);
    }

    // ===========================================
    // === _onInvestmentChange() function ===
    function test__onInvestmentChange_1(
        uint8 decimals,
        uint256 investedAmount,
        uint16 aprUD3,
        uint40 investmentDuration,
        bool autocompound
    ) public {
        console.log(
            "Should call claim rewards once / no infinite re-entrancy if _distributeRewards() itself indirectly or directly calls _onInvestmentChange()"
        );

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Cap interval between checkpoints to 100 years
        investmentDuration = uint40(bound(investmentDuration, 0, 100 * 365 days));

        // Implements _distributeRewards() and make it call _onInvestmentChange() again
        tested.set_distributeRewards_Implemented(true);
        tested.set_distributeRewards_ResetInvestmentPeriod(true);

        // Simulate investment period
        tested.setAPR(aprUD3);
        vm.prank(address(1234));
        tested.stake(investedAmount);
        skip(investmentDuration);

        // Call _onInvestmentChange()
        tested.public_onInvestmentChange(address(1234), autocompound);

        // Check that _distributeRewards() has been called once
        // Note that we use "lower than equal" as the _distributeRewards() function may not be
        // called at all if rewards are equal to 0
        assertLe(tested._distributeRewards_CallsCount(), 1);
    }

    function test__onInvestmentChange_2(
        uint8 decimals,
        uint256 investedAmount,
        uint16 aprUD3,
        uint40 investmentDuration,
        bool autocompound,
        bool isImplemented
    ) public {
        console.log(
            "Should rely on _distributeRewards() to distribute rewards if implemented (= returns true) else on virtual balance"
        );

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Cap interval between checkpoints to 100 years
        investmentDuration = uint40(bound(investmentDuration, 0, 100 * 365 days));

        // Randomly implement _distributeRewards()
        tested.set_distributeRewards_Implemented(isImplemented);

        // Simulate investment period
        tested.setAPR(aprUD3);
        vm.prank(address(1234));
        tested.stake(investedAmount);
        skip(investmentDuration);

        // Store expected rewards and old staked and virtual balances
        uint256 expectedRewards = tested.public_rewardsOf(address(1234), autocompound);
        uint256 oldStakedBalance = tested.stakeOf(address(1234));
        uint256 oldVirtualBalance = tested.public_accountsInfos(address(1234)).virtualBalance;

        // Call _onInvestmentChange()
        tested.public_onInvestmentChange(address(1234), autocompound);

        // If _distributeRewards() is implemented
        if (isImplemented) {
            // Ensure that is has been called
            assertLe(tested._distributeRewards_CallsCount(), 1);

            // Ensure that it has properly minted rewards
            uint256 newStakedBalance = tested.stakeOf(address(1234));
            assertEq(newStakedBalance, oldStakedBalance + expectedRewards);

            // Ensure that the virtual balance ends on 0
            uint256 newVirtualBalance = tested.public_accountsInfos(address(1234)).virtualBalance;
            assertEq(newVirtualBalance, 0);
        }
        // If it isn't
        else {
            // Ensure that it hasn't been called
            assertEq(tested._distributeRewards_CallsCount(), 0);

            // Ensure that rewards have been properly accumulated in virtual balance
            uint256 newVirtualBalance = tested.public_accountsInfos(address(1234)).virtualBalance;
            assertEq(newVirtualBalance, oldVirtualBalance + expectedRewards);
        }
    }

    function test__onInvestmentChange_3(
        uint8 decimals,
        address account1,
        address account2,
        address account3,
        uint256 investedAmount,
        uint16 aprUD3,
        uint32 duration,
        bool autocompound,
        bool isImplemented
    ) public {
        console.log("Should distribute rewards to account at the very end of the redirection chain");
        // Set random APR
        tested.setAPR(aprUD3);

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Randomly implement _distributeRewards()
        tested.set_distributeRewards_Implemented(isImplemented);

        // Assert that accounts are different and not zero addresses
        vm.assume(account1 != account2);
        vm.assume(account1 != account3);
        vm.assume(account2 != account3);
        vm.assume(account1 != address(0));
        vm.assume(account2 != address(0));
        vm.assume(account3 != address(0));

        // Cap investedAmount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Invest random amount of tokens with 3 accounts
        // This will initialize their investment periods
        vm.prank(account1);
        tested.stake(investedAmount + 1);
        vm.prank(account2);
        tested.stake(investedAmount + 2);
        vm.prank(account3);
        tested.stake(investedAmount + 3);

        // Redirect account2 rewards to account1
        tested.startRedirectRewards(account2, account1);

        // Redirect account3 rewards to account2
        tested.startRedirectRewards(account3, account2);

        // Assert that current accounts stakes are equal to invested amount
        assertEq(tested.stakeOf(account1), investedAmount + 1);
        assertEq(tested.stakeOf(account2), investedAmount + 2);
        assertEq(tested.stakeOf(account3), investedAmount + 3);

        // Assert that all accounts virtual balances are empty
        assertEq(tested.public_accountsInfos(account1).virtualBalance, 0);
        assertEq(tested.public_accountsInfos(account2).virtualBalance, 0);
        assertEq(tested.public_accountsInfos(account3).virtualBalance, 0);

        // Skip random amount of time to simulate investment period
        duration = uint32(bound(duration, 1, type(uint32).max));
        skip(duration);

        // Compute account 1 rewards
        uint256 account1Rewards = tested.public_rewardsOf(account1, autocompound);

        // Call _onInvestmentChange()
        tested.public_onInvestmentChange(account1, autocompound);

        // Assert that account2 and account3 stakes and virtual balances haven't changed (they received not rewards)
        assertEq(tested.stakeOf(account2), investedAmount + 2);
        assertEq(tested.stakeOf(account3), investedAmount + 3);
        assertEq(tested.public_accountsInfos(account2).virtualBalance, 0);
        assertEq(tested.public_accountsInfos(account3).virtualBalance, 0);

        // Assert that account1 has received rewards
        // If distribute rewards is implemented assert that rewards have been compounded to stake
        if (isImplemented) {
            assertEq(tested.stakeOf(account1), investedAmount + 1 + account1Rewards);
        }
        // Else assert that rewards have been accumulated in virtual balance
        else {
            assertEq(tested.public_accountsInfos(account1).virtualBalance, account1Rewards);
        }
    }

    function test__onInvestmentChange_4(
        uint8 decimals,
        uint256 investedAmount,
        uint16 aprUD3,
        uint40 investmentDuration,
        bool autocompound,
        bool isImplemented
    ) public {
        console.log("Should reset investment period timestamp of given account to now");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Cap interval between checkpoints to 100 years
        investmentDuration = uint40(bound(investmentDuration, 0, 100 * 365 days));

        // Randomly implement _distributeRewards()
        tested.set_distributeRewards_Implemented(isImplemented);

        // Simulate investment period
        tested.setAPR(aprUD3);
        vm.prank(address(1234));
        tested.stake(investedAmount);
        skip(investmentDuration);

        // Call _onInvestmentChange()
        tested.public_onInvestmentChange(address(1234), autocompound);

        // Ensure that the investment period timestamp has been updated to now
        assertEq(tested.public_accountsInfos(address(1234)).period.timestamp, block.timestamp);
    }

    function test__onInvestmentChange_5(
        uint8 decimals,
        address account1,
        address account2,
        address account3,
        uint256 investedAmount,
        uint16 aprUD3,
        uint32 duration,
        bool autocompound,
        bool isImplemented
    ) public {
        console.log(
            "Should reset investment period timestamp of all accounts that directly or indirectly redirect rewards to given accounts"
        );
        // Set random APR
        tested.setAPR(aprUD3);

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Randomly implement _distributeRewards()
        tested.set_distributeRewards_Implemented(isImplemented);

        // Assert that accounts are different and not zero addresses
        vm.assume(account1 != account2);
        vm.assume(account1 != account3);
        vm.assume(account2 != account3);
        vm.assume(account1 != address(0));
        vm.assume(account2 != address(0));
        vm.assume(account3 != address(0));

        // Cap investedAmount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Invest random amount of tokens with 3 accounts
        // This will initialize their investment periods
        vm.prank(account1);
        tested.stake(investedAmount + 1);
        vm.prank(account2);
        tested.stake(investedAmount + 2);
        vm.prank(account3);
        tested.stake(investedAmount + 3);

        // Redirect account2 rewards to account1
        tested.startRedirectRewards(account2, account1);

        // Redirect account3 rewards to account2
        tested.startRedirectRewards(account3, account2);

        // Assert that current accounts investment period is 1 (first block timestamp)
        assertEq(tested.public_accountsInfos(account1).period.timestamp, 1);
        assertEq(tested.public_accountsInfos(account2).period.timestamp, 1);
        assertEq(tested.public_accountsInfos(account3).period.timestamp, 1);

        // Skip random amount of time to simulate investment period
        duration = uint32(bound(duration, 1, type(uint32).max));
        skip(duration);

        // Set new APR
        uint16 newAPRUD3 = aprUD3 < type(uint16).max ? aprUD3 + 1 : aprUD3 - 1;
        tested.setAPR(newAPRUD3);

        // Call _onInvestmentChange()
        tested.public_onInvestmentChange(account1, autocompound);

        // Assert that account investment period has been reset
        assertEq(tested.public_accountsInfos(account1).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(account1).period.ref.cursorIndex, 1);

        // Assert that other accounts investment period have been reset
        assertEq(tested.public_accountsInfos(account2).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(account2).period.ref.cursorIndex, 1);

        assertEq(tested.public_accountsInfos(account3).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(account3).period.ref.cursorIndex, 1);
    }
}
