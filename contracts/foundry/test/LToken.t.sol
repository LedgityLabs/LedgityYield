// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";
import {ModifiersExpectations} from "./_helpers/ModifiersExpectations.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import {LToken} from "../../src/LToken.sol";

import {LDYStaking} from "../../dev/LDYStaking.sol";
import {GlobalOwner} from "../../src/GlobalOwner.sol";
import {GlobalPause} from "../../src/GlobalPause.sol";
import {GlobalBlacklist} from "../../src/GlobalBlacklist.sol";
import {GenericERC20} from "../../dev/GenericERC20.sol";

import {SUD} from "../../src/libs/SUD.sol";
import {APRHistory as APRH} from "../../src/libs/APRHistory.sol";
import {ITransfersListener} from "../../src/interfaces/ITransfersListener.sol";

contract Vault is ITransfersListener {
    /// @dev Holds the LToken contract address allowed to call onLTokenTransfer()
    address public lToken;

    /// @dev Stores data received from onLTokenTransfer()
    struct HookData {
        address from;
        address to;
        uint256 amount;
    }
    HookData[] public hookData;

    /// @dev Modifier to restrict access to the LToken contract
    modifier onlyLToken() {
        require(msg.sender == lToken, "Vault: restricted to LToken");
        _;
    }

    /// @dev Sets the LToken contract address allowed to call onLTokenTransfer() at deployment-time
    constructor(address _lToken) {
        lToken = _lToken;
    }

    /**
     * @dev Implementation of ITransfersListener.onLTokenTransfer() that simply stores
     * the received data on chain so unit tests can easily assert that this function has
     * been called with the expected parameters.
     */
    function onLTokenTransfer(address from, address to, uint256 amount) external onlyLToken {
        hookData.push(HookData(from, to, amount));
    }
}

contract TestedContract is LToken {
    /**
     * @dev Functions to tests modifiers
     */
    function restrictedToWithdrawer() public onlyWithdrawer {}

    function restrictedToFund() public onlyFund {}

    /**
     * @dev Functions to manually set variables
     */
    function tool_rawSetUnclaimedFees(uint256 amount) public {
        unclaimedFees = amount;
    }

    function tool_rawSetTotalQueued(uint256 amount) public {
        totalQueued = amount;
    }

    function tool_rawSetUsableUnderlyings(uint256 amount) public {
        usableUnderlyings = amount;
    }

    /**
     * @dev Uncapped setter for the retention rate
     */
    function tool_setRetentionRate(uint32 _retentionRateUD7x3) public {
        retentionRateUD7x3 = _retentionRateUD7x3;
    }

    function tool_simulateProcessedBigRequestInQueue() public {
        withdrawalQueue.push(WithdrawalRequest(address(0), 0));
        delete withdrawalQueue[withdrawalQueue.length - 1];
    }

    /**
     * @dev Make some useful InvestUpgradeable functions public to use them in tests
     */
    function public_accountsInfos(address account) public view returns (AccountInfos memory) {
        return accountsInfos[account];
    }

    /**
     * @dev Make some useful LToken functions public to use them in tests
     */
    function public_distributeRewards(address account, uint256 amount) public returns (bool) {
        return _distributeRewards(account, amount);
    }

    function public_beforeTokenTransfer(address from, address to, uint256 amount) public {
        return _beforeTokenTransfer(from, to, amount);
    }

    function public_transferExceedingToFund() public {
        return _transferExceedingToFund();
    }

    function public_withdrawalQueueLength() public view returns (uint256) {
        return withdrawalQueue.length;
    }

    function public_withdrawalQueueCursor() public view returns (uint256) {
        return withdrawalQueueCursor;
    }
}

