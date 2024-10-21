"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlReadFunc = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be8254534898fccafc5d6cd04f6235f283cfbd/include/curl/curl.h#L361-L366
/**
 * Special return codes for `READFUNCTION` option
 *
 * `CURL_READFUNC_ABORT` becomes `CurlReadFunc.Abort`
 *
 * @public
 */
var CurlReadFunc;
(function (CurlReadFunc) {
    CurlReadFunc[CurlReadFunc["Abort"] = 268435456] = "Abort";
    CurlReadFunc[CurlReadFunc["Pause"] = 268435457] = "Pause";
})(CurlReadFunc || (exports.CurlReadFunc = CurlReadFunc = {}));
//# sourceMappingURL=CurlReadFunc.js.map