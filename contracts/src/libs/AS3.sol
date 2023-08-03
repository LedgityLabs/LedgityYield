// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC20MetadataUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";

/**
 * @title AS3
 * @author Lila Rest (lila@ledgity.com)
 * @custom:security-contact security@ledgity.com
 * @notice
 *
 * This codebase uses UD (unsigned fixed-point decimals) numbers to represent both
 * percentage rates and tokens amounts.
 *
 * Rates are represented as UD7x3 numbers while the number of decimals of tokens amount
 * varies from one token to another.
 *
 * As it is required that values computed together have the same number of decimals, the
 * rates' decimals number are scaled up to token amounts ones before calculations.
 *
 * However, if the number of decimals of a token amount is lower than 3, it would lead to
 * shrinking 1, 2 or 3 decimals of the rate amount, which would result in a direct loss
 * of precision.
 *
 * This library provides utilities to prevent loss of precision while performing
 * calculations that may involves fixed-point token amounts with low number of decimals.
 *
 * Note that this library may also be used to reduce precision loss while performing
 * consecutive calculations including divisions.
 *
 * @dev Number types definitions:
 *
 * - Integer: A number without decimals (e.g. block.timestamp)
 *
 * - Amount: An unsigned fixed-point number with an unknown (at writing time) repartition
 *           of digits (integral/fractional parts). Represents a token amount.
 *
 * - Rate: An unsigned fixed-point number with 7 integral digits and 3 fractional ones.
 *         (a.k.a UD7x3). Represents a percentage rate.
 *
 * - AS3: An UD token Amount Scaled by 3 decimals (AS3) (* 10^3). Used as an intermediate
 *        format to perform lossless calculations when dealing with token amounts that may
 *        have a low number of decimals (<3).
 *
 * This UD nomenclature is inspired from libraries like [prb-math](https://github.com/PaulRBerg/prb-math/).
 *
 * @dev What does this library achieve?
 * This library provides utilities to perform the following conversions:
 * - Rate (UD7x3) <--> AS3
 * - Amount       <--> AS3
 * - Integer      <--> AS3
 *
 * @dev Functions aren't made external because they are so minimal that including
 * those directly in contracts produce less bytecode than the bytecode required to
 * perform delegatecalls if those were external.
 *
 * @dev For further details, see "AS3" section of whitepaper.
 */
library AS3 {
    /**
     * @notice Retrieves decimals number of the given ERC20 contract address.
     * @param tokenAddress The address to retrieve decimals number from.
     * @return decimals The decimals number of the given ERC20 contract address.
     */
    function decimalsOf(address tokenAddress) internal view returns (uint256 decimals) {
        return IERC20MetadataUpgradeable(tokenAddress).decimals();
    }

    /**
     * @notice Converts a given UD7x3 rate into AS3 format.
     * @dev UD7x3 have the interesting property of being convertible into AS3 format by
     * scaling them up by the token decimals number. See "AS3" section of whitepaper.
     * @param nUD7x3 The UD7x3 rate to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return nAS3 The rate in AS3 format.
     */
    function fromRate(uint256 nUD7x3, uint256 decimals) internal pure returns (uint256 nAS3) {
        return nUD7x3 * 10 ** decimals;
    }

    /**
     * @notice Converts a given AS3 number into a UD7x3 rate.
     * @dev AS3 have the interesting property of being convertible into UD7x3 rate by
     * scaling them down by the token decimals number. See "AS3" section of whitepaper.
     * @param nAS3 The AS3 number to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return nUD7x3 The number in UD7x3 rate format.
     */
    function toRate(uint256 nAS3, uint256 decimals) internal pure returns (uint256 nUD7x3) {
        return nAS3 / 10 ** decimals;
    }

    /**
     * @notice Convert a given token amount into AS3 format.
     * @param nAmount The token amount to convert.
     * @return nAS3 The amount in AS3 format
     */
    function fromAmount(uint256 nAmount) internal pure returns (uint256 nAS3) {
        return nAmount * 10 ** 3;
    }

    /**
     * @notice Convert a given AS3 amount into token amount format.
     * @param nAS3 The AS3 amount to convert.
     * @return nAmount The amount in decimals format
     */
    function toAmount(uint256 nAS3) internal pure returns (uint256 nAmount) {
        return nAS3 / 10 ** 3;
    }

    /**
     * @notice Converts a given integer into AS3 format.
     * @param n The integer to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return nAS3 The integer in AS3 format.
     */
    function fromInt(uint256 n, uint256 decimals) internal pure returns (uint256 nAS3) {
        return toRate(toAmount(n), decimals);
    }

    /**
     * @notice Converts a given AS3 number as an integer (all decimals shrinked).
     * @param nAS3 The AS3 number to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return n The number as an integer.
     */
    function toInt(uint256 nAS3, uint256 decimals) internal pure returns (uint256 n) {
        return fromRate(fromAmount(nAS3), decimals);
    }
}
