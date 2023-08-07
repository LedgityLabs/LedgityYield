// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Contracts
import {ERC20WrapperUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20WrapperUpgradeable.sol";
import "./abstracts/base/ERC20BaseUpgradeable.sol";
import {InvestUpgradeable} from "./abstracts/InvestUpgradeable.sol";
import {LDYStaking} from "./DummyLDYStaking.sol";

// Libraries
import {SafeERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import {SUD} from "./libs/SUD.sol";

// Interfaces
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {IERC20MetadataUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import {ITransfersListener} from "./interfaces/ITransfersListener.sol";

/**
 * @title LToken
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com
 *
 * @notice Main contract of the Ledgity Yield protocol. It powers every L-Token (i.e,
 * investment pools backed by RWA). An L-Token is an ERC20 wrapper around a stablecoin.
 * As soon as a wallet holds some L-Tokens, it starts receiving rewards in
 * the form of additional L-Tokens, which are auto-compounded over time.
 *
 * @dev Intuition:
 *
 *
 * @dev Definitions:
 * - (withdrawal) request: A request to withdraw some underlying tokens from some L-Tokens.
 * - (withdrawal) queue: Array containing all withdrawal requests.
 * - Request ID: The index of a withdrawal request in the queue.
 *
 * Note that words between parentheses are sometimes omitted for brevity.
 *
 * @dev Security: This contract can safely receive funds immediately after initialization.
 * It is however required to set a non-zero APR for users to start receiving rewards.
 *
 * @dev For further details, see "LToken" section of whitepaper.
 * @custom:oz-upgrades-unsafe-allow external-library-linking
 * @custom:security-contact security@ledgity.com
 */
contract LToken is ERC20BaseUpgradeable, InvestUpgradeable, ERC20WrapperUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /// @dev Represents type of actions triggering ActivityEvent events.
    enum Action {
        Deposit,
        Withdraw
    }

    /// @dev Represents different status of actions triggering ActivityEvent events.
    enum Status {
        Queued,
        Cancelled,
        Success
    }

    /**
     * @notice Represents a withdrawal request in the queue.
     * @dev A request fits in a single storage slot (32 bytes).
     * @param account The account that initiated the request.
     * @param amount The amount of underlying tokens requested.
     */
    struct WithdrawalRequest {
        address account; // 20 bytes
        uint96 amount; // 12 bytes
    }

    /// @notice Upper limit of retention rate.
    uint32 private constant MAX_RETENTION_RATE_UD7x3 = 10 * 10 ** 3; // 10%

    /// @notice Used in activity events to represent the absence of request ID.
    int256 private constant NO_ID = -1;

    /// @notice Holds a reference to the LDYStaking contract.
    LDYStaking public ldyStaking;

    /// @notice Holds address of withdrawer wallet (managed by withdrawal server).
    address payable public withdrawer;

    /// @notice Holds address of fund wallet (managed by Ledgity financial team).
    address public fund;

    /// @notice Holds the withdrawal fees rate in UD7x3 format (e.g., 350 = 0.350%).
    uint32 public feesRateUD7x3;

    /// @notice Holds the retention rate in UD7x3 format.
    uint32 public retentionRateUD7x3;

    /// @notice Holds the amount of withdrawal fees not yet claimed by contract's owner.
    uint256 public unclaimedFees;

    /// @notice Holds the amount of L-Tokens currently in the withdrawal queue.
    uint256 public totalQueued;

    /**
     * @notice Holds the amount of underlying tokens considered as usable by the contract.
     * @dev Are usable, only underlying tokens deposit through deposit() or fund() functions.
     */
    uint256 public usableUnderlyings;

    /// @notice Holds an ordered list of active withdrawal requests.
    WithdrawalRequest[] public withdrawalQueue;

    /// @notice Holds the index of the next withdrawal request to process in the queue.
    uint256 public withdrawalQueueCursor;

    /**
     * @notice Holds a list of all currently frozen withdrawal requests.
     * @dev If a request emitter as been blacklisted, its request is moved here to prevent
     * it from blocking the queue.
     */
    WithdrawalRequest[] public frozenRequests;

    /**
     * @notice Holds a list of contracts' references that are listening to L-Tokens transfers.
     * @dev onLTokenTransfer() functions of those contracts will be called on each transfer.
     */
    ITransfersListener[] public transfersListeners;

    /**
     * @notice Emitted to inform listeners about a change in the contract's TVL.
     * @dev TVL = realTotalSupply()
     * @param newTVL The new TVL of the contract.
     */
    event TVLChangeEvent(uint256 newTVL);

    /**
     * @notice Emitted to inform listerners about an activity related to deposits and withdrawals.
     * @param id ID of the involved withdrawal request or NO_ID (-1) if not applicable.
     * @param account The account involved in the activity.
     * @param action The type of activity.
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
     * @notice Emitted to inform listeners that some rewards have been minted.
     * @param account The account that received the rewards.
     * @param balanceBefore The balance of the account before the minting.
     * @param rewards The amount of minted rewards.
     */
    event MintedRewardsEvent(address indexed account, uint256 balanceBefore, uint256 rewards);

    /// @notice Reverts if the function caller is not the withdrawer wallet.
    modifier onlyWithdrawer() {
        require(_msgSender() == withdrawer, "L39");
        _;
    }

    /// @notice Reverts if the function caller is not the fund wallet.
    modifier onlyFund() {
        require(_msgSender() == fund, "L40");
        _;
    }

    /**
     * @notice Initializer function of the contract. It replaces the constructor()
     * function in the context of upgradeable contracts.
     * @dev See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param globalOwner_ The address of the GlobalOwner contract.
     * @param globalPause_ The address of the GlobalPause contract.
     * @param globalBlacklist_ The address of the GlobalBlacklist contract.
     * @param underlyingToken The address of the underlying stablecoin ERC20 token.
     */
    function initialize(
        address globalOwner_,
        address globalPause_,
        address globalBlacklist_,
        address ldyStaking_,
        address underlyingToken
    ) public initializer {
        // Retrieve underlying token metadata
        IERC20MetadataUpgradeable underlyingMetadata = IERC20MetadataUpgradeable(underlyingToken);

        // Initialize ancestors contracts
        __ERC20Base_init(
            globalOwner_,
            globalPause_,
            globalBlacklist_,
            string(abi.encodePacked("Ledgity ", underlyingMetadata.name())),
            string(abi.encodePacked("L", underlyingMetadata.symbol()))
        );
        __ERC20Wrapper_init(IERC20Upgradeable(underlyingToken));
        __Invest_init_unchained(address(this));

        // Set LDYStaking contract
        setLDYStaking(ldyStaking_);

        // Set initial withdrawal fees rate to 0.3%
        setFeesRate(300);

        // Set initial retention rate to 5%
        setRetentionRate(5000);

        // Set initial APR to 0%
        setAPR(0);

        // Default withdrawer and fund wallet to contract owner address. This prevents
        // any loss of funds if a deposit/withdrawal is made before those are manually set.
        setWithdrawer(payable(globalOwner_));
        setFund(payable(globalOwner_));
    }

    /**
     * @notice Required override of decimals() which is implemented by both
     * ERC20Upgradeable and ERC20WrapperUpgradeable parent contracts.
     * @dev The ERC20WrapperUpgradeable version is preferred because it mirrors the
     * decimals amount of the underlying stablecoin token.
     * @inheritdoc ERC20WrapperUpgradeable
     */
    function decimals()
        public
        view
        override(ERC20Upgradeable, ERC20WrapperUpgradeable)
        returns (uint8)
    {
        return ERC20WrapperUpgradeable.decimals();
    }

    /**
     * @notice Required override of paused() which is implemented by both
     * GlobalPausableUpgradeable and ERC20BaseUpgradeable parent contracts.
     * @dev Both version are the same as ERC20BaseUpgradeable.paused() mirrors
     * GlobalPausableUpgradeable.paused(), so a random one is chosen.
     * @inheritdoc GlobalPausableUpgradeable
     */
    function paused()
        public
        view
        virtual
        override(GlobalPausableUpgradeable, ERC20BaseUpgradeable)
        returns (bool)
    {
        return GlobalPausableUpgradeable.paused();
    }

    /**
     * @notice Updates the current withdrawal fee rate.
     * @param feesRateUD7x3_ The new withdrawal fee rate in UD7x3 format.
     */
    function setFeesRate(uint32 feesRateUD7x3_) public onlyOwner {
        feesRateUD7x3 = feesRateUD7x3_;
    }

    /**
     * @notice Updates the current underlying token retention rate.
     * @dev The retention rate is capped at 10%, which ensures that no more than 10% of
     * deposited assets will ever be exposed in this contract (reduces attack surface).
     * @param retentionRateUD7x3_ The new retention rate in UD7x3 format.
     */
    function setRetentionRate(uint32 retentionRateUD7x3_) public onlyOwner {
        require(retentionRateUD7x3_ <= MAX_RETENTION_RATE_UD7x3, "L41");
        retentionRateUD7x3 = retentionRateUD7x3_;
    }

    /**
     * @notice Updates the address of LDYStaking contract.
     * @param ldyStakingAddress The address of the new LDYStaking contract.
     */
    function setLDYStaking(address ldyStakingAddress) public onlyOwner {
        ldyStaking = LDYStaking(ldyStakingAddress);
    }

    /**
     * @notice Updates the address of the withdrawer wallet.
     * @param withdrawer_ The address of the new withdrawer wallet.
     */
    function setWithdrawer(address payable withdrawer_) public onlyOwner {
        // Ensure address is not the zero address (pre-processing fees would be lost else)
        require(withdrawer_ != address(0), "L63");

        // Set new withdrawer wallet's address
        withdrawer = withdrawer_;
    }

    /**
     * @notice Updates the address of the fund wallet.
     * @param fund_ The address of the new fund wallet.
     */
    function setFund(address payable fund_) public onlyOwner {
        // Ensure address is not the zero address (deposited tokens would be lost else)
        require(fund_ != address(0), "L64");

        // Set new fund wallet's address
        fund = fund_;
    }

    /**
     * @notice Adds a new contract to the L-Token transfers list.
     * @dev Each time a transfer occurs, the onLTokenTransfer() function of the
     * specified contract will be called.
     * @dev IMPORTANT SECURITY NOTE: This method is not intended to be used with
     * contracts that are not owned by the Ledgity team.
     * @param listenerContract The address of the new transfers listener contract.
     */
    function listenToTransfers(address listenerContract) public onlyOwner {
        transfersListeners.push(ITransfersListener(listenerContract));
    }

    /**
     * @notice Removes a contract from the L-Token transfers list.
     * @dev The onLTokenTransfer() function of the specified contract will not be called
     * anymore each time a L-Token transfer occurs.
     * @param listenerContract The address of the listener contract.
     */
    function unlistenToTransfers(address listenerContract) public onlyOwner {
        // Find index of listener contract in transferListeners array
        int256 index = -1;
        uint256 transfersListenersLength = transfersListeners.length;
        for (uint256 i = 0; i < transfersListenersLength; i++) {
            if (address(transfersListeners[i]) == listenerContract) {
                index = int256(i);
                break;
            }
        }

        // Revert if given contract wasn't listening to transfers
        require(index > -1, "L42");

        // Else, remove transfers listener contract from listeners array
        transfersListeners[uint256(index)] = transfersListeners[transfersListenersLength - 1];
        transfersListeners.pop();
    }

    /**
     * @notice Retrieves the amount of given account's not yet minted rewards.
     * @dev This is a public implementation of InvestUpgradeable_rewardsOf(). In the
     * context of LToken, this function returns the amount of rewards that have not been
     * distributed/minted yet to the specified account.
     * @dev This is particularly useful for off-chain services to display charts and
     * statistics, as seen in the Ledgity Yield's frontend.
     * @param account The account to check the unminted rewards of.
     * @return The amount of account's unminted rewards.
     */
    function unmintedRewardsOf(address account) public view returns (uint256) {
        return _rewardsOf(account, true);
    }

    /**
     * @notice Retrieves the "real" balance of an account, i.e., excluding its not yet
     * minted/distributed rewards.
     * @param account The account to check the real balance of.
     * @return The real balance of the account.
     */
    function realBalanceOf(address account) public view returns (uint256) {
        return super.balanceOf(account);
    }

    /**
     * @notice Retrieves the total balance of L-Tokens that belong to the account.
     * @dev This is an oOverride of ERC20Upgradeable.balanceOf() that rewards that have
     * not been yet minted to the specified account.
     * @param account The account to check the total balance of.
     * @return The total balance of the account.
     */
    function balanceOf(address account) public view override returns (uint256) {
        return realBalanceOf(account) + unmintedRewardsOf(account);
    }

    /**
     * @notice Returns the "real" amount of existing L-Tokens, i.e., excluding not yet
     * minted withdrawal fees and L-Tokens currently in the withdrawal queue.
     * @return The real total supply of L-Tokens.
     */
    function realTotalSupply() public view returns (uint256) {
        return super.totalSupply();
    }

    /**
     * @notice Retrives the total supply of L-Tokens, including not yet minted withdrawal
     * fees and L-Tokens currently in the withdrawal queue.
     * @return The total supply of L-Tokens.
     */
    function totalSupply() public view override returns (uint256) {
        return realTotalSupply() + totalQueued + unclaimedFees;
    }

    /**
     * @notice Recovers a specified amount of a given token address.
     * @dev This override of RecoverableUpgradeable.recoverERC20() prevents the recovered
     * token from being the underlying token.
     * @inheritdoc RecoverableUpgradeable
     */
    function recoverERC20(address tokenAddress, uint256 amount) public override onlyOwner {
        // Ensure the token is not the underlying token
        require(tokenAddress != address(underlying()), "L43");

        // Proceed to recovery
        super.recoverERC20(tokenAddress, amount);
    }

    /**
     * @notice Recovers underlying tokens accidentally sent to the contract.
     * @dev To prevent owner from being able to drain the contract, this function only
     * allows recovering "unusable" underlying tokens, i.e., tokens that have not been
     * sent through fund() or deposit() functions.
     */
    function recoverUnderlying() external onlyOwner {
        // Compute the recoverable amount by taking the difference between the contract's
        // balance and the amount of usable underlying tokens
        uint256 recoverableAmount = underlying().balanceOf(address(this)) - usableUnderlyings;

        // Revert if there is nothing to recover
        require(recoverableAmount > 0, "L44");

        // Else, proceed to underlying tokens recovery
        super.recoverERC20(address(underlying()), recoverableAmount);
    }

    /**
     * @notice Retrieves the amount of underlying tokens invested by the given account.
     * @dev Implementing this function is required by the InvestUpgradeable contract. In
     * LToken contract, the investment of an account is equal to its real balance.
     * @inheritdoc InvestUpgradeable
     */
    function _investmentOf(address account) internal view override returns (uint256) {
        return realBalanceOf(account);
    }

    /**
     * @notice Distributes a specified amount of rewards (in L-Tokens) to a given account.
     * @dev Implementing this function is required by the InvestUpgradeable contract so
     * it can distribute rewards to accounts before each period reset.
     * @dev InvestUpgradeable contract already ensure that amount > 0.
     * @inheritdoc InvestUpgradeable
     */
    function _distributeRewards(address account, uint256 amount) internal override returns (bool) {
        // Inform listeners of the rewards minting
        emit MintedRewardsEvent(account, realBalanceOf(account), amount);

        // Mint L-Tokens rewards to account
        _mint(account, amount);

        // Return true indicating to InvestUpgradeable that the rewards have been distributed
        return true;
    }

    /**
     * @notice Override of ERC20._beforeTokenTransfer() to integrate with InvestUpgradeable.
     * @dev This overriden version ensure that _beforeInvestmentChange() hook is properly
     * called each time an account's balance is going to change.
     * @dev Note: whenNotPaused and notBlacklisted modifiers are not set as they are
     * already included in ERC20BaseUpgradeable._beforeTokenTransfer().
     * @inheritdoc ERC20BaseUpgradeable
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Upgradeable, ERC20BaseUpgradeable) {
        ERC20BaseUpgradeable._beforeTokenTransfer(from, to, amount);

        // Invoke _beforeInvestmentChange() hook for non-zero accounts
        if (from != address(0)) _beforeInvestmentChange(from, true);
        if (to != address(0)) _beforeInvestmentChange(to, true);

        // If some L-Token are being burned/minted, inform listeners of a TVL change
        if (from == address(0) || to == address(0)) emit TVLChangeEvent(totalSupply());
    }

    /**
     * @notice Override of ERC20._afterTokenTransfer() to notify all transfers listeners.
     * @dev This overriden version will trigger onLTokenTransfer() functions of all
     * transfers listeners.
     * @dev Note: whenNotPaused and notBlacklisted modifiers are not set as they are
     * already checked in _beforeTokenTransfer().
     * @inheritdoc ERC20Upgradeable
     */
    function _afterTokenTransfer(address from, address to, uint256 amount) internal override {
        super._afterTokenTransfer(from, to, amount);

        // Trigger onLTokenTransfer() functions of all the transfers listeners
        for (uint256 i = 0; i < transfersListeners.length; i++) {
            transfersListeners[i].onLTokenTransfer(from, to, amount);
        }
    }

    /**
     * @notice Computes the maximum amount of underlying tokens that should be retained
     * by the contract (based on retention rate).
     * @return amount The expected amount of retained underlying tokens.
     */
    function getExpectedRetained() public view returns (uint256 amount) {
        // Cache invested token's decimals number
        uint256 d = SUD.decimalsOf(address(invested()));

        // Convert totalSupply and retentionRate to SUD
        uint256 totalSupplySUD = SUD.fromAmount(totalSupply(), d);
        uint256 retentionRateSUD = SUD.fromRate(retentionRateUD7x3, d);

        // Compute and return expected retained amount
        uint256 expectedRetainedSUD = (totalSupplySUD * retentionRateSUD) / SUD.fromInt(100, d);
        return SUD.toAmount(expectedRetainedSUD, d);
    }

    /// @notice Transfers underlying tokens exceeding the retention rate to the fund wallet.
    function _transferExceedingToFund() internal {
        // Retrieve the expected amount retained
        uint256 expectedRetained = getExpectedRetained();

        // If usable underlyings are less than or equal to expected retained, return
        if (usableUnderlyings <= expectedRetained) return;

        // Else, exceeding amount is equal to difference between those values
        uint256 exceedingAmount = usableUnderlyings - expectedRetained;

        // Decrease usable underlyings amount accordingly
        usableUnderlyings -= exceedingAmount;

        // Transfer the exceeding amount to the fund wallet
        underlying().safeTransfer(fund, exceedingAmount);
    }

    /**
     * @notice Override of ERC20WrapperUpgradeable.withdrawTo() that reverts.
     * Use instantWithdrawal() or requestWithdrawal() functions instead.
     * @inheritdoc ERC20WrapperUpgradeable
     */
    function withdrawTo(address account, uint256 amount) public pure override returns (bool) {
        account; // Silence unused variable compiler warning
        amount;
        revert("L45");
    }

    /**
     * @notice Override of ERC20WrapperUpgradeable.depositFor() that reverts.
     * Use deposit() function instead.
     * @inheritdoc ERC20WrapperUpgradeable
     */
    function depositFor(address account, uint256 amount) public pure override returns (bool) {
        account; // Silence unused variable compiler warning
        amount;
        revert("L46");
    }

    /**
     * @notice Allows exchanging some underlying tokens for the same amount of L-Tokens.
     * @param amount The amount of underlying tokens to deposit.
     */
    function deposit(uint256 amount) public whenNotPaused notBlacklisted(_msgSender()) {
        // Ensure the account has enough underlying tokens to deposit
        require(underlying().balanceOf(_msgSender()) >= amount, "L47");

        // Update usable underlyings balance accordingly
        usableUnderlyings += amount;

        // Inform listeners of the deposit activity event
        emit ActivityEvent(NO_ID, _msgSender(), Action.Deposit, amount, amount, Status.Success);

        // Receive underlying tokens and mint L-Tokens to the account in a 1:1 ratio
        super.depositFor(_msgSender(), amount);

        // Transfer exceeding underlying tokens to the fund wallet
        _transferExceedingToFund();
    }

    /**
     * @notice Computes fees and net withdrawn amount for a given account withdrawing a
     * given amount.
     * @param account The account initiating the withdrawal.
     * @param amount The amount of the withdrawal.
     */
    function getWithdrawnAmountAndFees(
        address account,
        uint256 amount
    ) public view returns (uint256 withdrawnAmount, uint256 fees) {
        // If the account is eligible to staking tier 2, no fees are applied
        if (ldyStaking.tierOf(account) >= 2) return (amount, 0);

        // Cache invested token's decimals number
        uint256 d = SUD.decimalsOf(address(invested()));

        // Convert amount and fees rate to SUD
        uint256 amountSUD = SUD.fromAmount(amount, d);
        uint256 feesRateSUD = SUD.fromRate(feesRateUD7x3, d);

        // Compute fees and withdrawn amount (initial amount minus fees)
        uint256 feesSUD = (amountSUD * feesRateSUD) / SUD.fromInt(100, d);
        fees = SUD.toAmount(feesSUD, d);
        withdrawnAmount = amount - fees;
    }

    /**
     * @notice Allows instaneously exchanging a given amount of L-Tokens for the same
     * amount of underlying tokens. It will fail if the contract currently doesn't hold
     * enough underlying tokens to cover the withdrawal.
     * @dev In order to save some gas and time to users, frontends should propose this
     * function to users only when it has been verified that it will not revert. They
     * should propose the requestWithdrawal() function otherwise.
     * @param amount The amount L-Tokens to withdraw.
     */
    function instantWithdrawal(uint256 amount) external whenNotPaused notBlacklisted(_msgSender()) {
        // Ensure the account has enough L-Tokens to withdraw
        require(amount <= balanceOf(_msgSender()), "L48");

        // Can the contract cover this withdrawal plus all already queued requests?
        bool cond1 = totalQueued + amount <= usableUnderlyings;

        // Is caller eligible to staking tier 2 and the contract can cover this withdrawal?
        bool cond2 = ldyStaking.tierOf(_msgSender()) >= 2 && amount <= usableUnderlyings;

        // Revert if conditions are not met for the withdrawal to be processed instantaneously
        if (!(cond1 || cond2)) revert("L49");

        // Else, retrieve withdrawal fees and net withdrawn amount
        (uint256 withdrawnAmount, uint256 fees) = getWithdrawnAmountAndFees(_msgSender(), amount);

        // Increase unclaimed fees amount accordingly
        unclaimedFees += fees;

        // Decrease usable underlyings balance accordingly
        usableUnderlyings -= withdrawnAmount;

        // Inform listeners of this instant withdrawal activity event
        emit ActivityEvent(
            NO_ID,
            _msgSender(),
            Action.Withdraw,
            amount,
            withdrawnAmount,
            Status.Success
        );

        // Burn withdrawal fees from the account
        _burn(_msgSender(), fees);

        // Burn account's withdrawn L-Tokens and transfer to it underlying tokens in a 1:1 ratio
        super.withdrawTo(_msgSender(), withdrawnAmount);
    }

    /**
     * @notice Allows requesting the exchange of a given amount of L-Tokens for the same
     * amount of underlying tokens. The request will be automatically processed later.
     * @dev The sender must attach 0.004 ETH to pre-pay the future processing gas fees
     * paid by the withdrawer wallet.
     * @param amount The amount L-Tokens to withdraw.
     */
    function requestWithdrawal(
        uint256 amount
    ) public payable whenNotPaused notBlacklisted(_msgSender()) {
        // Ensure the account has enough L-Tokens to withdraw
        require(amount <= balanceOf(_msgSender()), "L53");

        // Ensure the requested amount doesn't overflow uint96
        require(amount <= type(uint96).max, "L54");

        // Ensure the sender attached the pre-paid processing gas fees
        require(msg.value == 0.004 * 10 ** 18, "L55");

        // Create withdrawal request data
        WithdrawalRequest memory request = WithdrawalRequest({
            account: _msgSender(),
            amount: uint96(amount)
        });

        // Will hold the request ID
        uint256 requestId;

        // Append request to the withdrawal queue:
        // - At the beginning, if account is eligible to staking tier 2 and cursor is not 0
        if (ldyStaking.tierOf(_msgSender()) >= 2 && withdrawalQueueCursor > 0) {
            withdrawalQueueCursor--;
            requestId = withdrawalQueueCursor;
            withdrawalQueue[requestId] = request;
        }
        // - At the end else
        else {
            withdrawalQueue.push(request);
            requestId = withdrawalQueue.length - 1;
        }

        // Increase total amount queued accordingly
        totalQueued += amount;

        // Inform listeners of this new queued withdrawal activity event
        emit ActivityEvent(
            int256(requestId),
            _msgSender(),
            Action.Withdraw,
            amount,
            amount,
            Status.Queued
        );

        // Burn withdrawal L-Tokens amount from account's balance
        _burn(_msgSender(), amount);

        // Forward pre-paid processing gas fees to the withdrawer wallet
        (bool sent, ) = withdrawer.call{value: msg.value}("");
        require(sent, "L56");
    }

    /**
     * @notice Processes queued withdrawal requests until there is else no more requests,
     * else not enough underlying tokens to continue.
     * @dev For further details, see "LToken  > Withdrawals" section of whitepaper.
     */
    function processQueuedRequests() external onlyWithdrawer whenNotPaused {
        // Accumulators variables, will be written on-chain after the loop
        uint256 cumulatedFees = 0;
        uint256 cumulatedWithdrawnAmount = 0;
        uint256 nextRequestId = withdrawalQueueCursor;

        // Cache queue length to avoid multiple SLOADs and avoid infinite loop as big
        // requests are increasing the queue length when moved at the end of the queue.
        uint256 queueLength = withdrawalQueue.length;

        // Iterate over requests to be processed
        while (nextRequestId < queueLength) {
            // Stop processing requests if there is not enough gas left to continue the
            // loop and properly end the function call. This prevents an attacker from
            // blocking the withdrawal processing by creating a ton of tiny requests so
            // this function call cannot fit anymore in block gas limit.
            if (gasleft() < 200_000) break;

            // Retrieve request data
            WithdrawalRequest memory request = withdrawalQueue[nextRequestId];

            // Skip empty request (processed big requests or cancelled requests)
            if (request.account == address(0)) {}
            //
            // If account has been blacklisted since request emission
            else if (isBlacklisted(request.account)) {
                // Remove request from queue
                delete withdrawalQueue[nextRequestId];

                // Append request in the frozen requests list
                frozenRequests.push(request);
            }
            //
            // Or if request is a big request, move it at the end of the queue for now.
            // This request will be processed manually later using processBigQueuedRequest()
            else if (request.amount > getExpectedRetained() / 2) {
                // Remove request from queue
                delete withdrawalQueue[nextRequestId];

                // Append request at the end of the queue
                withdrawalQueue.push(request);
            }
            //
            // Else, continue request processing
            else {
                // Retrieve withdrawal fees and net withdrawn amount
                (uint256 withdrawnAmount, uint256 fees) = getWithdrawnAmountAndFees(
                    request.account,
                    request.amount
                );

                // Break if the contract doesn't hold enough funds to cover the request
                if (withdrawnAmount > usableUnderlyings - cumulatedWithdrawnAmount) break;

                // Accumulate fees and withdrawn amount
                cumulatedFees += fees;
                cumulatedWithdrawnAmount += withdrawnAmount;

                // Inform listeners of this queued withdrawal processing activity event
                emit ActivityEvent(
                    int256(nextRequestId),
                    request.account,
                    Action.Withdraw,
                    request.amount,
                    withdrawnAmount,
                    Status.Success
                );

                // Remove request from queue
                delete withdrawalQueue[nextRequestId];

                // Transfer underlying tokens to account. Burning L-Tokens is not required
                // as equestWithdrawal() already did it.
                // Security note: Re-entrancy warning are disabled as the request has
                // just been deleted from the queue, it will so be skipped if trying to
                // process it again.
                // slither-disable-next-line reentrancy-no-eth
                underlying().safeTransfer(request.account, withdrawnAmount);
            }

            // Increment next request ID
            nextRequestId++;
        }

        // Increase unclaimed fees by the amount of cumulated fees
        unclaimedFees += cumulatedFees;

        // Decrease usable underlyings by the cumulated amount of withdrawn underlyings
        usableUnderlyings -= cumulatedWithdrawnAmount;

        // Decrease total amount queued by the cumulated amount requested
        totalQueued -= cumulatedWithdrawnAmount + cumulatedFees;

        // Update new queue cursor
        withdrawalQueueCursor = nextRequestId;
    }

    /**
     * @notice Processes a given queued big withdrawal request (one that exceeds half of
     * the retention rate).
     * @dev In contrast to non-big requests processing, this function will uses to fund
     * wallet's balance to fill the request. This allows processing requests that are
     * greater than retention rate without having to exceed this rate on the contract.
     * @param requestId The ID of the big request to process.
     */
    function processBigQueuedRequest(uint256 requestId) external onlyFund whenNotPaused {
        // Retrieve request data
        WithdrawalRequest memory request = withdrawalQueue[requestId];

        // Ensure the request is active
        require(request.account != address(0), "L66");

        // Ensure the request emitter has not been blacklisted since request emission
        require(!isBlacklisted(request.account), "L50");

        // Ensure this is indeed a big request
        require(request.amount > getExpectedRetained() / 2, "L51");

        // Retrieve withdrawal fees and net withdrawn amount
        (uint256 withdrawnAmount, uint256 fees) = getWithdrawnAmountAndFees(
            request.account,
            request.amount
        );

        // Ensure withdrawn amount can be covered by contract + fund wallet balances
        uint256 fundBalance = underlying().balanceOf(fund);
        require(withdrawnAmount <= usableUnderlyings + fundBalance, "L52");

        // Increase amount of unclaimed fees accordingly
        unclaimedFees += fees;

        // Decrease total queued amount by request amount
        totalQueued -= request.amount;

        // Increment queue cursor if request was the next request to be processed
        if (requestId == withdrawalQueueCursor) withdrawalQueueCursor++;

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

        // If fund wallet's balance can cover request, rely on it only
        if (withdrawnAmount <= fundBalance) {
            underlying().safeTransferFrom(_msgSender(), request.account, withdrawnAmount);
        }
        // Else, cover request from both fund wallet and contract balances
        else {
            // Compute amount missing from fund wallet to cover request
            uint256 missingAmount = withdrawnAmount - fundBalance;

            // Decrease usable amount of underlying tokens accordingly
            usableUnderlyings -= missingAmount;

            // Transfer entire fund balance to request's emitter
            underlying().safeTransferFrom(_msgSender(), request.account, fundBalance);

            // Transfer missing amount from contract balance to request emitter
            underlying().safeTransfer(request.account, missingAmount);
        }
    }

    /**
     * @notice Cancels a given withdrawal request. The request emitter receive back its
     * L-Tokens and no fees will be charged.
     * @param requestId The ID of the withdrawal request to cancel.
     */
    function cancelWithdrawalRequest(
        uint256 requestId
    ) public whenNotPaused notBlacklisted(_msgSender()) {
        // Retrieve request data
        WithdrawalRequest memory request = withdrawalQueue[requestId];

        // Ensure request belongs to caller
        require(_msgSender() == request.account, "L57");

        // Mint back L-Tokens to account
        _mint(request.account, uint256(request.amount));

        // Decrease total amount queued accordingly
        totalQueued -= request.amount;

        // Delete the withdrawal request from queue
        delete withdrawalQueue[requestId];

        // Inform listeners of this cancelled withdrawal request activity event
        emit ActivityEvent(
            int256(requestId),
            request.account,
            Action.Withdraw,
            request.amount,
            request.amount,
            Status.Cancelled
        );
    }

    /**
     * @notice Used by the fund wallet to repatriate underlying tokens on the contract
     * whenever those are required to fulfill some withdrawal requests.
     * @dev The function will revert if repatriated amount makes the contract exceeding
     * the retention rate.
     * @param amount The amount of underlying tokens to repatriate.
     */
    function repatriate(uint256 amount) external onlyFund whenNotPaused {
        // Ensure the fund wallet has enough funds to repatriate
        require(amount <= underlying().balanceOf(fund), "L58");

        // Calculate new contract usable balance
        uint256 newBalance = usableUnderlyings + amount;

        // Ensure the new balance doesn't exceed the retention rate
        require(newBalance <= getExpectedRetained(), "L59");

        // Increase usable underlyings amount by repatriated amount
        usableUnderlyings += amount;

        // Transfer amount from fund wallet to contract
        underlying().safeTransferFrom(_msgSender(), address(this), amount);
    }

    /// @notice Used by owner to claim fees generated from successful withdrawal.
    function claimFees() external onlyOwner {
        // Ensure there are some fees to claim
        require(unclaimedFees > 0, "L60");

        // Ensure the contract holds enough underlying tokens to cover fees
        require(usableUnderlyings >= unclaimedFees, "L61");

        // Decrease usable underlyings amount accordingly
        usableUnderlyings -= unclaimedFees;

        // Store fees amount in memory and reset unclaimed fees amount
        uint256 fees = unclaimedFees;
        unclaimedFees = 0;

        // Transfer unclaimed fees to owner
        underlying().safeTransfer(owner(), fees);
    }
}
