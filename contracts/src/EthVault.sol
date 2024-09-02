// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "solady/src/utils/FixedPointMathLib.sol";

pragma solidity 0.8.18;

/**
 * @title Ledgity ETH Vault Contract
 * @author torof
 * @notice This contract implements a ETH staking and reward distribution system operating in epochs.
 *         Users can provide funds that will be used for derivatives (short put and call options) operations, and in return,
 *         they will receive yield proportionally to their stake.
 * @dev The contract allows users to stake funds, which are locked for a period of time (an epoch).
 *      The contract has a lifecycle that includes opening, running, and terminating epochs, distributing
 *      rewards, and claiming rewards.
 *      Adding and withdrawing funds is possible only when the epoch status is "Open".
 *      Claiming rewards is always possible EXCEPT during the timeframe between when an epoch
 *      starts running and when rewards are allocated for that epoch.
 *
 * @custom:warning claiming entails the use of a loop, if too many epochs to claim, it may fail
 *                 the gas cost of the call and the success or failure should be estimated before calling
 *                 a security function is present to break down claiming in chunks.
 */
contract EthVault is Initializable, UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    struct Epoch {
        uint256 totalValueLocked;
        uint256 totalEpochRewards;
    }

    struct UserStake {
        uint256 amount;
        uint256 lastEpochClaimedAt;
    }

    enum EpochStatus {
        Open,
        Running
    }

    EpochStatus public currentEpochStatus;
    address public fundWallet;
    bool public claimableRewards;
    Epoch[] public epochs;
    uint256 public currentEpochId;
    mapping(address => UserStake) public userStakes;
    uint256 public mininmumStake;
    bool public locked;

    error WrongPhase(string);
    error NoRewardToClaim();
    error UnClaimableRewards();
    error TransferFailed();
    error NoStakeToExit();
    error NotWithdrawable();
    error InsufficientStake(uint256 provided, uint256 required);
    error AmountMustBeGreaterThanZero();
    error InsufficientBalance(uint256 requested, uint256 available);
    error NoActiveStake();
    error InsufficientFundsReturned(uint256 provided, uint256 required);
    error NoRewardsToAllocate();
    error RewardsAlreadyAllocated();
    error ContractLocked();
    error InsufficientClaimableEpochs(uint256 requestedEpochs, uint256 availableEpochs);
    error InvalidEpochsToClaim(uint256 requestedEpochs);

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

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _fundWallet) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        epochs.push(Epoch(0, 0));
        epochs.push(Epoch(0, 0));

        fundWallet = _fundWallet;
        currentEpochStatus = EpochStatus.Open;
        currentEpochId = 1;
        mininmumStake = 5 ether / 100;

        emit EpochOpened(currentEpochId, block.timestamp);
    }

    modifier IsLocked() {
        if (locked) revert ContractLocked();
        _;
    }

    function enter() public payable nonReentrant IsLocked {
        if (currentEpochStatus != EpochStatus.Open) revert WrongPhase("ENTER: only allowed during open phase");
        if (msg.value < mininmumStake) revert InsufficientStake(msg.value, mininmumStake);

        UserStake storage userStake = userStakes[msg.sender];

        if (hasClaimableRewards(msg.sender)) {
            _claimRewards(msg.sender);
        } else {
            userStake.lastEpochClaimedAt = currentEpochId - 1;
        }

        userStake.amount += msg.value;
        epochs[currentEpochId].totalValueLocked += msg.value;

        emit UserDeposit(msg.sender, msg.value, currentEpochId);
    }

    function exit(uint256 _amount) public nonReentrant IsLocked {
        if (currentEpochStatus != EpochStatus.Open) revert WrongPhase("EXIT: only allowed during open phase");
        UserStake storage userStake = userStakes[msg.sender];
        if (userStake.amount < _amount) revert InsufficientBalance(_amount, userStake.amount);
        if (_amount == 0) revert AmountMustBeGreaterThanZero();

        if (hasClaimableRewards(msg.sender)) _claimRewards(msg.sender);

        userStake.amount -= _amount;
        epochs[currentEpochId].totalValueLocked -= _amount;

        (bool success,) = msg.sender.call{value: _amount}("");
        if (!success) revert TransferFailed();

        emit UserWithdraw(msg.sender, _amount, currentEpochId);
    }

    function claimRewards() public IsLocked {
        if (!claimableRewards) revert UnClaimableRewards();
        if (!hasClaimableRewards(msg.sender)) revert NoRewardToClaim();
        _claimRewards(msg.sender);
    }

    function hasClaimableRewards(address _user) public view returns (bool) {
        if (userStakes[_user].amount == 0) return false;
        if (currentEpochId == 1 && !claimableRewards) return false;
        if (currentEpochStatus == EpochStatus.Open && userStakes[_user].lastEpochClaimedAt == currentEpochId - 1) {
            return false;
        }
        if (userStakes[_user].lastEpochClaimedAt == currentEpochId) return false;
        else return true;
    }

    function _claimRewards(address _user) internal {
        uint256 totalRewards = calculateRewards(_user);

        // Update lastEpochClaimedAt
        if (currentEpochStatus == EpochStatus.Open) {
            userStakes[_user].lastEpochClaimedAt = currentEpochId - 1;
        } else {
            userStakes[_user].lastEpochClaimedAt = currentEpochId;
        }

        (bool success,) = msg.sender.call{value: totalRewards}("");
        if (!success) revert TransferFailed();

        emit UserRewardClaim(msg.sender, totalRewards, currentEpochId);
    }

    function calculateRewards(address _user) public view returns (uint256) {
        if (!hasClaimableRewards(_user)) return 0;

        uint256 totalRewards;
        uint256 startEpoch = userStakes[_user].lastEpochClaimedAt + 1;
        uint256 endEpoch;

        if (currentEpochStatus == EpochStatus.Open) {
            endEpoch = currentEpochId - 1;
        } else {
            endEpoch = currentEpochId;
        }

        for (uint256 i = startEpoch; i <= endEpoch; i++) {
            Epoch storage epoch = epochs[i];
            uint256 epochReward =
                FixedPointMathLib.mulDiv(userStakes[_user].amount, epoch.totalEpochRewards, epoch.totalValueLocked);
            totalRewards += epochReward;
        }

        return totalRewards;
    }

    function claimRewardsForEpochs(uint256 _numberOfEpochs) public {
        if (_numberOfEpochs == 0) revert InvalidEpochsToClaim(_numberOfEpochs);
        if (!claimableRewards) revert UnClaimableRewards();
        if (!hasClaimableRewards(msg.sender)) revert NoRewardToClaim();

        UserStake storage userStake = userStakes[msg.sender];
        uint256 startEpoch = userStake.lastEpochClaimedAt + 1;
        uint256 maxClaimableEpoch = currentEpochStatus == EpochStatus.Open ? currentEpochId - 1 : currentEpochId;
        uint256 availableEpochs = maxClaimableEpoch >= startEpoch ? maxClaimableEpoch - startEpoch + 1 : 0;

        if (_numberOfEpochs > availableEpochs) {
            revert InsufficientClaimableEpochs(_numberOfEpochs, availableEpochs);
        }

        uint256 endEpoch = startEpoch + _numberOfEpochs - 1;
        uint256 totalRewards;

        for (uint256 i = startEpoch; i <= endEpoch; i++) {
            Epoch storage epoch = epochs[i];
            uint256 epochReward =
                FixedPointMathLib.mulDiv(userStake.amount, epoch.totalEpochRewards, epoch.totalValueLocked);
            totalRewards += epochReward;
        }

        userStake.lastEpochClaimedAt = endEpoch;

        (bool success,) = msg.sender.call{value: totalRewards}("");
        if (!success) revert TransferFailed();

        emit UserRewardClaim(msg.sender, totalRewards, endEpoch);
    }

    function terminateCurrentAndOpenNextEpoch() external payable onlyOwner {
        if (currentEpochStatus != EpochStatus.Running) revert WrongPhase("END EPOCH: can only end a running epoch");
        if (!claimableRewards) revert WrongPhase("END EPOCH: rewards must be allocated before ending the epoch");
        uint256 requiredFunds = epochs[currentEpochId].totalValueLocked;
        if (msg.value < requiredFunds) {
            revert InsufficientFundsReturned(msg.value, requiredFunds);
        }

        Epoch storage currentEpoch = epochs[currentEpochId];

        uint256 fundsToTransfer = currentEpoch.totalValueLocked;

        emit EpochTerminated(currentEpochId, block.timestamp);

        currentEpochId++;

        epochs.push(Epoch(fundsToTransfer, 0));
        currentEpochStatus = EpochStatus.Open;

        emit EpochOpened(currentEpochId, block.timestamp);
    }

    function allocateRewards() external payable onlyOwner {
        if (currentEpochStatus != EpochStatus.Running) revert WrongPhase("ALLOCATE REWARDS: must be in running phase");
        if (msg.value == 0) revert NoRewardsToAllocate();

        Epoch storage currentEpoch = epochs[currentEpochId];
        if (currentEpoch.totalEpochRewards != 0) revert RewardsAlreadyAllocated();

        currentEpoch.totalEpochRewards = msg.value;

        claimableRewards = true;

        emit RewardsAllocated(currentEpochId, msg.value);
        emit RewardsClaimabilityChanged(true);
    }

    function lockFundsAndRunCurrentEpoch() external onlyOwner {
        if (currentEpochStatus != EpochStatus.Open) {
            revert WrongPhase("RUN EPOCH: can only start running from open phase");
        }

        currentEpochStatus = EpochStatus.Running;
        claimableRewards = false;

        uint256 amountToTransfer = epochs[currentEpochId].totalValueLocked;
        (bool success,) = address(fundWallet).call{value: amountToTransfer}("");
        if (!success) revert TransferFailed();

        emit EpochRunning(currentEpochId, block.timestamp, amountToTransfer);
        emit FundsTransferredToFundWallet(amountToTransfer, currentEpochId);
    }

    function getEpochLengthToClaim(address _user) external view returns (uint256) {
        if (userStakes[_user].amount == 0) {
            return 0;
        }

        uint256 length;
        uint256 startEpoch = userStakes[_user].lastEpochClaimedAt + 1;
        uint256 endEpoch;

        if (currentEpochStatus == EpochStatus.Open) {
            endEpoch = currentEpochId - 1;
        } else {
            endEpoch = currentEpochId;
        }

        for (uint256 i = startEpoch; i <= endEpoch; i++) {
            length++;
        }

        return length;
    }

    function setFundWallet(address _fundWallet) external onlyOwner {
        address previousFundWallet = fundWallet;
        fundWallet = _fundWallet;
        emit FundWalletChanged(previousFundWallet, fundWallet);
    }

    function setMinimumStake(uint256 _mininmumStake) external onlyOwner {
        uint256 previousMininmumStake = mininmumStake;
        mininmumStake = _mininmumStake;
        emit MinimumStakeChanged(previousMininmumStake, mininmumStake);
    }

    function getAllEpochs() external view returns (Epoch[] memory) {
        return epochs;
    }

    function lockOrUnlockContract(bool _locked) external onlyOwner {
        require(locked != _locked, "Contract already in requested state");
        locked = _locked;
        emit LockingContract(locked);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
