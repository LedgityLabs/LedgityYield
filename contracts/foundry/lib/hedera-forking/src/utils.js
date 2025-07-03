// SPDX-License-Identifier: Apache-2.0

/**
 * Helpers constants and functions.
 *
 * Useful to extract these helpers in a separate module so they can be used by tests as well.
 */
module.exports = {
    /**
     * When a slot is empty, zero must be returned.
     */
    ZERO_HEX_32_BYTE: '0x0000000000000000000000000000000000000000000000000000000000000000',

    /**
     * Converts a _camelCase_ string to a _snake_case_ string.
     *
     * @param {string} camelCase
     */
    toSnakeCase: camelCase => camelCase.replace(/([A-Z])/g, '_$1').toLowerCase(),

    /**
     * Converts `value` to hexadecimal format (without the leading `0x`)
     * left-padded with `0`s to a 32-bytes word.
     * That is, the resulting string will always have length `64`.
     *
     * ### Examples
     *
     * ```javascript
     * toIntHex256(1234); // '00000000000000000000000000000000000000000000000000000000000004d2'
     * toIntHex256('1234'); // '00000000000000000000000000000000000000000000000000000000000004d2'
     * toIntHex256(0x1234); // '0000000000000000000000000000000000000000000000000000000000001234'
     * toIntHex256('0x1234'); // '0000000000000000000000000000000000000000000000000000000000001234'
     * ```
     *
     * @param {string | number | bigint} value It can be anything accepted by the [`BigInt` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt/BigInt).
     * @returns {string}
     */
    toIntHex256: value => BigInt(value).toString(16).padStart(64, '0'),
};
