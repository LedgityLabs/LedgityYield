// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

// Contracts
import { CCIPToken } from "./misc/CCIPToken.sol";
import { GlobalOwnableUpgradeable } from "./abstracts/GlobalOwnableUpgradeable.sol";
import { GlobalPausableUpgradeable } from "./abstracts/GlobalPausableUpgradeable.sol";
import { GlobalRestrictableUpgradeable } from "./abstracts/GlobalRestrictableUpgradeable.sol";
import { RecoverableUpgradeable } from "./abstracts/RecoverableUpgradeable.sol";
//
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

// Interfaces
import { ILToken } from "./interfaces/ILToken.sol";
import { IWrappedLToken } from "./interfaces/IWrappedLToken.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// ======== ERRORS ======== //
error WrapZeroAmount();
error InsufficientBalance(uint256 amount);
error BaseRateCannotBeLessThanOne();
error WrapUnwrapPaused();

/**
 * @title WrappedLToken
 * @notice A non-rebasing wrapper for LToken that tracks growth through an exchange rate
 * @dev This contract wraps an LToken and provides a non-rebasing representation where
 *      the growth is tracked through an exchange rate rather than balance increases
 */
contract WrappedLToken is
  IWrappedLToken,
  ERC20Upgradeable,
  GlobalOwnableUpgradeable,
  GlobalPausableUpgradeable,
  GlobalRestrictableUpgradeable,
  RecoverableUpgradeable,
  CCIPToken
{
  // ======== LIBS ======== //
  using SafeERC20 for IERC20;

  // ======== STORAGE ======== //

  // The underlying LToken being wrapped
  ILToken public lToken;

  // The initial exchange rate of the wrapped token in Ray (27 decimals)
  uint256 public baseRate = 1e27;

  // Checkpoint for rate calculations
  struct LastRateCheckpoint {
    uint256 timestamp; // When this checkpoint was created
    uint256 apr; // The exchange rate at this checkpoint
  }

  // Last recorded checkpoint
  LastRateCheckpoint public lastCheckpoint;

  // ======== EVENTS ======== //

  event RateCheckpointUpdated(uint256 newRate, uint16 newAPRUD7x3);
  event WrapUnwrapPausedSet(bool isPaused);

  // ======== INITIALIZE ======== //

  /**
   * @notice Initializes the WrappedLToken contract
   * @param globalOwner_ The address of the global owner
   * @param globalPause_ The address of the global pause controller
   * @param globalBlacklist_ The address of the global blacklist controller
   * @param lTokenAddr_ Address of the LToken to wrap
   * @param name_ Name for the wrapped token
   * @param symbol_ Symbol for the wrapped token
   */
  function initialize(
    address globalOwner_,
    address globalPause_,
    address globalBlacklist_,
    address lTokenAddr_,
    string memory name_,
    string memory symbol_
  ) public initializer {
    __ERC20_init(name_, symbol_);
    __GlobalOwnable_init(globalOwner_);
    __GlobalPausable_init(globalPause_);
    __GlobalRestrictable_init(globalBlacklist_);
    __Recoverable_init(address(this));

    lToken = ILToken(lTokenAddr_);

    // Initialize the first checkpoint
    updateRateCheckpoint();
  }

  // ======== VIEW ======== //

  /**
   * @notice Get the current exchange rate between wrapped tokens and LTokens
   * @return compoundedRate The exchange rate in ray (27 decimals)
   */
  function exchangeRate()
    public
    view
    returns (uint256 compoundedRate)
  {
    compoundedRate = baseRate;

    // Time elapsed since last checkpoint
    uint256 timeElapsed = block.timestamp - lastCheckpoint.timestamp;

    // Calculate number of full days elapsed
    uint256 fullDays = timeElapsed / 1 days;
    uint256 remainingTime = timeElapsed % 1 days;

    // Daily rate = APR / 365
    uint256 dailyRatio = lastCheckpoint.apr / 365;

    // Apply daily compounding for full days
    for (uint256 i = 0; i < fullDays; i++) {
      compoundedRate = (compoundedRate * (1e27 + dailyRatio)) / 1e27;
    }

    // Add remaining time linearly without compounding
    if (remainingTime > 0) {
      // Calculate the partial day ratio: (APR * remainingTime) / (365 days)
      uint256 remainingRatio = (lastCheckpoint.apr * remainingTime) /
        (365 days);
      compoundedRate =
        (compoundedRate * (1e27 + remainingRatio)) /
        1e27;
    }

    return compoundedRate;
  }

  /**
   * @notice Convert wrapped token amount to LToken amount
   * @param wrappedAmount The amount of wrapped tokens to convert
   * @return lTokenAmount_ The amount of LTokens that would be received
   */
  function toRebasingAmount(
    uint256 wrappedAmount
  ) public view returns (uint256) {
    return (wrappedAmount * exchangeRate()) / 1e27;
  }

  /**
   * @notice Convert LToken amount to wrapped token amount
   * @param lTokenAmount The amount of LTokens to wrap
   * @return wrappedAmount_ The amount of wrapped tokens that would be received
   */
  function toWrappedAmount(
    uint256 lTokenAmount
  ) public view returns (uint256) {
    return (lTokenAmount * 1e27) / exchangeRate();
  }

  /**
   * @notice Returns the total amount of LTokens held by this contract
   */
  function totalLTokenBalance() external view returns (uint256) {
    return lToken.balanceOf(address(this));
  }

  // ======== HELPERS ======== //

  /**
   * @notice Updates the rate checkpoint with current APR and rate
   * @dev This should be called whenever the APR changes
   */
  function updateRateCheckpoint() public {
    uint16 lTokenApr = lToken.getAPR();

    // Only update if APR changed
    if (lTokenApr != lastCheckpoint.apr) {
      // Calculate the new base rate including all accumulated rewards
      baseRate = exchangeRate();

      lastCheckpoint = LastRateCheckpoint({
        timestamp: block.timestamp,
        apr: (lTokenApr * 1e27) / 1000
      });

      emit RateCheckpointUpdated(baseRate, lTokenApr);
    }
  }

  // ======== DEPOSIT AND WRAP ======== //

  /**
   * @notice Deposits underlying tokens into LToken and wraps the received LTokens
   * @param underlyingAmount The amount of underlying tokens to deposit
   */
  function depositAndWrap(
    uint256 underlyingAmount
  ) external whenNotPaused notBlacklisted(_msgSender()) {
    if (underlyingAmount == 0) revert WrapZeroAmount();

    // Get the underlying token from the LToken contract
    IERC20 underlying = IERC20(lToken.underlying());

    // Transfer underlying tokens from user to this contract
    underlying.safeTransferFrom(
      msg.sender,
      address(this),
      underlyingAmount
    );

    // Approve LToken to spend the underlying tokens
    underlying.safeApprove(address(lToken), underlyingAmount);

    // Deposit underlying tokens into LToken to get LTokens
    lToken.deposit(underlyingAmount);

    // Now wrap the received LTokens
    _wrap(underlyingAmount, msg.sender);
  }

  /**
   * @notice Deposits underlying tokens into LToken and wraps the received LTokens, sending them to a specified address
   * @param underlyingAmount The amount of underlying tokens to deposit
   * @param to The recipient of the wrapped tokens
   */
  function depositAndWrap(
    uint256 underlyingAmount,
    address to
  ) external whenNotPaused notBlacklisted(_msgSender()) {
    if (underlyingAmount == 0) revert WrapZeroAmount();

    // Get the underlying token from the LToken contract
    IERC20 underlying = IERC20(lToken.underlying());

    // Transfer underlying tokens from user to this contract
    underlying.safeTransferFrom(
      msg.sender,
      address(this),
      underlyingAmount
    );

    // Approve LToken to spend the underlying tokens
    underlying.safeApprove(address(lToken), underlyingAmount);

    // Deposit underlying tokens into LToken to get LTokens
    lToken.deposit(underlyingAmount);

    // Now wrap the received LTokens and send them to the specified address
    _wrap(underlyingAmount, to);
  }

  // ======== WRAP ======== //

  /**
   * @notice Wraps LTokens and receives wrapped tokens
   * @param lTokenAmount The amount of LTokens to wrap
   * @return wrappedAmount_ The amount of wrapped tokens received
   */
  function wrap(
    uint256 lTokenAmount
  )
    external
    whenNotPaused
    notBlacklisted(_msgSender())
    returns (uint256 wrappedAmount_)
  {
    return _wrap(lTokenAmount, msg.sender);
  }

  /**
   * @notice Wraps LTokens and sends wrapped tokens to a specified address
   * @param lTokenAmount The amount of LTokens to wrap
   * @param to The recipient of the wrapped tokens
   * @return wrappedAmount_ The amount of wrapped tokens received
   */
  function wrap(
    uint256 lTokenAmount,
    address to
  )
    external
    whenNotPaused
    notBlacklisted(_msgSender())
    returns (uint256 wrappedAmount_)
  {
    return _wrap(lTokenAmount, to);
  }

  // ======== UNWRAP ======== //

  /**
   * @notice Unwraps tokens back to LTokens
   * @param wrappedAmount The amount of wrapped tokens to unwrap
   * @return lTokenAmount_ The amount of LTokens received
   */
  function unwrap(
    uint256 wrappedAmount
  )
    external
    whenNotPaused
    notBlacklisted(_msgSender())
    returns (uint256 lTokenAmount_)
  {
    return _unwrap(wrappedAmount, msg.sender);
  }

  /**
   * @notice Unwraps tokens and sends LTokens to a specified address
   * @param wrappedAmount The amount of wrapped tokens to unwrap
   * @param to The recipient of the LTokens
   * @return lTokenAmount_ The amount of LTokens received
   */
  function unwrap(
    uint256 wrappedAmount,
    address to
  )
    external
    whenNotPaused
    notBlacklisted(_msgSender())
    returns (uint256 lTokenAmount_)
  {
    return _unwrap(wrappedAmount, to);
  }

  // ======== INTERNAL ======== //

  /**
   * @notice Internal function to handle wrapping LTokens
   * @param lTokenAmount The amount of LTokens to wrap
   * @param to The recipient of the wrapped tokens
   * @return wrappedAmount_ The amount of wrapped tokens received
   */
  function _wrap(
    uint256 lTokenAmount,
    address to
  ) internal returns (uint256 wrappedAmount_) {
    if (lTokenAmount == 0) revert WrapZeroAmount();
    if (lToken.balanceOf(msg.sender) < lTokenAmount) {
      revert InsufficientBalance(lTokenAmount);
    }

    // Update rate checkpoint before any operation that changes balances
    updateRateCheckpoint();

    // Calculate wrapped amount using updated rate
    wrappedAmount_ = toWrappedAmount(lTokenAmount);

    _mint(to, wrappedAmount_);

    lToken.transferFrom(msg.sender, address(this), lTokenAmount);

    emit Wrap(msg.sender, to, lTokenAmount, wrappedAmount_);
  }

  /**
   * @notice Internal function to handle unwrapping tokens
   * @param wrappedAmount The amount of wrapped tokens to unwrap
   * @param to The recipient of the LTokens
   * @return lTokenAmount_ The amount of LTokens received
   */
  function _unwrap(
    uint256 wrappedAmount,
    address to
  ) internal returns (uint256 lTokenAmount_) {
    if (wrappedAmount == 0) revert WrapZeroAmount();
    if (wrappedAmount > balanceOf(msg.sender))
      revert InsufficientBalance(wrappedAmount);

    // Update rate checkpoint before any operation that changes balances
    updateRateCheckpoint();

    // Calculate LToken amount using updated rate
    lTokenAmount_ = toRebasingAmount(wrappedAmount);

    _burn(msg.sender, wrappedAmount);

    lToken.transfer(to, lTokenAmount_);

    emit Unwrap(msg.sender, to, wrappedAmount, lTokenAmount_);
  }

  // ======== ADMIN ======== //

  /**
   * @notice Updates the base rate
   * @param newRate The new base rate in ray (27 decimals)
   */
  function updateBaseRate(uint256 newRate) public onlyOwner {
    if (newRate < 1e27) revert BaseRateCannotBeLessThanOne();
    baseRate = newRate;
  }

  /**
   * @notice Recovers a specified amount of a given token address.
   * @dev This override of RecoverableUpgradeable.recoverERC20() prevents the recovered
   * token from being the underlying token.
   * @inheritdoc RecoverableUpgradeable
   */
  function recoverERC20(
    address tokenAddress,
    uint256 amount
  ) public override onlyOwner {
    if (tokenAddress == address(0)) {
      payable(msg.sender).transfer(amount);
    } else {
      super.recoverERC20(tokenAddress, amount);
    }
  }
}
