"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlInfoDebug = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be8254534898/include/curl/curl.h#L452
/**
 * When the option `DEBUGFUNCTION` is set,
 *  the first argument to the callback will be one of these.
 *
 * `CURLINFO_SSL_DATA_IN` becomes `CurlInfoDebug.SslDataOut`
 *
 * @public
 */
var CurlInfoDebug;
(function (CurlInfoDebug) {
    CurlInfoDebug[CurlInfoDebug["Text"] = 0] = "Text";
    CurlInfoDebug[CurlInfoDebug["HeaderIn"] = 1] = "HeaderIn";
    CurlInfoDebug[CurlInfoDebug["HeaderOut"] = 2] = "HeaderOut";
    CurlInfoDebug[CurlInfoDebug["DataIn"] = 3] = "DataIn";
    CurlInfoDebug[CurlInfoDebug["DataOut"] = 4] = "DataOut";
    CurlInfoDebug[CurlInfoDebug["SslDataIn"] = 5] = "SslDataIn";
    CurlInfoDebug[CurlInfoDebug["SslDataOut"] = 6] = "SslDataOut";
})(CurlInfoDebug || (exports.CurlInfoDebug = CurlInfoDebug = {}));
//# sourceMappingURL=CurlInfoDebug.js.map