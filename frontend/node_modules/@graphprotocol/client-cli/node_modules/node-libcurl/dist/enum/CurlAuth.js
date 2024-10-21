"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlFtpAuth = exports.CurlAuth = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be82545348/include/curl/curl.h#L725
/**
 * Object with bitmasks that should be used with the `HTTPAUTH` and `PROXYAUTH` options.
 *
 * `CURLAUTH_BASIC` becomes `CurlAuth.Basic`
 *
 * **NOTE:** The option `Only` (`CURLAUTH_ONLY`) cannot be safely used on bitwise operations, because it represents a integer larger
 *  than 32 bits, if you need to use it, you must do the bitwise operation without using the operators.
 *
 * See following StackOverflow questions for more info:
 *  https://stackoverflow.com/q/39660274/710693
 *  https://stackoverflow.com/q/3637702/710693
 *
 * @public
 */
var CurlAuth;
(function (CurlAuth) {
    CurlAuth[CurlAuth["None"] = 0] = "None";
    CurlAuth[CurlAuth["Basic"] = 1] = "Basic";
    CurlAuth[CurlAuth["Digest"] = 2] = "Digest";
    CurlAuth[CurlAuth["Negotiate"] = 4] = "Negotiate";
    /**
     * Deprecated since the advent of Negotiate
     */
    CurlAuth[CurlAuth["GssNegotiate"] = 4] = "GssNegotiate";
    /**
     * Used for option `SOCKS5_AUTH` to stay terminologically correct
     */
    CurlAuth[CurlAuth["GssApi"] = 4] = "GssApi";
    CurlAuth[CurlAuth["Ntlm"] = 8] = "Ntlm";
    CurlAuth[CurlAuth["DigestIe"] = 16] = "DigestIe";
    CurlAuth[CurlAuth["NtlmWb"] = 32] = "NtlmWb";
    CurlAuth[CurlAuth["Bearer"] = 64] = "Bearer";
    CurlAuth[CurlAuth["AwsSigV4"] = 128] = "AwsSigV4";
    // cannot use 1 << 31 like on libcurl, because bitwise operations on js are limited to 32 bits, so that would overflow
    CurlAuth[CurlAuth["Only"] = 2147483648] = "Only";
    CurlAuth[CurlAuth["Any"] = -17] = "Any";
    CurlAuth[CurlAuth["AnySafe"] = -18] = "AnySafe";
})(CurlAuth || (exports.CurlAuth = CurlAuth = {}));
// https://github.com/curl/curl/blob/e1be825453/include/curl/curl.h#L853
/**
 * Object with constants for option `FTPSSLAUTH`
 *
 * `CURLFTPAUTH_DEFAULT` becomes `CurlFtpAuth.Default`
 *
 * @public
 */
var CurlFtpAuth;
(function (CurlFtpAuth) {
    CurlFtpAuth[CurlFtpAuth["Default"] = 0] = "Default";
    CurlFtpAuth[CurlFtpAuth["Ssl"] = 1] = "Ssl";
    CurlFtpAuth[CurlFtpAuth["Tls"] = 2] = "Tls";
})(CurlFtpAuth || (exports.CurlFtpAuth = CurlFtpAuth = {}));
//# sourceMappingURL=CurlAuth.js.map