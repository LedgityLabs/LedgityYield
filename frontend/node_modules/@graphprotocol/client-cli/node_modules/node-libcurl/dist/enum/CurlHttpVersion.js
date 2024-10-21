"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlHttpVersion = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be825453/include/curl/curl.h#L1964
/**
 * Object with constants to be used with the `HTTP_VERSION` option.
 *
 * `CURL_HTTP_VERSION_NONE` becomes `CurlHttpVersion.None`
 *   and `CURL_HTTP_VERSION_1_0` becomes `CurlHttpVersion.V1_0`
 *
 * @public
 */
var CurlHttpVersion;
(function (CurlHttpVersion) {
    /**
     * Setting this means we don't care, and that we'd
     * like the library to choose the best possible
     * for us!
     */
    CurlHttpVersion[CurlHttpVersion["None"] = 0] = "None";
    CurlHttpVersion[CurlHttpVersion["V1_0"] = 1] = "V1_0";
    CurlHttpVersion[CurlHttpVersion["V1_1"] = 2] = "V1_1";
    CurlHttpVersion[CurlHttpVersion["V2_0"] = 3] = "V2_0";
    /**
     * Use version 2 for HTTPS, version 1.1 for HTTP
     */
    CurlHttpVersion[CurlHttpVersion["V2Tls"] = 4] = "V2Tls";
    /**
     * Use HTTP 2 without HTTP/1.1 Upgrade
     */
    CurlHttpVersion[CurlHttpVersion["V2PriorKnowledge"] = 5] = "V2PriorKnowledge";
    CurlHttpVersion[CurlHttpVersion["v3"] = 6] = "v3";
})(CurlHttpVersion || (exports.CurlHttpVersion = CurlHttpVersion = {}));
//# sourceMappingURL=CurlHttpVersion.js.map