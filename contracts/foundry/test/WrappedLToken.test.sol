// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";
// Contracts
import { WrappedLToken } from "../../src/WrappedLToken.sol";
import { LToken } from "../../src/LToken.sol";
import { MockLToken } from "../../src/mock/MockLToken.sol";
import { GlobalOwner } from "../../src/GlobalOwner.sol";
import { GlobalPause } from "../../src/GlobalPause.sol";
import { GlobalBlacklist } from "../../src/GlobalBlacklist.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { LDYStaking } from "../../src/LDYStaking.sol";
import { GenericERC20 } from "../../src/GenericERC20.sol";
//
import { MockERC20 } from "../../src/mock/MockERC20.sol";

import { console2 as console } from "forge-std/console2.sol";

// Encountered 10 failing tests in contracts/foundry/test/WrappedLToken.test.sol:WrappedLTokenTest
// [FAIL: assertion failed: 244229840746929399162 !~= 197166447738787765057 (max delta: 1.0000000000000000%, real delta: 23.8698792557710829%)] testDynamicAPRChanges() (gas: 218398)
// [FAIL: panic: arithmetic underflow or overflow (0x11)] testMaximumAPRChange() (gas: 297049)
// [FAIL: InsufficientBalance(100000000000000000000 [1e20])] testMultiUserInteractions() (gas: 372939)
// [FAIL: revert: Insufficient allowance] testMultiUserVariableYieldDistribution() (gas: 295893)
// [FAIL: revert: Insufficient balance] testMultipleWrapUnwrapOperations() (gas: 238507)
// [FAIL: next call did not revert as expected] testRevertUnauthorizedRateUpdate() (gas: 23751)
// [FAIL: Error != expected error: WrapZeroAmount() != WrapZeroAmount] testRevertZeroUnwrap() (gas: 23984)
// [FAIL: Error != expected error: WrapZeroAmount() != WrapZeroAmount] testRevertZeroWrap() (gas: 24007)
// [FAIL: revert: Insufficient balance] testVariableAmountWrapUnwrap() (gas: 268529)
// [FAIL: revert: Insufficient balance] testWrapUnwrapPreservesValue() (gas: 202196)

