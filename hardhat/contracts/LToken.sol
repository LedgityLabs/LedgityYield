// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
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
import "./libs/UDS3.sol";
import "./LTYStaking.sol";

/// @custom:security-contact security@ledgity.com
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

    struct WithdrawalRequest {
        address account;
        uint128 amount;
    }

    LTYStaking ltyStakingContract;
    address payable withdrawerWallet;
    address fundWallet;

    uint256 feesRateUDS3;
    uint256 retentionRateUDS3;
    uint256 unclaimedFees;
    uint256 totalQueued; // Amount of L-Tokens in withdrawalQueue
    uint256[5] ltyTiersUD18; // Amount of $LTY to be staked to be elligible to each tier
    // Holds the amount of underlying tokens detained by the fundWallet wallet (required as underlying tokens are not simply kept on the fundWallet but are swapped against FIAT and so underlying().balanceOf(fundWallet) will never return the real amount of tokens sent to fundWallet wallet)
    uint256 fundWalletBalance;

    WithdrawalRequest[] withdrawalQueue;

    event balanceMutation(address account, uint256 balance);
    event queuedWithdrawalRequest(uint256 index);
    event removedWithdrawalRequest(uint256 index);

    modifier onlyServer() {
        require(_msgSender() == withdrawerWallet, "Only server can execute this function");
        _;
    }

    modifier onlyFund() {
        require(_msgSender() == fundWallet, "Only fundWallet can execute this function");
        _;
    }

    modifier endsHealthy() {
        _;
        // If some fundWallets are missing after the transaction, revert it.
        if (getDifference() < 0) revert("The contract ends unhealthy, not permitted.");
    }

    modifier forbidden() {
        revert("Forbidden");
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
        __Invest_init(this);
    }

    /**
     * @dev Implements a bunch of parent contract functions reserved to owner
     * See parent contracts for further details.
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function setBlacklistContract(address _contract) external onlyOwner {
        _setBlacklistContract(_contract);
    }

    /**
     * @dev Mirrors decimals of underlying token by using ERC20WrapperUpgradeable.decimals().
     * @return The decimals of the underlying token
     */
    function decimals() public view override(ERC20Upgradeable, ERC20WrapperUpgradeable) returns (uint8) {
        return ERC20WrapperUpgradeable.decimals();
    }

    /**
     * @dev Implementation of Recoverable._recoverERC20() that ensures:
     * - the caller is the owner
     * - the token recovered token is not the underlying token
     * @param tokenAddress See Recoverable contract
     * @param amount See Recoverable contract
     */
    function recoverERC20(address tokenAddress, uint256 amount) external onlyOwner {
        // Ensure the token is not the underlying token
        require(tokenAddress != address(underlying()), "Use recoverUnderlying() instead");
        _recoverERC20(tokenAddress, amount);
    }

    /**
     * @dev Implementation of InvestUpgradeable.claimRewards(). Required by parent contract to use non-discrete rewards tracking. In this contract claiming rewards results in minting new LTokens to the user. However this function is not to be called publicly and is called each time the investment period is reset.
     * @param account The account to mint rewards to
     * @param amount The amount of rewards to mint
     */
    function claimRewardsOf(address account, uint256 amount) internal override returns (bool) {
        // Mint rewarded L-Tokens to account
        _mint(account, amount);

        // Return true indicating to InvestUpgradeable that the rewards have been claimed
        return true;
    }

    function investmentOf(address account) internal view override returns (uint256) {
        return realBalanceOf(account);
    }

    /**
     * @dev A bunch states setters.
     * For more infos about UD3, see: Whitepaper "Rates and UD3" section.
     * For more infos about each state, see states declaration at the top of the contract.
     */
    function setFeesRate(uint256 _feesRateUD3) public onlyOwner {
        feesRateUDS3 = _feesRateUD3 * 10 ** decimals();
    }

    function setRetentionRate(uint256 _retentionRateUD3) public onlyOwner {
        retentionRateUDS3 = _retentionRateUD3 * 10 ** decimals();
    }

    function setLTYStakingContract(address _contract) public onlyOwner {
        ltyStakingContract = LTYStaking(_contract);
    }

    function setWithdrawerWallet(address payable _withdrawerWallet) public onlyOwner {
        withdrawerWallet = _withdrawerWallet;
    }

    function setFundWallet(address payable _fundWallet) public onlyOwner {
        fundWallet = _fundWallet;
    }

    function setLTYTier(uint256 index, uint256 amountUD18) public onlyOwner {
        ltyTiersUD18[index] = amountUD18;
    }

    function setAPR(uint16 aprUD3) public onlyOwner {
        APRCheckpoints.setAPR(packedAPRCheckpoints, aprUD3);
    }

    /**
     * Override of ERC20.balanceOf() that returns the total amount of L-Token that belong to
     * the account, including not yet minted rewards.
     * @param account The account to check balance for
     * @return The total balance of the account
     */
    function balanceOf(address account) public view override returns (uint256) {
        return realBalanceOf(account) + rewardsOf(account);
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
     * @dev Returns the L-Token total supply, including not yet minted rewards and queued tokens.
     * @return The total supply of L-Token
     */
    function totalSupply() public view override returns (uint256) {
        return realTotalSupply() + totalQueued + unclaimedFees;
    }

    /**
     * @dev Returns the L-Token real total supply, i.e., only really minted tokens.
     * @return The real total supply of L-Token
     */
    function realTotalSupply() public view returns (uint256) {
        return super.totalSupply();
    }

    /**
     * @dev Returns the amount of underlying token ever deposited on the contract. This includes
     * the ones currently held by the contract, as well as the one that have been sent to the
     * fundWallet wallet.
     * @return The total supply of underlying token
     */
    function underlyingBalance() public view returns (uint256) {
        return realTotalUnderlyingSupply() + fundWalletBalance;
    }

    /**
     * @dev Returns the real amount of underlying token currently held by the contract.
     * @return The balance of the contract in underlying token
     */
    function realTotalUnderlyingSupply() public view returns (uint256) {
        return underlying().balanceOf(address(this));
    }

    /**
     * @dev Override of ERC20.beforeTokenTransfer() hook, that ensures:
     * - the contract is not paused,
     * - the sender is not blacklisted
     * - that the contract ends healthy afterreseting investment period of both sender and recipient.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused notBlacklisted endsHealthy {
        super._beforeTokenTransfer(from, to, amount);

        // If this is a wallet-to-wallet transfer (not a burn or a mint)
        // See: https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20-_beforeTokenTransfer-address-address-uint256-
        if (from != address(0) && to != address(0)) {
            // Reset investment period of both sender and recipient before their balances are mutated
            _resetInvestmentPeriodOf(from);
            _resetInvestmentPeriodOf(to);
        }
    }

    /**
     * @dev Override of ERC20._afterTokenTransfer() hook, that emit events to indicates accounts balance
     * mutation and that ensures the contract ends healthy after each transfer.
     * @param from See ERC20._afterTokenTransfer()
     * @param to See ERC20._afterTokenTransfer()
     * @param amount See ERC20._afterTokenTransfer()
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override endsHealthy {
        super._afterTokenTransfer(from, to, amount);
        if (from != address(0)) emit balanceMutation(from, balanceOf(from));
        if (to != address(0)) emit balanceMutation(from, balanceOf(to));
    }

    /**
     * @dev Function used to transferring underlying token from or to the fundWallet wallet while
     * keeping track of the fundWallet balance. This allows the contract to be aware of the fundWallet
     * wallet holding and so being able to figure unhealthy situations. (See "Healthyness"
     * section of the whitepaper for more details)
     * @param amount Amount of underlying to transfer from or to fundWallet wallet
     */
    function transferUnderlyingFromFund(uint256 amount) internal {
        fundWalletBalance -= amount;
        underlying().safeTransferFrom(fundWallet, address(this), amount);
    }

    function transferUnderlyingToFund(uint256 amount) internal {
        fundWalletBalance += amount;
        underlying().safeTransferFrom(address(this), fundWallet, amount);
    }

    /**
     * @dev Calculates the expected amount of underlying token that is expected to be retained on
     * the contract (from retention rate).
     * @return amountUDS3 The expected amount of underlying tokens in UDS3 format
     */
    function getExpectedRetainedUDS3() public view returns (uint256 amountUDS3) {
        uint256 totalSupplyUDS3 = UDS3.scaleUp(totalSupply());
        return (totalSupplyUDS3 * retentionRateUDS3) / UDS3.to(100, decimals());
    }

    /**
     * Override of ERC20Wrapper.depositFor() method
     */
    function depositFor(
        address account,
        uint256 amount
    ) public override whenNotPaused notBlacklisted endsHealthy returns (bool) {
        // Reset investment period of account
        _resetInvestmentPeriodOf(account);

        // Receive deposited underlying token and mint L-Token to the account in a 1:1 ratio
        super.depositFor(account, amount);

        // Retrieve current and expected retained amounts of underlying tokens as SDS3 numbers
        int256 expectedRetainedSDS3 = int256(getExpectedRetainedUDS3());
        int256 currentlyRetainedSDS3 = int256(UDS3.scaleUp(underlying().balanceOf(address(this))));

        // Calculate the difference between the expected and current amount of underlying on the contract
        int256 differenceSDS3 = expectedRetainedSDS3 - currentlyRetainedSDS3;

        // Scale up deposited amount to UDS3
        uint256 amountUDS3 = UDS3.scaleUp(amount);

        // If some underlying tokens are missing
        if (differenceSDS3 > 0) {
            // If the deposited amount is greater than the difference, keep only missing tokens on contract and transfer the rest to fundWallet wallet
            if (amountUDS3 > uint256(differenceSDS3)) {
                transferUnderlyingToFund(amount - uint256(differenceSDS3));
            }
            // Else, do nothing (i.e., keep the whole deposited amount on the contract)
        }
        // Else, transfer the whole deposited amount to fundWallet wallet
        else {
            transferUnderlyingToFund(amount);
        }

        // Returns true as required by the overriden parent function.
        // See: https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Wrapper-depositFor-address-uint256-
        return true;
    }

    function _withdrawTo(address account, uint256 amount) internal returns (bool) {
        // Reset investment period of account
        _resetInvestmentPeriodOf(account);

        // Convert amount to UDS3
        uint256 amountUDS3 = UDS3.scaleUp(amount);

        // Calculate fees and update the amount of unclaimed fees;
        uint256 feesUDS3 = (amountUDS3 * feesRateUDS3) / UDS3.to(100, decimals());
        uint256 fees = UDS3.scaleDown(feesUDS3);
        unclaimedFees += fees;

        // Calculate the final withdrawn amount and update the total deposited underlying tokens
        uint256 withdrawnAmount = amount - fees;

        // Process to withdraw by burning the withdrawn L-Token amount and transfering an equivalent amount in underlying tokens
        super.withdrawTo(account, withdrawnAmount);

        // Returns true as required by the overriden parent function.
        // See: https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Wrapper-withdrawTo-address-uint256-
        return true;
    }

    /**
     * @dev Override of ERC20WrapperUpgradeable.withdrawTo() function that prevents any usage of it
     * (forbidden). Use _withdrawTo() internally instead.
     */
    function withdrawTo(address account, uint256 amount) public override forbidden returns (bool) {}

    function emitWithdrawalRequest(
        uint256 amount
    ) public payable whenNotPaused notBlacklisted endsHealthy {
        // Ensure the account has enough fundWallets to withdraw
        require(amount <= balanceOf(_msgSender()), "You don't have enough fundWallet to withdraw");

        // Ensure the sender attached pre-paid queue fees and forward them to server wallet
        require(msg.value != 0.005 * 10 ** 18, "You must attach 0.005 ETH to the request");
        (bool sent, ) = withdrawerWallet.call{value: msg.value}("");
        require(sent, "Failed to forward Ethers to withdrawer");

        // Retrieve the current amount of underlying tokens on the contract
        uint256 uBalance = realTotalUnderlyingSupply();

        // If there is enough fundWallets to cover requests in queue + the current request, process to withdrawal
        if (totalQueued + amount <= uBalance)
            _withdrawTo(_msgSender(), amount);

            // Else if there is enough fundWallets to cover the current request and the sender has staked more than 200k LTY
        else if (amount <= uBalance && ltyStakingContract.stakeOf(msg.sender) > ltyTiersUD18[0])
            _withdrawTo(_msgSender(), amount);

            // Else burn accounts tokens and put the request in queue
        else {
            _burn(_msgSender(), amount);
            withdrawalQueue.push(WithdrawalRequest({account: _msgSender(), amount: uint120(amount)}));
            totalQueued += amount;
            emit queuedWithdrawalRequest(withdrawalQueue.length - 1);
        }
    }

    function removeWithdrawalRequest(uint256 requestId) public whenNotPaused notBlacklisted endsHealthy {
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

    function processWithdrawalRequest(uint256 requestId) public onlyServer whenNotPaused endsHealthy {
        // Retrieve request and ensure it exists and has not been processed yet or cancelled
        WithdrawalRequest memory request = withdrawalQueue[requestId];

        // Mint back L-Tokens to account + remove withdrawal requests
        removeWithdrawalRequest(requestId);

        // Proceed to withdrawal by sending the requested amount to request's account
        _withdrawTo(request.account, request.amount);
    }

    /**
     * This function allows fundWallet wallet to fundWallet this contract while protecting from exceeding the current retention rate.
     * This protects from accidentally transfering more fundWallets than expected to the contract.
     */
    function fundWalletContract(uint256 amount) public onlyFund whenNotPaused endsHealthy {
        // Calculate new balance
        uint256 newBalance = underlying().balanceOf(address(this)) + amount;

        // Ensure the new balance doesn't exceed the retention rate
        require(
            newBalance <= UDS3.scaleDown(getExpectedRetainedUDS3()),
            "Retained underlying limit exceeded"
        );

        // Transfer amount from fundWallet wallet to contract
        transferUnderlyingFromFund(amount);
    }

    function claimFees() public onlyOwner endsHealthy {
        _resetInvestmentPeriodOf(_msgSender());
        _mint(_msgSender(), unclaimedFees);
        unclaimedFees = 0;
    }

    /*
        0  : perfect match between underlying and L-Token amounts
        >0 : there is more underlying tokens than L-Tokens (to be recovered)
        <0 : there is more L-Tokens than underlying tokens (!! contract breach !!)
    // */
    function getDifference() public view returns (int256 difference) {
        difference = int256(totalSupply()) - int256(underlyingBalance());
    }

    function recoverUnderlying() public onlyOwner endsHealthy {
        int256 difference = getDifference();
        if (difference > 0) underlying().safeTransfer(owner(), uint256(difference));
        else if (difference == 0) revert("There is nothing to recover");
        else pause();
    }
}
