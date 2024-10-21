"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlSslVersionMax = exports.CurlSslVersion = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be82545348/include/curl/curl.h#L2015
/**
 * Object with constants for option `SSLVERSION`
 *
 * `CURL_SSLVERSION_DEFAULT` becomes `CurlSslVersion.Default`
 *
 * @public
 */
var CurlSslVersion;
(function (CurlSslVersion) {
    CurlSslVersion[CurlSslVersion["Default"] = 0] = "Default";
    CurlSslVersion[CurlSslVersion["TlsV1"] = 1] = "TlsV1";
    CurlSslVersion[CurlSslVersion["SslV2"] = 2] = "SslV2";
    CurlSslVersion[CurlSslVersion["SslV3"] = 3] = "SslV3";
    CurlSslVersion[CurlSslVersion["TlsV1_0"] = 4] = "TlsV1_0";
    CurlSslVersion[CurlSslVersion["TlsV1_1"] = 5] = "TlsV1_1";
    CurlSslVersion[CurlSslVersion["TlsV1_2"] = 6] = "TlsV1_2";
    CurlSslVersion[CurlSslVersion["TlsV1_3"] = 7] = "TlsV1_3";
})(CurlSslVersion || (exports.CurlSslVersion = CurlSslVersion = {}));
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
var CurlSslVersionMax;
(function (CurlSslVersionMax) {
    CurlSslVersionMax[CurlSslVersionMax["None"] = 0] = "None";
    CurlSslVersionMax[CurlSslVersionMax["Default"] = 65536] = "Default";
    CurlSslVersionMax[CurlSslVersionMax["TlsV1_0"] = 262144] = "TlsV1_0";
    CurlSslVersionMax[CurlSslVersionMax["TlsV1_1"] = 327680] = "TlsV1_1";
    CurlSslVersionMax[CurlSslVersionMax["TlsV1_2"] = 393216] = "TlsV1_2";
    CurlSslVersionMax[CurlSslVersionMax["TlsV1_3"] = 458752] = "TlsV1_3";
})(CurlSslVersionMax || (exports.CurlSslVersionMax = CurlSslVersionMax = {}));
//# sourceMappingURL=CurlSslVersion.js.map