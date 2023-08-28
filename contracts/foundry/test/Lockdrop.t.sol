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

contract TestedLToken is LToken {
    /**
     * @dev Uncapped setter for the retention rate
     */
    function tool_setRetentionRate(uint32 _retentionRateUD7x3) public {
        retentionRateUD7x3 = _retentionRateUD7x3;
    }
}

contract Tests is Test, ModifiersExpectations {
    Lockdrop tested;

    GenericERC20 ldyToken;
    GenericERC20 underlyingToken;
    TestedLToken lToken;

    GlobalOwner globalOwner;
    GlobalPause globalPause;
    GlobalBlacklist globalBlacklist;
    LDYStaking ldyStaking;

    uint256 constant DISTRIBUTED_LDY = 10_000_000 * 10 ** 18;
    int256 constant LOCKED_HARD_CAP = int256(uint256(type(uint96).max)); // Max withdrawal request amount (~100T)
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
        TestedLToken impl5 = new TestedLToken();
        ERC1967Proxy proxy5 = new ERC1967Proxy(address(impl5), "");
        lToken = TestedLToken(address(proxy5));
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
        ldyStaking.setHighTierAccount(address(tested), true);
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
            address(lToken),
            maxDistributedLDY,
            lockedHardCap,
            minLockDuration,
            maxLockDuration,
            vestingDuration
        );

        // Assert that the immutable states have been properly set
        assertEq(address(instance.lToken()), address(lToken));
        assertEq(address(instance.underlyingToken()), address(underlyingToken));
        assertEq(address(instance.underlyingToken()), address(instance.lToken().underlying()));
        assertEq(instance.maxDistributedLDY(), maxDistributedLDY);
        assertEq(instance.lockedHardCap(), lockedHardCap);
        assertEq(instance.minLockDuration(), minLockDuration);
        assertEq(instance.maxLockDuration(), maxLockDuration);
        assertEq(instance.vestingDuration(), vestingDuration);
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
            address(lToken),
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

            // Assert that the difference is lower than 2% of expected refWeight
            assertLe(weightDiff, instance.refWeight() / 50);

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
            assertLe(weightDiff, instance.maxDistributedLDY() / 50);

            // Assert that applied max distributed LDY is in any case lower or equal to expected one
            assertLe(appliedMaxDistributedLDY, instance.maxDistributedLDY());
        }
    }

    // =======================
    // === lock() function ===
    function test_lock_1() public {
        console.log("Should revert if contract is paused");
        tested.pause();
        expectRevertPaused();
        tested.lock(0, 0);
    }

    function testFuzz_lock_2(uint256 amount, uint8 duration) public {
        console.log("Should revert if Deposit phase is over");

        // End Deposit phase
        tested.endDepositPhase();

        // Expect revert
        vm.expectRevert(bytes("L84"));
        tested.lock(amount, duration);
    }

    function testFuzz_lock_3(
        uint8 minLockDuration,
        uint8 maxLockDuration,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should revert if lock duration is out of bound");

        // Ensure minLockDuration is at least equal to 1
        minLockDuration = uint8(bound(minLockDuration, 1, type(uint8).max));

        // Ensure maxLockDuration is at least equal to minLockDuration
        maxLockDuration = uint8(bound(maxLockDuration, minLockDuration, type(uint8).max));

        // Ensure lockDuration is out of bound
        vm.assume(lockDuration < minLockDuration || lockDuration > maxLockDuration);

        // Create an instance of Lockdrop contract
        Lockdrop instance = new Lockdrop(
            address(lToken),
            DISTRIBUTED_LDY,
            LOCKED_HARD_CAP,
            minLockDuration,
            maxLockDuration,
            VESTING_DURATION
        );

        // Expect revert
        vm.expectRevert(bytes("L85"));
        instance.lock(lockAmount, lockDuration);
    }

    function testFuzz_lock_4(int256 lockedHardCap, uint240 lockAmount, uint8 lockDuration) public {
        console.log("Should revert if deposited amount makes exceeding the hardcap");

        // Ensure locked amount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, type(uint240).max));

        // Ensure locked hardcap lower than locked amount
        lockedHardCap = bound(lockedHardCap, 0, int256(uint256(lockAmount - 1)));

        // Ensure lock duration is at least equal to 1
        vm.assume(lockDuration > 0);

        // Create an instance of Lockdrop contract
        Lockdrop instance = new Lockdrop(
            address(lToken),
            DISTRIBUTED_LDY,
            lockedHardCap,
            MIN_LOCK_DURATION,
            MAX_LOCK_DURATION,
            VESTING_DURATION
        );

        // Expect revert
        vm.expectRevert(bytes("L86"));
        instance.lock(lockAmount, lockDuration);
    }

    function testFuzz_lock_5(
        address locker,
        uint256 balanceAmount,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should revert if account hasn't enough underlying tokens");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP)));

        // Ensure balanceAmount is lower than lockAmount
        balanceAmount = bound(balanceAmount, 0, uint256(lockAmount - 1));

        // Ensure lock duration is at least equal to 1
        vm.assume(lockDuration > 0);

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, balanceAmount, true);

        // Expect revert
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        vm.expectRevert(bytes("ERC20: transfer amount exceeds balance"));
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();
    }

    function testFuzz_lock_6(address locker, uint240 lockAmount, uint8 lockDuration) public {
        console.log("Should increase lock's amount by the locked amount");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP) / 2));

        // Ensure lock duration is at least equal to 1
        vm.assume(lockDuration > 0);

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount * 2, true);

        // Assert that lock amount of locker is equal to 0
        (uint240 lockedAmountBefore, , , , ) = tested.accountsLocks(locker);
        assertEq(lockedAmountBefore, 0);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Assert that lock amount of locker has increased by lockAmount
        (uint240 lockedAmountAfter1, , , , ) = tested.accountsLocks(locker);
        assertEq(lockedAmountAfter1, lockAmount);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Assert that lock amount of locker has increased by lockAmount
        (uint240 lockedAmountAfter2, , , , ) = tested.accountsLocks(locker);
        assertEq(lockedAmountAfter2, lockAmount * 2);
    }

    function testFuzz_lock_7(address locker, uint240 lockAmount, uint8 lockDuration) public {
        console.log("Should increase the total locked amount by the locked amount");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP) / 2));

        // Ensure lock duration is at least equal to 1
        vm.assume(lockDuration > 0);

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount * 2, true);

        // Assert that total locked amount is equal to 0
        assertEq(tested.totalLocked(), 0);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Assert that total locked amount has increased by lockAmount
        assertEq(tested.totalLocked(), lockAmount);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Assert that total locked amount has increased by lockAmount
        assertEq(tested.totalLocked(), lockAmount * 2);
    }

    function test_lock_8(address locker, uint240 lockAmount, uint8 lockDuration) public {
        console.log("Should apply new duration if greater than current one, else keep current one");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP) / 3));

        // Ensure lock duration is at least equal to 2 and lower than max lock duration
        lockDuration = uint8(bound(lockDuration, 2, MAX_LOCK_DURATION - 1));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount * 3, true);

        // Assert locker lock duration and timestamp are 0
        (, uint8 durationBefore, , , uint40 lockEndBefore) = tested.accountsLocks(locker);
        assertEq(durationBefore, 0);
        assertEq(lockEndBefore, 0);

        // Perform a first lock
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Assert locker lock duration and timestamp have been properly set to first lock duration
        (, uint8 durationAfter1, , , uint40 lockEndAfter1) = tested.accountsLocks(locker);
        assertEq(durationAfter1, lockDuration);
        assertEq(
            lockEndAfter1,
            uint40(block.timestamp + uint256(lockDuration) * 30 * 24 * 60 * 60)
        );

        // Perform a second lock with a lower duration
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration - 1);
        vm.stopPrank();

        // Assert locker lock duration and timestamp have not changed
        (, uint8 durationAfter2, , , uint40 lockEndAfter2) = tested.accountsLocks(locker);
        assertEq(durationAfter2, lockDuration);
        assertEq(lockEndAfter2, lockEndAfter1);

        // Perform a third lock with a greater duration
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration + 1);
        vm.stopPrank();

        // Assert locker lock duration and timestamp have been properly set to third lock duration
        (, uint8 durationAfter3, , , uint40 lockEndAfter3) = tested.accountsLocks(locker);
        assertEq(durationAfter3, lockDuration + 1);
        assertEq(
            lockEndAfter3,
            uint40(block.timestamp + uint256(lockDuration + 1) * 30 * 24 * 60 * 60)
        );
    }

    function testFuzz_lock_9(address locker, uint240 lockAmount, uint8 lockDuration) public {
        console.log("Should properly increase weight on through locks");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP) / 4));

        // Ensure lock duration is at least equal to 1 and 2 lower than max lock duration
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION - 2));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount * 4, true);

        // Assert that total weight is currently equal to 0
        assertEq(tested.totalWeight(), 0);

        // Perform a first lock
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Assert that total weight has increased by lockAmount * lockDuration
        assertEq(tested.totalWeight(), lockAmount * lockDuration);

        // Perform a subsequent lock increasing amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Assert that total weight has increased by lockAmount * lockDuration
        assertEq(tested.totalWeight(), (lockAmount * 2) * lockDuration);

        // Perform a subsequent lock increasing duration
        vm.startPrank(locker);
        tested.lock(0, lockDuration + 1);
        vm.stopPrank();

        // Assert that total weight has increased by lockAmount * lockDuration
        assertEq(tested.totalWeight(), (lockAmount * 2) * (lockDuration + 1));

        // Perform a subsequent lock increasing both
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration + 2);
        vm.stopPrank();

        // Assert that total weight has increased by lockAmount * lockDuration
        assertEq(tested.totalWeight(), (lockAmount * 3) * (lockDuration + 2));
    }

    function testFuzz_lock_10(address locker, uint240 lockAmount, uint8 lockDuration) public {
        console.log("Should deposit amount to L-Token contract if amount > 0");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));
        vm.assume(locker != address(tested));
        vm.assume(locker != address(lToken));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 0, uint256(LOCKED_HARD_CAP)));

        // Ensure lock duration is at least equal to 1 and 2 lower than max lock duration
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION - 2));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Assert current underlying balance of locker is lockAmount
        assertEq(underlyingToken.balanceOf(locker), lockAmount);

        // Assert current L-Token balance of Lockdrop contract is 0
        assertEq(lToken.balanceOf(address(tested)), 0);

        // Assert totalSupply of L-Token contract is 0
        assertEq(lToken.totalSupply(), 0);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Assert current underlying balance of locker is now 0
        assertEq(underlyingToken.balanceOf(locker), 0);

        // Assert current L-Token balance of Lockdrop contract is now lockAmount
        assertEq(lToken.balanceOf(address(tested)), lockAmount);

        // Assert totalSupply of L-Token contract is now lockAmount
        assertEq(lToken.totalSupply(), lockAmount);
    }

    // ================================
    // === instantUnlock() function ===
    function test_instantUnlock_1() public {
        console.log("Should revert if contract is paused");
        tested.pause();
        expectRevertPaused();
        tested.instantUnlock();
    }

    function test_instantUnlock_2() public {
        console.log("Should revert if Deposit phase has not ended yet");

        // Expect revert
        vm.expectRevert(bytes("L67"));
        tested.instantUnlock();
    }

    function testFuzz_instantUnlock_3(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should revert if account's lock has not ended yet");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 0, uint256(LOCKED_HARD_CAP)));

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Expect revert
        vm.expectRevert(bytes("L68"));
        vm.prank(locker);
        tested.instantUnlock();
    }

    function testFuzz_instantUnlock_4(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should revert if account has already unlocked");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP)));

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Force L-Token retention rate to 100% so underlying token are available for instant unlock
        lToken.tool_setRetentionRate(100 * 10 ** 3);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker);
        vm.warp(lockEndTimestamp + 1);

        // Unlock a first time
        vm.prank(locker);
        tested.instantUnlock();

        // Expect revert on second unlock attempt
        vm.expectRevert(bytes("L69"));
        vm.prank(locker);
        tested.instantUnlock();
    }

    function testFuzz_instantUnlock_5(address locker, uint8 lockDuration) public {
        console.log("Should revert if account has nothing to unlock");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Lock amount
        vm.startPrank(locker);
        tested.lock(0, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker);
        vm.warp(lockEndTimestamp + 1);

        // Expect revert
        vm.expectRevert(bytes("L70"));
        vm.prank(locker);
        tested.instantUnlock();
    }

    function testFuzz_instantUnlock_6(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should set account's hasUnlocked to true");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP)));

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Force L-Token retention rate to 100% so underlying token are available for instant unlock
        lToken.tool_setRetentionRate(100 * 10 ** 3);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker);
        vm.warp(lockEndTimestamp + 1);

        // Unlock locked amount
        vm.prank(locker);
        tested.instantUnlock();

        // Assert that account hasUnlocked is true
        (, , bool hasUnlocked, , ) = tested.accountsLocks(locker);
        assertEq(hasUnlocked, true);
    }

    function testFuzz_instantUnlock_7(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log(
            "Should revert if L-Token doesn't hold enough underlying tokens to cover the request (without considering already queued amount because Lockdrop contract is elligible to tier 2)"
        );

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP)));

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker);
        vm.warp(lockEndTimestamp + 1);

        // Except revert for not enough funds on L-Token contract
        vm.expectRevert(bytes("L49"));
        vm.prank(locker);
        tested.instantUnlock();
    }

    function testFuzz_instantUnlock_8(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should withdraw and transfer unlocked underlying tokens to locker");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));
        vm.assume(locker != address(tested));
        vm.assume(locker != address(lToken));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP)));

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Force L-Token retention rate to 100% so underlying token are available for instant unlock
        lToken.tool_setRetentionRate(100 * 10 ** 3);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker);
        vm.warp(lockEndTimestamp + 1);

        // Assert current underlying balance of locker is 0
        assertEq(underlyingToken.balanceOf(locker), 0);

        // Assert current L-Token balance of Lockdrop contract is lockAmount
        assertEq(lToken.balanceOf(address(tested)), lockAmount);

        // Assert totalSupply of L-Token contract is lockAmount
        assertEq(lToken.totalSupply(), lockAmount);

        // Unlock locked amount
        vm.prank(locker);
        tested.instantUnlock();

        // Assert that underlying balance of locker has increased by lockAmount
        assertEq(underlyingToken.balanceOf(locker), lockAmount);

        // Assert that L-Token balance of Lockdrop contract has decreased by lockAmount
        assertEq(lToken.balanceOf(address(tested)), 0);

        // Assert that totalSupply of L-Token contract has decreased by lockAmount
        assertEq(lToken.totalSupply(), 0);
    }

    // ================================
    // === requestUnlock() function ===
    function test_requestUnlock_1() public {
        console.log("Should revert if contract is paused");
        tested.pause();
        expectRevertPaused();
        tested.requestUnlock();
    }

    function test_requestUnlock_2() public {
        console.log("Should revert if Deposit phase has not ended yet");

        // Expect revert
        vm.expectRevert(bytes("L67"));
        tested.requestUnlock();
    }

    function testFuzz_requestUnlock_3(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should revert if account's lock has not ended yet");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 0, uint256(LOCKED_HARD_CAP)));

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Expect revert
        vm.expectRevert(bytes("L68"));
        vm.prank(locker);
        tested.requestUnlock();
    }

    function testFuzz_requestUnlock_4(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should revert if account has already unlocked");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP)));

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker);
        vm.warp(lockEndTimestamp + 1);

        // Unlock a first time
        deal(locker, 0.003 ether);
        vm.prank(locker);
        tested.requestUnlock{value: 0.003 ether}();

        // Expect revert on second unlock attempt
        deal(locker, 0.003 ether);
        vm.expectRevert(bytes("L69"));
        vm.prank(locker);
        tested.requestUnlock{value: 0.003 ether}();
    }

    function testFuzz_requestUnlock_5(address locker, uint8 lockDuration) public {
        console.log("Should revert if account has nothing to unlock");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Lock amount
        vm.startPrank(locker);
        tested.lock(0, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker);
        vm.warp(lockEndTimestamp + 1);

        // Expect revert
        deal(locker, 0.003 ether);
        vm.expectRevert(bytes("L70"));
        vm.prank(locker);
        tested.requestUnlock{value: 0.003 ether}();
    }

    function testFuzz_requestUnlock_6(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should set account's hasUnlocked to true");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP)));

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker);
        vm.warp(lockEndTimestamp + 1);

        // Unlock amount locked
        deal(locker, 0.003 ether);
        vm.prank(locker);
        tested.requestUnlock{value: 0.003 ether}();

        // Assert that account hasUnlocked is true
        (, , bool hasUnlocked, , ) = tested.accountsLocks(locker);
        assertEq(hasUnlocked, true);
    }

    function testFuzz_requestUnlock_7(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should append locker's address to unlock requests queue");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP)));

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker);
        vm.warp(lockEndTimestamp + 1);

        // Unlock amount locked
        deal(locker, 0.003 ether);
        vm.prank(locker);
        tested.requestUnlock{value: 0.003 ether}();

        // Assert that locker address has been appended to unlock requests queue
        assertEq(tested.unlockRequests(0), locker);
    }

    function testFuzz_requestUnlock_8(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should revert if not enough processing fees are attached");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP)));

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker);
        vm.warp(lockEndTimestamp + 1);

        // Expect revert if attaching 0 processing fees
        vm.expectRevert(bytes("L55"));
        vm.prank(locker);
        tested.requestUnlock{value: 0 ether}();
    }

    function testFuzz_requestUnlock_9(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should revert if too much processing fees are attached");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP)));

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker);
        vm.warp(lockEndTimestamp + 1);

        // Expect revert if attaching too much processing fees
        deal(locker, 1 ether);
        vm.expectRevert(bytes("L55"));
        vm.prank(locker);
        tested.requestUnlock{value: 1 ether}();
    }

    function testFuzz_requestUnlock_10(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should create a withdrawal request on L-Token contract");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP)));

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker);
        vm.warp(lockEndTimestamp + 1);

        // Assert current L-Token balance of Lockdrop contract is lockAmount
        assertEq(lToken.balanceOf(address(tested)), lockAmount);

        // Request to unlock locked amount
        deal(locker, 0.003 ether);
        vm.prank(locker);
        tested.requestUnlock{value: 0.003 ether}();

        // Assert L-Token balance of Lockdrop contract is now 0
        assertEq(lToken.balanceOf(address(tested)), 0);

        // Assert request have been appended at the beginning of the L-Token queue
        (address requestAccount, uint96 requestAmount) = lToken.withdrawalQueue(0);
        assertEq(requestAccount, address(tested));
        assertEq(requestAmount, uint96(lockAmount));
    }

    // ========================================
    // === processUnlockRequests() function ===
    function testFuzz_processUnlockRequests_1(address account) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the owner wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.processUnlockRequests();
    }

    function test_processUnlockRequests_2() public {
        console.log("Shouldn't change any state and silently end if queue is empty");

        // End Deposit phase and start Claim phase
        tested.setLDYToken(address(ldyToken));
        tested.endDepositPhase();
        tested.startClaimPhase();

        // Assert that queue cursor is at 0
        assertEq(tested.unlockRequestsCursor(), 0);

        // Process the empty queue
        tested.processUnlockRequests();

        // Assert that queue cursor is still at 0
        assertEq(tested.unlockRequestsCursor(), 0);
    }

    function testFuzz_processUnlockRequests_3(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log(
            "Shouldn't change any state and hasn't enough fund to cover first next request"
        );

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(bound(lockAmount, 1, uint256(LOCKED_HARD_CAP)));

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker);
        vm.warp(lockEndTimestamp + 1);

        // Request to unlock locked amount
        deal(locker, 0.003 ether);
        vm.prank(locker);
        tested.requestUnlock{value: 0.003 ether}();

        // Assert that queue cursor is at 0
        assertEq(tested.unlockRequestsCursor(), 0);

        // Process the queue
        tested.processUnlockRequests();

        // Assert that queue cursor is still at 0
        assertEq(tested.unlockRequestsCursor(), 0);
    }

    function testFuzz_processUnlockRequests_5(
        address locker1,
        address locker2,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log(
            "Should silently return when encoutering a request that cannot be covered anymore"
        );

        // Ensure lockers are not the zero address or contracts, and are different
        vm.assume(locker1 != address(0));
        vm.assume(locker2 != address(0));
        vm.assume(locker1 != address(lToken));
        vm.assume(locker2 != address(lToken));
        vm.assume(locker1 != address(tested));
        vm.assume(locker2 != address(tested));
        vm.assume(locker1 != locker2);

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(
            bound(lockAmount, 1 * 10 ** lToken.decimals(), uint256(LOCKED_HARD_CAP) / 2)
        );

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to lockers
        deal(address(underlyingToken), locker1, lockAmount, true);
        deal(address(underlyingToken), locker2, lockAmount, true);

        // Lock amount from locker1
        vm.startPrank(locker1);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Lock amount from locker2
        vm.startPrank(locker2);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker1);
        vm.warp(lockEndTimestamp + 1);

        // Request to unlock locked amount from locker 1
        deal(locker1, 0.003 ether);
        vm.prank(locker1);
        tested.requestUnlock{value: 0.003 ether}();

        // Request to unlock locked amount from locker 2
        deal(locker2, 0.003 ether);
        vm.prank(locker2);
        tested.requestUnlock{value: 0.003 ether}();

        // Process L-Tokens big requests from fund wallet
        vm.startPrank(fundWallet);
        lToken.underlying().approve(address(lToken), lockAmount);
        lToken.processBigQueuedRequest(0); // Only repatriate funds for the locker1 request
        vm.stopPrank();
        // Process queued requests
        tested.processUnlockRequests();

        // Assert that only one request has been processed
        assertEq(tested.unlockRequestsCursor(), 1);

        // Assert that locker2 remains in the queue
        assertEq(tested.unlockRequests(1), locker2);
    }

    function testFuzz_processUnlockRequests_6(
        address locker1,
        address locker2,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should delete processed requests from queue");

        // Ensure lockers are not the zero address or contracts, and are different
        vm.assume(locker1 != address(0));
        vm.assume(locker2 != address(0));
        vm.assume(locker1 != address(lToken));
        vm.assume(locker2 != address(lToken));
        vm.assume(locker1 != address(tested));
        vm.assume(locker2 != address(tested));
        vm.assume(locker1 != locker2);

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(
            bound(lockAmount, 1 * 10 ** lToken.decimals(), uint256(LOCKED_HARD_CAP) / 2)
        );

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to lockers
        deal(address(underlyingToken), locker1, lockAmount, true);
        deal(address(underlyingToken), locker2, lockAmount, true);

        // Lock amount from locker1
        vm.startPrank(locker1);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Lock amount from locker2
        vm.startPrank(locker2);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker1);
        vm.warp(lockEndTimestamp + 1);

        // Request to unlock locked amount from locker 1
        deal(locker1, 0.003 ether);
        vm.prank(locker1);
        tested.requestUnlock{value: 0.003 ether}();

        // Request to unlock locked amount from locker 2
        deal(locker2, 0.003 ether);
        vm.prank(locker2);
        tested.requestUnlock{value: 0.003 ether}();

        // Assert that unlock requests are in the queue
        assertEq(tested.unlockRequests(0), locker1);
        assertEq(tested.unlockRequests(1), locker2);

        // Process L-Tokens big requests from fund wallet
        vm.startPrank(fundWallet);
        lToken.underlying().approve(address(lToken), lockAmount * 2);
        lToken.processBigQueuedRequest(0);
        lToken.processBigQueuedRequest(1);
        vm.stopPrank();

        // Process queued requests
        tested.processUnlockRequests();

        // Assert that requests have been deleted from queue
        assertEq(tested.unlockRequests(0), address(0));
        assertEq(tested.unlockRequests(1), address(0));
    }

    function testFuzz_processUnlockRequests_7(
        address locker1,
        address locker2,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should transfer underlying tokens to lockers");

        // Ensure lockers are not the zero address or contracts, and are different
        vm.assume(locker1 != address(0));
        vm.assume(locker2 != address(0));
        vm.assume(locker1 != address(lToken));
        vm.assume(locker2 != address(lToken));
        vm.assume(locker1 != address(tested));
        vm.assume(locker2 != address(tested));
        vm.assume(locker1 != locker2);

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(
            bound(lockAmount, 1 * 10 ** lToken.decimals(), uint256(LOCKED_HARD_CAP) / 2)
        );

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to lockers
        deal(address(underlyingToken), locker1, lockAmount, true);
        deal(address(underlyingToken), locker2, lockAmount, true);

        // Lock amount from locker1
        vm.startPrank(locker1);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Lock amount from locker2
        vm.startPrank(locker2);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker1);
        vm.warp(lockEndTimestamp + 1);

        // Request to unlock locked amount from locker 1
        deal(locker1, 0.003 ether);
        vm.prank(locker1);
        tested.requestUnlock{value: 0.003 ether}();

        // Request to unlock locked amount from locker 2
        deal(locker2, 0.003 ether);
        vm.prank(locker2);
        tested.requestUnlock{value: 0.003 ether}();

        // Process L-Tokens big requests from fund wallet
        vm.startPrank(fundWallet);
        lToken.underlying().approve(address(lToken), lockAmount * 2);
        lToken.processBigQueuedRequest(0);
        lToken.processBigQueuedRequest(1);
        vm.stopPrank();

        // Assert lockers balances are 0
        assertEq(underlyingToken.balanceOf(locker1), 0);
        assertEq(underlyingToken.balanceOf(locker2), 0);

        // Assert Lockdrop contract balance is twice the lockAmount
        assertEq(underlyingToken.balanceOf(address(tested)), lockAmount * 2);

        // Process queued requests
        tested.processUnlockRequests();

        // Assert lockers balances have increased by lockAmount
        assertEq(underlyingToken.balanceOf(locker1), lockAmount);
        assertEq(underlyingToken.balanceOf(locker2), lockAmount);

        // Assert Lockdrop contract balance is now 0
        assertEq(underlyingToken.balanceOf(address(tested)), 0);
    }

    function test_processUnlockRequests_8(
        address locker1,
        address locker2,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should properly increase queue cursor to next request to be processed");

        // Ensure lockers are not the zero address or contracts, and are different
        vm.assume(locker1 != address(0));
        vm.assume(locker2 != address(0));
        vm.assume(locker1 != address(lToken));
        vm.assume(locker2 != address(lToken));
        vm.assume(locker1 != address(tested));
        vm.assume(locker2 != address(tested));
        vm.assume(locker1 != locker2);

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(
            bound(lockAmount, 1 * 10 ** lToken.decimals(), uint256(LOCKED_HARD_CAP) / 2)
        );

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to lockers
        deal(address(underlyingToken), locker1, lockAmount, true);
        deal(address(underlyingToken), locker2, lockAmount, true);

        // Lock amount from locker1
        vm.startPrank(locker1);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // Lock amount from locker2
        vm.startPrank(locker2);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(locker1);
        vm.warp(lockEndTimestamp + 1);

        // Request to unlock locked amount from locker 1
        deal(locker1, 0.003 ether);
        vm.prank(locker1);
        tested.requestUnlock{value: 0.003 ether}();

        // Request to unlock locked amount from locker 2
        deal(locker2, 0.003 ether);
        vm.prank(locker2);
        tested.requestUnlock{value: 0.003 ether}();

        // Process L-Tokens big requests from fund wallet
        vm.startPrank(fundWallet);
        lToken.underlying().approve(address(lToken), lockAmount * 2);
        lToken.processBigQueuedRequest(0);
        lToken.processBigQueuedRequest(1);
        vm.stopPrank();

        // Assert unlock queue cursor is currently 0
        assertEq(tested.unlockRequestsCursor(), 0);

        // Process queued requests
        tested.processUnlockRequests();

        // Assert unlock queue cursor is now 2
        assertEq(tested.unlockRequestsCursor(), 2);
    }

    function test_processUnlockRequests_9(uint240 lockAmount, uint8 lockDuration) public {
        console.log("Should never revert from out of gas and properly end instead");

        // Store the requests number
        uint256 requestsNumber = 100;

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(
            bound(
                lockAmount,
                1 * 10 ** lToken.decimals(),
                uint256(LOCKED_HARD_CAP) / requestsNumber
            )
        );

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Create 2000 locks
        for (uint160 i = 1; i < requestsNumber; i++) {
            // Build locker address
            address locker = address(i);

            // Mint underlying tokens to locker
            deal(address(underlyingToken), locker, lockAmount, true);

            // Lock amount from locker
            vm.startPrank(locker);
            underlyingToken.approve(address(tested), lockAmount);
            tested.lock(lockAmount, lockDuration);
            vm.stopPrank();
        }

        // End Deposit phase
        tested.endDepositPhase();

        // Ensure lock end is in the past
        (, , , , uint40 lockEndTimestamp) = tested.accountsLocks(address(1));
        vm.warp(lockEndTimestamp + 1);

        // Create 2000 unlock requests
        for (uint160 i = 1; i < requestsNumber; i++) {
            // Build locker address
            address locker = address(i);

            // Request to unlock locked amount from locker
            deal(locker, 0.003 ether);
            vm.prank(locker);
            tested.requestUnlock{value: 0.003 ether}();
        }

        // Mint enough underlying tokens to Lockdrop contract to cover all requests
        deal(address(underlyingToken), address(tested), lockAmount * requestsNumber, true);

        // Process queued requests
        // It should revert from OOG if not prevent by the function
        tested.processUnlockRequests{gas: 1000000}();
    }

    // ===================================
    // === availableToClaim() function ===
    function test_availableToClaim_1(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration,
        uint32 elapsedTime
    ) public {
        console.log("Should properly apply elasped time since Claim phase start");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(
            bound(lockAmount, 1 * 10 ** lToken.decimals(), uint256(LOCKED_HARD_CAP))
        );

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Bound elapsed time to vesting duration
        uint256 secondsInOneMonth = 30 * 24 * 60 * 60;
        elapsedTime = uint32(bound(elapsedTime, 0, tested.vestingDuration() * secondsInOneMonth));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase and start Claim one
        tested.endDepositPhase();
        tested.setLDYToken(address(ldyToken));
        tested.startClaimPhase();

        // Move forward a random elapsed amount in vesting time
        skip(elapsedTime);

        // Compute available LDY rewards to claim
        uint256 availableRewards = tested.availableToClaim(locker);

        if (tested.eligibleRewardsOf(locker) > 0) {
            // Compute applied elapsed time from available rewards, vestingDuration and eligible rewards of
            uint256 vestingInSeconds = uint256(tested.vestingDuration()) * secondsInOneMonth;
            uint256 appliedElapsedTime = (availableRewards * vestingInSeconds) /
                tested.eligibleRewardsOf(locker);

            // Compute difference between applied and expected elapsed time
            uint256 elapsedTimeDiff = appliedElapsedTime > elapsedTime
                ? appliedElapsedTime - elapsedTime
                : elapsedTime - appliedElapsedTime;

            // Assert that difference is less than 1 hour
            assertLe(elapsedTimeDiff, 60 * 60);

            // Assert the in despite of imprecision, applied time is never greater than expected
            assertLe(appliedElapsedTime, elapsedTime);
        }
    }

    function test_availableToClaim_2(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration,
        uint32 elapsedTime
    ) public {
        console.log("Should properly apply total eligible rewards of locker");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(
            bound(lockAmount, 1 * 10 ** lToken.decimals(), uint256(LOCKED_HARD_CAP))
        );

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Bound elapsed time to vesting duration
        uint256 secondsInOneMonth = 30 * 24 * 60 * 60;
        elapsedTime = uint32(bound(elapsedTime, 0, tested.vestingDuration() * secondsInOneMonth));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase and start Claim one
        tested.endDepositPhase();
        tested.setLDYToken(address(ldyToken));
        tested.startClaimPhase();

        // Move forward a random elapsed amount in vesting time
        skip(elapsedTime);

        // Compute available LDY rewards to claim
        uint256 availableRewards = tested.availableToClaim(locker);

        if (elapsedTime > 0) {
            // Compute applied eligible rewards of from available rewards, vestingDuration and elapsed time
            uint256 vestingInSeconds = uint256(tested.vestingDuration()) * secondsInOneMonth;
            uint256 appliedEligibleRewards = (availableRewards * vestingInSeconds) / elapsedTime;

            // Compute difference between applied and expected elapsed time
            uint256 eligibleRewardsDiff = appliedEligibleRewards > tested.eligibleRewardsOf(locker)
                ? appliedEligibleRewards - tested.eligibleRewardsOf(locker)
                : tested.eligibleRewardsOf(locker) - appliedEligibleRewards;

            // Assert that difference is less 1 LDY
            assertLe(eligibleRewardsDiff, 1 * 10 ** 18);

            // Assert the in despite of imprecision, applied time is never greater than expected
            assertLe(appliedEligibleRewards, tested.eligibleRewardsOf(locker));
        }
    }

    function test_availableToClaim_3(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration,
        uint32 elapsedTime
    ) public {
        console.log("Should properly apply vesting duration");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(
            bound(lockAmount, 1 * 10 ** lToken.decimals(), uint256(LOCKED_HARD_CAP))
        );

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Bind elapsed time to vesting duration
        uint256 secondsInOneMonth = 30 * 24 * 60 * 60;
        elapsedTime = uint32(bound(elapsedTime, 0, tested.vestingDuration() * secondsInOneMonth));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase and start Claim one
        tested.endDepositPhase();
        tested.setLDYToken(address(ldyToken));
        tested.startClaimPhase();

        // Move forward a random elapsed amount in vesting time
        skip(elapsedTime);

        // Compute available LDY rewards to claim
        uint256 availableRewards = tested.availableToClaim(locker);

        if (availableRewards > 0) {
            // Compute vesting duration from available rewards, eligible rewards of and elapsed time
            uint256 appliedVestingSeconds = (elapsedTime * tested.eligibleRewardsOf(locker)) /
                availableRewards;
            uint256 appliedVestingDuration = appliedVestingSeconds / secondsInOneMonth;

            // Compute difference between applied and expected vesting duration
            uint256 vestingDurationDiff = appliedVestingDuration > tested.vestingDuration()
                ? appliedVestingDuration - tested.vestingDuration()
                : tested.vestingDuration() - appliedVestingDuration;

            // Assert that difference is less 1 month
            assertLe(vestingDurationDiff, 1);

            // Assert the in despite of imprecision, applied vesting duration is never lower than expected
            assertGe(appliedVestingDuration, tested.vestingDuration());
        }
    }

    function test_availableToClaim_4(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration
    ) public {
        console.log("Should properly consider already claimed rewards");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(
            bound(lockAmount, 1 * 10 ** lToken.decimals(), uint256(LOCKED_HARD_CAP))
        );

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase and start Claim one
        tested.endDepositPhase();
        tested.setLDYToken(address(ldyToken));
        tested.startClaimPhase();

        // Feed lockdrop contract with LDY rewards
        deal(address(ldyToken), address(tested), type(uint256).max);

        // Move forward half of vesting duration
        uint256 secondsInOneMonth = 30 * 24 * 60 * 60;
        skip((tested.vestingDuration() * secondsInOneMonth) / 2);

        // Perform a first rewards claim
        vm.prank(locker);
        tested.claimRewards();

        // Move forward the remaining half of vesting duration
        skip((tested.vestingDuration() * secondsInOneMonth) / 2);

        // Claim rewards again
        vm.prank(locker);
        tested.claimRewards();

        // Assert that available rewards to claim is 0
        assertEq(tested.availableToClaim(locker), 0);

        // Assert that locker has received 100% of its eligible rewards
        assertEq(ldyToken.balanceOf(locker), tested.eligibleRewardsOf(locker));
    }

    // ===============================
    // === claimRewards() function ===
    function test_claimRewards_1() public {
        console.log("Should revert if contract is paused");
        tested.pause();
        expectRevertPaused();
        tested.claimRewards();
    }

    function test_claimRewards_2() public {
        console.log("Should revert if Claim phase has not started yet");

        // Expect revert
        vm.expectRevert(bytes("L87"));
        tested.claimRewards();
    }

    function testFuzz_claimRewards_3(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration,
        uint32 elapsedTime
    ) public {
        console.log("Should increase account's claimed rewards by the claimed amount");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(
            bound(lockAmount, 1 * 10 ** lToken.decimals(), uint256(LOCKED_HARD_CAP))
        );

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Bind elapsed time to vesting duration
        uint256 secondsInOneMonth = 30 * 24 * 60 * 60;
        elapsedTime = uint32(bound(elapsedTime, 0, tested.vestingDuration() * secondsInOneMonth));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase and start Claim one
        tested.endDepositPhase();
        tested.setLDYToken(address(ldyToken));
        tested.startClaimPhase();

        // Feed lockdrop contract with LDY rewards
        deal(address(ldyToken), address(tested), type(uint256).max);

        // Move forward a random elapsed amount in vesting time
        skip(elapsedTime);

        // Assert that current claimed amount of locker is 0
        (, , , uint216 claimedRewardsBefore, ) = tested.accountsLocks(locker);
        assertEq(claimedRewardsBefore, 0);

        // Store available to claim amount for later usage
        uint256 availableToClaim = tested.availableToClaim(locker);

        // Perform a rewards claim
        vm.prank(locker);
        tested.claimRewards();

        // Assert that claimed amount of locker has increased by available to claim amount
        (, , , uint216 claimedRewardsAfter, ) = tested.accountsLocks(locker);
        assertEq(claimedRewardsAfter, availableToClaim);

        // Assert that available to claim amount is now 0
        assertEq(tested.availableToClaim(locker), 0);
    }

    function testFuzz_claimRewards_4(
        address locker,
        uint240 lockAmount,
        uint8 lockDuration,
        uint32 elapsedTime
    ) public {
        console.log("Should transfer claimed rewards to locker");

        // Ensure locker is not the zero address
        vm.assume(locker != address(0));

        // Ensure lockAmount is at least equal to 1
        lockAmount = uint240(
            bound(lockAmount, 1 * 10 ** lToken.decimals(), uint256(LOCKED_HARD_CAP))
        );

        // Ensure lock duration is at least equal to 1
        lockDuration = uint8(bound(lockDuration, 1, MAX_LOCK_DURATION));

        // Bind elapsed time to vesting duration
        uint256 secondsInOneMonth = 30 * 24 * 60 * 60;
        elapsedTime = uint32(bound(elapsedTime, 0, tested.vestingDuration() * secondsInOneMonth));

        // Mint underlying tokens to locker
        deal(address(underlyingToken), locker, lockAmount, true);

        // Lock amount
        vm.startPrank(locker);
        underlyingToken.approve(address(tested), lockAmount);
        tested.lock(lockAmount, lockDuration);
        vm.stopPrank();

        // End Deposit phase and start Claim one
        tested.endDepositPhase();
        tested.setLDYToken(address(ldyToken));
        tested.startClaimPhase();

        // Feed lockdrop contract with LDY rewards
        deal(address(ldyToken), address(tested), type(uint256).max);

        // Move forward a random elapsed amount in vesting time
        skip(elapsedTime);

        // Assert that current locker LDY balance is 0
        assertEq(ldyToken.balanceOf(locker), 0);

        // Store available to claim amount for later usage
        uint256 availableToClaim = tested.availableToClaim(locker);

        // Perform a rewards claim
        vm.prank(locker);
        tested.claimRewards();

        // Assert that locker LDY balance has increased by available to claim amount
        assertEq(ldyToken.balanceOf(locker), availableToClaim);

        // Assert that available to claim amount is now 0
        assertEq(tested.availableToClaim(locker), 0);
    }
}
