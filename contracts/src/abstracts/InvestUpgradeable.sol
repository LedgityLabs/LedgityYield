// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Contracts
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {GlobalOwnableUpgradeable} from "./GlobalOwnableUpgradeable.sol";
import {GlobalPausableUpgradeable} from "./GlobalPausableUpgradeable.sol";
import {GlobalRestrictableUpgradeable} from "./GlobalRestrictableUpgradeable.sol";

// Libraries & interfaces
import {SafeERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {IERC20MetadataUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import {APRHistory as APRH} from "../libs/APRHistory.sol";
import {SUD} from "../libs/SUD.sol";
import {RecoverableUpgradeable} from "../abstracts/RecoverableUpgradeable.sol";

import "./base/BaseUpgradeable.sol";

/**
 * @title InvestUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice This contract provides a bunch of investment utilities shared between LToken
 * and LDYStaking contracts. This includes invested token, investment periods, virtual
 * balances, rewards calculations, and auto-compounding.
 * @dev Children contract must:
 *  - Set invested token during initialization
 *  - Implement _investmentOf() function
 *  - Implement _distributeRewards() function (optional)
 * For further details, see "InvestmentUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract InvestUpgradeable is BaseUpgradeable {
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
        APRH.Reference ref;
    }

    /**
     * @dev Represents investment information of an account (a.k.a investor or user).
     * @param period The current investment period of the account.
     * @param virtualBalance May hold a part of account rewards until they are claimed
     * (see _beforeInvestmentChange())
     */
    struct AccountInfos {
        InvestmentPeriod period;
        uint256 virtualBalance;
    }

    /// @dev Holds reference to invested token contract
    IERC20Upgradeable private _invested;

    /// @dev Holds investment information of each account
    mapping(address => AccountInfos) internal accountsInfos;

    /// @dev Holds the history of APR through time (see APRHistory.sol)
    APRH.Pack[] private _packedAPRHistory;

    /// @dev Holds active rewards redirection
    mapping(address => address) public rewardsRedirectsFromTo;
    mapping(address => address[]) public rewardsRedirectsToFrom;

    /// @dev Prevents claim re-entrancy / infinite loop
    bool private _isClaiming;

    /**
     * @dev Emitted to inform listeners about a change in the APR.
     * @param newAPRUD7x3 The new APR in UD7x3 format.
     */
    event APRUpdateEvent(uint16 newAPRUD7x3);

    /**
     * @dev Initializer functions of the contract. They replace the constructor() function
     * in context of upgradeable contracts.
     * See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param globalOwner_ The address of the GlobalOwner contract
     * @param globalPause_ The address of the GlobalPause contract
     * @param globalBlacklist_ The address of the GlobalBlacklist contract
     * @param invested_ The invested token's contract address.
     */
    function __Invest_init(
        address globalOwner_,
        address globalPause_,
        address globalBlacklist_,
        address invested_
    ) internal onlyInitializing {
        __Base_init(globalOwner_, globalPause_, globalBlacklist_);
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
     * @param aprUD7x3 The new APR in UD7x3 format.
     */
    function setAPR(uint16 aprUD7x3) public onlyOwner {
        APRH.setAPR(_packedAPRHistory, aprUD7x3);
        emit APRUpdateEvent(aprUD7x3);
    }

    /**
     * @dev Extracts and returns the latest APR from the APR history.
     * @return The current APR in UD7x3 format.
     */
    function getAPR() public view returns (uint16) {
        return APRH.getAPR(_packedAPRHistory);
    }

    /**
     * @dev Setter for the rewards redirection.
     * @param from The address of the account to redirect rewards from
     * @param to The address of the account to redirect rewards to
     */
    function startRedirectRewards(
        address from,
        address to
    ) public whenNotPaused notBlacklisted(from) notBlacklisted(to) {
        // Ensure the address is not already redirecting rewards
        require(rewardsRedirectsFromTo[from] == address(0), "L62");

        // Ensure that from and to are not the zero address
        require(from != address(0), "L12");
        require(to != address(0), "L13");

        // Ensure from and to are different addresses
        require(from != to, "L14");

        // Ensure caller is either the owner or the from address
        require(_msgSender() == owner() || _msgSender() == from, "L15");

        // Reset investment period of involved accounts
        _beforeInvestmentChange(from, true);
        _beforeInvestmentChange(to, true);

        // Apply rewards redirection
        rewardsRedirectsFromTo[from] = to;
        rewardsRedirectsToFrom[to].push(from);
    }

    /**
     * @dev Unset a previously set rewards redirection
     * @param from The address of the account to stop redirecting rewards from
     * @param to The address of the account to stop redirecting rewards to
     */
    function stopRedirectRewards(
        address from,
        address to
    ) public whenNotPaused notBlacklisted(from) notBlacklisted(to) {
        // Ensure that from and to are not the zero address
        require(from != address(0), "L16");
        require(to != address(0), "L17");

        // Ensure caller is either the owner or the from address
        require(_msgSender() == owner() || _msgSender() == from, "L18");

        // Ensure rewards were redirected
        require(rewardsRedirectsFromTo[from] == to, "L19");

        // Reset investment period of involved accounts
        _beforeInvestmentChange(from, true);
        _beforeInvestmentChange(to, true);

        // Compute from index in to's redirection array
        int256 fromIndex = -1;
        for (uint256 i = 0; i < rewardsRedirectsToFrom[to].length; i++) {
            if (rewardsRedirectsToFrom[to][i] == from) {
                fromIndex = int256(i);
                break;
            }
        }

        // Stop rewards redirection
        rewardsRedirectsFromTo[from] = address(0);
        rewardsRedirectsToFrom[to][uint256(fromIndex)] = rewardsRedirectsToFrom[to][
            rewardsRedirectsToFrom[to].length - 1
        ];
        rewardsRedirectsToFrom[to].pop();
    }

    /**
     * @dev Function to be optionally implemented by child contracts. If implemented, it
     * should return true to indicate a successful claiming. If it returns false, the
     * rewards will be added to the account's virtual balance, to be claimed later.
     * @param account The account to claim the rewards of.
     * @param amount The amount of rewards to claim.
     */
    function _distributeRewards(address account, uint256 amount) internal virtual returns (bool) {
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
     * @dev This function calculates the rewards generated during a given period of time,
     * considering a given deposited amount and the APR during this period.
     *
     * For further details, see "InvestUpgradeable > Rewards calculation" section of the whitepaper.
     * @param beginTimestamp The beginning of the period.
     * @param endTimestamp The end of the period.
     * @param aprUD7x3 The APR of the period, in UD7x3 format.
     * @param investedAmount The amount deposited during the period.
     */
    function _calculatePeriodRewards(
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD7x3,
        uint256 investedAmount
    ) internal view returns (uint256 rewards) {
        // Cache invested token decimals number
        uint256 d = SUD.decimalsOf(address(invested()));

        // Calculate elapsed years
        uint256 elaspedTimeSUD = SUD.fromInt(endTimestamp - beginTimestamp, d);
        uint256 elapsedYearsSUD = (elaspedTimeSUD * SUD.fromInt(1, d)) / SUD.fromInt(365 days, d);

        // Calculate deposited amount growth (thanks to rewards)
        uint256 aprSUD = SUD.fromRate(aprUD7x3, d);
        uint256 growthSUD = (elapsedYearsSUD * aprSUD) / SUD.fromInt(1, d);

        // Calculate and return rewards
        uint256 investedAmountSUD = SUD.fromAmount(investedAmount, d);
        uint256 rewardsSUD = (investedAmountSUD * growthSUD) / SUD.fromInt(100, d);
        rewards = SUD.toAmount(rewardsSUD, d);
    }

    /**
     * @dev Returns the sum of given account invested amount plus the invested amount of
     * all accounts that directly or indirectly redirect rewards to this account.
     * @param account The account to calculate the deep investment of.
     * @return deepInvestedAmount The deep invested amount.
     */
    function _deepInvestmentOf(address account) internal view returns (uint256 deepInvestedAmount) {
        // Consider account's direct investment
        deepInvestedAmount += _investmentOf(account);

        // But also investment of all accounts that directly or indirectly redirect to this account
        for (uint256 i = 0; i < rewardsRedirectsToFrom[account].length; i++) {
            deepInvestedAmount += _deepInvestmentOf(rewardsRedirectsToFrom[account][i]);
        }
    }

    /**
     * @dev Calculates the current unclaimed rewards of a given account.
     * For further details, see "InvestUpgradeable > Rewards calculation" section of the whitepaper.
     * @param account The account to calculate the rewards of.
     * @param autocompound Whether to autocompound the rewards between APR checkpoints.
     */
    function _rewardsOf(
        address account,
        bool autocompound
    ) internal view returns (uint256 rewards) {
        // Return 0 if packs array is empty
        uint256 packsLength = _packedAPRHistory.length;
        if (packsLength == 0) return 0;

        // Return 0 if only one pack exists but is blank
        uint256 lastPackCursor = _packedAPRHistory[packsLength - 1].cursor;
        if (packsLength == 1 && lastPackCursor == 0) return 0;

        // Retrieve account infos and deep deposited amount
        AccountInfos memory infos = accountsInfos[account];
        uint256 depositedAmount = _deepInvestmentOf(account);

        // Initialize variables that will be used in the following computations
        APRH.Reference memory currRef;
        APRH.CheckpointData memory currCheckpoint;
        APRH.Reference memory nextRef;
        APRH.CheckpointData memory nextCheckpoint;

        // Populate above variables with deposit checkpoint and the one right after it
        currRef = infos.period.ref;
        currCheckpoint = APRH.getDataFromReference(_packedAPRHistory, currRef);

        // 1) Fill rewards with virtual balance (rewards not claimed yet)
        // See "InvestUpgradeable > Rewards calculation > 1)" section of the whitepaper
        rewards = infos.virtualBalance;

        // If current checkpoint is not the last one, retrieve the next checkpoint
        if (currRef.packIndex != packsLength - 1 || currRef.cursorIndex != lastPackCursor - 1) {
            nextRef = APRH.incrementReference(currRef);
            nextCheckpoint = APRH.getDataFromReference(_packedAPRHistory, nextRef);

            // 2) Calculate rewards from deposit to next checkpoint
            // See "InvestUpgradeable > Rewards calculation > 2)" section of the whitepaper
            rewards += _calculatePeriodRewards(
                infos.period.timestamp,
                nextCheckpoint.timestamp,
                currCheckpoint.aprUD7x3,
                depositedAmount + (autocompound ? rewards : 0) // Auto-compounding: past rewards generate new rewards
            );

            // 3) Calculate rewards for each crossed pair of checkpoints
            // See "InvestUpgradeable > Rewards calculation > 3)" section of the whitepaper
            while (true) {
                // Set current checkpoint as the next one
                currRef = nextRef;
                currCheckpoint = nextCheckpoint;

                // Break if current checkpoint is the last one
                if (
                    currRef.packIndex == packsLength - 1 &&
                    currRef.cursorIndex == lastPackCursor - 1
                ) break;

                // Retrieve the new next checkpoint
                nextRef = APRH.incrementReference(currRef);
                nextCheckpoint = APRH.getDataFromReference(_packedAPRHistory, nextRef);

                // Calculate rewards for the current pair of checkpoints
                rewards += _calculatePeriodRewards(
                    currCheckpoint.timestamp,
                    nextCheckpoint.timestamp,
                    currCheckpoint.aprUD7x3,
                    depositedAmount + (autocompound ? rewards : 0) // Auto-compounding: past rewards generate new rewards
                );
            }

            // 4) Calculate rewards from the last checkpoint to now
            // See "InvestUpgradeable > Rewards calculation > 4)" section of the whitepaper
            rewards += _calculatePeriodRewards(
                currCheckpoint.timestamp,
                uint40(block.timestamp),
                currCheckpoint.aprUD7x3,
                depositedAmount + (autocompound ? rewards : 0) // Auto-compounding: past rewards generate new rewards
            );
        } else {
            // 2) Calculate rewards from the last checkpoint to now
            // See "InvestUpgradeable > Rewards calculation > 2)" section of the whitepaper
            rewards += _calculatePeriodRewards(
                infos.period.timestamp,
                uint40(block.timestamp),
                currCheckpoint.aprUD7x3,
                depositedAmount + (autocompound ? rewards : 0) // Auto-compounding: past rewards generate new rewards
            );
        }
    }

    /**
     * @dev Reset the investment period (timestamp + amount) of the given account plus
     * the ones of all accounts that directly or indirectly redirect rewards to this account.
     * @param account The account to reset the investment period of.
     */
    function _deepResetInvestmentPeriodOf(address account) internal {
        // Reset account deposit timestamp to current block timestamp and checkpoint reference to the latest one
        accountsInfos[account].period.timestamp = uint40(block.timestamp);
        accountsInfos[account].period.ref = APRH.getLatestReference(_packedAPRHistory);

        // Also reset the ones of all accounts that directly or indirectly redirect rewards to this account
        for (uint256 i = 0; i < rewardsRedirectsToFrom[account].length; i++) {
            _deepResetInvestmentPeriodOf(rewardsRedirectsToFrom[account][i]);
        }
    }

    /**
     * @dev Claim/Store the current rewards of an account and reset its investment period.
     * @param account The account to reset the investment period of.
     * @param autocompound Whether to autocompound the rewards.
     */
    function _beforeInvestmentChange(address account, bool autocompound) internal {
        // As this function is called inside of _beforeTokenTransfer in LToken contract
        // and as claiming implies minting in LToken contract, this state prevents infinite
        // re-entrancy by skipping this function body while a claim is in progress.
        if (_isClaiming) return;

        // Skip reset if it has already been done during this block
        if (accountsInfos[account].period.timestamp == uint40(block.timestamp)) return;

        // If account redirects its rewards
        address redirectRewardsTo = rewardsRedirectsFromTo[account];
        if (redirectRewardsTo != address(0)) {
            // Call hook of redirection target
            // This will indirectly reset the investment period of the account itself
            _beforeInvestmentChange(redirectRewardsTo, autocompound);

            // Then return
            return;
        }

        // Else if account doesn't redirect its rewards, continue
        // Compute account's undistributed rewards
        uint256 rewards = _rewardsOf(account, autocompound);

        // If there some rewards to distribute
        if (rewards > 0) {
            // Try to distribute rewards to recipient
            // _distributeRewards() returns false if not implemented or has failed
            _isClaiming = true;
            bool distributed = _distributeRewards(account, rewards);
            _isClaiming = false;

            // If rewards have not been distributed, accumulate them in recipient virtual balance
            if (!distributed) accountsInfos[account].virtualBalance = rewards;
        }

        // Also reset those for all accounts that redirect rewards to this account
        _deepResetInvestmentPeriodOf(account);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
