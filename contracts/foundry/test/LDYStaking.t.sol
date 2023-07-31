// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../lib/forge-std/src/Test.sol";
import {ModifiersExpectations} from "./_helpers/ModifiersExpectations.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import {LDYStaking} from "../../src/LDYStaking.sol";
import {GlobalOwner} from "../../src/GlobalOwner.sol";
import {GlobalPause} from "../../src/GlobalPause.sol";
import {GlobalBlacklist} from "../../src/GlobalBlacklist.sol";
import {GenericERC20} from "../../src/GenericERC20.sol";

import {UDS3} from "../../src/libs/UDS3.sol";
import {APRCheckpoints as APRC} from "../../src/libs/APRCheckpoints.sol";

contract TestedContract is LDYStaking {
    /**
     * @dev Make some useful InvestUpgradeable functions public to use them in tests
     */
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

    function public_getLockDurationIncrease(
        address account,
        uint256 addedAmount
    ) public view returns (uint40 lockEndIncrease) {
        return _getLockDurationIncrease(account, addedAmount);
    }

    function public_accountsInfos(address account) public view returns (AccountInfos memory) {
        return accountsInfos[account];
    }

    // function public_getStartCheckpointReferenceOf(
    //     address account
    // ) public view returns (APRC.Reference memory) {
    //     return ___getStartCheckpointReferenceOf(account);
    // }
}

