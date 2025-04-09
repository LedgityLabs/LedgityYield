// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { IERC20MetadataUpgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import { IERC20PermitUpgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-IERC20PermitUpgradeable.sol";
import { LToken } from "../LToken.sol";

/**
 * @title IWrappedLToken Interface
 * @notice Interface for the Wrapped LToken that provides a non-rebasing representation
 */
interface IWrappedLToken is
  IERC20MetadataUpgradeable,
  IERC20PermitUpgradeable
{
  error InsufficientBalance(uint256 requested);
  error WrapZeroAmount();

  event Wrap(
    address indexed from,
    address indexed to,
    uint256 lTokenAmount,
    uint256 wrappedAmount
  );
  event Unwrap(
    address indexed from,
    address indexed to,
    uint256 wrappedAmount,
    uint256 lTokenAmount
  );

  /**
   * @notice Returns the address of the underlying LToken
   */
  function lToken() external view returns (LToken);

  /**
   * @notice Wraps LTokens into wrapped tokens
   * @param lTokenAmount The amount of LTokens to wrap
   * @return wrappedAmount_ The amount of wrapped tokens received
   */
  function wrap(
    uint256 lTokenAmount
  ) external returns (uint256 wrappedAmount_);

  /**
   * @notice Wraps LTokens and sends wrapped tokens to a specified address
   * @param lTokenAmount The amount of LTokens to wrap
   * @param to The address to receive the wrapped tokens
   * @return wrappedAmount_ The amount of wrapped tokens received
   */
  function wrap(
    uint256 lTokenAmount,
    address to
  ) external returns (uint256 wrappedAmount_);

  /**
   * @notice Unwraps tokens back to LTokens
   * @param wrappedAmount The amount of wrapped tokens to unwrap
   * @return lTokenAmount_ The amount of LTokens received
   */
  function unwrap(
    uint256 wrappedAmount
  ) external returns (uint256 lTokenAmount_);

  /**
   * @notice Unwraps tokens and sends LTokens to a specified address
   * @param wrappedAmount The amount of wrapped tokens to unwrap
   * @param to The address to receive the LTokens
   * @return lTokenAmount_ The amount of LTokens received
   */
  function unwrap(
    uint256 wrappedAmount,
    address to
  ) external returns (uint256 lTokenAmount_);

  /**
   * @notice Previews the amount of wrapped tokens that would be received for a given amount of LTokens
   * @param lTokenAmount The amount of LTokens to wrap
   * @return wrappedAmount_ The estimated amount of wrapped tokens that would be received
   */
  function previewWrap(
    uint256 lTokenAmount
  ) external view returns (uint256 wrappedAmount_);

  /**
   * @notice Previews the amount of LTokens that would be received for a given amount of wrapped tokens
   * @param wrappedAmount The amount of wrapped tokens to unwrap
   * @return lTokenAmount_ The estimated amount of LTokens that would be received
   */
  function previewUnwrap(
    uint256 wrappedAmount
  ) external view returns (uint256 lTokenAmount_);

  /**
   * @notice Returns the current exchange rate between wrapped tokens and LTokens
   * @return The current exchange rate in ray (27 decimals)
   */
  function exchangeRate() external view returns (uint256);

  /**
   * @notice Returns the total amount of underlying LTokens held by the contract
   */
  function totalLTokenBalance() external view returns (uint256);
}
