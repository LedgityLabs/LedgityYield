// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Contracts
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {GlobalOwnableUpgradeable} from "./GlobalOwnableUpgradeable.sol";
import {GlobalPausableUpgradeable} from "./GlobalPausableUpgradeable.sol";
import {GlobalRestrictableUpgradeable} from "./GlobalRestrictableUpgradeable.sol";
import "./base/BaseUpgradeable.sol";
import {RecoverableUpgradeable} from "../abstracts/RecoverableUpgradeable.sol";

// Libraries & interfaces
import {SafeERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {IERC20MetadataUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import {APRHistory as APRH} from "../libs/APRHistory.sol";
import {SUD} from "../libs/SUD.sol";

/**
 * @title InvestUpgradeable
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com
 *
 * @notice Derived contracts are provided with a bunch of utilities to manage an invested
 * token, users' investment periods, rewards calculation, virtual balances, and
 * auto-compounding.
 *
 * @dev Derived contract must:
 *  - Set invested token during initialization
 *  - Implement _investmentOf() function
 *  - Implement _distributeRewards() function (optional)
 *
 * @dev For further details, see "InvestmentUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract InvestUpgradeable is BaseUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using APRH for APRH.Pack[];

    /**
     * @notice Represents an account's investment period.
     * @param timestamp The timestamp of the most recent rewards distribution.
     * @param ref The reference of the last APR checkpoint at that timestamp.
     */
    struct InvestmentPeriod {
        uint40 timestamp; // Supports dates up to 20/02/36812
        APRH.Reference ref;
    }

    /**
     * @notice Represents the investment details of an account.
     * @param period The current investment period of the account.
     * @param virtualBalance May hold a part of account rewards until they are claimed.
     */
    struct AccountDetails {
        InvestmentPeriod period;
        uint256 virtualBalance;
    }

    /// @notice Holds a reference to the invested token's contract.
    IERC20Upgradeable private _invested;

    /// @notice Holds investment details of each account.
    mapping(address => AccountDetails) internal accountsDetails;

    /// @notice Holds an history of the APR value over time (see APRHistory.sol).
    APRH.Pack[] private _aprHistory;

    /// @notice Holds active rewards redirections in both from->to and to->from[] ways.
    mapping(address => address) public rewardsRedirectsFromTo;
    mapping(address => address[]) public rewardsRedirectsToFrom;

    /// @notice Is used to prevent infinite loop in _beforeInvestmentChange().
    bool private _isClaiming;

    /**
     * @notice Emitted to inform listeners about a change in the APR's value.
     * @param newAPRUD7x3 The new APR in UD7x3 format.
     */
    event APRUpdateEvent(uint16 newAPRUD7x3);

    /**
     * @notice Initializer functions of the contract. They replace the constructor()
     * function in the context of upgradeable contracts.
     * @dev See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param globalOwner_ The address of the GlobalOwner contract.
     * @param globalPause_ The address of the GlobalPause contract.
     * @param globalBlacklist_ The address of the GlobalBlacklist contract.
     * @param invested_ The address of the invested token contract.
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
     * @notice Retrieves the reference to the invested token contract.
     * @return The reference to the invested token contract.
     */
    function invested() public view returns (IERC20Upgradeable) {
        return _invested;
    }

    /**
     * @notice Updates the investment APR. Restricted to owner.
     * @param aprUD7x3 The new APR in UD7x3 format.
     */
    function setAPR(uint16 aprUD7x3) public onlyOwner {
        _aprHistory.setAPR(aprUD7x3);
        emit APRUpdateEvent(aprUD7x3);
    }

    /**
     * @notice Retrieves the most recently set APR.
     * @return The current APR in UD7x3 format.
     */
    function getAPR() public view returns (uint16) {
        return _aprHistory.getAPR();
    }

    /**
     * @notice Enables redirection of rewards from one account to another.
     * @param from The address of the account to redirect rewards from.
     * @param to The address of the account to redirect rewards to.
     */
    function startRewardsRedirection(
        address from,
        address to
    ) public whenNotPaused notBlacklisted(from) notBlacklisted(to) {
        // Ensure the address is not already redirecting rewards
        require(rewardsRedirectsFromTo[from] == address(0), "L62");

        // Ensure neither 'from' nor 'to' are the zero address
        require(from != address(0), "L12");
        require(to != address(0), "L13");

        // Ensure 'from' and 'to' addresses are distinct
        require(from != to, "L14");

        // Ensure function caller is either the owner or the 'from' address
        require(_msgSender() == owner() || _msgSender() == from, "L15");

        // Distribute current rewards and reset investment periods of both accounts
        _beforeInvestmentChange(from, true);
        _beforeInvestmentChange(to, true);

        // Activate rewards redirection
        rewardsRedirectsFromTo[from] = to;
        rewardsRedirectsToFrom[to].push(from);
    }

    /**
     * @notice Disable an active rewards redirection.
     * @param from The address of the account to stop redirecting rewards from.
     * @param to The address of the account to stop redirecting rewards to.
     */
    function stopRewardsRedirection(
        address from,
        address to
    ) public whenNotPaused notBlacklisted(from) notBlacklisted(to) {
        // Ensure neither 'from' nor 'to' are the zero address
        require(from != address(0), "L16");
        require(to != address(0), "L17");

        // Ensure function caller is either the owner or the 'from' address
        require(_msgSender() == owner() || _msgSender() == from, "L18");

        // Ensure a rewards redirection was active
        require(rewardsRedirectsFromTo[from] == to, "L19");

        // Distribute current rewards and reset investment periods of both accounts
        _beforeInvestmentChange(from, true);
        _beforeInvestmentChange(to, true);

        // Retrieve 'from' index in the redirection array of 'to'
        int256 fromIndex = -1;
        for (uint256 i = 0; i < rewardsRedirectsToFrom[to].length; i++) {
            if (rewardsRedirectsToFrom[to][i] == from) {
                fromIndex = int256(i);
                break;
            }
        }

        // fromIndex should never be -1 at this point
        assert(fromIndex >= 0);

        // Deactivate rewards redirection
        rewardsRedirectsFromTo[from] = address(0);
        rewardsRedirectsToFrom[to][uint256(fromIndex)] = rewardsRedirectsToFrom[to][
            rewardsRedirectsToFrom[to].length - 1
        ];
        rewardsRedirectsToFrom[to].pop();
    }

    /**
     * @notice Retrieves the total amount of tokens invested by the given account.
     * @dev Derived contracts must implement this function.
     * @param account The account to get the investment of.
     * @return The total amount of tokens invested by the given account.
     */
    function _investmentOf(address account) internal view virtual returns (uint256);

    /**
     * @notice Distributes a specified amount of rewards to a given account.
     * @dev Derived contracts may optionally implement this function.
     * @dev Implementations must return true to indicate a successful distribution, and
     * false otherwise. If it returns false, the rewards will be added to the account's
     * virtual balance, in order to be claimed later.
     * @param account The account to claim the rewards of.
     * @param amount The amount of rewards to claim.
     * @return Whether the rewards distribution was successfull.
     */
    function _distributeRewards(address account, uint256 amount) internal virtual returns (bool) {
        account; // Silence unused variables warning
        amount;
        return false;
    }

    /**
     * @notice Computes the rewards accrued over a specified period of time, based on a
     * given APR and amount of invested tokens.
     * @dev For further details, see "InvestUpgradeable > Rewards calculation" section of
     * the whitepaper.
     * @param beginTimestamp The moment the period commenced.
     * @param endTimestamp The moment the period concluded.
     * @param aprUD7x3 The APR during this period, in UD7x3 format.
     * @param investedAmount The amount of tokens deposited/invested during the period.
     * @return The amount of rewards generated during the period.
     */
    function _calculatePeriodRewards(
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD7x3,
        uint256 investedAmount
    ) internal view returns (uint256) {
        // Cache invested token's decimals number
        uint256 d = SUD.decimalsOf(address(invested()));

        // Compute the number of elapsed years
        uint256 elapsedTimeSUD = SUD.fromInt(endTimestamp - beginTimestamp, d);
        uint256 elapsedYearsSUD = (elapsedTimeSUD * SUD.fromInt(1, d)) / SUD.fromInt(365 days, d);

        // Compute the growth in invested amount (thanks to rewards)
        uint256 aprSUD = SUD.fromRate(aprUD7x3, d);
        uint256 growthSUD = (elapsedYearsSUD * aprSUD) / SUD.fromInt(1, d);

        // Compute and return the rewards
        uint256 investedAmountSUD = SUD.fromAmount(investedAmount, d);
        uint256 rewardsSUD = (investedAmountSUD * growthSUD) / SUD.fromInt(100, d);
        return SUD.toAmount(rewardsSUD, d);
    }

    /**
     * @notice Computes the sum of given account's invested amount, plus invested amount
     * of all accounts that recursively redirect rewards to this account.
     * @param account The account to calculate the deep investment of.
     * @return deepInvestedAmount The deep invested amount.
     */
    function _deepInvestmentOf(address account) internal view returns (uint256 deepInvestedAmount) {
        // Consider account's direct investment
        deepInvestedAmount += _investmentOf(account);

        // But also the deep investments of all accounts redirecting rewards to this account
        for (uint256 i = 0; i < rewardsRedirectsToFrom[account].length; i++) {
            deepInvestedAmount += _deepInvestmentOf(rewardsRedirectsToFrom[account][i]);
        }
    }

    /**
     * @notice Computes the amount of unclaimed/undistributed rewards of a given account.
     * @dev For further details, see "InvestUpgradeable > Rewards calculation" section of
     * the whitepaper.
     * @param account The account to calculate the unclaimed rewards of.
     * @param autocompound Whether to autocompound the rewards between APR checkpoints.
     * @return rewards The amount of unclaimed/undistributed rewards of the given account.
     */
    function _rewardsOf(
        address account,
        bool autocompound
    ) internal view returns (uint256 rewards) {
        // Retrieve account's investment details
        AccountDetails memory details = accountsDetails[account];

        // Retrieve account's deep invested amount
        uint256 investedAmount = _deepInvestmentOf(account);

        // Return 0 if the account has never invested or has no invested amount
        if (details.period.timestamp == 0 || investedAmount == 0) return 0;

        // Retrieve reference and data of APR checkpoint at which started investment period
        APRH.Reference memory currRef = details.period.ref;
        APRH.CheckpointData memory currCheckpoint = _aprHistory.getDataFromReference(currRef);

        // Retrieve reference of latest APR checkpoint
        APRH.Reference memory latestRef = _aprHistory.getLatestReference();

        // 1) Fill rewards with virtual balance (rewards not claimed/distributed yet)
        // See "InvestUpgradeable > Rewards calculation > 1)" section of the whitepaper
        rewards = details.virtualBalance;

        // If start checkpoint is not the latest one
        if (!APRH.eq(currRef, latestRef)) {
            // Retrieve reference and data of APR checkpoint that comes after start checkpoint
            APRH.Reference memory nextRef = APRH.incrementReference(currRef);
            APRH.CheckpointData memory nextCheckpoint = _aprHistory.getDataFromReference(nextRef);

            // 2) Calculate rewards from investment period start to next checkpoint
            // See "InvestUpgradeable > Rewards calculation > 2)" section of the whitepaper
            rewards += _calculatePeriodRewards(
                details.period.timestamp,
                nextCheckpoint.timestamp,
                currCheckpoint.aprUD7x3,
                investedAmount + (autocompound ? rewards : 0)
            );

            // 3) Calculate rewards for each crossed pair of checkpoints
            // See "InvestUpgradeable > Rewards calculation > 3)" section of the whitepaper
            while (true) {
                // Set next checkpoint as the current one
                currRef = nextRef;
                currCheckpoint = nextCheckpoint;

                // Break if current checkpoint is the latest one
                if (APRH.eq(currRef, latestRef)) break;

                // Else, retrieve the new next checkpoint
                nextRef = APRH.incrementReference(currRef);
                nextCheckpoint = _aprHistory.getDataFromReference(nextRef);

                // Calculate rewards between the current pair of checkpoints
                rewards += _calculatePeriodRewards(
                    currCheckpoint.timestamp,
                    nextCheckpoint.timestamp,
                    currCheckpoint.aprUD7x3,
                    investedAmount + (autocompound ? rewards : 0)
                );
            }

            // 4) Calculate rewards from the latest checkpoint to now
            // See "InvestUpgradeable > Rewards calculation > 4)" section of the whitepaper
            rewards += _calculatePeriodRewards(
                currCheckpoint.timestamp,
                uint40(block.timestamp),
                currCheckpoint.aprUD7x3,
                investedAmount + (autocompound ? rewards : 0)
            );
        } else {
            // 2.bis) Calculate rewards from investment period start to now
            // See "InvestUpgradeable > Rewards calculation > 2.bis)" section of the whitepaper
            rewards += _calculatePeriodRewards(
                details.period.timestamp,
                uint40(block.timestamp),
                currCheckpoint.aprUD7x3,
                investedAmount + (autocompound ? rewards : 0)
            );
        }
    }

    /**
     * @notice Recursively resets the investment period of the specified account and of
     * all accounts that directly or indirectly redirect rewards to this account.
     * @param account The account to deeply reset the investment period of.
     */
    function _deepResetInvestmentPeriodOf(address account) internal {
        // Reset account investment period timestamp and APR checkpoint to latest ones
        accountsDetails[account].period.timestamp = uint40(block.timestamp);
        accountsDetails[account].period.ref = _aprHistory.getLatestReference();

        // Also reset the ones of all accounts that recursively redirect rewards to this account
        for (uint256 i = 0; i < rewardsRedirectsToFrom[account].length; i++) {
            _deepResetInvestmentPeriodOf(rewardsRedirectsToFrom[account][i]);
        }
    }

    /**
     * @notice Hook to be invoked before the invested amount of an account changes. It 
     * ensures that rewards are distributed and that account's investment period is reset.
     * @param account The account whose invested amount is going to change.
     * @param autocompound Whether to autocompound the rewards between APR checkpoints.
     */
    function _beforeInvestmentChange(address account, bool autocompound) internal {
        // This hook is called inside LToken._beforeTokenTransfer() and as new tokens are
        // minted in LToken._distributeRewards(), this guards against infinite loop.
        if (_isClaiming) return;

        // LToken._beforeTokenTransfer() calls this hook for both involved addresses.
        // As first call will treat both addresses, the second call would be redundant.
        // Therefore, we skip accounts already processed in this block to save up some gas.
        if (accountsDetails[account].period.timestamp == uint40(block.timestamp)) return;

        // If account redirects its rewards
        address redirectRewardsTo = rewardsRedirectsFromTo[account];
        if (redirectRewardsTo != address(0)) {
            // Call hook on redirection target (this will indirectly reset the investment
            // of this source account) and return
            _beforeInvestmentChange(redirectRewardsTo, autocompound);
            return;
        }

        // Else, compute account's undistributed/unclaimed rewards
        uint256 rewards = _rewardsOf(account, autocompound);

        // If there are some rewards
        if (rewards > 0) {
            // Try to distribute rewards to account
            _isClaiming = true;
            bool distributed = _distributeRewards(account, rewards);
            _isClaiming = false;

            // If rewards have not been distributed, accumulate them in account's virtual balance
            if (!distributed) accountsDetails[account].virtualBalance = rewards;
        }

        // Finally, deeply reset investment period of the account
        _deepResetInvestmentPeriodOf(account);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
