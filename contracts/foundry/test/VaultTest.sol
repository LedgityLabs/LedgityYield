// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import "../../src/EthVault.sol";
import "./FailedTransfer.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract VaultTest is Test {
    EthVault public vault;
    EthVault public implementation;
    ERC1967Proxy public proxy;
    FailedTransfer public failedTransfer;
    address public owner;
    address public fundWallet;
    address public user1;
    address public user2;
    address public failedT;

    event EpochOpened(uint256 indexed epochNumber, uint256 timestamp);
    event EpochRunning(uint256 indexed epochNumber, uint256 timestamp, uint256 totalValueLocked);
    event EpochTerminated(uint256 indexed epochNumber, uint256 timestamp);
    event RewardsAllocated(uint256 indexed epochNumber, uint256 rewardAmount);
    event UserDeposit(address indexed user, uint256 amount, uint256 epochNumber);
    event UserWithdraw(address indexed user, uint256 amount, uint256 epochNumber);
    event UserRewardClaim(address indexed user, uint256 amount, uint256 epochNumber);
    event MinimumStakeChanged(uint256 oldMinimumStake, uint256 newMinimumStake);
    event FundWalletChanged(address oldFundWallet, address newFundWallet);
    event FundsTransferredToFundWallet(uint256 amount, uint256 indexed epochId);
    event RewardsClaimabilityChanged(bool claimable);
    event LockingContract(bool locked);

    function setUp() public {
        owner = address(this);
        fundWallet = vm.addr(1);
        user1 = vm.addr(2);
        user2 = vm.addr(3);
        failedT = vm.addr(4);
        vm.deal(owner, 1000 ether);
        vm.deal(user1, 1000 ether);
        vm.deal(user2, 1000 ether);
        vm.deal(failedT, 100 ether);
        vm.deal(fundWallet, 1000 ether);

        implementation = new EthVault();

        bytes memory initData = abi.encodeWithSelector(EthVault.initialize.selector, fundWallet);

        proxy = new ERC1967Proxy(address(implementation), initData);

        vault = EthVault(address(proxy));

        failedTransfer = new FailedTransfer();
    }

    function testInitialState() public {
        assertEq(vault.currentEpochId(), 1);
        assertEq(uint256(vault.currentEpochStatus()), uint256(EthVault.EpochStatus.Open));
        assertEq(vault.claimableRewards(), false);
    }

    function testInitialMinimumStake() public {
        assertEq(vault.mininmumStake(), 0.05 ether);
    }

    function testSetMinimumStake() public {
        uint256 initialMinimumStake = vault.mininmumStake();
        uint256 newMinimumStake = 0.1 ether;

        vm.expectRevert("Ownable: caller is not the owner");
        vm.prank(user1);
        vault.setMinimumStake(newMinimumStake);

        vm.expectEmit(true, true, true, true);
        emit MinimumStakeChanged(initialMinimumStake, newMinimumStake);
        vm.prank(owner);
        vault.setMinimumStake(newMinimumStake);

        assertEq(vault.mininmumStake(), newMinimumStake);

        vm.prank(user1);
        vault.enter{value: newMinimumStake}();
        (uint256 amount,) = vault.userStakes(user1);
        assertEq(amount, newMinimumStake);

        vm.expectRevert(
            abi.encodeWithSelector(EthVault.InsufficientStake.selector, newMinimumStake - 1, newMinimumStake)
        );
        vm.prank(user2);
        vault.enter{value: newMinimumStake - 1}();
    }

    function testSetFundWallet() public {
        address newFundWallet = vm.addr(4);

        vm.prank(owner);
        vault.setFundWallet(newFundWallet);

        assertEq(vault.fundWallet(), newFundWallet);
    }

    function testErrorSetFundWalletUnauthorized() public {
        vm.expectRevert("Ownable: caller is not the owner");
        vm.prank(user1);
        vault.setFundWallet(user1);
    }

    function testLockOrUnlockContract() public {
        assertFalse(vault.locked());

        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        vault.lockOrUnlockContract(true);

        vm.expectEmit(true, true, true, true);
        emit LockingContract(true);
        vm.prank(owner);
        vault.lockOrUnlockContract(true);
        assertTrue(vault.locked());

        vm.expectRevert("Contract already in requested state");
        vm.prank(owner);
        vault.lockOrUnlockContract(true);

        vm.expectEmit(true, true, true, true);
        emit LockingContract(false);
        vm.prank(owner);
        vault.lockOrUnlockContract(false);
        assertFalse(vault.locked());

        vm.expectRevert("Contract already in requested state");
        vm.prank(owner);
        vault.lockOrUnlockContract(false);
    }

    function testIsLockedModifier() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.prank(owner);
        vault.lockOrUnlockContract(true);

        vm.expectRevert(EthVault.ContractLocked.selector);
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.expectRevert(EthVault.ContractLocked.selector);
        vm.prank(user1);
        vault.exit(0.5 ether);

        vm.expectRevert(EthVault.ContractLocked.selector);
        vm.prank(user1);
        vault.claimRewards();

        vm.prank(owner);
        vault.lockOrUnlockContract(false);

        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.prank(user1);
        vault.exit(0.5 ether);
    }

    function testErrorEnterBelowMinimumStake() public {
        vm.expectRevert(abi.encodeWithSelector(EthVault.InsufficientStake.selector, 0.04 ether, 0.05 ether));
        vm.prank(user1);
        vault.enter{value: 0.04 ether}();
    }

    function testEnterWithMinimumStake() public {
        vm.prank(user1);
        vault.enter{value: 0.05 ether}();

        (uint256 amount,) = vault.userStakes(user1);
        assertEq(amount, 0.05 ether);
    }

    function testEnterFirstEpoch() public {
        uint256 depositAmountU1 = 1 ether;
        uint256 depositAmountU2 = 3 ether;
        vm.prank(user1);
        vault.enter{value: depositAmountU1}();

        vm.prank(user2);
        vault.enter{value: depositAmountU2}();

        (uint256 amountU1, uint256 lastEpochClaimedAtU1) = vault.userStakes(user1);
        assertEq(amountU1, depositAmountU1);
        assertEq(lastEpochClaimedAtU1, 0);

        (uint256 amountU2, uint256 lastEpochClaimedAtU2) = vault.userStakes(user2);
        assertEq(amountU2, depositAmountU2);
        assertEq(lastEpochClaimedAtU2, 0);

        EthVault.Epoch memory currentEpoch = vault.getCurrentEpoch();
        assertEq(currentEpoch.totalValueLocked, depositAmountU1 + depositAmountU2);
    }

    function testEnterWithExistingStake() public {
        vm.startPrank(user1);
        vault.enter{value: 1 ether}();

        vm.stopPrank();
        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();

        vm.prank(fundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();

        vm.prank(user1);
        vault.enter{value: 2 ether}();

        (uint256 amount, uint256 lastEpochClaimedAt) = vault.userStakes(user1);
        assertEq(amount, 3 ether);
        assertEq(lastEpochClaimedAt, 1);
    }

    function testMultipleUsersStaking() public {
        uint256 user1Deposit = 1 ether;
        uint256 user2Deposit = 2 ether;

        vm.prank(user1);
        vault.enter{value: user1Deposit}();
        vm.prank(user2);
        vault.enter{value: user2Deposit}();

        EthVault.Epoch memory currentEpoch = vault.getCurrentEpoch();
        assertEq(currentEpoch.totalValueLocked, user1Deposit + user2Deposit);
    }

    function testEnterWithZeroValue() public {
        vm.expectRevert(abi.encodeWithSelector(EthVault.InsufficientStake.selector, 0, 0.05 ether));
        vm.prank(user1);
        vault.enter{value: 0}();
    }

    function testErrorEnterDuringRunningEpoch() public {
        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.expectRevert(abi.encodeWithSelector(EthVault.WrongPhase.selector, "ENTER: only allowed during open phase"));
        vm.prank(user1);
        vault.enter{value: 1 ether}();
    }

    function testLockFundsAndRunCurrentEpoch() public {
        address contractFundWallet = vault.fundWallet();
        uint256 depositAmount = 1 ether;

        // Get the initial balance of the fund wallet
        uint256 initialFundWalletBalance = contractFundWallet.balance;

        vm.prank(user1);
        vault.enter{value: depositAmount}();

        vm.prank(contractFundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        assertEq(uint256(vault.currentEpochStatus()), uint256(EthVault.EpochStatus.Running));
        assertFalse(vault.claimableRewards());

        // Check that the fund wallet balance has increased by the deposit amount
        assertEq(contractFundWallet.balance, initialFundWalletBalance + depositAmount);

        vm.expectRevert(abi.encodeWithSelector(EthVault.WrongPhase.selector, "ENTER: only allowed during open phase"));
        vm.prank(user2);
        vault.enter{value: 0.5 ether}();

        vm.expectRevert(abi.encodeWithSelector(EthVault.WrongPhase.selector, "EXIT: only allowed during open phase"));
        vm.prank(user1);
        vault.exit(0.5 ether);

        vm.expectRevert(abi.encodeWithSelector(EthVault.UnClaimableRewards.selector));
        vm.prank(user1);
        vault.claimRewards();
    }

    function testErrorRunAlreadyRunningEpoch() public {
        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.expectRevert(
            abi.encodeWithSelector(EthVault.WrongPhase.selector, "RUN EPOCH: can only start running from open phase")
        );
        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();
    }

    function testErrorterminateCurrentAndOpenNextEpochNotRunning() public {
        vm.expectRevert(abi.encodeWithSelector(EthVault.WrongPhase.selector, "END EPOCH: can only end a running epoch"));
        vm.prank(fundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();
    }

    function testTerminateCurrentAndOpenNextEpoch() public {
        address contractFundWallet = vault.fundWallet();
        uint256 depositAmount = 1 ether;
        uint256 rewardAmount = 0.1 ether;

        vm.prank(user1);
        vault.enter{value: depositAmount}();

        vm.prank(contractFundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        // Ensure the fundWallet has enough balance for rewards
        vm.deal(contractFundWallet, rewardAmount);

        vm.prank(contractFundWallet);
        vault.allocateRewards{value: rewardAmount}();

        // Ensure the fundWallet has enough balance to return the locked funds
        vm.deal(contractFundWallet, depositAmount);

        vm.prank(contractFundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: depositAmount}();

        assertEq(vault.currentEpochId(), 2);
        assertEq(uint256(vault.currentEpochStatus()), uint256(EthVault.EpochStatus.Open));
    }

    function testErrorTerminateCurrentAndOpenNextEpochInsufficientFundsReturned() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();

        vm.expectRevert(
            abi.encodeWithSelector(EthVault.InsufficientFundsReturned.selector, 500000000000000000, 1000000000000000000)
        );
        vm.prank(fundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: 0.5 ether}();
    }

    function testTransitionToNextEpoch() public {
        address contractFundWallet = vault.fundWallet();
        uint256 depositAmount = 1 ether;
        uint256 rewardAmount = 0.1 ether;

        vm.prank(user1);
        vault.enter{value: depositAmount}();

        vm.prank(contractFundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        // Ensure the fundWallet has enough balance for rewards
        vm.deal(contractFundWallet, rewardAmount);

        vm.prank(contractFundWallet);
        vault.allocateRewards{value: rewardAmount}();

        // Ensure the fundWallet has enough balance to return the locked funds
        vm.deal(contractFundWallet, depositAmount);

        vm.prank(contractFundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: depositAmount}();

        assertEq(vault.currentEpochId(), 2);
        assertEq(uint256(vault.currentEpochStatus()), uint256(EthVault.EpochStatus.Open));
    }

    function testErrorTransitionToNextEpochRewardsNotAllocated() public {
        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.expectRevert(
            abi.encodeWithSelector(
                EthVault.WrongPhase.selector, "END EPOCH: rewards must be allocated before ending the epoch"
            )
        );
        vm.prank(fundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();
    }

    function testGetCurrentEpoch() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        EthVault.Epoch memory currentEpoch = vault.getCurrentEpoch();
        assertEq(currentEpoch.totalValueLocked, 1 ether);
        assertEq(currentEpoch.totalEpochRewards, 0);
    }

    function testGetCurrentEpochStatus() public {
        (EthVault.EpochStatus status) = vault.currentEpochStatus();
        assertEq(uint256(status), uint256(EthVault.EpochStatus.Open));

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();
        (status) = vault.currentEpochStatus();
        assertEq(uint256(status), uint256(EthVault.EpochStatus.Running));
    }

    function testAllocateRewards() public {
        uint256 depositAmount = 1 ether;
        uint256 rewardAmount = 0.1 ether;

        vm.prank(user1);
        vault.enter{value: depositAmount}();

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(fundWallet);
        vault.allocateRewards{value: rewardAmount}();

        assertEq(vault.claimableRewards(), true);
        EthVault.Epoch memory currentEpoch = vault.getCurrentEpoch();
        assertEq(currentEpoch.totalEpochRewards, rewardAmount);
    }

    function testErrorAllocateRewardsInOpenPhase() public {
        vm.expectRevert(
            abi.encodeWithSelector(EthVault.WrongPhase.selector, "ALLOCATE REWARDS: must be in running phase")
        );
        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();
    }

    function testErrorDoubleAllocateRewards() public {
        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();

        (EthVault.Epoch memory epoch) = vault.getCurrentEpoch();
        assertEq(epoch.totalEpochRewards, 0.1 ether);
        assertEq(vault.claimableRewards(), true);

        vm.expectRevert(abi.encodeWithSelector(EthVault.RewardsAlreadyAllocated.selector));
        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();
    }

    function testAllocateZeroRewards() public {
        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.expectRevert(EthVault.NoRewardsToAllocate.selector);
        vm.prank(fundWallet);
        vault.allocateRewards{value: 0}();
    }

    function testExit() public {
        address contractFundWallet = vault.fundWallet();
        uint256 depositAmount = 10 ether;
        uint256 rewardAmount = 1 ether;

        vm.startPrank(user1);
        vault.enter{value: depositAmount}();
        vm.stopPrank();

        vm.prank(contractFundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        // Ensure the fundWallet has enough balance for rewards
        vm.deal(contractFundWallet, rewardAmount);

        vm.prank(contractFundWallet);
        vault.allocateRewards{value: rewardAmount}();

        // Ensure the fundWallet has enough balance to return the locked funds
        vm.deal(contractFundWallet, depositAmount);

        vm.prank(contractFundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: depositAmount}();

        vm.startPrank(user1);
        uint256 balanceBefore = user1.balance;
        vault.exit(depositAmount);
        uint256 balanceAfter = user1.balance;
        vm.stopPrank();

        assertEq(balanceAfter - balanceBefore, depositAmount + rewardAmount);

        (uint256 amount,) = vault.userStakes(user1);
        assertEq(amount, 0);
    }

    function testErrorExitMoreThanStaked() public {
        address contractFundWallet = vault.fundWallet();

        uint256 depositAmount = 1 ether;
        uint256 rewardAmount = 0.1 ether;

        vm.startPrank(user1);
        vault.enter{value: depositAmount}();
        vm.stopPrank();

        vm.prank(contractFundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(contractFundWallet);
        vault.allocateRewards{value: rewardAmount}();

        // Ensure the fundWallet has enough ETH to return the locked funds
        vm.deal(contractFundWallet, depositAmount);

        vm.prank(contractFundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: depositAmount}();

        vm.expectRevert(
            abi.encodeWithSelector(EthVault.InsufficientBalance.selector, depositAmount + 100 wei, depositAmount)
        );
        vm.prank(user1);
        vault.exit(depositAmount + 100 wei);
    }

    function testErrorExitDuringRunningEpoch() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.expectRevert(abi.encodeWithSelector(EthVault.WrongPhase.selector, "EXIT: only allowed during open phase"));
        vm.prank(user1);
        vault.exit(1 ether);
    }

    function testErrorDoubleWithdrawOpenAndRunning() public {
        address contractFundWallet = vault.fundWallet();
        uint256 depositAmount = 1 ether;
        uint256 depositAmount2 = 0.4 ether;
        uint256 withdrawAmount = 0.6 ether;
        uint256 rewardAmount = 0.1 ether;

        // Scenario 1: Open Epoch
        vm.startPrank(user1);
        vault.enter{value: depositAmount}();

        // First withdrawal should succeed
        vault.exit(withdrawAmount);

        // Second withdrawal should fail
        vm.expectRevert(
            abi.encodeWithSelector(
                EthVault.InsufficientBalance.selector, withdrawAmount, depositAmount - withdrawAmount
            )
        );
        vault.exit(withdrawAmount);
        vm.stopPrank();

        // Scenario 2: Running Epoch with Allocated Rewards
        vm.prank(user1);
        vault.enter{value: withdrawAmount}(); //bring the deposit amount back to 1 ether

        vm.prank(contractFundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.deal(contractFundWallet, rewardAmount);
        vm.prank(contractFundWallet);
        vault.allocateRewards{value: rewardAmount}();

        vm.deal(contractFundWallet, depositAmount);
        vm.prank(contractFundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: depositAmount}();

        vm.startPrank(user1);
        // First withdrawal should succeed
        uint256 balanceBefore = user1.balance;
        vault.exit(withdrawAmount);
        uint256 balanceAfter = user1.balance;

        // Check that the withdrawal amount plus a portion of rewards was received
        assertGt(balanceAfter - balanceBefore, withdrawAmount);

        // Second withdrawal should fail
        vm.expectRevert(
            abi.encodeWithSelector(
                EthVault.InsufficientBalance.selector, withdrawAmount, depositAmount - withdrawAmount
            )
        );
        vault.exit(withdrawAmount);
        vm.stopPrank();
    }

    function testExitWithZeroValue() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.expectRevert(EthVault.AmountMustBeGreaterThanZero.selector);
        vm.prank(user1);
        vault.exit(0);
    }

    function testErrorNoStakeToExit() public {
        vm.expectRevert(abi.encodeWithSelector(EthVault.InsufficientBalance.selector, 1 ether, 0));
        vm.prank(user1);
        vault.exit(1 ether);
    }

    function testGetEpochLengthToClaim() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        assertEq(vault.getEpochLengthToClaim(user1), 0);

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();
        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();

        assertEq(vault.getEpochLengthToClaim(user1), 1);

        vm.prank(fundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();

        assertEq(vault.getEpochLengthToClaim(user1), 1);

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();
        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();

        assertEq(vault.getEpochLengthToClaim(user1), 2);

        vm.prank(user1);
        vault.claimRewards();

        assertEq(vault.getEpochLengthToClaim(user1), 0);

        vm.prank(fundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();

        assertEq(vault.getEpochLengthToClaim(user1), 0);

        assertEq(vault.getEpochLengthToClaim(user2), 0);
    }

    function testClaimRewards() public {
        uint256 depositAmount = 1 ether;
        uint256 rewardAmount = 0.1 ether;

        vm.prank(user1);
        vault.enter{value: depositAmount}();

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(fundWallet);
        vault.allocateRewards{value: rewardAmount}();

        uint256 balanceBefore = user1.balance;
        vm.prank(user1);
        vault.claimRewards();
        uint256 balanceAfter = user1.balance;

        assertEq(balanceAfter - balanceBefore, rewardAmount);
    }

    function testClaimRewardsMultipleEpochs() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        for (uint8 i = 0; i < 2; i++) {
            vm.prank(fundWallet);
            vault.lockFundsAndRunCurrentEpoch();
            vm.prank(fundWallet);
            vault.allocateRewards{value: 0.1 ether}();
            vm.prank(fundWallet);
            vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();
        }

        uint256 balanceBefore = user1.balance;
        vm.prank(user1);
        vault.claimRewards();
        uint256 balanceAfter = user1.balance;

        assertEq(balanceAfter - balanceBefore, 0.2 ether);
    }

    function testErrorClaimNoActiveStakeBeforeEntrance() public {
        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();

        vm.expectRevert(EthVault.NoRewardToClaim.selector);
        vm.prank(user2);
        vault.claimRewards();
    }

    function testErrorClaimNoActiveStakeAfterFullExit() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();

        vm.prank(fundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();

        vm.prank(user1);
        vault.exit(1 ether);

        vm.expectRevert(EthVault.NoRewardToClaim.selector);
        vm.prank(user1);
        vault.claimRewards();
    }

    function testErrorClaimNoActiveStakeAfterClaimingAgainSameEpoch() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();

        vm.prank(user1);
        vault.claimRewards();

        vm.expectRevert(EthVault.NoRewardToClaim.selector);
        vm.prank(user1);
        vault.claimRewards();
    }

    function testErrorClaimNoActiveStakeAfterExit() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();

        vm.prank(fundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();

        vm.prank(user1);
        vault.exit(1 ether);

        vm.expectRevert(abi.encodeWithSelector(EthVault.NoRewardToClaim.selector));
        vm.prank(user1);
        vault.claimRewards();
    }

    function testErrorClaimUnclaimable() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.expectRevert(abi.encodeWithSelector(EthVault.UnClaimableRewards.selector));
        vm.prank(user1);
        vault.claimRewards();
    }

    function testMultipleUsersInteractionClaim() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.prank(user2);
        vault.enter{value: 2 ether}();

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.3 ether}();

        vm.prank(fundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: 3 ether}();

        vm.prank(user1);
        uint256 user1BalanceBefore = user1.balance;
        vault.claimRewards();
        uint256 user1BalanceAfter = user1.balance;

        vm.prank(user2);
        uint256 user2BalanceBefore = user2.balance;
        vault.exit(2 ether);
        uint256 user2BalanceAfter = user2.balance;

        assertEq(user1BalanceAfter - user1BalanceBefore, 0.1 ether);
        assertEq(user2BalanceAfter - user2BalanceBefore, 2.2 ether);

        (uint256 user1Stake,) = vault.userStakes(user1);
        (uint256 user2Stake,) = vault.userStakes(user2);
        assertEq(user1Stake, 1 ether);
        assertEq(user2Stake, 0);
        EthVault.Epoch memory currentEpoch = vault.getCurrentEpoch();
        assertEq(currentEpoch.totalValueLocked, 1 ether);
    }

    function testClaimRewardsInRunningEpoch() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();

        uint256 balanceBefore = user1.balance;
        vm.prank(user1);
        vault.claimRewards();
        uint256 balanceAfter = user1.balance;

        assertEq(balanceAfter - balanceBefore, 0.1 ether);
    }

    function testClaimRewardsInOpenEpoch() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();

        vm.prank(fundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();

        uint256 balanceBefore = user1.balance;
        vm.prank(user1);
        vault.claimRewards();
        uint256 balanceAfter = user1.balance;

        assertEq(balanceAfter - balanceBefore, 0.1 ether);
    }

    function testHasClaimableRewards() public {
        assertFalse(vault.hasClaimableRewards(user1));

        vm.prank(user1);
        vault.enter{value: 1 ether}();
        assertFalse(vault.hasClaimableRewards(user1));

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();
        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();
        assertTrue(vault.hasClaimableRewards(user1));

        vm.prank(fundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();
        vm.prank(user1);
        vault.claimRewards();
        assertFalse(vault.hasClaimableRewards(user1));
    }

    function testClaimRewardsForEpochs() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        for (uint256 i = 0; i < 5; i++) {
            vm.prank(fundWallet);
            vault.lockFundsAndRunCurrentEpoch();
            vm.prank(fundWallet);
            vault.allocateRewards{value: 0.1 ether}();
            vm.prank(fundWallet);
            vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();
        }

        uint256 balanceBefore = user1.balance;
        vm.prank(user1);
        vault.claimRewardsForEpochs(3);
        uint256 balanceAfter = user1.balance;
        assertEq(balanceAfter - balanceBefore, 0.3 ether);

        balanceBefore = user1.balance;
        vm.prank(user1);
        vault.claimRewardsForEpochs(2);
        balanceAfter = user1.balance;
        assertEq(balanceAfter - balanceBefore, 0.2 ether);

        vm.expectRevert(EthVault.NoRewardToClaim.selector);
        vm.prank(user1);
        vault.claimRewardsForEpochs(1);

        vm.expectRevert(EthVault.NoRewardToClaim.selector);
        vm.prank(user1);
        vault.claimRewardsForEpochs(10);

        vm.expectRevert(abi.encodeWithSelector(EthVault.InvalidEpochsToClaim.selector, 0));
        vm.prank(user1);
        vault.claimRewardsForEpochs(0);

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();
        vm.expectRevert(EthVault.UnClaimableRewards.selector);
        vm.prank(user1);
        vault.claimRewardsForEpochs(1);

        vm.expectRevert(EthVault.UnClaimableRewards.selector);
        vm.prank(user2);
        vault.claimRewardsForEpochs(1);

        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();
        vm.prank(fundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();
        vm.prank(user1);
        vault.enter{value: 1 ether}();
        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();
        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();

        vm.prank(user1);
        balanceBefore = user1.balance;
        vault.claimRewardsForEpochs(1);
        balanceAfter = user1.balance;
        assertEq(balanceAfter - balanceBefore, 0.1 ether);
    }

    function testErrorExitTransferFailed() public {
        vm.prank(failedT);
        failedTransfer.enter{value: 1 ether}();

        vm.expectRevert(abi.encodeWithSelector(EthVault.TransferFailed.selector));
        vm.prank(failedT);
        failedTransfer.exit(1 ether);
    }

    function testErrorClaimTransferFailed() public {
        vm.prank(failedT);
        failedTransfer.enter{value: 1 ether}();

        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();

        vm.expectRevert(abi.encodeWithSelector(EthVault.TransferFailed.selector));
        vm.prank(failedT);
        failedTransfer.claimRewards();
    }

    function testErrorLockFundsAndRunCurrentEpochTransferFailed() public {
        address contractFundWallet = vault.fundWallet();

        vm.prank(owner);
        vault.setFundWallet(address(failedTransfer));

        vm.prank(user1);
        vault.enter{value: 1 ether}();

        assertEq((address(vault)).balance, 1 ether);

        vm.expectRevert(abi.encodeWithSelector(EthVault.TransferFailed.selector));
        vm.prank(address(failedTransfer));
        vault.lockFundsAndRunCurrentEpoch();

        assertEq((address(vault)).balance, 1 ether);
    }

    function testEventEpochRunning() public {
        address contractFundWallet = vault.fundWallet();

        // Get the initial balance of the fund wallet
        uint256 initialFundWalletBalance = contractFundWallet.balance;

        uint256 depositAmount = 1 ether;

        vm.prank(user1);
        vault.enter{value: depositAmount}();

        vm.expectEmit(true, true, true, true);
        emit EpochRunning(1, block.timestamp, depositAmount);

        vm.expectEmit(true, true, true, true);
        emit FundsTransferredToFundWallet(depositAmount, 1);

        vm.prank(contractFundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        assertEq(uint256(vault.currentEpochStatus()), uint256(EthVault.EpochStatus.Running));
        assertFalse(vault.claimableRewards());

        // Check that the fund wallet balance has increased by the deposit amount
        assertEq(contractFundWallet.balance, initialFundWalletBalance + depositAmount);
    }

    function testEventEpochTerminated() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();
        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();
        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();

        vm.expectEmit(true, true, true, true);
        emit EpochTerminated(1, block.timestamp);

        vm.prank(fundWallet);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();
    }

    function testEventRewardsAllocated() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();
        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();

        vm.expectEmit(true, true, true, true);
        emit RewardsAllocated(1, 0.1 ether);

        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();
    }

    function testEventUserDeposit() public {
        vm.expectEmit(true, true, true, true);
        emit UserDeposit(user1, 1 ether, 1);

        vm.prank(user1);
        vault.enter{value: 1 ether}();
    }

    function testEventUserWithdraw() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.expectEmit(true, true, true, true);
        emit UserWithdraw(user1, 0.5 ether, 1);

        vm.prank(user1);
        vault.exit(0.5 ether);
    }

    function testEventUserRewardClaim() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();
        vm.prank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();
        vm.prank(fundWallet);
        vault.allocateRewards{value: 0.1 ether}();

        vm.expectEmit(true, true, true, true);
        emit UserRewardClaim(user1, 0.1 ether, 1);

        vm.prank(user1);
        vault.claimRewards();
    }

    function testFuzzEnterAndExit(uint256 enterAmount, uint256 exitAmount) public {
        vm.assume(enterAmount > vault.mininmumStake());
        vm.assume(exitAmount > 0 && exitAmount <= enterAmount);
        vm.deal(user1, enterAmount);

        vm.prank(user1);
        vault.enter{value: enterAmount}();

        (uint256 stakedAmount,) = vault.userStakes(user1);
        assertEq(stakedAmount, enterAmount);

        vm.prank(user1);
        vault.exit(exitAmount);

        (stakedAmount,) = vault.userStakes(user1);
        assertEq(stakedAmount, enterAmount - exitAmount);
    }

    function testFuzzInvariantTotalValueLocked(uint256 _amount1, uint256 _amount2) public {
        vm.assume(_amount1 >= vault.mininmumStake() && _amount1 <= 1_000_000 ether);
        vm.assume(_amount2 >= vault.mininmumStake() && _amount2 <= 1_000_000 ether);

        uint256 initialTVL = vault.getCurrentEpoch().totalValueLocked;
        address user_1 = vm.addr(723);
        address user_2 = vm.addr(645);

        vm.deal(user_1, _amount1);
        vm.prank(user_1);
        vault.enter{value: _amount1}();

        vm.deal(user_2, _amount2);
        vm.prank(user_2);
        vault.enter{value: _amount2}();

        uint256 newTVL = vault.getCurrentEpoch().totalValueLocked;
        assertEq(newTVL, initialTVL + _amount1 + _amount2);
    }

    function testFuzzMultipleUsersEnterExit(uint256[5] memory amounts, uint8[5] memory exitPercentages) public {
        address[5] memory users = [vm.addr(1), vm.addr(2), vm.addr(3), vm.addr(4), vm.addr(5)];
        uint256 totalEntered = 0;

        for (uint256 i = 0; i < 5; i++) {
            amounts[i] = bound(amounts[i], vault.mininmumStake(), 1000 ether);
            exitPercentages[i] = uint8(bound(exitPercentages[i], 1, 100));

            vm.deal(users[i], amounts[i]);
            vm.prank(users[i]);
            vault.enter{value: amounts[i]}();
            totalEntered += amounts[i];
        }

        assertEq(vault.getCurrentEpoch().totalValueLocked, totalEntered);

        for (uint256 i = 0; i < 5; i++) {
            uint256 exitAmount = (amounts[i] * exitPercentages[i]) / 100;
            vm.prank(users[i]);
            vault.exit(exitAmount);
            totalEntered -= exitAmount;
        }

        assertEq(vault.getCurrentEpoch().totalValueLocked, totalEntered);
    }

    function testFuzzRewardDistribution(uint256[3] memory stakes, uint256 rewardAmount) public {
        address[3] memory users = [vm.addr(1), vm.addr(2), vm.addr(3)];
        uint256 totalStake = 0;

        for (uint256 i = 0; i < 3; i++) {
            stakes[i] = bound(stakes[i], vault.mininmumStake(), 100 ether);
            vm.deal(users[i], stakes[i]);
            vm.prank(users[i]);
            vault.enter{value: stakes[i]}();
            totalStake += stakes[i];
        }

        rewardAmount = bound(rewardAmount, 0.1 ether, 10 ether);

        vm.deal(fundWallet, totalStake + rewardAmount);

        vm.startPrank(fundWallet);
        vault.lockFundsAndRunCurrentEpoch();
        vault.allocateRewards{value: rewardAmount}();
        vault.terminateCurrentAndOpenNextEpoch{value: totalStake}();
        vm.stopPrank();

        uint256 totalClaimed = 0;
        for (uint256 i = 0; i < 3; i++) {
            uint256 balanceBefore = users[i].balance;
            vm.prank(users[i]);
            vault.claimRewards();
            uint256 claimed = users[i].balance - balanceBefore;
            totalClaimed += claimed;

            uint256 expectedReward = (stakes[i] * rewardAmount) / totalStake;
            assertApproxEqAbs(claimed, expectedReward, 1);
        }

        assertApproxEqAbs(totalClaimed, rewardAmount, 3);
    }

    function testStressRapidEnterExit(uint8 cycleCount) public {
        cycleCount = uint8(bound(cycleCount, 10, 100));
        address user = vm.addr(10);
        uint256 totalAddedRewards;
        vm.deal(user, 1000 ether);
        vm.deal(fundWallet, 1000 ether);

        for (uint8 i = 0; i < cycleCount; i++) {
            vm.prank(user);
            vault.enter{value: 1 ether}();

            vm.prank(fundWallet);
            vault.lockFundsAndRunCurrentEpoch();
            vm.prank(fundWallet);
            vault.allocateRewards{value: 0.1 ether}();
            totalAddedRewards += 0.1 ether;
            vm.prank(fundWallet);
            vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();

            vm.prank(user);
            vault.exit(1 ether);
        }

        // Check final state
        (uint256 finalStake,) = vault.userStakes(user);
        assertEq(finalStake, 0);
        assertGt(user.balance, 1000 ether); // User should have profited from rewards
        assertEq(user.balance, 1000 ether + totalAddedRewards);
        assertEq(vault.getCurrentEpoch().totalValueLocked, 0);
    }
}
