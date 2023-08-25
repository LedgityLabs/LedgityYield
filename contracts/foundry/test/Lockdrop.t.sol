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

contract Tests is Test {
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
    uint8 constant MIN_LOCK_DURATION = 0;
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
    function test_constructor_1() public {
        console.log("Should revert if invalid locked hardcap is given");
    }

    function testFuzz_constructor_2() public {
        console.log("Should revert minLockDuration is greater than maxLockDuration");
    }

    function testFuzz_constructor_3(
        int256 lockedHardCap,
        uint256 maxDistributedLDY,
        uint8 minLockDuration,
        uint8 maxLockDuration,
        uint8 vestingDuration
    ) public {
        console.log("Should properly set immutable states");
    }

    // ==============================
    // === setLDYToken() function ===
    function test_setLDYToken_1() public {
        console.log("Should revert if not called by owner");
    }

    function test_setLDYToken_2() public {
        console.log("Should revert if Claim phase has started");
    }

    function test_setLDYToken_6() public {
        console.log("Should properly set LDY token address else");
    }

    // ==================================
    // === endDepositPhase() function ===
    function test_endDepositPhase_1() public {
        console.log("Should revert if not called by owner");
    }

    function test_endDepositPhase_2() public {
        console.log("Should set hasDepositPhaseEnded to true");
    }

    // ==================================
    // === startClaimPhase() function ===
    function test_startClaimPhase_1() public {
        console.log("Should revert if not called by owner");
    }

    function test_startClaimPhase_2() public {
        console.log("Should revert if Deposit phase has not ended yet");
    }

    function test_startClaimPhase_3() public {
        console.log("Should revert if Claim phase has already start");
    }

    function test_startClaimPhase_4() public {
        console.log("Should revert if LDY token address is unavailable");
    }

    function test_startClaimPhase_5() public {
        console.log("Should revert if some LDY rewards are missing (refWeight = total)");
    }

    function test_startClaimPhase_6() public {
        console.log("Should revert if some LDY rewards are missing (refWeight = max)");
    }

    function test_startClaimPhase_7() public {
        console.log("Should properly set hasClaimPhaseStarted to true");
    }

    function test_startClaimPhase_8() public {
        console.log("Should properly set the Claim phase start timestamp");
    }

    // =====================================
    // === startRecoveryPhase() function ===
    function test_startRecoveryPhase_1() public {
        console.log("Should revert if not called by owner");
    }

    function test_startRecoveryPhase_2() public {
        console.log(
            "Should revert if not called at least 3 months after the end of rewards vestion"
        );
    }

    function test_startRecoveryPhase_3() public {
        console.log(
            "Should revert if not called at least 3 months after the end of maxiumum lock end"
        );
    }

    function test_startRecoveryPhase_4() public {
        console.log("Should properly set hasRecoveryPhaseStarted to true");
    }

    // ===============================
    // === recoverERC20() function ===
    function test_recoverERC20_1() public {
        console.log("Should revert if not called by owner");
    }

    function test_recoverERC20_2() public {
        console.log("Should revert if Recovery phase has not started yet");
    }

    function test_recoverERC20_3() public {
        console.log("Should revert if there is not enough tokens to recover");
    }

    function test_recoverERC20_4() public {
        console.log("Should properly transfer recovered tokens to owner else");
    }

    // ============================
    // === refWeight() function ===
    function test_refWeight_1() public {
        console.log("Should return max weight if lockedHardCap is set");
    }

    function test_refWeight_2() public {
        console.log("Should return total weight if lockedHardCap is not set");
    }

    // ====================================
    // === eligibleRewardsOf() function ===
    function test_eligibleRewardsOf_1() public {
        console.log("Should properly apply locker's weight");
    }

    function test_eligibleRewardsOf_2() public {
        console.log("Should properly apply refWeight (refWeight = total)");
    }

    function test_eligibleRewardsOf_3() public {
        console.log("Should properly apply refWeight (refWeight = max)");
    }

    function test_eligibleRewardsOf_4() public {
        console.log("Should properly apply maxDistributedLDY");
    }

    // =======================
    // === lock() function ===
    function test_lock_1() public {
        console.log("Should revert if contract is paused");
    }

    function test_lock_2() public {
        console.log("Should revert if Deposit phase is over");
    }

    function test_lock_3() public {
        console.log("Should revert if lock duration is out of bound");
    }

    function test_lock_4() public {
        console.log("Should revert if account hasn't enough underlying tokens");
    }

    function test_lock_5() public {
        console.log("Should increase lock's amount by the locked amount");
    }

    function test_lock_6() public {
        console.log("Should increase the total locked amount by the locked amount");
    }

    function test_lock_7() public {
        console.log("Should apply new duration if greater than current one");

        // assertEq(duration, newDuration)
        // assertEq(lockEnd, newLockEnd)
    }

    function test_lock_8() public {
        console.log("Should apply new duration if greater than current one");
    }

    function test_lock_9() public {
        console.log("Should properly set weight on initial lock");
    }

    function test_lock_10() public {
        console.log("Should properly set weight on subsquent lock if amount has increased");
    }

    function test_lock_11() public {
        console.log("Should properly set weight on subsquent lock if duration has decreased");
    }

    function test_lock_12() public {
        console.log(
            "Should properly set weight on subsquent lock if both amount and duration have increased"
        );
    }

    function test_lock_13() public {
        console.log("Should deposit amount to L-Token contract if amount > 0");
        // Assert contract L-Tokens balance has increased by amount
        // Assert account underlying balance has decreased by amount
        // Assert L-Token contract total supply has increased by amount
    }

    // ================================
    // === instantUnlock() function ===
    function test_instantUnlock_1() public {
        console.log("Should revert if contract is paused");
    }

    function test_instantUnlock_2() public {
        console.log("Should revert if Deposit phase has not ended yet");
    }

    function test_instantUnlock_3() public {
        console.log("Should revert if account's lock has not ended yet");
    }

    function test_instantUnlock_4() public {
        console.log("Should revert if account has already unlocked");
    }

    function test_instantUnlock_5() public {
        console.log("Should revert account has nothing to unlock");
    }

    function test_instantUnlock_6() public {
        console.log("Should set account's hasUnlocked to true");
    }

    function test_instantUnlock_7() public {
        console.log(
            "Should revert if L-Token doesn't hold enough underlying tokens to cover the request (without considering already queued amount because Lockdrop contract is elligible to tier 2)"
        );
    }

    function test_instantUnlock_8() public {
        console.log("Should withdraw needed underlying amount from L-Token contract");
        // Assert contract L-Tokens balance has decreased by amount
        // Assert L-Token contract total supply has decreased by amount
    }

    function test_instantUnlock_9() public {
        console.log("Should transfer unlocked underlying tokens to locker");
    }

    // ================================
    // === requestUnlock() function ===
    function test_requestUnlock_1() public {
        console.log("Should revert if contract is paused");
    }

    function test_requestUnlock_2() public {
        console.log("Should revert if Deposit phase has not ended yet");
    }

    function test_requestUnlock_3() public {
        console.log("Should revert if account's lock has not ended yet");
    }

    function test_requestUnlock_4() public {
        console.log("Should revert if account has already unlocked");
    }

    function test_requestUnlock_5() public {
        console.log("Should revert account has nothing to unlock");
    }

    function test_requestUnlock_6() public {
        console.log("Should set account's hasUnlocked to true");
    }

    function test_requestUnlock_7() public {
        console.log("Should append locker's address to unlock requests queue");
    }

    function test_requestUnlock_8() public {
        console.log("Should revert if not enough processing fees are attached");
    }

    function test_requestUnlock_9() public {
        console.log("Should revert if too much processing fees are attached");
    }

    function test_requestUnlock_10() public {
        console.log("Should create a withdrawal request on L-Token contract");
        // Assert contract L-Tokens balance has decreased by amount
        // Assert that request has been appended at the beginning of the L-Token contract queue (because Lockdrop contract is eligible to staking tier 2)
    }

    // ========================================
    // === processUnlockRequests() function ===
    function test_processUnlockRequests_1() public {
        console.log("Should revert if not called by owner");
    }

    function test_processUnlockRequests_2() public {
        console.log("Should revert if Claim phase has not started yey");
    }

    function test_processUnlockRequests_3() public {
        console.log("Shouldn't change any state and silently end if queue is empty");
    }

    function test_processUnlockRequests_4() public {
        console.log("Should silently skip empty requests (already processed ones)");
    }

    function test_processUnlockRequests_5() public {
        console.log(
            "Shouldn't change any state and hasn't enough fund to cover first next request"
        );
    }

    function test_processUnlockRequests_6() public {
        console.log(
            "Should silently return when encoutering a request that cannot be covered anymore"
        );
    }

    function test_processUnlockRequests_7() public {
        console.log("Should delete processed requests from queue");
    }

    function test_processUnlockRequests_8() public {
        console.log("Should transfer underlying tokens to lockers");
    }

    function test_processUnlockRequests_9() public {
        console.log("Should properly increase queue cursor to next request to be processed");
    }

    function test_processUnlockRequests_10() public {
        console.log("Should never revert from out of gas and properly end instead");
    }

    // ===================================
    // === availableToClaim() function ===
    function test_availableToClaim_1() public {
        console.log("Should properly apply elasped time since Claim phase start");
    }

    function test_availableToClaim_2() public {
        console.log("Should properly apply total eligible rewards of locker");
    }

    function test_availableToClaim_3() public {
        console.log("Should properly apply vesting duration");
    }

    function test_availableToClaim_4() public {
        console.log("Should properly consider already claimed rewards");
    }

    // ===============================
    // === claimRewards() function ===
    function test_claimRewards_1() public {
        console.log("Should revert if Claim phase has not started yet");
    }

    function test_claimRewards_2() public {
        console.log("Should increase account's claimed rewards by the claimed amount");
    }

    function test_claimRewards_3() public {
        console.log("Should transfer claimed rewards to locker");
    }
}
