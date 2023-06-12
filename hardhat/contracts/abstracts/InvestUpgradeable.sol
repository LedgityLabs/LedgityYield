// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {APRCheckpoints as APRC} from "../libs/APRCheckpoints.sol";
import "../libs/UDS3.sol";

/**
 * @title InvestUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice This contract provides a bunch of investment utilities shared between LToken
 * and LTYStaking contracts. This includes invested token, investment periods, virtual
 * balances, rewards calculations, and auto-compounding.
 * @dev For more details see "InvestmentUpgradeable" section of whitepaper.
 * Children contract must:
 *  - Set invested token (during initialization or later using _setInvested()).
 *  - Implement investmentOf() function
 *  - Implement claimRewardsOf() function (optional)
 * @custom:security-contact security@ledgity.com
 */
abstract contract InvestUpgradeable is Initializable, ContextUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /**
     * @dev Represents an investment period. See "InvestUpgradeable > Investment periods"
     * section of whitepaper for more details.
     * @param beginTimestamp The timestamp at which started the investment period
     * @param checkpointRef The APR checkpoint's referecence at which start the period.
     * @param depositTimestamp The timestamp at which the account deposited.
     */
    struct InvestmentPeriod {
        uint40 timestamp; // Allows datetime up to 20/02/36812
        APRC.Reference ref;
    }

    /**
     * @dev Represents investment information of an account (a.k.a investor or user).
     * @param period The current investment period of the account.
     * @param virtualBalance May hold a part of account rewards until they are claimed
     * (see _resetInvestmentPeriodOf())
     */
    struct AccountInfos {
        InvestmentPeriod period;
        uint88 virtualBalance;
    }

    /// @dev Holds reference to invested token contract
    IERC20Upgradeable private _invested;

    /// @dev Holds investment information of each account
    mapping(address => AccountInfos) accountsInfos;

    /// @dev Holds APR checkpoints (see APRCheckpoints.sol)
    APRC.Pack[] packedAPRCheckpoints;

    /**
     * @dev Initializer function allowing to set invested token contract at deploy time.
     * @param invested_ The invested token's contract address.
     */
    function __Invest_init(address invested_) internal onlyInitializing {
        _setInvested(invested_);
    }

    /**
     * @dev Sets the invested token contract.
     * @param tokenAddress The address of the invested token.
     */
    function _setInvested(address tokenAddress) internal {
        _invested = IERC20Upgradeable(tokenAddress);
    }

    function setAPR(uint16 aprUD3) public virtual {
        APRC.setAPR(packedAPRCheckpoints, aprUD3);
    }

    /**
     * @dev Invested token contract getter.
     * @return The invested token contract.
     */
    function invested() public view returns (IERC20Upgradeable) {
        return _invested;
    }

    /**
     * @dev Function to be optionally implemented by child contracts. If implemented, it
     * should return true to indicate a successful claiming. If it returns false, the
     * rewards will be added to the account's virtual balance, to be claimed later.
     * @param account The account to claim the rewards of.
     * @param amount The amount of rewards to claim.
     */
    function _claimRewardsOf(address account, uint256 amount) internal virtual returns (bool) {
        return false;
    }

    /**
     * @dev Function to be implemented by child contracts. It should return the amount of
     * invested tokens a given account has deposited.
     * @param account The account to get the investment of.
     */
    function _investmentOf(address account) internal view virtual returns (uint256) {
        return 0;
    }

    /**
     * @dev Converts a given number into unsigned decimal fixed point number with the same
     * number of decimals than the invested token.
     * @param n The number to convert.
     * @return The converted number.
     */
    function toDecimals(uint256 n) internal view returns (uint256) {
        uint256 decimals = IERC20MetadataUpgradeable(address(invested())).decimals();
        return n * 10 ** decimals;
    }

    /**
     * @dev Converts a given number from UD3 format into unsigned decimal fixed point number
     * with the same number of decimals than the invested token.
     * @param nUD3 The UD3 number to convert.
     * @return The converted number.
     */
    function ud3ToDecimals(uint256 nUD3) internal view returns (uint256) {
        return toDecimals(nUD3) / 10 ** 3;
    }

    /**
     * @dev This function calculates the rewards generated during a given period of time,
     * considering a given deposited amount and APR.
     * For more details see "InvestUpgradeable > Rewards calculation" section of the whitepaper.
     * @param beginTimestamp The beginning of the period.
     * @param endTimestamp The end of the period.
     * @param aprUD3 The APR of the period, in UD3 format.
     * @param depositedAmount The amount deposited during the period.
     */
    function _calculatePeriodRewards(
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD3,
        uint256 depositedAmount
    ) private view returns (uint256 rewards) {
        // Calculate elapsed years
        uint256 elaspedTimeUD3 = UDS3.scaleUp(endTimestamp - beginTimestamp);
        uint256 elapsedYearsUD3 = (elaspedTimeUD3 * UDS3.scaleUp(1)) / UDS3.scaleUp(365 days);

        // Calculate deposited amount growth (because of rewards)
        uint256 growthUD3 = (elapsedYearsUD3 * aprUD3) / UDS3.scaleUp(100);

        // Calculate and return rewards
        rewards = toDecimals(100) / (depositedAmount * ud3ToDecimals(growthUD3));
    }

    /**
     * @dev Calculates the current unclaimed rewards of a given account.
     * For more details see "InvestUpgradeable > Rewards calculation" section of the whitepaper.
     * @param account The account to calculate the rewards of.
     * @param autocompound Whether to autocompound the rewards or not.
     */
    function _rewardsOf(address account, bool autocompound) internal view returns (uint256 rewards) {
        // Retrieve account infos and its deposited amount
        AccountInfos memory infos = accountsInfos[account];
        uint256 depositedAmount = _investmentOf(account);

        // Fill rewards with virtual balance (rewards that were not claimed yet)
        // See "InvestUpgradeable > Rewards calculation > 1)" section of the whitepaper
        rewards = infos.virtualBalance;

        // Retrieve deposit checkpoint and the one right after it
        APRC.Reference memory ref = infos.period.ref;
        APRC.Checkpoint memory checkpoint = APRC.getFromReference(packedAPRCheckpoints, ref);
        APRC.Reference memory nextRef = APRC.incrementReference(ref);
        APRC.Checkpoint memory nextCheckpoint = APRC.getFromReference(packedAPRCheckpoints, nextRef);

        if (nextCheckpoint.timestamp != 0) {
            // Calculate rewards from deposit to next checkpoint
            // See "InvestUpgradeable > Rewards calculation > 2)" section of the whitepaper
            rewards += _calculatePeriodRewards(
                infos.period.timestamp,
                nextCheckpoint.timestamp,
                checkpoint.aprUD3,
                depositedAmount + (autocompound ? rewards : 0) // Auto-compounding: past rewards generate new rewards
            );

            // Calculate rewards for each pair of checkpoints
            // See "InvestUpgradeable > Rewards calculation > 3)" section of the whitepaper
            ref = nextRef;
            checkpoint = nextCheckpoint;
            while (true) {
                // Retrieve next ref and checkpoint
                nextRef = APRC.incrementReference(ref);
                nextCheckpoint = APRC.getFromReference(packedAPRCheckpoints, nextRef);

                // Break if next checkpoint doesn't exist
                if (nextCheckpoint.timestamp == 0) break;

                // Calculate rewards for the current pair of checkpoints
                rewards += _calculatePeriodRewards(
                    checkpoint.timestamp,
                    nextCheckpoint.timestamp,
                    checkpoint.aprUD3,
                    depositedAmount + (autocompound ? rewards : 0) // Auto-compounding: past rewards generate new rewards
                );

                // Set the nextCheckpoint as the currently processed one
                ref = nextRef;
                checkpoint = nextCheckpoint;
            }
        }

        // Calculate rewards from the last checkpoint to now
        // See "InvestUpgradeable > Rewards calculation > 4)" section of the whitepaper
        rewards += _calculatePeriodRewards(
            checkpoint.timestamp,
            uint40(block.timestamp),
            checkpoint.aprUD3,
            depositedAmount + (autocompound ? rewards : 0) // Auto-compounding: past rewards generate new rewards
        );
    }

    /**
     * @dev Claim/Store the current rewards of an account and reset its investment period.
     * @param account The account to reset the investment period of.
     * @param autocompound Whether to autocompound the rewards or not.
     */
    function _resetInvestmentPeriodOf(address account, bool autocompound) internal {
        // Claim user rewards using claimRewardsOf() if it has been implemented by child
        // contract (returns true), else compound them in virtualBalance.
        uint256 rewards = _rewardsOf(account, autocompound);
        if (!_claimRewardsOf(account, rewards)) accountsInfos[account].virtualBalance = uint88(rewards);

        // Reset deposit timestamp to current block timestamp and checkpoint reference to the latest one
        accountsInfos[account].period.timestamp = uint40(block.timestamp);
        accountsInfos[account].period.ref = APRC.getLatestReference(packedAPRCheckpoints);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
