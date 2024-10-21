/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
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
export declare enum CurlAuth {
    None = 0,
    Basic = 1,
    Digest = 2,
    Negotiate = 4,
    /**
     * Deprecated since the advent of Negotiate
     */
    GssNegotiate = 4,
    /**
     * Used for option `SOCKS5_AUTH` to stay terminologically correct
     */
    GssApi = 4,
    Ntlm = 8,
    DigestIe = 16,
    NtlmWb = 32,
    Bearer = 64,
    AwsSigV4 = 128,
    Only = 2147483648,
    Any = -17,
    AnySafe = -18
}
/**
 * Object with constants for option `FTPSSLAUTH`
 *
 * `CURLFTPAUTH_DEFAULT` becomes `CurlFtpAuth.Default`
 *
 * @public
 */
export declare enum CurlFtpAuth {
    Default = 0,
    Ssl = 1,
    Tls = 2
}
//# sourceMappingURL=CurlAuth.d.ts.map