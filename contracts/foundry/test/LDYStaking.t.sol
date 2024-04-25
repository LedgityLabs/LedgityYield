// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {Test, console} from "../lib/forge-std/src/Test.sol";
import {GenericERC20} from "../../src/GenericERC20.sol";
import {LDYStaking} from "../../src/LDYStaking.sol";
import {GlobalOwner} from "../../src/GlobalOwner.sol";
import {GlobalPause} from "../../src/GlobalPause.sol";
import {GlobalBlacklist} from "../../src/GlobalBlacklist.sol";
import {ModifiersExpectations} from "./_helpers/ModifiersExpectations.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract LDYStakingTest is Test, ModifiersExpectations {
    GlobalOwner globalOwner;
    GlobalPause globalPause;
    GlobalBlacklist globalBlacklist;

    LDYStaking ldyStaking;
    GenericERC20 ldyToken;
    uint256[] public stakingDurations;
    uint256 public constant oneMonth = 31 * 24 * 60 * 60;
    uint256 public initRewardsDuration = 12 * oneMonth;

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

        ldyToken = new GenericERC20("Ledgity Token", "LDY", 18);
        vm.label(address(ldyToken), "LDY token");

        stakingDurations = [
            1 * oneMonth,
            6 * oneMonth,
            12 * oneMonth,
            24 * oneMonth,
            36 * oneMonth
        ];
        // Deploy LDYStaking
        LDYStaking impl4 = new LDYStaking();
        ERC1967Proxy proxy4 = new ERC1967Proxy(address(impl4), "");
        ldyStaking = LDYStaking(address(proxy4));
        ldyStaking.initialize(
            address(globalOwner),
            address(globalPause),
            address(globalBlacklist),
            address(ldyToken),
            stakingDurations,
            12 * oneMonth,
            1000 * 1e18
        );

        // Set initial rewards amount and duration
        ldyStaking.setRewardsDuration(initRewardsDuration);

        uint256 rewardsAmount = 1_000_000e18;
        deal(address(ldyToken), address(this), rewardsAmount);
        assertEq(ldyToken.balanceOf(address(this)), rewardsAmount);
        ldyToken.approve(address(ldyStaking), rewardsAmount);
        ldyStaking.notifyRewardAmount(rewardsAmount);
    }

    function test_initialize_1() public {
        console.log("Shouldn't be re-initializable");
        vm.expectRevert(bytes("Initializable: contract is already initialized"));
        ldyStaking.initialize(
            address(globalOwner),
            address(globalPause),
            address(globalBlacklist),
            address(ldyToken),
            stakingDurations,
            12 * oneMonth,
            1000 * 1e18
        );
    }

    function test_initialize_2() public {
        console.log("Should properly set global owner, pause, blacklist and ldy token");
        assertEq(ldyStaking.globalOwner(), address(globalOwner));
        assertEq(ldyStaking.globalPause(), address(globalPause));
        assertEq(ldyStaking.globalBlacklist(), address(globalBlacklist));
        assertEq(address(ldyStaking.stakeRewardToken()), address(ldyToken));
    }

    function test_paused() public {
        console.log("Should return state of the global pause contract");
        assertEq(ldyStaking.paused(), false);

        globalPause.pause();
        assertEq(ldyStaking.paused(), true);

        // reverts staking in case of paused status
        vm.expectRevert("Pausable: paused");
        ldyStaking.stake(1, 0);

        globalPause.unpause();
        assertEq(ldyStaking.paused(), false);
    }

    function test_StakeFailed() public {
        vm.expectRevert("amount = 0");
        ldyStaking.stake(0, 0);

        vm.expectRevert("invalid staking period");
        ldyStaking.stake(1, uint8(stakingDurations.length));

        vm.expectRevert("ERC20: insufficient allowance");
        ldyStaking.stake(1, 0);
    }

    function testFuzz_Stake_LessThanAmountForPerks(
        address account,
        uint256 amount,
        uint8 stakingPeriodIndex
    ) public {
        vm.assume(account != address(0));
        vm.assume(account != address(ldyToken));
        vm.assume(account != address(ldyStaking));
        vm.assume(amount != 0);

        stakingPeriodIndex = uint8(bound(stakingPeriodIndex, 0, stakingDurations.length - 1));
        amount = bound(amount, 1, ldyStaking.stakeAmountForPerks() - 1);

        // deposit ldy token into the account
        deal(address(ldyToken), account, amount);

        // stake ldy token into the ldyStaking contract
        vm.startPrank(account);
        ldyToken.approve(address(ldyStaking), amount);
        ldyStaking.stake(amount, stakingPeriodIndex);
        vm.stopPrank();

        assertEq(ldyStaking.tierOf(account), 0);
    }

    function testFuzz_Stake_LessThanDurationForPerks(
        address account,
        uint256 amount,
        uint8 stakingPeriodIndex
    ) public {
        vm.assume(account != address(0));
        vm.assume(account != address(ldyToken));
        vm.assume(account != address(ldyStaking));
        vm.assume(amount != 0);

        stakingPeriodIndex = uint8(bound(stakingPeriodIndex, 0, 1));
        amount = bound(
            amount,
            ldyStaking.stakeAmountForPerks(),
            10_000_000 * 10 ** ldyToken.decimals()
        );

        // deposit ldy token into the account
        deal(address(ldyToken), account, amount);

        // stake ldy token into the ldyStaking contract
        vm.startPrank(account);
        ldyToken.approve(address(ldyStaking), amount);
        ldyStaking.stake(amount, stakingPeriodIndex);
        vm.stopPrank();

        assertEq(ldyStaking.tierOf(account), 0);
    }

    function testFuzz_Stake_ElligibleForPerks(
        address account,
        uint256 amount,
        uint8 stakingPeriodIndex
    ) public {
        vm.assume(account != address(0));
        vm.assume(account != address(ldyToken));
        vm.assume(account != address(ldyStaking));
        vm.assume(amount != 0);

        stakingPeriodIndex = uint8(bound(stakingPeriodIndex, 2, stakingDurations.length - 1));
        amount = bound(
            amount,
            ldyStaking.stakeAmountForPerks(),
            10_000_000 * 10 ** ldyToken.decimals()
        );

        // deposit ldy token into the account
        deal(address(ldyToken), account, amount);

        // stake ldy token into the ldyStaking contract
        vm.startPrank(account);
        ldyToken.approve(address(ldyStaking), amount);
        ldyStaking.stake(amount, stakingPeriodIndex);
        vm.stopPrank();

        assertEq(ldyStaking.tierOf(account), 3);
    }

    function testFuzz_StakeToken(
        address account1,
        address account2,
        uint256 amount,
        uint8 stakingPeriodIndex
    ) public {
        stakingPeriodIndex = uint8(bound(stakingPeriodIndex, 0, stakingDurations.length - 1));
        vm.assume(account1 != address(0));
        vm.assume(account1 != address(ldyToken));
        vm.assume(account1 != address(ldyStaking));
        vm.assume(account2 != address(0));
        vm.assume(account2 != address(ldyToken));
        vm.assume(account2 != address(ldyStaking));
        vm.assume(amount != 0);

        // deposit ldy token into the account
        amount = bound(amount, 1, 1_000_000 * 10 ** ldyToken.decimals());
        deal(address(ldyToken), account1, amount);
        deal(address(ldyToken), account2, amount);

        // account1 stakes ldy into the ldyStaking contract first time
        vm.startPrank(account1);
        ldyToken.approve(address(ldyStaking), amount);
        // vm.expectEmit(address(ldyStaking));
        ldyStaking.stake(amount, stakingPeriodIndex);
        vm.stopPrank();
        assertEq(ldyStaking.totalStaked(), amount);

        // account1 stakes ldy into the ldyStaking contract again
        deal(address(ldyToken), account1, amount);
        vm.startPrank(account1);
        ldyToken.approve(address(ldyStaking), amount);
        ldyStaking.stake(amount, stakingPeriodIndex);
        vm.stopPrank();
        assertEq(ldyStaking.totalStaked(), amount * 2);

        LDYStaking.StakingInfo[] memory account1StakingPools = ldyStaking.getUserStakes(account1);
        assertEq(account1StakingPools.length, 2);

        // account2 stakes ldy into the ldyStaking contract
        vm.startPrank(account2);
        ldyToken.approve(address(ldyStaking), amount);
        ldyStaking.stake(amount, stakingPeriodIndex);
        vm.stopPrank();
        assertEq(ldyStaking.totalStaked(), amount * 3);

        LDYStaking.StakingInfo[] memory account2StakingPools = ldyStaking.getUserStakes(account2);
        assertEq(account2StakingPools.length, 1);
    }

    function testFuzz_UnstakeFailed_1(uint256 amount, uint256 stakeIndex) public {
        vm.assume(amount == 0);
        vm.expectRevert("amount = 0");
        ldyStaking.unstake(amount, stakeIndex);
    }

    function testFuzz_UnstakeFailed_2(
        address account,
        uint256 amount,
        uint8 stakingPeriodIndex
    ) public {
        vm.assume(amount != 0);
        vm.assume(account != address(0));
        vm.assume(account != address(ldyStaking));
        vm.assume(account != address(ldyToken));
        vm.assume(amount != 0);
        amount = bound(amount, 1, 1_000_000 * 10 ** ldyToken.decimals());
        stakingPeriodIndex = uint8(bound(stakingPeriodIndex, 0, stakingDurations.length - 1));
        deal(address(ldyToken), account, amount);

        // stake
        vm.startPrank(account);
        ldyToken.approve(address(ldyStaking), amount);
        ldyStaking.stake(amount, stakingPeriodIndex);
        vm.stopPrank();

        // unstake fail
        vm.expectRevert("not allowed unstaking in the staking period");
        vm.prank(account);
        ldyStaking.unstake(amount, 0);

        uint256 skipDuration = stakingDurations[stakingPeriodIndex];
        skip(skipDuration);

        vm.expectRevert("insufficient amount");
        vm.prank(account);
        ldyStaking.unstake(amount + 1, 0);

        vm.expectRevert("invalid stakeIndex");
        vm.prank(account);
        ldyStaking.unstake(amount + 1, 100);
    }

    function testFuzz_Unstake_1(
        address account1,
        uint256 amount1,
        uint256 amount2,
        uint8 stakingPeriodIndex1,
        uint8 stakingPeriodIndex2
    ) public {
        vm.assume(account1 != address(0));
        vm.assume(account1 != address(ldyToken));
        vm.assume(account1 != address(ldyStaking));
        vm.assume(amount1 != 0);
        vm.assume(amount2 != 0);

        amount1 = bound(amount1, 1, 1_000_000 * 10 ** ldyToken.decimals());
        amount2 = bound(amount1, 1, 1_000_000 * 10 ** ldyToken.decimals());
        stakingPeriodIndex1 = uint8(bound(stakingPeriodIndex1, 0, stakingDurations.length - 1));
        stakingPeriodIndex2 = uint8(bound(stakingPeriodIndex2, 0, stakingDurations.length - 1));
        deal(address(ldyToken), account1, amount1 + amount2);

        // account1 stakes ldy into the ldyStaking contract first time
        vm.startPrank(account1);
        ldyToken.approve(address(ldyStaking), amount1 + amount2);
        ldyStaking.stake(amount1, stakingPeriodIndex1);

        // account1 stakes ldy into the ldyStaking contract again
        ldyStaking.stake(amount2, stakingPeriodIndex2);
        vm.stopPrank();

        // account1 unstakes token from staking pool 1
        uint256 skipDuration1 = stakingDurations[stakingPeriodIndex1];
        skip(skipDuration1);
        vm.startPrank(account1);
        uint256 earned1 = ldyStaking.earned(account1, 0);
        ldyStaking.unstake(amount1, 0);
        vm.stopPrank();
        assertEq(ldyToken.balanceOf(account1), amount1 + earned1);

        // account1 unstakes token from staking pool 2
        uint256 skipDuration2 = stakingDurations[stakingPeriodIndex2];
        skip(skipDuration2);
        vm.startPrank(account1);
        uint256 earned2 = ldyStaking.earned(account1, 0);
        ldyStaking.unstake(amount2, 0);
        vm.stopPrank();
        assertEq(ldyToken.balanceOf(account1), amount1 + earned1 + amount2 + earned2);
    }

    function testFuzz_Unstake_2(address account, uint256 amount, uint8 stakingPeriodIndex) public {
        vm.assume(account != address(0));
        vm.assume(account != address(ldyToken));
        vm.assume(account != address(ldyStaking));
        vm.assume(amount != 0);

        amount = bound(amount, 100, 1_000_000 * 10 ** ldyToken.decimals());

        stakingPeriodIndex = uint8(bound(stakingPeriodIndex, 0, stakingDurations.length - 1));
        deal(address(ldyToken), account, amount);

        // account stakes ldy into the ldyStaking contract
        vm.startPrank(account);
        ldyToken.approve(address(ldyStaking), amount);
        ldyStaking.stake(amount, stakingPeriodIndex);
        vm.stopPrank();

        // account unstakes part of token
        uint256 skipDuration = stakingDurations[stakingPeriodIndex];
        uint256 partAmount = bound(amount, 1, amount - 1);
        skip(skipDuration);
        vm.startPrank(account);
        ldyStaking.unstake(partAmount, 0);
        vm.stopPrank();
        assertEq(ldyToken.balanceOf(account), partAmount);

        // account unstakes rest of token after 100 secs
        uint256 restAmount = amount - partAmount;
        skip(100);
        vm.startPrank(account);
        uint256 earned = ldyStaking.earned(account, 0);
        assertGt(earned, 0);
        ldyStaking.unstake(restAmount, 0);
        vm.stopPrank();
        assertEq(ldyToken.balanceOf(account), amount + earned);
    }

    function testFuzz_GetReward_Failed(
        address account,
        uint256 amount,
        uint8 stakingPeriodIndex
    ) public {
        vm.assume(account != address(0));
        vm.assume(account != address(ldyToken));
        vm.assume(account != address(ldyStaking));
        vm.assume(amount != 0);

        amount = bound(amount, 100, 1_000_000 * 10 ** ldyToken.decimals());

        stakingPeriodIndex = uint8(bound(stakingPeriodIndex, 0, stakingDurations.length - 1));
        deal(address(ldyToken), account, amount);

        // account stakes ldy into the ldyStaking contract
        vm.startPrank(account);
        ldyToken.approve(address(ldyStaking), amount);
        ldyStaking.stake(amount, stakingPeriodIndex);
        vm.stopPrank();

        vm.expectRevert("invalid stakeIndex");
        vm.prank(account);
        ldyStaking.getReward(100);
    }

    function testFuzz_GetReward(address account, uint256 amount, uint8 stakingPeriodIndex) public {
        vm.assume(account != address(0));
        vm.assume(account != address(ldyToken));
        vm.assume(account != address(ldyStaking));
        vm.assume(amount != 0);

        amount = bound(amount, 100, 1_000_000 * 10 ** ldyToken.decimals());

        stakingPeriodIndex = uint8(bound(stakingPeriodIndex, 0, stakingDurations.length - 1));
        deal(address(ldyToken), account, amount);

        // account stakes ldy into the ldyStaking contract
        vm.startPrank(account);
        ldyToken.approve(address(ldyStaking), amount);
        ldyStaking.stake(amount, stakingPeriodIndex);
        vm.stopPrank();

        // get rewards
        vm.prank(account);
        ldyStaking.getReward(0);
        uint256 rewards0 = ldyToken.balanceOf(account);
        assertEq(rewards0, 0);

        skip(100);
        vm.prank(account);
        ldyStaking.getReward(0);
        uint256 rewards1 = ldyToken.balanceOf(account);
        assertGt(rewards1, 0);
    }

    function test_SetRewardsDurationByOwner() public {
        address nonOwner = address(1234);
        expectRevertOnlyOwner();
        vm.prank(nonOwner);
        ldyStaking.setRewardsDuration(123);

        skip(oneMonth);

        uint256 newRewardsDuration = 6 * oneMonth;
        vm.expectRevert("reward duration is not finished");
        ldyStaking.setRewardsDuration(newRewardsDuration);

        skip(initRewardsDuration);
        ldyStaking.setRewardsDuration(newRewardsDuration);
    }

    function test_NotifyRewardAmountByOwner() public {
        address nonOwner = address(1234);
        expectRevertOnlyOwner();
        vm.prank(nonOwner);
        ldyStaking.notifyRewardAmount(123);

        vm.expectRevert("amount = 0");
        ldyStaking.notifyRewardAmount(0);

        uint256 rewardsAmount = 1_000_000e18;
        deal(address(ldyToken), address(this), rewardsAmount);
        ldyToken.approve(address(ldyStaking), rewardsAmount);
        ldyStaking.notifyRewardAmount(rewardsAmount);
    }
}
