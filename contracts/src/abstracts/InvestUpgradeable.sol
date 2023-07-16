// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Contracts
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {GlobalOwnableUpgradeable} from "./GlobalOwnableUpgradeable.sol";

// Libraries & interfaces
import {SafeERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {IERC20MetadataUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import {APRCheckpoints as APRC} from "../libs/APRCheckpoints.sol";
import {UDS3} from "../libs/UDS3.sol";

/**
 * @title InvestUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice This contract provides a bunch of investment utilities shared between LToken
 * and LTYStaking contracts. This includes invested token, investment periods, virtual
 * balances, rewards calculations, and auto-compounding.
 * @dev Children contract must:
 *  - Set invested token during initialization
 *  - Implement _investmentOf() function
 *  - Implement _claimRewardsOf() function (optional)
 * Also, note that the contract is not pausable or restrictable as none of its functions
 * are intended to be called externally by non-owner accounts.
 * For further details, see "InvestmentUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract InvestUpgradeable is Initializable, GlobalOwnableUpgradeable {
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
        uint256 virtualBalance;
    }

    /// @dev Holds reference to invested token contract
    IERC20Upgradeable private _invested;

    /// @dev Holds investment information of each account
    mapping(address => AccountInfos) internal accountsInfos;

    /// @dev Holds the history of APR through time (see APRCheckpoints.sol)
    APRC.Pack[] private _packedAPRCheckpoints;

    /// @dev Prevents claim re-entrancy / infinite loop
    bool private _isClaiming;

    /**
     * @dev Emitted to inform listeners about a change in the APR.
     * @param newAPRUD3 The new APR in UD3 format.
     */
    event APRUpdateEvent(uint16 newAPRUD3);

    /**
     * @dev Initializer functions of the contract. They replace the constructor() function
     * in context of upgradeable contracts.
     * See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param globalOwner_ The address of the GlobalOwner contract
     * @param invested_ The invested token's contract address.
     */
    function __Invest_init(address globalOwner_, address invested_) internal onlyInitializing {
        __GlobalOwnable_init(globalOwner_);
        __Invest_init_unchained(invested_);
    }

    function __Invest_init_unchained(address invested_) internal onlyInitializing {
        _invested = IERC20Upgradeable(invested_);
    }

    /**
     * @dev Getter for the invested token contract.
     * @return The invested token contract.
     */
    function invested() public view returns (IERC20Upgradeable) {
        return _invested;
    }

    /**
     * @dev Setter for the current APR. Restricted to owner.
     * @param aprUD3 The new APR in UD3 format.
     */
    function setAPR(uint16 aprUD3) public onlyOwner {
        APRC.setAPR(_packedAPRCheckpoints, aprUD3);
        emit APRUpdateEvent(aprUD3);
    }

    /**
     * @dev Extracts and returns the latest APR from the APR history.
     * @return The current APR in UD3 format.
     */
    function getAPR() public view returns (uint16) {
        return APRC.getAPR(_packedAPRCheckpoints);
    }

    /**
     * @dev Returns the reference of checkpoint at which a given account started its
     * current investment period.
     * IMPORTANT: This function is used in unit tests only and SHOULDN'T BE USED IN REAL
     * CHILD CONTRACTS.
     */
    function ___getStartCheckpointReferenceOf(
        address account
    ) internal view returns (APRC.Reference memory) {
        return accountsInfos[account].period.ref;
    }

    /**
     * @dev Function to be optionally implemented by child contracts. If implemented, it
     * should return true to indicate a successful claiming. If it returns false, the
     * rewards will be added to the account's virtual balance, to be claimed later.
     * @param account The account to claim the rewards of.
     * @param amount The amount of rewards to claim.
     */
    function _claimRewardsOf(address account, uint256 amount) internal virtual returns (bool) {
        account; // Silence unused variable warning
        amount;
        return false;
    }

    /**
     * @dev Function to be implemented by child contracts. It should return the amount of
     * invested tokens a given account has deposited/invested.
     * @param account The account to get the investment of.
     */
    function _investmentOf(address account) internal view virtual returns (uint256);

    /**
     * @dev Scales up a given number by the number of decimals of the invested token.
     * @param n The number to scale up.
     * @return The scaled up number.
     */
    function _toDecimals(uint256 n) internal view returns (uint256) {
        uint256 decimals = IERC20MetadataUpgradeable(address(invested())).decimals();
        return n * 10 ** decimals;
    }

    /**
     * @dev Scales down a given number by the number of decimals of the invested token.
     * @param n The number to scale down.
     * @return The scaled down number.
     */
    function _fromDecimals(uint256 n) internal view returns (uint256) {
        uint256 decimals = IERC20MetadataUpgradeable(address(invested())).decimals();
        return n / 10 ** decimals;
    }

    /**
     * @dev Scale up a given number to UDS3 (invested token decimals + 3 decimals).
     * @param n The number to scale up.
     * @return The scaled down number.
     */
    function _toUDS3(uint256 n) internal view returns (uint256) {
        return UDS3.scaleUp(_toDecimals(n));
    }

    /**
     * @dev Scale down a given number from UDS3 (invested token decimals + 3 decimals).
     * @param nUDS3 The number to scale down.
     * @return The scaled down number.
     */
    function _fromUDS3(uint256 nUDS3) internal view returns (uint256) {
        return UDS3.scaleDown(_fromDecimals(nUDS3));
    }

    /**
     * @dev This function calculates the rewards generated during a given period of time,
     * considering a given deposited amount and the APR during this period.
     *
     * For further details, see "InvestUpgradeable > Rewards calculation" section of the whitepaper.
     * @param beginTimestamp The beginning of the period.
     * @param endTimestamp The end of the period.
     * @param aprUD3 The APR of the period, in UD3 format.
     * @param investedAmount The amount deposited during the period.
     */
    function _calculatePeriodRewards(
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD3,
        uint256 investedAmount
    ) internal view returns (uint256 rewards) {
        // Calculate elapsed years
        uint256 elaspedTimeUDS3 = _toUDS3(endTimestamp - beginTimestamp);
        uint256 elapsedYearsUDS3 = (elaspedTimeUDS3 * _toUDS3(1)) / _toUDS3(365 days);

        // Calculate deposited amount growth (thanks to rewards)
        uint256 aprUDS3 = _toDecimals(aprUD3); // UD3 to UDS3
        uint256 growthUDS3 = (elapsedYearsUDS3 * aprUDS3) / _toUDS3(1);

        // Calculate and return rewards
        uint256 investedAmountUDS3 = UDS3.scaleUp(investedAmount);
        uint256 rewardsUDS3 = (investedAmountUDS3 * growthUDS3) / _toUDS3(100);
        rewards = UDS3.scaleDown(rewardsUDS3); // UDS3 to invested tokens decimals
    }

    /**
     * @dev Calculates the current unclaimed rewards of a given account.
     * For further details, see "InvestUpgradeable > Rewards calculation" section of the whitepaper.
     * @param account The account to calculate the rewards of.
     * @param autocompound Whether to autocompound the rewards between APR checkpoints.
     */
    function _rewardsOf(address account, bool autocompound) internal view returns (uint256 rewards) {
        // Return 0 if packs array is empty
        uint256 packsLength = _packedAPRCheckpoints.length;
        if (packsLength == 0) return 0;

        // Return 0 if only one pack exists but is blank
        uint256 lastPackCursor = _packedAPRCheckpoints[packsLength - 1].cursor;
        if (packsLength == 1 && lastPackCursor == 0) return 0;

        // Retrieve account infos and deposited amount
        AccountInfos memory infos = accountsInfos[account];
        uint256 depositedAmount = _investmentOf(account);

        // Initialize variables that will be used in the following computations
        APRC.Reference memory currRef;
        APRC.Checkpoint memory currCheckpoint;
        APRC.Reference memory nextRef;
        APRC.Checkpoint memory nextCheckpoint;

        // Populate above variables with deposit checkpoint and the one right after it
        currRef = infos.period.ref;
        currCheckpoint = APRC.getDataFromReference(_packedAPRCheckpoints, currRef);

        // 1) Fill rewards with virtual balance (rewards not claimed yet)
        // See "InvestUpgradeable > Rewards calculation > 1)" section of the whitepaper
        rewards = infos.virtualBalance;

        // If current checkpoint is not the last one, retrieve the next checkpoint
        if (currRef.packIndex != packsLength - 1 || currRef.cursorIndex != lastPackCursor - 1) {
            nextRef = APRC.incrementReference(currRef);
            nextCheckpoint = APRC.getDataFromReference(_packedAPRCheckpoints, nextRef);

            // 2) Calculate rewards from deposit to next checkpoint
            // See "InvestUpgradeable > Rewards calculation > 2)" section of the whitepaper
            rewards += _calculatePeriodRewards(
                infos.period.timestamp,
                nextCheckpoint.timestamp,
                currCheckpoint.aprUD3,
                depositedAmount + (autocompound ? rewards : 0) // Auto-compounding: past rewards generate new rewards
            );

            // 3) Calculate rewards for each crossed pair of checkpoints
            // See "InvestUpgradeable > Rewards calculation > 3)" section of the whitepaper
            while (true) {
                // Set current checkpoint as the next one
                currRef = nextRef;
                currCheckpoint = nextCheckpoint;

                // Break if current checkpoint is the last one
                if (currRef.packIndex == packsLength - 1 && currRef.cursorIndex == lastPackCursor - 1)
                    break;

                // Retrieve the new next checkpoint
                nextRef = APRC.incrementReference(currRef);
                nextCheckpoint = APRC.getDataFromReference(_packedAPRCheckpoints, nextRef);

                // Calculate rewards for the current pair of checkpoints
                rewards += _calculatePeriodRewards(
                    currCheckpoint.timestamp,
                    nextCheckpoint.timestamp,
                    currCheckpoint.aprUD3,
                    depositedAmount + (autocompound ? rewards : 0) // Auto-compounding: past rewards generate new rewards
                );
            }

            // 4) Calculate rewards from the last checkpoint to now
            // See "InvestUpgradeable > Rewards calculation > 4)" section of the whitepaper
            rewards += _calculatePeriodRewards(
                currCheckpoint.timestamp,
                uint40(block.timestamp),
                currCheckpoint.aprUD3,
                depositedAmount + (autocompound ? rewards : 0) // Auto-compounding: past rewards generate new rewards
            );
        } else {
            // 2) Calculate rewards from the last checkpoint to now
            // See "InvestUpgradeable > Rewards calculation > 2)" section of the whitepaper
            rewards += _calculatePeriodRewards(
                infos.period.timestamp,
                uint40(block.timestamp),
                currCheckpoint.aprUD3,
                depositedAmount + (autocompound ? rewards : 0) // Auto-compounding: past rewards generate new rewards
            );
        }
    }

    /**
     * @dev Claim/Store the current rewards of an account and reset its investment period.
     * @param account The account to reset the investment period of.
     * @param autocompound Whether to autocompound the rewards.
     */
    function _resetInvestmentPeriodOf(address account, bool autocompound) internal {
        // As this function is called inside of _beforeTokenTransfer in LToken contract
        // and as claiming implies minting in LToken contract, this state prevents infinite
        // re-entrancy by skipping this function body while a claim is in progress.
        if (_isClaiming) return;

        // Retrieve account's unclaimed rewards
        uint256 rewards = _rewardsOf(account, autocompound);

        // If there are rewards to claim
        if (rewards > 0) {
            // Try claiming rewards
            _isClaiming = true;
            bool claimed = _claimRewardsOf(account, rewards); // Returns false if not implemented or failed
            _isClaiming = false;

            // If _claimRewardsOf() is not implemented by child contract or has failed
            // Accumulate rewards in its virtual balance.
            if (!claimed) accountsInfos[account].virtualBalance = rewards;
        }

        // Reset deposit timestamp to current block timestamp and checkpoint reference to the latest one
        accountsInfos[account].period.timestamp = uint40(block.timestamp);
        accountsInfos[account].period.ref = APRC.getLatestReference(_packedAPRCheckpoints);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
