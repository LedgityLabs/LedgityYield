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

        // Deploy implementation
        implementation = new EthVault();

        // Encode initialization data
        bytes memory initData = abi.encodeWithSelector(EthVault.initialize.selector, fundWallet);

        // Deploy ERC1967Proxy
        proxy = new ERC1967Proxy(address(implementation), initData);

        // Create a contract instance of the proxy
        vault = EthVault(address(proxy));

        failedTransfer = new FailedTransfer();
    }

    // --------------------------------------
    //     INITIAL STATE AND SETUP TESTS
    // --------------------------------------

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

        // Ensure only the owner can call this function
        vm.expectRevert("Ownable: caller is not the owner");
        vm.prank(user1);
        vault.setMinimumStake(newMinimumStake);

        // Test successful execution by the owner
        vm.expectEmit(true, true, true, true);
        emit MinimumStakeChanged(initialMinimumStake, newMinimumStake);
        vm.prank(owner);
        vault.setMinimumStake(newMinimumStake);

        // Verify the minimum stake has been updated
        assertEq(vault.mininmumStake(), newMinimumStake);

        // Test that we can enter with the new minimum stake
        vm.prank(user1);
        vault.enter{value: newMinimumStake}();
        (uint256 amount,) = vault.userStakes(user1);
        assertEq(amount, newMinimumStake);

        // Test that we cannot enter with less than the new minimum stake
        vm.expectRevert(
            abi.encodeWithSelector(EthVault.InsufficientStake.selector, newMinimumStake - 1, newMinimumStake)
        );
        vm.prank(user2);
        vault.enter{value: newMinimumStake - 1}();
    }

    function testSetFundWallet() public {
        address newFundWallet = vm.addr(4);

        // Set the new fund wallet as the owner
        vm.prank(owner);
        vault.setFundWallet(newFundWallet);

        // Verify the new fund wallet
        assertEq(vault.fundWallet(), newFundWallet);
    }

    function testErrorSetFundWalletUnauthorized() public {
        // Ensure only the owner can call this function
        vm.expectRevert("Ownable: caller is not the owner");
        vm.prank(user1);
        vault.setFundWallet(user1);
    }

    function testLockOrUnlockContract() public {
        // Assume the contract starts unlocked
        assertFalse(vault.locked());

        // Test: non-owner cannot lock the contract
        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        vault.lockOrUnlockContract(true);

        // Test: owner can lock the contract
        vm.expectEmit(true, true, true, true);
        emit LockingContract(true);
        vm.prank(owner);
        vault.lockOrUnlockContract(true);
        assertTrue(vault.locked());

        // Test: cannot lock an already locked contract
        vm.expectRevert("Contract already in requested state");
        vm.prank(owner);
        vault.lockOrUnlockContract(true);

        // Test: owner can unlock the contract
        vm.expectEmit(true, true, true, true);
        emit LockingContract(false);
        vm.prank(owner);
        vault.lockOrUnlockContract(false);
        assertFalse(vault.locked());

        // Test: cannot unlock an already unlocked contract
        vm.expectRevert("Contract already in requested state");
        vm.prank(owner);
        vault.lockOrUnlockContract(false);
    }

    function testIsLockedModifier() public {
        // Setup: User enters the vault
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        // Lock the contract
        vm.prank(owner);
        vault.lockOrUnlockContract(true);

        // Test enter when locked
        vm.expectRevert(EthVault.ContractLocked.selector);
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        // Test exit when locked
        vm.expectRevert(EthVault.ContractLocked.selector);
        vm.prank(user1);
        vault.exit(0.5 ether);

        // Test claimRewards when locked
        vm.expectRevert(EthVault.ContractLocked.selector);
        vm.prank(user1);
        vault.claimRewards();

        // Unlock the contract
        vm.prank(owner);
        vault.lockOrUnlockContract(false);

        // Test functions when unlocked again
        vm.prank(user1);
        vault.enter{value: 1 ether}(); // This should succeed

        vm.prank(user1);
        vault.exit(0.5 ether); // This should succeed

        // Note: claimRewards might fail for other reasons (like no rewards to claim),
        // so we're not testing it in the unlocked state here
    }

    // --------------------------------------
    //       ENTER (STAKING) TESTS
    // --------------------------------------

    function testErrorEnterBelowMinimumStake() public {
        //reverts on enter below minimum stake
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

        //verify user1 stakes
        (uint256 amountU1, uint256 lastEpochClaimedAtU1) = vault.userStakes(user1);
        assertEq(amountU1, depositAmountU1);
        assertEq(lastEpochClaimedAtU1, 0);

        // verify user2 stakes
        (uint256 amountU2, uint256 lastEpochClaimedAtU2) = vault.userStakes(user2);
        assertEq(amountU2, depositAmountU2);
        assertEq(lastEpochClaimedAtU2, 0);

        // for 1st epoch, TVL is the total of all deposits
        EthVault.Epoch memory currentEpoch = vault.getCurrentEpoch();
        assertEq(currentEpoch.totalValueLocked, depositAmountU1 + depositAmountU2);
    }

    function testEnterWithExistingStake() public {
        vm.startPrank(user1);
        vault.enter{value: 1 ether}();

        // Simulate an epoch cycle
        vm.stopPrank();
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        // Allocate rewards
        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();

        // Terminate current epoch and open next
        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();

        // Enter again with existing stake
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
        //reverts on enter with 0
        vm.expectRevert(abi.encodeWithSelector(EthVault.InsufficientStake.selector, 0, 0.05 ether));
        vm.prank(user1);
        vault.enter{value: 0}();
    }

    function testErrorEnterDuringRunningEpoch() public {
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        vm.expectRevert(abi.encodeWithSelector(EthVault.WrongPhase.selector, "ENTER: only allowed during open phase"));
        vm.prank(user1);
        vault.enter{value: 1 ether}();
    }

    // -------------------------
    //  EPOCH MANAGEMENT TESTS
    // -------------------------

    function testLockFundsAndRunCurrentEpoch() public {
        uint256 depositAmount = 1 ether;
        vm.prank(user1);
        vault.enter{value: depositAmount}();

        // Owner starts running epoch, funds are locked
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        // Verify epoch status, claimable rewards, and fund transfer
        assertEq(uint256(vault.currentEpochStatus()), uint256(EthVault.EpochStatus.Running));
        assertFalse(vault.claimableRewards());
        assertEq(fundWallet.balance, depositAmount);

        // Verify cannot enter
        vm.expectRevert(abi.encodeWithSelector(EthVault.WrongPhase.selector, "ENTER: only allowed during open phase"));
        vm.prank(user2);
        vault.enter{value: 0.5 ether}();

        // Verify cannot exit
        vm.expectRevert(abi.encodeWithSelector(EthVault.WrongPhase.selector, "EXIT: only allowed during open phase"));
        vm.prank(user1);
        vault.exit(0.5 ether);

        // Verify cannot claim rewards
        vm.expectRevert(abi.encodeWithSelector(EthVault.UnClaimableRewards.selector));
        vm.prank(user1);
        vault.claimRewards();
    }

    function testErrorRunAlreadyRunningEpoch() public {
        //owner starts running epoch and funds are locked
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        //reverts on running already running epoch
        vm.expectRevert(
            abi.encodeWithSelector(EthVault.WrongPhase.selector, "RUN EPOCH: can only start running from open phase")
        );
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();
    }

    function testErrorterminateCurrentAndOpenNextEpochNotRunning() public {
        //reverts on terminating epoch not in running phase
        vm.expectRevert(abi.encodeWithSelector(EthVault.WrongPhase.selector, "END EPOCH: can only end a running epoch"));
        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();
    }

    function testTerminateCurrentAndOpenNextEpoch() public {
        uint256 depositAmount = 1 ether;
        uint256 rewardAmount = 0.1 ether;

        //a user enters
        vm.prank(user1);
        vault.enter{value: depositAmount}();

        //owner starts running epoch and funds are locked
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        //owner allocates rewards
        vm.prank(owner);
        vault.allocateRewards{value: rewardAmount}();

        //owner terminates current epoch and open next
        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: vault.getCurrentEpoch().totalValueLocked}();

        //verify next epoch is open
        assertEq(vault.currentEpochId(), 2);
        assertEq(uint256(vault.currentEpochStatus()), uint256(EthVault.EpochStatus.Open));
    }

    function testErrorTerminateCurrentAndOpenNextEpochInsufficientFundsReturned() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        //owner starts running epoch and funds are locked
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        //owner allocates rewards
        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();

        // The full TVL should be returned to the contract
        vm.expectRevert(
            abi.encodeWithSelector(EthVault.InsufficientFundsReturned.selector, 500000000000000000, 1000000000000000000)
        );
        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: 0.5 ether}();
    }

    function testTransitionToNextEpoch() public {
        uint256 depositAmount = 1 ether;

        //a user enters
        vm.prank(user1);
        vault.enter{value: depositAmount}();

        //owner starts running epoch and funds are locked
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        //owner allocates rewards
        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();

        //owner terminates current epoch and open next
        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: vault.getCurrentEpoch().totalValueLocked}();

        //verify next epoch is open
        assertEq(vault.currentEpochId(), 2);
        assertEq(uint256(vault.currentEpochStatus()), uint256(EthVault.EpochStatus.Open));
    }

    function testErrorTransitionToNextEpochRewardsNotAllocated() public {
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        vm.expectRevert(
            abi.encodeWithSelector(
                EthVault.WrongPhase.selector, "END EPOCH: rewards must be allocated before ending the epoch"
            )
        );
        vm.prank(owner);
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

        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();
        (status) = vault.currentEpochStatus();
        assertEq(uint256(status), uint256(EthVault.EpochStatus.Running));

        vm.prank(owner);
    }

    // --------------------------------------
    //    ALLOCATE REWARDS TESTS
    // --------------------------------------

    function testAllocateRewards() public {
        uint256 depositAmount = 1 ether;
        uint256 rewardAmount = 0.1 ether;

        //a user enters
        vm.prank(user1);
        vault.enter{value: depositAmount}();

        //owner starts running epoch and funds are locked
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        //owner allocates rewards
        vm.prank(owner);
        vault.allocateRewards{value: rewardAmount}();

        //verify rewards are allocated and and claimable
        assertEq(vault.claimableRewards(), true);
        EthVault.Epoch memory currentEpoch = vault.getCurrentEpoch();
        assertEq(currentEpoch.totalEpochRewards, rewardAmount);
    }

    function testErrorAllocateRewardsInOpenPhase() public {
        vm.prank(owner);
        (EthVault.EpochStatus status) = vault.currentEpochStatus();
        assertEq(uint256(status), uint256(EthVault.EpochStatus.Open));
        vm.expectRevert(
            abi.encodeWithSelector(EthVault.WrongPhase.selector, "ALLOCATE REWARDS: must be in running phase")
        );
        vault.allocateRewards{value: 0.1 ether}();
    }

    function testErrorDoubleAllocateRewards() public {
        //owner starts running epoch and funds are locked
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        //owner allocates rewards
        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();

        //verify rewards are allocated and and claimable
        (EthVault.Epoch memory epoch) = vault.getCurrentEpoch();
        assertEq(epoch.totalEpochRewards, 0.1 ether);
        assertEq(vault.claimableRewards(), true);

        //reverts on allocating rewards again
        vm.expectRevert(abi.encodeWithSelector(EthVault.RewardsAlreadyAllocated.selector));
        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();
    }

    function testAllocateZeroRewards() public {
        //owner starts running epoch and funds are locked
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        //owner allocates 0 rewards, must revert
        vm.expectRevert(EthVault.NoRewardsToAllocate.selector);
        vm.prank(owner);
        vault.allocateRewards{value: 0}();
    }

    // --------------------------------------
    //  EXIT (UNSTAKING) TESTS
    // --------------------------------------

    function testExit() public {
        uint256 depositAmount = 10 ether;
        uint256 rewardAmount = 1 ether;

        //user1 enters the vault
        vm.startPrank(user1);
        vault.enter{value: depositAmount}();
        vm.stopPrank();

        //epoch starts running and funds are locked
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        //owner allocates rewards
        vm.prank(owner);
        vault.allocateRewards{value: rewardAmount}();

        //terminate current epoch
        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: vault.getCurrentEpoch().totalValueLocked}();

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
        uint256 depositAmount = 1 ether;
        uint256 rewardAmount = 0.1 ether;
        vm.startPrank(user1);
        vault.enter{value: depositAmount}();
        vm.stopPrank();

        // Lock funds and allocate rewards
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(owner);
        vault.allocateRewards{value: rewardAmount}();

        // Transition to next epoch
        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: vault.getCurrentEpoch().totalValueLocked}();

        // Try to exit with more than staked + rewards
        vm.expectRevert(
            abi.encodeWithSelector(EthVault.InsufficientBalance.selector, depositAmount + 100 wei, depositAmount)
        );
        vm.prank(user1);
        vault.exit(depositAmount + 100 wei);
    }

    function testErrorExitDuringRunningEpoch() public {
        //user enters
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        //owner starts running epoch and funds are locked
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        //reverts on exit during running epoch
        vm.expectRevert(abi.encodeWithSelector(EthVault.WrongPhase.selector, "EXIT: only allowed during open phase"));
        vm.prank(user1);
        vault.exit(1 ether);
    }

    function testExitWithZeroValue() public {
        //user enters
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        //reverts on exit with 0
        vm.expectRevert(EthVault.AmountMustBeGreaterThanZero.selector);
        vm.prank(user1);
        vault.exit(0);
    }

    function testErrorNoStakeToExit() public {
        vm.expectRevert(abi.encodeWithSelector(EthVault.InsufficientBalance.selector, 1 ether, 0));
        vm.prank(user1);
        vault.exit(1 ether);
    }

    // --------------------------------------
    //  CLAIM REWARDS TESTS
    // --------------------------------------

    function testGetEpochLengthToClaim() public {
        // Setup: User enters the vault
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        // Test case 1: Open status, no epochs to claim
        assertEq(vault.getEpochLengthToClaim(user1), 0);

        // Run first epoch
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();
        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();

        // Test case 2: Running status, one epoch to claim
        assertEq(vault.getEpochLengthToClaim(user1), 1);

        // End first epoch and start second
        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();

        // Test case 3: Open status, one epoch to claim
        assertEq(vault.getEpochLengthToClaim(user1), 1);

        // Run second epoch
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();
        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();

        // Test case 4: Running status, two epochs to claim
        assertEq(vault.getEpochLengthToClaim(user1), 2);

        // User claims rewards
        vm.prank(user1);
        vault.claimRewards();

        // Test case 5: Running status, no epochs to claim after claiming
        assertEq(vault.getEpochLengthToClaim(user1), 0);

        // End second epoch and start third
        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();

        // Test case 6: Open status, no epochs to claim
        assertEq(vault.getEpochLengthToClaim(user1), 0);

        // Test case 7: User with no stake
        assertEq(vault.getEpochLengthToClaim(user2), 0);
    }

    //TODO test entering an epoch after 1st. TVL should be previous tvl + or - enter and exits since opening

    function testClaimRewards() public {
        uint256 depositAmount = 1 ether;
        uint256 rewardAmount = 0.1 ether;

        //a user enters
        vm.prank(user1);
        vault.enter{value: depositAmount}();

        //owner starts running epoch and funds are locked
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        //owner allocates rewards
        vm.prank(owner);
        vault.allocateRewards{value: rewardAmount}();

        //user claims rewards after allocation
        uint256 balanceBefore = user1.balance;
        vm.prank(user1);
        vault.claimRewards();
        uint256 balanceAfter = user1.balance;

        //verify succesful claim
        assertEq(balanceAfter - balanceBefore, rewardAmount);
    }

    function testClaimRewardsMultipleEpochs() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        //   ---- First epoch ----
        vm.prank(owner);
        //owner starts running epoch and funds are locked
        vault.lockFundsAndRunCurrentEpoch();
        vm.prank(owner);
        //owner allocates rewards
        vault.allocateRewards{value: 0.1 ether}();
        vm.prank(owner);
        //owner terminates current epoch and open next
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();

        //   ---- Second epoch ----
        vm.prank(owner);
        //owner starts running epoch and funds are locked
        vault.lockFundsAndRunCurrentEpoch();
        vm.prank(owner);
        //owner allocates rewards
        vault.allocateRewards{value: 0.2 ether}();
        vm.prank(owner);
        //owner terminates current epoch and open next
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();

        uint256 balanceBefore = user1.balance;
        vm.prank(user1);
        vault.claimRewards();
        uint256 balanceAfter = user1.balance;

        assertEq(balanceAfter - balanceBefore, 0.3 ether); // Total rewards from both epochs
    }

    function testErrorClaimNoActiveStakeBeforeEntrance() public {
        //owner starts running epoch and funds are locked
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        //owner allocates rewards
        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();

        //reverts on claiming rewards with no active stake
        vm.expectRevert(EthVault.NoRewardToClaim.selector);
        vm.prank(user2);
        vault.claimRewards();
    }

    function testErrorClaimNoActiveStakeAfterFullExit() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();

        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();

        vm.prank(user1);
        vault.exit(1 ether);

        vm.expectRevert(EthVault.NoRewardToClaim.selector);
        vm.prank(user1);
        vault.claimRewards();
    }

    function testErrorClaimNoActiveStakeAfterClaimingAgainSameEpoch() public {
        //user enters
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        //owner starts running epoch and funds are locked
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        //owner allocates rewards
        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();

        vm.prank(user1);
        vault.claimRewards();

        //claim again same epoch, no reward to claim
        vm.expectRevert(EthVault.NoRewardToClaim.selector);
        vm.prank(user1);
        vault.claimRewards();
    }

    function testErrorClaimNoActiveStakeAfterExit() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();

        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();

        vm.prank(user1);
        vault.exit(1 ether);

        //user has exited and claimed automatically, no reward to claim
        vm.expectRevert(abi.encodeWithSelector(EthVault.NoRewardToClaim.selector));
        vm.prank(user1);
        vault.claimRewards();
    }

    function testErrorClaimUnclaimable() public {
        //user enters
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        //owner starts running epoch and funds are locked
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        //reverts on claiming rewards before allocation
        vm.expectRevert(abi.encodeWithSelector(EthVault.UnClaimableRewards.selector));
        vm.prank(user1);
        vault.claimRewards();
    }

    function testMultipleUsersInteractionClaim() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        vm.prank(user2);
        vault.enter{value: 2 ether}();

        //start running epoch and lock funds
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        //allocate rewards
        vm.prank(owner);
        vault.allocateRewards{value: 0.3 ether}();

        //terminate current epoch and open next
        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: 3 ether}();

        vm.prank(user1);
        uint256 user1BalanceBefore = user1.balance;
        vault.claimRewards();
        uint256 user1BalanceAfter = user1.balance;

        vm.prank(user2);
        uint256 user2BalanceBefore = user2.balance;
        vault.exit(2 ether);
        uint256 user2BalanceAfter = user2.balance;

        // Check user1's claimed rewards
        assertEq(user1BalanceAfter - user1BalanceBefore, 0.1 ether);

        // Check user2's exit amount (stake + rewards)
        assertEq(user2BalanceAfter - user2BalanceBefore, 2.2 ether);

        // Check final state
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

        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(owner);
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

        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();

        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();

        uint256 balanceBefore = user1.balance;
        vm.prank(user1);
        vault.claimRewards();
        uint256 balanceAfter = user1.balance;

        assertEq(balanceAfter - balanceBefore, 0.1 ether);
    }

    function testHasClaimableRewards() public {
        // No stake
        assertFalse(vault.hasClaimableRewards(user1));

        // First epoch, no rewards allocated
        vm.prank(user1);
        vault.enter{value: 1 ether}();
        assertFalse(vault.hasClaimableRewards(user1));

        // Rewards allocated
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();
        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();
        assertTrue(vault.hasClaimableRewards(user1));

        // After claiming in open epoch
        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();
        vm.prank(user1);
        vault.claimRewards();
        assertFalse(vault.hasClaimableRewards(user1));
    }

    function testClaimRewardsForEpochs() public {
        // Setup: User1 enters and we run through multiple epochs
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        for (uint256 i = 0; i < 5; i++) {
            vm.prank(owner);
            vault.lockFundsAndRunCurrentEpoch();
            vm.prank(owner);
            vault.allocateRewards{value: 0.1 ether}();
            vm.prank(owner);
            vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();
        }

        // Test case 1: Successful claim for 3 epochs
        uint256 balanceBefore = user1.balance;
        vm.prank(user1);
        vault.claimRewardsForEpochs(3);
        uint256 balanceAfter = user1.balance;
        assertEq(balanceAfter - balanceBefore, 0.3 ether);

        // Test case 2: Successful claim for remaining 2 epochs
        balanceBefore = user1.balance;
        vm.prank(user1);
        vault.claimRewardsForEpochs(2);
        balanceAfter = user1.balance;
        assertEq(balanceAfter - balanceBefore, 0.2 ether);

        // Test case 3: Attempt to claim when no rewards are available
        vm.expectRevert(EthVault.NoRewardToClaim.selector);
        vm.prank(user1);
        vault.claimRewardsForEpochs(1);

        // Test case 4: Attempt to claim more epochs than available
        vm.expectRevert(EthVault.NoRewardToClaim.selector);
        vm.prank(user1);
        vault.claimRewardsForEpochs(10);

        // Test case 5: Attempt to claim with 0 epochs
        vm.expectRevert(abi.encodeWithSelector(EthVault.InvalidEpochsToClaim.selector, 0));
        vm.prank(user1);
        vault.claimRewardsForEpochs(0);

        // Test case 6: Attempt to claim when rewards are not claimable
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();
        vm.expectRevert(EthVault.UnClaimableRewards.selector);
        vm.prank(user1);
        vault.claimRewardsForEpochs(1);

        // Test case 7: Attempt to claim with no stake
        vm.expectRevert(EthVault.UnClaimableRewards.selector);
        vm.prank(user2);
        vault.claimRewardsForEpochs(1);

        // Test case 8: Enter in a new epoch and try to claim
        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}(); // Allocate rewards before terminating
        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();
        vm.prank(user1);
        vault.enter{value: 1 ether}();
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();
        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();

        vm.prank(user1);
        balanceBefore = user1.balance;
        vault.claimRewardsForEpochs(1);
        balanceAfter = user1.balance;
        assertEq(balanceAfter - balanceBefore, 0.1 ether);
    }

    // --------------------------------------
    //   TransferFailed TESTS
    // --------------------------------------

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

        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();

        vm.expectRevert(abi.encodeWithSelector(EthVault.TransferFailed.selector));
        vm.prank(failedT);
        failedTransfer.claimRewards();
    }

    function testErrorLockFundsAndRunCurrentEpochTransferFailed() public {
        vm.prank(owner);
        vault.setFundWallet(address(failedTransfer));

        //fundwallet is address that will revert on transfer
        address fw = vault.fundWallet();
        assertEq(fw, address(failedTransfer));

        //user enters
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        //vault has balance
        assertEq((address(vault)).balance, 1 ether);

        //will revert because fundwallet reverts on receiving funds
        vm.expectRevert(abi.encodeWithSelector(EthVault.TransferFailed.selector));
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        //transfer failed, vault still has balance
        assertEq((address(vault)).balance, 1 ether);
    }

    // ------------------------------------
    // TESTS FOR VAULT CONTRACT EVENTS
    // ------------------------------------

    function testEventEpochRunning() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();

        // We expect both EpochRunning and FundsTransferredToFundWallet events to be emitted
        vm.expectEmit(true, true, true, true);
        emit EpochRunning(1, block.timestamp, 1 ether);

        vm.expectEmit(true, true, true, true);
        emit FundsTransferredToFundWallet(1 ether, 1);

        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        // Additional checks to ensure the epoch is actually running
        assertEq(uint256(vault.currentEpochStatus()), uint256(EthVault.EpochStatus.Running));
        assertFalse(vault.claimableRewards());
        assertEq(fundWallet.balance, 1 ether);
    }

    function testEventEpochTerminated() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();
        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();

        vm.expectEmit(true, true, true, true);
        emit EpochTerminated(1, block.timestamp);

        vm.prank(owner);
        vault.terminateCurrentAndOpenNextEpoch{value: 1 ether}();
    }

    function testEventRewardsAllocated() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        vm.expectEmit(true, true, true, true);
        emit RewardsAllocated(1, 0.1 ether);

        vm.prank(owner);
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
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();
        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();

        vm.expectEmit(true, true, true, true);
        emit UserRewardClaim(user1, 0.1 ether, 1);

        vm.prank(user1);
        vault.claimRewards();
    }

    function testEventMinimumStakeChanged() public {
        uint256 newMinimumStake = 0.1 ether;

        vm.expectEmit(true, true, true, true);
        emit MinimumStakeChanged(0.05 ether, newMinimumStake);

        vm.prank(owner);
        vault.setMinimumStake(newMinimumStake);
    }

    function testEventFundWalletChanged() public {
        address newFundWallet = address(0x123);

        vm.expectEmit(true, true, true, true);
        emit FundWalletChanged(fundWallet, newFundWallet);

        vm.prank(owner);
        vault.setFundWallet(newFundWallet);
    }

    function testEventRewardsClaimabilityChanged() public {
        vm.prank(user1);
        vault.enter{value: 1 ether}();
        vm.prank(owner);
        vault.lockFundsAndRunCurrentEpoch();

        vm.expectEmit(true, true, true, true);
        emit RewardsClaimabilityChanged(true);

        vm.prank(owner);
        vault.allocateRewards{value: 0.1 ether}();
    }

    function testEventLockingContract() public {
        vm.expectEmit(true, true, true, true);
        emit LockingContract(true);

        vm.prank(owner);
        vault.lockOrUnlockContract(true);
    }

    // ------------------------------------
    //      FUZZING TESTS
    // ------------------------------------

    function testFuzzEnterAndExit(uint256 enterAmount, uint256 exitAmount) public {
        // Preconditions
        vm.assume(enterAmount > vault.mininmumStake());
        vm.assume(exitAmount > 0 && exitAmount <= enterAmount);
        vm.deal(user1, enterAmount);

        vm.prank(user1);
        vault.enter{value: enterAmount}();

        // Assertions
        (uint256 stakedAmount,) = vault.userStakes(user1);
        assertEq(stakedAmount, enterAmount);

        vm.prank(user1);
        vault.exit(exitAmount);

        // Postconditions
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

        // Ensure the owner has enough ETH to allocate rewards and return funds
        vm.deal(owner, totalStake + rewardAmount);

        vm.startPrank(owner);
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
            assertApproxEqAbs(claimed, expectedReward, 1); // Allow for 1 wei rounding error
        }

        assertApproxEqAbs(totalClaimed, rewardAmount, 3); // Allow for up to 3 wei total rounding error
    }

    function testStressRapidEnterExit(uint8 cycleCount) public {
        cycleCount = uint8(bound(cycleCount, 10, 100));
        address user = vm.addr(10);
        uint256 totalAddedRewards;
        vm.deal(user, 1000 ether);

        for (uint8 i = 0; i < cycleCount; i++) {
            vm.prank(user);
            vault.enter{value: 1 ether}();

            vm.prank(owner);
            vault.lockFundsAndRunCurrentEpoch();
            vm.prank(owner);
            vault.allocateRewards{value: 0.1 ether}();
            totalAddedRewards += 0.1 ether;
            vm.prank(owner);
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
