// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20WrapperUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "./libs/APRCheckpoints.sol";
import "./abstracts/RestrictedUpgradeable.sol";
import "./abstracts/InvestUpgradeable.sol";
import "./abstracts/RecoverUpgradeable.sol";
import "./LTYStaking.sol";

/**
 * @title LToken
 * @author Lila Rest (lila@ledgity.com)
 * @notice
 * @dev For more details see "LToken" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
contract LToken is
    Initializable,
    ERC20Upgradeable,
    ERC20WrapperUpgradeable,
    PausableUpgradeable,
    Ownable2StepUpgradeable,
    UUPSUpgradeable,
    RestrictedUpgradeable,
    InvestUpgradeable,
    RecoverUpgradeable
{
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /**
     * @dev Represents a withdrawal request.
     * @param account The account that emitted the request
     * @param amount The amount of underlying requested
     */
    struct WithdrawalRequest {
        address account;
        uint128 amount;
    }

    /// @dev Holds address of the LTYStaking contract
    LTYStaking ltyStaking;

    /// @dev Holds address of withdrawer wallet (managed by withdrawal server)
    address payable withdrawer;

    /// @dev Holds address of fund wallet (managed by financial team)
    address fund;

    /// @dev Holds the withdrawal fee rate in UD3 format (3 digits fixed point, e.g., 0.350% = 350)
    uint256 feesRateUD3;

    /// @dev Holds withdrawal fees not claimed yet by contract owner.
    uint256 unclaimedFees;

    /// @dev Holds the retention rate in UD3 format. See "Retention rate" section of whitepaper.
    uint256 retentionRateUD3;

    /// @dev Holds the amount of L-Tokens current in the withdrawal queue.
    uint256 totalQueued;

    /**
     * @dev Holds the amount of underlying tokens that are usable by the contract (i.e,
     * not accidentally deposited or else)
     */
    uint256 usableBalance;

    /// @dev Holds an ordered list of withdrawal requests.
    WithdrawalRequest[] withdrawalQueue;

    /**
     * @dev Emitted each time the invested balance of an account changes
     * It is used off-chain to properly display capital growth trough time.
     * @param account The account whose invested balance changed.
     * @param balance The new invested balance of the account.
     */
    event balanceMutation(address account, uint256 balance);

    /**
     * @dev Emitted to indicate that a withdrawal request has been queued or removed
     * from the queue. This is used by the withdrawal server to keep track of requests.
     * @param index The index of the withdrawal request in the queue.
     */
    event queuedWithdrawalRequest(uint256 index);
    event removedWithdrawalRequest(uint256 index);

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

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(IERC20Upgradeable underlyingToken) public initializer {
        // Retrieve underlying token metadata
        IERC20MetadataUpgradeable underlyingMetadata = IERC20MetadataUpgradeable(
            address(underlyingToken)
        );

        // Initialize ancestors contracts
        __ERC20_init(
            string(abi.encodePacked("Ledgity ", underlyingMetadata.name())),
            string(abi.encodePacked("L", underlyingMetadata.symbol()))
        );
        __ERC20Wrapper_init(underlyingToken);
        __Ownable2Step_init();
        __Pausable_init();
        __UUPSUpgradeable_init();
        __Invest_init(address(this));
    }

    /**
     * @dev Implements a bunch of parent contract functions reserved to owner
     * See parent contracts for further details.
     * @inheritdoc UUPSUpgradeable
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev A bunch states setters.
     * For more infos about UD3, see: Whitepaper "Rates and UD3" section.
     * For more infos about each state, see states declaration at the top of the contract.
     */
    function setBlacklistContract(address _contract) external onlyOwner {
        _setBlacklistContract(_contract);
    }

    function setFeesRate(uint256 _feesRateUD3) public onlyOwner {
        feesRateUD3 = _feesRateUD3;
    }

    function setRetentionRate(uint256 _retentionRateUD3) public onlyOwner {
        retentionRateUD3 = _retentionRateUD3;
    }

    function setLTYStaking(address _contract) public onlyOwner {
        ltyStaking = LTYStaking(_contract);
    }

    function setwithdrawer(address payable _withdrawer) public onlyOwner {
        withdrawer = _withdrawer;
    }

    function setfund(address payable _fund) public onlyOwner {
        fund = _fund;
    }

    function setAPR(uint16 aprUD3) public onlyOwner {
        APRCheckpoints.setAPR(packedAPRCheckpoints, aprUD3);
    }

    /**
     * @dev Mirrors decimals of the underlying token using ERC20WrapperUpgradeable.decimals().
     * @inheritdoc ERC20WrapperUpgradeable
     */
    function decimals() public view override(ERC20Upgradeable, ERC20WrapperUpgradeable) returns (uint8) {
        return ERC20WrapperUpgradeable.decimals();
    }

    /**
     * @dev Override of ERC20Upgradeable.balanceOf() that returns the total amount of
     * L-Tokens that belong to the account, including its unclaimed rewards.
     * See : TODO
     * @inheritdoc ERC20Upgradeable
     */
    function balanceOf(address account) public view override returns (uint256) {
        return realBalanceOf(account) + _rewardsOf(account, true);
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
     * @dev Override of RecoverUpgradeable.recoverERC20() that ensures:
     * - the caller is the owner
     * - the token recovered token is not the underlying token
     * @inheritdoc RecoverUpgradeable
     */
    function recoverERC20(address tokenAddress, uint256 amount) public override onlyOwner {
        // Ensure the token is not the underlying token
        require(tokenAddress != address(underlying()), "Use recoverUnderlying() instead");
        super.recoverERC20(tokenAddress, amount);
    }

    /**
     * @dev Allows recovering accidentally deposited underlying token. To prevent contract
     * owner from draining funds from the contract, this function only allows recovering
     * "unusable" underlying tokens, i.e., tokens that have not been deposited through
     * legit ways. See "LToken > Underlying token recovery" section of whitepaper.
     */
    function recoverUnderlying() external onlyOwner {
        uint256 unusable = getUnusableUnderlying();
        if (unusable > 0) super.recoverERC20(address(underlying()), unusable);
        else revert("There is nothing to recover");
    }

    /**
     * @dev Returns the difference between contract underlying balance and the usable balance.
     * Those funds are called "unusable" and have not been deposited through legit ways.
     * They should be recovered by the contract owner.
     * @return The unusable underlying balance
     */
    function getUnusableUnderlying() public view returns (uint256) {
        return underlying().balanceOf(address(this)) - usableBalance;
    }

    /**
     * @dev Implementation of InvestUpgradeable.claimRewards(). Required by parent contract to use non-discrete rewards tracking. In this contract claiming rewards results in minting new LTokens to the user. However this function is not to be called publicly and is called each time the investment period is reset.
     * @inheritdoc InvestUpgradeable
     */
    function _claimRewardsOf(address account, uint256 amount) internal override returns (bool) {
        // Mint rewarded L-Tokens to account
        _mint(account, amount);

        // Return true indicating to InvestUpgradeable that the rewards have been claimed
        return true;
    }

    /**
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
     * @inheritdoc ERC20Upgradeable
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused notBlacklisted(from) notBlacklisted(to) {
        super._beforeTokenTransfer(from, to, amount);
        if (from != address(0)) _resetInvestmentPeriodOf(from, true);
        if (to != address(0)) _resetInvestmentPeriodOf(to, true);
    }

    /**
     * @dev Override of ERC20._afterTokenTransfer() hook that emits events indicating
     * mutations of implied accounts' balances. This is used off-chain to draw a precise
     * investment growth.
     * mutation and that ensures the contract ends healthy after each transfer.
     * @inheritdoc ERC20Upgradeable
     */
    function _afterTokenTransfer(address from, address to, uint256 amount) internal override {
        super._afterTokenTransfer(from, to, amount);
        if (from != address(0)) emit balanceMutation(from, balanceOf(from));
        if (to != address(0)) emit balanceMutation(to, balanceOf(to));
    }

    /**
     * @dev Calculates the amount of underlying token that is expected to be retained on
     * the contract (from retention rate).
     * @return amount The expected amount of underlying tokens
     */
    function getExpectedRetained() public view returns (uint256 amount) {
        return (totalSupply() * ud3ToDecimals(retentionRateUD3)) / toDecimals(100);
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
        if (difference > 0 && uint256(difference) > toDecimals(10000)) {
            // Transfer the exceeding amount to the fund wallet
            underlying().safeTransferFrom(address(this), fund, uint256(difference));
            usableBalance -= uint256(difference);
        }
    }

    /**
     * @dev Overrides of ERC20WrapperUpgradeable.withdrawTo() and depositFor() functions
     * that prevents any usage of them (forbidden).
     * Instead, use _withdrawTo() and super.depositFor() internally or withdraw() and
     * deposit() externally.
     * @inheritdoc ERC20WrapperUpgradeable
     */
    function withdrawTo(address account, uint256 amount) public override returns (bool) {
        revert("Forbidden, use withdraw() instead");
    }

    function depositFor(address account, uint256 amount) public override returns (bool) {
        revert("Forbidden, use deposit() instead");
    }

    /**
     * @dev Override of ERC20Wrapper.depositFor() support reset of investment period and
     * transfer of underlying tokens exceeding the retention
     * @param amount The amount of underlying tokens to deposit
     */
    function deposit(uint256 amount) public whenNotPaused notBlacklisted(_msgSender()) returns (bool) {
        _resetInvestmentPeriodOf(_msgSender(), true);

        // Receive deposited underlying tokens and mint L-Token to the account in a 1:1 ratio
        super.depositFor(_msgSender(), amount);
        usableBalance += amount;

        // Transfer funds exceeding the retention rate to fund wallet
        _transferExceedingToFund();

        // Returns true as required by the overriden parent function.
        // See: https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Wrapper-depositFor-address-uint256-
        return true;
    }

    /**
     * @dev Implementation of ERC20Wrapper.withdrawTo() supporting reset of investment
     * period, withdrawal fees, and transfer of underlying tokens exceeding the retention
     * rate.
     * @param account The account to withdraw tokens for
     * @param amount The amount of tokens to withdraw
     */
    function _withdrawTo(address account, uint256 amount, bool fromFund) internal returns (bool) {
        _resetInvestmentPeriodOf(account, true);

        // Calculate withdrawal fees and update the amount of unclaimed fees
        uint256 fees = (amount * ud3ToDecimals(feesRateUD3)) / toDecimals(100);
        unclaimedFees += fees;

        // Remove fees from the requested amount to obtain the amount to withdraw
        uint256 withdrawnAmount = amount - fees;

        // If not a big request filled from fund reserve
        if (!fromFund) {
            // Process to withdraw (burns withdrawn L-Tokens amount and transfers underlying tokens in a 1:1 ratio)
            super.withdrawTo(account, withdrawnAmount);
            usableBalance -= withdrawnAmount;
        }
        // Else transfer underlying tokens from fund reserve
        else {
            approve(address(this), withdrawnAmount);
            transferFrom(fund, account, withdrawnAmount);
        }

        // Transfer funds exceeding the retention rate to fund wallet
        _transferExceedingToFund();

        // Returns true as required by the overriden parent function.
        // See: https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Wrapper-withdrawTo-address-uint256-
        return true;
    }

    /**
     * @dev Try to withdraw a given amount of underlying tokens. The request will be
     * processed immediatelly if conditions are met, otherwise this function will
     * revert.
     * @param amount The amount of tokens to withdraw
     */
    function withdraw(uint256 amount) external payable whenNotPaused notBlacklisted(_msgSender()) {
        // Ensure the account has enough funds to withdraw
        require(amount <= balanceOf(_msgSender()), "You don't have enough fund to withdraw");

        /* 
        Process request immediately if the contract holds enough underlying tokens to:
         - cover current request + amount in queue 
         - OR to cover current request and the sender is eligible to 1st staking tier
        Else revert.
        */
        uint256 _usableBalance = usableBalance;
        if (totalQueued + amount <= _usableBalance) _withdrawTo(_msgSender(), amount, false);
        else if (amount <= _usableBalance && ltyStaking.isEligibleTo(1, _msgSender()))
            _withdrawTo(_msgSender(), amount, false);
        else revert("Can't process request immediatelly, please queue your request");
    }

    /**
     * @dev Put a withdrawal request in the queue. The sender must attach 0.005 ETH to
     * pre-pay the processing gas fees.
     * @param amount The amount of tokens to withdraw
     */
    function addQueuedWithdrawalRequest(
        uint256 amount
    ) public payable whenNotPaused notBlacklisted(_msgSender()) {
        // Ensure the account has enough funds to withdraw
        require(amount <= balanceOf(_msgSender()), "You don't have enough fund to withdraw");

        // Ensure the sender attached pre-paid processing gas fees
        require(msg.value != 0.005 * 10 ** 18, "You must attach 0.005 ETH to the request");

        // Forward pre-paid processing gas fees to the withdrawer
        (bool sent, ) = withdrawer.call{value: msg.value}("");
        require(sent, "Failed to forward Ethers to withdrawer");

        // Reset investment period of account and burn withdrawn L-Tokens amount
        _resetInvestmentPeriodOf(_msgSender(), true);
        _burn(_msgSender(), amount);

        // Add the withdrawal request to the queue and update the total amount in queue
        withdrawalQueue.push(WithdrawalRequest({account: _msgSender(), amount: uint120(amount)}));
        totalQueued += amount;

        // Finally emit an event to notify the request addition
        emit queuedWithdrawalRequest(withdrawalQueue.length - 1);
    }

    /**
     * @dev Removes a withdrawal request from the queue and sends back L-Tokens to the
     * request emitter.
     * @param requestId The index of the withdrawal request to remove
     */
    function removeQueuedWithdrawalRequest(
        uint256 requestId
    ) public whenNotPaused notBlacklisted(_msgSender()) {
        // Retrieve request and ensure it belongs to sender
        WithdrawalRequest memory request = withdrawalQueue[requestId];
        require(request.account == _msgSender(), "This withdrawal request doesn't belong to you");

        // Send back L-Tokens to account
        _mint(_msgSender(), uint256(request.amount));

        // Remove requested amount from the total amount in queue
        totalQueued -= request.amount;

        // Delete the withdrawal request from queue
        delete withdrawalQueue[requestId];

        // Finally emit an event to notify the request removal
        emit removedWithdrawalRequest(requestId);
    }

    /**
     * @dev Processes a given queued withdrawal request. This function is reserved to
     * the withdrawer server. See "LToken > Withdrawals" section of whitepaper for more
     * details.
     * @param requestId The index of the withdrawal request to process
     */
    function processQueuedWithdrawalRequest(uint256 requestId) external onlyWithdrawer whenNotPaused {
        // Retrieve request and ensure it exists and has not been processed yet or cancelled
        WithdrawalRequest memory request = withdrawalQueue[requestId];

        // Ensure the request emitter has not been blacklisted since request emission
        require(!isBlacklisted(request.account), "Request emitter has been blacklisted");

        // Mint back L-Tokens to account + remove withdrawal requests
        removeQueuedWithdrawalRequest(requestId);

        // Proceed to withdrawal by sending the requested amount to request's account
        _withdrawTo(request.account, request.amount, false);
    }

    /**
     * @dev Processes a given big queued withdrawal request (that exceeds the retention rate).
     * In contrast to non-big requests, this function fill the request with contract's funds
     * but instead directly uses underlying tokens of the fund wallet. This allows
     * processing requests that are bigger than the retention rate without ever exceeding
     * the retention rate on the contract.
     * @param requestId The index of the big request to process
     */
    function processBigQueuedWithdrawalRequest(uint256 requestId) external onlyFund whenNotPaused {
        // Retrieve request and ensure it exists and has not been processed yet or cancelled
        WithdrawalRequest memory request = withdrawalQueue[requestId];

        // Ensure the request emitter has not been blacklisted since request emission
        require(!isBlacklisted(request.account), "Request emitter has been blacklisted");

        // Ensure this is a big request
        require(request.amount > getExpectedRetained() / 2, "Not a big request");

        // Mint back L-Tokens to account + remove withdrawal requests
        removeQueuedWithdrawalRequest(requestId);

        // Proceed to withdrawal by transferring the requested amount from fund wallet to request's emitter
        _withdrawTo(request.account, request.amount, true);
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
        unclaimedFees = 0;
        _mint(_msgSender(), unclaimedFees);
    }
}
