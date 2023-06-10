// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title
 * @author
 * @notice This contract provides a bunch of investment mechanisms shared between LToken
 * and LTYStaking contracts. This includes APR checkpoints, rewards calculations, and
 * investment periods.
 * Children contract must:
 * - Set invested token, else during initialization, else later using _setInvested().
 * - Implement claimRewards() function internally if they make usage of non-discrete
 *   reset of investment period.
 * - Implement depositedBy() function which should return the amount staked by a given
 *   account.
 */
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../libs/APRCheckpoints.sol";
import "../libs/UDS3.sol";

abstract contract InvestUpgradeable is Initializable, ContextUpgradeable {
    struct AccountInfos {
        APRCheckpoints.Reference depositCheckpointReference;
        uint40 depositTimestamp; // Allows representing datetime up to 20/02/36812
        uint88 unclaimedBalance;
    }

    IERC20Upgradeable private _invested; // Holds reference to invested token contract
    mapping(address => AccountInfos) accountsInfos;
    APRCheckpoints.Pack[] packedAPRCheckpoints;

    function __Invest_init(IERC20Upgradeable invested_) internal onlyInitializing {
        _invested = invested_;
    }

    function _setInvested(address tokenAddress) internal {
        _invested = IERC20Upgradeable(tokenAddress);
    }

    function invested() public view returns (IERC20Upgradeable) {
        return _invested;
    }

    function toDecimals(uint256 n) internal view returns (uint256) {
        uint256 decimals = IERC20MetadataUpgradeable(address(invested())).decimals();
        return n * 10 ** decimals;
    }

    function ud3ToDecimals(uint256 nUD3) internal view returns (uint256) {
        return toDecimals(nUD3) / 10 ** 3;
    }

    /**
     * @dev This function calculates the rewards generate during a given period, considering a given deposited amount and APR.
     * @param beginTimestamp The beginning of the period.
     * @param endTimestamp The end of the period.
     * @param aprUD3 The APR of the period, in UD3 format.
     * @param depositedAmount The amount deposited during the period.
     */
    function calculatePeriodRewards(
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD3,
        uint256 depositedAmount
    ) public view returns (uint256 rewards) {
        // Calculate elapsed years
        uint256 elaspedTimeUD3 = UDS3.scaleUp(endTimestamp - beginTimestamp);
        uint256 elapsedYearsUD3 = (elaspedTimeUD3 * UDS3.scaleUp(1)) / UDS3.scaleUp(365 days);

        // Calculate amount growth
        uint256 growthUD3 = (elapsedYearsUD3 * aprUD3) / UDS3.scaleUp(100);

        // Calculate and return rewards
        rewards = (depositedAmount * ud3ToDecimals(growthUD3)) / toDecimals(100);
    }

    /**
     * This function calculates the current unclaimed rewards of a given account.
     * @param account The account to calculate the rewards of.
     */
    function rewardsOf(address account) public view returns (uint256 rewards) {
        // Retrieve account infos and deposited amount
        AccountInfos memory infos = accountsInfos[account];
        uint256 _depositedAmount = investmentOf(account);

        // Initialize the current processed checkpoint's reference with the account deposit checkpoint reference
        APRCheckpoints.Reference memory ref = infos.depositCheckpointReference;
        APRCheckpoints.Checkpoint memory checkpoint = APRCheckpoints.getCheckpointFromReference(
            packedAPRCheckpoints,
            ref
        );
        checkpoint.timestamp = infos.depositTimestamp;

        // Initialize rewards with the unclaimed rewards, and loop through all checkpoints the account has traversed
        rewards = 0;
        while (true) {
            // Retrieve next checkpoint reference and data
            APRCheckpoints.Reference memory nextRef = APRCheckpoints.incrementCheckpointReference(ref);
            APRCheckpoints.Checkpoint memory nextCheckpoint = APRCheckpoints.getCheckpointFromReference(
                packedAPRCheckpoints,
                nextRef
            );

            // If the next checkpoint is empty, break the loop.
            if (nextCheckpoint.timestamp == 0) break;

            // Calculate rewards for the period and add it to the total rewards
            rewards += calculatePeriodRewards(
                checkpoint.timestamp,
                nextCheckpoint.timestamp,
                checkpoint.aprUD3,
                _depositedAmount + rewards
            );

            // Increment the checkpoint reference
            (ref, checkpoint) = (nextRef, nextCheckpoint);
        }

        // Calculate rewards for the unbounded period (last checkpoint)
        rewards += calculatePeriodRewards(
            checkpoint.timestamp,
            uint40(block.timestamp),
            checkpoint.aprUD3,
            _depositedAmount + rewards
        );
    }

    // To be implemented by child contracts
    function claimRewardsOf(address account, uint256 amount) internal virtual returns (bool) {
        return false;
    }

    // To be implemented by child contracts
    function investmentOf(address account) internal view virtual returns (uint256) {
        return 0;
    }

    function _resetInvestmentPeriodOf(address account) internal {
        // Store all rewards accumulated up to there. Uses claimRewardsOf() if it has been
        // implemented by child contract (returns true), else compound them in unclaimedBalance.
        uint256 rewards = rewardsOf(account);
        if (claimRewardsOf(account, rewards)) {} else
            accountsInfos[account].unclaimedBalance += uint88(rewards);

        // Reset deposit timestamp to current block timestamp and checkpoint reference to the latest one
        accountsInfos[account].depositTimestamp = uint40(block.timestamp);
        accountsInfos[account].depositCheckpointReference = APRCheckpoints.getLatestCheckpointReference(
            packedAPRCheckpoints
        );
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
