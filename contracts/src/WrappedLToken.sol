// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

// Contracts
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import { GlobalOwnableUpgradeable } from "./abstracts/GlobalOwnableUpgradeable.sol";
import { GlobalPausableUpgradeable } from "./abstracts/GlobalPausableUpgradeable.sol";
import { GlobalRestrictableUpgradeable } from "./abstracts/GlobalRestrictableUpgradeable.sol";
import { RecoverableUpgradeable } from "./abstracts/RecoverableUpgradeable.sol";

// Interfaces
import { ILToken } from "./interfaces/ILToken.sol";
import { IWrappedLToken } from "./interfaces/IWrappedLToken.sol";
import { IGetCCIPAdmin } from "./external/interfaces/IGetCCIPAdmin.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

// Errors
error WrapZeroAmount();
error InsufficientBalance(uint256 amount);

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
  RecoverableUpgradeable
{
  using SafeERC20 for IERC20;

  // The underlying LToken being wrapped
  ILToken public lToken;

  // Total amount of underlying LTokens held by this contract
  uint256 private _totalUnderlyingHeld;

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
  }

  /**
   * @notice Get the current exchange rate between wrapped tokens and LTokens
   * @return The exchange rate in ray (27 decimals)
   */
  function exchangeRate() public view returns (uint256) {
    if (_totalUnderlyingHeld == 0 || totalSupply() == 0) return 1e27; // 1.0 in ray
    return ((_totalUnderlyingHeld * 1e27) / totalSupply());
  }

  /**
   * @notice Returns the total amount of LTokens held by this contract
   */
  function totalLTokenBalance() external view returns (uint256) {
    return _totalUnderlyingHeld;
  }

  /**
   * @notice Wraps LTokens and receives wrapped tokens
   * @param lTokenAmount The amount of LTokens to wrap
   * @return wrappedAmount_ The amount of wrapped tokens received
   */
  function wrap(
    uint256 lTokenAmount
  ) external returns (uint256 wrappedAmount_) {
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
  ) external returns (uint256 wrappedAmount_) {
    return _wrap(lTokenAmount, to);
  }

  /**
   * @notice Unwraps tokens back to LTokens
   * @param wrappedAmount The amount of wrapped tokens to unwrap
   * @return lTokenAmount_ The amount of LTokens received
   */
  function unwrap(
    uint256 wrappedAmount
  ) external returns (uint256 lTokenAmount_) {
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
  ) external returns (uint256 lTokenAmount_) {
    return _unwrap(wrappedAmount, to);
  }

  /**
   * @notice Preview the amount of wrapped tokens that would be received for a given amount of LTokens
   * @param lTokenAmount The amount of LTokens to wrap
   * @return wrappedAmount_ The amount of wrapped tokens that would be received
   */
  function previewWrap(
    uint256 lTokenAmount
  ) external view returns (uint256 wrappedAmount_) {
    if (lTokenAmount == 0) return 0;
    wrappedAmount_ = (lTokenAmount * 1e27) / exchangeRate();
  }

  /**
   * @notice Preview the amount of LTokens that would be received for a given amount of wrapped tokens
   * @param wrappedAmount The amount of wrapped tokens to unwrap
   * @return lTokenAmount_ The amount of LTokens that would be received
   */
  function previewUnwrap(
    uint256 wrappedAmount
  ) external view returns (uint256 lTokenAmount_) {
    if (wrappedAmount == 0) return 0;
    lTokenAmount_ = (wrappedAmount * exchangeRate()) / 1e27;
  }

  /**
   * @notice Deposits underlying tokens into LToken and wraps the received LTokens
   * @param underlyingAmount The amount of underlying tokens to deposit
   */
  function depositAndWrap(uint256 underlyingAmount) external {
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
  ) external {
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

    uint256 balance = lToken.balanceOf(msg.sender);
    if (lTokenAmount > balance) {
      revert InsufficientBalance(lTokenAmount);
    }

    wrappedAmount_ = (lTokenAmount * 1e27) / exchangeRate();

    _totalUnderlyingHeld += lTokenAmount;
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

    lTokenAmount_ = (wrappedAmount * exchangeRate()) / 1e27;

    _burn(msg.sender, wrappedAmount);
    _totalUnderlyingHeld -= lTokenAmount_;

    lToken.transfer(to, lTokenAmount_);

    emit Unwrap(msg.sender, to, wrappedAmount, lTokenAmount_);
  }
}
