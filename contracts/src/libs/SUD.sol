// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC20MetadataUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";

/**
 * @title SUD
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com
 * @notice
 *
 * This codebase uses UD (unsigned fixed-point decimals) numbers to represent both
 * percentage rates and tokens amounts.
 *
 * Rates are represented as UD7x3 numbers while token amount format varies with the
 * number of decimals of the involved tokens.
 *
 * As values computed together must be in the same fixed-point format, rates, amounts
 * and integers cannot be computed together directly without converting them before
 * to a common decimals number.
 *
 * Also, performing consecutive calculations on UD numbers that involve divisions,
 * often results in a cumulated and so mort import precision loss.
 * A common solution is to scale involved values by a few decimals before performing
 * operations, and then to scale them back to their original format before returning
 * the result.
 *
 * This library provides utilities to face both of above mentionned issues, by offering
 * the SUD format, a common and scaled intermediary format to perform calculations on.
 *
 * SUD stands for "Scaled UD" and/or "Safe UD".
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
 * - SUD: An UD with 3 more decimals than the involved rate or amount with the highest
 *        decimals number. As rate are represented by UD7x3, a SUD number has at least 6
 *        decimals (3+3) and so ranges from UD71x6 to UD0x77 formats.
 *        Used as an intermediate format to perform lossless calculations.
 *
 * This UD nomenclature is inspired from libraries like [prb-math](https://github.com/PaulRBerg/prb-math/).
 *
 * @dev This library provides utilities to perform the following conversions:
 * - Amount       <--> SUD
 * - Rate (UD7x3) <--> SUD
 * - Integer      <--> SUD
 *
 * @dev For further details, see "SUD" section of whitepaper.
 */
library SUD {
    /**
     * @notice Retrieves decimals number of the given ERC20 contract address.
     * @param tokenAddress The address to retrieve decimals number from.
     * @return decimals The decimals number of the given ERC20 contract address.
     */
    function decimalsOf(address tokenAddress) external view returns (uint256 decimals) {
        return IERC20MetadataUpgradeable(tokenAddress).decimals();
    }

    /**
     * @notice Convert a given token amount into SUD format.
     * @param nAmount The token amount to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return nSUD The amount in SUD format
     */
    function fromAmount(uint256 nAmount, uint256 decimals) public pure returns (uint256 nSUD) {
        // If token decimals < 3, return a UD71x6 number
        if (decimals < 3) return nAmount * 10 ** (6 - decimals);

        // Else return a number with decimals+3 fractional digits
        return nAmount * 10 ** 3;
    }

    /**
     * @notice Convert a given SUD amount into token amount format.
     * @param nSUD The SUD amount to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return nAmount The amount in decimals format
     */
    function toAmount(uint256 nSUD, uint256 decimals) public pure returns (uint256 nAmount) {
        // If token decimals < 3, convert from a UD71x6 number
        if (decimals < 3) return nSUD / 10 ** (6 - decimals);

        // Else return a number with decimals+3 fractional digits
        return nSUD / 10 ** 3;
    }

    /**
     * @notice Converts a given UD7x3 rate into SUD format.
     * @dev UD7x3 have the interesting property of being convertible into SUD format by
     * scaling them up by the token decimals number. See "SUD" section of whitepaper.
     * @param nUD7x3 The UD7x3 rate to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return nSUD The rate in SUD format.
     */
    function fromRate(uint256 nUD7x3, uint256 decimals) public pure returns (uint256 nSUD) {
        // If token decimals < 3, return a UD71x6 number
        if (decimals < 3) return nUD7x3 * 10 ** 3;

        // Else return a number with decimals+3 fractional digits
        return nUD7x3 * 10 ** decimals;
    }

    /**
     * @notice Converts a given SUD number into a UD7x3 rate.
     * @dev SUD have the interesting property of being convertible into UD7x3 rate by
     * scaling them down by the token decimals number. See "SUD" section of whitepaper.
     * @param nSUD The SUD number to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return nUD7x3 The number in UD7x3 rate format.
     */
    function toRate(uint256 nSUD, uint256 decimals) public pure returns (uint256 nUD7x3) {
        // If token decimals < 3, convert from a UD71x6 number
        if (decimals < 3) return nSUD / 10 ** 3;

        // Else return a number with decimals+3 fractional digits
        return nSUD / 10 ** decimals;
    }

    /**
     * @notice Converts a given integer into SUD format.
     * @param n The integer to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return nSUD The integer in SUD format.
     */
    function fromInt(uint256 n, uint256 decimals) external pure returns (uint256 nSUD) {
        // If token decimals < 3, return a UD71x6 number
        if (decimals < 3) return n * 10 ** 6;

        // Else
        return fromRate(fromAmount(n, decimals), decimals);
    }

    /**
     * @notice Converts a given SUD number as an integer (all decimals shrinked).
     * @param nSUD The SUD number to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return n The number as an integer.
     */
    function toInt(uint256 nSUD, uint256 decimals) external pure returns (uint256 n) {
        // If token decimals < 3, convert from a UD71x6 number
        if (decimals < 3) return nSUD / 10 ** 6;

        // Else
        return toRate(toAmount(nSUD, decimals), decimals);
    }
}
