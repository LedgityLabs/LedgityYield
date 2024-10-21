"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlIpResolve = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be825453489/include/curl/curl.h#L1954
/**
 * Object with constants for option `IPRESOLVE`
 *
 * `CURL_IPRESOLVE_V4` becomes `Curl.ipresolve.V4`
 *
 * @public
 */
var CurlIpResolve;
(function (CurlIpResolve) {
    CurlIpResolve[CurlIpResolve["Whatever"] = 0] = "Whatever";
    CurlIpResolve[CurlIpResolve["V4"] = 1] = "V4";
    CurlIpResolve[CurlIpResolve["V6"] = 2] = "V6";
})(CurlIpResolve || (exports.CurlIpResolve = CurlIpResolve = {}));
//# sourceMappingURL=CurlIpResolve.js.map