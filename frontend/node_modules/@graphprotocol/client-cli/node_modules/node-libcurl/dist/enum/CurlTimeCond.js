"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlTimeCond = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be82545348/include/curl/curl.h#L2058
/**
 * Object with constants for option `TIMECONDITION`
 *
 * `CURL_TIMECOND_IFMODSINCE` becomes `CurlTimeCond.IfModSince`
 *
 * @public
 */
var CurlTimeCond;
(function (CurlTimeCond) {
    CurlTimeCond[CurlTimeCond["None"] = 0] = "None";
    CurlTimeCond[CurlTimeCond["IfModSince"] = 1] = "IfModSince";
    CurlTimeCond[CurlTimeCond["IfUnmodSince"] = 2] = "IfUnmodSince";
    CurlTimeCond[CurlTimeCond["LastMod"] = 3] = "LastMod";
})(CurlTimeCond || (exports.CurlTimeCond = CurlTimeCond = {}));
//# sourceMappingURL=CurlTimeCond.js.map