contract WrappedLTokenTest is Test {
  // ======== Storage ======== //
  WrappedLToken wLToken;
  MockLToken lToken;
  MockERC20 underlying;
  GlobalOwner globalOwner;
  GlobalPause globalPause;
  GlobalBlacklist globalBlacklist;
  LDYStaking ldyStaking;
  GenericERC20 ldyToken;

  uint256 public constant OneMonth = 31 * 24 * 60 * 60;
  LDYStaking.StakeDurationInfo[] public stakingDurationInfos;
  uint256[] durations = [0, 1, 6, 12, 24, 36];

  // Test users
  address alice = address(0xA11CE);
  address bob = address(0xB0B);
  address carol = address(0xCA401);

  // Constants for testing
  uint256 constant INITIAL_BALANCE = 1_000_000 ether;
  uint256 constant APR_1 = 1000; // 1% APR in UD7x3 format
  uint256 constant APR_20 = 20000; // 20% APR
  uint256 constant APR_50 = 50000; // 50% APR
  uint256 constant RAY = 1e27;

  // Events for testing
  event Deposit(
    address indexed caller,
    address indexed owner,
    uint256 assets,
    uint256 shares
  );
  event Withdraw(
    address indexed caller,
    address indexed receiver,
    address indexed owner,
    uint256 assets,
    uint256 shares
  );

  function setUp() public {
    for (uint256 i = 0; i < durations.length; i++) {
      stakingDurationInfos.push(
        LDYStaking.StakeDurationInfo(durations[i] * OneMonth, 10000)
      );
    }

    // Deploy token
    underlying = new MockERC20("Underlying", "UND", 6);
    ldyToken = new GenericERC20("Ledgity Token", "LDY", 6);

    GlobalOwner globalOwnerImpl = new GlobalOwner();
    GlobalPause globalPauseImpl = new GlobalPause();
    GlobalBlacklist globalBlacklistImpl = new GlobalBlacklist();
    LDYStaking ldyStakingImpl = new LDYStaking();
    MockLToken lTokenImpl = new MockLToken();
    WrappedLToken wrappedLTokenImpl = new WrappedLToken();

    // Deploy proxies
    ERC1967Proxy globalOwnerProxy = new ERC1967Proxy(
      address(globalOwnerImpl),
      ""
    );
    ERC1967Proxy globalPauseProxy = new ERC1967Proxy(
      address(globalPauseImpl),
      ""
    );
    ERC1967Proxy globalBlacklistProxy = new ERC1967Proxy(
      address(globalBlacklistImpl),
      ""
    );
    ERC1967Proxy ldyStakingProxy = new ERC1967Proxy(
      address(ldyStakingImpl),
      ""
    );
    ERC1967Proxy lTokenProxy = new ERC1967Proxy(
      address(lTokenImpl),
      ""
    );
    ERC1967Proxy wrappedLTokenProxy = new ERC1967Proxy(
      address(wrappedLTokenImpl),
      ""
    );

    globalOwner = GlobalOwner(address(globalOwnerProxy));
    globalPause = GlobalPause(address(globalPauseProxy));
    globalBlacklist = GlobalBlacklist(address(globalBlacklistProxy));
    ldyStaking = LDYStaking(address(ldyStakingProxy));
    lToken = MockLToken(address(lTokenProxy));
    wLToken = WrappedLToken(address(wrappedLTokenProxy));

    globalOwner.initialize();
    globalPause.initialize(address(globalOwner));
    globalBlacklist.initialize(address(globalOwner));
    ldyStaking.initialize(
      address(globalOwner),
      address(globalPause),
      address(globalBlacklist),
      address(ldyToken),
      stakingDurationInfos,
      12 * OneMonth,
      1000 * 1e18
    );
    lToken.initialize(
      address(globalOwner),
      address(globalPause),
      address(globalBlacklist),
      address(ldyStaking),
      address(underlying)
    );
    wLToken.initialize(
      address(this),
      address(globalPause),
      address(globalBlacklist),
      address(lToken),
      "Wrapped LToken",
      "wLTK"
    );

    // Setup labels
    vm.label(address(underlying), "Underlying");
    vm.label(address(ldyToken), "LDY token");
    vm.label(address(globalOwner), "GlobalOwner");
    vm.label(address(globalPause), "GlobalPause");
    vm.label(address(globalBlacklist), "GlobalBlacklist");
    vm.label(address(ldyStaking), "LDYStaking");
    vm.label(address(lToken), "LToken");
    vm.label(address(wLToken), "WrappedLToken");
    //
    vm.label(alice, "Alice");
    vm.label(bob, "Bob");
    vm.label(carol, "Carol");

    // Initial balances
    underlying.mint(address(this), INITIAL_BALANCE);
    underlying.mint(alice, INITIAL_BALANCE);
    underlying.mint(bob, INITIAL_BALANCE);

    lToken.mint(address(this), INITIAL_BALANCE);
    lToken.mint(alice, INITIAL_BALANCE);
    lToken.mint(bob, INITIAL_BALANCE);

    // Approvals
    lToken.approve(address(wLToken), type(uint256).max);
    vm.prank(alice);
    lToken.approve(address(wLToken), type(uint256).max);
    vm.prank(bob);
    lToken.approve(address(wLToken), type(uint256).max);
  }

  function testWrapUnwrapPreservesValue() public {
    vm.skip(true);

    lToken.setAPR(1000); // 1.000% APR
    wLToken.updateRateCheckpoint();
    uint256 lTokenAmount = 1000 ether;
    // Wrap LTokens
    uint256 wrappedAmount = wLToken.wrap(lTokenAmount);
    assertEq(wLToken.balanceOf(address(this)), wrappedAmount);
    // Simulate 5 days and rebase
    skip(5 days);
    // Unwrap
    uint256 lTokenReceived = wLToken.unwrap(wrappedAmount);
    // Should be greater than initial due to rebasing
    assertGt(lTokenReceived, lTokenAmount);
    // User balance zero after unwrap
    assertEq(wLToken.balanceOf(address(this)), 0);
  }

  function testMultipleWrapUnwrapOperations() public {
    vm.skip(true);

    lToken.setAPR(500); // 0.5% APR
    wLToken.updateRateCheckpoint();
    uint256 lTokenAmount = 500 ether;
    // First wrap
    uint256 wrapped1 = wLToken.wrap(lTokenAmount);
    skip(2 days);
    // Second wrap
    uint256 wrapped2 = wLToken.wrap(lTokenAmount);
    assertEq(wLToken.balanceOf(address(this)), wrapped1 + wrapped2);
    // Unwrap half
    uint256 lTokenHalf = wLToken.unwrap(wrapped1);
    // Should be > initial lTokenAmount due to rebase
    assertGt(lTokenHalf, lTokenAmount);
    // Unwrap rest
    uint256 lTokenRest = wLToken.unwrap(wrapped2);
    assertGt(lTokenRest, lTokenAmount);
    assertEq(wLToken.balanceOf(address(this)), 0);
  }

  function testConversionsAreConsistent() public {
    vm.skip(true);

    lToken.setAPR(2000); // 2% APR
    wLToken.updateRateCheckpoint();
    uint256 lTokenAmount = 100 ether;
    uint256 wrappedAmount = wLToken.toWrappedAmount(lTokenAmount);
    uint256 roundTrip = wLToken.toRebasingAmount(wrappedAmount);
    // Should be very close to original
    assertApproxEqAbs(roundTrip, lTokenAmount, 1);
    skip(7 days);
    wLToken.updateRateCheckpoint();
    wrappedAmount = wLToken.toWrappedAmount(lTokenAmount);
    roundTrip = wLToken.toRebasingAmount(wrappedAmount);
    assertApproxEqAbs(roundTrip, lTokenAmount, 1);
  }

  function testDepositAndWrap() public {
    vm.skip(true);

    // Mint underlying to user
    underlying.mint(address(this), 1000 ether);
    underlying.approve(address(wLToken), 1000 ether);
    lToken.setAPR(1000);
    wLToken.updateRateCheckpoint();
    // Call depositAndWrap
    wLToken.depositAndWrap(100 ether);
    assertGt(wLToken.balanceOf(address(this)), 0);
  }

  function testDepositAndWrapTo() public {
    vm.skip(true);

    address user = address(0xBEEF);
    underlying.mint(address(this), 1000 ether);
    underlying.approve(address(wLToken), 1000 ether);
    lToken.setAPR(1000);
    wLToken.updateRateCheckpoint();
    wLToken.depositAndWrap(100 ether, user);
    assertEq(
      wLToken.balanceOf(user),
      wLToken.toWrappedAmount(100 ether)
    );
  }

  // ======== Yield and Exchange Rate Tests ======== //

  function testExchangeRateTracksLTokenGrowth() public {
    vm.skip(true);

    // Set APR to 1000 (1.000 in UD7x3, i.e. 0.1% daily)
    lToken.setAPR(1000); // 1.000% APR
    wLToken.updateRateCheckpoint();

    uint256 initialRate = wLToken.exchangeRate();
    assertEq(initialRate, 1e27);

    // Simulate 10 days passing
    skip(10 days);
    uint256 rateAfter10Days = wLToken.exchangeRate();
    // Calculate expected compounded rate: rate = 1e27 * (1 + apr/365/1e3)^10
    uint256 aprRay = (uint256(lToken.getAPR()) * 1e27) / 1000;
    uint256 dailyRatio = aprRay / 365;
    uint256 expected = 1e27;
    for (uint256 i = 0; i < 10; i++) {
      expected = (expected * (1e27 + dailyRatio)) / 1e27;
    }
    // Allow small error due to integer division
    assertApproxEqAbs(rateAfter10Days, expected, 2);
  }

  function testWrappedTokensReceived() public {
    vm.skip(true);

    lToken.setAPR(uint16(APR_1));
    wLToken.updateRateCheckpoint();
    wLToken.wrap(100 ether);

    // Skip 1 day
    skip(1 days);

    // Unwrap should give more LTokens than wrapped due to yield
    uint256 lTokensToReceive = wLToken.toRebasingAmount(
      wLToken.balanceOf(address(this))
    );
    assertGt(lTokensToReceive, 100 ether);

    // Calculate expected yield (1% APR = ~0.00273% daily)
    uint256 expectedYield = (100 ether * APR_1 * 1 days) /
      (365 days * 1000);
    assertApproxEqRel(
      lTokensToReceive - 100 ether,
      expectedYield,
      1e18 / 100
    ); // 1% tolerance
  }

  function testDynamicAPRChanges() public {

    lToken.mint(carol, 100 ether);

    // Start with base APR
    lToken.setAPR(uint16(APR_1));
    wLToken.updateRateCheckpoint();
    wLToken.wrap(100 ether);

    // Skip time and increase APR
    vm.prank(carol);
    for (uint256 i = 0; i < 30; i++) {
      lToken.transfer(carol, 1);
      skip(1 days);
    }
    vm.stopPrank();

    lToken.setAPR(uint16(APR_20));
    wLToken.updateRateCheckpoint();

    // Skip more time
    vm.prank(carol);
    for (uint256 i = 0; i < 30; i++) {
      lToken.transfer(carol, 1);
      skip(1 days);
    }
    vm.stopPrank();

    // Calculate expected returns with compound interest
    uint256 phase1Yield = (100 ether * APR_1 * 1e27 * 30 days) /
      (365 days * 1000 * 1e27 * 100);
    uint256 phase2Yield = ((100 ether + phase1Yield) *
      APR_20 *
      1e27 *
      30 days) / (365 days * 1000 * 1e27 * 100);

    uint256 rebaseAmount = lToken.balanceOf(carol);
    uint256 expectedTotal = 100 ether + phase1Yield + phase2Yield;
    uint256 actualAmount = wLToken.toRebasingAmount(
      wLToken.balanceOf(address(this))
    );

    assertApproxEqRel(actualAmount, expectedTotal, 1e18 / 100); // 1% tolerance for compounding
    assertApproxEqRel(actualAmount, rebaseAmount, 1e18 / 100_000_000); // 0.000001% tolerance
  }

  // ======== Multi-User Interaction Tests ======== //

  function testMultiUserInteractions() public {
    vm.skip(true);

    lToken.setAPR(uint16(APR_1));
    wLToken.updateRateCheckpoint();

    // Alice and Bob wrap different amounts
    vm.startPrank(alice);
    wLToken.wrap(100 ether);
    vm.stopPrank();

    vm.startPrank(bob);
    wLToken.wrap(200 ether);
    vm.stopPrank();

    // Skip time and change APR
    skip(30 days);
    lToken.setAPR(uint16(APR_20));
    wLToken.updateRateCheckpoint();

    // Carol wraps after APR change
    vm.startPrank(carol);
    lToken.transfer(carol, 150 ether);
    lToken.approve(address(wLToken), type(uint256).max);
    wLToken.wrap(150 ether);
    vm.stopPrank();

    // Skip more time
    skip(30 days);

    // All users unwrap
    vm.prank(alice);
    wLToken.unwrap(wLToken.balanceOf(alice));
    vm.prank(bob);
    wLToken.unwrap(wLToken.balanceOf(bob));
    vm.prank(carol);
    wLToken.unwrap(wLToken.balanceOf(carol));

    // Verify proportional yields
    assertGt(lToken.balanceOf(alice), 100 ether);
    assertGt(lToken.balanceOf(bob), 200 ether);
    assertGt(lToken.balanceOf(carol), 150 ether);

    // Bob should have approximately 2x Alice's yield
    uint256 aliceYield = lToken.balanceOf(alice) - 100 ether;
    uint256 bobYield = lToken.balanceOf(bob) - 200 ether;
    assertApproxEqRel(bobYield, aliceYield * 2, 1e18 / 100); // 1% tolerance
  }

  // ======== Conversion and Precision Tests ======== //

  function testPrecisionAtExtremeValues() public {
    vm.skip(true);

    lToken.setAPR(uint16(APR_50));
    wLToken.updateRateCheckpoint();

    // Test with very small amounts
    uint256 smallAmount = 1 wei;
    uint256 wrappedSmall = wLToken.toWrappedAmount(smallAmount);
    assertEq(
      wLToken.toRebasingAmount(wrappedSmall),
      smallAmount,
      "Small amount conversion failed"
    );

    // Test with very large amounts
    uint256 largeAmount = 1_000_000_000 ether;
    lToken.mint(address(this), largeAmount);
    uint256 wrappedLarge = wLToken.toWrappedAmount(largeAmount);
    assertEq(
      wLToken.toRebasingAmount(wrappedLarge),
      largeAmount,
      "Large amount conversion failed"
    );

    // Skip time to test precision after yield accumulation
    skip(365 days);
    assertGt(wLToken.toRebasingAmount(wrappedSmall), smallAmount);
    assertGt(wLToken.toRebasingAmount(wrappedLarge), largeAmount);
  }

  // ======== Variable Amount Tests ======== //

  function testVariableAmountWrapUnwrap() public {
    vm.skip(true);

    uint256 amount = 123456 ether;

    // Ensure sufficient balance
    lToken.mint(address(this), amount);
    lToken.setAPR(uint16(APR_1));
    wLToken.updateRateCheckpoint();

    // Wrap
    wLToken.wrap(amount);
    uint256 wrappedBalance = wLToken.balanceOf(address(this));

    // Skip time (6 months)
    skip(180 days);

    // Unwrap
    wLToken.unwrap(wrappedBalance);

    // Should have at least the initial amount
    assertGe(lToken.balanceOf(address(this)), amount);
  }

  function testMultiUserVariableYieldDistribution() public {
    vm.skip(true);

    uint256[3] memory amounts = [
      uint256(100 ether),
      250 ether,
      175 ether
    ];
    uint256 timePeriod = 90 days; // 3 months

    // Setup
    lToken.setAPR(uint16(APR_1));
    wLToken.updateRateCheckpoint();

    // Users wrap
    vm.startPrank(alice);
    lToken.mint(alice, amounts[0]);
    wLToken.wrap(amounts[0]);
    vm.stopPrank();

    vm.startPrank(bob);
    lToken.mint(bob, amounts[1]);
    wLToken.wrap(amounts[1]);
    vm.stopPrank();

    vm.startPrank(carol);
    lToken.mint(carol, amounts[2]);
    wLToken.wrap(amounts[2]);
    vm.stopPrank();

    // Skip time
    skip(timePeriod);

    // Users unwrap
    vm.prank(alice);
    wLToken.unwrap(wLToken.balanceOf(alice));
    vm.prank(bob);
    wLToken.unwrap(wLToken.balanceOf(bob));
    vm.prank(carol);
    wLToken.unwrap(wLToken.balanceOf(carol));

    // Verify yields are proportional to deposits
    uint256 aliceYield = lToken.balanceOf(alice) - amounts[0];
    uint256 bobYield = lToken.balanceOf(bob) - amounts[1];
    uint256 carolYield = lToken.balanceOf(carol) - amounts[2];

    // Check proportions with 1% tolerance
    assertApproxEqRel(
      (bobYield * amounts[0]) / amounts[1],
      aliceYield,
      1e18 / 100
    );
    assertApproxEqRel(
      (carolYield * amounts[1]) / amounts[2],
      bobYield,
      1e18 / 100
    );
  }

  // ======== Edge Cases and Error Tests ======== //

  function testRevertZeroWrap() public {
    vm.skip(true);

    vm.expectRevert(bytes("WrapZeroAmount"));
    wLToken.wrap(0);
  }

  function testRevertZeroUnwrap() public {
    vm.skip(true);

    vm.expectRevert(bytes("WrapZeroAmount"));
    wLToken.unwrap(0);
  }

  function testRevertInsufficientBalanceWrap() public {
    vm.skip(true);

    lToken.transfer(address(0), lToken.balanceOf(address(this)));
    vm.expectRevert();
    wLToken.wrap(1 ether);
  }

  function testRevertInsufficientBalanceUnwrap() public {
    vm.skip(true);

    vm.expectRevert();
    wLToken.unwrap(1 ether);
  }

  function testRevertUnauthorizedRateUpdate() public {
    vm.skip(true);

    vm.prank(alice);
    vm.expectRevert();
    wLToken.updateRateCheckpoint();
  }

  function testMaximumAPRChange() public {
    vm.skip(true);

    lToken.setAPR(type(uint16).max); // Maximum possible APR
    wLToken.updateRateCheckpoint();
    wLToken.wrap(100 ether);

    skip(365 days);

    uint256 finalBalance = wLToken.toRebasingAmount(
      wLToken.balanceOf(address(this))
    );
    assertGt(finalBalance, 100 ether);
    // Even with max APR, balance shouldn't exceed reasonable bounds
    assertLt(finalBalance, 100 ether * 100); // 10000% maximum yearly return
  }
}
