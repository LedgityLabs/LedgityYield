// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Contracts
import "./abstracts/base/ERC20BaseUpgradeable.sol";
import {ERC20WrapperUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20WrapperUpgradeable.sol";
import {InvestUpgradeable} from "./abstracts/InvestUpgradeable.sol";
import {LTYStaking} from "./LTYStaking.sol";

// Libraries & interfaces
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {SafeERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import {IERC20MetadataUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import {UDS3} from "./libs/UDS3.sol";

/**
 * @title LToken
 * @author Lila Rest (lila@ledgity.com)
 * @notice This contract powers every L-Token available on the Ledgity DeFi app
 * A L-Token is:
 * - a wrapper around a stablecoin (e.g., USDC, EUROC)
 * - a yield bearing token (i.e., it generates rewards as soon as a wallet holds it)
 * - backed by RWA (i.e., it is fully collateralized by real world assets)
 * Rewards are distributed in the L-Token itself, and rewarded L-Tokens are auto-compounded
 * and so automatically re-invested through time
 * @dev For further details, see "LToken" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
contract LToken is ERC20BaseUpgradeable, InvestUpgradeable, ERC20WrapperUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /// @dev Used to represent the action that triggered an ActivityEvent.
    enum Action {
        Deposit,
        Withdraw
    }

    /// @dev Used to represent the status of the action that triggered an ActivityEvent.
    enum Status {
        Queued,
        Cancelled,
        Success
    }

    /**
     * @dev Represents a queued withdrawal request.
     * @param account The account that emitted the request
     * @param amount The amount of underlying requested
     */
    struct WithdrawalRequest {
        address account; // 20 bytes
        uint96 amount; // 12 bytes
    }

    /// @dev Holds address of the LTYStaking contract
    LTYStaking public ltyStaking;

    /// @dev Holds address of withdrawer wallet (managed by withdrawal server)
    address payable public withdrawer;

    /// @dev Holds address of fund wallet (managed by financial team)
    address public fund;

    /// @dev Holds the withdrawal fee rate in UD3 format (3 digits fixed point, e.g., 0.350% = 350)
    uint32 public feesRateUD3;

    /// @dev Holds the retention rate in UD3 format. See "Retention rate" section of whitepaper.
    uint32 public retentionRateUD3;

    /// @dev Holds withdrawal that are unclaimed yet by contract owner.
    uint256 public unclaimedFees;

    /// @dev Holds the amount of L-Tokens currently in the withdrawal queue.
    uint256 public totalQueued;

    /**
     * @dev Holds the total amount of underlying tokens flagged as "usable" to the
     * contract. Are considered "usable" all the underlying tokens deposit through
     * deposit() or fund() functions
     * */
    uint256 public usableUnderlyings;

    /// @dev Holds an ordered list of withdrawal requests.
    WithdrawalRequest[] withdrawalQueue;

    /**
     * @dev Emitted to inform listeners about a change in the TVL of the contract (a.k.a totalSupply)
     * @param newTVL The new TVL of the contract
     */
    event TVLUpdateEvent(uint256 newTVL);

    /**
     * @dev Emitted to inform listerners about an activity related to deposit and withdrawals.
     * @param id (optional) Used to dedup withdrawal requests events while indexing. Else -1.
     * @param account The account concerned by the activity.
     * @param action The action that triggered the event.
     * @param amount The amount of underlying tokens involved in the activity.
     * @param newStatus The new status of the activity.
     */
    event ActivityEvent(
        int256 indexed id,
        address indexed account,
        Action indexed action,
        uint256 amount,
        uint256 amountAfterFees,
        Status newStatus
    );

    /**
     * @dev Emitted to inform listeners that some rewards have been minted.
     * @param account The account that received the rewards.
     * @param balanceBefore The balance of the account before the minting.
     * @param rewards The amount of rewards minted.
     */
    event MintedRewardsEvent(address indexed account, uint256 balanceBefore, uint256 rewards);

    /**
     * @dev Restricts wrapped function to the withdrawal server's wallet (a.k.a withdrawer).
     */
    modifier onlyWithdrawer() {
        require(_msgSender() == withdrawer, "LToken: only withdrawer can call this function");
        _;
    }

    /**
     * @dev Restricts wrapped function to the fund wallet (detained by financial team).
     */
    modifier onlyFund() {
        require(_msgSender() == fund, "LToken: only fund can call this function");
        _;
    }

    /**
     * @dev Replaces the constructor() function in context of an upgradeable contract.
     * See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param globalOwner_ The address of the GlobalOwner contract
     * @param globalPause_ The address of the GlobalPauser contract
     * @param globalBlacklist_ The address of the GlobalBlacklist contract
     * @param underlyingToken The address of the underlying stablecoin
     */
    function initialize(
        address globalOwner_,
        address globalPause_,
        address globalBlacklist_,
        IERC20Upgradeable underlyingToken
    ) public initializer {
        // Retrieve underlying token metadata
        IERC20MetadataUpgradeable underlyingMetadata = IERC20MetadataUpgradeable(
            address(underlyingToken)
        );

        // Initialize ancestors contracts
        __ERC20Base_init(
            globalOwner_,
            globalPause_,
            globalBlacklist_,
            string(abi.encodePacked("Ledgity ", underlyingMetadata.name())),
            string(abi.encodePacked("L", underlyingMetadata.symbol()))
        );
        __ERC20Wrapper_init(underlyingToken);
        __Invest_init_unchained(address(this));
    }

    /**
     * @dev Setter for the withdrawal fee rate.
     * @param _feesRateUD3 The new withdrawal fee rate in UD3 format
     */
    function setFeesRate(uint32 _feesRateUD3) public onlyOwner {
        feesRateUD3 = _feesRateUD3;
    }

    /**
     * @dev Setter for the underlying token retention rate.
     * Security note: As a security measure, the retention rate is ceiled to 10%, which
     * ensures that this contract will never holds more than 10% of the deposit assets
     * at the same time.
     * @param _retentionRateUD3 The new retention rate in UD3 format
     */
    function setRetentionRate(uint32 _retentionRateUD3) public onlyOwner {
        require(_retentionRateUD3 <= 10000, "Retention rate must be <= 10%");
        retentionRateUD3 = _retentionRateUD3;
    }

    /**
     * @dev Setter for the LTYStaking contract address.
     * @param _contract The address of the new LTYStaking contract
     */
    function setLTYStaking(address _contract) public onlyOwner {
        ltyStaking = LTYStaking(_contract);
    }

    /**
     * @dev Setter for the withdrawer wallet address.
     * @param _withdrawer The address of the new withdrawer wallet
     */
    function setWithdrawer(address payable _withdrawer) public onlyOwner {
        withdrawer = _withdrawer;
    }

    /**
     * @dev Setter for the fund wallet address.
     * @param _fund The address of the new fund wallet
     */
    function setFund(address payable _fund) public onlyOwner {
        fund = _fund;
    }

    /**
     * @dev Required override of decimals() which is implemented by both ERC20Upgradeable
     * and ERC20WrapperUpgradeable parent contracts.
     * The ERC20WrapperUpgradeable version is preferred because it mirrors the decimals
     * amount of the underlying wrapped token.
     * @inheritdoc ERC20WrapperUpgradeable
     */
    function decimals() public view override(ERC20Upgradeable, ERC20WrapperUpgradeable) returns (uint8) {
        return ERC20WrapperUpgradeable.decimals();
    }

    /**
     * @dev Public implementation of InvestmentUpgradeable._rewardsOf() allowing
     * DApp frontend to easily compute the unclaimed rewards of a given account.
     * (used in growth/revenue charts of DApp's dashboard).
     * @param account The account to check the rewards of
     * @return The amount of account's unclaimed rewards
     */
    function unmintedRewardsOf(address account) public view returns (uint256) {
        return _rewardsOf(account, true);
    }

    /**
     * @dev Returns the "real" balance of an account, i.e., excluding its not yet
     * minted rewards.
     * @param account The account to check balance for
     * @return The real balance of the account
     */
    function realBalanceOf(address account) public view returns (uint256) {
        return super.balanceOf(account);
    }

    /**
     * @dev Override of ERC20Upgradeable.balanceOf() that returns the total amount of
     * L-Tokens that belong to the account, including its unclaimed rewards.
     * @inheritdoc ERC20Upgradeable
     */
    function balanceOf(address account) public view override returns (uint256) {
        return realBalanceOf(account) + unmintedRewardsOf(account);
    }

    /**
     * @dev Override of ERC20Upgradeable.totalSupply() that also consider L-Tokens
     * currently queued in the withdrawal queue as well as not yet minted owner's
     * unclaimed withdrawal fees.
     * @inheritdoc ERC20Upgradeable
     */
    function totalSupply() public view override returns (uint256) {
        return super.totalSupply() + totalQueued + unclaimedFees;
    }

    /**
     * @dev Override of RecoverableUpgradeable.recoverERC20() that prevents recovered
     * token from being the underlying token.
     * @inheritdoc RecoverableUpgradeable
     */
    function recoverERC20(address tokenAddress, uint256 amount) public override onlyOwner {
        // Ensure the token is not the underlying token
        require(tokenAddress != address(underlying()), "LToken: use recoverUnderlying() instead");
        super.recoverERC20(tokenAddress, amount);
    }

    /**
     * @dev Allows recovering underlying token accidentally sent to contract. To prevent
     * owner from draining funds from the contract, this function only allows recovering
     * "unusable" underlying tokens, i.e., tokens that have not been deposited through
     * legit ways. See "LToken > Underlying token recovery" section of whitepaper.
     */
    function recoverUnderlying() external onlyOwner {
        // Compute the amount of underlying tokens that can be recovered by taking the difference
        // between the contract's underlying balance and the total amount deposit by users
        uint256 recoverableAmount = underlying().balanceOf(address(this)) - usableUnderlyings;

        // Revert if there are no recoverable $LTY
        require(recoverableAmount > 0, "LToken: nothing to recover");

        // Else transfer the recoverable underlying to the owner
        super.recoverERC20(address(underlying()), recoverableAmount);
    }

    /**
     * @dev Implementation of InvestUpgradeable._investmentOf() require by InvestUpgradeable
     * contract to calculate rewards of a given account. In this contract the investment of
     * an account is equal to its real balance (excluding not yet claimed rewards).
     * @inheritdoc InvestUpgradeable
     */
    function _investmentOf(address account) internal view override returns (uint256) {
        return realBalanceOf(account);
    }

    /**
     * @dev Implementation of InvestUpgradeable._claimRewards(). If implemented the parent
     * contract will use it to claim rewards before each period reset. See the function
     * documentation in the parent contract for more details.
     * @inheritdoc InvestUpgradeable
     */
    function _claimRewardsOf(address account, uint256 amount) internal override returns (bool) {
        // Retrieve balance before minting rewards
        uint256 balanceBefore = realBalanceOf(account);

        // Mint rewarded L-Tokens to account
        _mint(account, amount);

        // Inform listeners of the rewards minting
        emit MintedRewardsEvent(account, balanceBefore, amount);

        // Return true indicating to InvestUpgradeable that the rewards have been claimed
        return true;
    }

    /**
     * @dev Override of ERC20._beforeTokenTransfer() hook resetting investment periods
     * of each involved account that is not the zero address.
     * Note that we don't check for not paused contract and not blacklisted accounts
     * as this is already done in ERC20BaseUpgradeable parent contract.
     * @inheritdoc ERC20BaseUpgradeable
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Upgradeable, ERC20BaseUpgradeable) {
        ERC20BaseUpgradeable._beforeTokenTransfer(from, to, amount);

        // Reset investment period of involved accounts
        if (from != address(0)) _resetInvestmentPeriodOf(from, true);
        if (to != address(0)) _resetInvestmentPeriodOf(to, true);

        // In some L-Token are burned or minted, inform listeners of a TVL change
        if (from == address(0) || to == address(0)) emit TVLUpdateEvent(totalSupply());
    }

    /**
     * @dev Calculates the amount of underlying token that is expected to be retained on
     * the contract (from retention rate).
     * @return amount The expected amount of retained underlying tokens
     */
    function getExpectedRetained() public view returns (uint256 amount) {
        uint256 totalSupplyUDS3 = UDS3.scaleUp(totalSupply());
        uint256 retentionRateUDS3 = _toDecimals(retentionRateUD3);
        uint256 expectedRetainedUDS3 = (totalSupplyUDS3 * retentionRateUDS3) / _toUDS3(100);
        return UDS3.scaleDown(expectedRetainedUDS3);
    }

    /**
     * @dev Transfers every underlying token exceeding the retention rate to the fund wallet.
     * Note that there is a 10000 tokens threshold to avoid transferring small amounts of
     * underlying frequently when the retention rate is close to 100%.
     * This threshold helps saving gas by lowering the number of transfers (and thus the number
     * of chain writes).
     */
    function _transferExceedingToFund() internal {
        // Calculate the exceeding amount of underlying tokens
        int256 exceedingAmount = int256(getExpectedRetained()) - int256(usableUnderlyings);

        // Return if it the exceeding amount isn't greater than 10,000 underlying tokens
        if (exceedingAmount < int256(_toDecimals(10000))) return;

        // Else, transfer the exceeding amount to the fund wallet
        underlying().safeTransferFrom(address(this), fund, uint256(exceedingAmount));

        // Update usable underlyings balance accordingly
        usableUnderlyings -= uint256(exceedingAmount);
    }

    /**
     * @dev Overrides of ERC20WrapperUpgradeable.withdrawTo() and depositFor() functions
     * that prevents any usage of them (forbidden).
     * Instead, use _withdrawTo() and super.depositFor() internally or withdraw() and
     * deposit() externally.
     * @inheritdoc ERC20WrapperUpgradeable
     */
    function withdrawTo(address account, uint256 amount) public pure override returns (bool) {
        account; // Silence unused variable compiler warning
        amount;
        revert("LToken: use instantWithdraw() or addQueuedWithdrawalRequest() instead");
    }

    function depositFor(address account, uint256 amount) public pure override returns (bool) {
        account; // Silence unused variable compiler warning
        amount;
        revert("LToken: use deposit() instead");
    }

    /**
     * @dev Override of ERC20Wrapper.depositFor() that support reset of investment period
     * and transfer of underlying tokens exceeding the retention to the fund wallet.
     * @param amount The amount of underlying tokens to deposit
     */
    function deposit(uint256 amount) public whenNotPaused notBlacklisted(_msgSender()) {
        // Receive deposited underlying tokens and mint L-Tokens to the account in a 1:1 ratio
        super.depositFor(_msgSender(), amount);

        // Update usable underlyings balance accordingly
        usableUnderlyings += amount;

        // Inform listeners of the deposit activity event
        emit ActivityEvent(-1, _msgSender(), Action.Deposit, amount, amount, Status.Success);

        // Transfer funds exceeding the retention rate to fund wallet
        _transferExceedingToFund();
    }

    /**
     * @dev This function computes withdrawal fees and withdrawn amount for a given account
     * and request amount.
     * @param account The account to withdraw tokens for
     * @param amount The request amount of tokens to withdraw
     *
     */
    function getWithdrawanAmountAndFees(
        address account,
        uint256 amount
    ) public view returns (uint256 withdrawnAmount, uint256 fees) {
        // If the account is eligible to staking tier 2, no fees are applied
        if (ltyStaking.tierOf(account) >= 2) return (amount, 0);

        // Else calculate withdrawal fees as well as final withdrawn amount
        uint256 amountUDS3 = UDS3.scaleUp(amount);
        uint256 feesRateUDS3 = _toDecimals(feesRateUD3);
        uint256 feesUDS3 = (amountUDS3 * feesRateUDS3) / _toUDS3(100);
        fees = UDS3.scaleDown(feesUDS3);
        withdrawnAmount = amount - fees;
    }

    /**
     * @dev This withdrawal function is to be called by DApp users directly and will try
     * to instaneously withdraw a given amount of underlying tokens. If the contract
     * currently cannot cover the request, this function will revert.
     *
     * Note: In order to save gas to users, the frontends built on this contract should
     * propose calling this function only when it has been verified that it will not revert.
     * @param amount The amount of tokens to withdraw
     */
    function instantWithdraw(uint256 amount) external whenNotPaused notBlacklisted(_msgSender()) {
        // Ensure the account holds has enough funds to withdraw
        require(amount <= balanceOf(_msgSender()), "LToken: insufficient balance");

        // Compute whether the contract holds enough funds to cover the request + already queued requests
        bool cond1 = totalQueued + amount <= usableUnderlyings;

        // Compute whether the sender is eligible to 2nd staking tier and contract can cover the request
        bool cond2 = amount <= usableUnderlyings && ltyStaking.tierOf(_msgSender()) >= 2;

        // If none of the conditions are met, revert
        if (!(cond1 || cond2)) revert("LToken: please queue your request");

        // Else, retrieve withdrawal fees and withdrawn amount (i.e., amount excluding fees).
        (uint256 withdrawnAmount, uint256 fees) = getWithdrawanAmountAndFees(_msgSender(), amount);

        // Update the total amount of unclaimed fees
        unclaimedFees += fees;

        // Process to withdraw (burns withdrawn L-Tokens amount and transfers underlying tokens in a 1:1 ratio)
        super.withdrawTo(_msgSender(), withdrawnAmount);

        // Update usable underlyings balance accordingly
        usableUnderlyings -= amount;

        // Inform listeners of this instant withdrawal activity event
        emit ActivityEvent(-1, _msgSender(), Action.Withdraw, amount, withdrawnAmount, Status.Success);

        // Transfer funds exceeding the retention rate to fund wallet
        _transferExceedingToFund();
    }

    /**
     * @dev This withdrawal function is to be called by the withdrawer server and is used
     * to batch process a given array of withdrawal requests IDs.
     * See "LToken > Withdrawals" section of whitepaper for more details.
     * @param requestIds The indexes of withdrawal requests to process
     */
    function batchQueuedWithdraw(uint256[] calldata requestIds) external onlyWithdrawer whenNotPaused {
        // Accumulators variables, to be written on-chain after the loop
        uint256 cumulatedFees = 0;
        uint256 cumulatedAmount = 0;

        // Iterate over the given request indexes
        for (uint256 i = 0; i < requestIds.length; i++) {
            // Retrieve request ID and data
            uint256 requestId = requestIds[i];
            WithdrawalRequest memory request = withdrawalQueue[requestId];

            // Ensure the request emitter has not been blacklisted since request emission
            require(!isBlacklisted(request.account), "LToken: forbidden");

            // Retrieve withdrawal fees and withdrawn amount (i.e., amount excluding fees).
            (uint256 withdrawnAmount, uint256 fees) = getWithdrawanAmountAndFees(
                request.account,
                request.amount
            );

            // Accumulate fees and amount so they'll be written on-chain after the loop
            cumulatedFees += fees;
            cumulatedAmount += request.amount;

            // Transfer underlying tokens to the account in a 1:1 ratio
            // Note that we don't use `_withdrawTo()` here because L-Tokens were already burned
            // while adding request to queue, so we just need to transfer underlying tokens to account.
            SafeERC20Upgradeable.safeTransfer(underlying(), request.account, withdrawnAmount);

            // Inform listeners of this queued withdrawal processing activity event
            emit ActivityEvent(
                int256(requestId),
                request.account,
                Action.Withdraw,
                request.amount,
                withdrawnAmount,
                Status.Success
            );

            // Remove request from queue
            delete withdrawalQueue[requestId];
        }

        // Write accumulated fees and withdrawn amount on-chain
        unclaimedFees += cumulatedFees;
        totalQueued -= cumulatedAmount;

        // Transfer funds exceeding the retention rate to fund wallet
        _transferExceedingToFund();
    }

    /**
     * @dev This withdrawal function is to be called by the fund wallet (financial team)
     * to manually process a given big queued withdrawal request (that exceeds half of
     * the retention rate).
     * In contrast to non-big requests processing, this function will fill the request
     * from fund wallet balance directly.
     * This allows processing requests that are bigger than the retention rate while
     * never exceeding the retention rate on the contract.
     * @param requestId The big request's index to process
     */
    function bigQueuedWithdraw(uint256 requestId) external onlyFund whenNotPaused {
        // Retrieve request and ensure it exists and has not been processed yet or cancelled
        WithdrawalRequest memory request = withdrawalQueue[requestId];

        // Ensure the request emitter has not been blacklisted since request emission
        require(!isBlacklisted(request.account), "LToken: forbidden");

        // Ensure this is a big request
        require(request.amount > getExpectedRetained() / 2, "LToken: not a big request");

        // Retrieve withdrawal fees and withdrawn amount (i.e., amount excluding fees).
        (uint256 withdrawnAmount, uint256 fees) = getWithdrawanAmountAndFees(
            request.account,
            request.amount
        );

        // Update amount of unclaimed fees and total queued amount
        unclaimedFees += fees;
        totalQueued -= request.amount;

        // Remove request from queue
        delete withdrawalQueue[requestId];

        // Transfer underlying tokens from fund reserve to request account
        transferFrom(fund, request.account, withdrawnAmount);

        // Inform listeners of this queued withdrawal processing activity event
        emit ActivityEvent(
            int256(requestId),
            request.account,
            Action.Withdraw,
            request.amount,
            withdrawnAmount,
            Status.Success
        );

        // Transfer funds exceeding the retention rate to fund wallet
        _transferExceedingToFund();
    }

    /**
     * @dev This withdrawal function, put the given amount request in queue to be processed
     * as soon as the contract would have enough funds to cover it.
     * The sender must attach 0.004 ETH to pre-pay the future processing gas fees paid by
     * the withdrawer wallet.
     * @param amount The amount of tokens to withdraw
     */
    function requestWithdrawal(
        uint256 amount
    ) public payable whenNotPaused notBlacklisted(_msgSender()) {
        // Ensure the account has enough funds to withdraw
        require(amount <= balanceOf(_msgSender()), "LToken: insufficient balance");

        // Ensure the sender attached pre-paid processing gas fees
        require(msg.value == 0.004 * 10 ** 18, "LToken: must attach 0.004 ETH");

        // Forward pre-paid processing gas fees to the withdrawer
        (bool sent, ) = withdrawer.call{value: msg.value}("");
        require(sent, "LToken: failed fees forward");

        // Burn withdrawn L-Tokens amount
        _burn(_msgSender(), amount);

        // Append request to queue and update total amount queued
        withdrawalQueue.push(WithdrawalRequest({account: _msgSender(), amount: uint96(amount)}));
        totalQueued += amount;

        // Inform listeners of this new queued withdrawal activity event
        emit ActivityEvent(
            int256(withdrawalQueue.length - 1),
            _msgSender(),
            Action.Withdraw,
            amount,
            amount,
            Status.Queued
        );
    }

    /**
     * @dev Allows to cancel a currently queued withdrawal request. The request emitter
     * will receive back its L-Tokens and no fees will be charged.
     * @param requestId The index of the withdrawal request to remove
     */
    function cancelWithdrawalRequest(
        uint256 requestId
    ) public whenNotPaused notBlacklisted(_msgSender()) {
        // Retrieve request and ensure it belongs to sender
        WithdrawalRequest memory request = withdrawalQueue[requestId];
        require(_msgSender() == request.account, "LToken: request doesn't belong to you");

        // Mint back L-Tokens to account and update total amount queued
        _mint(_msgSender(), uint256(request.amount));
        totalQueued -= request.amount;

        // Delete the withdrawal request from queue
        delete withdrawalQueue[requestId];

        // Inform listeners of this cancelled withdrawal request activity event
        emit ActivityEvent(
            int256(requestId),
            _msgSender(),
            Action.Withdraw,
            request.amount,
            request.amount,
            Status.Cancelled
        );
    }

    /**
     * @dev This function allows fund wallet to send underlying tokens to this contract.
     * Security note: To ensure this contract will never hold more than the retention
     * rate, this function will revert if the new contract balance exceeds it.
     * @param amount The amount of underlying tokens to send
     */
    function fundContract(uint256 amount) external onlyFund whenNotPaused {
        // Calculate new balance
        uint256 newBalance = usableUnderlyings + amount;

        // Ensure the new balance doesn't exceed the retention rate
        require(newBalance <= getExpectedRetained(), "LToken: retention rate exceeded");

        // Transfer amount from fund wallet to contract
        underlying().safeTransferFrom(fund, address(this), amount);
        usableUnderlyings += amount;
    }

    /**
     * @dev Used by contract owner to claim fees generated from withdrawal.
     */
    function claimFees() external onlyOwner {
        _mint(_msgSender(), unclaimedFees);
        unclaimedFees = 0;
    }
}