contract Tests is Test, ModifiersExpectations {
    TestedContract tested;
    GlobalOwner globalOwner;
    GlobalPause globalPause;
    GlobalBlacklist globalBlacklist;
    LDYStaking ldyStaking;

    GenericERC20 ldyToken;
    GenericERC20 underlyingToken;
    GenericERC20 anotherToken;

    Vault vault1;
    Vault vault2;

    address payable withdrawerWallet = payable(address(bytes20("withdrawerWallet")));
    address payable fundWallet = payable(address(bytes20("fundWallet")));

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

        // Deploy GenericERC20 (the $LDY token)
        ldyToken = new GenericERC20("Ledgity Token", "LDY", 18);
        vm.label(address(ldyToken), "LDY token");

        // Deploy LDYStaking
        LDYStaking impl4 = new LDYStaking();
        ERC1967Proxy proxy4 = new ERC1967Proxy(address(impl4), "");
        ldyStaking = LDYStaking(address(proxy4));
        ldyStaking.initialize(
            address(globalOwner),
            address(globalPause),
            address(globalBlacklist),
            address(ldyToken)
        );
        vm.label(address(ldyStaking), "LDYStaking");

        // Deploy GenericERC20 (the $LDY token)
        underlyingToken = new GenericERC20("Dummy USD", "DUSD", 18);
        vm.label(address(underlyingToken), "Underlying Token");

        // Deploy GenericERC20 (another random token)
        anotherToken = new GenericERC20("Another Token", "ANADA", 18);
        vm.label(address(anotherToken), "Another Token");

        // Deploy tested LToken contract
        TestedContract impl5 = new TestedContract();
        ERC1967Proxy proxy5 = new ERC1967Proxy(address(impl5), "");
        tested = TestedContract(address(proxy5));
        tested.initialize(
            address(globalOwner),
            address(globalPause),
            address(globalBlacklist),
            address(ldyStaking),
            address(underlyingToken)
        );
        vm.label(address(tested), "LToken");

        // Set withdrawer wallet
        tested.setWithdrawer(withdrawerWallet);

        // Set fund wallet
        tested.setFund(fundWallet);

        // Deploy a first external Vault contract (a transfers listener)
        vault1 = new Vault(address(tested));
        vm.label(address(vault1), "Vault 1");

        // Deploy a second external Vault contract (a transfers listener)
        vault2 = new Vault(address(tested));
        vm.label(address(vault2), "Vault 2");
    }

    // ==================
    // === Invariants ===
    // - Usable underlyings should never exceeds expected retained
    function invariant_retention() external {
        if (tested.decimals() > 18) return;
        assertLe(tested.usableUnderlyings(), tested.getExpectedRetained());
    }

    // - Contract underlying balance should never be lower than usable underlyings amount (= missing funds)
    function invariant_underlyingTokens() external {
        if (tested.decimals() > 18) return;

        assertGe(underlyingToken.balanceOf(address(tested)), tested.usableUnderlyings());
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
            address(ldyStaking),
            address(underlyingToken)
        );
    }

    function test_initialize_2() public {
        console.log("Should properly set global owner, pause, blacklist and ldy staking");
        assertEq(tested.globalOwner(), address(globalOwner));
        assertEq(tested.globalPause(), address(globalPause));
        assertEq(tested.globalBlacklist(), address(globalBlacklist));
        assertEq(address(tested.ldyStaking()), address(ldyStaking));
    }

    function test_initialize_3() public {
        console.log("Should properly set invested token to self");
        assertEq(address(tested.invested()), address(tested));
    }

    function test_initialize_4() public {
        console.log("Should properly set wrapped token");
        assertEq(address(tested.underlying()), address(underlyingToken));
    }

    function test_initialize_5() public {
        console.log("Should properly set L-Token name and symbol from underlying token ones");
        assertEq(tested.name(), string.concat("Ledgity ", underlyingToken.name()));
        assertEq(tested.symbol(), string.concat("L", underlyingToken.symbol()));
    }

    function test_initialize_6() public {
        console.log("Should initialize withdrawal fees to 0.3%");
        assertEq(tested.feesRateUD7x3(), 300);
    }

    function test_initialize_7() public {
        console.log("Should initialize retention rate to 5%");
        assertEq(tested.feesRateUD7x3(), 300);
    }

    // ===============================
    // === onlyWithdrawer modifier ===
    function testFuzz_onlyWithdrawer_1(address account) public {
        console.log(
            "Should revert calls made from non-withdrawer wallet and success withdrawer ones"
        );

        // Ensure that account is not the withdrawer wallet
        vm.assume(account != withdrawerWallet);

        // Should revert
        vm.expectRevert(bytes("L39"));
        vm.prank(account);
        tested.restrictedToWithdrawer();

        // Shouldn't revert
        vm.prank(withdrawerWallet);
        tested.restrictedToWithdrawer();
    }

    // =========================
    // === onlyFund modifier ===
    function test_onlyFund_1(address account) public {
        console.log("Should revert calls made from non-fund wallet and success fund ones");

        // Ensure that account is not the withdrawer wallet
        vm.assume(account != fundWallet);

        // Should revert
        vm.expectRevert(bytes("L40"));
        vm.prank(account);
        tested.restrictedToFund();

        // Shouldn't revert
        vm.prank(fundWallet);
        tested.restrictedToFund();
    }

    // ==============================
    // === setFeesRate() function ===
    function testFuzz_setFeesRate_1(address account, uint32 _feesRateUD7x3) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.setFeesRate(_feesRateUD7x3);
    }

    function testFuzz_setFeesRate_2(uint32 _feesRateUD7x3) public {
        console.log("Should change value of feesRateUD7x3");
        tested.setFeesRate(_feesRateUD7x3);
        assertEq(tested.feesRateUD7x3(), _feesRateUD7x3);
    }

    // ====================================
    // === setRetentionRate() function ====
    function testFuzz_setRetentionRate_1(address account, uint32 _retentionRateUD7x3) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.setRetentionRate(_retentionRateUD7x3);
    }

    function testFuzz_setRetentionRate_2(uint32 _retentionRateUD7x3) public {
        console.log("Should revert if trying to set retention rate higher than 10%");

        // Ensure the retention rate is >10%
        _retentionRateUD7x3 = uint32(
            bound(_retentionRateUD7x3, 10 * 10 ** 3 + 1, type(uint32).max)
        );

        // Expect revert
        vm.expectRevert(bytes("L41"));
        tested.setRetentionRate(_retentionRateUD7x3);
    }

    function testFuzz_setRetentionRate_3(uint32 _retentionRateUD7x3) public {
        console.log("Should change value of retentionRateUD7x3 else");

        // Ensure the retention rate is <10%
        _retentionRateUD7x3 = uint32(bound(_retentionRateUD7x3, 0, 10 * 10 ** 3));

        tested.setRetentionRate(_retentionRateUD7x3);
        assertEq(tested.retentionRateUD7x3(), _retentionRateUD7x3);
    }

    // ================================
    // === setLDYStaking() function ===
    function testFuzz_setLDYStaking_1(address account, address _contract) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.setLDYStaking(_contract);
    }

    function testFuzz_setLDYStaking_2(address _contract) public {
        console.log("Should change value of ldyStaking");
        tested.setLDYStaking(_contract);
        assertEq(address(tested.ldyStaking()), _contract);
    }

    // ==============================
    // === setWithdrawer() function ===
    function testFuzz_setWithdrawer_1(address account, address payable _withdrawer) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.setWithdrawer(_withdrawer);
    }

    function testFuzz_setWithdrawer_2() public {
        console.log("Should revert if trying to set the zero address as withdrawer");

        // Expect revert
        vm.expectRevert(bytes("L63"));
        tested.setWithdrawer(payable(address(0)));
    }

    function testFuzz_setWithdrawer_3(address payable _withdrawer) public {
        console.log("Should change value of withdrawer");

        // Ensure new address is not the zero address
        vm.assume(_withdrawer != address(0));

        // Set new withdrawer
        tested.setWithdrawer(_withdrawer);

        // Assert that the withdrawer address has been changed
        assertEq(address(tested.withdrawer()), _withdrawer);
    }

    // ==========================
    // === setFund() function ===
    function testFuzz_setFund_1(address account, address payable _fund) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.setFund(_fund);
    }

    function testFuzz_setFund_2() public {
        console.log("Should revert if trying to set the zero address as fund");

        // Expect revert
        vm.expectRevert(bytes("L64"));
        tested.setFund(payable(address(0)));
    }

    function testFuzz_setFund_3(address payable _fund) public {
        console.log("Should else change value of fund");

        // Ensure new address is not the zero address
        vm.assume(_fund != address(0));

        // Set new fund
        tested.setFund(_fund);

        // Assert that the fund address has been changed
        assertEq(address(tested.fund()), _fund);
    }

    // ====================================
    // === listenToTransfers() function ===
    function testFuzz_listenToTransfers_1(address account, address listenerContract) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.listenToTransfers(listenerContract);
    }

    function testFuzz_listenToTransfers_2(
        address listenersContract1,
        address listenerContract2
    ) public {
        console.log(
            "Should else push given contract address at the end of  the transfersListeners array"
        );

        // Listen to transfers from contract 1
        tested.listenToTransfers(listenersContract1);

        // Assert that contract 1 is at the end of the array
        assertEq(address(tested.transfersListeners(0)), listenersContract1);

        // Listen to transfers from contract 2
        tested.listenToTransfers(listenerContract2);

        // Assert that contract 2 is now at the end of the array
        assertEq(address(tested.transfersListeners(1)), listenerContract2);
    }

    // ====================================
    // === unlistenToTransfers() function ===
    function testFuzz_unlistenToTransfers_1(address account, address listenerContract) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.unlistenToTransfers(listenerContract);
    }

    function testFuzz_unlistenToTransfers_2(address listenerContract) public {
        console.log("Should revert if listener contract wasn't listening to transfers");

        // Expect revert
        vm.expectRevert(bytes("L42"));
        tested.unlistenToTransfers(listenerContract);
    }

    function testFuzz_unlistenToTransfers_3(address listenerContract) public {
        console.log("Should revert if listener contract was already unlistening to transfers");

        // Listen to transfers
        tested.listenToTransfers(listenerContract);

        // Unlisten to transfers
        tested.unlistenToTransfers(listenerContract);

        // Expect revert
        vm.expectRevert(bytes("L42"));
        tested.unlistenToTransfers(listenerContract);
    }

    function testFuzz_unlistenToTransfers_3(
        address listenerContract1,
        address listenerContract2,
        address listenerContract3
    ) public {
        console.log(
            "Should properly remove listener contract from array else and without leaving any empty slot"
        );

        // Ensure that 3 listeners addresses are different
        vm.assume(listenerContract1 != listenerContract2);
        vm.assume(listenerContract1 != listenerContract3);
        vm.assume(listenerContract2 != listenerContract3);

        // Listen to transfers from 3 contracts
        tested.listenToTransfers(listenerContract1);
        tested.listenToTransfers(listenerContract2);
        tested.listenToTransfers(listenerContract3);

        // Assert that the 3 contracts are listening to transfers
        assertEq(address(tested.transfersListeners(0)), listenerContract1);
        assertEq(address(tested.transfersListeners(1)), listenerContract2);
        assertEq(address(tested.transfersListeners(2)), listenerContract3);

        // Unlisten to transfers from contract2
        tested.unlistenToTransfers(listenerContract2);

        // Ensure that contract2 have been removed without leaving slot 1 empty
        assertEq(address(tested.transfersListeners(0)), listenerContract1);
        assertEq(address(tested.transfersListeners(1)), listenerContract3);

        // Also ensure that slot 2 doesn't exist anymore
        vm.expectRevert();
        tested.transfersListeners(2);
    }

    // ===========================
    // === decimals() function ===
    function testFuzz_setFund_1(uint8 decimals) public {
        console.log("Should mirror wrapped/underlying token decimals");

        // Set underlying token decimals
        underlyingToken.setDecimals(decimals);

        // Assert that L-Token contract mirrors those
        assertEq(tested.decimals(), decimals);
    }

    // ====================================
    // === unmintedRewardsOf() function ===
    // No tests needed as it simply proxies _rewardsOf()
    // Low priority TODO: Add mirror tests for future safety

    // ================================
    // === realBalanceOf() function ===
    // No tests needed as it simply proxies super.balanceOf()
    // Low priority TODO: Add mirror tests for future safety

    // ============================
    // === balanceOf() function ===
    function testFuzz_balanceOf_1(uint8 decimals, uint256 amount) public {
        console.log("Should mirror changes in realBalanceOf");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Cap amount to 100T
        amount = bound(amount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Assert the balance is currently 0
        assertEq(tested.balanceOf(address(1234)), 0);

        // Mint some L-Tokens to account
        deal(address(tested), address(1234), amount, true);

        // Assert the balance is now equal to the minted amount
        assertEq(tested.balanceOf(address(1234)), amount);
    }

    function testFuzz_balanceOf_2(
        uint8 decimals,
        uint16 aprUD7x3,
        uint256 depositedAmount,
        uint256 duration
    ) public {
        console.log("Should mirror changes in unmintedRewardsOf");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Cap amount to 100T
        depositedAmount = bound(depositedAmount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Cap duration to 1000 years
        duration = bound(duration, 0, 1000 * 365 days);

        // Set APR
        tested.setAPR(aprUD7x3);

        // Mint some underlying tokens to account and deposit them
        deal(address(underlyingToken), address(1234), depositedAmount, true);
        vm.startPrank(address(1234));
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);

        // Assert the balance is currently equal to the minted amount
        assertEq(tested.balanceOf(address(1234)), depositedAmount);

        // Move forward duration in time
        skip(duration);

        // Assert the balance is now equal to the minted amount + unclaimed rewards
        assertEq(
            tested.balanceOf(address(1234)),
            depositedAmount + tested.unmintedRewardsOf(address(1234))
        );
    }

    // ==================================
    // === realTotalSupply() function ===
    // No tests needed as it simply proxies super.totalSupply()
    // Low priority TODO: Add mirror tests for future safety

    // ==============================
    // === totalSupply() function ===
    function testFuzz_totalSupply_1(uint256 unclaimedFees) public {
        console.log("Should mirror changes in unclaimed fees");

        // Assert total supply is currently 0
        assertEq(tested.totalSupply(), 0);

        // Manually set unclaimed fees
        tested.tool_rawSetUnclaimedFees(unclaimedFees);

        // Assert unclaimed fees are taken into account in total supply
        assertEq(tested.totalSupply(), unclaimedFees);
    }

    function testFuzz_totalSupply_2(uint256 totalQueued) public {
        console.log("Should mirror changes in total queued");

        // Assert total supply is currently 0
        assertEq(tested.totalSupply(), 0);

        // Manually set unclaimed fees
        tested.tool_rawSetTotalQueued(totalQueued);

        // Assert unclaimed fees are taken into account in total supply
        assertEq(tested.totalSupply(), totalQueued);
    }

    function testFuzz_totalSupply_3(
        uint8 decimals,
        uint16 aprUD7x3,
        uint256 depositedAmount,
        uint256 withdrawnAmount
    ) public {
        console.log("Should mirror changes in real total supply");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Set withdrawal fees to 0 so it doesn't interfer in calculations
        tested.setFeesRate(0);

        // Cap deposited amount to 100T
        depositedAmount = bound(depositedAmount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Ensure the withdrawn amount is never higher than the deposited amount
        vm.assume(withdrawnAmount <= depositedAmount);

        // Force retention rate to 100% so it doesn't interfer in calculations
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Assert total supply is currently 0
        assertEq(tested.totalSupply(), 0);

        // Deposit some underlying token (and so mint some L-Tokens)
        deal(address(underlyingToken), address(1234), depositedAmount, true);
        vm.startPrank(address(1234));
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);

        // Assert minted tokens are taken into account in total supply
        assertEq(tested.totalSupply(), depositedAmount);

        // Withdraw some underlying token (and so burn some L-Tokens)
        tested.instantWithdrawal(withdrawnAmount);

        // Assert burned tokens are taken into account in total supply
        assertEq(tested.totalSupply(), depositedAmount - withdrawnAmount);
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
        console.log("Should revert if trying to recover underlying token");
        vm.expectRevert(bytes("L43"));
        tested.recoverERC20(address(underlyingToken), 0);
    }

    function testFuzz_recoverERC20_3(uint8 decimals, uint16 aprUD7x3, uint256 amount) public {
        console.log("Should allow to recover L-Tokens");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set a first APR
        tested.setAPR(aprUD7x3);

        // Cap deposited amount to 100T
        amount = bound(amount, 1, 100_000_000_000_000 * 10 ** decimals);

        // Accidentally send some L-Tokens to L-Token contract itself
        deal(address(underlyingToken), address(1234), amount, true);
        vm.startPrank(address(1234));
        underlyingToken.approve(address(tested), amount);
        tested.deposit(amount);
        tested.transfer(address(tested), amount);
        vm.stopPrank();

        // Assert that the contract balance is now equal to the minted amount
        assertEq(tested.balanceOf(address(tested)), amount);

        // Assert that owner balance is currently 0
        assertEq(tested.balanceOf(address(this)), 0);

        // Recover L-Tokens
        tested.recoverERC20(address(tested), amount);

        // Assert that the contract balance is now 0
        assertEq(tested.balanceOf(address(tested)), 0);

        // Assert that owner balance is currently equal to the minted amount
        assertEq(tested.balanceOf(address(this)), amount);
    }

    function test_recoverERC20_4() public {
        console.log("Shouldn't revert else");
        deal(address(anotherToken), address(tested), 1000);
        tested.recoverERC20(address(anotherToken), 500);
    }

    // ====================================
    // === recoverUnderlying() function ===
    function test_recoverUnderlying_1(address account) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.recoverUnderlying();
    }

    function test_recoverUnderlying_2() public {
        console.log("Should revert if there is nothing to recover");
        vm.expectRevert(bytes("L44"));
        tested.recoverUnderlying();
    }

    function testFuzz_recoverUnderlying_3(
        uint8 decimals,
        uint16 aprUD7x3,
        uint256 fundedAmount,
        uint256 depositedAmount
    ) public {
        console.log(
            "Shouldn't allow recovering underlying tokens deposited through deposit() or fund() functions"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set a first random APR
        tested.setAPR(aprUD7x3);

        // Force retention rate to 200% so it accepts deposited amount x 2 (as funded amount
        // is capped to deposited amount)
        tested.tool_setRetentionRate(uint32(200 * 10 ** 3));

        // Bound deposited amount to [2, 1T]
        depositedAmount = uint216(bound(depositedAmount, 2, 100_000_000_000_000 * 10 ** decimals));

        // Mint some underlying tokens to account and deposit them
        deal(address(underlyingToken), address(1234), depositedAmount, true);
        vm.startPrank(address(1234));
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        vm.stopPrank();

        // Ensure funded amount is lower than deposited amount so repatriate() doesn't revert because of retention rate exceeded
        fundedAmount = uint216(bound(fundedAmount, 1, depositedAmount));

        // Fuel random amount of $LDY to contract
        deal(address(underlyingToken), address(fundWallet), fundedAmount, true);
        vm.startPrank(address(fundWallet));
        underlyingToken.approve(address(tested), fundedAmount);
        tested.repatriate(fundedAmount);
        vm.stopPrank();

        // Expect the function to consider there is nothing to recover
        vm.expectRevert(bytes("L44"));
        tested.recoverUnderlying();
    }

    function testFuzz_recoverUnderlying_4(uint8 decimals, uint256 recoverableAmount) public {
        console.log("Should transfer recoverable tokens to owner else");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure recovered and recoverable is greater than 0
        vm.assume(recoverableAmount > 0);

        // Mint a random number of underlying to L-Token contract
        deal(address(underlyingToken), address(tested), recoverableAmount, true);

        // Assert that owner balance is currently 0
        assertEq(underlyingToken.balanceOf(address(this)), 0);

        // Recover random amount of tokens
        tested.recoverUnderlying();

        // Check that recovered amount is now in owner balance
        assertEq(underlyingToken.balanceOf(address(this)), recoverableAmount);
    }

    // =====================================
    // === _distributeRewards() function ===
    function test__distributeRewards_1(uint16 aprUD7x3, address account, uint256 amount) public {
        console.log("Should return true meaning it is implemented");

        // Set a first random APR
        tested.setAPR(aprUD7x3);

        // Ensure account is not the zero address
        vm.assume(account != address(0));

        assertEq(tested.public_distributeRewards(account, amount), true);
    }

    function test__distributeRewards_2(uint16 aprUD7x3, uint256 amount) public {
        console.log("Should revert if given account is zero address");

        // Set a first random APR
        tested.setAPR(aprUD7x3);

        // Expect revert
        vm.expectRevert(bytes("ERC20: mint to the zero address"));
        tested.public_distributeRewards(address(0), amount);
    }

    function test__distributeRewards_3(uint16 aprUD7x3, address account, uint256 amount) public {
        console.log("Should mint given amount to given account");

        // Set a first random APR
        tested.setAPR(aprUD7x3);

        // Cap amount to 100T
        amount = bound(amount, 0, 100_000_000_000_000 * 10 ** underlyingToken.decimals());

        // Ensure account is not the zero address
        vm.assume(account != address(0));

        // Assert that account balance is currently 0
        assertEq(tested.balanceOf(account), 0);

        // Claim rewards of account
        tested.public_distributeRewards(account, amount);

        // Assert that account balance is now equal to the claimed amount
        assertEq(tested.balanceOf(account), amount);
    }

    // =======================================
    // === _beforeTokenTransfer() function ===
    function testFuzz_beforeTokenTransfer_1(address from, address to, uint256 amount) public {
        console.log("Should prevent transfer when contract is paused");
        globalPause.pause();
        expectRevertPaused();
        tested.public_beforeTokenTransfer(from, to, amount);
    }

    function testFuzz_beforeTokenTransfer_2(
        uint16 aprUD7x3,
        address from,
        address to,
        uint256 amount,
        bool fromBlacklisted,
        bool toBlacklisted
    ) public {
        console.log("Should prevent transfer when one or both addresses are blacklisted");

        // Set a first random APR
        tested.setAPR(aprUD7x3);

        // Randomly blacklist from address
        if (fromBlacklisted) globalBlacklist.blacklist(from);

        // Randomly blacklist to address
        if (toBlacklisted) globalBlacklist.blacklist(to);

        // Expect revert if one or both addresses are blacklisted
        if (fromBlacklisted || toBlacklisted) expectRevertRestricted();
        tested.public_beforeTokenTransfer(from, to, amount);
    }

    function testFuzz__beforeTokenTransfer_3(
        uint8 decimals,
        uint16 aprUD7x3,
        address from,
        address to,
        uint256 amount,
        uint256 duration
    ) public {
        console.log(
            "Should reset from and to accounts investment periods if they are not zero address"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set a first random APR
        tested.setAPR(aprUD7x3);

        // Cap amount to 100T
        amount = bound(amount, 0, 100_000_000_000_000 * 10 ** decimals);

        // Cap duration to 1000 years
        duration = bound(duration, 0, 1000 * 365 days);

        // Move forward a random duration
        skip(duration);

        // Call before token transfer tokens
        tested.public_beforeTokenTransfer(from, to, amount);

        // Ensure that the investment periods timestamp have been updated to now
        if (from != address(0)) {
            assertEq(tested.public_accountsInfos(from).period.timestamp, block.timestamp);
        }
        if (to != address(0)) {
            assertEq(tested.public_accountsInfos(to).period.timestamp, block.timestamp);
        }
    }

    // ======================================
    // === _afterTokenTransfer() function ===
    function testFuzz_afterTokenTransfer_1(
        uint16 aprUD7x3,
        address account1,
        address account2,
        uint256 amount
    ) public {
        console.log("Should properly call onLTokenTransfer() of all transfers listeners");

        // Set a first random APR
        tested.setAPR(aprUD7x3);

        // Assert that accounts are different, aren't zero address nor the contract address
        vm.assume(account1 != account2);
        vm.assume(account1 != address(0));
        vm.assume(account2 != address(0));
        vm.assume(account1 != address(tested));
        vm.assume(account2 != address(tested));

        // Listen to transfers from vault1 and vault2
        tested.listenToTransfers(address(vault1));
        tested.listenToTransfers(address(vault2));

        // Cap amount to [2, 100T]
        amount = bound(amount, 2, 100_000_000_000_000 * 10 ** underlyingToken.decimals());

        // Give some L-Tokens to account1
        deal(address(underlyingToken), account1, amount, true);
        vm.startPrank(account1);
        underlyingToken.approve(address(tested), amount);
        tested.deposit(amount);
        vm.stopPrank();
        assertEq(tested.balanceOf(account1), amount);

        // Perform 3 transactions
        vm.prank(account1);
        tested.transfer(account2, amount);
        vm.prank(account2);
        tested.transfer(account1, 1);
        vm.prank(account2);
        tested.transfer(account1, amount - 1);

        // Assert that transactions have been successfully recorded in vault 1
        address dataFrom;
        address dataTo;
        uint256 dataAmount;
        (dataFrom, dataTo, dataAmount) = vault1.hookData(0);
        assertEq(dataFrom, address(0));
        assertEq(dataTo, account1);
        assertEq(dataAmount, amount);
        (dataFrom, dataTo, dataAmount) = vault1.hookData(1);
        assertEq(dataFrom, account1);
        assertEq(dataTo, account2);
        assertEq(dataAmount, amount);
        (dataFrom, dataTo, dataAmount) = vault1.hookData(2);
        assertEq(dataFrom, account2);
        assertEq(dataTo, account1);
        assertEq(dataAmount, 1);
        (dataFrom, dataTo, dataAmount) = vault1.hookData(3);
        assertEq(dataFrom, account2);
        assertEq(dataTo, account1);
        assertEq(dataAmount, amount - 1);

        // Assert that transactions have been successfully recorded in vault 2
        (dataFrom, dataTo, dataAmount) = vault2.hookData(0);
        assertEq(dataFrom, address(0));
        assertEq(dataTo, account1);
        assertEq(dataAmount, amount);
        (dataFrom, dataTo, dataAmount) = vault2.hookData(1);
        assertEq(dataFrom, account1);
        assertEq(dataTo, account2);
        assertEq(dataAmount, amount);
        (dataFrom, dataTo, dataAmount) = vault2.hookData(2);
        assertEq(dataFrom, account2);
        assertEq(dataTo, account1);
        assertEq(dataAmount, 1);
        (dataFrom, dataTo, dataAmount) = vault2.hookData(3);
        assertEq(dataFrom, account2);
        assertEq(dataTo, account1);
        assertEq(dataAmount, amount - 1);
    }

    // ======================================
    // === getExpectedRetained() function ===
    function testFuzz_getExpectedRetained_1(
        uint8 decimals,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint256 totalSupply
    ) public {
        console.log("Should properly apply retention rate");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 2, 18));
        underlyingToken.setDecimals(decimals);

        // Set a first random APR
        tested.setAPR(aprUD7x3);

        // Ensure the retention rate is >0 and <=10%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 0, 10 * 10 ** 3));

        // Set retention rate
        tested.setRetentionRate(retentionRateUD7x3);

        // Cap totalSupply to 1000T
        // Make it >1 to prevent assertion revert because of precision loss on small numbers
        // +10000 is used to prevent assertion revert with small decimals values
        totalSupply = bound(
            totalSupply,
            1 * 10 ** decimals + 10000,
            100_000_000_000_000 * 10 ** decimals
        );

        // Apply total supply by depositing same amount of underlying tokens
        deal(address(underlyingToken), address(1234), totalSupply, true);
        vm.startPrank(address(1234));
        underlyingToken.approve(address(tested), totalSupply);
        tested.deposit(totalSupply);
        vm.stopPrank();

        // Ensure that total supply is successfully applied
        assertEq(tested.totalSupply(), totalSupply);

        // Get expected retained
        uint256 expectedRetained = tested.getExpectedRetained();

        // Obtain retention rate from total supply and expected retained
        uint256 totalSupplySUD = SUD.fromAmount(totalSupply, decimals);
        uint256 expectedRetainedSUD = SUD.fromAmount(expectedRetained, decimals);
        uint256 retentionRateSUD = (expectedRetainedSUD * SUD.fromInt(100, decimals)) /
            totalSupplySUD;
        uint256 expectedRetentionRateUD7x3 = SUD.toRate(retentionRateSUD, decimals);

        // Compute difference between expected retention rate and actual retention rate
        uint256 difference = expectedRetentionRateUD7x3 > retentionRateUD7x3
            ? expectedRetentionRateUD7x3 - retentionRateUD7x3
            : retentionRateUD7x3 - expectedRetentionRateUD7x3;

        // Assert that the difference is lower than 0.01%
        assertTrue(difference <= 10);
    }

    function testFuzz_getExpectedRetained_2(
        uint8 decimals,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint256 totalSupply
    ) public {
        console.log("Should properly apply total supply");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set a first random APR
        tested.setAPR(aprUD7x3);

        // Ensure the retention rate is >0 and <=10%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 1, 10 * 10 ** 3));

        // Set retention rate
        tested.setRetentionRate(retentionRateUD7x3);

        // Cap totalSupply to 100T
        // Make it >1 to prevent assertion revert because of precision loss on small numbers
        totalSupply = bound(totalSupply, 1 * 10 ** decimals, 100_000_000_000_000 * 10 ** decimals);

        // Apply total supply by depositing same amount of underlying tokens
        deal(address(underlyingToken), address(1234), totalSupply, true);
        vm.startPrank(address(1234));
        underlyingToken.approve(address(tested), totalSupply);
        tested.deposit(totalSupply);
        vm.stopPrank();

        // Ensure that total supply is successfully applied
        assertEq(tested.totalSupply(), totalSupply);

        // Get expected retained
        uint256 expectedRetained = tested.getExpectedRetained();

        // Obtain expected total supply from retention rate and expected retained
        uint256 retentionRateSUD = SUD.fromRate(retentionRateUD7x3, decimals);
        uint256 expectedRetainedSUD = SUD.fromAmount(expectedRetained, decimals);
        uint256 totalSupplySUD = (expectedRetainedSUD * SUD.fromInt(100, decimals)) /
            retentionRateSUD;
        uint256 expectedTotalSupply = SUD.toAmount(totalSupplySUD, decimals);

        // Compute difference between expected retention rate and actual retention rate
        uint256 difference = expectedTotalSupply > totalSupply
            ? expectedTotalSupply - totalSupply
            : totalSupply - expectedTotalSupply;

        // Assert that the difference is lower than 1 unit
        // +100000 is used to prevent assertion revert with small decimals values
        assertTrue(difference <= 1 * 10 ** decimals + 100000);
    }

    // ===========================================
    // === _transferExceedingToFund() function ===
    function testFuzz_transferExceedingToFund_1(
        uint8 decimals,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint256 depositedAmount
    ) public {
        console.log("Shouldn't transfer anything if there is no exceeding fund");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set a first random APR
        tested.setAPR(aprUD7x3);

        // Ensure the retention rate is >0 and <=10%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 1, 10 * 10 ** 3));

        // Set retention rate
        tested.setRetentionRate(retentionRateUD7x3);

        // Cap totalSupply to 1000T and make it >1 to prevent assertion revert because of precision loss on small numbers
        depositedAmount = bound(
            depositedAmount,
            1 * 10 ** decimals,
            100_000_000_000_000 * 10 ** decimals
        );

        // Deposit underlying token amount
        deal(address(underlyingToken), address(1234), depositedAmount, true);
        vm.startPrank(address(1234));
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        vm.stopPrank();

        // Store current fund and L-Token contract balances for later comparison
        uint256 oldFundBalance = underlyingToken.balanceOf(address(fundWallet));
        uint256 oldLTokenBalance = underlyingToken.balanceOf(address(tested));

        // Call transferExceedingToFund()
        tested.public_transferExceedingToFund();

        // Expect L-Token contract and fund wallet balances to don't change as the previous call to deposit() already transfered exceeding underlying tokens to fund wallet
        assertEq(underlyingToken.balanceOf(address(fundWallet)), oldFundBalance);
        assertEq(underlyingToken.balanceOf(address(tested)), oldLTokenBalance);
    }

    function testFuzz_transferExceedingToFund_2(
        uint8 decimals,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint256 depositedAmount
    ) public {
        console.log("Should properly transfer the exceeding amount");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set a first random APR
        tested.setAPR(aprUD7x3);

        // Ensure the retention rate is >0 and <=10%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 1, 10 * 10 ** 3));

        // Set retention rate
        tested.setRetentionRate(retentionRateUD7x3);

        // Ensure deposited amount is greater than 10k units
        // 12k is used instead of 10k to prevent assertion revert because of precision loss on small numbers
        depositedAmount = bound(
            depositedAmount,
            12_000 * 10 ** decimals,
            100_000_000_000_000 * 10 ** decimals
        );

        // Deposit underlying token amount
        // This will implicitly call _transferExceedingToFund()
        deal(address(underlyingToken), address(1234), depositedAmount, true);
        vm.startPrank(address(1234));
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        vm.stopPrank();

        // Expect balance of underlying from being equal to expect retained
        assertEq(underlyingToken.balanceOf(address(tested)), tested.getExpectedRetained());
    }

    function testFuzz_transferExceedingToFund_3(
        uint8 decimals,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint256 depositedAmount
    ) public {
        console.log(
            "Should decrease usableUnderlyings state by the amount of transfered exceeding funds"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set a first random APR
        tested.setAPR(aprUD7x3);

        // Ensure the retention rate is >0 and <=10%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 1, 10 * 10 ** 3));

        // Set retention rate
        tested.setRetentionRate(retentionRateUD7x3);

        // Ensure deposited amount is greater than 10k units
        // 12k is used instead of 10k to prevent assertion revert because of precision loss on small numbers
        depositedAmount = bound(
            depositedAmount,
            12_000 * 10 ** decimals,
            100_000_000_000_000 * 10 ** decimals
        );

        // Deposit underlying token amount
        // This will implicitly call _transferExceedingToFund()
        deal(address(underlyingToken), address(1234), depositedAmount, true);
        vm.startPrank(address(1234));
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        vm.stopPrank();

        // Expect balance of underlying from being equal to expect retained
        assertEq(tested.usableUnderlyings(), tested.getExpectedRetained());
    }

    // =============================
    // === withdrawTo() function ===
    function testFuzz_withdrawTo_1(address account, uint256 amount) public {
        console.log("Should inconditionally revert");
        vm.expectRevert(bytes("L45"));
        tested.withdrawTo(account, amount);
    }

    // =============================
    // === depositFor() function ===
    function testFuzz_depositFor_1(address account, uint256 amount) public {
        console.log("Should inconditionally revert");
        vm.expectRevert(bytes("L46"));
        tested.depositFor(account, amount);
    }

    // ==========================
    // === deposit() function ===
    function testFuzz_deposit_1(address account, uint256 amount) public {
        console.log("Should revert if contract is paused");
        globalPause.pause();
        expectRevertPaused();
        vm.prank(account);
        tested.deposit(amount);
    }

    function testFuzz_deposit_2(address account, uint256 amount) public {
        console.log("Should revert if account is blacklisted");
        // Ensure account is not the zero address
        vm.assume(account != address(0));

        // Blacklist account
        globalBlacklist.blacklist(account);

        // Expect revert
        expectRevertRestricted();
        vm.prank(account);
        tested.deposit(amount);
    }

    function testFuzz_deposit_3(
        uint8 decimals,
        uint16 aprUD7x3,
        address account,
        uint256 accountBalance,
        uint256 depositedAmount
    ) public {
        console.log("Should revert if account hasn't enough underlying tokens");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap depositedAmount to 100T
        depositedAmount = bound(depositedAmount, 2, 100_000_000_000_000 * 10 ** decimals);

        // Ensure account balance is lower than deposited amount
        accountBalance = bound(accountBalance, 1, depositedAmount - 1);

        // Mint underlying tokens to account
        deal(address(underlyingToken), account, accountBalance, true);
        vm.startPrank(account);

        // Expect revert when trying to deposit more than account balance
        underlyingToken.approve(address(tested), depositedAmount);
        vm.expectRevert(bytes("L47"));
        tested.deposit(depositedAmount);
        vm.stopPrank();
    }

    function testFuzz_deposit_4(
        uint8 decimals,
        uint16 aprUD7x3,
        address account,
        uint256 depositedAmount
    ) public {
        console.log(
            "Should decrease caller underlying balance and increase contract one by the amount of deposited underlying tokens"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force retention rate to 100% so it doesn't interfer in calculations
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Cap depositedAmount to 100T
        depositedAmount = bound(depositedAmount, 1, 100_000_000_000_000 * 10 ** decimals);

        // Mint underlying tokens to account
        deal(address(underlyingToken), account, depositedAmount, true);

        // Store old underlying token balances for later comparison
        uint256 oldAccountBalance = underlyingToken.balanceOf(account);
        uint256 oldContractBalance = underlyingToken.balanceOf(address(tested));

        // Deposit underlying tokens
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        vm.stopPrank();

        // Assert that the account balance has decreased by the deposited amount
        assertEq(underlyingToken.balanceOf(account), oldAccountBalance - depositedAmount);

        // Assert that the contract balance has increased by the deposited amount
        assertEq(underlyingToken.balanceOf(address(tested)), oldContractBalance + depositedAmount);
    }

    function testFuzz_deposit_5(
        uint8 decimals,
        uint16 aprUD7x3,
        address account,
        uint256 depositedAmount
    ) public {
        console.log("Should mint new L-Tokens to the caller in a 1:1 ratio");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force retention rate to 100% so it doesn't interfer in calculations
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Cap depositedAmount to 100T
        depositedAmount = bound(depositedAmount, 1, 100_000_000_000_000 * 10 ** decimals);

        // Mint underlying tokens to account
        deal(address(underlyingToken), account, depositedAmount, true);

        // Store old account L-Token balance for later comparison
        uint256 oldAccountBalance = tested.balanceOf(account);

        // Deposit underlying tokens
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        vm.stopPrank();

        // Assert that the account balance has increased by the deposited amount
        assertEq(tested.balanceOf(account), oldAccountBalance + depositedAmount);
    }

    function testFuzz_deposit_6(
        uint8 decimals,
        uint16 aprUD7x3,
        address account,
        uint256 depositedAmount
    ) public {
        console.log(
            "Should increase usableUnderlying state by the amount of deposited underlying tokens"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force retention rate to 100% so it doesn't interfer in calculations
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Cap depositedAmount to 100T
        depositedAmount = bound(depositedAmount, 1, 100_000_000_000_000 * 10 ** decimals);

        // Mint underlying tokens to account
        deal(address(underlyingToken), account, depositedAmount, true);

        // Store old usableUnderlying state for later comparison
        uint256 oldUsableUnderlying = tested.usableUnderlyings();

        // Deposit underlying tokens
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        vm.stopPrank();

        // Assert that the usableUnderlying state has increased by the deposited amount
        assertEq(tested.usableUnderlyings(), oldUsableUnderlying + depositedAmount);
    }

    function testFuzz_deposit_7(
        uint8 decimals,
        uint16 aprUD7x3,
        address account,
        uint256 depositedAmount,
        uint32 retentionRateUD7x3
    ) public {
        console.log("Should transfer exceeding to fund");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Bound retention rate to [0, 10%]
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 0, 10 * 10 ** 3));

        // Set random retention rate
        tested.setRetentionRate(retentionRateUD7x3);

        // Ensure deposited amount is greater than 10k units
        // 12k is used instead of 10k to prevent assertion revert because of precision loss on small numbers
        depositedAmount = bound(
            depositedAmount,
            12_000 * 10 ** decimals,
            100_000_000_000_000 * 10 ** decimals
        );

        // Deposit underlying tokens
        deal(address(underlyingToken), account, depositedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        vm.stopPrank();

        // Assert that no matter the deposited amount, the usable underlyings are always lower or equal than expected retained
        assertTrue(tested.usableUnderlyings() <= tested.getExpectedRetained());
    }

    // ============================================
    // === getWithdrawnAmountAndFees() function ===
    function testFuzz_getWithdrawnAmountAndFees_1(
        uint8 decimals,
        uint16 aprUD7x3,
        address account,
        uint256 amount,
        uint32 feesRateUD7x3,
        uint216 tier2Amount
    ) public {
        console.log(
            "Should always return [inputAmount, 0] if account is elligble to staking tier 2"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is not the zero address nor the the underlying token contract
        vm.assume(account != address(0));
        vm.assume(account != address(underlyingToken));

        // Set first random APR on L-Token contract
        tested.setAPR(aprUD7x3);

        // Set first random APR on LDYStaking contract
        ldyStaking.setAPR(aprUD7x3);

        // Cap fees rate to 100%
        feesRateUD7x3 = uint32(bound(feesRateUD7x3, 0, 100 * 10 ** 3));

        // Set random fees rate
        tested.setFeesRate(feesRateUD7x3);

        // Cap tier2Amount to 100T
        tier2Amount = uint216(bound(tier2Amount, 1, 100_000_000_000_000 * 10 ** decimals));

        // Set random tier 2 amount
        ldyStaking.setTier(2, tier2Amount);

        // Deposit enough $LDY tokens to be eligible to tier 2
        deal(address(ldyToken), account, tier2Amount, true);
        vm.startPrank(account);
        ldyToken.approve(address(ldyStaking), tier2Amount);
        ldyStaking.stake(tier2Amount);
        vm.stopPrank();

        // Get withdraw amount and fees
        (uint256 withdrawnAmount, uint256 fees) = tested.getWithdrawnAmountAndFees(account, amount);

        // Expect withdrawn amount to be equal to input amount
        assertEq(withdrawnAmount, amount);

        // Expect fees to be 0
        assertEq(fees, 0);
    }

    function testFuzz_getWithdrawnAmountAndFees_2(
        uint8 decimals,
        uint16 aprUD7x3,
        address account,
        uint256 amount,
        uint32 feesRateUD7x3
    ) public {
        console.log("Should else return [inputAmount - fees, fees]");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is not the zero address nor the the underlying token contract
        vm.assume(account != address(0));
        vm.assume(account != address(underlyingToken));

        // Set first random APR on L-Token contract
        tested.setAPR(aprUD7x3);

        // Cap fees rate to 100%
        feesRateUD7x3 = uint32(bound(feesRateUD7x3, 0, 100 * 10 ** 3));

        // Set random fees rate
        tested.setFeesRate(feesRateUD7x3);

        // Cap amount to 100T
        amount = bound(amount, 1, 100_000_000_000_000 * 10 ** decimals);

        // Get withdraw amount and fees
        (uint256 withdrawnAmount, uint256 fees) = tested.getWithdrawnAmountAndFees(account, amount);

        // Assert that the withdrawn amount is equal to the input amount minus the fees
        assertEq(withdrawnAmount, amount - fees);
    }

    function testFuzz_getWithdrawnAmountAndFees_3(
        uint8 decimals,
        uint16 aprUD7x3,
        address account,
        uint256 amount,
        uint32 feesRateUD7x3
    ) public {
        console.log("Should properly apply feesRateUD7x3");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is not the zero address nor the the underlying token contract
        vm.assume(account != address(0));
        vm.assume(account != address(underlyingToken));

        // Set first random APR on L-Token contract
        tested.setAPR(aprUD7x3);

        // Cap fees rate to 100% and to a minimum of 0.1% to prevent below assertion revert because of precision loss
        feesRateUD7x3 = uint32(bound(feesRateUD7x3, 100, 100 * 10 ** 3));

        // Set random fees rate
        tested.setFeesRate(feesRateUD7x3);

        // Cap amount to 100T and to a minimum of one unit to prevent below assertion revert because of precision loss
        // +10000 is used to prevent assertion revert with small decimals values
        amount = bound(amount, 1 * 10 ** decimals + 10000, 100_000_000_000_000 * 10 ** decimals);

        // Get withdraw amount and fees
        (, uint256 fees) = tested.getWithdrawnAmountAndFees(account, amount);

        // Obtain applied feesRateUD7x3 from input amount and fees amount
        uint256 feesRateSUD = (SUD.fromAmount(fees, decimals) * SUD.fromInt(100, decimals)) /
            SUD.fromAmount(amount, decimals);
        uint256 appliedFeesRateUD7x3 = SUD.toRate(feesRateSUD, decimals);

        // Compute difference between applied fees rate and expected fees rate
        uint256 difference = appliedFeesRateUD7x3 > feesRateUD7x3
            ? appliedFeesRateUD7x3 - feesRateUD7x3
            : feesRateUD7x3 - appliedFeesRateUD7x3;

        // Assert that the difference is < 0.01%
        assertTrue(difference <= 10);
    }

    // ==================================
    // === instantWithdrawal() function ===
    function testFuzz_instantWithdrawal_1(address account, uint256 amount) public {
        console.log("Should revert if contract is paused");
        globalPause.pause();
        expectRevertPaused();
        vm.prank(account);
        tested.instantWithdrawal(amount);
    }

    function testFuzz_instantWithdrawal_2(address account, uint256 amount) public {
        console.log("Should revert if account is blacklisted");
        // Ensure account is not the zero address
        vm.assume(account != address(0));

        // Blacklist account
        globalBlacklist.blacklist(account);

        // Expect revert
        expectRevertRestricted();
        vm.prank(account);
        tested.instantWithdrawal(amount);
    }

    function testFuzz_instantWithdrawal_3(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 requestedAmount,
        uint256 depositedAmount
    ) public {
        console.log("Should revert if account hasn't enough underlying tokens to withdraw");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap requestedAmount to 100T
        requestedAmount = bound(requestedAmount, 2, 100_000_000_000_000 * 10 ** decimals);

        // Ensure depositedAmounte is lower than requestedAmount
        depositedAmount = bound(depositedAmount, 1, requestedAmount - 1);

        // Deposit underlying token amount
        deal(address(underlyingToken), account, depositedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);

        // Expect revert when trying to withdraw more than deposited amount
        vm.expectRevert(bytes("L48"));
        tested.instantWithdrawal(requestedAmount);
        vm.stopPrank();
    }

    function testFuzz_instantWithdrawal_4(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 depositedAmount,
        uint256 queuedAmount
    ) public {
        console.log(
            "Should revert if account is not elligible to staking tier 2 and contract doesn't hold enough underlying tokens to cover the withdrawal + all already queued withdrawals"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force retention rate to 100% so it doesn't interfer in calculations
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Ensure total queued is greater than 0 and capped to 100T
        queuedAmount = bound(queuedAmount, 1, 100_000_000_000_000 * 10 ** decimals);

        // Force set total queued amount
        tested.tool_rawSetTotalQueued(queuedAmount);

        // Cap depositedAmount to 100T
        depositedAmount = bound(depositedAmount, 1, 100_000_000_000_000 * 10 ** decimals);

        // Deposit underlying token amount
        deal(address(underlyingToken), account, depositedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);

        // Expect revert when because of insufficient funds available
        vm.expectRevert(bytes("L49"));
        tested.instantWithdrawal(depositedAmount);
        vm.stopPrank();
    }

    function testFuzz_instantWithdrawal_5(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 queuedAmount,
        uint216 tier2Amount
    ) public {
        console.log(
            "Should revert if account is to staking tier 2 and contract doesn't hold enough underlying tokens to cover the current withdrawal"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Set first random APR on LDYStaking contract
        ldyStaking.setAPR(aprUD7x3);

        // Force retention rate to 100% so it doesn't interfer in calculations
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Ensure total queued is greater than 0 and capped to 100T
        queuedAmount = bound(queuedAmount, 1, 100_000_000_000_000 * 10 ** decimals);

        // Force set total queued amount
        tested.tool_rawSetTotalQueued(queuedAmount);

        // Cap tier2Amount to 100T
        tier2Amount = uint216(bound(tier2Amount, 1, 100_000_000_000_000 * 10 ** decimals));

        // Set random tier 2 amount
        ldyStaking.setTier(2, tier2Amount);

        // Deposit enough $LDY tokens to be eligible to tier 2
        deal(address(ldyToken), account, tier2Amount, true);
        vm.startPrank(account);
        ldyToken.approve(address(ldyStaking), tier2Amount);
        ldyStaking.stake(tier2Amount);

        // Assert tier of user is equal to 2
        assertEq(ldyStaking.tierOf(account), 2);

        // Deposit underlying token amount
        deal(address(underlyingToken), account, tier2Amount, true);
        underlyingToken.approve(address(tested), tier2Amount);
        tested.deposit(tier2Amount);
        vm.stopPrank();

        // Burn some contract reserves so it will not be able to cover the withdrawal
        vm.prank(address(tested));
        underlyingToken.transfer(address(1234), 1);
        tested.tool_rawSetUsableUnderlyings(tested.usableUnderlyings() - 1);

        // Expect revert when because of insufficient funds available
        vm.expectRevert(bytes("L49"));
        vm.prank(account);
        tested.instantWithdrawal(tier2Amount);
    }

    function testFuzz_instantWithdrawal_6(
        uint8 decimals,
        address account1,
        address account2,
        uint16 aprUD7x3,
        uint256 depositedAmount,
        uint256 queuedAmount
    ) public {
        console.log(
            "Should process to withdrawal if account is not elligible to staking tier 2 but contract holds enough underlying tokens to cover the withdrawal + all already queued withdrawals"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account are neither the zero address nor the L-Token contract
        vm.assume(account1 != address(0));
        vm.assume(account1 != address(tested));
        vm.assume(account2 != address(0));
        vm.assume(account2 != address(tested));
        vm.assume(account1 != account2);

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force retention rate to 100% so it doesn't interfer in calculations
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Ensure total queued is ceiled to uint96 max (the max amount that can be requested at once)
        queuedAmount = bound(queuedAmount, 1, type(uint96).max);

        // Deposit queued amount and queue it
        deal(address(underlyingToken), account1, queuedAmount, true);
        uint256 processingFees = 0.004 ether;
        deal(account1, processingFees);
        vm.startPrank(account1);
        underlyingToken.approve(address(tested), queuedAmount);
        tested.deposit(queuedAmount);
        tested.requestWithdrawal{value: processingFees}(queuedAmount);
        vm.stopPrank();

        // Assert that total queued is equal to queud amount
        assertEq(tested.totalQueued(), queuedAmount);

        // Cap depositedAmount to 100T
        depositedAmount = bound(depositedAmount, 1, 100_000_000_000_000 * 10 ** decimals);

        // Deposit underlying token amount with another account
        deal(address(underlyingToken), account2, depositedAmount, true);
        vm.startPrank(account2);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);

        // Assert that account2 L-Token balance is equal to deposited amount
        assertEq(tested.balanceOf(account2), depositedAmount);

        // Assert that account2 underlying token balance is equal to 0
        assertEq(underlyingToken.balanceOf(account2), 0);

        // Proceed to instant withdraw
        tested.instantWithdrawal(depositedAmount);
        vm.stopPrank();

        // Assert that account2 L-Token balance is equal to 0
        assertEq(tested.balanceOf(account2), 0);

        // Assert that account2 underlying token balance is equal to deposited amount minus fees
        (, uint256 fees) = tested.getWithdrawnAmountAndFees(account2, depositedAmount);
        assertEq(underlyingToken.balanceOf(account2), depositedAmount - fees);
    }

    function testFuzz_instantWithdrawal_7(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 queuedAmount,
        uint216 tier2Amount
    ) public {
        console.log(
            "Should process to withdraw if account is to staking tier 2 and contract holds enough underlying tokens to cover the current withdrawal"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Set first random APR on LDYStaking contract
        ldyStaking.setAPR(aprUD7x3);

        // Force retention rate to 100% so it doesn't interfer in calculations
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Ensure total queued is greater than 0 and capped to 100T
        queuedAmount = bound(queuedAmount, 1, 100_000_000_000_000 * 10 ** decimals);

        // Force set total queued amount
        tested.tool_rawSetTotalQueued(queuedAmount);

        // Cap tier2Amount to 100T
        tier2Amount = uint216(bound(tier2Amount, 1, 100_000_000_000_000 * 10 ** decimals));

        // Set random tier 2 amount
        ldyStaking.setTier(2, tier2Amount);

        // Deposit enough $LDY tokens to be eligible to tier 2
        deal(address(ldyToken), account, tier2Amount, true);
        vm.startPrank(account);
        ldyToken.approve(address(ldyStaking), tier2Amount);
        ldyStaking.stake(tier2Amount);

        // Assert tier of user is equal to 2
        assertEq(ldyStaking.tierOf(account), 2);

        // Deposit underlying token amount
        deal(address(underlyingToken), account, tier2Amount, true);
        underlyingToken.approve(address(tested), tier2Amount);
        tested.deposit(tier2Amount);

        // Assert that account2 L-Token balance is equal to deposited amount
        assertEq(tested.balanceOf(account), tier2Amount);

        // Assert that account2 underlying token balance is equal to 0
        assertEq(underlyingToken.balanceOf(account), 0);

        // Withdraw underlying tokens
        tested.instantWithdrawal(tier2Amount);
        vm.stopPrank();

        // Assert that account2 underlying token balance is equal to deposited
        assertEq(underlyingToken.balanceOf(account), tier2Amount);
    }

    function testFuzz_instantWithdrawal_8(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 depositedAmount
    ) public {
        console.log("Should properly apply feesRateUD7x3");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account are neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force retention rate to 100% so it doesn't interfer in calculations
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Cap depositedAmount to 100T
        depositedAmount = bound(depositedAmount, 1, 100_000_000_000_000 * 10 ** decimals);

        // Deposit underlying token amount with another account
        deal(address(underlyingToken), account, depositedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);

        // Proceed to instant withdraw
        tested.instantWithdrawal(depositedAmount);
        vm.stopPrank();

        // Assert the account underlying balance is equal to deposited amount minus fees
        (, uint256 fees) = tested.getWithdrawnAmountAndFees(account, depositedAmount);
        assertEq(underlyingToken.balanceOf(account), depositedAmount - fees);
    }

    function testFuzz_instantWithdrawal_9(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 depositedAmount
    ) public {
        console.log("Should decrease usableUnderlying by withdrawn amount (and not input amount)");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account are neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force retention rate to 100% so it doesn't interfer in calculations
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Cap depositedAmount to 100T
        depositedAmount = bound(depositedAmount, 1, 100_000_000_000_000 * 10 ** decimals);

        // Deposit underlying token amount with another account
        deal(address(underlyingToken), account, depositedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);

        // Store old usableUnderlying state for later comparison
        uint256 oldUsableUnderlying = tested.usableUnderlyings();

        // Proceed to instant withdraw
        tested.instantWithdrawal(depositedAmount);
        vm.stopPrank();

        // Assert that the usableUnderlying state has decreased by the withdrawn amount
        (uint256 withdrawnAmount, ) = tested.getWithdrawnAmountAndFees(account, depositedAmount);
        assertEq(tested.usableUnderlyings(), oldUsableUnderlying - withdrawnAmount);
    }

    function testFuzz_instantWithdrawal_10(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 depositedAmount
    ) public {
        console.log("Should also burn fees and so realTotalSupply should decrease by input amount");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account are neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force retention rate to 100% so it doesn't interfer in calculations
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Cap depositedAmount to 100T
        depositedAmount = bound(depositedAmount, 1, 100_000_000_000_000 * 10 ** decimals);

        // Deposit underlying token amount with another account
        deal(address(underlyingToken), account, depositedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);

        // Store old realTotalSupply state for later comparison
        uint256 oldRealTotalSupply = tested.realTotalSupply();

        // Proceed to instant withdraw
        tested.instantWithdrawal(depositedAmount);
        vm.stopPrank();

        // Assert that the realTotalSupply state has decreased by the input amount
        assertEq(tested.realTotalSupply(), oldRealTotalSupply - depositedAmount);
    }

    // ======================================
    // === batchQueuedWithdraw() function ===
    function testFuzz_batchQueuedWithdraw_1(address account) public {
        console.log("Should revert if not called by withdrawer wallet");

        // Ensure the random account is not the withdrawer wallet
        vm.assume(account != withdrawerWallet);

        // Expect revert
        vm.expectRevert(bytes("L39"));
        vm.prank(account);
        tested.batchQueuedWithdraw();
    }

    function test_batchQueuedWithdraw_2() public {
        console.log("Should revert if contract is paused");
        globalPause.pause();
        expectRevertPaused();
        vm.prank(withdrawerWallet);
        tested.batchQueuedWithdraw();
    }

    function testFuzz_batchQueuedWithdraw_3() public {
        console.log("Should don't change any state if queue is empty");

        // Store old states for later comparison
        uint256 oldUsableUnderlying = tested.usableUnderlyings();
        uint256 oldUnclaimedFees = tested.unclaimedFees();
        uint256 oldTotalQueued = tested.totalQueued();

        // Proceed to batch queued withdraw
        vm.prank(withdrawerWallet);
        tested.batchQueuedWithdraw();

        // Assert that states haven't changed
        assertEq(tested.usableUnderlyings(), oldUsableUnderlying);
        assertEq(tested.unclaimedFees(), oldUnclaimedFees);
        assertEq(tested.totalQueued(), oldTotalQueued);
    }

    function testFuzz_batchQueuedWithdraw_4(
        uint8 decimals,
        uint16 aprUD7x3,
        uint8 numberOfRequests,
        uint256 requestAmount,
        uint160 accountBase,
        uint8 randomEmptySeed
    ) public {
        console.log("Should silently skip empty requests (processed big requests)");
        // Set random underlying token decimals in [0, 18]

        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force set retention rate to 100% so funds are kept on the contract and it doesn't have to be funded
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Cap requestAmount to uint96.max which is the maximum amount of underlying tokens that can be requested at once
        requestAmount = bound(requestAmount, 1, type(uint96).max);

        // Cap amount of requests to 30
        numberOfRequests = uint8(bound(numberOfRequests, 5, 30));

        // Prevent account base from overflowing
        accountBase = uint160(bound(accountBase, 1, type(uint160).max - numberOfRequests));

        // Get the interval of empty requests
        uint256 emptyInterval = bound(randomEmptySeed, 1, 5);

        // Create random number of requests, and blacklist some of them
        uint256 numberOfNonEmptyRequests;
        for (uint8 id = 0; id < numberOfRequests; id++) {
            // Obtain account address
            address account = address(accountBase + id);

            // Ensure account is not the L-Token contract
            vm.assume(account != address(tested));

            // Mint processing fees to account
            uint256 processingFees = 0.004 ether;
            deal(account, processingFees);

            // Randomly create an empty request
            if (id % emptyInterval == 0) {
                // Simulate processed big request in queue
                tested.tool_simulateProcessedBigRequestInQueue();

                // Assert that the request index indeed holds an empty request now
                (address _requestAccount, uint256 _requestAmount) = tested.withdrawalQueue(id);
                assertEq(_requestAccount, address(0));
                assertEq(_requestAmount, 0);
            }
            // Else create a normal request
            else {
                // Increment non-empty requests counts
                numberOfNonEmptyRequests++;

                // Deposit underlying token amount with another account
                deal(address(underlyingToken), account, requestAmount, true);
                vm.startPrank(account);
                underlyingToken.approve(address(tested), requestAmount);
                tested.deposit(requestAmount);

                // Queue request
                tested.requestWithdrawal{value: processingFees}(requestAmount);
                vm.stopPrank();
            }
        }

        // Assert that only non-empty requests remain in the queue amount
        assertEq(tested.totalQueued(), requestAmount * numberOfNonEmptyRequests);

        // But that empty requests have been properly created in the queue
        assertEq(tested.public_withdrawalQueueLength(), numberOfRequests);

        // Proceed to batch queued withdraw
        vm.prank(withdrawerWallet);
        tested.batchQueuedWithdraw();

        // Assert that all non-empty requested have been successfully processed
        assertEq(tested.totalQueued(), 0);
    }

    function testFuzz_batchQueuedWithdraw_5(
        uint8 decimals,
        uint16 aprUD7x3,
        uint8 numberOfRequests,
        uint256 requestAmount,
        uint160 accountBase,
        uint8 randomBlacklistSeed
    ) public {
        console.log(
            "Should silently move request to frozenRequests without processing them if emitter account is blacklisted"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force set retention rate to 100% so funds are kept on the contract and it doesn't have to be funded
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Cap requestAmount to uint96.max which is the maximum amount of underlying tokens that can be requested at once
        requestAmount = bound(requestAmount, 1, type(uint96).max);

        // Cap amount of requests to 30
        numberOfRequests = uint8(bound(numberOfRequests, 1, 30));

        // Prevent account base from overflowing
        accountBase = uint160(bound(accountBase, 1, type(uint160).max - numberOfRequests));

        // Get the interval of blacklisted requests
        uint256 blacklistInterval = bound(randomBlacklistSeed, 1, 5);

        // Create random number of requests, and blacklist some of them
        uint256[50] memory blacklistedRequestsIds;
        uint256 blacklistedRequestsIdsLength;
        for (uint8 id = 0; id < numberOfRequests; id++) {
            // Obtain account address
            address account = address(accountBase + id);

            // Ensure account is not the L-Token contract
            vm.assume(account != address(tested));

            // Mint processing fees to account
            uint256 processingFees = 0.004 ether;
            deal(account, processingFees);

            // Deposit underlying token amount with another account
            deal(address(underlyingToken), account, requestAmount, true);
            vm.startPrank(account);
            underlyingToken.approve(address(tested), requestAmount);
            tested.deposit(requestAmount);

            // Queue request
            tested.requestWithdrawal{value: processingFees}(requestAmount);
            vm.stopPrank();

            // Randomly blacklist account after request creation
            if (id % blacklistInterval == 0) {
                globalBlacklist.blacklist(account);
                blacklistedRequestsIds[blacklistedRequestsIdsLength] = id;
                blacklistedRequestsIdsLength++;
            }
        }

        // Assert that requests have been queued
        assertEq(tested.totalQueued(), requestAmount * numberOfRequests);
        assertEq(tested.public_withdrawalQueueLength(), numberOfRequests);

        // Assert that underlying balances of blacklisted accounts are 0
        for (uint8 n = 0; n < blacklistedRequestsIdsLength; n++) {
            // Retrieve request ID and account
            uint256 requestId = blacklistedRequestsIds[n];
            (address account, ) = tested.withdrawalQueue(requestId);

            // Assert that account balance is 0
            assertEq(underlyingToken.balanceOf(account), 0);
        }

        // Proceed to batch queued withdraw
        vm.prank(withdrawerWallet);
        tested.batchQueuedWithdraw();

        // Assert that underlying balances are still 0
        for (uint8 n = 0; n < blacklistedRequestsIds.length; n++) {
            // Retrieve request ID and account
            uint256 requestId = blacklistedRequestsIds[n];
            (address account, ) = tested.withdrawalQueue(requestId);

            // Assert that account balance is 0
            assertEq(underlyingToken.balanceOf(account), 0);
        }

        // Assert that the cumulated frozen amount remains queued
        assertEq(tested.totalQueued(), blacklistedRequestsIdsLength * requestAmount);
    }

    function testFuzz_batchQueuedWithdraw_6(
        uint8 decimals,
        uint16 aprUD7x3,
        uint8 numberOfRequests,
        uint256 requestAmount,
        uint160 accountBase
    ) public {
        console.log(
            "Should don't change any state if doesn't hold enough fund to cover first next request"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap amount of requests to 30
        numberOfRequests = uint8(bound(numberOfRequests, 1, 30));

        // Cap requestAmount to uint96.max which is the maximum amount of underlying tokens that can be requested at once
        requestAmount = bound(requestAmount, 1, type(uint96).max);

        // Prevent account base from overflowing
        accountBase = uint160(bound(accountBase, 1, type(uint160).max - numberOfRequests));

        // Create random number of requests
        for (uint8 i = 0; i < numberOfRequests; i++) {
            // Obtain account address
            address account = address(accountBase + i);

            // Ensure account is not the L-Token contract
            vm.assume(account != address(tested));

            // Mint processing fees to account
            uint256 processingFees = 0.004 ether;
            deal(account, processingFees);

            // Deposit underlying token amount with another account
            deal(address(underlyingToken), account, requestAmount, true);
            vm.startPrank(account);
            underlyingToken.approve(address(tested), requestAmount);
            tested.deposit(requestAmount);

            // Queue request
            tested.requestWithdrawal{value: processingFees}(requestAmount);
            vm.stopPrank();
        }

        // Assert that requests have been queued
        assertEq(tested.totalQueued(), requestAmount * numberOfRequests);
        assertEq(tested.public_withdrawalQueueLength(), numberOfRequests);

        // Burn all contracts reserves so it won't be able to cover the first next request
        uint256 usableUnderlyings = tested.usableUnderlyings();
        vm.prank(address(tested));
        underlyingToken.transfer(address(1234), usableUnderlyings);
        tested.tool_rawSetUsableUnderlyings(0);

        // Store old states for later comparison
        uint256 oldUnclaimedFees = tested.unclaimedFees();
        uint256 oldTotalQueued = tested.totalQueued();

        // Proceed to batch queued withdraw
        vm.prank(withdrawerWallet);
        tested.batchQueuedWithdraw();

        // // Assert that states haven't changed
        assertEq(tested.unclaimedFees(), oldUnclaimedFees);
        assertEq(tested.totalQueued(), oldTotalQueued);
    }

    function testFuzz_batchQueuedWithdraw_7(
        uint8 decimals,
        uint16 aprUD7x3,
        uint8 numberOfRequests,
        uint8 numberOfNotCoveredRequests,
        uint256 requestAmount,
        uint160 accountBase
    ) public {
        console.log(
            "Should silently return if encountered a non-big next request that can not anymore be covered by the contract"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force set retention rate to 100% so funds are kept on the contract and it doesn't have to be funded
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Cap amount of requests to 30
        // The 3 floor is here to ensure that each request is not a big request (each request < 1/2 of expected retained)
        numberOfRequests = uint8(bound(numberOfRequests, 3, 30));

        // Cap the number of uncovered requests ito the number of requests
        numberOfNotCoveredRequests = uint8(bound(numberOfNotCoveredRequests, 1, numberOfRequests));

        // Cap requestAmount to uint96.max which is the maximum amount of underlying tokens that can be requested at once
        requestAmount = bound(requestAmount, 1, type(uint96).max);

        // Prevent account base from overflowing
        accountBase = uint160(bound(accountBase, 1, type(uint160).max - numberOfRequests));

        // Create random number of requests
        for (uint8 i = 0; i < numberOfRequests; i++) {
            // Obtain account address
            address account = address(accountBase + i);

            // Ensure account is not the L-Token contract
            vm.assume(account != address(tested));

            // Mint processing fees to account
            uint256 processingFees = 0.004 ether;
            deal(account, processingFees);

            // Deposit underlying token amount with another account
            deal(address(underlyingToken), account, requestAmount, true);
            vm.startPrank(account);
            underlyingToken.approve(address(tested), requestAmount);
            tested.deposit(requestAmount);

            // Queue request
            tested.requestWithdrawal{value: processingFees}(requestAmount);
            vm.stopPrank();
        }

        // Assert that requests have been queued
        assertEq(tested.totalQueued(), requestAmount * numberOfRequests);
        assertEq(tested.public_withdrawalQueueLength(), numberOfRequests);

        // Burn x requestAmount of contract reserves so there is x requests that cannot be covered by the contract
        uint256 burnAmount = requestAmount * numberOfNotCoveredRequests;
        vm.prank(address(tested));
        underlyingToken.transfer(address(1234), burnAmount);
        uint256 newUsableUnderlyings = tested.usableUnderlyings() - burnAmount;
        tested.tool_rawSetUsableUnderlyings(newUsableUnderlyings);

        // Proceed to batch queued withdraw
        vm.prank(withdrawerWallet);
        tested.batchQueuedWithdraw();

        // Assert that states haven't changed
        uint256 expectedStillQueued = numberOfNotCoveredRequests * requestAmount;
        assertEq(tested.totalQueued(), expectedStillQueued);
    }

    function testFuzz_batchQueuedWithdraw_8(
        uint8 decimals,
        uint16 aprUD7x3,
        uint8 numberOfRequests,
        uint16 feesRateUD7x3,
        uint256 amountBase,
        uint160 accountBase
    ) public {
        console.log("Should else transfer underlying tokens to emitter account");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force set retention rate to 100% so funds are kept on the contract and it doesn't have to be funded
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Set random fees rate
        tested.setFeesRate(feesRateUD7x3);

        // Cap amount of requests to 30
        // The 3 floor is here to ensure that each request is not a big request (each request < 1/2 of expected retained)
        numberOfRequests = uint8(bound(numberOfRequests, 3, 30));

        // Cap amountBase to uint96.max which is the maximum amount of underlying tokens that can be requested at once
        amountBase = bound(amountBase, 1, type(uint96).max - 30);

        // Prevent account base from overflowing
        accountBase = uint160(bound(accountBase, 1, type(uint160).max - numberOfRequests));

        // Create random number of requests
        for (uint8 i = 0; i < numberOfRequests; i++) {
            // Obtain account address
            address account = address(accountBase + i);

            // Obtain deposited amount
            uint256 amount = amountBase + i;

            // Ensure account is not the L-Token contract
            vm.assume(account != address(tested));

            // Mint processing fees to account
            uint256 processingFees = 0.004 ether;
            deal(account, processingFees);

            // Deposit underlying token amount with another account
            deal(address(underlyingToken), account, amount, true);
            vm.startPrank(account);
            underlyingToken.approve(address(tested), amount);
            tested.deposit(amount);

            // Queue request
            tested.requestWithdrawal{value: processingFees}(amount);
            vm.stopPrank();
        }

        // Store accounts underlying token balances for later comparison
        uint256[30] memory oldUnderlyingBalances;
        for (uint8 i = 0; i < numberOfRequests; i++) {
            // Obtain account address
            address account = address(accountBase + i);

            // Store account underlying token balance
            oldUnderlyingBalances[i] = underlyingToken.balanceOf(account);
        }

        // Proceed to batch queued withdraw
        vm.prank(withdrawerWallet);
        tested.batchQueuedWithdraw();

        // Assert that accounts underlying token balances have increased by the withdrawn amount
        for (uint8 i = 0; i < numberOfRequests; i++) {
            // Obtain account address
            address account = address(accountBase + i);

            // Obtain initial deposited amount
            uint256 amount = amountBase + i;

            // Obtain withdrawn amount (deposited amount minus fees)
            (uint256 withdrawnAmount, ) = tested.getWithdrawnAmountAndFees(account, amount);

            // Obtain account underlying token balance
            uint256 newUnderlyingBalance = underlyingToken.balanceOf(account);

            // Assert that account underlying token balance has increased by the withdrawn amount
            assertEq(newUnderlyingBalance, oldUnderlyingBalances[i] + withdrawnAmount);
        }
    }

    function testFuzz_batchQueuedWithdraw_9(
        uint8 decimals,
        uint16 aprUD7x3,
        uint8 numberOfRequests,
        uint16 feesRateUD7x3,
        uint256 amountBase,
        uint160 accountBase
    ) public {
        console.log("Should delete processed requests");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force set retention rate to 100% so funds are kept on the contract and it doesn't have to be funded
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Set random fees rate
        tested.setFeesRate(feesRateUD7x3);

        // Cap amount of requests to 30
        // The 3 floor is here to ensure that each request is not a big request (each request < 1/2 of expected retained)
        numberOfRequests = uint8(bound(numberOfRequests, 3, 30));

        // Cap amountBase to uint96.max which is the maximum amount of underlying tokens that can be requested at once
        amountBase = bound(amountBase, 1, type(uint96).max - 30);

        // Prevent account base from overflowing
        accountBase = uint160(bound(accountBase, 1, type(uint160).max - numberOfRequests));

        // Create random number of requests
        for (uint8 i = 0; i < numberOfRequests; i++) {
            // Obtain account address
            address account = address(accountBase + i);

            // Obtain deposited amount
            uint256 amount = amountBase + i;

            // Ensure account is not the L-Token contract
            vm.assume(account != address(tested));

            // Mint processing fees to account
            uint256 processingFees = 0.004 ether;
            deal(account, processingFees);

            // Deposit underlying token amount with another account
            deal(address(underlyingToken), account, amount, true);
            vm.startPrank(account);
            underlyingToken.approve(address(tested), amount);
            tested.deposit(amount);

            // Queue request
            tested.requestWithdrawal{value: processingFees}(amount);
            vm.stopPrank();
        }

        // Store queue and cursor length for later comparison
        uint256 oldQueueLength = tested.public_withdrawalQueueLength();

        // Proceed to batch queued withdraw
        vm.prank(withdrawerWallet);
        tested.batchQueuedWithdraw();

        // Assert that request have been deleted
        for (uint8 i = 0; i < numberOfRequests; i++) {
            (address account, uint256 amount) = tested.withdrawalQueue(i);
            assertEq(account, address(0));
            assertEq(amount, 0);
        }

        // // Assert that queue length has not changed (=requests have not been deplaced at the end of the queue)
        assertEq(tested.public_withdrawalQueueLength(), oldQueueLength);

        // // Assert that the cursor is equal to length meaning the queue is empty
        assertEq(tested.withdrawalQueueCursor(), oldQueueLength);
    }

    function testFuzz_batchQueuedWithdraw_10(
        uint8 decimals,
        uint16 aprUD7x3,
        uint8 numberOfRequests,
        uint16 feesRateUD7x3,
        uint256 amountBase,
        uint160 accountBase
    ) public {
        console.log("Should properly increase unclaimed fees amount");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force set retention rate to 100% so funds are kept on the contract and it doesn't have to be funded
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Set random fees rate
        tested.setFeesRate(feesRateUD7x3);

        // Cap amount of requests to 30
        // The 3 floor is here to ensure that each request is not a big request (each request < 1/2 of expected retained)
        numberOfRequests = uint8(bound(numberOfRequests, 3, 30));

        // Cap amountBase to uint96.max which is the maximum amount of underlying tokens that can be requested at once
        amountBase = bound(amountBase, 1, type(uint96).max - 30);

        // Prevent account base from overflowing
        accountBase = uint160(bound(accountBase, 1, type(uint160).max - numberOfRequests));

        // Create random number of requests
        for (uint8 i = 0; i < numberOfRequests; i++) {
            // Obtain account address
            address account = address(accountBase + i);

            // Obtain deposited amount
            uint256 amount = amountBase + i;

            // Ensure account is not the L-Token contract
            vm.assume(account != address(tested));

            // Mint processing fees to account
            uint256 processingFees = 0.004 ether;
            deal(account, processingFees);

            // Deposit underlying token amount with another account
            deal(address(underlyingToken), account, amount, true);
            vm.startPrank(account);
            underlyingToken.approve(address(tested), amount);
            tested.deposit(amount);

            // Queue request
            tested.requestWithdrawal{value: processingFees}(amount);
            vm.stopPrank();
        }

        // Assert that unclaimed fees is currently 0
        assertEq(tested.unclaimedFees(), 0);

        // Proceed to batch queued withdraw
        vm.prank(withdrawerWallet);
        tested.batchQueuedWithdraw();

        // Compute the expected amount of unclaimed fees
        uint256 expectedUnclaimedFees;
        for (uint8 i = 0; i < numberOfRequests; i++) {
            // Obtain account address
            address account = address(accountBase + i);

            // Obtain initial deposited amount
            uint256 amount = amountBase + i;

            // Obtain withdrawn amount (deposited amount minus fees)
            (, uint256 fees) = tested.getWithdrawnAmountAndFees(account, amount);

            // Accumulate fees
            expectedUnclaimedFees += fees;
        }

        // Assert that unclaimed fees has increased by the expected amount
        assertEq(tested.unclaimedFees(), expectedUnclaimedFees);
    }

    function testFuzz_batchQueuedWithdraw_11(
        uint8 decimals,
        uint16 aprUD7x3,
        uint8 numberOfRequests,
        uint16 feesRateUD7x3,
        uint256 amountBase,
        uint160 accountBase
    ) public {
        console.log("Should properly decrease usable underlyings tokens amount");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force set retention rate to 100% so funds are kept on the contract and it doesn't have to be funded
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Set random fees rate
        tested.setFeesRate(feesRateUD7x3);

        // Cap amount of requests to 30
        // The 3 floor is here to ensure that each request is not a big request (each request < 1/2 of expected retained)
        numberOfRequests = uint8(bound(numberOfRequests, 3, 30));

        // Cap amountBase to uint96.max which is the maximum amount of underlying tokens that can be requested at once
        amountBase = bound(amountBase, 1, type(uint96).max - 30);

        // Prevent account base from overflowing
        accountBase = uint160(bound(accountBase, 1, type(uint160).max - numberOfRequests));

        // Create random number of requests
        for (uint8 i = 0; i < numberOfRequests; i++) {
            // Obtain account address
            address account = address(accountBase + i);

            // Obtain deposited amount
            uint256 amount = amountBase + i;

            // Ensure account is not the L-Token contract
            vm.assume(account != address(tested));

            // Mint processing fees to account
            uint256 processingFees = 0.004 ether;
            deal(account, processingFees);

            // Deposit underlying token amount with another account
            deal(address(underlyingToken), account, amount, true);
            vm.startPrank(account);
            underlyingToken.approve(address(tested), amount);
            tested.deposit(amount);

            // Queue request
            tested.requestWithdrawal{value: processingFees}(amount);
            vm.stopPrank();
        }

        // Store old usableUnderlyings state for later comparison
        uint256 oldUsableUnderlyings = tested.usableUnderlyings();

        // Proceed to batch queued withdraw
        vm.prank(withdrawerWallet);
        tested.batchQueuedWithdraw();

        // Compute the expected amount decreased from usableUnderlyings
        uint256 expectedDecrease;
        for (uint8 i = 0; i < numberOfRequests; i++) {
            // Obtain account address
            address account = address(accountBase + i);

            // Obtain initial deposited amount
            uint256 amount = amountBase + i;

            // Obtain withdrawn amount (deposited amount minus fees)
            (uint256 withdrawnAmount, ) = tested.getWithdrawnAmountAndFees(account, amount);

            // Accumulate expected decrease
            expectedDecrease += withdrawnAmount;
        }

        // Assert that usableUnderlyings has decreased by the expected amount
        assertEq(tested.usableUnderlyings(), oldUsableUnderlyings - expectedDecrease);
    }

    function testFuzz_batchQueuedWithdraw_12(
        uint8 decimals,
        uint16 aprUD7x3,
        uint8 numberOfRequests,
        uint16 feesRateUD7x3,
        uint256 amountBase,
        uint160 accountBase
    ) public {
        console.log("Should properly decrease total queued amount");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force set retention rate to 100% so funds are kept on the contract and it doesn't have to be funded
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Set random fees rate
        tested.setFeesRate(feesRateUD7x3);

        // Cap amount of requests to 30
        // The 3 floor is here to ensure that each request is not a big request (each request < 1/2 of expected retained)
        numberOfRequests = uint8(bound(numberOfRequests, 3, 30));

        // Cap amountBase to uint96.max which is the maximum amount of underlying tokens that can be requested at once
        amountBase = bound(amountBase, 1, type(uint96).max - 30);

        // Prevent account base from overflowing
        accountBase = uint160(bound(accountBase, 1, type(uint160).max - numberOfRequests));

        // Create random number of requests
        for (uint8 i = 0; i < numberOfRequests; i++) {
            // Obtain account address
            address account = address(accountBase + i);

            // Obtain deposited amount
            uint256 amount = amountBase + i;

            // Ensure account is not the L-Token contract
            vm.assume(account != address(tested));

            // Mint processing fees to account
            uint256 processingFees = 0.004 ether;
            deal(account, processingFees);

            // Deposit underlying token amount with another account
            deal(address(underlyingToken), account, amount, true);
            vm.startPrank(account);
            underlyingToken.approve(address(tested), amount);
            tested.deposit(amount);

            // Queue request
            tested.requestWithdrawal{value: processingFees}(amount);
            vm.stopPrank();
        }

        // Store old total queued state for later comparison
        uint256 oldTotalQueued = tested.totalQueued();

        // Proceed to batch queued withdraw
        vm.prank(withdrawerWallet);
        tested.batchQueuedWithdraw();

        // Compute the expected amount decreased from usableUnderlyings
        uint256 expectedDecrease;
        for (uint8 i = 0; i < numberOfRequests; i++) {
            // Obtain initial deposited amount
            uint256 amount = amountBase + i;

            // Accumulate expected decrease
            expectedDecrease += amount;
        }

        // Assert that totalQueued has decreased by the expected amount
        assertEq(tested.totalQueued(), oldTotalQueued - expectedDecrease);
    }

    function testFuzz_batchQueuedWithdraw_13(
        uint8 decimals,
        uint16 aprUD7x3,
        uint8 numberOfRequests,
        uint16 feesRateUD7x3,
        uint256 amountBase,
        uint160 accountBase
    ) public {
        console.log(
            "Should properly increase withdrawal cursor to the next request to be processed"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Force set retention rate to 100% so funds are kept on the contract and it doesn't have to be funded
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Set random fees rate
        tested.setFeesRate(feesRateUD7x3);

        // Cap amount of requests to 30
        // The 3 floor is here to ensure that each request is not a big request (each request < 1/2 of expected retained)
        numberOfRequests = uint8(bound(numberOfRequests, 3, 30));

        // Cap amountBase to uint96.max which is the maximum amount of underlying tokens that can be requested at once
        amountBase = bound(amountBase, 1, type(uint96).max - 30);

        // Prevent account base from overflowing
        accountBase = uint160(bound(accountBase, 1, type(uint160).max - numberOfRequests));

        // Create random number of requests
        for (uint8 i = 0; i < numberOfRequests; i++) {
            // Obtain account address
            address account = address(accountBase + i);

            // Obtain deposited amount
            uint256 amount = amountBase + i;

            // Ensure account is not the L-Token contract
            vm.assume(account != address(tested));

            // Mint processing fees to account
            uint256 processingFees = 0.004 ether;
            deal(account, processingFees);

            // Deposit underlying token amount with another account
            deal(address(underlyingToken), account, amount, true);
            vm.startPrank(account);
            underlyingToken.approve(address(tested), amount);
            tested.deposit(amount);

            // Queue request
            tested.requestWithdrawal{value: processingFees}(amount);
            vm.stopPrank();
        }

        // Proceed to batch queued withdraw
        vm.prank(withdrawerWallet);
        tested.batchQueuedWithdraw();

        // Assert withdrawal cursor is set to next request to be processed (= queue length)
        assertEq(tested.withdrawalQueueCursor(), tested.public_withdrawalQueueLength());
    }

    // ====================================
    // === bigQueuedWithdraw() function ===
    function testFuzz_bigQueuedWithdraw_1(address account, uint256 requestId) public {
        console.log("Should revert if not called by fund wallet");

        // Ensure the random account is not the fund wallet
        vm.assume(account != fundWallet);

        // Expect revert
        vm.expectRevert(bytes("L40"));
        vm.prank(account);
        tested.bigQueuedWithdraw(requestId);
    }

    function testFuzz_bigQueuedWithdraw_2(uint256 requestId) public {
        console.log("Should revert if contract is paused");
        globalPause.pause();
        expectRevertPaused();
        vm.prank(fundWallet);
        tested.bigQueuedWithdraw(requestId);
    }

    function testFuzz_bigQueuedWithdraw_3(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint16 feesRateUD7x3,
        uint256 amount
    ) public {
        console.log("Should revert if request emitter has been blacklisted since emission");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account are neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap retention rate to 100%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 0, 100 * 10 ** 3));

        // Set random retention rate
        tested.tool_setRetentionRate(retentionRateUD7x3);

        // Set random fees rate
        tested.setFeesRate(feesRateUD7x3);

        // Cap amount so it doesn't overflow max withdrawal request amount
        amount = bound(amount, 1, type(uint96).max);

        // Deposit random amount
        deal(address(underlyingToken), account, amount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), amount);
        tested.deposit(amount);
        vm.stopPrank();

        // Request withdrawal for the whole amount (big request)
        uint256 processingFees = 0.004 ether;
        deal(account, processingFees);
        vm.prank(account);
        tested.requestWithdrawal{value: processingFees}(amount);

        // Blacklist account
        globalBlacklist.blacklist(account);

        // Expect revert
        vm.expectRevert(bytes("L50"));
        vm.prank(address(fundWallet));
        tested.bigQueuedWithdraw(0);
    }

    function testFuzz_bigQueuedWithdraw_4(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint16 feesRateUD7x3,
        uint256 amount
    ) public {
        console.log("Should revert if request is not a big request");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account are neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap retention rate to 100%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 0, 100 * 10 ** 3));

        // Set random retention rate
        tested.tool_setRetentionRate(retentionRateUD7x3);

        // Set random fees rate
        tested.setFeesRate(feesRateUD7x3);

        // Cap amount to  (0, 100T]
        amount = bound(amount, 1, type(uint96).max);

        // Deposit random amount
        deal(address(underlyingToken), account, amount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), amount);
        tested.deposit(amount);
        vm.stopPrank();

        // Compute a requested amount lower than retention rate (not a big request)
        uint256 requestedAmount = tested.getExpectedRetained() / 2;
        vm.assume(requestedAmount > 0);

        // Request withdrawal for the non-big amount
        uint256 processingFees = 0.004 ether;
        deal(account, processingFees);
        vm.prank(account);
        tested.requestWithdrawal{value: processingFees}(requestedAmount);

        // Expect revert
        vm.expectRevert(bytes("L51"));
        vm.prank(address(fundWallet));
        tested.bigQueuedWithdraw(0);
    }

    function testFuzz_bigQueuedWithdraw_5(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint16 feesRateUD7x3,
        uint256 amount
    ) public {
        console.log(
            "Should revert withdrawn amount cannot be covered by contract + fund wallet balances"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account are neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap retention rate to 100%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 0, 100 * 10 ** 3));

        // Set random retention rate
        tested.tool_setRetentionRate(retentionRateUD7x3);

        // Set random fees rate
        tested.setFeesRate(feesRateUD7x3);

        // Cap amount to  (0, 100T]
        amount = bound(amount, 1, type(uint96).max);

        // Deposit random amount
        deal(address(underlyingToken), account, amount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), amount);
        tested.deposit(amount);
        vm.stopPrank();

        // Request withdrawal for the non-big amount
        uint256 processingFees = 0.004 ether;
        deal(account, processingFees);
        vm.prank(account);
        tested.requestWithdrawal{value: processingFees}(amount);

        // Burn fees amount + 1 from both contract + fund wallet balances
        (, uint256 fees) = tested.getWithdrawnAmountAndFees(account, amount);
        uint256 burnAmount = fees + 1;
        uint256 fundBalance = underlyingToken.balanceOf(fundWallet);
        if (burnAmount <= fundBalance) {
            vm.prank(fundWallet);
            underlyingToken.transfer(address(1234), burnAmount);
        } else {
            vm.prank(fundWallet);
            underlyingToken.transfer(address(1234), fundBalance);

            uint256 remainingToBurn = burnAmount - fundBalance;
            vm.prank(address(tested));
            underlyingToken.transfer(address(1234), remainingToBurn);
            tested.tool_rawSetUsableUnderlyings(tested.usableUnderlyings() - remainingToBurn);
        }

        // Expect revert because 1 token is missing to cover the request
        vm.startPrank(address(fundWallet));
        vm.expectRevert(bytes("L52"));
        tested.bigQueuedWithdraw(0);
        vm.stopPrank();
    }

    function testFuzz_bigQueuedWithdraw_6(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint256 amount
    ) public {
        console.log("Should cover request from fund balance in priority");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the LToken one
        vm.assume(account != address(0));
        vm.assume(account != address(tested));
        vm.assume(account != fundWallet);

        // Set first random APRs
        tested.setAPR(aprUD7x3);

        // Set fees rate to 0 so it doesn't inter in below tests
        tested.setFeesRate(0);

        // Cap retention rate to 100%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 0, 100 * 10 ** 3));

        // Set random retention rate
        tested.tool_setRetentionRate(retentionRateUD7x3);

        // Cap requested amount to max withdrawal request amount
        amount = bound(amount, 1, type(uint96).max);

        // Deposit & request amount
        deal(address(underlyingToken), account, amount, true);
        uint256 processingFees = 0.004 ether;
        deal(account, processingFees);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), amount);
        tested.deposit(amount);
        vm.stopPrank();

        // Ensure requested amount can be covered by fund wallet
        vm.assume(amount <= underlyingToken.balanceOf(fundWallet));

        // Request withdrawal for the non-big amount
        vm.prank(account);
        tested.requestWithdrawal{value: processingFees}(amount);

        // Ensure that request is a big request
        vm.assume(amount > tested.getExpectedRetained() / 2);

        // Store old LToken, fund wallet and account balances for later comparison
        uint256 oldLTokenBalance = underlyingToken.balanceOf(address(tested));
        uint256 oldFundWalletBalance = underlyingToken.balanceOf(fundWallet);
        uint256 oldAccountBalance = underlyingToken.balanceOf(account);

        // Proceed to big queued withdraw
        vm.startPrank(fundWallet);
        underlyingToken.approve(address(tested), amount);
        tested.bigQueuedWithdraw(0);
        vm.stopPrank();

        // LToken contract balance shouldn't have changed
        assertEq(underlyingToken.balanceOf(address(tested)), oldLTokenBalance);

        // Fund wallet balance should have decreased by the requested amount
        (uint256 withdrawnAmount, ) = tested.getWithdrawnAmountAndFees(account, amount);
        assertEq(underlyingToken.balanceOf(fundWallet), oldFundWalletBalance - withdrawnAmount);

        // Account balance should have increased by the withdrawn amount
        assertEq(underlyingToken.balanceOf(account), oldAccountBalance + withdrawnAmount);
    }

    function testFuzz_bigQueuedWithdraw_7(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint256 amount
    ) public {
        console.log(
            "Should use contract tokens to cover request if fund wallet balance is not enough"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the LToken one
        vm.assume(account != address(0));
        vm.assume(account != address(tested));
        vm.assume(account != fundWallet);

        // Set first random APRs
        tested.setAPR(aprUD7x3);

        // Set fees rate to 0 so it doesn't inter in below tests
        tested.setFeesRate(0);

        // Cap retention rate to 100%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 0, 100 * 10 ** 3));

        // Set random retention rate
        tested.tool_setRetentionRate(retentionRateUD7x3);

        // Cap requested amount to max withdrawal request amount
        amount = bound(amount, 1, type(uint96).max);

        // Deposit & request amount
        deal(address(underlyingToken), account, amount, true);
        uint256 processingFees = 0.004 ether;
        deal(account, processingFees);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), amount);
        tested.deposit(amount);
        vm.stopPrank();

        // Ensure there is some funds both on the contract and the fund wallet
        vm.assume(underlyingToken.balanceOf(fundWallet) > 0);
        vm.assume(underlyingToken.balanceOf(address(tested)) > 0);

        // Request withdrawal
        vm.prank(account);
        tested.requestWithdrawal{value: processingFees}(amount);

        // Ensure that request is a big request
        vm.assume(amount > tested.getExpectedRetained() / 2);

        // Proceed to big queued withdraw
        vm.startPrank(fundWallet);
        underlyingToken.approve(address(tested), amount);
        tested.bigQueuedWithdraw(0);
        vm.stopPrank();

        // LToken contract balance shouldn't have changed
        assertEq(underlyingToken.balanceOf(address(tested)), 0);

        // Fund wallet balance should have been entirely used
        assertEq(underlyingToken.balanceOf(fundWallet), 0);

        // Account balance should have increased by the withdrawn amount
        assertEq(underlyingToken.balanceOf(account), amount);
    }

    function testFuzz_bigQueuedWithdraw_8(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint16 feesRateUD7x3,
        uint256 amount
    ) public {
        console.log("Should properly increase unclaimed fees amount");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account are neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap retention rate to 100%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 0, 100 * 10 ** 3));

        // Set random retention rate
        tested.tool_setRetentionRate(retentionRateUD7x3);

        // Set random fees rate
        tested.setFeesRate(feesRateUD7x3);

        // Prevent amount from overflowing max withdrawal request amount
        amount = bound(amount, 20_000 * 10 ** decimals + 1, type(uint96).max);

        // Deposit random amount
        deal(address(underlyingToken), account, amount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), amount);
        tested.deposit(amount);
        vm.stopPrank();

        // Request withdrawal for the non-big amount
        uint256 processingFees = 0.004 ether;
        deal(account, processingFees);
        vm.prank(account);
        tested.requestWithdrawal{value: processingFees}(amount);

        // Process queued withdrawal
        vm.startPrank(address(fundWallet));
        underlyingToken.approve(address(tested), amount);
        tested.bigQueuedWithdraw(0);
        vm.stopPrank();

        // Assert that unclaimed fees has increased by the expected amount
        (, uint256 expectedFees) = tested.getWithdrawnAmountAndFees(account, amount);
        assertEq(tested.unclaimedFees(), expectedFees);
    }

    function testFuzz_bigQueuedWithdraw_9(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint16 feesRateUD7x3,
        uint256 amount
    ) public {
        console.log("Should properly decrease queued amount");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account are neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap retention rate to 100%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 0, 100 * 10 ** 3));

        // Set random retention rate
        tested.tool_setRetentionRate(retentionRateUD7x3);

        // Set random fees rate
        tested.setFeesRate(feesRateUD7x3);

        // Prevent amount from overflowing max withdrawal request amount
        amount = bound(amount, 1, type(uint96).max);

        // Deposit random amount
        deal(address(underlyingToken), account, amount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), amount);
        tested.deposit(amount);
        vm.stopPrank();

        // Request withdrawal for the non-big amount
        uint256 processingFees = 0.004 ether;
        deal(account, processingFees);
        vm.prank(account);
        tested.requestWithdrawal{value: processingFees}(amount);

        // Store old total queued state for later comparison
        uint256 oldTotalQueued = tested.totalQueued();

        // Process queued withdrawal
        vm.startPrank(address(fundWallet));
        underlyingToken.approve(address(tested), amount);
        tested.bigQueuedWithdraw(0);
        vm.stopPrank();

        // Assert that totalQueued has decreased by the expected amount
        assertEq(tested.totalQueued(), oldTotalQueued - amount);
    }

    function testFuzz_bigQueuedWithdraw_10(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint16 feesRateUD7x3,
        uint256 amount
    ) public {
        console.log("Should delete processed request from queue");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account are neither the zero address nor the L-Token contract
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap retention rate to 100%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 0, 100 * 10 ** 3));

        // Set random retention rate
        tested.tool_setRetentionRate(retentionRateUD7x3);

        // Set random fees rate
        tested.setFeesRate(feesRateUD7x3);

        // Prevent amount from overflowing max withdrawal request amount
        amount = bound(amount, 1, type(uint96).max);

        // Deposit random amount
        deal(address(underlyingToken), account, amount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), amount);
        tested.deposit(amount);
        vm.stopPrank();

        // Request withdrawal for the non-big amount
        uint256 processingFees = 0.004 ether;
        deal(account, processingFees);
        vm.prank(account);
        tested.requestWithdrawal{value: processingFees}(amount);

        // Process queued withdrawal
        vm.startPrank(address(fundWallet));
        underlyingToken.approve(address(tested), amount);
        tested.bigQueuedWithdraw(0);
        vm.stopPrank();

        // Assert that request has been deleted from queue
        (address deletedRequestAccount, uint256 deletedRequestAmount) = tested.withdrawalQueue(0);
        assertEq(deletedRequestAccount, address(0));
        assertEq(deletedRequestAmount, 0);
    }

    // ====================================
    // === requestWithdrawal() function ===
    function testFuzz_requestWithdrawal_1(address account, uint256 amount) public {
        console.log("Should revert if contract is paused");
        globalPause.pause();
        expectRevertPaused();
        vm.prank(account);
        tested.requestWithdrawal(amount);
    }

    function testFuzz_requestWithdrawal_2(address account, uint256 amount) public {
        console.log("Should revert if account is blacklisted");
        // Ensure account is not the zero address
        vm.assume(account != address(0));

        // Blacklist account
        globalBlacklist.blacklist(account);

        // Expect revert
        expectRevertRestricted();
        vm.prank(account);
        tested.requestWithdrawal(amount);
    }

    function testFuzz_requestWithdrawal_3(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 depositedAmount,
        uint256 requestedAmount
    ) public {
        console.log("Should revert if account hasn't deposited enough funds");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is not the zero address
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap requested amount to max withdrawal request amount
        requestedAmount = bound(requestedAmount, 2, type(uint96).max);

        // Ensure deposited amount is lower than requested amount
        depositedAmount = bound(depositedAmount, 1, requestedAmount - 1);

        // Deposit random amount
        deal(address(underlyingToken), account, depositedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        vm.stopPrank();

        // Expect revert when trying to request more than deposited amount
        vm.expectRevert(bytes("L53"));
        vm.prank(account);
        tested.requestWithdrawal(requestedAmount);
    }

    function testFuzz_requestWithdrawal_4(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 requestedAmount
    ) public {
        console.log("Should revert if requested amount is greater than uint96 max");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is not the zero address
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap requested amount to max withdrawal request amount
        // Ternary operator prevents 100T being lower than uint96 max on small decimals numbers
        requestedAmount = bound(
            requestedAmount,
            uint256(type(uint96).max) + 1,
            100_000_000_000_000 * 10 ** decimals > uint256(type(uint96).max) + 1
                ? 100_000_000_000_000 * 10 ** decimals
                : uint256(type(uint96).max) + 1
        );

        // Deposit requested amount
        deal(address(underlyingToken), account, requestedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), requestedAmount);
        tested.deposit(requestedAmount);
        vm.stopPrank();

        // Expect revert when trying to request more than type(uint96).max
        vm.expectRevert(bytes("L54"));
        vm.prank(account);
        tested.requestWithdrawal(requestedAmount);
    }

    function testFuzz_requestWithdrawal_5(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 requestedAmount,
        uint256 attachedProcessingFees
    ) public {
        console.log(
            "Should revert if caller has attached more or less than 0.004ETH of processing fees"
        );
        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is not the zero address
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap requested amount to max withdrawal request amount
        requestedAmount = bound(requestedAmount, 1, type(uint96).max);

        // Deposit requested amount
        deal(address(underlyingToken), account, requestedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), requestedAmount);
        tested.deposit(requestedAmount);
        vm.stopPrank();

        // Ensure processing fees are different than 0.004ETH
        vm.assume(attachedProcessingFees != 0.004 ether);

        // Expect revert when not attaching processing fees
        deal(account, attachedProcessingFees);
        vm.expectRevert(bytes("L55"));
        vm.prank(account);
        tested.requestWithdrawal{value: attachedProcessingFees}(requestedAmount);
    }

    function testFuzz_requestWithdrawal_6(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 requestedAmount
    ) public {
        console.log("Should transfer 0.004ETH of processing fees to withdrawer wallet");
        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is not the zero address
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap requested amount to max withdrawal request amount
        requestedAmount = bound(requestedAmount, 1, type(uint96).max);

        // Deposit requested amount
        deal(address(underlyingToken), account, requestedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), requestedAmount);
        tested.deposit(requestedAmount);
        vm.stopPrank();

        // Mint processing fees to account
        uint256 processingFees = 0.004 ether;
        deal(account, processingFees);

        // Assert the withdrawer wallet balance is 0
        assertEq(address(withdrawerWallet).balance, 0);

        // Assert that account balance is 0.004ETH
        assertEq(address(account).balance, processingFees);

        // Request withdrawal
        vm.prank(account);
        tested.requestWithdrawal{value: processingFees}(requestedAmount);

        // Assert that withdrawer wallet balance has increased by 0.004ETH
        assertEq(address(withdrawerWallet).balance, processingFees);

        // Assert that account balance has decreased by 0.004ETH
        assertEq(address(account).balance, 0);
    }

    function testFuzz_requestWithdrawal_7(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 requestedAmount
    ) public {
        console.log("Should burn account withdrawn L-Tokens");
        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is not the zero address
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap requested amount to max withdrawal request amount
        requestedAmount = bound(requestedAmount, 1, type(uint96).max);

        // Deposit requested amount
        deal(address(underlyingToken), account, requestedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), requestedAmount);
        tested.deposit(requestedAmount);
        vm.stopPrank();

        // Mint processing fees to account
        uint256 processingFees = 0.004 ether;
        deal(account, processingFees);

        // Store old L-Tokens real supply and old account L-Token balance for later comparison
        uint256 oldLTokenSupply = tested.realTotalSupply();
        uint256 oldAccountLTokenBalance = tested.balanceOf(account);

        // Request withdrawal
        vm.prank(account);
        tested.requestWithdrawal{value: processingFees}(requestedAmount);

        // Assert that L-Token supply has decreased by the requested amount
        assertEq(tested.realTotalSupply(), oldLTokenSupply - requestedAmount);

        // Assert that account L-Token balance has decreased by the requested amount
        assertEq(tested.balanceOf(account), oldAccountLTokenBalance - requestedAmount);
    }

    function testFuzz_requestWithdrawal_8(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 requestedAmount
    ) public {
        console.log(
            "Should properly set caller as request.account and requestedAmount as request.amount"
        );
        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is not the zero address
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap requested amount to max withdrawal request amount
        requestedAmount = bound(requestedAmount, 1, type(uint96).max);

        // Deposit requested amount
        deal(address(underlyingToken), account, requestedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), requestedAmount);
        tested.deposit(requestedAmount);
        vm.stopPrank();

        // Mint processing fees to account
        uint256 processingFees = 0.004 ether;
        deal(account, processingFees);

        // Request withdrawal
        vm.prank(account);
        tested.requestWithdrawal{value: processingFees}(requestedAmount);

        // Retrieve request data
        (address requestAccount, uint256 requestAmount) = tested.withdrawalQueue(0);

        // Assert that request account is the caller
        assertEq(requestAccount, account);

        // Assert that request amount is the requested amount
        assertEq(requestAmount, requestedAmount);
    }

    function testFuzz_requestWithdrawal_9(
        uint8 decimals,
        address account1,
        address account2,
        uint16 aprUD7x3,
        uint256 requestedAmount1,
        uint256 requestedAmount2
    ) public {
        console.log(
            "Should add request at the begining of the queue if caller is elligible to staking tier 2"
        );
        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure accounts are different, and neither the zero address nor the LToken one
        vm.assume(account1 != account2);
        vm.assume(account1 != address(0));
        vm.assume(account2 != address(0));
        vm.assume(account1 != address(tested));
        vm.assume(account2 != address(tested));

        // Set first random APRs
        tested.setAPR(aprUD7x3);
        ldyStaking.setAPR(aprUD7x3);

        // Cap requested amount to max withdrawal request amount
        requestedAmount1 = bound(requestedAmount1, 1, type(uint96).max);
        requestedAmount2 = bound(requestedAmount2, 1, type(uint96).max);

        // Ensure requested amounts are different
        vm.assume(requestedAmount1 != requestedAmount2);

        // Store amount of processing fees
        uint256 processingFees = 0.004 ether;

        // Account 1 deposit and withdrawal requested
        deal(address(underlyingToken), account1, requestedAmount1, true);
        deal(account1, processingFees);
        vm.startPrank(account1);
        underlyingToken.approve(address(tested), requestedAmount1);
        tested.deposit(requestedAmount1);
        tested.requestWithdrawal{value: processingFees}(requestedAmount1);
        vm.stopPrank();

        // Process account 1 first request to withdrwalCursor from 0
        vm.startPrank(address(fundWallet));
        underlyingToken.approve(address(tested), requestedAmount1);
        tested.bigQueuedWithdraw(0);
        vm.stopPrank();
        assertEq(tested.withdrawalQueueCursor(), 1);

        // Emit another account1 deposit and withdrawal request
        deal(address(underlyingToken), account1, requestedAmount1, true);
        deal(account1, processingFees);
        vm.startPrank(account1);
        underlyingToken.approve(address(tested), requestedAmount1);
        tested.deposit(requestedAmount1);
        tested.requestWithdrawal{value: processingFees}(requestedAmount1);
        vm.stopPrank();

        // Ensure account 2 is elligible to staking tier 2
        uint256 tier2Amount = 10;
        deal(address(ldyToken), account2, tier2Amount, true);
        ldyStaking.setTier(2, tier2Amount);
        vm.startPrank(account2);
        ldyToken.approve(address(ldyStaking), tier2Amount);
        ldyStaking.stake(uint216(tier2Amount));
        vm.stopPrank();
        assertEq(ldyStaking.tierOf(account2), 2);

        // Account 2 deposit and withdrawal requested
        deal(address(underlyingToken), account2, requestedAmount2, true);
        deal(account2, processingFees);
        vm.startPrank(account2);
        underlyingToken.approve(address(tested), requestedAmount2);
        tested.deposit(requestedAmount2);
        tested.requestWithdrawal{value: processingFees}(requestedAmount2);
        vm.stopPrank();

        // Assert that the next request in the queue is the one of account 2
        (address requestAccount, uint256 requestAmount) = tested.withdrawalQueue(
            tested.withdrawalQueueCursor()
        );
        assertEq(requestAccount, account2);
        assertEq(requestAmount, requestedAmount2);
    }

    function testFuzz_requestWithdrawal_10(
        uint8 decimals,
        address account1,
        address account2,
        uint16 aprUD7x3,
        uint256 requestedAmount1,
        uint256 requestedAmount2
    ) public {
        console.log("Should add request at the end of the queue else");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure accounts are different, and neither the zero address nor the LToken one
        vm.assume(account1 != account2);
        vm.assume(account1 != address(0));
        vm.assume(account2 != address(0));
        vm.assume(account1 != address(tested));
        vm.assume(account2 != address(tested));

        // Set first random APRs
        tested.setAPR(aprUD7x3);
        ldyStaking.setAPR(aprUD7x3);

        // Cap requested amount to max withdrawal request amount
        requestedAmount1 = bound(requestedAmount1, 1, type(uint96).max);
        requestedAmount2 = bound(requestedAmount2, 1, type(uint96).max);

        // Ensure requested amounts are different
        vm.assume(requestedAmount1 != requestedAmount2);

        // Store amount of processing fees
        uint256 processingFees = 0.004 ether;

        // Account 1 deposit and withdrawal requested
        deal(address(underlyingToken), account1, requestedAmount1, true);
        deal(account1, processingFees);
        vm.startPrank(account1);
        underlyingToken.approve(address(tested), requestedAmount1);
        tested.deposit(requestedAmount1);
        tested.requestWithdrawal{value: processingFees}(requestedAmount1);
        vm.stopPrank();

        // Process account 1 first request to withdrwalCursor from 0
        vm.startPrank(address(fundWallet));
        underlyingToken.approve(address(tested), requestedAmount1);
        tested.bigQueuedWithdraw(0);
        vm.stopPrank();
        assertEq(tested.withdrawalQueueCursor(), 1);

        // Emit another account1 deposit and withdrawal request
        deal(address(underlyingToken), account1, requestedAmount1, true);
        deal(account1, processingFees);
        vm.startPrank(account1);
        underlyingToken.approve(address(tested), requestedAmount1);
        tested.deposit(requestedAmount1);
        tested.requestWithdrawal{value: processingFees}(requestedAmount1);
        vm.stopPrank();

        // Ensure account 2 is NOT elligible to staking tier 2
        assertEq(ldyStaking.tierOf(account2), 0);

        // Account 2 deposit and withdrawal requested
        deal(address(underlyingToken), account2, requestedAmount2, true);
        deal(account2, processingFees);
        vm.startPrank(account2);
        underlyingToken.approve(address(tested), requestedAmount2);
        tested.deposit(requestedAmount2);
        tested.requestWithdrawal{value: processingFees}(requestedAmount2);
        vm.stopPrank();

        // Assert that the next request in the queue is not the one of account 2
        (address requestAccount, uint256 requestAmount) = tested.withdrawalQueue(
            tested.withdrawalQueueCursor()
        );
        assertNotEq(requestAccount, account2);
        assertNotEq(requestAmount, requestedAmount2);

        // Assert the the account 2 request is the latest of the queue
        (requestAccount, requestAmount) = tested.withdrawalQueue(
            tested.public_withdrawalQueueLength() - 1
        );
        assertEq(requestAccount, account2);
        assertEq(requestAmount, requestedAmount2);
    }

    function testFuzz_requestWithdrawal_11(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 requestedAmount
    ) public {
        console.log("Should properly increase total queued by requested amount");
        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is not the zero address
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APR
        tested.setAPR(aprUD7x3);

        // Cap requested amount to max withdrawal request amount
        requestedAmount = bound(requestedAmount, 1, type(uint96).max);

        // Deposit requested amount
        deal(address(underlyingToken), account, requestedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), requestedAmount);
        tested.deposit(requestedAmount);
        vm.stopPrank();

        // Mint processing fees to account
        uint256 processingFees = 0.004 ether;
        deal(account, processingFees);

        // Request withdrawal
        vm.prank(account);
        tested.requestWithdrawal{value: processingFees}(requestedAmount);

        // Assert that totalQueued has increased by the requested amount
        assertEq(tested.totalQueued(), requestedAmount);
    }

    // ====================================
    // === cancelWithdrawalRequest() function ===
    function testFuzz_cancelWithdrawalRequest_1(address account, uint256 requestId) public {
        console.log("Should revert if contract is paused");
        globalPause.pause();
        expectRevertPaused();
        vm.prank(account);
        tested.cancelWithdrawalRequest(requestId);
    }

    function testFuzz_cancelWithdrawalRequest_2(address account, uint256 requestId) public {
        console.log("Should revert if account is blacklisted");
        // Ensure account is not the zero address
        vm.assume(account != address(0));

        // Blacklist account
        globalBlacklist.blacklist(account);

        // Expect revert
        expectRevertRestricted();
        vm.prank(account);
        tested.cancelWithdrawalRequest(requestId);
    }

    function testFuzz_cancelWithdrawalRequest_3(
        uint8 decimals,
        address account1,
        address account2,
        uint16 aprUD7x3,
        uint256 requestedAmount
    ) public {
        console.log("Should revert request doesn't belong to caller");
        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure accounts are different, and neither the zero address nor the LToken one
        vm.assume(account1 != account2);
        vm.assume(account1 != address(0));
        vm.assume(account2 != address(0));
        vm.assume(account1 != address(tested));
        vm.assume(account2 != address(tested));

        // Set first random APRs
        tested.setAPR(aprUD7x3);

        // Cap requested amount to max withdrawal request amount
        requestedAmount = bound(requestedAmount, 1, type(uint96).max);

        // Deposit and request amount from account1
        deal(address(underlyingToken), account1, requestedAmount, true);
        uint256 processingFees = 0.004 ether;
        deal(account1, processingFees);

        vm.startPrank(account1);
        underlyingToken.approve(address(tested), requestedAmount);
        tested.deposit(requestedAmount);
        tested.requestWithdrawal{value: processingFees}(requestedAmount);
        vm.stopPrank();

        // Assert the request has been created and belongs to account 1
        (address requestAccount, ) = tested.withdrawalQueue(0);
        assertEq(requestAccount, account1);

        // Expect revert when trying to cancel the request from account 2
        vm.expectRevert(bytes("L57"));
        vm.prank(account2);
        tested.cancelWithdrawalRequest(0);
    }

    function testFuzz_cancelWithdrawalRequest_4(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 requestedAmount
    ) public {
        console.log("Should mint back L-Token amount to caller");
        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the LToken one
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APRs
        tested.setAPR(aprUD7x3);

        // Cap requested amount to max withdrawal request amount
        requestedAmount = bound(requestedAmount, 1, type(uint96).max);

        // Deposit and request amount
        deal(address(underlyingToken), account, requestedAmount, true);
        uint256 processingFees = 0.004 ether;
        deal(account, processingFees);

        vm.startPrank(account);
        underlyingToken.approve(address(tested), requestedAmount);
        tested.deposit(requestedAmount);
        tested.requestWithdrawal{value: processingFees}(requestedAmount);
        vm.stopPrank();

        // Assert that account L-Token balance is currently 0
        assertEq(tested.balanceOf(account), 0);

        // Cancel withdrawal request
        vm.prank(account);
        tested.cancelWithdrawalRequest(0);

        // Assert that account has received-back its L-Tokens
        assertEq(tested.balanceOf(account), requestedAmount);
    }

    function testFuzz_cancelWithdrawalRequest_5(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 requestedAmount
    ) public {
        console.log("Should decrease total queued amount accordingly");
        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the LToken one
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APRs
        tested.setAPR(aprUD7x3);

        // Cap requested amount to max withdrawal request amount
        requestedAmount = bound(requestedAmount, 1, type(uint96).max);

        // Deposit and request amount
        deal(address(underlyingToken), account, requestedAmount, true);
        uint256 processingFees = 0.004 ether;
        deal(account, processingFees);

        vm.startPrank(account);
        underlyingToken.approve(address(tested), requestedAmount);
        tested.deposit(requestedAmount);
        tested.requestWithdrawal{value: processingFees}(requestedAmount);
        vm.stopPrank();

        // Assert that total queued is equal to requested amount
        assertEq(tested.totalQueued(), requestedAmount);

        // Cancel withdrawal request
        vm.prank(account);
        tested.cancelWithdrawalRequest(0);

        // Assert that total queued has decreased by the requested amount
        assertEq(tested.totalQueued(), 0);
    }

    function testFuzz_cancelWithdrawalRequest_6(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 requestedAmount
    ) public {
        console.log("Should delete request from queue");
        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the LToken one
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APRs
        tested.setAPR(aprUD7x3);

        // Cap requested amount to max withdrawal request amount
        requestedAmount = bound(requestedAmount, 1, type(uint96).max);

        // Deposit and request amount
        deal(address(underlyingToken), account, requestedAmount, true);
        uint256 processingFees = 0.004 ether;
        deal(account, processingFees);

        vm.startPrank(account);
        underlyingToken.approve(address(tested), requestedAmount);
        tested.deposit(requestedAmount);
        tested.requestWithdrawal{value: processingFees}(requestedAmount);
        vm.stopPrank();

        // Cancel withdrawal request
        vm.prank(account);
        tested.cancelWithdrawalRequest(0);

        // Assert cancelled request is now deleted/empty
        (address requestAccount, uint256 requestAmount) = tested.withdrawalQueue(0);
        assertEq(requestAccount, address(0));
        assertEq(requestAmount, 0);
    }

    // =============================
    // === repatriate() function ===
    function testFuzz_repatriate_1(address account, uint256 requestId) public {
        console.log("Should revert if not called by fund wallet");

        // Ensure the random account is not the fund wallet
        vm.assume(account != fundWallet);

        // Expect revert
        vm.expectRevert(bytes("L40"));
        vm.prank(account);
        tested.repatriate(requestId);
    }

    function testFuzz_repatriate_2(uint256 requestId) public {
        console.log("Should revert if contract is paused");
        globalPause.pause();
        expectRevertPaused();
        vm.prank(fundWallet);
        tested.repatriate(requestId);
    }

    function testFuzz_repatriate_3(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint256 depositedAmount,
        uint256 fundedAmount
    ) public {
        console.log("Should revert if the repatriation makes the retention rate exceeding");
        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the LToken one
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APRs
        tested.setAPR(aprUD7x3);

        // Cap retention rate to 10%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 0, 10 * 10 ** 3));

        // Set random retention rate
        tested.setRetentionRate(retentionRateUD7x3);

        // Cap requested amount to max withdrawal request amount
        depositedAmount = bound(depositedAmount, 2, type(uint96).max);

        // Deposit amount
        deal(address(underlyingToken), account, depositedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        vm.stopPrank();

        // Ensure funded amount is greater than fund wallet balance
        fundedAmount = bound(
            fundedAmount,
            underlyingToken.balanceOf(fundWallet) + 1,
            type(uint256).max
        );

        // Expect revert when trying to fund more than fund wallet balance
        vm.expectRevert(bytes("L58"));
        vm.prank(fundWallet);
        tested.repatriate(fundedAmount);
    }

    function testFuzz_repatriate_4(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint256 depositedAmount,
        uint256 fundedAmount
    ) public {
        console.log("Should revert if the repatriation makes the retention rate exceeding");
        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the LToken one
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APRs
        tested.setAPR(aprUD7x3);

        // Cap retention rate to 10%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 0, 10 * 10 ** 3));

        // Set random retention rate
        tested.setRetentionRate(retentionRateUD7x3);

        // Cap requested amount to max withdrawal request amount
        depositedAmount = bound(depositedAmount, 2, type(uint96).max);

        // Deposit amount
        deal(address(underlyingToken), account, depositedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        vm.stopPrank();

        // Ensure funded amount is lower or equal than fund wallet balance
        fundedAmount = bound(fundedAmount, 1, underlyingToken.balanceOf(fundWallet));

        // If expected new usableUnderlyings amount exceeds expected retained
        if (fundedAmount + tested.usableUnderlyings() > tested.getExpectedRetained()) {
            // Expect revert
            vm.expectRevert(bytes("L59"));
            vm.prank(fundWallet);
            tested.repatriate(fundedAmount);
        }
    }

    function testFuzz_repatriate_5(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint256 depositedAmount,
        uint256 fundedAmount
    ) public {
        console.log("Should properly transfer funds from fund to contract else");
        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the LToken one
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APRs
        tested.setAPR(aprUD7x3);

        // Cap retention rate to 10%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 0, 10 * 10 ** 3));

        // Set random retention rate
        tested.setRetentionRate(retentionRateUD7x3);

        // Cap requested amount to max withdrawal request amount
        depositedAmount = bound(depositedAmount, 1, type(uint96).max);

        // Deposit amount
        deal(address(underlyingToken), account, depositedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        vm.stopPrank();

        // Force retention rate to 100% so it won't be exceeded
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Store old fund wallet and L-token contract underlying balances for later comparison
        uint256 oldFundWalletUnderlyingBalance = underlyingToken.balanceOf(fundWallet);
        uint256 oldLTokenUnderlyingBalance = underlyingToken.balanceOf(address(tested));

        // Ensure funded amount is lower or equal than fund wallet balance
        fundedAmount = bound(fundedAmount, 0, underlyingToken.balanceOf(fundWallet));
        vm.assume(fundedAmount > 0);

        // Fund L-Token contract
        vm.startPrank(fundWallet);
        underlyingToken.approve(address(tested), fundedAmount);
        tested.repatriate(fundedAmount);
        vm.stopPrank();

        // Assert that fund wallet underlying balance has decreased by the funded amount
        assertEq(
            underlyingToken.balanceOf(fundWallet),
            oldFundWalletUnderlyingBalance - fundedAmount
        );

        // Assert that L-Token contract underlying balance has increased by the funded amount
        assertEq(
            underlyingToken.balanceOf(address(tested)),
            oldLTokenUnderlyingBalance + fundedAmount
        );
    }

    function testFuzz_repatriate_6(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint32 retentionRateUD7x3,
        uint256 depositedAmount,
        uint256 fundedAmount
    ) public {
        console.log("Should properly transfer funds from fund to contract else");
        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the LToken one
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APRs
        tested.setAPR(aprUD7x3);

        // Cap retention rate to 10%
        retentionRateUD7x3 = uint32(bound(retentionRateUD7x3, 0, 10 * 10 ** 3));

        // Set random retention rate
        tested.setRetentionRate(retentionRateUD7x3);

        // Cap requested amount to max withdrawal request amount
        depositedAmount = bound(depositedAmount, 1, type(uint96).max);

        // Deposit amount
        deal(address(underlyingToken), account, depositedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        vm.stopPrank();

        // Force retention rate to 100% so it won't be exceeded
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Store old usable underlying amount for later comparison
        uint256 oldUsableUnderlyings = tested.usableUnderlyings();

        // Ensure funded amount is lower or equal than fund wallet balance
        fundedAmount = bound(fundedAmount, 0, underlyingToken.balanceOf(fundWallet));
        vm.assume(fundedAmount > 0);

        // Fund L-Token contract
        vm.startPrank(fundWallet);
        underlyingToken.approve(address(tested), fundedAmount);
        tested.repatriate(fundedAmount);
        vm.stopPrank();

        // Assert that usable underlying amount has increased by the funded amount
        assertEq(tested.usableUnderlyings(), oldUsableUnderlyings + fundedAmount);
    }

    // ============================
    // === claimFees() function ===
    function testFuzz_claimFees_1(address account) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.claimFees();
    }

    function testFuzz_claimFees_2() public {
        console.log("Should revert if there is no unclaimed fees to claim");

        // Expect revert
        vm.expectRevert(bytes("L60"));
        tested.claimFees();
    }

    function testFuzz_claimFees_3(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 depositedAmount
    ) public {
        console.log(
            "Should revert if the contract doesn't hold enough underlyingToken to cover unclaimed fees"
        );

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the LToken one
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APRs
        tested.setAPR(aprUD7x3);

        // Force retention rate to 100% so the contract doesn't need to be funded
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Cap requested amount to max withdrawal request amount
        depositedAmount = bound(depositedAmount, 1, type(uint96).max);

        // Deposit & request amount
        deal(address(underlyingToken), account, depositedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        tested.instantWithdrawal(depositedAmount);
        vm.stopPrank();

        // Burn 1 underlying tokens to ensure the contract doesn't hold enough to cover unclaimed fees
        vm.assume(tested.usableUnderlyings() > 0);
        vm.prank(address(tested));
        underlyingToken.transfer(address(1234), 1);
        tested.tool_rawSetUsableUnderlyings(tested.usableUnderlyings() - 1);

        // Expect revert
        vm.expectRevert(bytes("L61"));
        tested.claimFees();
    }

    function testFuzz_claimFees_4(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 depositedAmount
    ) public {
        console.log("Should properly transfer funds from contract to owner else");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the LToken one
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APRs
        tested.setAPR(aprUD7x3);

        // Force retention rate to 100% so the contract doesn't need to be funded
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Cap requested amount to max withdrawal request amount
        depositedAmount = bound(depositedAmount, 1, type(uint96).max);

        // Deposit & request amount
        deal(address(underlyingToken), account, depositedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        tested.instantWithdrawal(depositedAmount);
        vm.stopPrank();

        // Assume there is something to claim
        uint256 unclaimedFees = tested.unclaimedFees();
        vm.assume(unclaimedFees > 0);

        // Store old owner and contract underlying balances for later comparison
        uint256 oldOwnerUnderlyingBalance = underlyingToken.balanceOf(tested.owner());
        uint256 oldLTokenUnderlyingBalance = underlyingToken.balanceOf(address(tested));

        // Claim fees
        tested.claimFees();

        // Assert that owner underlying balance has increased by the unclaimed fees
        assertEq(
            underlyingToken.balanceOf(tested.owner()),
            oldOwnerUnderlyingBalance + unclaimedFees
        );

        // Assert that L-Token contract underlying balance has decreased by the unclaimed fees
        assertEq(
            underlyingToken.balanceOf(address(tested)),
            oldLTokenUnderlyingBalance - unclaimedFees
        );
    }

    function testFuzz_claimFees_5(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 depositedAmount
    ) public {
        console.log("Should properly reset unclaimedFees to 0");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the LToken one
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APRs
        tested.setAPR(aprUD7x3);

        // Force retention rate to 100% so the contract doesn't need to be funded
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Cap requested amount to max withdrawal request amount
        depositedAmount = bound(depositedAmount, 1, type(uint96).max);

        // Deposit & request amount
        deal(address(underlyingToken), account, depositedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        tested.instantWithdrawal(depositedAmount);
        vm.stopPrank();

        // Assume there is something to claim
        uint256 unclaimedFees = tested.unclaimedFees();
        vm.assume(unclaimedFees > 0);

        // Claim fees
        tested.claimFees();

        // Assert unclaimed fees are now 0
        assertEq(tested.unclaimedFees(), 0);
    }

    function testFuzz_claimFees_6(
        uint8 decimals,
        address account,
        uint16 aprUD7x3,
        uint256 depositedAmount
    ) public {
        console.log("Should properly decrease usableUnderlyings by claimed fees amount");

        // Set random underlying token decimals in [0, 18]
        decimals = uint8(bound(decimals, 0, 18));
        underlyingToken.setDecimals(decimals);

        // Ensure account is neither the zero address nor the LToken one
        vm.assume(account != address(0));
        vm.assume(account != address(tested));

        // Set first random APRs
        tested.setAPR(aprUD7x3);

        // Force retention rate to 100% so the contract doesn't need to be funded
        tested.tool_setRetentionRate(uint32(100 * 10 ** 3));

        // Cap requested amount to max withdrawal request amount
        depositedAmount = bound(depositedAmount, 1, type(uint96).max);

        // Deposit & request amount
        deal(address(underlyingToken), account, depositedAmount, true);
        vm.startPrank(account);
        underlyingToken.approve(address(tested), depositedAmount);
        tested.deposit(depositedAmount);
        tested.instantWithdrawal(depositedAmount);
        vm.stopPrank();

        // Assume there is something to claim
        uint256 unclaimedFees = tested.unclaimedFees();
        vm.assume(unclaimedFees > 0);

        // Store usableUnderlyings for later comparison
        uint256 oldUsableUnderlyings = tested.usableUnderlyings();

        // Claim fees
        tested.claimFees();

        // Assert usableUnderlyings has decreased by the claimed fees
        assertEq(tested.usableUnderlyings(), oldUsableUnderlyings - unclaimedFees);
    }
}
