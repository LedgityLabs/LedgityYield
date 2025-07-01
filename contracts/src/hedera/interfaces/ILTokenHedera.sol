// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { ILToken } from "../../interfaces/ILToken.sol";

/**
 * @title ILTokenHedera
 * @notice Interface for the LTokenHedera contract, which powers the Ledgity Yield protocol's L-Tokens
 */
interface ILTokenHedera is ILToken {
  /**
   * @notice Returns whether the underlying token is an HTS token
   */
  function isHtsUnderlying() external view returns (bool);
}
