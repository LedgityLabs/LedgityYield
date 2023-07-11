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
 * @notice
 * @dev For more details see "LToken" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
contract LToken is ERC20BaseUpgradeable, InvestUpgradeable, ERC20WrapperUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    enum Action {
        Deposit,
        Withdraw
    }

    enum Status {
        Queued,
        Cancelled,
        Success
    }

    /**
     * @dev Represents a withdrawal request.
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

    /// @dev Holds withdrawal fees not claimed yet by contract owner.
    uint256 public unclaimedFees;

    /// @dev Holds the amount of L-Tokens current in the withdrawal queue.
    uint256 public totalQueued;

    /**
     * @dev Holds the amount of underlying tokens that are usable by the contract (i.e,
     * not accidentally deposited or else)
     */
    uint256 public usableBalance;

    /// @dev Holds an ordered list of withdrawal requests.
    WithdrawalRequest[] withdrawalQueue;

    /**
     * @dev Called each time the total supply and so indirectly the TVL of the contract
     * changes.
     */
    event TVLUpdateEvent(uint256 newTVL);

    /**
     * @dev Emitted to indicate a state change related to deposit and withdrawals.
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

    event MintedRewardsEvent(address indexed account, uint256 balanceBefore, uint256 rewards);

    /**
     * @dev Restrict targeted function to the withdrawal server's wallet (a.k.a withdrawer).
     */
    modifier onlyWithdrawer() {
        require(_msgSender() == withdrawer, "Only server can execute this function");
        _;
    }

    /**
     * @dev Restrict targeted function to the fund wallet (detained by financial team).
     */
    modifier onlyFund() {
        require(_msgSender() == fund, "Only fund can execute this function");
        _;
    }

    function initialize(
        address _globalOwner,
        address _globalPauser,
        address _globalBlacklist,
        IERC20Upgradeable underlyingToken
    ) public initializer {
        // Retrieve underlying token metadata
        IERC20MetadataUpgradeable underlyingMetadata = IERC20MetadataUpgradeable(
            address(underlyingToken)
        );

        // Initialize ancestors contracts
        __ERC20Base_init(
            _globalOwner,
            _globalPauser,
            _globalBlacklist,
            string(abi.encodePacked("Ledgity ", underlyingMetadata.name())),
            string(abi.encodePacked("L", underlyingMetadata.symbol()))
        );
        __ERC20Wrapper_init(underlyingToken);
        __Invest_init_unchained(address(this));
    }

    /**
     * @dev A bunch states setters.
     */

    function setFeesRate(uint32 _feesRateUD3) public onlyOwner {
        feesRateUD3 = _feesRateUD3;
    }

    function setRetentionRate(uint32 _retentionRateUD3) public onlyOwner {
        require(_retentionRateUD3 <= 10000, "Retention rate must be <= 10%");
        retentionRateUD3 = _retentionRateUD3;
    }

    function setLTYStaking(address _contract) public onlyOwner {
        ltyStaking = LTYStaking(_contract);
    }

    function setWithdrawer(address payable _withdrawer) public onlyOwner {
        withdrawer = _withdrawer;
    }

    function setFund(address payable _fund) public onlyOwner {
        fund = _fund;
    }

    // /**
    //  * @dev Mirrors decimals of the underlying token using ERC20WrapperUpgradeable.decimals().
    //  * @inheritdoc ERC20WrapperUpgradeable
    //  */
    function decimals() public view override(ERC20Upgradeable, ERC20WrapperUpgradeable) returns (uint8) {
        return ERC20WrapperUpgradeable.decimals();
    }

    function unmintedRewardsOf(address account) public view returns (uint256) {
        return _rewardsOf(account, true);
    }

    /**
     * @dev Override of ERC20Upgradeable.balanceOf() that returns the total amount of
     * L-Tokens that belong to the account, including its unclaimed rewards.
     * See : TODO
     * @inheritdoc ERC20Upgradeable
     */
    function balanceOf(address account) public view override returns (uint256) {
        return realBalanceOf(account) + unmintedRewardsOf(account);
    }

    /**
     * @dev Returns the real balance of an account, excluding not yet minted rewards.
     * @param account The account to check balance for
     * @return The real balance of the account
     */
    function realBalanceOf(address account) public view returns (uint256) {
        return super.balanceOf(account);
    }

    /**
     * @dev Override of ERC20Upgradeable.totalSupply() that also consider L-Tokens
     * currently queued in the withdrawal queue and not yet minted owner's withdrawal
     * fees.
     * @inheritdoc ERC20Upgradeable
     */
    function totalSupply() public view override returns (uint256) {
        return super.totalSupply() + totalQueued + unclaimedFees;
    }

    /**
     * @dev Override of RecoverableUpgradeable.recoverERC20() that ensures:
     * - the caller is the owner
     * - the token recovered token is not the underlying token
     * @inheritdoc RecoverableUpgradeable
     */
    function recoverERC20(address tokenAddress, uint256 amount) public override onlyOwner {
        // Ensure the token is not the underlying token
        require(tokenAddress != address(underlying()), "Use recoverUnderlying() instead");
        super.recoverERC20(tokenAddress, amount);
    }

    /**
     * @dev Allows recovering underlying token accidentally sent to contract. To prevent
     * owner from draining funds from the contract, this function only allows recovering
     * "unusable" underlying tokens, i.e., tokens that have not been deposited through
     * legit ways. See "LToken > Underlying token recovery" section of whitepaper.
     */
    function recoverUnderlying() external onlyOwner {
        // Compute the usable balance of the contract by making the difference between
        // contract's underlying balance and the usable balance.
        uint256 unusableBalance = underlying().balanceOf(address(this)) - usableBalance;

        // If there are some unusable funds, recover them, else revert
        if (unusableBalance > 0) super.recoverERC20(address(underlying()), unusableBalance);
        else revert("There is nothing to recover");
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

        // Inform of the rewards minting
        emit MintedRewardsEvent(account, balanceBefore, amount);

        // Return true indicating to InvestUpgradeable that the rewards have been claimed
        return true;
    }

    /**
     * @dev Implementation of InvestUpgradeable._investmentOf(). Required by parent contract
     * to calculate rewards of an account. In this contract the investment of an account is
     * equal to its real balance (excluding not yet claimed rewards).
     * @inheritdoc InvestUpgradeable
     */
    function _investmentOf(address account) internal view override returns (uint256) {
        return realBalanceOf(account);
    }

    /**
     * @dev Override of ERC20.beforeTokenTransfer() hook, that ensures:
     *  - the contract is not paused,
     *  - the sender and reicipient are not blacklisted
     *  - investment periods are properly reset for each implied wallet that is not the
     *    zero wallet
     * @inheritdoc ERC20BaseUpgradeable
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    )
        internal
        override(ERC20Upgradeable, ERC20BaseUpgradeable)
        whenNotPaused
        notBlacklisted(from)
        notBlacklisted(to)
    {
        ERC20BaseUpgradeable._beforeTokenTransfer(from, to, amount);
        if (from != address(0)) _resetInvestmentPeriodOf(from, true);
        if (to != address(0)) _resetInvestmentPeriodOf(to, true);

        // In some L-Token are burned or minted, inform of TVL change
        if (from == address(0) || to == address(0)) emit TVLUpdateEvent(totalSupply());
    }

    /**
     * @dev Calculates the amount of underlying token that is expected to be retained on
     * the contract (from retention rate).
     * @return amount The expected amount of underlying tokens
     */
    function getExpectedRetained() public view returns (uint256 amount) {
        uint256 totalSupplyUDS3 = UDS3.scaleUp(totalSupply());
        uint256 retentionRateUDS3 = _toDecimals(retentionRateUD3);
        uint256 expectedRetainedUDS3 = (totalSupplyUDS3 * retentionRateUDS3) / _toUDS3(100);
        return UDS3.scaleDown(expectedRetainedUDS3);
    }

    /**
     * @dev Transfers every underlying token exceeding the retention rate to the fund wallet.
     * Note that there is a 10000 underlying tokens threshold to avoid transferring small
     * amounts and save a consequent amount of gas to contract's users.
     */
    function _transferExceedingToFund() internal {
        // Calculate the difference between expected and current amounts of usable underlying tokens
        int256 difference = int256(getExpectedRetained()) - int256(usableBalance);

        // If more than 10000 underlying tokens exceed the retention rate
        if (difference > 0 && uint256(difference) > _toDecimals(10000)) {
            // Transfer the exceeding amount to the fund wallet
            underlying().safeTransferFrom(address(this), fund, uint256(difference));
            usableBalance -= uint256(difference);
        }
    }

    /**
     * @dev
     */

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
        revert("Forbidden, use instantWithdraw() or addQueuedWithdrawalRequest() instead");
    }

    function depositFor(address account, uint256 amount) public pure override returns (bool) {
        account; // Silence unused variable compiler warning
        amount;
        revert("Forbidden, use deposit() instead");
    }

    /**
     * @dev Override of ERC20Wrapper.depositFor() support reset of investment period and
     * transfer of underlying tokens exceeding the retention
     * @param amount The amount of underlying tokens to deposit
     */
    function deposit(uint256 amount) public whenNotPaused notBlacklisted(_msgSender()) {
        // Receive deposited underlying tokens and mint L-Token to the account in a 1:1 ratio
        super.depositFor(_msgSender(), amount);
        usableBalance += amount;

        // Emit activity event to inform of the deposit
        emit ActivityEvent(-1, _msgSender(), Action.Deposit, amount, amount, Status.Success);

        // Transfer funds exceeding the retention rate to fund wallet
        _transferExceedingToFund();
    }

    /* @dev Implementation of ERC20Wrapper.withdrawTo() supporting reset of investment
     * period, withdrawal fees, and transfer of underlying tokens exceeding the retention
     * rate.
     * @param account The account to withdraw tokens for
     * @param amount The amount of tokens to withdraw
     */
    function _withdrawTo(address account, uint256 amount, bool fromFund) internal {}

    /**
     * @dev This function computes withdrawal fees and withdrawn amount for a given account
     * and amount requested.
     * @param account The account to withdraw tokens for
     * @param amount The amount of tokens to withdraw
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
     * to instaneously withdraw a given amount of underlying tokens. If conditions are
     * no met to do so,this function will revert.
     * IMPORTANT: In order to save gas to user, this function must be proposed in the
     * frontend only when it has been verfied off-chain that the request can be indeed processed
     * immediatelly.
     * @param amount The amount of tokens to withdraw
     */
    function instantWithdraw(uint256 amount) external whenNotPaused notBlacklisted(_msgSender()) {
        // Ensure the account has enough funds to withdraw
        require(amount <= balanceOf(_msgSender()), "You don't have enough fund to withdraw");

        /* 
        Continue if the contract holds enough underlying tokens to:
         - (cond1) cover this request + already queued requests
         - OR (cond2) to cover current request and the sender is eligible to 2nd staking tier
        Else revert.
        */
        uint256 _usableBalance = usableBalance;
        bool cond1 = totalQueued + amount <= _usableBalance;
        bool cond2 = amount <= _usableBalance && ltyStaking.tierOf(_msgSender()) >= 2;
        if (!(cond1 || cond2)) revert("Can't process request immediatelly, please queue your request");

        // Retrieve withdrawal fees and amount (excluding fees).
        (uint256 withdrawnAmount, uint256 fees) = getWithdrawanAmountAndFees(_msgSender(), amount);

        // Update the total unclaimed fees
        unclaimedFees += fees;

        // Process to withdraw (burns withdrawn L-Tokens amount and transfers underlying tokens in a 1:1 ratio)
        super.withdrawTo(_msgSender(), withdrawnAmount);
        usableBalance -= amount;

        // Emit activity event to inform of the instant withdrawal
        emit ActivityEvent(-1, _msgSender(), Action.Withdraw, amount, withdrawnAmount, Status.Success);

        // Transfer funds exceeding the retention rate to fund wallet
        _transferExceedingToFund();
    }

    /**
     * @dev This withdrawal function is to be called by the withdrawer server and is used
     * to batch process a given array of withdrawal requests IDs. Processes a given queued
     * withdrawal request.
     * See "LToken > Withdrawals" section of whitepaper for more details.
     * @param requestIds The indexes of withdrawal requests to process
     */
    function batchQueuedWithdraw(uint256[] calldata requestIds) external onlyWithdrawer whenNotPaused {
        //
        uint256 cumulatedFees = 0;
        uint256 cumulatedAmount = 0;

        // Iterate over the given request indexes
        for (uint256 i = 0; i < requestIds.length; i++) {
            uint256 requestId = requestIds[i];
            WithdrawalRequest memory request = withdrawalQueue[requestId];

            // Ensure the request emitter has not been blacklisted since request emission
            require(!isBlacklisted(request.account), "Request emitter has been blacklisted");

            // Reset investment period and retrieve the amount to withdraw (i.e., excluding fees)
            (uint256 withdrawnAmount, uint256 fees) = getWithdrawanAmountAndFees(
                request.account,
                request.amount
            );

            // Cumulate fees so they'll be written on-chain only once after the loop
            cumulatedFees += fees;

            // Transfer underlying tokens to the account in a 1:1 ratio
            // Note that we don't use `_withdrawTo()` here because L-Tokens were already burned
            // while adding request to queue, so we just need to transfer underlying tokens.
            SafeERC20Upgradeable.safeTransfer(underlying(), request.account, withdrawnAmount);

            // Emit activity event to inform of the withdrawal processing
            emit ActivityEvent(
                int256(requestId),
                request.account,
                Action.Withdraw,
                request.amount,
                withdrawnAmount,
                Status.Success
            );

            // Remove request
            delete withdrawalQueue[requestId];
            cumulatedAmount += request.amount;
        }

        //
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
     * This allows processing requests that are bigger than the retention rate without
     * ever exceeding the retention rate on the contract.
     * @param requestId The index of the big request to process
     */
    function bigQueuedWithdraw(uint256 requestId) external onlyFund whenNotPaused {
        // Retrieve request and ensure it exists and has not been processed yet or cancelled
        WithdrawalRequest memory request = withdrawalQueue[requestId];

        // Ensure the request emitter has not been blacklisted since request emission
        require(!isBlacklisted(request.account), "Request emitter has been blacklisted");

        // Ensure this is a big request
        require(request.amount > getExpectedRetained() / 2, "Not a big request");

        // Reset investment period and retrieve the amount to withdraw (i.e., excluding fees)
        (uint256 withdrawnAmount, uint256 fees) = getWithdrawanAmountAndFees(
            request.account,
            request.amount
        );

        // Update amount of unclaimed fees
        unclaimedFees += fees;

        // Remove qeueued request
        delete withdrawalQueue[requestId];
        totalQueued -= request.amount;

        // Transfer underlying tokens from fund reserve to request account
        transferFrom(fund, request.account, withdrawnAmount);

        // Emit activity event to inform of the instant withdrawal
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
     * @dev Put a withdrawal request in the queue. The sender must attach 0.005 ETH to
     * pre-pay the processing gas fees.
     * @param amount The amount of tokens to withdraw
     */
    function requestWithdrawal(
        uint256 amount
    ) public payable whenNotPaused notBlacklisted(_msgSender()) {
        // Ensure the account has enough funds to withdraw
        require(amount <= balanceOf(_msgSender()), "You don't have enough fund to withdraw");

        // Ensure the sender attached pre-paid processing gas fees
        require(msg.value == 0.004 * 10 ** 18, "You must attach 0.004 ETH to the request");

        // Forward pre-paid processing gas fees to the withdrawer
        (bool sent, ) = withdrawer.call{value: msg.value}("");
        require(sent, "Failed to forward Ethers to withdrawer");

        // Burn withdrawn L-Tokens amount
        _burn(_msgSender(), amount);

        // Add the withdrawal request to the queue and update the total amount in queue
        withdrawalQueue.push(WithdrawalRequest({account: _msgSender(), amount: uint96(amount)}));
        totalQueued += amount;

        // Emit activity event to inform of the withdrawal request
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
     * @dev Cancel a withdrawal request from the queue and sends back L-Tokens to the
     * request emitter.
     * @param requestId The index of the withdrawal request to remove
     */
    function cancelWithdrawalRequest(
        uint256 requestId
    ) public whenNotPaused notBlacklisted(_msgSender()) {
        // Retrieve request and ensure it belongs to sender
        WithdrawalRequest memory request = withdrawalQueue[requestId];
        require(_msgSender() == request.account, "This withdrawal request doesn't belong to you");

        // Send back L-Tokens to account
        _mint(_msgSender(), uint256(request.amount));

        // Remove requested amount from the total amount in queue
        totalQueued -= request.amount;

        // Delete the withdrawal request from queue
        delete withdrawalQueue[requestId];

        // Emit activity event to inform of the withdrawal cancel
        emit ActivityEvent(
            int256(requestId),
            _msgSender(),
            Action.Withdraw,
            request.amount,
            request.amount,
            Status.Cancelled
        );
    }

    function withdrawalRequestAmount(uint256 requestId) external view returns (uint256) {
        return withdrawalQueue[requestId].amount;
    }

    /**
     * @dev This function allows fund wallet to send underlying tokens to this contract.
     * It prevents from exceeding the current retention rate.
     * @param amount The amount of underlying tokens to send
     */
    function fundContract(uint256 amount) external onlyFund whenNotPaused {
        // Calculate new balance
        uint256 newBalance = usableBalance + amount;

        // Ensure the new balance doesn't exceed the retention rate
        require(newBalance <= getExpectedRetained(), "Retained underlying limit exceeded");

        // Transfer amount from fund wallet to contract
        underlying().safeTransferFrom(fund, address(this), amount);
        usableBalance += amount;
    }

    /**
     * @dev Claims withdrawal fees by minting them to contract owner.
     */
    function claimFees() external onlyOwner {
        _mint(_msgSender(), unclaimedFees);
        unclaimedFees = 0;
    }
}
