// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title LDYStaking
 * @custom:security-contact security@ledgity.com
 *
 *
 * @dev This contract implements tierOf() function from LDYStaking as it's the only
 * one the LToken contract relies on.
 *
 * @custom:security-contact security@ledgity.com
 */
contract LDYStaking is Ownable2Step, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    struct StakingInfo {
        uint256 stakedAmount; // Amount of the stake
        uint256 unStakeAt; // Unstake at
        uint256 duration; // Staking period in seconds
        uint256 rewardPerTokenPaid; // Reward per token paid
        uint256 rewards; // Rewards to be claimed
    }

    IERC20 public immutable Token;

    uint256 public immutable StakeDurationForPerks;
    uint256 public immutable StakeAmountForPerks;

    // Stake durations
    uint256[] public StakeDurations;

    // Duration of the rewards (in seconds)
    uint256 public rewardsDuration;
    // Timestamp of when the rewards finish
    uint256 public finishAt;
    // Timestamp of the reward updated
    uint256 public lastUpdateTime;
    // Reward per second(total rewards / duration)
    uint256 public rewardRatePerSec;
    // Sum of (reward rate * dt * 1e18 / total supply)
    uint256 public rewardPerTokenStored;

    // Total staked amounts
    uint256 public totalStaked;

    // User address => array of the staking info
    mapping(address => StakingInfo[]) public userStakingInfo;

    event Staked(address indexed user, uint256 stakeNumber, uint256 amount);
    event Unstaked(address indexed user, uint256 stakeNumber, uint256 amount);
    event RewardPaid(address indexed user, uint256 stakeNumber, uint256 reward);

    /**
     * @notice Holds a mapping of addresses that default to the highest staking tier.
     * @dev This is notably used to allow PreMining contracts to benefit from 0%
     * withdrawal fees in L-Tokens contracts, when accounts unlock their funds.
     */
    mapping(address => bool) public highTierAccounts;

    constructor(
        address _stakeRewardToken,
        uint256[] memory _stakeDurations,
        uint256 _stakeDurationForPerks,
        uint256 _stakeAmountForPerks
    ) {
        Token = IERC20(_stakeRewardToken);
        StakeDurations = _stakeDurations;
        StakeDurationForPerks = _stakeDurationForPerks;
        StakeAmountForPerks = _stakeAmountForPerks;
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return _min(finishAt, block.timestamp);
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }

        return
            rewardPerTokenStored +
            (rewardRatePerSec * (lastTimeRewardApplicable() - lastUpdateTime) * 1e18) /
            totalStaked;
    }

    function stake(uint256 _amount, uint8 _stakePeriodIndex) external nonReentrant whenNotPaused {
        require(_amount > 0, "amount = 0");
        require(_stakePeriodIndex <= StakeDurations.length - 1, "invalid staking period");

        _updateReward(address(0), 0);
        uint256 stakeDuration = StakeDurations[_stakePeriodIndex];
        StakingInfo memory stakingInfo = StakingInfo({
            stakedAmount: _amount,
            unStakeAt: block.timestamp + stakeDuration,
            duration: stakeDuration,
            rewardPerTokenPaid: rewardPerTokenStored,
            rewards: 0
        });

        // check whether account is eligible for benefit from the protocol
        if (stakeDuration >= StakeDurationForPerks && _amount >= StakeAmountForPerks) {
            highTierAccounts[msg.sender] = true;
        }

        userStakingInfo[msg.sender].push(stakingInfo);

        uint256 stakeNumber = userStakingInfo[msg.sender].length - 1;
        totalStaked += _amount;

        Token.safeTransferFrom(msg.sender, address(this), _amount);
        emit Staked(msg.sender, stakeNumber, _amount);
    }

    function unstake(uint256 _amount, uint256 _stakeNumber) external nonReentrant {
        require(_amount > 0, "amount = 0");
        require(userStakingInfo[msg.sender].length >= _stakeNumber + 1, "invalid stakeNumber");
        require(
            block.timestamp >= userStakingInfo[msg.sender][_stakeNumber].unStakeAt,
            "not allowed unstaking in the staking period"
        );
        require(
            _amount <= userStakingInfo[msg.sender][_stakeNumber].stakedAmount,
            "insufficient amount"
        );

        _updateReward(msg.sender, _stakeNumber);
        totalStaked -= _amount;
        userStakingInfo[msg.sender][_stakeNumber].stakedAmount -= _amount;

        // check whether account is eligible for benefit from the protocol
        if (
            userStakingInfo[msg.sender][_stakeNumber].duration >= StakeDurationForPerks &&
            userStakingInfo[msg.sender][_stakeNumber].stakedAmount < StakeAmountForPerks
        ) {
            highTierAccounts[msg.sender] = false;
        }

        // remove staking info from array
        if (userStakingInfo[msg.sender][_stakeNumber].stakedAmount == 0) {
            _claimReward(msg.sender, _stakeNumber);

            userStakingInfo[msg.sender][_stakeNumber] = userStakingInfo[msg.sender][
                userStakingInfo[msg.sender].length - 1
            ];
            userStakingInfo[msg.sender].pop();
        }
        Token.safeTransfer(msg.sender, _amount);
        emit Unstaked(msg.sender, _stakeNumber, _amount);
    }

    function earned(address _account, uint256 _stakeNumber) public view returns (uint256) {
        StakingInfo memory userInfo = userStakingInfo[_account][_stakeNumber];
        uint256 rewardsSinceLastUpdate = ((userInfo.stakedAmount *
            (rewardPerToken() - userInfo.rewardPerTokenPaid)) / 1e18);
        return rewardsSinceLastUpdate + userInfo.rewards;
    }

    function getReward(uint256 _stakeNumber) external nonReentrant {
        require(userStakingInfo[msg.sender].length >= _stakeNumber + 1, "invalid stakeNumber");
        _updateReward(msg.sender, _stakeNumber);
        _claimReward(msg.sender, _stakeNumber);
    }

    function setRewardsDuration(uint256 _duration) external onlyOwner {
        require(finishAt < block.timestamp, "reward duration is not finished");
        rewardsDuration = _duration;
    }

    function notifyRewardAmount(uint256 _amount) external onlyOwner {
        require(rewardsDuration > 0, "rewards duration is not set");
        require(_amount > 0, "amount = 0");

        _updateReward(address(0), 0);

        Token.safeTransferFrom(msg.sender, address(this), _amount);

        if (block.timestamp >= finishAt) {
            rewardRatePerSec = _amount / rewardsDuration;
        } else {
            uint256 remainingRewards = (finishAt - block.timestamp) * rewardRatePerSec;
            rewardRatePerSec = (_amount + remainingRewards) / rewardsDuration;
        }

        require(rewardRatePerSec > 0, "reward rate = 0");
        require(
            rewardRatePerSec * rewardsDuration <= (Token.balanceOf(address(this)) - totalStaked),
            "reward amount > balance"
        );

        finishAt = block.timestamp + rewardsDuration;
        lastUpdateTime = block.timestamp;
    }

    /**
     * @dev tierOf() function that always return that the given account is not
     * elligible to any LDY staking tier, except if the account is in the
     * highTierAccounts mapping.
     * @param account The account to check the tier of.
     */
    function tierOf(address account) public view returns (uint256 tier) {
        if (highTierAccounts[account]) return 3;
        return 0;
    }

    function getUserStakes(address _user) external view returns (StakingInfo[] memory) {
        return userStakingInfo[_user];
    }

    function _claimReward(address _user, uint256 _stakeNumber) private {
        uint256 reward = userStakingInfo[_user][_stakeNumber].rewards;

        if (reward > 0) {
            userStakingInfo[_user][_stakeNumber].rewards = 0;
            Token.safeTransfer(_user, reward);
            emit RewardPaid(_user, _stakeNumber, reward);
        }
    }

    function _updateReward(address _account, uint256 _stakeNumber) private {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();

        if (_account != address(0)) {
            userStakingInfo[_account][_stakeNumber].rewards = earned(_account, _stakeNumber);
            userStakingInfo[_account][_stakeNumber].rewardPerTokenPaid = rewardPerTokenStored;
        }
    }

    function _min(uint256 x, uint256 y) private pure returns (uint256) {
        return x <= y ? x : y;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
