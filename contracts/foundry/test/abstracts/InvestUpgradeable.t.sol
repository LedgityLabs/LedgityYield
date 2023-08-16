// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../../lib/forge-std/src/Test.sol";
import {ModifiersExpectations} from "../_helpers/ModifiersExpectations.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {InvestUpgradeable} from "../../../src/abstracts/InvestUpgradeable.sol";
import {GlobalOwner} from "../../../src/GlobalOwner.sol";
import {GlobalPause} from "../../../src/GlobalPause.sol";
import {GlobalBlacklist} from "../../../src/GlobalBlacklist.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {GenericERC20} from "../../../src/dev/GenericERC20.sol";

import {SUD} from "../../../src/libs/SUD.sol";
import {APRHistory as APRH} from "../../../src/libs/APRHistory.sol";

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
        _beforeInvestmentChange(msg.sender, false);
        stakeOf[msg.sender] += amount;
    }

    function unstake(uint256 amount) public {
        _beforeInvestmentChange(msg.sender, false);
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
            _beforeInvestmentChange(account, _distributeRewards_Autocompound);
        }

        // In this implementation claiming == re-investing / compounding
        stakeOf[account] += amount;

        // Return true to simulate success
        return true;
    }

    function public_distributeRewards(address account, uint256 amount) public returns (bool) {
        return _distributeRewards(account, amount);
    }

    function public_calculatePeriodRewards(
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD7x3,
        uint256 investedAmount
    ) public view returns (uint256 rewards) {
        return _calculatePeriodRewards(beginTimestamp, endTimestamp, aprUD7x3, investedAmount);
    }

    function public_deepInvestmentOf(
        address account
    ) public view returns (uint256 deepInvestedAmount) {
        return _deepInvestmentOf(account);
    }

    function public_rewardsOf(
        address account,
        bool autocompound
    ) public view returns (uint256 rewards) {
        return _rewardsOf(account, autocompound);
    }

    function public_beforeInvestmentChange(address account, bool autocompound) public {
        _beforeInvestmentChange(account, autocompound);
    }

    function public_deepResetInvestmentPeriodOf(address account) public {
        _deepResetInvestmentPeriodOf(account);
    }

    function public_accountsInfos(address account) public view returns (AccountDetails memory) {
        return accountsDetails[account];
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
    function testFuzz_setAPR_1(uint16 newAPRUD7x3) public {
        console.log("Should update the APR return by getAPR()");

        tested.setAPR(newAPRUD7x3);
        assertEq(tested.getAPR(), newAPRUD7x3);
    }

    // =======================================
    // === startRewardsRedirection() function ===
    function testFuzz_startRewardsRedirection_1(address from, address to) public {
        console.log("Should revert if contract is paused ");
        globalPause.pause();
        expectRevertPaused();
        tested.startRewardsRedirection(from, to);
    }

    function testFuzz_startRewardsRedirection_2(address from, address to) public {
        console.log("Should revert if from account is blacklisted");

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Blacklist account
        globalBlacklist.blacklist(from);

        // Expect revert
        expectRevertRestricted();
        tested.startRewardsRedirection(from, to);
    }

    function testFuzz_startRewardsRedirection_3(address from, address to) public {
        console.log("Should revert if to account is blacklisted");

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Blacklist account
        globalBlacklist.blacklist(to);

        // Expect revert
        expectRevertRestricted();
        tested.startRewardsRedirection(from, to);
    }

    function testFuzz_startRewardsRedirection_4(
        uint16 aprUD7x3,
        address from,
        address to1,
        address to2
    ) public {
        console.log("Should revert if trying to redirect while a redirection is already active");

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Ensure addresses are different and and not the zero address
        vm.assume(to1 != address(0));
        vm.assume(to2 != address(0));
        vm.assume(from != address(0));
        vm.assume(to1 != to2);
        vm.assume(from != to1);
        vm.assume(from != to2);

        // First redirection
        tested.startRewardsRedirection(from, to1);

        // Expect revert on a second redirection
        vm.expectRevert(bytes("L62"));
        tested.startRewardsRedirection(from, to2);

        // Now stop the first redirection
        tested.stopRewardsRedirection(from, to1);

        // Second redirection should now work
        tested.startRewardsRedirection(from, to2);
    }

    function testFuzz_startRewardsRedirection_5(address to) public {
        console.log("Should revert if from account is zero address");

        // Ensure to is not the zero address
        vm.assume(to != address(0));

        // Expect revert
        vm.expectRevert(bytes("L12"));
        tested.startRewardsRedirection(address(0), to);
    }

    function testFuzz_startRewardsRedirection_6(address from) public {
        console.log("Should revert if to account is zero address");

        // Ensure from is not the zero address
        vm.assume(from != address(0));

        // Expect revert
        vm.expectRevert(bytes("L13"));
        tested.startRewardsRedirection(from, address(0));
    }

    function testFuzz_startRewardsRedirection_7(address account) public {
        console.log("Should revert if from and to are the same account");

        // Ensure account is not the zero address
        vm.assume(account != address(0));

        // Expect revert
        vm.expectRevert(bytes("L14"));
        tested.startRewardsRedirection(account, account);
    }

    function testFuzz_startRewardsRedirection_8(
        address from,
        address to,
        address otherAccount
    ) public {
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
        vm.expectRevert(bytes("L15"));
        vm.prank(otherAccount);
        tested.startRewardsRedirection(from, to);
    }

    function testFuzz_startRewardsRedirection_9(uint16 aprUD7x3, address from, address to) public {
        console.log("Should success if caller is owner");
        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        tested.startRewardsRedirection(from, to);
    }

    function testFuzz_startRewardsRedirection_10(uint16 aprUD7x3, address from, address to) public {
        console.log("Should success if caller is from");
        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        vm.prank(from);
        tested.startRewardsRedirection(from, to);
    }

    function testFuzz_startRewardsRedirection_11(
        uint16 aprUD7x3,
        address from,
        address to,
        uint32 duration
    ) public {
        console.log("Should reset from and to accounts investment periods");
        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Move time forward to simulate investment period
        vm.assume(duration > 0);
        skip(duration);

        // Start redirect
        tested.startRewardsRedirection(from, to);

        // Assert that block timestamp is not 0
        assertNotEq(block.timestamp, 0);

        // Assert that from and to accounts investment period is equal to block timestamp
        assertEq(tested.public_accountsInfos(from).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(to).period.timestamp, block.timestamp);
    }

    function testFuzz_startRewardsRedirection_12(uint16 aprUD7x3, address from, address to) public {
        console.log("Should set to at from index in rewardsRedirectsFromTo");
        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        tested.startRewardsRedirection(from, to);

        // Assert that to has properly been set in rewardsRedirectsFromTo
        assertEq(tested.rewardsRedirectsFromTo(from), to);
    }

    function testFuzz_startRewardsRedirection_13(
        uint16 aprUD7x3,
        address from1,
        address from2,
        address to
    ) public {
        console.log("Should push from into at to index in rewardsRedirectsToFrom");
        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Ensure accounts different and not not the zero address
        vm.assume(from1 != to);
        vm.assume(from2 != to);
        vm.assume(from1 != address(0));
        vm.assume(from2 != address(0));
        vm.assume(to != address(0));
        vm.assume(from1 != from2);

        // Start redirect from from1 to to
        tested.startRewardsRedirection(from1, to);

        // Assert that from1 has properly been set in rewardsRedirectsToFrom
        assertEq(tested.rewardsRedirectsToFrom(to, 0), from1);

        // Start redirect from from2 to to
        tested.startRewardsRedirection(from2, to);

        // Assert that from2 has properly been set in rewardsRedirectsToFrom
        assertEq(tested.rewardsRedirectsToFrom(to, 1), from2);
    }

    // ======================================
    // === stopRewardsRedirection() function ===
    function testFuzz_stopRewardsRedirection_1(address from, address to) public {
        console.log("Should revert if contract is paused ");
        globalPause.pause();
        expectRevertPaused();
        tested.stopRewardsRedirection(from, to);
    }

    function testFuzz_stopRewardsRedirection_2(address from, address to) public {
        console.log("Should revert if from account is blacklisted");

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Blacklist account
        globalBlacklist.blacklist(from);

        // Expect revert
        expectRevertRestricted();
        tested.stopRewardsRedirection(from, to);
    }

    function testFuzz_stopRewardsRedirection_3(address from, address to) public {
        console.log("Should revert if to account is blacklisted");

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Blacklist account
        globalBlacklist.blacklist(to);

        // Expect revert
        expectRevertRestricted();
        tested.stopRewardsRedirection(from, to);
    }

    function testFuzz_stopRewardsRedirection_4(address to) public {
        console.log("Should revert if from account is zero address");

        // Ensure to is not the zero address
        vm.assume(to != address(0));

        // Expect revert
        vm.expectRevert(bytes("L16"));
        tested.stopRewardsRedirection(address(0), to);
    }

    function testFuzz_stopRewardsRedirection_5(address from) public {
        console.log("Should revert if to account is zero address");

        // Ensure from is not the zero address
        vm.assume(from != address(0));

        // Expect revert
        vm.expectRevert(bytes("L17"));
        tested.stopRewardsRedirection(from, address(0));
    }

    function testFuzz_stopRewardsRedirection_6(
        address from,
        address to,
        address otherAccount
    ) public {
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
        vm.expectRevert(bytes("L18"));
        vm.prank(otherAccount);
        tested.stopRewardsRedirection(from, to);
    }

    function testFuzz_stopRewardsRedirection_7(uint16 aprUD7x3, address from, address to) public {
        console.log("Should success if caller is owner");
        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        tested.startRewardsRedirection(from, to);
        tested.stopRewardsRedirection(from, to);
    }

    function testFuzz_stopRewardsRedirection_8(uint16 aprUD7x3, address from, address to) public {
        console.log("Should success if caller is from");
        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        tested.startRewardsRedirection(from, to);
        vm.prank(from);
        tested.stopRewardsRedirection(from, to);
    }

    function testFuzz_stopRewardsRedirection_9(address from, address to) public {
        console.log("Should revert there were no redirect for given from and to accounts");

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Expect revert
        vm.expectRevert(bytes("L19"));
        vm.prank(from);
        tested.stopRewardsRedirection(from, to);
    }

    function testFuzz_stopRewardsRedirection_10(
        uint16 aprUD7x3,
        address from,
        address to,
        uint32 duration
    ) public {
        console.log("Should reset from and to accounts investment periods");
        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        tested.startRewardsRedirection(from, to);

        // Move time forward to simulate investment period
        vm.assume(duration > 0);
        skip(duration);

        // Stop redirect
        tested.stopRewardsRedirection(from, to);

        // Assert that block timestamp is not 0
        assertNotEq(block.timestamp, 0);

        // Assert that from and to accounts investment period is equal to block timestamp
        assertEq(tested.public_accountsInfos(from).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(to).period.timestamp, block.timestamp);
    }

    function testFuzz_stopRewardsRedirection_11(uint16 aprUD7x3, address from, address to) public {
        console.log(
            "Should reset to address at index from in rewardsRedirectsFromTo to zero address"
        );
        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        tested.startRewardsRedirection(from, to);

        // Assert that rewardsRedirectsFromTo[from] is currently equal to to
        assertEq(tested.rewardsRedirectsFromTo(from), to);

        // Stop redirect
        tested.stopRewardsRedirection(from, to);

        // Assert that rewardsRedirectsFromTo[from] is now equal to zero address
        assertEq(tested.rewardsRedirectsFromTo(from), address(0));
    }

    function testFuzz_stopRewardsRedirection_12(uint16 aprUD7x3, address from, address to) public {
        console.log("Should properly remove from address from index to in rewardsRedirectsToFrom");
        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Ensure accounts different and not not the zero address
        vm.assume(from != to);
        vm.assume(from != address(0));
        vm.assume(to != address(0));

        // Start redirect
        tested.startRewardsRedirection(from, to);

        // Assert that rewardsRedirectsToFrom[to][] is currently equal to from
        assertEq(tested.rewardsRedirectsToFrom(to, 0), from);

        // Stop redirect
        tested.stopRewardsRedirection(from, to);

        // Assert that index doesn't exist anymore
        vm.expectRevert();
        tested.rewardsRedirectsToFrom(to, 0);
    }

    function testFuzz_stopRewardsRedirection_13(
        uint16 aprUD7x3,
        address from1,
        address from2,
        address from3,
        address to
    ) public {
        console.log(
            "Shouldn't let empty array slot and fill them with last element of the rewardsRedirectsToFrom array"
        );

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Ensure accounts different and not not the zero address
        vm.assume(from1 != to);
        vm.assume(from2 != to);
        vm.assume(from3 != to);
        vm.assume(from1 != from2);
        vm.assume(from1 != from3);
        vm.assume(from2 != from3);
        vm.assume(from1 != address(0));
        vm.assume(from2 != address(0));
        vm.assume(from3 != address(0));
        vm.assume(to != address(0));

        // Start redirect all from to to
        tested.startRewardsRedirection(from1, to);
        tested.startRewardsRedirection(from2, to);
        tested.startRewardsRedirection(from3, to);

        // Assert that they have properly been set in rewardsRedirectsToFrom
        assertEq(tested.rewardsRedirectsToFrom(to, 0), from1);
        assertEq(tested.rewardsRedirectsToFrom(to, 1), from2);
        assertEq(tested.rewardsRedirectsToFrom(to, 2), from3);

        // Stop redirect from2 to to
        tested.stopRewardsRedirection(from2, to);

        // Assert that index have been properly updated without letting blank slot
        assertEq(tested.rewardsRedirectsToFrom(to, 0), from1);
        assertEq(tested.rewardsRedirectsToFrom(to, 1), from3);

        // Assert that the array has not third item anymore
        vm.expectRevert();
        tested.rewardsRedirectsToFrom(to, 2);
    }

    // =========================
    // === getAPR() function ===
    function test_getAPR_1() public {
        console.log(
            "Should not revert and return 0 before APR is manually set (first APR is created to 0% during init)"
        );

        // Expect returning 0
        assertEq(tested.getAPR(), 0);
    }

    function testFuzz_getAPR_2(uint16 newAPRUD7x3) public {
        console.log("Should return last set APR");

        // Set a new latest APR and ensure getAPR() returns it
        vm.assume(newAPRUD7x3 > 0);
        tested.setAPR(newAPRUD7x3);
        assertEq(tested.getAPR(), newAPRUD7x3);
    }

    // ==================================
    // === _distributeRewards() function ===
    function testFuzz__distributeRewards_1(address account, uint256 amount) public {
        console.log("Should return false when not implemented");
        // Note: as we don't call set_distributeRewards_Implemented(true) the function
        // behave like it's not implemented
        assertFalse(tested.public_distributeRewards(account, amount));
    }

    // ==========================================
    // === _calculatePeriodRewards() function ===
    function testFuzz__calculatePeriodRewards_1(
        uint8 decimals,
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD7x3,
        uint256 investedAmount
    ) public {
        console.log(
            "Shouldn't overflow/underflow before 100T of invested amount and up to 18 decimals."
        );

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Ensure beginTimestamp is before endTimestamp
        vm.assume(beginTimestamp < endTimestamp);

        // Calculate rewards (shouldn't revert)
        tested.public_calculatePeriodRewards(
            beginTimestamp,
            endTimestamp,
            aprUD7x3,
            investedAmount
        );
    }

    function testFuzz__calculatePeriodRewards_2(
        uint8 decimals,
        uint16 aprUD7x3,
        uint256 investedAmount,
        uint40 beginTimestamp,
        uint40 endTimestamp
    ) public {
        console.log(
            "Should, no matter the precision loss, never apply an APR greater than the real one"
        );

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Ensure beginTimestamp is before endTimestamp
        vm.assume(beginTimestamp < endTimestamp);

        // Get rewards
        uint256 rewards = tested.public_calculatePeriodRewards(
            beginTimestamp,
            endTimestamp,
            aprUD7x3,
            investedAmount
        );

        // Assert that rewards are greater than 0 (prevent division by 0)
        vm.assume(rewards > 0);

        // Compute applied APR from rewards, elapsed time and invested amount
        // - Convert rewards and investedAmount to SUD
        uint256 rewardsSUD = SUD.fromAmount(rewards, decimals);
        uint256 investedAmountSUD = SUD.fromAmount(investedAmount, decimals);

        // - Compute growth of investedAmount after rewards
        uint256 growthSUD = (rewardsSUD * SUD.fromInt(100, decimals)) / investedAmountSUD;

        // - Compute elapsed time in years
        uint256 elaspedTimeSUD = SUD.fromInt(endTimestamp - beginTimestamp, decimals);
        uint256 elapsedYearsSUD = (elaspedTimeSUD * SUD.fromInt(1, decimals)) /
            SUD.fromInt(365 days, decimals);

        // - Obtain applied APR from above values
        uint256 appliedAPRSUD = (growthSUD * SUD.fromInt(1, decimals)) / elapsedYearsSUD;
        uint256 appliedAPRUD7x3 = SUD.toRate(appliedAPRSUD, decimals);

        // Ensure applied APR is not greated than real one
        assertLe(appliedAPRUD7x3, aprUD7x3);
    }

    function testFuzz__calculatePeriodRewards_3(
        uint8 decimals,
        uint16 aprUD7x3,
        uint256 investedAmount,
        uint40 beginTimestamp,
        uint40 endTimestamp
    ) public {
        console.log("Should properly apply the given APR");

        // Bound decimals to [3, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Ensure APR is greater than 1%
        aprUD7x3 = uint16(bound(aprUD7x3, 1 * 10 ** 3, type(uint16).max));

        // Ensure invested amount is greater than 1000 units and caped to 100T
        investedAmount = bound(
            investedAmount,
            1000 * 10 ** decimals,
            100_000_000_000_000 * 10 ** decimals
        );

        // Ensure beginTimestamp is before endTimestamp and is forward of at least 10 days
        vm.assume(beginTimestamp < type(uint40).max - 10 days);
        endTimestamp = uint40(bound(endTimestamp, beginTimestamp + 10 days, type(uint40).max));

        // Get rewards
        uint256 rewards = tested.public_calculatePeriodRewards(
            beginTimestamp,
            endTimestamp,
            aprUD7x3,
            investedAmount
        );

        // Assert that rewards are greater than 0 (prevent division by 0)
        vm.assume(rewards > 0);

        // Compute applied APR from rewards, elapsed time and invested amount
        // - Convert rewards and investedAmount to SUD
        uint256 rewardsSUD = SUD.fromAmount(rewards, decimals);
        uint256 investedAmountSUD = SUD.fromAmount(investedAmount, decimals);

        // - Compute growth of investedAmount after rewards
        uint256 growthSUD = (rewardsSUD * SUD.fromInt(100, decimals)) / investedAmountSUD;

        // - Compute elapsed time in years
        uint256 elaspedTimeSUD = SUD.fromInt(endTimestamp - beginTimestamp, decimals);
        uint256 elapsedYearsSUD = (elaspedTimeSUD * SUD.fromInt(1, decimals)) /
            SUD.fromInt(365 days, decimals);

        // - Obtain applied APR from above values
        uint256 appliedAPRSUD = (growthSUD * SUD.fromInt(1, decimals)) / elapsedYearsSUD;
        uint256 appliedAPRUD7x3 = SUD.toRate(appliedAPRSUD, decimals);

        // Compute difference between given and applied APRs
        uint256 difference = aprUD7x3 - appliedAPRUD7x3;

        // Ensure difference is in an acceptable range
        // Note: As lower decimals number incur higher precision loss on short investment
        // periods with low invested amounts or APRs, the acceptable range is higher for
        // lower decimals number
        if (decimals == 0)
            assertLe(difference, 10000); // 10%
        else if (decimals == 1)
            assertLe(difference, 1000); // 1%
        else if (decimals == 2)
            assertLe(difference, 100); // 0.1%
        else assertLe(difference, 10); // 0.01%
    }

    function testFuzz__calculatePeriodRewards_4(
        uint8 decimals,
        uint16 aprUD7x3,
        uint256 investedAmount,
        uint40 beginTimestamp,
        uint40 endTimestamp
    ) public {
        console.log(
            "Should, no matter the precision loss, never apply a given period greater than the real one"
        );

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Ensure beginTimestamp is before endTimestamp
        vm.assume(beginTimestamp < endTimestamp);

        // Get rewards
        uint256 rewards = tested.public_calculatePeriodRewards(
            beginTimestamp,
            endTimestamp,
            aprUD7x3,
            investedAmount
        );

        // Assert that rewards are greater than 0 (prevent division by 0)
        vm.assume(rewards > 0);

        // Compute applied elapsed time from rewards, APR and invested amount
        // - Convert rewards, investedAmount and APR to SUD
        uint256 rewardsSUD = SUD.fromAmount(rewards, decimals);
        uint256 investedAmountSUD = SUD.fromAmount(investedAmount, decimals);
        uint256 aprSUD = SUD.fromRate(aprUD7x3, decimals);

        // - Compute growth of investedAmount after rewards
        uint256 growthSUD = (rewardsSUD * SUD.fromInt(100, decimals)) / investedAmountSUD;

        // - Obtain applied elapsed time from above values
        uint256 appliedElapsedYearSUD = (growthSUD * SUD.fromInt(1, decimals)) / aprSUD;
        uint256 appliedElapsedTimeSUD = (appliedElapsedYearSUD * SUD.fromInt(365 days, decimals)) /
            SUD.fromInt(1, decimals);
        uint256 appliedElapsedTime = SUD.toInt(appliedElapsedTimeSUD, decimals);

        // Ensure applied elapsed time is not greater than real one
        assertLe(appliedElapsedTime, endTimestamp - beginTimestamp);
    }

    function testFuzz__calculatePeriodRewards_5(
        uint8 decimals,
        uint16 aprUD7x3,
        uint256 investedAmount,
        uint40 beginTimestamp,
        uint40 endTimestamp
    ) public {
        console.log("Should properly apply the given period");

        // Bound decimals to [3, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Ensure APR is greater than 1%
        aprUD7x3 = uint16(bound(aprUD7x3, 1 * 10 ** 3, type(uint16).max));

        // Ensure invested amount is greater than 1000 units and caped to 100T
        investedAmount = bound(
            investedAmount,
            1000 * 10 ** decimals,
            100_000_000_000_000 * 10 ** decimals
        );

        // Ensure beginTimestamp is before endTimestamp and is forward of at least 10 days
        vm.assume(beginTimestamp < type(uint40).max - 100 days);
        endTimestamp = uint40(bound(endTimestamp, beginTimestamp + 10 days, type(uint40).max));

        // Get rewards
        uint256 rewards = tested.public_calculatePeriodRewards(
            beginTimestamp,
            endTimestamp,
            aprUD7x3,
            investedAmount
        );

        // Assert that rewards are greater than 0 (prevent division by 0)
        vm.assume(rewards > 0);

        // Compute applied elapsed time from rewards, APR and invested amount
        // - Convert rewards, investedAmount and APR to SUD
        uint256 rewardsSUD = SUD.fromAmount(rewards, decimals);
        uint256 investedAmountSUD = SUD.fromAmount(investedAmount, decimals);
        uint256 aprSUD = SUD.fromRate(aprUD7x3, decimals);

        // - Compute growth of investedAmount after rewards
        uint256 growthSUD = (rewardsSUD * SUD.fromInt(100, decimals)) / investedAmountSUD;

        // - Obtain applied elapsed time from above values
        uint256 appliedElapsedYearSUD = (growthSUD * SUD.fromInt(1, decimals)) / aprSUD;
        uint256 appliedElapsedTimeSUD = (appliedElapsedYearSUD * SUD.fromInt(365 days, decimals)) /
            SUD.fromInt(1, decimals);
        uint256 appliedElapsedTime = SUD.toInt(appliedElapsedTimeSUD, decimals);

        // Compute difference between given and applied elapsed times
        uint256 givenElapsedTime = endTimestamp - beginTimestamp;
        uint256 difference = givenElapsedTime - appliedElapsedTime;

        // Ensure that difference is less than 1 day

        // Ensure difference is in an acceptable range
        // Note: As lower decimals number incur higher precision loss on short investment
        // periods with low invested amounts or APRs, the acceptable range is higher for
        // lower decimals number
        if (decimals == 0) assertLe(difference, 40 days);
        else if (decimals == 1) assertLe(difference, 4 days);
        else if (decimals == 2) assertLe(difference, 1 days);
        else assertLe(difference, 1 days);
    }

    function testFuzz__calculatePeriodRewards_6(
        uint8 decimals,
        uint16 aprUD7x3,
        uint256 investedAmount,
        uint40 beginTimestamp,
        uint40 endTimestamp
    ) public {
        console.log(
            "Should, no matter the precision loss, never apply an invested amount greater than the real one"
        );

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Ensure beginTimestamp is before endTimestamp
        vm.assume(beginTimestamp < endTimestamp);

        // Get rewards
        uint256 rewards = tested.public_calculatePeriodRewards(
            beginTimestamp,
            endTimestamp,
            aprUD7x3,
            investedAmount
        );

        // Assert that rewards are greater than 0 (prevent division by 0)
        vm.assume(rewards > 0);

        // Compute applied invested amount from rewards, APR and elapsed time
        // - Convert rewards, APR to SUD
        uint256 aprSUD = SUD.fromRate(aprUD7x3, decimals);
        uint256 rewardsSUD = SUD.fromAmount(rewards, decimals);

        // - Compute elasped time in years
        uint256 elaspedTimeSUD = SUD.fromInt(endTimestamp - beginTimestamp, decimals);
        uint256 elapsedYearsSUD = (elaspedTimeSUD * SUD.fromInt(1, decimals)) /
            SUD.fromInt(365 days, decimals);

        // - Compute growth of investedAmount after rewards
        uint256 growthSUD = (elapsedYearsSUD * aprSUD) / SUD.fromInt(1, decimals);

        // - Obtain applied invested amount from above values
        uint256 appliedInvestedAmountSUD = (rewardsSUD * SUD.fromInt(100, decimals)) / growthSUD;
        uint256 appliedInvestedAmount = SUD.toAmount(appliedInvestedAmountSUD, decimals);

        // Ensure applied invested amount is not greater than real one
        assertLe(appliedInvestedAmount, investedAmount);
    }

    function testFuzz__calculatePeriodRewards_7(
        uint8 decimals,
        uint16 aprUD7x3,
        uint256 investedAmount,
        uint40 beginTimestamp,
        uint40 endTimestamp
    ) public {
        console.log("Should properly apply an invested amount");

        // Bound decimals to [3, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Ensure APR is greater than 1%
        aprUD7x3 = uint16(bound(aprUD7x3, 1 * 10 ** 3, type(uint16).max));

        // Ensure invested amount is greater than 1000 units and caped to 100T
        investedAmount = bound(
            investedAmount,
            1000 * 10 ** decimals,
            100_000_000_000_000 * 10 ** decimals
        );

        // Ensure beginTimestamp is before endTimestamp and is forward of at least 10 days
        vm.assume(beginTimestamp < type(uint40).max - 10 days);
        endTimestamp = uint40(bound(endTimestamp, beginTimestamp + 10 days, type(uint40).max));

        // Get rewards
        uint256 rewards = tested.public_calculatePeriodRewards(
            beginTimestamp,
            endTimestamp,
            aprUD7x3,
            investedAmount
        );

        // Assert that rewards are greater than 0 (prevent division by 0)
        vm.assume(rewards > 0);

        // Compute applied invested amount from rewards, APR and elapsed time
        // - Convert rewards, APR to SUD
        uint256 aprSUD = SUD.fromRate(aprUD7x3, decimals);
        uint256 rewardsSUD = SUD.fromAmount(rewards, decimals);

        // - Compute elasped time in years
        uint256 elaspedTimeSUD = SUD.fromInt(endTimestamp - beginTimestamp, decimals);
        uint256 elapsedYearsSUD = (elaspedTimeSUD * SUD.fromInt(1, decimals)) /
            SUD.fromInt(365 days, decimals);

        // - Compute growth of investedAmount after rewards
        uint256 growthSUD = (elapsedYearsSUD * aprSUD) / SUD.fromInt(1, decimals);

        // - Obtain applied invested amount from above values
        uint256 appliedInvestedAmountSUD = (rewardsSUD * SUD.fromInt(100, decimals)) / growthSUD;
        uint256 appliedInvestedAmount = SUD.toAmount(appliedInvestedAmountSUD, decimals);

        // Compute difference between given and applied invested amounts
        uint256 difference = investedAmount - appliedInvestedAmount;

        // Ensure difference is in an acceptable range
        // Note: As lower decimals number incur higher precision loss on short investment
        // periods with low invested amounts or APRs, the acceptable range is higher for
        // lower decimals number
        if (decimals == 0)
            assertLe(difference, 4000 * 10 ** decimals); // 4000 units
        else if (decimals == 1)
            assertLe(difference, 400 * 10 ** decimals); // 400 units
        else if (decimals == 2)
            assertLe(difference, 40 * 10 ** decimals); // 40 units
        else assertLe(difference, 4 * 10 ** decimals); // 4 units
    }

    // ====================================
    // === _deepInvestmentOf() function ===
    function testFuzz__deepInvestmentOf_1(address account) public {
        console.log("Should return 0 when no investment");

        assertEq(tested.public_deepInvestmentOf(account), 0);
    }

    function testFuzz__deepInvestmentOf_2(
        uint16 aprUD7x3,
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
        amount = bound(amount, 0, 100_000_000_000_000 * 10 ** investedToken.decimals());

        // Set first random APR
        tested.setAPR(aprUD7x3);

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
        uint16 aprUD7x3,
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
        amount = bound(amount, 0, 100_000_000_000_000 * 10 ** investedToken.decimals());

        // Set first random APR
        tested.setAPR(aprUD7x3);

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
        tested.startRewardsRedirection(account2, account1);

        // Assert that deep investment of account1 is equal to its investment plus account2 investment
        assertEq(tested.public_deepInvestmentOf(account1), amount + 1 + amount + 2);

        // Redirect account3 rewards to account2
        tested.startRewardsRedirection(account3, account2);

        // Assert that deep investment of account1 is equal to its investment plus account2 investment plus account3 investment
        assertEq(tested.public_deepInvestmentOf(account1), amount + 1 + amount + 2 + amount + 3);

        // Stop redirect account2 rewards to account1
        tested.stopRewardsRedirection(account2, account1);

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

    function testFuzz__rewardsOf_2(uint8 decimals, uint16 aprUD7x3, bool autocompound) public {
        console.log("Should return 0 when APR checkpoints but no investment");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap APR to half its max value
        aprUD7x3 = uint16(bound(aprUD7x3, 0, type(uint16).max / 2));

        // Set first random APR value and ensure rewards of returns 0
        tested.setAPR(aprUD7x3);
        assertEq(tested.public_rewardsOf(address(1234), autocompound), 0);

        // Set second random APR value and ensure rewards of returns 0
        tested.setAPR(aprUD7x3 * 2);
        assertEq(tested.public_rewardsOf(address(1234), autocompound), 0);
    }

    function testFuzz__rewardsOf_3(
        uint8 decimals,
        uint16 aprUD7x3,
        uint256 investedAmount,
        uint256 investmentDuration,
        bool autocompound
    ) public {
        console.log(
            "Should properly calculate rewards when no new APR checkpoint after investment"
        );

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Set random APR
        tested.setAPR(aprUD7x3);

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
            aprUD7x3,
            investedAmount
        );

        assertEq(tested.public_rewardsOf(address(1234), autocompound), expectedRewards);
    }

    function testFuzz__rewardsOf_4(
        uint8 decimals,
        uint16 aprUD7x3,
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
        investedAmount = bound(investedAmount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Cap interval between checkpoints to 365 days
        investmentDuration = uint40(bound(investmentDuration, 0, 365 days));

        // Cap number of checkpoints to 200
        numberOfCheckpoints = bound(numberOfCheckpoints, 1, 100);

        // Create random number of checkpoints after investment
        uint256 expectedRewards = 0;
        uint40 latestCheckpointTimestamp = uint40(block.timestamp);
        uint16 latestCheckpointApr = aprUD7x3;

        // Create first APR
        tested.setAPR(latestCheckpointApr);

        // Invest random amount of tokens
        vm.prank(address(1234));
        tested.stake(investedAmount);

        // Create random number of checkpoints after investment
        for (uint256 i = 0; i < numberOfCheckpoints; i++) {
            uint40 newCheckpointTimestamp = uint40(block.timestamp);
            uint16 newCheckpointApr = aprUD7x3;
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
        uint16 aprUD7x3,
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
        investedAmount = bound(investedAmount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Cap interval between checkpoints to 365 days
        investmentDuration = uint40(bound(investmentDuration, 0, 365 days));

        // Cap number of checkpoints to 200
        numberOfCheckpoints = bound(numberOfCheckpoints, 1, 100);

        // Create random number of checkpoints after investment
        uint256 expectedRewards = 0;
        uint40 latestCheckpointTimestamp = uint40(block.timestamp);
        uint16 latestCheckpointApr = aprUD7x3;

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
        tested.startRewardsRedirection(account2, account1);

        // Redirect account3 rewards to account2
        tested.startRewardsRedirection(account3, account2);

        // Consider that now account1 deposited amount is equal to account1 + account2 deposited amounts
        uint256 depositedAmount = investedAmount + 1 + investedAmount + 2 + investedAmount + 3;

        // Create random number of checkpoints after investment
        for (uint256 i = 0; i < numberOfCheckpoints; i++) {
            uint40 newCheckpointTimestamp = uint40(block.timestamp);
            uint16 newCheckpointApr = aprUD7x3;
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
        uint16 aprUD7x3,
        address account,
        uint32 duration
    ) public {
        console.log("Should reset given account investment period");

        // Set random APR
        tested.setAPR(aprUD7x3);

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
        uint16 aprUD7x3,
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
        tested.setAPR(aprUD7x3);

        // Assert that accounts are different
        vm.assume(account1 != account2);
        vm.assume(account1 != account3);
        vm.assume(account2 != account3);

        // Cap amount to 100T
        amount = bound(amount, 0, 100_000_000_000_000 * 10 ** investedToken.decimals());

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
        uint16 newAPRUD7x3 = aprUD7x3 < type(uint16).max ? aprUD7x3 + 1 : aprUD7x3 - 1;
        tested.setAPR(newAPRUD7x3);

        // Call _deepResetInvestmentPeriodOf() on account
        tested.public_deepResetInvestmentPeriodOf(account1);

        // Assert that account investment period has been reset
        assertEq(tested.public_accountsInfos(account1).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(account1).period.ref.cursorIndex, 2);

        // Assert that other accounts investment period haven't been reset
        assertEq(tested.public_accountsInfos(account2).period.timestamp, 1);
        assertEq(tested.public_accountsInfos(account2).period.ref.cursorIndex, 1);

        assertEq(tested.public_accountsInfos(account3).period.timestamp, 1);
        assertEq(tested.public_accountsInfos(account3).period.ref.cursorIndex, 1);
    }

    function testFuzz__deepResetInvestmentPeriodOf_3(
        uint16 aprUD7x3,
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
        tested.setAPR(aprUD7x3);

        // Assert that accounts are different and not zero addresses
        vm.assume(account1 != account2);
        vm.assume(account1 != account3);
        vm.assume(account2 != account3);
        vm.assume(account1 != address(0));
        vm.assume(account2 != address(0));
        vm.assume(account3 != address(0));

        // Cap amount to 100T
        amount = bound(amount, 0, 100_000_000_000_000 * 10 ** investedToken.decimals());

        // Invest random amount of tokens with 3 accounts
        // This will initialize their investment periods
        vm.prank(account1);
        tested.stake(amount + 1);
        vm.prank(account2);
        tested.stake(amount + 2);
        vm.prank(account3);
        tested.stake(amount + 3);

        // Redirect account2 rewards to account1
        tested.startRewardsRedirection(account2, account1);

        // Redirect account3 rewards to account2
        tested.startRewardsRedirection(account3, account2);

        // Assert that current accounts investment period is 1 (first block timestamp)
        assertEq(tested.public_accountsInfos(account1).period.timestamp, 1);
        assertEq(tested.public_accountsInfos(account2).period.timestamp, 1);
        assertEq(tested.public_accountsInfos(account3).period.timestamp, 1);

        // Skip random amount of time to simulate investment period
        duration = uint32(bound(duration, 1, type(uint32).max));
        skip(duration);

        // Set new APR
        uint16 newAPRUD7x3 = aprUD7x3 < type(uint16).max ? aprUD7x3 + 1 : aprUD7x3 - 1;
        tested.setAPR(newAPRUD7x3);

        // Call _deepResetInvestmentPeriodOf() on account
        tested.public_deepResetInvestmentPeriodOf(account1);

        // Assert that account investment period has been reset
        assertEq(tested.public_accountsInfos(account1).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(account1).period.ref.cursorIndex, 2);

        // Assert that other accounts investment period have been reset
        assertEq(tested.public_accountsInfos(account2).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(account2).period.ref.cursorIndex, 2);

        assertEq(tested.public_accountsInfos(account3).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(account3).period.ref.cursorIndex, 2);
    }

    // ===========================================
    // === _beforeInvestmentChange() function ===
    function test__beforeInvestmentChange_1(
        uint8 decimals,
        uint256 investedAmount,
        uint16 aprUD7x3,
        uint40 investmentDuration,
        bool autocompound
    ) public {
        console.log(
            "Should call claim rewards once / no infinite re-entrancy if _distributeRewards() itself indirectly or directly calls _beforeInvestmentChange()"
        );

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Cap interval between checkpoints to 100 years
        investmentDuration = uint40(bound(investmentDuration, 0, 100 * 365 days));

        // Implements _distributeRewards() and make it call _beforeInvestmentChange() again
        tested.set_distributeRewards_Implemented(true);
        tested.set_distributeRewards_ResetInvestmentPeriod(true);

        // Simulate investment period
        tested.setAPR(aprUD7x3);
        vm.prank(address(1234));
        tested.stake(investedAmount);
        skip(investmentDuration);

        // Call _beforeInvestmentChange()
        tested.public_beforeInvestmentChange(address(1234), autocompound);

        // Check that _distributeRewards() has been called once
        // Note that we use "lower than equal" as the _distributeRewards() function may not be
        // called at all if rewards are equal to 0
        assertLe(tested._distributeRewards_CallsCount(), 1);
    }

    function test__beforeInvestmentChange_2(
        uint8 decimals,
        uint256 investedAmount,
        uint16 aprUD7x3,
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
        investedAmount = bound(investedAmount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Cap interval between checkpoints to 100 years
        investmentDuration = uint40(bound(investmentDuration, 0, 100 * 365 days));

        // Randomly implement _distributeRewards()
        tested.set_distributeRewards_Implemented(isImplemented);

        // Simulate investment period
        tested.setAPR(aprUD7x3);
        vm.prank(address(1234));
        tested.stake(investedAmount);
        skip(investmentDuration);

        // Store expected rewards and old staked and virtual balances
        uint256 expectedRewards = tested.public_rewardsOf(address(1234), autocompound);
        uint256 oldStakedBalance = tested.stakeOf(address(1234));
        uint256 oldVirtualBalance = tested.public_accountsInfos(address(1234)).virtualBalance;

        // Call _beforeInvestmentChange()
        tested.public_beforeInvestmentChange(address(1234), autocompound);

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

    function test__beforeInvestmentChange_3(
        uint8 decimals,
        address account1,
        address account2,
        address account3,
        uint256 investedAmount,
        uint16 aprUD7x3,
        uint32 duration,
        bool autocompound,
        bool isImplemented
    ) public {
        console.log(
            "Should distribute rewards to account at the very end of the redirection chain"
        );
        // Set random APR
        tested.setAPR(aprUD7x3);

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
        investedAmount = bound(investedAmount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Invest random amount of tokens with 3 accounts
        // This will initialize their investment periods
        vm.prank(account1);
        tested.stake(investedAmount + 1);
        vm.prank(account2);
        tested.stake(investedAmount + 2);
        vm.prank(account3);
        tested.stake(investedAmount + 3);

        // Redirect account2 rewards to account1
        tested.startRewardsRedirection(account2, account1);

        // Redirect account3 rewards to account2
        tested.startRewardsRedirection(account3, account2);

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

        // Call _beforeInvestmentChange()
        tested.public_beforeInvestmentChange(account1, autocompound);

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

    function test__beforeInvestmentChange_4(
        uint8 decimals,
        uint256 investedAmount,
        uint16 aprUD7x3,
        uint40 investmentDuration,
        bool autocompound,
        bool isImplemented
    ) public {
        console.log("Should reset investment period timestamp of given account to now");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Cap interval between checkpoints to 100 years
        investmentDuration = uint40(bound(investmentDuration, 0, 100 * 365 days));

        // Randomly implement _distributeRewards()
        tested.set_distributeRewards_Implemented(isImplemented);

        // Simulate investment period
        tested.setAPR(aprUD7x3);
        vm.prank(address(1234));
        tested.stake(investedAmount);
        skip(investmentDuration);

        // Call _beforeInvestmentChange()
        tested.public_beforeInvestmentChange(address(1234), autocompound);

        // Ensure that the investment period timestamp has been updated to now
        assertEq(tested.public_accountsInfos(address(1234)).period.timestamp, block.timestamp);
    }

    function test__beforeInvestmentChange_5(
        uint8 decimals,
        address account1,
        address account2,
        address account3,
        uint256 investedAmount,
        uint16 aprUD7x3,
        uint32 duration,
        bool autocompound,
        bool isImplemented
    ) public {
        console.log(
            "Should reset investment period timestamp of all accounts that directly or indirectly redirect rewards to given accounts"
        );
        // Set random APR
        tested.setAPR(aprUD7x3);

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
        investedAmount = bound(investedAmount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Invest random amount of tokens with 3 accounts
        // This will initialize their investment periods
        vm.prank(account1);
        tested.stake(investedAmount + 1);
        vm.prank(account2);
        tested.stake(investedAmount + 2);
        vm.prank(account3);
        tested.stake(investedAmount + 3);

        // Redirect account2 rewards to account1
        tested.startRewardsRedirection(account2, account1);

        // Redirect account3 rewards to account2
        tested.startRewardsRedirection(account3, account2);

        // Assert that current accounts investment period is 1 (first block timestamp)
        assertEq(tested.public_accountsInfos(account1).period.timestamp, 1);
        assertEq(tested.public_accountsInfos(account2).period.timestamp, 1);
        assertEq(tested.public_accountsInfos(account3).period.timestamp, 1);

        // Skip random amount of time to simulate investment period
        duration = uint32(bound(duration, 1, type(uint32).max));
        skip(duration);

        // Set new APR
        uint16 newAPRUD7x3 = aprUD7x3 < type(uint16).max ? aprUD7x3 + 1 : aprUD7x3 - 1;
        tested.setAPR(newAPRUD7x3);

        // Call _beforeInvestmentChange()
        tested.public_beforeInvestmentChange(account1, autocompound);

        // Assert that account investment period has been reset
        assertEq(tested.public_accountsInfos(account1).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(account1).period.ref.cursorIndex, 2);

        // Assert that other accounts investment period have been reset
        assertEq(tested.public_accountsInfos(account2).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(account2).period.ref.cursorIndex, 2);

        assertEq(tested.public_accountsInfos(account3).period.timestamp, block.timestamp);
        assertEq(tested.public_accountsInfos(account3).period.ref.cursorIndex, 2);
    }
}
