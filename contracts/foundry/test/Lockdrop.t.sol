// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";
import {GenericERC20} from "../../src/dev/GenericERC20.sol";
import {Lockdrop} from "../../src/Lockdrop.sol";
import {LToken} from "../../src/LToken.sol";
import {GlobalOwner} from "../../src/GlobalOwner.sol";
import {GlobalPause} from "../../src/GlobalPause.sol";
import {GlobalBlacklist} from "../../src/GlobalBlacklist.sol";
import {GenericERC20} from "../../src/dev/GenericERC20.sol";
import {LDYStaking} from "../../src/DummyLDYStaking.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {ModifiersExpectations} from "./_helpers/ModifiersExpectations.sol";

contract Tests is Test, ModifiersExpectations {
    Lockdrop tested;

    GenericERC20 ldyToken;
    GenericERC20 underlyingToken;
    LToken lToken;

    GlobalOwner globalOwner;
    GlobalPause globalPause;
    GlobalBlacklist globalBlacklist;
    LDYStaking ldyStaking;

    uint256 constant DISTRIBUTED_LDY = 10_000_000 * 10 ** 18;
    int256 constant LOCKED_HARD_CAP = 100_000_000_000 * 10 ** 18;
    uint8 constant MIN_LOCK_DURATION = 1;
    uint8 constant MAX_LOCK_DURATION = 255;
    uint8 constant VESTING_DURATION = 12;

    address payable withdrawerWallet = payable(address(bytes20("withdrawerWallet")));
    address payable fundWallet = payable(address(bytes20("fundWallet")));

    function setUp() public {
        // Deploy GenericERC20 (the $LDY token)
        ldyToken = new GenericERC20("Ledgity Token", "LDY", 18);
        vm.label(address(ldyToken), "LDY token");

        // Deploy GenericERC20 (the underlying token)
        underlyingToken = new GenericERC20("Dummy USD", "DUSD", 18);
        vm.label(address(underlyingToken), "Underlying Token");

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

        // Deploy dummy LDYStaking contract
        ldyStaking = new LDYStaking();

        // Deploy the L-Token contract
        LToken impl5 = new LToken();
        ERC1967Proxy proxy5 = new ERC1967Proxy(address(impl5), "");
        lToken = LToken(address(proxy5));
        lToken.initialize(
            address(globalOwner),
            address(globalPause),
            address(globalBlacklist),
            address(ldyStaking),
            address(underlyingToken)
        );
        vm.label(address(lToken), "LToken");

        // Set withdrawer wallet
        lToken.setWithdrawer(withdrawerWallet);

        // Set fund wallet
        lToken.setFund(fundWallet);

        // Deploy the Lockdrop contract
        tested = new Lockdrop(
            address(lToken),
            DISTRIBUTED_LDY,
            LOCKED_HARD_CAP,
            MIN_LOCK_DURATION,
            MAX_LOCK_DURATION,
            VESTING_DURATION
        );
        vm.label(address(ldyToken), "Lockdrop");

        // Set the lockdrop contract as high tier account in LDYStaking contract
        // This prevents it from having to pay for withdrawal fees
        // ldyStaking.setHighTierAccount(address(tested), true);
    }

    // ==================
    // === Invariants ===
    // - Total pool weight should never exceeds max pool weight (when hard cap is set)
    function invariant_1() external {
        if (tested.lockedHardCap() == -1) return;
        uint256 maxPoolWeight = uint256(tested.lockedHardCap()) * tested.maxLockDuration();
        assertLe(tested.totalWeight(), maxPoolWeight);
    }

    // ==============================
    // === constructor() function ===
    function testFuzz_constructor_1(int256 invalidHardCap) public {
        console.log("Should revert if invalid locked hardcap is given");

        // Ensure hard cap is in invalid range [-inf, -1)
        invalidHardCap = bound(invalidHardCap, type(int256).min, -2);

        // Expect revert
        vm.expectRevert(bytes("L71"));
        new Lockdrop(
            address(lToken),
            DISTRIBUTED_LDY,
            invalidHardCap,
            MIN_LOCK_DURATION,
            MAX_LOCK_DURATION,
            VESTING_DURATION
        );
    }

    function test_constructor_2() public {
        console.log("Should revert if minLockDuration is not at least 1 month");

        // Expect revert
        vm.expectRevert(bytes("L72"));
        new Lockdrop(
            address(lToken),
            DISTRIBUTED_LDY,
            LOCKED_HARD_CAP,
            0,
            MAX_LOCK_DURATION,
            VESTING_DURATION
        );
    }

    function testFuzz_constructor_3(uint8 minLockDuration, uint8 maxLockDuration) public {
        console.log("Should revert if minLockDuration is greater than maxLockDuration");

        // Ensure minLockDuration is at least equal to 1
        minLockDuration = uint8(bound(minLockDuration, 1, type(uint8).max));

        // Ensure maxLockDuration is lower than minLockDuration
        maxLockDuration = uint8(bound(maxLockDuration, 0, minLockDuration - 1));

        // Expect revert
        vm.expectRevert(bytes("L73"));
        new Lockdrop(
            address(lToken),
            DISTRIBUTED_LDY,
            LOCKED_HARD_CAP,
            minLockDuration,
            maxLockDuration,
            VESTING_DURATION
        );
    }

    function testFuzz_constructor_4(
        address lTokenAddress,
        uint256 maxDistributedLDY,
        int256 lockedHardCap,
        uint8 minLockDuration,
        uint8 maxLockDuration,
        uint8 vestingDuration
    ) public {
        console.log("Should properly set immutable states else");

        // Ensure hardcap is in valid range [-1, +inf]
        lockedHardCap = bound(lockedHardCap, -1, type(int256).max);

        // Ensure minLockDuration is at least equal to 1
        minLockDuration = uint8(bound(minLockDuration, 1, type(uint8).max));

        // Ensure maxLockDuration is at least equal to minLockDuration
        maxLockDuration = uint8(bound(maxLockDuration, minLockDuration, type(uint8).max));

        // Create a new instance of the Lockdrop contract
        Lockdrop instance = new Lockdrop(
            lTokenAddress,
            maxDistributedLDY,
            lockedHardCap,
            minLockDuration,
            maxLockDuration,
            vestingDuration
        );

        // Assert that the immutable states have been properly set
        assertEq(address(instance.lToken()), lTokenAddress);
        assertEq(instance.maxDistributedLDY(), maxDistributedLDY);
        assertEq(instance.lockedHardCap(), lockedHardCap);
        assertEq(instance.minLockDuration(), minLockDuration);
        assertEq(instance.maxLockDuration(), maxLockDuration);
        assertEq(instance.vestingDuration(), vestingDuration);
    }

    // ==============================
    // === setLDYToken() function ===
    function testFuzz_setLDYToken_1(address account, address ldyTokenAddress) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the owner wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.setLDYToken(ldyTokenAddress);
    }

    function testFuzz_setLDYToken_2(address ldyTokenAddress) public {
        console.log("Should revert if Claim phase has started");

        // Start Claim phase
        // (setting LDY address and ending Deposit phase are required by startClaimPhase())
        tested.setLDYToken(address(ldyToken));
        tested.endDepositPhase();
        tested.startClaimPhase();

        // Expect revert
        vm.expectRevert(bytes("L74"));
        tested.setLDYToken(ldyTokenAddress);
    }

    function testFuzz_setLDYToken_3(address ldyTokenAddress) public {
        console.log("Should properly set LDY token address else");

        // Set LDY token address
        tested.setLDYToken(ldyTokenAddress);

        // Assert that the LDY token address has been properly set
        assertEq(address(tested.ldyToken()), ldyTokenAddress);
    }

    // ==================================
    // === endDepositPhase() function ===
    function test_endDepositPhase_1(address account) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the owner wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.endDepositPhase();
    }

    function test_endDepositPhase_2() public {
        console.log("Should set hasDepositPhaseEnded to true");

        // Trigger end of Deposit phase
        tested.endDepositPhase();

        // Assert that the state has been state to true
        assertEq(tested.hasDepositPhaseEnded(), true);
    }

    // ==================================
    // === startClaimPhase() function ===
    function testFuzz_startClaimPhase_1(address account) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the owner wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.startClaimPhase();
    }

    function test_startClaimPhase_2() public {
        console.log("Should revert if Deposit phase has not ended yet");

        // Expect revert
        vm.expectRevert(bytes("L75"));
        tested.startClaimPhase();
    }

    function test_startClaimPhase_3() public {
        console.log("Should revert if Claim phase has already started");

        // Start Claim phase
        tested.setLDYToken(address(ldyToken));
        tested.endDepositPhase();
        tested.startClaimPhase();

        // Expect revert when trying to start it again
        vm.expectRevert(bytes("L76"));
        tested.startClaimPhase();
    }

    function test_startClaimPhase_4() public {
        console.log("Should revert if LDY token address is unavailable");

        // End Deposit phase
        tested.endDepositPhase();

        // Expect revert because of LDY token address being unavailable
        vm.expectRevert(bytes("L77"));
        tested.startClaimPhase();
    }

    function test_startClaimPhase_5() public {
        console.log("Should properly set hasClaimPhaseStarted to true");

        // Start Claim phase
        tested.setLDYToken(address(ldyToken));
        tested.endDepositPhase();
        tested.startClaimPhase();

        // Assert that the state has been state to true
        assertEq(tested.hasClaimPhaseStarted(), true);
    }

    function test_startClaimPhase_6(uint32 time) public {
        console.log("Should properly set the Claim phase start timestamp");

        // Move forward a random amount of time
        assertEq(block.timestamp, 1);
        skip(time);
        assertEq(block.timestamp, uint256(time) + 1);

        // Start Claim phase
        tested.setLDYToken(address(ldyToken));
        tested.endDepositPhase();
        tested.startClaimPhase();

        // Assert that the state has been state to true
        assertEq(tested.claimPhaseStartTimestamp(), block.timestamp);
    }

    // =====================================
    // === startRecoveryPhase() function ===
    function testFuzz_startRecoveryPhase_1(address account) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the owner wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.startRecoveryPhase();
    }

    function test_startRecoveryPhase_2() public {
        console.log("Should revert if Claim phase has not started yet");

        // Expect revert
        vm.expectRevert(bytes("L79"));
        tested.startRecoveryPhase();
    }

    function testFuzz_startRecoveryPhase_3(uint32 time) public {
        console.log(
            "Should revert if not called at least 3 months after the end of rewards vesting"
        );

        // Start Claim phase
        tested.setLDYToken(address(ldyToken));
        tested.endDepositPhase();
        tested.startClaimPhase();

        // Ensure skipped time is before 3 months after the end of rewards vesting
        uint256 oneMonthInSeconds = 30 * 24 * 60 * 60;
        uint256 threeMonthsInSecond = 3 * oneMonthInSeconds;
        uint256 vestingInSecond = tested.vestingDuration() * oneMonthInSeconds;
        time = uint32(bound(time, 0, vestingInSecond + threeMonthsInSecond));

        // Skip a random amount of time
        assertEq(block.timestamp, 1);
        skip(time);
        assertEq(block.timestamp, 1 + uint256(time));

        // Expect revert
        vm.expectRevert(bytes("L80"));
        tested.startRecoveryPhase();
    }

    function testFuzz_startRecoveryPhase_4(uint32 time) public {
        console.log(
            "Should revert if not called at least 3 months after the end of maxiumum lock end"
        );

        // Start Claim phase
        tested.setLDYToken(address(ldyToken));
        tested.endDepositPhase();
        tested.startClaimPhase();

        // Ensure skipped time is at least 3 months after the end of rewards vesting
        // and before 3 months after the max lock duration end
        uint256 oneMonthInSeconds = 30 * 24 * 60 * 60;
        uint256 threeMonthsInSecond = 3 * oneMonthInSeconds;
        uint256 vestingInSecond = tested.vestingDuration() * oneMonthInSeconds;
        uint256 maxLockInSecond = tested.maxLockDuration() * oneMonthInSeconds;
        time = uint32(
            bound(
                time,
                vestingInSecond + threeMonthsInSecond,
                maxLockInSecond + threeMonthsInSecond
            )
        );

        // Skip a random amount of time
        assertEq(block.timestamp, 1);
        skip(time);
        assertEq(block.timestamp, 1 + uint256(time));

        // Expect revert
        vm.expectRevert(bytes("L81"));
        tested.startRecoveryPhase();
    }

    function testFuzz_startRecoveryPhase_5(uint32 time) public {
        console.log("Should properly set hasRecoveryPhaseStarted to true");

        // Start Claim phase
        tested.setLDYToken(address(ldyToken));
        tested.endDepositPhase();
        tested.startClaimPhase();

        // Ensure skipped time is at least 3 months after the max lock duration end
        uint256 oneMonthInSeconds = 30 * 24 * 60 * 60;
        uint256 threeMonthsInSecond = 3 * oneMonthInSeconds;
        uint256 maxLockInSecond = tested.maxLockDuration() * oneMonthInSeconds;
        time = uint32(bound(time, maxLockInSecond + threeMonthsInSecond, type(uint32).max));

        // Skip a random amount of time
        assertEq(block.timestamp, 1);
        skip(time);
        assertEq(block.timestamp, 1 + uint256(time));

        // Start recovery phase
        tested.startRecoveryPhase();

        // Assert that the state has been state to true
        assertEq(tested.hasRecoveryPhaseStarted(), true);
    }

    // ===============================
    // === recoverERC20() function ===
    function testFuzz_recoverERC20_1(address account) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the owner wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.recoverERC20(address(0), 0);
    }

    function test_recoverERC20_2() public {
        console.log("Should revert if Recovery phase has not started yet");

        // Expect revert
        vm.expectRevert(bytes("L82"));
        tested.recoverERC20(address(0), 0);
    }

    function testFuzz_recoverERC20_3(
        uint32 time,
        uint256 availableAmount,
        uint256 recoveredAmount
    ) public {
        console.log("Should revert if there is not enough tokens to recover");

        // Start Claim phase
        tested.setLDYToken(address(ldyToken));
        tested.endDepositPhase();
        tested.startClaimPhase();

        // Ensure skipped time is at least 3 months after the max lock duration end
        uint256 oneMonthInSeconds = 30 * 24 * 60 * 60;
        uint256 threeMonthsInSecond = 3 * oneMonthInSeconds;
        uint256 maxLockInSecond = tested.maxLockDuration() * oneMonthInSeconds;
        time = uint32(bound(time, maxLockInSecond + threeMonthsInSecond, type(uint32).max));

        // Skip a random amount of time
        assertEq(block.timestamp, 1);
        skip(time);
        assertEq(block.timestamp, 1 + uint256(time));

        // Start recovery phase
        tested.startRecoveryPhase();

        // Ensure available amount is lower than recovered amount
        recoveredAmount = bound(recoveredAmount, 1, type(uint256).max);
        availableAmount = bound(availableAmount, 0, recoveredAmount - 1);

        // Mint available tokens to Lockdrop contract
        deal(address(ldyToken), address(tested), availableAmount, true);

        // Expect revert
        vm.expectRevert(bytes("L83"));
        tested.recoverERC20(address(ldyToken), recoveredAmount);
    }

    function testFuzz_recoverERC20_4(
        uint32 time,
        uint256 availableAmount,
        uint256 recoveredAmount
    ) public {
        console.log("Should properly transfer recovered tokens to owner else");

        // Start Claim phase
        tested.setLDYToken(address(ldyToken));
        tested.endDepositPhase();
        tested.startClaimPhase();

        // Ensure skipped time is at least 3 months after the max lock duration end
        uint256 oneMonthInSeconds = 30 * 24 * 60 * 60;
        uint256 threeMonthsInSecond = 3 * oneMonthInSeconds;
        uint256 maxLockInSecond = tested.maxLockDuration() * oneMonthInSeconds;
        time = uint32(bound(time, maxLockInSecond + threeMonthsInSecond, type(uint32).max));

        // Skip a random amount of time
        assertEq(block.timestamp, 1);
        skip(time);
        assertEq(block.timestamp, 1 + uint256(time));

        // Start recovery phase
        tested.startRecoveryPhase();

        // Ensure available amount is greater or equal to recovered amount
        availableAmount = bound(availableAmount, 0, type(uint256).max);
        recoveredAmount = bound(recoveredAmount, 0, availableAmount);

        // Mint available tokens to Lockdrop contract
        deal(address(ldyToken), address(tested), availableAmount, true);

        // Assert current balances of Lockdrop contract and owner
        assertEq(ldyToken.balanceOf(address(tested)), availableAmount);
        assertEq(ldyToken.balanceOf(address(this)), 0);

        // Recover ERC20 tokens
        tested.recoverERC20(address(ldyToken), recoveredAmount);

        // Assert that the recovered amount has been properly transfered to owner
        assertEq(ldyToken.balanceOf(address(tested)), availableAmount - recoveredAmount);
        assertEq(ldyToken.balanceOf(address(this)), recoveredAmount);
    }

    // ============================
    // === refWeight() function ===
    function test_refWeight_1(
        address lTokenAddress,
        uint256 maxDistributedLDY,
        int256 lockedHardCap,
        uint8 minLockDuration,
        uint8 maxLockDuration,
        uint8 vestingDuration
    ) public {
        console.log("Should return max weight if lockedHardCap is set");

        // Ensure minLockDuration is at least equal to 1
        minLockDuration = uint8(bound(minLockDuration, 1, type(uint8).max));

        // Ensure maxLockDuration is at least equal to minLockDuration
        maxLockDuration = uint8(bound(maxLockDuration, minLockDuration, type(uint8).max));

        // Ensure hardcap is in active range (-1, +inf]
        // Dividing by maxLockDuration prevents overflow
        lockedHardCap = bound(
            lockedHardCap,
            0,
            type(int256).max / int256(uint256(maxLockDuration))
        );

        // Create an instance of Lockdrop contract with an hard cap
        Lockdrop instance = new Lockdrop(
            lTokenAddress,
            maxDistributedLDY,
            lockedHardCap,
            minLockDuration,
            maxLockDuration,
            vestingDuration
        );

        // Assert that the refWeight is equal to the max weight
        assertEq(instance.refWeight(), uint256(lockedHardCap) * maxLockDuration);
    }

    function test_refWeight_2(
        address locker,
        uint256 maxDistributedLDY,
        uint8 minLockDuration,
        uint8 maxLockDuration,
        uint8 vestingDuration,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should return total weight if lockedHardCap is not set");

        // Ensure minLockDuration is at least equal to 1
        minLockDuration = uint8(bound(minLockDuration, 1, type(uint8).max));

        // Ensure maxLockDuration is at least equal to minLockDuration
        maxLockDuration = uint8(bound(maxLockDuration, minLockDuration, type(uint8).max));

        // Create an instance of Lockdrop contract without hard cap
        Lockdrop instance = new Lockdrop(
            address(lToken),
            maxDistributedLDY,
            -1,
            minLockDuration,
            maxLockDuration,
            vestingDuration
        );

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure locked duration is in bounds
        lockDuration = uint8(bound(lockDuration, minLockDuration, maxLockDuration));

        // Cap locked amount to 100T (prevents overflow)
        lockAmount = uint240(bound(lockAmount, 0, 100_000_000_000_000 * 10 ** lToken.decimals()));

        // Randomly lock some amount for a random duration
        deal(address(underlyingToken), locker, lockAmount, true);
        vm.startPrank(locker);
        underlyingToken.approve(address(instance), lockAmount);
        instance.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Assert that the refWeight is equal to the max weight
        assertEq(instance.refWeight(), lockAmount * lockDuration);
    }

    // ====================================
    // === eligibleRewardsOf() function ===
    function testFuzz_eligibleRewardsOf_1(
        address locker,
        uint256 maxDistributedLDY,
        int256 lockedHardCap,
        uint8 minLockDuration,
        uint8 maxLockDuration,
        uint8 vestingDuration,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should properly apply locker's weight");

        // Ensure locked hardcap is in valid range [-1, +inf]
        lockedHardCap = bound(
            lockedHardCap,
            -1,
            int256(100_000_000_000_000 * 10 ** lToken.decimals())
        );

        // Ensure minLockDuration is at least equal to 1
        minLockDuration = uint8(bound(minLockDuration, 1, type(uint8).max));

        // Ensure maxLockDuration is at least equal to minLockDuration
        maxLockDuration = uint8(bound(maxLockDuration, minLockDuration, type(uint8).max));

        // Ensure max distributed LDY is greater than 1 LDY
        maxDistributedLDY = bound(maxDistributedLDY, 1 * 10 ** 18, 10_000_000 * 10 ** 18);

        // Create an instance of Lockdrop contract without hard cap
        Lockdrop instance = new Lockdrop(
            address(lToken),
            maxDistributedLDY,
            lockedHardCap,
            minLockDuration,
            maxLockDuration,
            vestingDuration
        );

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure locked duration is in bounds
        lockDuration = uint8(bound(lockDuration, minLockDuration, maxLockDuration));

        // Cap locked amount to 100T (prevents overflow)
        lockAmount = uint240(
            bound(
                lockAmount,
                0,
                // Ensure locked amount doesn't exceeds hardcap (if one is set)
                lockedHardCap < 0
                    ? 100_000_000_000_000 * 10 ** lToken.decimals()
                    : uint256(lockedHardCap)
            )
        );

        // Randomly lock some amount for a random duration
        deal(address(underlyingToken), locker, lockAmount, true);
        vm.startPrank(locker);
        underlyingToken.approve(address(instance), lockAmount);
        instance.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Retrive eligible rewards of locker
        uint256 eligibleRewards = instance.eligibleRewardsOf(locker);

        if (instance.refWeight() > 0) {
            // Compute locker weight from rewards, distributed LDY and refWeight()
            uint256 appliedLockerWeight = (instance.refWeight() * eligibleRewards) /
                maxDistributedLDY;

            // Compute real locker weight
            uint256 expectedLockerWeight = lockAmount * lockDuration;

            // Compute difference between applied locker weight and expected one
            uint256 weightDiff = appliedLockerWeight > expectedLockerWeight
                ? appliedLockerWeight - expectedLockerWeight
                : expectedLockerWeight - appliedLockerWeight;

            // Assert that the difference is lower than 1 underlying token locked for 1 month
            assertLt(weightDiff, 1 * 10 ** lToken.decimals());

            // Assert that applied weight is in any case lower or equal to expected one
            assertLe(appliedLockerWeight, expectedLockerWeight);
        }
    }

    function test_eligibleRewardsOf_2(
        address locker,
        uint256 maxDistributedLDY,
        int256 lockedHardCap,
        uint8 minLockDuration,
        uint8 maxLockDuration,
        uint8 vestingDuration,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should properly apply refWeight");

        // Ensure locked hardcap is in valid range [-1, +inf]
        lockedHardCap = bound(
            lockedHardCap,
            -1,
            int256(100_000_000_000_000 * 10 ** lToken.decimals())
        );

        // Ensure minLockDuration is at least equal to 1
        minLockDuration = uint8(bound(minLockDuration, 1, type(uint8).max));

        // Ensure maxLockDuration is at least equal to minLockDuration
        maxLockDuration = uint8(bound(maxLockDuration, minLockDuration, type(uint8).max));

        // Ensure max distributed LDY is greater than 1 LDY
        maxDistributedLDY = bound(maxDistributedLDY, 1 * 10 ** 18, 10_000_000 * 10 ** 18);

        // Create an instance of Lockdrop contract without hard cap
        Lockdrop instance = new Lockdrop(
            address(lToken),
            maxDistributedLDY,
            lockedHardCap,
            minLockDuration,
            maxLockDuration,
            vestingDuration
        );

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure locked duration is in bounds
        lockDuration = uint8(bound(lockDuration, minLockDuration, maxLockDuration));

        // Cap locked amount to 100T (prevents overflow)
        lockAmount = uint240(
            bound(
                lockAmount,
                lockedHardCap > -1 && uint256(lockedHardCap) < 1 * 10 ** lToken.decimals()
                    ? uint256(lockedHardCap)
                    : 1 * 10 ** lToken.decimals(),
                // Ensure locked amount doesn't exceeds hardcap (if one is set)
                lockedHardCap < 0
                    ? 100_000_000_000_000 * 10 ** lToken.decimals()
                    : uint256(lockedHardCap)
            )
        );

        // Randomly lock some amount for a random duration
        deal(address(underlyingToken), locker, lockAmount, true);
        vm.startPrank(locker);
        underlyingToken.approve(address(instance), lockAmount);
        instance.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Retrive eligible rewards of locker
        uint256 eligibleRewards = instance.eligibleRewardsOf(locker);

        if (eligibleRewards > 0) {
            // Compute refWeight from rewards, distributed LDY and locker weight
            uint256 lockWeight = lockAmount * lockDuration;
            uint256 appliedRefWeight = (maxDistributedLDY * lockWeight) / eligibleRewards;

            // Compute difference between applied locker weight and expected one
            uint256 weightDiff = appliedRefWeight > instance.refWeight()
                ? appliedRefWeight - instance.refWeight()
                : instance.refWeight() - appliedRefWeight;

            // Assert that the difference is lower than 1% of expected refWeight
            assertLe(weightDiff, instance.refWeight() / 100);

            // Assert that applied weight is in any case greater or equal to expected one
            assertGe(appliedRefWeight, instance.refWeight());
        }
    }

    function testFuzz_eligibleRewardsOf_3(
        address locker,
        uint256 maxDistributedLDY,
        int256 lockedHardCap,
        uint8 minLockDuration,
        uint8 maxLockDuration,
        uint8 vestingDuration,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should properly apply maxDistributedLDY");

        // Ensure locked hardcap is in valid range [-1, +inf]
        lockedHardCap = bound(
            lockedHardCap,
            -1,
            int256(100_000_000_000_000 * 10 ** lToken.decimals())
        );

        // Ensure minLockDuration is at least equal to 1
        minLockDuration = uint8(bound(minLockDuration, 1, type(uint8).max));

        // Ensure maxLockDuration is at least equal to minLockDuration
        maxLockDuration = uint8(bound(maxLockDuration, minLockDuration, type(uint8).max));

        // Ensure max distributed LDY is greater than 1 LDY
        maxDistributedLDY = bound(maxDistributedLDY, 1 * 10 ** 18, 10_000_000 * 10 ** 18);

        // Create an instance of Lockdrop contract without hard cap
        Lockdrop instance = new Lockdrop(
            address(lToken),
            maxDistributedLDY,
            lockedHardCap,
            minLockDuration,
            maxLockDuration,
            vestingDuration
        );

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure locked duration is in bounds
        lockDuration = uint8(bound(lockDuration, minLockDuration, maxLockDuration));

        // Cap locked amount to 100T (prevents overflow)
        lockAmount = uint240(
            bound(
                lockAmount,
                lockedHardCap > -1 && uint256(lockedHardCap) < 1 * 10 ** lToken.decimals()
                    ? uint256(lockedHardCap)
                    : 1 * 10 ** lToken.decimals(),
                // Ensure locked amount doesn't exceeds hardcap (if one is set)
                lockedHardCap < 0
                    ? 100_000_000_000_000 * 10 ** lToken.decimals()
                    : uint256(lockedHardCap)
            )
        );

        // Randomly lock some amount for a random duration
        deal(address(underlyingToken), locker, lockAmount, true);
        vm.startPrank(locker);
        underlyingToken.approve(address(instance), lockAmount);
        instance.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Retrive eligible rewards of locker
        uint256 eligibleRewards = instance.eligibleRewardsOf(locker);

        if (instance.refWeight() > 0) {
            // Compute maxDistributedLDY from rewards, refWeight and locker weight
            uint256 lockWeight = lockAmount * lockDuration;
            uint256 appliedMaxDistributedLDY = (eligibleRewards * instance.refWeight()) /
                lockWeight;

            // Compute difference between applied max ditributed LDY amount and expected one
            uint256 weightDiff = appliedMaxDistributedLDY > instance.maxDistributedLDY()
                ? appliedMaxDistributedLDY - instance.maxDistributedLDY()
                : instance.maxDistributedLDY() - appliedMaxDistributedLDY;

            // Assert that the difference is lower than 1% of expected max distributed LDY
            assertLe(weightDiff, instance.maxDistributedLDY() / 100);

            // Assert that applied max distributed LDY is in any case lower or equal to expected one
            assertLe(appliedMaxDistributedLDY, instance.maxDistributedLDY());
        }
    }

    // // =======================
    // // === lock() function ===
    // function test_lock_1() public {
    //     console.log("Should revert if contract is paused");
    // }

    // function test_lock_2() public {
    //     console.log("Should revert if Deposit phase is over");
    // }

    // function test_lock_3() public {
    //     console.log("Should revert if lock duration is out of bound");
    // }

    // function test_lock_4() public {
    //     console.log("Should revert if account hasn't enough underlying tokens");
    // }

    // function test_lock_5() public {
    //     console.log("Should increase lock's amount by the locked amount");
    // }

    // function test_lock_6() public {
    //     console.log("Should increase the total locked amount by the locked amount");
    // }

    // function test_lock_7() public {
    //     console.log("Should apply new duration if greater than current one");

    //     // assertEq(duration, newDuration)
    //     // assertEq(lockEnd, newLockEnd)
    // }

    // function test_lock_8() public {
    //     console.log("Should apply new duration if greater than current one");
    // }

    // function test_lock_9() public {
    //     console.log("Should properly set weight on initial lock");
    // }

    // function test_lock_10() public {
    //     console.log("Should properly set weight on subsquent lock if amount has increased");
    // }

    // function test_lock_11() public {
    //     console.log("Should properly set weight on subsquent lock if duration has decreased");
    // }

    // function test_lock_12() public {
    //     console.log(
    //         "Should properly set weight on subsquent lock if both amount and duration have increased"
    //     );
    // }

    // function test_lock_13() public {
    //     console.log("Should deposit amount to L-Token contract if amount > 0");
    //     // Assert contract L-Tokens balance has increased by amount
    //     // Assert account underlying balance has decreased by amount
    //     // Assert L-Token contract total supply has increased by amount
    // }

    // // ================================
    // // === instantUnlock() function ===
    // function test_instantUnlock_1() public {
    //     console.log("Should revert if contract is paused");
    // }

    // function test_instantUnlock_2() public {
    //     console.log("Should revert if Deposit phase has not ended yet");
    // }

    // function test_instantUnlock_3() public {
    //     console.log("Should revert if account's lock has not ended yet");
    // }

    // function test_instantUnlock_4() public {
    //     console.log("Should revert if account has already unlocked");
    // }

    // function test_instantUnlock_5() public {
    //     console.log("Should revert account has nothing to unlock");
    // }

    // function test_instantUnlock_6() public {
    //     console.log("Should set account's hasUnlocked to true");
    // }

    // function test_instantUnlock_7() public {
    //     console.log(
    //         "Should revert if L-Token doesn't hold enough underlying tokens to cover the request (without considering already queued amount because Lockdrop contract is elligible to tier 2)"
    //     );
    // }

    // function test_instantUnlock_8() public {
    //     console.log("Should withdraw needed underlying amount from L-Token contract");
    //     // Assert contract L-Tokens balance has decreased by amount
    //     // Assert L-Token contract total supply has decreased by amount
    // }

    // function test_instantUnlock_9() public {
    //     console.log("Should transfer unlocked underlying tokens to locker");
    // }

    // // ================================
    // // === requestUnlock() function ===
    // function test_requestUnlock_1() public {
    //     console.log("Should revert if contract is paused");
    // }

    // function test_requestUnlock_2() public {
    //     console.log("Should revert if Deposit phase has not ended yet");
    // }

    // function test_requestUnlock_3() public {
    //     console.log("Should revert if account's lock has not ended yet");
    // }

    // function test_requestUnlock_4() public {
    //     console.log("Should revert if account has already unlocked");
    // }

    // function test_requestUnlock_5() public {
    //     console.log("Should revert account has nothing to unlock");
    // }

    // function test_requestUnlock_6() public {
    //     console.log("Should set account's hasUnlocked to true");
    // }

    // function test_requestUnlock_7() public {
    //     console.log("Should append locker's address to unlock requests queue");
    // }

    // function test_requestUnlock_8() public {
    //     console.log("Should revert if not enough processing fees are attached");
    // }

    // function test_requestUnlock_9() public {
    //     console.log("Should revert if too much processing fees are attached");
    // }

    // function test_requestUnlock_10() public {
    //     console.log("Should create a withdrawal request on L-Token contract");
    //     // Assert contract L-Tokens balance has decreased by amount
    //     // Assert that request has been appended at the beginning of the L-Token contract queue (because Lockdrop contract is eligible to staking tier 2)
    // }

    // // ========================================
    // // === processUnlockRequests() function ===
    // function testFuzz_processUnlockRequests_1(address account) public {
    //     console.log("Should revert if not called by owner");

    //     // Ensure the random account is not the owner wallet
    //     vm.assume(account != tested.owner());

    //     // Expect revert
    //     expectRevertOnlyOwner();
    //     vm.prank(account);
    //     tested.processUnlockRequests();
    // }

    // function test_processUnlockRequests_2() public {
    //     console.log("Should revert if Claim phase has not started yey");
    // }

    // function test_processUnlockRequests_3() public {
    //     console.log("Shouldn't change any state and silently end if queue is empty");
    // }

    // function test_processUnlockRequests_4() public {
    //     console.log("Should silently skip empty requests (already processed ones)");
    // }

    // function test_processUnlockRequests_5() public {
    //     console.log(
    //         "Shouldn't change any state and hasn't enough fund to cover first next request"
    //     );
    // }

    // function test_processUnlockRequests_6() public {
    //     console.log(
    //         "Should silently return when encoutering a request that cannot be covered anymore"
    //     );
    // }

    // function test_processUnlockRequests_7() public {
    //     console.log("Should delete processed requests from queue");
    // }

    // function test_processUnlockRequests_8() public {
    //     console.log("Should transfer underlying tokens to lockers");
    // }

    // function test_processUnlockRequests_9() public {
    //     console.log("Should properly increase queue cursor to next request to be processed");
    // }

    // function test_processUnlockRequests_10() public {
    //     console.log("Should never revert from out of gas and properly end instead");
    // }

    // // ===================================
    // // === availableToClaim() function ===
    // function test_availableToClaim_1() public {
    //     console.log("Should properly apply elasped time since Claim phase start");
    // }

    // function test_availableToClaim_2() public {
    //     console.log("Should properly apply total eligible rewards of locker");
    // }

    // function test_availableToClaim_3() public {
    //     console.log("Should properly apply vesting duration");
    // }

    // function test_availableToClaim_4() public {
    //     console.log("Should properly consider already claimed rewards");
    // }

    // // ===============================
    // // === claimRewards() function ===
    // function test_claimRewards_1() public {
    //     console.log("Should revert if contract is paused");
    // }

    // function test_claimRewards_2() public {
    //     console.log("Should revert if Claim phase has not started yet");
    // }

    // function test_claimRewards_3() public {
    //     console.log("Should increase account's claimed rewards by the claimed amount");
    // }

    // function test_claimRewards_4() public {
    //     console.log("Should transfer claimed rewards to locker");
    // }
}
