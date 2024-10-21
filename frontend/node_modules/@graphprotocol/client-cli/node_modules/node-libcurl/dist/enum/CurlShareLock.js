"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlShareLock = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be82545348/include/curl/curl.h#L2643
/**
 * Options to be used when setting `SHARE` or `UNSHARE` with {@link "Share".Share.setOpt | `Share#setOpt`}.
 *
 * `CURL_LOCK_DATA_SSL_SESSION` becomes `CurlShareLock.DataSslSession`
 *
 * @public
 */
var CurlShareLock;
(function (CurlShareLock) {
    CurlShareLock[CurlShareLock["DataNone"] = 0] = "DataNone";
    /**
     * DataShare is used internally to say that
     *  the locking is just made to change the internal state of the share
     *  itself.
     */
    CurlShareLock[CurlShareLock["DataShare"] = 1] = "DataShare";
    CurlShareLock[CurlShareLock["DataCookie"] = 2] = "DataCookie";
    CurlShareLock[CurlShareLock["DataDns"] = 3] = "DataDns";
    CurlShareLock[CurlShareLock["DataSslSession"] = 4] = "DataSslSession";
    CurlShareLock[CurlShareLock["DataConnect"] = 5] = "DataConnect";
    CurlShareLock[CurlShareLock["DataPsl"] = 6] = "DataPsl";
})(CurlShareLock || (exports.CurlShareLock = CurlShareLock = {}));
//# sourceMappingURL=CurlShareLock.js.map