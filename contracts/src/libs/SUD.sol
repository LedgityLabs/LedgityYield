// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {IERC20MetadataUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";

/**
 * @title SUD
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com
 *
 * @notice SUD serves as an intermediary number format for calculations within this
 * codebase. It ensures consistency and reduces precision losses. This library
 * facilitates conversions between various number formats and the SUD format.
 *
 * @dev Intuition:
 * This codebase employs the UD (unsigned decimal fixed-point numbers) format to
 * represent both percentage rates and tokens amounts.
 *
 * Rates are expressed in UD7x3 format, whereas the format for tokens amounts depends on
 * the decimals() value of the involved tokens.
 *
 * Three challenges arise from this:
 *   1) To compute values together, it's essential that they are in the same format
 *   2) Calculations involving consecutive divisions on UD numbers lead to accumulated
 *      precision loss (because division shrinks). A common approach is to scale up and
 *      down values by a few decimals before and after performing calculations.
 *   3) Given that rates use the UD7x3 format, if we decided to scale them to and from
 *      the number of decimals of the involved token, 1 to 3 of the rates' decimals would
 *      be shrunk in case token's decimals number is in [0, 2].
 *
 * To address these challenges, this library provides the SUD format, which acts as a
 * consistent and scaled intermediate format to perform calculations.
 *
 * SUD is an acronym for either "Scaled UD" or "Safe UD".
 *
 * @dev Definitions:
 * - Integer: A number without fractional part, e.g., block.timestamp
 * - UD: A decimal unsigned fixed-point number. The "UD" notation is inspired from
 *       libraries like [prb-math](https://github.com/PaulRBerg/prb-math/)
 * - Amount: A token amount. A UD with an unknown repartition of digits between integral
 *           and fractional parts (as token amounts have variable decimal numbers)
 * - Rate: A percentage rate. An UD with 7 integral digits and 3 fractional ones (= UD7x3)
 * - SUD: An intermediate format to perform calculations involving Rates and Amounts. A UD
 *        with 3 more decimals than the involved UD with the highest decimals number. As
 *        rates are represented by UD7x3, a SUD number has at least 6 decimals (3+3) and
 *        so ranges from UD71x6 to UD0x77 formats.
 *
 * @dev A conversion library:
 * This library provides utilities to perform the following conversions:
 * - Amount       <--> SUD
 * - Rate (UD7x3) <--> SUD
 * - Integer      <--> SUD
 *
 * @dev Why scaling by 3 decimals?
 * - It provides an adequate degree of precision for this codebase,
 * - It enables the conversion of a UD7x3 rate to SUD format by merely scaling it up by
 *   the involved token's decimal number, so is gas efficient.
 *
 * @dev Why internal functions?
 * The functions of this library are not set to external because incorporating them
 * directly into contracts is more gas-efficient. Given their minimal size and frequent
 * usage in the InvestUpgradeable, LDYStaking, and LToken contracts, any bytecode savings
 * from making them external are negated by the additional bytecode required for external
 * calls to this library. This can be observed by comparing the output of `bun cc:size`
 * when those functions's visibility is set to external or internal.
 *
 * @dev Precision warning:
 * While this library mitigates precision loss during calculations on UD numbers, it's
 * important to note that tokens with lower decimal counts and supply inherently suffer
 * more from precision loss. Conversely, tokens with higher decimal counts and supply
 * will experience less precision loss.
 *
 * @dev For further details, see "SUD" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
library SUD {
    /**
     * @notice Retrieves decimals number of the given ERC20 contract address.
     * @param tokenAddress The address to retrieve decimals number from.
     * @return decimals The decimals number of the given ERC20 contract address.
     */
    function decimalsOf(address tokenAddress) internal view returns (uint256 decimals) {
        return IERC20MetadataUpgradeable(tokenAddress).decimals();
    }

    /**
     * @notice Convert a given token amount into SUD format.
     * @param nAmount The token amount to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return nSUD The amount in SUD format
     */
    function fromAmount(uint256 nAmount, uint256 decimals) internal pure returns (uint256 nSUD) {
        // If token decimals < 3, return a UD71x6 number
        if (decimals < 3) return nAmount * 10 ** (6 - decimals);

        // Else return a number with decimals+3 fractional digits
        return nAmount * 10 ** 3;
    }

    /**
     * @notice Convert a given SUD number into token amount format.
     * @param nSUD The SUD number to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return nAmount The number in amount format
     */
    function toAmount(uint256 nSUD, uint256 decimals) internal pure returns (uint256 nAmount) {
        // If token decimals < 3, convert from a UD71x6 number
        if (decimals < 3) return nSUD / 10 ** (6 - decimals);

        // Else, convert from a number with decimals+3 fractional digits
        return nSUD / 10 ** 3;
    }

    /**
     * @notice Converts a given UD7x3 rate into SUD format.
     * @param nUD7x3 The UD7x3 rate to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return nSUD The rate in SUD format.
     */
    function fromRate(uint256 nUD7x3, uint256 decimals) internal pure returns (uint256 nSUD) {
        // If token decimals < 3, return a UD71x6 number
        if (decimals < 3) return nUD7x3 * 10 ** 3;

        // Else, return a number with decimals+3 fractional digits
        return nUD7x3 * 10 ** decimals;
    }

    /**
     * @notice Converts a given SUD number into a UD7x3 rate.
     * @param nSUD The SUD number to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return nUD7x3 The number in UD7x3 rate format.
     */
    function toRate(uint256 nSUD, uint256 decimals) internal pure returns (uint256 nUD7x3) {
        // If token decimals < 3, convert from a UD71x6 number
        if (decimals < 3) return nSUD / 10 ** 3;

        // Else, convert from a number with decimals+3 fractional digits
        return nSUD / 10 ** decimals;
    }

    /**
     * @notice Converts a given integer into SUD format.
     * @param n The integer to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return nSUD The integer in SUD format.
     */
    function fromInt(uint256 n, uint256 decimals) internal pure returns (uint256 nSUD) {
        // If token decimals < 3, return a UD71x6 number
        if (decimals < 3) return n * 10 ** 6;

        // Else, return a number with decimals+3 fractional digits
        return n * 10 ** (decimals + 3);
    }

    /**
     * @notice Converts a given SUD number as an integer (all decimals shrinked).
     * @param nSUD The SUD number to convert.
     * @param decimals The decimals number of the involved ERC20 token.
     * @return n The SUD number as an integer.
     */
    function toInt(uint256 nSUD, uint256 decimals) internal pure returns (uint256 n) {
        // If token decimals < 3, convert from a UD71x6 number
        if (decimals < 3) return nSUD / 10 ** 6;

        // Else, convert from a number with decimals+3 fractional digits
        return nSUD / 10 ** (decimals + 3);
    }
}
