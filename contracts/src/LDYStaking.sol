// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

// Contracts
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {BaseUpgradeable} from "./abstracts/base/BaseUpgradeable.sol";

// Libraries
import {SafeERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

// Interfaces
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

/**
 * @title LDYStaking
 * @custom:security-contact security@ledgity.com
 *
 * @dev This contract implements tierOf() function from LDYStaking as it's the only
 * one the LToken contract relies on.
 *
 * @custom:security-contact security@ledgity.com
 */
contract LDYStaking is BaseUpgradeable, ReentrancyGuardUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /**
     * @notice Represents a user staking info in array.
     * @param stakedAmount Amount of the stake.
     * @param unStakeAt Unstake at.
     * @param duration Staking period in seconds.
     * @param rewardPerTokenPaid Reward per token paid.
     * @param rewards Rewards to be claimed.
     */
    struct StakingInfo {
        uint256 stakedAmount;
        uint256 unStakeAt;
        uint256 duration;
        uint256 rewardPerTokenPaid;
        uint256 rewards;
    }

    /**
     * @notice Represent duration and multiplier per each stake option.
     * @param duration Staking period in seconds.
     * @param multiplier Token weight
     */
    struct StakeDurationInfo {
        uint256 duration;
        uint256 multiplier;
    }

    /// @notice Decimals of multiplier
    uint256 public constant MULTIPLIER_BASIS = 1e4;

    /// @notice Stake and Reward token.
    IERC20Upgradeable public stakeRewardToken;

    /// @notice Minimal stake duration for perks.
    uint256 public stakeDurationForPerks;

    /// @notice Minimal stake amount for perks.
    uint256 public stakeAmountForPerks;

    /// @notice Stake durations info array.
    StakeDurationInfo[] public stakeDurationInfos;

    /// @notice Duration of the rewards (in seconds).
    uint256 public rewardsDuration;

    /// @notice Timestamp of when the rewards finish.
    uint256 public finishAt;

    /// @notice Timestamp of the reward updated.
    uint256 public lastUpdateTime;

    /// @notice Reward per second(total rewards / duration).
    uint256 public rewardRatePerSec;

    /// @notice Reward per token stored, sum of (reward rate * dt * 1e18 / total supply).
    uint256 public rewardPerTokenStored;

    /// @notice Total staked amounts.
    uint256 public totalStaked;

    // Total staked amounts with multiplier applied
    uint256 public totalWeightedStake;

    /// @notice User stakingInfo map, user address => array of the staking info
    mapping(address => StakingInfo[]) public userStakingInfo;

    /// @notice Total rewards amount.
    uint256 public totalRewards;

    /**
     * @notice Emitted when users stake token
     * @param user User address
     * @param stakeIndex Latest index of user staking pool
     * @param amount Staked amount
     */
    event Staked(address indexed user, uint256 stakeIndex, uint256 amount);

    /**
     * @notice Emitted when users unstake token
     * @param user User address
     * @param stakeIndex User staking pool index
     * @param amount Staked amount
     */
    event Unstaked(address indexed user, uint256 stakeIndex, uint256 amount);

    /**
     * @notice Emitted when users claim rewards
     * @param user User address
     * @param stakeIndex User staking pool index
     * @param reward Reward token amount
     */
    event RewardPaid(address indexed user, uint256 stakeIndex, uint256 reward);

    /**
     * @notice Emitted when admin add rewards.
     * @param rewardAmount Reward amount added by admin.
     * @param rewardPerSec RewardRatePerSec updated.
     */
    event NotifiedRewardAmount(uint256 rewardAmount, uint256 rewardPerSec);

    /**
     * @notice Holds a mapping of addresses that default to the highest staking tier.
     * @dev This is notably used to allow PreMining contracts to benefit from 0%
     * withdrawal fees in L-Tokens contracts, when accounts unlock their funds.
     */
    mapping(address => bool) public highTierAccounts;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initializes the contract and sets the initial state variables. This is called by the proxy and should only be called once.
     * @dev This function is intended for setting initial values for the contract's state variables.
     * @param globalOwner_ The address of the GlobalOwner contract.
     * @param globalPause_ The address of the GlobalPause contract.
     * @param globalBlacklist_ The address of the GlobalBlacklist contract.
     * @param stakeRewardToken_ The address of stake and reward token(LDY token).
     * @param stakeDurationInfos_ Available Staking Durations.
     * @param stakeDurationForPerks_ Minimal staking duration for perks.
     * @param stakeAmountForPerks_ Minimal staking amount for perks.
     */
    function initialize(
        address globalOwner_,
        address globalPause_,
        address globalBlacklist_,
        address stakeRewardToken_,
        StakeDurationInfo[] memory stakeDurationInfos_,
        uint256 stakeDurationForPerks_,
        uint256 stakeAmountForPerks_
    ) public initializer {
        __Base_init(globalOwner_, globalPause_, globalBlacklist_);
        stakeRewardToken = IERC20Upgradeable(stakeRewardToken_);
        uint stakeDurationInfosLength = stakeDurationInfos_.length;
        for (uint256 i = 0; i < stakeDurationInfosLength; i++) {
            stakeDurationInfos.push(stakeDurationInfos_[i]);
        }
        stakeDurationForPerks = stakeDurationForPerks_;
        stakeAmountForPerks = stakeAmountForPerks_;
    }

    // --------------------
    //  MUTATIVE FUNCTIONS
    // --------------------

    /**
     * @notice Staked tokens cannot be withdrawn during the stakeDuration period and are eligible to claim rewards.
     * @dev Emits a `Staked` event upon successful staking.
     * @param amount The amount of tokens to stake.
     * @param stakeDurationIndex The Index of stakeDurationInfos array.
     */
    function stake(
        uint256 amount,
        uint8 stakeDurationIndex
    ) external nonReentrant whenNotPaused notBlacklisted(_msgSender()) {
        require(amount > 0, "amount = 0");
        require(stakeDurationIndex <= stakeDurationInfos.length - 1, "Invalid staking period");

        _updateReward(address(0), 0);
        StakeDurationInfo memory stakeDurationInfo = stakeDurationInfos[stakeDurationIndex];
        StakingInfo memory stakingInfo = StakingInfo({
            stakedAmount: amount,
            unStakeAt: block.timestamp + stakeDurationInfo.duration,
            duration: stakeDurationInfo.duration,
            rewardPerTokenPaid: rewardPerTokenStored,
            rewards: 0
        });

        // check whether account is eligible for benefit from the protocol
        if (stakeDurationInfo.duration >= stakeDurationForPerks && amount >= stakeAmountForPerks) {
            highTierAccounts[_msgSender()] = true;
        }

        userStakingInfo[_msgSender()].push(stakingInfo);

        uint256 stakeIndex = userStakingInfo[_msgSender()].length - 1;
        uint256 weightedStake = (amount * stakeDurationInfo.multiplier) / MULTIPLIER_BASIS;
        totalWeightedStake += weightedStake;
        totalStaked += amount;

        stakeRewardToken.safeTransferFrom(_msgSender(), address(this), amount);

        emit Staked(_msgSender(), stakeIndex, amount);
    }

    /**
     * @notice Withdraw staked tokens after stakeDuration has passed.
     * @dev Emits a `Unstaked` event upon successful withdrawal.
     * On full withdrawal, userStakingInfo removes stake pool for stakeIndex.
     * @param amount The amount of tokens to withdraw.
     * @param stakeIndex The index of user staking pool
     */
    function unstake(
        uint256 amount,
        uint256 stakeIndex
    ) external nonReentrant notBlacklisted(_msgSender()) {
        require(amount > 0, "amount = 0");
        require(userStakingInfo[_msgSender()].length >= stakeIndex + 1, "Invalid stakeIndex");
        require(
            block.timestamp >= userStakingInfo[_msgSender()][stakeIndex].unStakeAt,
            "Cannot unstake during staking period"
        );
        require(
            amount <= userStakingInfo[_msgSender()][stakeIndex].stakedAmount,
            "Insufficient unstake amount"
        );

        _updateReward(_msgSender(), stakeIndex);

        uint256 multiplier = _getMultiplier(userStakingInfo[_msgSender()][stakeIndex].duration);

        uint256 currentWeightedStake = (amount * multiplier) / MULTIPLIER_BASIS;
        totalWeightedStake -= currentWeightedStake;

        totalStaked -= amount;
        userStakingInfo[_msgSender()][stakeIndex].stakedAmount -= amount;

        // check whether account is eligible for benefit from the protocol
        if (
            userStakingInfo[_msgSender()][stakeIndex].duration >= stakeDurationForPerks &&
            userStakingInfo[_msgSender()][stakeIndex].stakedAmount < stakeAmountForPerks
        ) {
            highTierAccounts[_msgSender()] = false;
        }

        // remove staking info from array on full withdrawal
        if (userStakingInfo[_msgSender()][stakeIndex].stakedAmount == 0) {
            _claimReward(_msgSender(), stakeIndex);

            userStakingInfo[_msgSender()][stakeIndex] = userStakingInfo[_msgSender()][
                userStakingInfo[_msgSender()].length - 1
            ];
            userStakingInfo[_msgSender()].pop();
        }
        stakeRewardToken.safeTransfer(_msgSender(), amount);

        emit Unstaked(_msgSender(), stakeIndex, amount);
    }

    /**
     * @notice Claim pending rewards.
     * @dev Emits a `RewardPaid` event upon successful reward claim.
     * @param stakeIndex The index of user staking pool.
     */
    function getReward(uint256 stakeIndex) external nonReentrant notBlacklisted(_msgSender()) {
        require(userStakingInfo[_msgSender()].length >= stakeIndex + 1, "Invalid stakeIndex");
        _updateReward(_msgSender(), stakeIndex);
        _claimReward(_msgSender(), stakeIndex);
    }

    // --------------------
    // ADMIN CONFIGURATION
    // --------------------

    /**
     * @notice Update Rewards Duration.
     * @dev Only callable by owner, and setting available only after rewards period.
     * @param duration New reward duration in seconds.
     */
    function setRewardsDuration(uint256 duration) external onlyOwner {
        require(finishAt < block.timestamp, "reward duration is not finished");
        rewardsDuration = duration;
    }

    /**
     * @notice Update stakeDurationForPerks
     * @dev Only callable by owner.
     * @param stakeDurationForPerks_ New stakeDurationForPerks.
     */
    function setStakeDurationForPerks(uint256 stakeDurationForPerks_) external onlyOwner {
        stakeDurationForPerks = stakeDurationForPerks_;
    }

    /**
     * @notice Update stakeAmountForPerks
     * @dev Only callable by owner.
     * @param stakeAmountForPerks_ New stakeDurationForPerks.
     */
    function setStakeAmountForPerks(uint256 stakeAmountForPerks_) external onlyOwner {
        stakeAmountForPerks = stakeAmountForPerks_;
    }

    /**
     * @notice Push stakeDurationInfo
     * @dev Only callable by owner.
     */
    function pushStakeDurationInfo(StakeDurationInfo memory durationInfo) external onlyOwner {
        stakeDurationInfos.push(durationInfo);
    }

    /**
     * @notice Notify the contract about the amount of rewards to be distributed and update reward parameters.
     * @dev Only callable by owner.
     * @param amount The amount of reward to be distributed.
     */
    function notifyRewardAmount(uint256 amount) external onlyOwner {
        require(rewardsDuration > 0, "rewards duration is not set");
        require(amount > 0, "amount = 0");

        _updateReward(address(0), 0);

        if (block.timestamp >= finishAt) {
            rewardRatePerSec = amount / rewardsDuration;
        } else {
            uint256 remainingRewards = (finishAt - block.timestamp) * rewardRatePerSec;
            rewardRatePerSec = (amount + remainingRewards) / rewardsDuration;
        }

        require(rewardRatePerSec > 0, "reward rate = 0");
        require(
            rewardRatePerSec <=
                (stakeRewardToken.balanceOf(address(this)) + amount - totalStaked) /
                    rewardsDuration,
            "reward amount > balance"
        );

        finishAt = block.timestamp + rewardsDuration;
        lastUpdateTime = block.timestamp;

        totalRewards += amount;
        stakeRewardToken.safeTransferFrom(_msgSender(), address(this), amount);

        emit NotifiedRewardAmount(amount, rewardRatePerSec);
    }

    // --------------------
    //    VIEW FUNCTIONS
    // --------------------

    /**
     * @notice Get the last time when rewards were applicable for the specified reward token.
     * @return Timestamp of the most recent rewards calculation.
     */
    function lastTimeRewardApplicable() public view returns (uint256) {
        return _min(finishAt, block.timestamp);
    }

    /**
     * @notice Calculate the reward per token for a given reward token.
     * @return Current reward per token.
     */
    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }

        return
            rewardPerTokenStored +
            ((rewardRatePerSec * (lastTimeRewardApplicable() - lastUpdateTime) * 1e18) /
                totalWeightedStake);
    }

    /**
     * @notice Calculate the user's stake pool earnings
     * @param account Address of the user.
     * @param stakeIndex Index of the stakePool
     * @return Return earned amounts
     */
    function earned(address account, uint256 stakeIndex) public view returns (uint256) {
        StakingInfo memory userInfo = userStakingInfo[account][stakeIndex];
        uint256 multiplier = _getMultiplier(userInfo.duration);
        uint256 weightedAmount = (userInfo.stakedAmount * multiplier) / MULTIPLIER_BASIS;
        uint256 rewardsSinceLastUpdate = ((weightedAmount *
            (rewardPerToken() - userInfo.rewardPerTokenPaid)) / 1e18);
        return rewardsSinceLastUpdate + userInfo.rewards;
    }

    /**
     * @notice Get the earned rewards array for a user.
     * @param account Address of the user.
     * @return Return earned rewards array for a user.
     */
    function getEarnedUser(address account) public view returns (uint256[] memory) {
        uint256 numberOfPools = userStakingInfo[account].length;
        uint256[] memory earnedArray = new uint256[](numberOfPools);
        for (uint256 index; index < numberOfPools; index++) {
            earnedArray[index] = earned(account, index);
        }
        return earnedArray;
    }

    /**
     * @dev tierOf() function that always returns that the given account is not
     * eligible to any LDY staking tier, except if the account is in the
     * highTierAccounts mapping.
     * @param account The account to check the tier of.
     */
    function tierOf(address account) public view returns (uint256 tier) {
        if (highTierAccounts[account]) return 3;
        return 0;
    }

    /**
     * @notice Get User Stake Data.
     * @param account The address of user.
     * @return StakingInfo array.
     */
    function getUserStakes(address account) external view returns (StakingInfo[] memory) {
        return userStakingInfo[account];
    }

    /**
     * @notice Get StakeDurationInfo.
     * @param index Index of StakeDurationInfos.
     * @return StakeDurationInfo.
     */
    function getStakeDurationInfo(uint256 index) external view returns (StakeDurationInfo memory) {
        require(stakeDurationInfos.length - 1 >= index, "wrong index");
        return stakeDurationInfos[index];
    }

    /**
     * @notice Send rewards to user.
     * @dev This is private function, called by getReward function.
     * @param account The address of user.
     * @param stakeIndex The index of user staking pool.
     */
    function _claimReward(address account, uint256 stakeIndex) private {
        uint256 reward = userStakingInfo[account][stakeIndex].rewards;

        if (reward > 0) {
            userStakingInfo[account][stakeIndex].rewards = 0;
            totalRewards -= reward;
            stakeRewardToken.safeTransfer(account, reward);
            emit RewardPaid(account, stakeIndex, reward);
        }
    }

    /**
     * @notice Calculate and update user rewards per stakeIndex.
     * @dev this is private function, called by stake, unstake, getRewards, and notifyRewardAmount functions.
     * @param account The address of user.
     * @param stakeIndex The index of user staking pool.
     */
    function _updateReward(address account, uint256 stakeIndex) private {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();

        if (account != address(0)) {
            userStakingInfo[account][stakeIndex].rewards = earned(account, stakeIndex);
            userStakingInfo[account][stakeIndex].rewardPerTokenPaid = rewardPerTokenStored;
        }
    }

    /**
     * @notice Get multiplier from stakeDurationInfo based on duration
     * @param duration Stake Duration
     */
    function _getMultiplier(uint256 duration) private view returns (uint256) {
        uint256 stakeDurationInfosLength = stakeDurationInfos.length;
        for (uint256 i = 0; i < stakeDurationInfosLength; i++) {
            StakeDurationInfo memory stakeDurationInfo = stakeDurationInfos[i];
            if (duration == stakeDurationInfo.duration) {
                return stakeDurationInfo.multiplier;
            }
        }
        return 0;
    }

    /**
     * @notice Take minimum value between x and y.
     */
    function _min(uint256 x, uint256 y) private pure returns (uint256) {
        return x <= y ? x : y;
    }
}
