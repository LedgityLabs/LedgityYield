"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlPipe = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/7e35eb77292f/include/curl/multi.h#L84
/**
 * Object with bit constants to be used with the multi handle option `PIPELINING`
 * Those are available starting with libcurl 7.43.0.
 *
 * `CURLPIPE_NOTHING` becomes `CurlPipe.Nothing`
 *
 * @public
 */
var CurlPipe;
(function (CurlPipe) {
    CurlPipe[CurlPipe["Nothing"] = 0] = "Nothing";
    /**
     * Deprecated and has no effect since version 7.62.0
     */
    CurlPipe[CurlPipe["Http1"] = 1] = "Http1";
    /**
     * If this bit is set, libcurl will try to multiplex the new transfer over an existing connection if possible. This requires HTTP/2.
     *
     * This is enabled by default starting with version 7.62.0
     */
    CurlPipe[CurlPipe["Multiplex"] = 2] = "Multiplex";
})(CurlPipe || (exports.CurlPipe = CurlPipe = {}));
//# sourceMappingURL=CurlPipe.js.map