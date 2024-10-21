/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Object with constants for option `SSLVERSION`
 *
 * `CURL_SSLVERSION_DEFAULT` becomes `CurlSslVersion.Default`
 *
 * @public
 */
export declare enum CurlSslVersion {
    Default = 0,
    TlsV1 = 1,
    SslV2 = 2,
    SslV3 = 3,
    TlsV1_0 = 4,
    TlsV1_1 = 5,
    TlsV1_2 = 6,
    TlsV1_3 = 7
}
/**
 * Object with constants for option `SSLVERSION`
 *
 * The maximum TLS version can be set by using one of the `CurlSslVersionMax` fields of this Enum.
 * It is also possible to OR one of the `CurlSslVersion` fields with one of `CurlSslVersionMax`
 *
 * `CURL_SSLVERSION_MAX_TLSv1_0` becomes `CurlSslVersionMax.TlsV1_0`
 *
 * @public
 */
export declare enum CurlSslVersionMax {
    None = 0,
    Default = 65536,
    TlsV1_0 = 262144,
    TlsV1_1 = 327680,
    TlsV1_2 = 393216,
    TlsV1_3 = 458752
}
//# sourceMappingURL=CurlSslVersion.d.ts.map