// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20WrapperUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./Blacklist.sol";


/// @custom:security-contact security@ledgity.com
contract LToken is 
    Initializable, 
    ERC20Upgradeable, 
    ERC20WrapperUpgradeable, 
    PausableUpgradeable, 
    OwnableUpgradeable, 
    UUPSUpgradeable {

    uint256 constant SECONDS_PER_YEAR = 60 * 60 * 24 * 365;


    event balanceMutation(address account, uint256 balance);
    event queuedWithdrawalRequest(uint256 index); 
    event removedWithdrawalRequest(uint256 index); 


    struct AccountInfos {
        APRCheckpointReference depositCheckpointReference;  
        uint40 depositTimestamp;    // Allows representing datetime up to 20/02/36812
    }

    /**
     * Note that this struct doesn't represent how checkpoints are stored on-chain (see "Packed APR checkpoints" section of whitepaper). They are simply used as a high level return type of some functions to provide good DX and code readability. 
     */
    struct APRCheckpoint {
        uint16 aprUD3;
        uint40 timestamp;
    }

    struct APRCheckpointReference {   // Allows up to 1.84E18 packs of 4 cursors to be represented.
        uint64 packIndex;
        uint8 cursorIndex;
    }

    struct PackedAPRCheckpoints {
        uint16[4] aprsUD3;       // Allows representing up to 65.536% APR (3 digits of precision)
        uint40[4] timestamps; // Allows representing datetime up to 20/02/36812
        uint32 cursor;
    }
    struct WithdrawalRequest {
        address account;
        uint128 amount;
    }
    
    IERC20Upgradeable uContract;
    Blacklist blacklistContract;
    IERC20Upgradeable LTYStakingContract;
    address payable serverWallet;
    address payable fundWallet;

    uint256 feesRateUDS3;
    uint256 retentionRateUDS3;
    uint256 unclaimedFees;
    uint256 totalQueued;      // Holds the total amount of pending withdrawal requests.
    uint256 ltyTier1UD18;     // Holds the amount LTY to be staked to be elligible to tier 1 advantages
    uint256 fundBalance;      // Holds the amount of underlying tokens detained by the fund wallet (required as underlying tokens are not simply kept on the fund but are swapped against FIAT and so uContract.balanceOf(fundWallet) will never return the real amount of tokens sent to fund wallet)

    mapping(address => AccountInfos) accountsInfos;
    PackedAPRCheckpoints[] packedAPRCheckpoints;
    WithdrawalRequest[] withdrawalQueue;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address uAddress) initializer public {
        // Retrieve underlying token informations
        uContract = IERC20Upgradeable(uAddress);
        IERC20MetadataUpgradeable uMetadata = IERC20MetadataUpgradeable(uAddress);
        string memory uName = uMetadata.name();
        string memory uSymbol = uMetadata.symbol();

        // Build wrapper token informations
        string memory name = string(abi.encodePacked("Ledgity ", uName));
        string memory symbol = string(abi.encodePacked("L", uSymbol));

        // Initialize contract ancestors
        __ERC20_init(name, symbol);
        __ERC20Wrapper_init(uContract);
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

    function pause() public onlyOwner { 
        _pause(); 
    }

    function unpause() public onlyOwner { 
        _unpause(); 
    }

    function decimals () public override(ERC20Upgradeable, ERC20WrapperUpgradeable) view returns(uint8) { 
        return ERC20WrapperUpgradeable.decimals();
    }

    /**
     * This function converts a given UDx number (x = decimals()) into UDS3     
     */
    function scaleUp (uint256 n) public pure returns(uint256 nUDS3) {
        return n * 10**3;
    }

    /**
     * This function converts a given UDS3 number into UDx number (x = decimals())
     */
    function scaleDown (uint256 nUDS3) public pure returns(uint256 n) {
        return nUDS3 / 10**3;
    }

    /** This function converts a given unisgned integer into USD3 number */
    function toUDS3 (uint256 i) public view returns(uint256 iUDS3) {
        return scaleUp(i * 10**decimals());
    }

    modifier onlyServer () {
        require(msg.sender == serverWallet, "Only server can execute this function");
        _;
    }

    modifier onlyFund () {
        require(msg.sender == fundWallet, "Only fund can execute this function");
        _;
    }

    modifier forbidden () {
        revert("Forbidden");
        _;
    }

    modifier notBlacklisted() {
        require(blacklistContract.isBlacklisted(msg.sender) == false, "Account blacklisted");
        _;
    }

    function setServerWallet (address payable _serverWallet) public onlyOwner { 
        serverWallet = _serverWallet; 
    }

    function setFundWallet (address payable _fundWallet) public onlyOwner { 
        fundWallet = _fundWallet; 
    }

    /**
     * More infos about UD3, see: Whitepaper "Rates and UD3" section
     */
    function setFeesRate (uint256 _feesRateUD3) public onlyOwner {
        feesRateUDS3 = _feesRateUD3 * 10**decimals();
    }

    function setRetentionRate (uint256 _retentionRateUD3) public onlyOwner { 
        retentionRateUDS3 = _retentionRateUD3 * 10**decimals();
    }

    function setLTYStakingContract (address _contract) public onlyOwner {
        LTYStakingContract = IERC20Upgradeable(_contract);
    }
    
    function setLTYTier1UD18 (uint256 amountUD18) public onlyOwner {
        ltyTier1UD18 = amountUD18;
    }
    
    /**
     * This function allows updating the current APR. Under the hood it writes a new APR checkpoint.
     * For more details, see "APR checkpoints" and "Packed APR checkpoints" sections of whitepaper.
     * @param aprUD3 The new APR to write in UD3 format (3 digit fixed point number, e.g., 12.345% = 12345)
     */
    function setAPR (uint16 aprUD3) public onlyOwner {
        // Retrieve last written pack
        PackedAPRCheckpoints memory writtenPack = packedAPRCheckpoints[packedAPRCheckpoints.length - 1];

        // If the pack is full, or is the first pack, create a new pack
        if (writtenPack.cursor == 5 || writtenPack.cursor == 0) {
            packedAPRCheckpoints.push(PackedAPRCheckpoints({
                aprsUD3: [uint16(0),uint16(0),uint16(0),uint16(0)],
                timestamps: [uint40(0),uint40(0),uint40(0),uint40(0)],
                cursor: 1
            }));
            writtenPack = packedAPRCheckpoints[packedAPRCheckpoints.length - 1];
        }
        // Write the new checkpoint at current pack cursor
        writtenPack.aprsUD3[writtenPack.cursor] = aprUD3;
        writtenPack.timestamps[writtenPack.cursor] = uint40(block.timestamp);

        // Increment write cursor
        writtenPack.cursor++;

        // Store the updated pack
        packedAPRCheckpoints[packedAPRCheckpoints.length - 1] = writtenPack;
    }

    /**
    * This function returns the amount of underlying token that should be retained on the contract
    */
    function getExpectedRetainedUDS3 () public view returns (uint256 amountUDS3) {
        uint256 totalSupplyUDS3 = scaleUp(totalSupply());
        return totalSupplyUDS3 * retentionRateUDS3 / toUDS3(100);
    }

    function incrementCheckpointReference (APRCheckpointReference memory ref) public pure returns (APRCheckpointReference memory) {
        if (ref.cursorIndex != 5) ref.cursorIndex++;
        else ref.packIndex++;
        return ref;
    }

    function getCheckpointFromReference (APRCheckpointReference memory ref) public view returns (APRCheckpoint memory checkpoint) {
        PackedAPRCheckpoints memory pack = packedAPRCheckpoints[ref.packIndex];
        return APRCheckpoint({
            aprUD3: pack.aprsUD3[ref.cursorIndex],
            timestamp: pack.timestamps[ref.cursorIndex]
        });
    }

    function getLatestCheckpointReference () public view returns (APRCheckpointReference memory) {
        uint256 latestPackIndex = packedAPRCheckpoints.length - 1;
        uint16 latestWrittenCursor = uint16(packedAPRCheckpoints[latestPackIndex].cursor - 1);
        return APRCheckpointReference({
            packIndex: uint64(latestPackIndex),
            cursorIndex: uint8(latestWrittenCursor)
        });
    }

    /**
     * This function calculates the rewards for a given deposited amount, from a given period of time and APR.
     */
    function calculatePeriodRewards (uint40 beginTimestamp, uint40 endTimestamp, uint16 aprUD3, uint256 amount) public view returns (uint256 rewards) {
        // Calculate elapsed years as UDS3 number
        uint256 elapsedTimeUDS3 = toUDS3(endTimestamp - beginTimestamp);
        uint256 secondsPerYearUDS3 = toUDS3(SECONDS_PER_YEAR);
        uint256 elapsedYearsUDS3 = elapsedTimeUDS3 * toUDS3(1) / secondsPerYearUDS3;
        
        // Calculate amount growth as UDS3 number
        uint256 aprUDS3 = aprUD3 * 10**decimals(); // See: "Rates and UD3" section of whitepaper
        uint256 rewardsRateUDS3 = elapsedYearsUDS3 * aprUDS3 / toUDS3(1);

        // Calculate rewards as UDS3 number and return it scaled down
        uint256 amountUDS3 = scaleUp(amount);
        uint256 rewardsUDS3 = amountUDS3 * rewardsRateUDS3 / toUDS3(100);
        return scaleDown(rewardsUDS3);
    }

    /**
     * This function calculates the current unclaimed rewards of a given account.
     * @param account The account to calculate the rewards of.
     */
    function rewardsOf (address account) public view returns(uint256 rewards) {
        // Retrieve account infos and deposited amount
        AccountInfos memory infos = accountsInfos[account];
        uint256 depositedAmount = realBalanceOf(account);
        

        // Initialize the current processed checkpoint's reference with the account deposit checkpoint reference
        APRCheckpointReference memory ref = infos.depositCheckpointReference;
        APRCheckpoint memory checkpoint = getCheckpointFromReference(ref);
        checkpoint.timestamp = infos.depositTimestamp;
        
        // Initialize rewards with the unclaimed rewards, and loop through all checkpoints the account has traversed
        rewards = 0;
        while (true) {
            // Retrieve next checkpoint reference and data
            APRCheckpointReference memory nextRef = incrementCheckpointReference(ref);
            APRCheckpoint memory nextCheckpoint = getCheckpointFromReference(nextRef);

            // If the next checkpoint is empty, break the loop.
            if (nextCheckpoint.timestamp == 0) break;

            // Calculate rewards for the period and add it to the total rewards
            rewards += calculatePeriodRewards(checkpoint.timestamp, nextCheckpoint.timestamp, checkpoint.aprUD3, depositedAmount);

            // Increment the checkpoint reference
            (ref, checkpoint) = (nextRef, nextCheckpoint);
        }

        // Calculate rewards for the unbounded period (last checkpoint)
        rewards += calculatePeriodRewards(checkpoint.timestamp, uint40(block.timestamp), checkpoint.aprUD3, depositedAmount);
    }

    function balanceOf (address account) public view override returns (uint256) {
        return realBalanceOf(account) + rewardsOf(account);
    }

    function realBalanceOf (address account) public view returns (uint256) {
        return super.balanceOf(account);
    }

    function resetInvestmentPeriodOf (address account) internal {
        // Mint all rewards accumulated up to there
        _mint(account, rewardsOf(account));

        // Reset deposit timestamp to current block timestamp and checkpoint reference to the latest one
        accountsInfos[account].depositTimestamp = uint40(block.timestamp);
        accountsInfos[account].depositCheckpointReference = getLatestCheckpointReference();

        // As this function is called before any balance mutation (transfer, deposit, withdraw), emit mutation event
        emit balanceMutation(account, balanceOf(account));
    }
 
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal whenNotPaused notBlacklisted override {
        // Call parent function
        super._beforeTokenTransfer(from, to, amount);

        // If this is a wallet to wallet transfer and not a burn or a mint
        // See: https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20-_beforeTokenTransfer-address-address-uint256-
        if (from != address(0) && to != address(0)) {

            // Ensure the fundWallet uses the fundContract() method to fund contract
            require(from != fundWallet && to != address(this), "Fund wallet should use fundContract() method to deposit funds on this contract");

            // Reset investment period of both sender and recipient
            resetInvestmentPeriodOf(from);
            resetInvestmentPeriodOf(to);
        }
    }

    /**
     * Override of ERC20Wrapper.depositFor() method 
     */
    function depositFor(address account, uint256 amount) public override whenNotPaused notBlacklisted returns(bool) {
        // Reset investment period of account
        resetInvestmentPeriodOf(account);

        // Receive deposited underlying token and mint L-Token to the account in a 1:1 ratio
        super.depositFor(account, amount);

        // Retrieve current and expected retained amounts of underlying tokens as SDS3 numbers
        int256 expectedRetainedSDS3 = int256(getExpectedRetainedUDS3());
        int256 currentlyRetainedSDS3 = int256(scaleUp(uContract.balanceOf(address(this))));

        // Calculate the difference between the expected and current amount of underlying on the contract
        int256 differenceSDS3 = expectedRetainedSDS3 - currentlyRetainedSDS3;

        // Scale up deposited amount to UDS3
        uint256 amountUDS3 = scaleUp(amount);

        // If some underlying tokens are missing 
        if (differenceSDS3 > 0) {

            // If the deposited amount is greater than the difference, keep only missing tokens on contract and transfer the rest to fund wallet
            if (amountUDS3 > uint256(differenceSDS3)) {
                uint256 transferredAmount = amount - uint256(differenceSDS3);
                uContract.transfer(fundWallet, transferredAmount);
                fundBalance += transferredAmount;
            }
            // Else, do nothing (i.e., keep the whole deposited amount on the contract)
        }
        // Else, transfer the whole deposited amount to fund wallet
        else {
            uContract.transfer(fundWallet, amount);
            fundBalance += amount;
        } 

        // Returns true as required by the overriden parent function.
        // See: https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Wrapper-depositFor-address-uint256-
        return true;
    }

    function _withdrawTo (address account, uint256 amount) internal returns(bool) {
        // Reset investment period of account
        resetInvestmentPeriodOf(account);

        // Convert amount to UDS3
        uint256 amountUDS3 = scaleUp(amount);

        // Calculate fees and update the amount of unclaimed fees;
        uint256 feesUDS3 = amountUDS3 * feesRateUDS3 / toUDS3(100);
        uint256 fees = scaleDown(feesUDS3);
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
     * Forbidden override of withdrawTo() method to prevent any public usage. Use _withdrawTo internally instead.
     */
    
    function withdrawTo(address account, uint256 amount) public override forbidden returns(bool) {}

    function emitWithdrawalRequest (uint256 amount) public payable whenNotPaused notBlacklisted {
        // Ensure the account has enough funds to withdraw
        require(amount <= balanceOf(msg.sender), "You don't have enough fund to withdraw");

        // Ensure the sender attached pre-paid queue fees and forward them to server wallet
        require(msg.value != 0.005 * 10**18, "You must attach 0.005 ETH to the request");
        serverWallet.transfer(msg.value);

        // Retrieve the current amount of underlying tokens on the contract
        uint256 uBalance = uContract.balanceOf(address(this));

        // If there is enough funds to cover requests in queue + the current request, process to withdrawal
        if (totalQueued + amount <= uBalance) _withdrawTo(msg.sender, amount);

        // Else if there is enough funds to cover the current request and the sender has staked more than 200k LTY
        // TODO: Uncomment this line when LTYStakingContract is available
        //else if (amount <= uBalance && LTYStakingContract.stakeOf(msg.sender) > ltyTier1UD18) _withdrawTo(msg.sender, amount);
        
        // Else burn accounts tokens and put the request in queue
        else {
            _burn(msg.sender, amount);
            withdrawalQueue.push(WithdrawalRequest({
                account: msg.sender,
                amount: uint120(amount)
            }));
            totalQueued += amount;
            emit queuedWithdrawalRequest(withdrawalQueue.length - 1);
        }
    }

    function removeWithdrawalRequest (uint256 requestId) public whenNotPaused notBlacklisted {
        // Retrieve request and ensure it belongs to sender
        WithdrawalRequest memory request = withdrawalQueue[requestId];
        require(request.account == msg.sender, "This withdrawal request doesn't belong to you");

        // Send back L-Tokens to account
        _mint(msg.sender, uint256(request.amount));

        // Remove requested amount from the total amount in queue
        totalQueued -= request.amount;

        // Delete the withdrawal request from queue
        delete withdrawalQueue[requestId];

        // Finally emit an event to notify the request removal
        emit removedWithdrawalRequest(requestId);

    }

    function processWithdrawalRequest(uint256 requestId) public onlyServer whenNotPaused notBlacklisted {
        // Retrieve request and ensure it exists and has not been processed yet or cancelled
        WithdrawalRequest memory request = withdrawalQueue[requestId];

        // Mint back L-Tokens to account + remove withdrawal requests
        removeWithdrawalRequest(requestId);

        // Proceed to withdrawal by sending the requested amount to request's account
        _withdrawTo(request.account, request.amount);
    }


    /**
     * This function allows fund wallet to fund this contract while protecting from exceeding the current retention rate.
     * This protects from accidentally transfering more funds than expected to the contract.
     */
    function fundContract (uint256 amount) public onlyFund whenNotPaused {
        // Calculate new balance
        uint256 newBalance = uContract.balanceOf(address(this)) + amount;

        // Ensure the new balance doesn't exceed the retention rate
        require(newBalance <= scaleDown(getExpectedRetainedUDS3()), "Retained underlying limit exceeded");

        // Substract the amount from the fund balance
        fundBalance -= amount;

        // Transfer funds to contract
        uContract.transferFrom(msg.sender, address(this), amount);
    }

    function claimFees () public onlyOwner {
        resetInvestmentPeriodOf(msg.sender);
        _mint(msg.sender, unclaimedFees);
        unclaimedFees = 0;
    }

    /*
        A positive returned amount means that the contract have received more underlying tokens than the deposited amount (e.g. error transfer)
        A negative returned amount means that the contract has minted more wrapper token than the amount deposited on it (e.g. contract breach)
        - The result of this function should be monitored and the contract paused if at some point the value became negative.
    // */
    function getDifference () public view returns (int256 difference) {
        difference = int256(totalSupply()) + int256(unclaimedFees) - int256(uContract.balanceOf(address(this))) - int256(fundBalance) ;
    }

    function recoverUnderlying () public onlyOwner {
        int256 difference = getDifference();
        if (difference > 0) uContract.transfer(owner(), uint256(difference));
        else revert("There is nothing to recover.");
    }

    function recoverToken (address tokenAddress) public onlyOwner {
        // Ensure the recoverUnderlying() method is used to recover underlying tokens
        require(tokenAddress != address(uContract), "Use recoverUnderlying() to recover underlying tokens instead");
        
        // Retrieve token contract
        ERC20Upgradeable tokenContract = ERC20Upgradeable(tokenAddress);

        // Retrieve the amount of token held by this contract
        uint256 availableTokens = tokenContract.balanceOf(address(this));

        // If the contract detains some tokens, transfer them to owner wallet
        if (availableTokens > 0) tokenContract.transfer(msg.sender, availableTokens);
        else revert("There is nothing to recover.");
    }

    function recoverEthers () public onlyOwner {
        uint256 availableEth = address(this).balance;
        if (availableEth > 0) payable(msg.sender).transfer(availableEth);
        else revert("There is nothing to recover.");
    }
}