contract Tests is Test, ModifiersExpectations {
    TestedContract tested;
    GlobalOwner globalOwner;
    GlobalPause globalPause;
    GlobalBlacklist globalBlacklist;
    GenericERC20 ldyToken;
    GenericERC20 anotherToken;

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

        // Deploy GenericERC20 (another random token)
        anotherToken = new GenericERC20("Dummy Token", "DUMMY", 18);
        vm.label(address(ldyToken), "DUMMY token");

        // Deploy tested contract
        TestedContract impl4 = new TestedContract();
        ERC1967Proxy proxy4 = new ERC1967Proxy(address(impl4), "");
        tested = TestedContract(address(proxy4));
        tested.initialize(
            address(globalOwner),
            address(globalPause),
            address(globalBlacklist),
            address(ldyToken)
        );
        vm.label(address(tested), "LDYStaking");
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
            address(ldyToken)
        );
    }

    function test_initialize_2() public {
        console.log("Should properly set global owner, pause and blacklist");
        assertEq(tested.globalOwner(), address(globalOwner));
        assertEq(tested.globalPause(), address(globalPause));
        assertEq(tested.globalBlacklist(), address(globalBlacklist));
    }

    function test_initialize_3() public {
        console.log("Should properly set invested token to $LDY token");
        assertEq(address(tested.invested()), address(ldyToken));
    }

    function test_initialize_4() public {
        console.log("Should initialize stake lock duration to 90 days");
        assertEq(tested.stakeLockDuration(), 90 days);
    }

    // ===============================
    // === recoverERC20() function ===
    function test_recoverERC20_1(address account, address tokenAddress, uint256 recoveredAmount) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.recoverERC20(tokenAddress, recoveredAmount);
    }

    function test_recoverERC20_2() public {
        console.log("Should revert if trying to recover $LDY token");
        vm.expectRevert(bytes("L21"));
        tested.recoverERC20(address(ldyToken), 0);
    }

    function test_recoverERC20_3() public {
        console.log("Shouldn't revert else");
        deal(address(anotherToken), address(tested), 1000, true);
        tested.recoverERC20(address(anotherToken), 500);
    }

    // =============================
    // === recoverLDY() function ===
    function test_recoverLDY_1(address account) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.recoverLDY();
    }

    function test_recoverLDY_2() public {
        console.log("Should revert if there is nothing to recover");
        vm.expectRevert(bytes("L22"));
        tested.recoverLDY();
    }

    function testFuzz_recoverLDY_3(uint16 aprUD3, uint256 fueledAmount, uint256 stakedAmount) public {
        console.log("Shouldn't allow recovering $LDY deposited through stake() or fuel() functions");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Bound fueled amount to [1, 1T]
        fueledAmount = uint216(bound(fueledAmount, 1, tested.public_toDecimals(100_000_000_000_000)));

        // Fuel random amount of $LDY to contract
        deal(address(ldyToken), address(this), fueledAmount, true);
        ldyToken.approve(address(tested), fueledAmount);
        tested.fuel(fueledAmount);

        // Bound staked amount to [1, 1T]
        stakedAmount = uint216(bound(stakedAmount, 1, tested.public_toDecimals(100_000_000_000_000)));

        // Stake random amount of $LDY to contract
        deal(address(ldyToken), address(1234), stakedAmount, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), stakedAmount);
        tested.stake(uint216(stakedAmount));
        vm.stopPrank();

        // Expect the function to consider there is nothing to recover
        vm.expectRevert(bytes("L22"));
        tested.recoverLDY();
    }

    function testFuzz_recoverLDY_4(uint256 recoverableAmount) public {
        console.log("Should transfer recoverable tokens to owner else");

        // Ensure recovered and recoverable is greater than 0
        vm.assume(recoverableAmount > 0);

        // Mint only random number of $LDY to contract
        deal(address(ldyToken), address(tested), recoverableAmount, true);

        // Assert that owner balance is currently 0
        assertEq(ldyToken.balanceOf(address(this)), 0);

        // Recover random amount of tokens
        tested.recoverLDY();

        // Check that recovered amount is now in owner balance
        assertEq(ldyToken.balanceOf(address(this)), recoverableAmount);
    }

    // ================================
    // === _investmentOf() function ===
    // No tests needed as it simply proxies stakeOf()
    // Low priority TODO: Add mirror tests for future safety

    // ============================
    // === rewardsOf() function ===
    // No tests needed as it simply proxies _rewardsOf()
    // Low priority TODO: Add mirror tests for future safety

    // ==========================
    // === stakeOf() function ===
    // No tests needed as it simply proxies accountsStakes[account].amount
    // Low priority TODO: Add mirror tests for future safety

    // ============================
    // === lockEndOf() function ===
    // No tests needed as it simply proxies accountsStakes[account].lockEnd
    // Low priority TODO: Add mirror tests for future safety

    // ===================================
    // === _getLockDurationIncrease() function ===
    function testFuzz__getLockDurationIncrease_1(uint256 addedAmount) public {
        console.log("Should return stakeLockDuration if the account has no previous stake");
        assertEq(
            tested.public_getLockDurationIncrease(address(1234), addedAmount),
            tested.stakeLockDuration()
        );
    }

    function testFuzz__getLockDurationIncrease_2(
        uint16 aprUD3,
        uint256 initialAmount,
        uint256 amountIncreaseUD3
    ) public {
        console.log(
            "Should return a time lock proportional to previous stake if the account has already staked and stake increase is lower than previous stake"
        );

        // Set first random APR
        tested.setAPR(aprUD3);

        // Exclude tiny amount increases and tiny initial amounts to prevent assertion failures because of precision loss.
        amountIncreaseUD3 = bound(amountIncreaseUD3, UDS3.scaleUp(1), UDS3.scaleUp(100));
        initialAmount = bound(initialAmount, 100, tested.public_toDecimals(100_000_000_000_000));

        // Simulate an initial stake
        deal(address(ldyToken), address(1234), initialAmount, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), initialAmount);
        tested.stake(uint216(initialAmount));
        vm.stopPrank();

        // Move forward stake lock duration in time to ensure lock has ended
        skip(tested.stakeLockDuration());

        // Compute added amount
        uint256 amountIncreaseUDS3 = tested.public_toDecimals(amountIncreaseUD3);
        uint256 addedAmountUDS3 = (UDS3.scaleUp(initialAmount) * amountIncreaseUDS3) /
            tested.public_toUDS3(100);
        uint256 addedAmount = UDS3.scaleDown(addedAmountUDS3);

        // Compute expected lock end increase
        uint256 expectedLockEndIncreaseUDS3 = (tested.public_toUDS3(tested.stakeLockDuration()) *
            amountIncreaseUDS3) / tested.public_toUDS3(100);
        uint40 expectedLockEndIncrease = uint40(tested.public_fromUDS3(expectedLockEndIncreaseUDS3));

        // Get lock duration increase
        uint40 lockEndIncrease = tested.public_getLockDurationIncrease(address(1234), addedAmount);

        // Get difference between expected and actual lock end increase
        uint256 difference = expectedLockEndIncrease > lockEndIncrease
            ? expectedLockEndIncrease - lockEndIncrease
            : lockEndIncrease - expectedLockEndIncrease;

        // Assert that difference is less than 1 day (else are precision loss)
        assertTrue(difference <= 1 days);
    }

    function testFuzz__getLockDurationIncrease_3(
        uint16 aprUD3,
        uint216 initialAmount,
        uint216 addedAmount
    ) public {
        console.log(
            "Should return full time lock if the account has already staked and stake increase is greater than previous stake"
        );

        // Set first random APR
        tested.setAPR(aprUD3);

        // Exclude tiny initial amounts to prevent assertion failures because of precision loss.
        initialAmount = uint216(
            bound(initialAmount, 100, tested.public_toDecimals(100_000_000_000_000))
        );

        // Ensure added amount is greater than initial amount
        addedAmount = uint216(
            bound(addedAmount, initialAmount, type(uint216).max / 10 ** (8 + ldyToken.decimals()))
        );

        // Simulate an initial stake
        deal(address(ldyToken), address(1234), initialAmount, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), initialAmount);
        tested.stake(uint216(initialAmount));
        vm.stopPrank();

        // Move forward stake lock duration in time to ensure lock has ended
        skip(tested.stakeLockDuration());

        // Get lock duration increase
        uint40 lockEndIncrease = tested.public_getLockDurationIncrease(address(1234), addedAmount);

        // Assert that lock duration increase is equal to stake lock duration
        assertEq(lockEndIncrease, tested.stakeLockDuration());
    }

    // =============================
    // === getNewLockEndFor() function ===
    function test_getNewLockEndFor_1(uint16 aprUD3, uint216 initialAmount, uint216 addedAmount) public {
        console.log("Should return now timestamp + lock end increase");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Exclude tiny initial amounts to prevent assertion failures because of precision loss.
        initialAmount = uint216(
            bound(initialAmount, 100, tested.public_toDecimals(100_000_000_000_000))
        );

        // Ensure added amount is greater than initial amount
        addedAmount = uint216(
            bound(addedAmount, initialAmount, type(uint216).max / 10 ** (8 + ldyToken.decimals()))
        );

        // Simulate an initial stake
        deal(address(ldyToken), address(1234), initialAmount, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), initialAmount);
        tested.stake(uint216(initialAmount));
        vm.stopPrank();

        // Get lock duration increase
        uint40 lockEndIncrease = tested.public_getLockDurationIncrease(address(1234), addedAmount);

        // Get new lock end
        uint40 newLockEnd = tested.getNewLockEndFor(address(1234), addedAmount);

        // Assert that new lock end is now timestamp + lock end increase
        assertEq(newLockEnd, uint40(block.timestamp + lockEndIncrease));
    }

    // ====================================
    // === setUnlockFeesRate() function ===
    function testFuzz_setUnlockFeesRate_1(address account, uint32 _unlockFeesRateUD3) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.setUnlockFeesRate(_unlockFeesRateUD3);
    }

    function testFuzz_setUnlockFeesRate_2(uint32 _unlockFeesRateUD3) public {
        console.log("Should change value of unlockFeesRateUD3");
        tested.setUnlockFeesRate(_unlockFeesRateUD3);
        assertEq(tested.unlockFeesRateUD3(), _unlockFeesRateUD3);
    }

    // ====================================
    // === setStakeLockDuration() function ===
    function testFuzz_setStakeLockDuration_1(address account, uint40 _stakeLockDuration) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.setStakeLockDuration(_stakeLockDuration);
    }

    function testFuzz_setStakeLockDuration_2(uint40 _stakeLockDuration) public {
        console.log("Should change value of stakeLockDuration");
        tested.setStakeLockDuration(_stakeLockDuration);
        assertEq(tested.stakeLockDuration(), _stakeLockDuration);
    }

    // =======================
    // === fuel() function ===
    function testFuzz_fuel_1(address account, uint256 amount) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.fuel(amount);
    }

    function testFuzz_fuel_2() public {
        console.log("Should revert if given amount is 0");
        vm.expectRevert(bytes("L23"));
        tested.fuel(0);
    }

    function testFuzz_fuel_3(uint256 amount) public {
        console.log("Should transfer funds from owner to contract");

        // Ensure fueled amount is greater than 0
        vm.assume(amount > 0);

        // Mint tokens to owner
        deal(address(ldyToken), address(this), amount, true);

        // Store old owner and contract balances for later comparison
        uint256 oldOwnerBalance = ldyToken.balanceOf(address(this));
        uint256 oldContractBalance = ldyToken.balanceOf(address(tested));

        // Fuel contract
        ldyToken.approve(address(tested), amount);
        tested.fuel(amount);

        // Assert that owner balance has decreased by amount
        assertEq(ldyToken.balanceOf(address(this)), oldOwnerBalance - amount);

        // Assert that contract balance has increased by amount
        assertEq(ldyToken.balanceOf(address(tested)), oldContractBalance + amount);
    }

    function testFuzz_fuel_4(uint256 amount) public {
        console.log("Should increase rewards reserve state accordingly");

        // Ensure fueled amount is greater than 0
        vm.assume(amount > 0);

        // Store old rewards reserve state for later comparison
        uint256 oldRewardsReserve = tested.rewardsReserve();

        // Mint tokens to owner
        deal(address(ldyToken), address(this), amount, true);

        // Fuel contract
        ldyToken.approve(address(tested), amount);
        tested.fuel(amount);

        // Assert that rewards reserve has increased by amount
        assertEq(tested.rewardsReserve(), oldRewardsReserve + amount);
    }

    // =========================
    // === unlock() function ===
    function testFuzz_unlock_1() public {
        console.log("Should revert if contract is paused ");
        globalPause.pause();
        expectRevertPaused();
        tested.unlock();
    }

    function testFuzz_unlock_2(address account) public {
        console.log("Should revert if account is blacklisted");

        // Ensure account is not the zero address
        vm.assume(account != address(0));

        // Blacklist account
        globalBlacklist.blacklist(account);

        // Expect revert
        expectRevertRestricted();
        vm.prank(account);
        tested.unlock();
    }

    function testFuzz_unlock_3() public {
        console.log("Should revert if caller has no stake yet");

        vm.expectRevert(bytes("L24"));
        tested.unlock();
    }

    function testFuzz_unlock_4(uint16 aprUD3, uint216 amount) public {
        console.log("Should revert if lockEndOf() caller is in the past");

        // Bound amount to [1, 1T]
        amount = uint216(bound(amount, 1, tested.public_toDecimals(100_000_000_000_000)));

        // Set first random APR
        tested.setAPR(aprUD3);

        // Simulate an initial stake
        deal(address(ldyToken), address(1234), amount, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), amount);
        tested.stake(uint216(amount));
        vm.stopPrank();

        // Move forward stake lock duration in time to ensure lock has ended
        skip(tested.stakeLockDuration());

        // Expect revert
        vm.expectRevert(bytes("L24"));
        vm.prank(address(1234));
        tested.unlock();
    }

    function testFuzz_unlock_5(uint16 aprUD3, uint216 amount) public {
        console.log("Should allow to unstake is stake else");

        // Ensure staked amount is greater than 0
        vm.assume(amount > 0);

        // Set first random APR
        tested.setAPR(aprUD3);

        // Set unlock fees to 0 to prevent changes between staked and unstaked amounts
        tested.setUnlockFeesRate(0);

        // Simulate an initial stake
        deal(address(ldyToken), address(1234), amount, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), amount);
        tested.stake(amount);

        // Expect revert when trying to unstake before lock end
        vm.expectRevert(bytes("L29"));
        tested.unstake(amount);

        // Unlock stake
        tested.unlock();

        // Unstaking should now succeed
        tested.unstake(amount);
        vm.stopPrank();
    }

    function testFuzz_unlock_6(uint16 aprUD3, uint216 amount, uint32 unlockFeesRateUD3) public {
        console.log("Should decreases staked amount by unlock fees rate");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Exclude tiny amounts to prevent assertion failures because of precision loss.
        amount = uint216(bound(amount, 10000, tested.public_toDecimals(100_000_000_000_000)));

        // Ensure unlock fees rate never exceeds 100%
        unlockFeesRateUD3 = uint32(bound(unlockFeesRateUD3, 0, UDS3.scaleUp(100)));

        // Randomly set unlock fees rate
        tested.setUnlockFeesRate(unlockFeesRateUD3);

        // Simulate an initial stake
        deal(address(ldyToken), address(1234), amount, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), amount);
        tested.stake(amount);

        // Unlock stake
        tested.unlock();
        vm.stopPrank();

        // Compute applied fees rate from before and after staking amounts
        uint256 variationUDS3 = UDS3.scaleUp(amount - tested.stakeOf(address(1234)));
        uint256 appliedFeesRateUDS3 = (variationUDS3 * tested.public_toUDS3(100)) / UDS3.scaleUp(amount);
        uint32 appliedFeesRateUD3 = uint32(tested.public_fromDecimals(appliedFeesRateUDS3));

        // Assert that applied fees rate is equal to unlock fees rate
        uint256 difference = appliedFeesRateUD3 > unlockFeesRateUD3
            ? appliedFeesRateUD3 - unlockFeesRateUD3
            : unlockFeesRateUD3 - appliedFeesRateUD3;

        // Allow 0.01% of error margin
        assertTrue(difference <= 10);
    }

    function testFuzz_unlock_7(uint16 aprUD3, uint216 amount, uint32 unlockFeesRateUD3) public {
        console.log("Should burn unlock fees (total supply should decrease by fees amount)");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap invested amount to 100T
        amount = uint216(bound(amount, 1, tested.public_toDecimals(100_000_000_000_000)));

        // Ensure unlock fees rate never exceeds 100%
        unlockFeesRateUD3 = uint32(bound(unlockFeesRateUD3, 0, UDS3.scaleUp(100)));

        // Randomly set unlock fees rate
        tested.setUnlockFeesRate(unlockFeesRateUD3);

        // Simulate an initial stake
        deal(address(ldyToken), address(1234), amount, true);

        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), amount);
        tested.stake(amount);

        // Store $LDY old total supply for later comparison
        uint256 oldTotalSupply = ldyToken.totalSupply();

        // Unlock stake
        tested.unlock();
        vm.stopPrank();

        // Compute fees amount
        uint256 feesAmount = amount - tested.stakeOf(address(1234));

        // Assert that total supply has decreased by fees amount
        assertEq(ldyToken.totalSupply(), oldTotalSupply - feesAmount);
    }

    // ========================
    // === stake() function ===
    function testFuzz_stake_1(uint216 amount) public {
        console.log("Should revert if contract is paused ");
        globalPause.pause();
        expectRevertPaused();
        tested.stake(amount);
    }

    function testFuzz_stake_2(address account, uint216 amount) public {
        console.log("Should revert if account is blacklisted");
        // Ensure account is not the zero address
        vm.assume(account != address(0));

        // Blacklist account
        globalBlacklist.blacklist(account);

        // Expect revert
        expectRevertRestricted();
        vm.prank(account);
        tested.stake(amount);
    }

    function test_stake_3() public {
        console.log("Should revert if given amount is 0");
        vm.expectRevert(bytes("L25"));
        tested.stake(0);
    }

    function testFuzz_stake_4(uint16 aprUD3, uint216 accountBalance, uint216 investedAmount) public {
        console.log("Should revert if given amount is lower than account's $LDY balance");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap investedAmount to 100T
        investedAmount = uint216(
            bound(investedAmount, 1, tested.public_toDecimals(100_000_000_000_000))
        );

        // Ensure account balance is lower than invested amount
        accountBalance = uint216(bound(accountBalance, 0, investedAmount - 1));

        // Mint $LDY to account
        deal(address(ldyToken), address(1234), accountBalance, true);

        // Simulate an initial stake and expect revert
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), investedAmount);
        vm.expectRevert(bytes("L26"));
        tested.stake(uint216(investedAmount));
        vm.stopPrank();
    }

    function test_stake_5(uint16 aprUD3, uint216 amount, uint256 duration) public {
        console.log("Should reset investment period of account");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap invested amount to 100T
        amount = uint216(bound(amount, 2, tested.public_toDecimals(100_000_000_000_000)));

        // Cap duration to 1000 years
        duration = bound(duration, 1, 1000 * 365 days);

        // Simulate an initial stake
        deal(address(ldyToken), address(1234), amount, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), amount);
        tested.stake(amount - 1);

        // Move forward a random duration
        skip(duration);

        // Stake again
        tested.stake(1);
        vm.stopPrank();

        // Ensure that the investment period timestamp has been updated to now
        assertEq(tested.public_accountsInfos(address(1234)).period.timestamp, block.timestamp);
    }

    function test_stake_6(uint16 aprUD3, uint216 amount) public {
        console.log("Should increase stake of account");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap invested amount to 100T
        amount = uint216(bound(amount, 1, tested.public_toDecimals(100_000_000_000_000)));

        // Store old account stake for later comparison
        uint256 oldStake = tested.stakeOf(address(1234));

        // Simulate an initial stake
        deal(address(ldyToken), address(1234), amount, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), amount);
        tested.stake(amount);

        // Ensure that the account stake has been updated
        assertEq(tested.stakeOf(address(1234)), oldStake + amount);
    }

    function test_stake_7(uint16 aprUD3, uint216 amount) public {
        console.log("Should increase total staked");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap invested amount to 100T
        amount = uint216(bound(amount, 1, tested.public_toDecimals(100_000_000_000_000)));

        // Store old total staked
        uint256 oldTotalStaked = tested.totalStaked();

        // Simulate an initial stake
        deal(address(ldyToken), address(1234), amount, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), amount);
        tested.stake(amount);

        // Ensure that the account stake has been updated
        assertEq(tested.totalStaked(), oldTotalStaked + amount);
    }

    function test_stake_8(uint16 aprUD3, uint216 amount) public {
        console.log("Should increase account's stake lock end");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap invested amount to 100T
        amount = uint216(bound(amount, 1, tested.public_toDecimals(100_000_000_000_000)));

        // Store old lock end of account for later comparison
        uint256 lockEndIncrease = tested.public_getLockDurationIncrease(address(1234), amount);

        // Simulate an initial stake
        deal(address(ldyToken), address(1234), amount, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), amount);
        tested.stake(amount);
        vm.stopPrank();

        // Ensure that the account stake has been updated
        assertEq(tested.lockEndOf(address(1234)), block.timestamp + lockEndIncrease);
    }

    function test_stake_9(uint16 aprUD3, uint216 amount) public {
        console.log("Should transfer tokens from caller to contract");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap invested amount to 100T
        amount = uint216(bound(amount, 1, tested.public_toDecimals(100_000_000_000_000)));

        // Mint random amount of $LDY to caller
        deal(address(ldyToken), address(1234), amount, true);

        // Store old balance of caller and contract for later comparison
        uint256 oldCallerBalance = ldyToken.balanceOf(address(1234));
        uint256 oldContractBalance = ldyToken.balanceOf(address(tested));

        // Simulate an initial stake
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), amount);
        tested.stake(amount);
        vm.stopPrank();

        // Ensure that the caller balance has been updated
        assertEq(ldyToken.balanceOf(address(1234)), oldCallerBalance - amount);

        // Ensure that the contract balance has been updated
        assertEq(ldyToken.balanceOf(address(tested)), oldContractBalance + amount);
    }

    // ==========================
    // === unstake() function ===
    function testFuzz_unstake_1(uint216 amount) public {
        console.log("Should revert if contract is paused");
        globalPause.pause();
        expectRevertPaused();
        tested.unstake(amount);
    }

    function testFuzz_unstake_2(address account, uint216 amount) public {
        console.log("Should revert if account is blacklisted");
        // Ensure account is not the zero address
        vm.assume(account != address(0));

        // Blacklist account
        globalBlacklist.blacklist(account);

        // Expect revert
        expectRevertRestricted();
        vm.prank(account);
        tested.unstake(amount);
    }

    function test_unstake_3() public {
        console.log("Should revert if given amount is 0");
        vm.expectRevert(bytes("L27"));
        tested.unstake(0);
    }

    function testFuzz_unstake_4(uint16 aprUD3, uint216 accountStake, uint216 withdrawnAmount) public {
        console.log("Should revert if given amount is lower than account's $LDY stake");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap withdrawnAmount to 100T
        withdrawnAmount = uint216(
            bound(withdrawnAmount, 2, tested.public_toDecimals(100_000_000_000_000))
        );

        // Ensure account balance is lower than invested amount
        accountStake = uint216(bound(accountStake, 1, withdrawnAmount - 1));

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake));

        // Ensure that the unstake reverts
        vm.expectRevert(bytes("L28"));
        tested.unstake(withdrawnAmount);
        vm.stopPrank();
    }

    function testFuzz_unstake_5(uint16 aprUD3, uint216 accountStake, uint216 withdrawnAmount) public {
        console.log("Should revert if stake is still locked");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 1, tested.public_toDecimals(100_000_000_000_000)));

        // Ensure account balance is lower than invested amount
        withdrawnAmount = uint216(bound(withdrawnAmount, 1, accountStake));

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake));

        // Ensure that the unstake reverts
        vm.expectRevert(bytes("L29"));
        tested.unstake(withdrawnAmount);
        vm.stopPrank();
    }

    function testFuzz_unstake_6(
        uint16 aprUD3,
        uint216 accountStake,
        uint216 withdrawnAmount,
        uint256 duration
    ) public {
        console.log("Should reset investment period of account");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 1, tested.public_toDecimals(100_000_000_000_000)));

        // Ensure duration is greater than stake lock duration and lower than 1000 years
        duration = bound(duration, tested.stakeLockDuration() + 1, 1000 * 365 days);

        // Ensure account balance is lower than invested amount
        withdrawnAmount = uint216(bound(withdrawnAmount, 1, accountStake));

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake));

        // Ensure lock period is over
        skip(duration);

        // Unstake a random amount
        tested.unstake(withdrawnAmount);
        vm.stopPrank();

        // Ensure that the investment period timestamp has been updated to now
        assertEq(tested.public_accountsInfos(address(1234)).period.timestamp, block.timestamp);
    }

    function testFuzz_unstake_7(uint16 aprUD3, uint216 accountStake, uint216 withdrawnAmount) public {
        console.log("Should decrease account stake of caller");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 1, tested.public_toDecimals(100_000_000_000_000)));

        // Ensure account balance is lower than invested amount
        withdrawnAmount = uint216(bound(withdrawnAmount, 1, accountStake));

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake));

        // Store old stake of caller for later comparison
        uint256 oldStake = tested.stakeOf(address(1234));
        assertTrue(oldStake > 0);

        // Ensure lock period is over
        skip(tested.stakeLockDuration());

        // Unstake a random amount
        tested.unstake(withdrawnAmount);
        vm.stopPrank();

        // Assert that the stake of the caller has been properly decreased
        assertEq(tested.stakeOf(address(1234)), oldStake - withdrawnAmount);
    }

    function testFuzz_unstake_8(uint16 aprUD3, uint216 accountStake, uint216 withdrawnAmount) public {
        console.log("Should decrease total staked amount");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 1, tested.public_toDecimals(100_000_000_000_000)));

        // Ensure account balance is lower than invested amount
        withdrawnAmount = uint216(bound(withdrawnAmount, 1, accountStake));

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake));

        // Store old total staked amount for later comparison
        uint256 oldTotalStaked = tested.stakeOf(address(1234));
        assertTrue(oldTotalStaked > 0);

        // Ensure lock period is over
        skip(tested.stakeLockDuration());

        // Unstake a random amount
        tested.unstake(withdrawnAmount);
        vm.stopPrank();

        // Assert that the stake of the caller has been properly decreased
        assertEq(tested.totalStaked(), oldTotalStaked - withdrawnAmount);
    }

    function test_unstake_9(uint16 aprUD3, uint216 accountStake, uint216 withdrawnAmount) public {
        console.log("Should transfer tokens from contract to caller");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 1, tested.public_toDecimals(100_000_000_000_000)));

        // Ensure account balance is lower than invested amount
        withdrawnAmount = uint216(bound(withdrawnAmount, 1, accountStake));

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake));

        // Store old balance of caller and contract for later comparison
        uint256 oldCallerBalance = ldyToken.balanceOf(address(1234));
        uint256 oldContractBalance = ldyToken.balanceOf(address(tested));

        // Ensure lock period is over
        skip(tested.stakeLockDuration());

        // Unstake a random amount
        tested.unstake(withdrawnAmount);
        vm.stopPrank();

        // Ensure that the caller balance has been updated
        assertEq(ldyToken.balanceOf(address(1234)), oldCallerBalance + withdrawnAmount);

        // Ensure that the contract balance has been updated
        assertEq(ldyToken.balanceOf(address(tested)), oldContractBalance - withdrawnAmount);
    }

    // ========================
    // === claim() function ===
    function test_claim_1() public {
        console.log("Should revert if contract is paused");
        globalPause.pause();
        expectRevertPaused();
        tested.claim();
    }

    function testFuzz_claim_2(address account) public {
        console.log("Should revert if account is blacklisted");
        // Ensure account is not the zero address
        vm.assume(account != address(0));

        // Blacklist account
        globalBlacklist.blacklist(account);

        // Expect revert
        expectRevertRestricted();
        vm.prank(account);
        tested.claim();
    }

    function testFuzz_claim_3(uint16 aprUD3, uint216 accountStake, uint40 investmentDuration) public {
        console.log("Should reset investment period of account");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100B
        accountStake = uint216(bound(accountStake, 1, tested.public_toDecimals(100_000_000_000)));

        // Bound duration to prevent overflow
        investmentDuration = uint40(bound(investmentDuration, 0, type(uint40).max - block.timestamp));

        // Fill rewards reserve
        uint256 rewardsAmount = type(uint256).max - accountStake;
        deal(address(ldyToken), address(this), rewardsAmount, true);
        ldyToken.approve(address(tested), rewardsAmount);
        tested.fuel(rewardsAmount);

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake));

        // Move forward a random amount of time
        skip(investmentDuration);

        // Retrieve account's unclaimed rewards and consider only runs where there are some rewards
        uint256 unclaimedRewards = tested.rewardsOf(address(1234));
        vm.assume(unclaimedRewards > 0);

        // Claim rewards
        tested.claim();
        vm.stopPrank();

        // Ensure that the investment period timestamp has been updated to now
        assertEq(tested.public_accountsInfos(address(1234)).period.timestamp, block.timestamp);
    }

    function testFuzz_claim_4(uint16 aprUD3, uint216 accountStake, uint40 investmentDuration) public {
        console.log("Should revert when there is no rewards to claim");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 2, tested.public_toDecimals(100_000_000_000_000)));

        // Bound duration to prevent overflow
        investmentDuration = uint40(bound(investmentDuration, 1, block.timestamp + 365 days * 1000));

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake - 1));
        vm.stopPrank();

        // Move forward a random amount of time
        skip(investmentDuration);

        // Compute unclaimed rewards and ensure they are 0
        uint256 unclaimedRewards = tested.rewardsOf(address(1234));
        vm.assume(unclaimedRewards == 0);

        // Claim rewards
        vm.expectRevert(bytes("L30"));
        vm.prank(address(1234));
        tested.claim();
    }

    function testFuzz_claim_5(uint16 aprUD3, uint216 accountStake, uint40 investmentDuration) public {
        console.log("Should reset account virtual balance");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 2, tested.public_toDecimals(100_000_000_000_000)));

        // Bound duration to prevent overflow
        investmentDuration = uint40(bound(investmentDuration, 1, block.timestamp + 365 days * 1000));

        // Fill rewards reserve
        uint256 rewardsAmount = type(uint256).max - accountStake;
        deal(address(ldyToken), address(this), rewardsAmount, true);
        ldyToken.approve(address(tested), rewardsAmount);
        tested.fuel(rewardsAmount);

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake - 1));

        // Move forward a random amount of time
        skip(investmentDuration);

        // Stake again to indirectly trigger _onInvestmentChange and compound rewards in virtual balance
        tested.stake(uint216(1));

        // Consider only cases were there are some rewards at that point
        vm.assume(tested.public_accountsInfos(address(1234)).virtualBalance > 0);

        // Claim rewards
        tested.claim();
        vm.stopPrank();

        // Assert that virtual balance has been reset after claim
        assertEq(tested.public_accountsInfos(address(1234)).virtualBalance, 0);
    }

    function testFuzz_claim_6(
        uint16 aprUD3,
        uint216 accountStake,
        uint40 investmentDuration,
        uint216 rewardsReserve
    ) public {
        console.log("Should revert when rewards reserve doesn't hold enough tokens");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 2, tested.public_toDecimals(100_000_000_000_000)));

        // Bound duration to prevent overflow
        investmentDuration = uint40(bound(investmentDuration, 1, block.timestamp + 365 days * 1000));

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake - 1));
        vm.stopPrank();

        // Move forward a random amount of time
        skip(investmentDuration);

        // Retrieve account's unclaimed rewards and consider only runs where there are some rewards
        uint256 unclaimedRewards = tested.rewardsOf(address(1234));
        vm.assume(unclaimedRewards > 0);

        // Ensure rewards reserve is smaller than rewards amount
        rewardsReserve = uint216(
            bound(rewardsReserve, 0, unclaimedRewards > 0 ? unclaimedRewards - 1 : 0)
        );

        // Fill rewards reserve
        if (rewardsReserve > 0) {
            deal(address(ldyToken), address(this), rewardsReserve, true);
            ldyToken.approve(address(tested), rewardsReserve);
            tested.fuel(rewardsReserve);
        }

        // Claim rewards
        vm.expectRevert(bytes("L31"));
        vm.prank(address(1234));
        tested.claim();
    }

    function testFuzz_claim_7(
        uint16 aprUD3,
        uint216 accountStake,
        uint40 investmentDuration,
        uint216 rewardsReserve
    ) public {
        console.log("Should decrease rewards reserve");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 2, tested.public_toDecimals(100_000_000_000_000)));

        // Bound duration to prevent overflow
        investmentDuration = uint40(bound(investmentDuration, 1, block.timestamp + 365 days * 1000));

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake - 1));
        vm.stopPrank();

        // Move forward a random amount of time
        skip(investmentDuration);

        // Retrieve account's unclaimed rewards and consider only runs where there are some rewards
        uint256 unclaimedRewards = tested.rewardsOf(address(1234));
        vm.assume(unclaimedRewards > 0);

        // Ensure rewards greater than rewards amount
        rewardsReserve = uint216(bound(rewardsReserve, unclaimedRewards, type(uint216).max));

        // Fill rewards reserve
        deal(address(ldyToken), address(this), rewardsReserve, true);
        ldyToken.approve(address(tested), rewardsReserve);
        tested.fuel(rewardsReserve);

        // Claim rewards
        vm.prank(address(1234));
        tested.claim();

        // Assert that rewards reserve has been decreased
        assertEq(tested.rewardsReserve(), rewardsReserve - unclaimedRewards);
    }

    function testFuzz_claim_8(
        uint16 aprUD3,
        uint216 accountStake,
        uint40 investmentDuration,
        uint216 rewardsReserve
    ) public {
        console.log("Should transfer rewarded $LDY from contract to caller");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 2, tested.public_toDecimals(100_000_000_000_000)));

        // Bound duration to prevent overflow
        investmentDuration = uint40(bound(investmentDuration, 1, block.timestamp + 365 days * 1000));

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake - 1));
        vm.stopPrank();

        // Move forward a random amount of time
        skip(investmentDuration);

        // Retrieve account's unclaimed rewards and consider only runs where there are some rewards
        uint256 unclaimedRewards = tested.rewardsOf(address(1234));
        vm.assume(unclaimedRewards > 0);

        // Ensure rewards greater than rewards amount
        rewardsReserve = uint216(bound(rewardsReserve, unclaimedRewards, type(uint216).max));

        // Fill rewards reserve
        deal(address(ldyToken), address(this), rewardsReserve, true);
        ldyToken.approve(address(tested), rewardsReserve);
        tested.fuel(rewardsReserve);

        // Store old balance of caller and contract for later comparison
        uint256 oldCallerBalance = ldyToken.balanceOf(address(1234));
        uint256 oldContractBalance = ldyToken.balanceOf(address(tested));

        // Claim rewards
        vm.prank(address(1234));
        tested.claim();

        // Ensure that the caller balance has been updated
        assertEq(ldyToken.balanceOf(address(1234)), oldCallerBalance + unclaimedRewards);

        // Ensure that the contract balance has been updated
        assertEq(ldyToken.balanceOf(address(tested)), oldContractBalance - unclaimedRewards);
    }

    // ===========================
    // === compound() function ===
    function test_compound_1() public {
        console.log("Should revert if contract is paused");
        globalPause.pause();
        expectRevertPaused();
        tested.compound();
    }

    function testFuzz_compound_2(address account) public {
        console.log("Should revert if account is blacklisted");
        // Ensure account is not the zero address
        vm.assume(account != address(0));

        // Blacklist account
        globalBlacklist.blacklist(account);

        // Expect revert
        expectRevertRestricted();
        vm.prank(account);
        tested.compound();
    }

    function testFuzz_compound_3(uint16 aprUD3, uint216 accountStake, uint40 investmentDuration) public {
        console.log("Should reset investment period of account");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100B
        accountStake = uint216(bound(accountStake, 1, tested.public_toDecimals(100_000_000_000)));

        // Bound duration to prevent overflow
        investmentDuration = uint40(bound(investmentDuration, 0, type(uint40).max - block.timestamp));

        // Fill rewards reserve
        uint256 rewardsAmount = type(uint256).max - accountStake;
        deal(address(ldyToken), address(this), rewardsAmount, true);
        ldyToken.approve(address(tested), rewardsAmount);
        tested.fuel(rewardsAmount);

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake));

        // Move forward a random amount of time
        skip(investmentDuration);

        // Retrieve account's unclaimed rewards and consider only runs where there are some rewards
        uint256 unclaimedRewards = tested.rewardsOf(address(1234));
        vm.assume(unclaimedRewards > 0);

        // Compound rewards
        tested.compound();
        vm.stopPrank();

        // Ensure that the investment period timestamp has been updated to now
        assertEq(tested.public_accountsInfos(address(1234)).period.timestamp, block.timestamp);
    }

    function testFuzz_compound_4(uint16 aprUD3, uint216 accountStake, uint40 investmentDuration) public {
        console.log("Should revert when there is no rewards to claim");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 2, tested.public_toDecimals(100_000_000_000_000)));

        // Bound duration to prevent overflow
        investmentDuration = uint40(bound(investmentDuration, 1, block.timestamp + 365 days * 1000));

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake - 1));
        vm.stopPrank();

        // Move forward a random amount of time
        skip(investmentDuration);

        // Compute unclaimed rewards and ensure they are 0
        uint256 unclaimedRewards = tested.rewardsOf(address(1234));
        vm.assume(unclaimedRewards == 0);

        // Compound rewards
        vm.expectRevert(bytes("L32"));
        vm.prank(address(1234));
        tested.compound();
    }

    function testFuzz_compound_5(uint16 aprUD3, uint216 accountStake, uint40 investmentDuration) public {
        console.log("Should reset account virtual balance");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 2, tested.public_toDecimals(100_000_000_000_000)));

        // Bound duration to prevent overflow
        investmentDuration = uint40(bound(investmentDuration, 1, block.timestamp + 365 days * 1000));

        // Fill rewards reserve
        uint256 rewardsAmount = type(uint256).max - accountStake;
        deal(address(ldyToken), address(this), rewardsAmount, true);
        ldyToken.approve(address(tested), rewardsAmount);
        tested.fuel(rewardsAmount);

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake - 1));

        // Move forward a random amount of time
        skip(investmentDuration);

        // Stake again to indirectly trigger _onInvestmentChange and compound rewards in virtual balance
        tested.stake(uint216(1));

        // Consider only cases were there are some rewards at that point
        vm.assume(tested.public_accountsInfos(address(1234)).virtualBalance > 0);

        // Compound rewards
        tested.compound();
        vm.stopPrank();

        // Assert that virtual balance has been reset after claim
        assertEq(tested.public_accountsInfos(address(1234)).virtualBalance, 0);
    }

    function testFuzz_compound_6(
        uint16 aprUD3,
        uint216 accountStake,
        uint40 investmentDuration,
        uint216 rewardsReserve
    ) public {
        console.log("Should revert when rewards reserve doesn't hold enough tokens");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 2, tested.public_toDecimals(100_000_000_000_000)));

        // Bound duration to prevent overflow
        investmentDuration = uint40(bound(investmentDuration, 1, block.timestamp + 365 days * 1000));

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake - 1));
        vm.stopPrank();

        // Move forward a random amount of time
        skip(investmentDuration);

        // Retrieve account's unclaimed rewards and consider only runs where there are some rewards
        uint256 unclaimedRewards = tested.rewardsOf(address(1234));
        vm.assume(unclaimedRewards > 0);

        // Ensure rewards reserve is smaller than rewards amount
        rewardsReserve = uint216(
            bound(rewardsReserve, 0, unclaimedRewards > 0 ? unclaimedRewards - 1 : 0)
        );

        // Fill rewards reserve
        if (rewardsReserve > 0) {
            deal(address(ldyToken), address(this), rewardsReserve, true);
            ldyToken.approve(address(tested), rewardsReserve);
            tested.fuel(rewardsReserve);
        }

        // Comound rewards
        vm.expectRevert(bytes("L33"));
        vm.prank(address(1234));
        tested.compound();
    }

    function testFuzz_compound_7(
        uint16 aprUD3,
        uint216 accountStake,
        uint40 investmentDuration,
        uint216 rewardsReserve
    ) public {
        console.log("Should decrease rewards reserve");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 2, tested.public_toDecimals(100_000_000_000_000)));

        // Bound duration to prevent overflow
        investmentDuration = uint40(bound(investmentDuration, 1, block.timestamp + 365 days * 1000));

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake - 1));
        vm.stopPrank();

        // Move forward a random amount of time
        skip(investmentDuration);

        // Retrieve account's unclaimed rewards and consider only runs where there are some rewards
        uint256 unclaimedRewards = tested.rewardsOf(address(1234));
        vm.assume(unclaimedRewards > 0);

        // Ensure rewards greater than rewards amount
        rewardsReserve = uint216(bound(rewardsReserve, unclaimedRewards, type(uint216).max));

        // Fill rewards reserve
        deal(address(ldyToken), address(this), rewardsReserve, true);
        ldyToken.approve(address(tested), rewardsReserve);
        tested.fuel(rewardsReserve);

        // Compound rewards
        vm.prank(address(1234));
        tested.compound();

        // Assert that rewards reserve has been decreased
        assertEq(tested.rewardsReserve(), rewardsReserve - unclaimedRewards);
    }

    function testFuzz_compound_8(
        uint16 aprUD3,
        uint216 accountStake,
        uint40 investmentDuration,
        uint216 rewardsReserve
    ) public {
        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 2, tested.public_toDecimals(100_000_000_000_000)));

        // Bound duration to prevent overflow
        investmentDuration = uint40(bound(investmentDuration, 1, block.timestamp + 365 days * 1000));

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake - 1));
        vm.stopPrank();

        // Move forward a random amount of time
        skip(investmentDuration);

        // Retrieve account's unclaimed rewards and consider only runs where there are some rewards
        uint256 unclaimedRewards = tested.rewardsOf(address(1234));
        vm.assume(unclaimedRewards > 0);

        // Ensure rewards greater than rewards amount
        rewardsReserve = uint216(bound(rewardsReserve, unclaimedRewards, type(uint216).max));

        // Fill rewards reserve
        deal(address(ldyToken), address(this), rewardsReserve, true);
        ldyToken.approve(address(tested), rewardsReserve);
        tested.fuel(rewardsReserve);

        // Store old account stake for later comparison
        uint256 oldStake = tested.stakeOf(address(1234));
        console.log("Should increase stake of account");

        // Compound rewards
        vm.prank(address(1234));
        tested.compound();

        // Ensure that the account stake has been updated
        assertEq(tested.stakeOf(address(1234)), oldStake + unclaimedRewards);
    }

    function testFuzz_compound_9(
        uint16 aprUD3,
        uint216 accountStake,
        uint40 investmentDuration,
        uint216 rewardsReserve
    ) public {
        // Set first random APR
        tested.setAPR(aprUD3);

        // Cap accountStake to 100T
        accountStake = uint216(bound(accountStake, 2, tested.public_toDecimals(100_000_000_000_000)));

        // Bound duration to prevent overflow
        investmentDuration = uint40(bound(investmentDuration, 1, block.timestamp + 365 days * 1000));

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStake, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStake);
        tested.stake(uint216(accountStake - 1));
        vm.stopPrank();

        // Move forward a random amount of time
        skip(investmentDuration);

        // Retrieve account's unclaimed rewards and consider only runs where there are some rewards
        uint256 unclaimedRewards = tested.rewardsOf(address(1234));
        vm.assume(unclaimedRewards > 0);

        // Ensure rewards greater than rewards amount
        rewardsReserve = uint216(bound(rewardsReserve, unclaimedRewards, type(uint216).max));

        // Fill rewards reserve
        deal(address(ldyToken), address(this), rewardsReserve, true);
        ldyToken.approve(address(tested), rewardsReserve);
        tested.fuel(rewardsReserve);

        // Store old total staked
        uint256 oldTotalStaked = tested.totalStaked();
        console.log("Should increase total staked");

        // Compound rewards
        vm.prank(address(1234));
        tested.compound();

        // Ensure that the account stake has been updated
        assertEq(tested.totalStaked(), oldTotalStaked + unclaimedRewards);
    }

    // ==========================
    // === setTier() function ===
    function testFuzz_setTier_1(address account, uint256 tier, uint256 amount) public {
        console.log("Should revert if not called by owner");

        // Ensure the random account is not the fund wallet
        vm.assume(account != tested.owner());

        // Ensure tier is greater than 0
        vm.assume(tier > 0);

        // Expect revert
        expectRevertOnlyOwner();
        vm.prank(account);
        tested.setTier(tier, amount);
    }

    function testFuzz_setTier_2(uint256 amount) public {
        console.log("Should revert if trying to set 0 tier");

        // Expect revert
        vm.expectRevert(bytes("L34"));
        tested.setTier(0, amount);
    }

    function testFuzz_setTier_3(uint256 amount, uint8 tier) public {
        console.log("Should create missing tiers slot in tiers array");

        // Ensure tier is greater than 0
        vm.assume(tier > 0);

        // Assert that no tiers exist yet by trying to get the first one
        vm.expectRevert(bytes("L38"));
        tested.getTier(1);

        // Set random tier with random amount
        tested.setTier(tier, amount);

        // Ensure that all tiers before the set tier have been initialized to 0
        for (uint8 i = 1; i < tier; i++) {
            assertEq(tested.getTier(i), 0);
        }
    }

    function testFuzz_setTier_4(uint8 currTier, uint256 currAmount, uint256 nextAmount) public {
        console.log("Should prevent setting a tier amount that is greater than next tier's one");

        // Ensure tier is greater than 0 and lower than uint8 max minus 1
        currTier = uint8(bound(currTier, 1, type(uint8).max - 1));

        // Ensure that next tier is greater than current tier
        uint8 nextTier = currTier + 1;

        // Bound current amount to [2, 100T]
        currAmount = bound(currAmount, 2, tested.public_toDecimals(100_000_000_000_000));

        // Ensure next amount is lower than current amount
        nextAmount = bound(nextAmount, 1, currAmount - 1);

        // Set next tier
        tested.setTier(nextTier, nextAmount);

        // Expect revert while setting current tier
        vm.expectRevert(bytes("L35"));
        tested.setTier(currTier, currAmount);
    }

    function testFuzz_setTier_5(uint8 currTier, uint256 currAmount, uint256 prevAmount) public {
        console.log("Should prevent setting a tier amount that is lower than previous tier's one");

        // Ensure tier is greater than 1 (one previous tier exists before it) and lower than uint8 max minus 1
        currTier = uint8(bound(currTier, 2, type(uint8).max));

        // Ensure that prev tier is lower than current tier
        uint8 prevTier = currTier - 1;

        // Bound prev amount amount to [2, 100T]
        prevAmount = bound(currAmount, 2, tested.public_toDecimals(100_000_000_000_000));

        // Ensure curren amount is lower than prev amount
        currAmount = bound(currAmount, 1, prevAmount - 1);

        // Set prev tier
        tested.setTier(prevTier, prevAmount);

        // Expect revert while setting current tier
        vm.expectRevert(bytes("L36"));
        tested.setTier(currTier, currAmount);
    }

    function testFuzz_setTier_6(uint256 amount, uint8 tier) public {
        console.log("Should change input of getTier() for a given tier");

        // Ensure tier is greater than 0
        vm.assume(tier > 0);

        // Set random tier with 9999 amount
        tested.setTier(tier, 9999);

        // Assert that current tier value is 9999
        assertEq(tested.getTier(tier), 9999);

        // Set random tier with random amount
        tested.setTier(tier, amount);

        // Assert the current tier value is now the random amount
        assertEq(tested.getTier(tier), amount);
    }

    // ==========================
    // === getTier() function ===
    function test_getTier_1() public {
        console.log("Should revert if trying to get 0 tier");

        // Expect revert
        vm.expectRevert(bytes("L37"));
        tested.getTier(0);
    }

    function testFuzz_getTier_2(uint8 tier) public {
        console.log("Should revert if tier doesn't exist");

        // Ensure tier is greater than 0
        vm.assume(tier > 0);

        // Expect revert
        vm.expectRevert(bytes("L38"));
        tested.getTier(tier);
    }

    function testFuzz_getTier_3(uint8 tier, uint256 amount1, uint256 amount2) public {
        console.log("Should return the last set amount for a given tier");

        // Ensure tier is greater than 0
        vm.assume(tier > 0);

        // Set random tier with amount1 random value
        tested.setTier(tier, amount1);

        // Assert that current tier value is amount1
        assertEq(tested.getTier(tier), amount1);

        // Set random tier with amount2 random value
        tested.setTier(tier, amount2);

        // Assert the current tier value is amount2
        assertEq(tested.getTier(tier), amount2);
    }

    // ==========================
    // === tierOf() function ===
    function testFuzz_tierOf_1(address account) public {
        console.log("Should return 0 for any account that has no stake");

        // Assert that it returns 0
        assertEq(tested.tierOf(account), 0);
    }

    function testFuzz_tierOf_2(uint16 aprUD3, uint8 tier, uint216 tierAmount) public {
        console.log("Should return 0 tier x if account stake is exactly equal to tier x amount");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Ensure tier is greater than 0
        vm.assume(tier > 0);

        // Ensure staked amount is greater than 0
        vm.assume(tierAmount > 0);

        // Set random tier with random value
        tested.setTier(tier, tierAmount);

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), tierAmount, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), tierAmount);
        tested.stake(tierAmount);
        vm.stopPrank();

        // Assert that it returns 0
        assertEq(tested.tierOf(address(1234)), tier);
    }

    function testFuzz_tierOf_3(uint16 aprUD3, uint8 tier, uint216 tierAmount) public {
        console.log("Should return 0 tier - 1 if account stake is right before tier x amount");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Ensure tier is greater than 0
        vm.assume(tier > 0);

        // Ensure staked amount is greater than 1
        vm.assume(tierAmount > 1);

        // Set random tier with random value
        tested.setTier(tier, tierAmount);

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), tierAmount, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), tierAmount);
        tested.stake(tierAmount - 1);
        vm.stopPrank();

        // Assert that it returns 0
        assertEq(tested.tierOf(address(1234)), tier - 1);
    }

    function testFuzz_tierOf_4(uint16 aprUD3, uint216 tier1Amount, uint216 accountStakedAmount) public {
        console.log("Should return 0 if account stake is lower than tier 1 amount");

        // Set first random APR
        tested.setAPR(aprUD3);

        // Ensure staked amount is greater than 0
        vm.assume(tier1Amount > 1);

        // Ensure user staked amount is lower than tier 1 amount
        accountStakedAmount = uint216(bound(accountStakedAmount, 1, tier1Amount - 1));

        // Set random tier with random value
        tested.setTier(1, tier1Amount);

        // Mint $LDY to account and stake it
        deal(address(ldyToken), address(1234), accountStakedAmount, true);
        vm.startPrank(address(1234));
        ldyToken.approve(address(tested), accountStakedAmount);
        tested.stake(accountStakedAmount);
        vm.stopPrank();

        // Assert that it returns 0
        assertEq(tested.tierOf(address(1234)), 0);
    }
}
