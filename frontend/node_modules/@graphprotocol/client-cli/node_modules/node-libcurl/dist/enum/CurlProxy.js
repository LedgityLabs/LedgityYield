"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlProxy = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be8254534898f/include/curl/curl.h#L692
/**
 * Object with constants for option `PROXYTYPE`
 *
 * `CURLPROXY_HTTP` becomes `CurlProxy.Http`
 *
 * @public
 */
var CurlProxy;
(function (CurlProxy) {
    CurlProxy[CurlProxy["Http"] = 0] = "Http";
    CurlProxy[CurlProxy["Http_1_0"] = 1] = "Http_1_0";
    CurlProxy[CurlProxy["Https"] = 2] = "Https";
    CurlProxy[CurlProxy["Socks4"] = 4] = "Socks4";
    CurlProxy[CurlProxy["Socks5"] = 5] = "Socks5";
    CurlProxy[CurlProxy["Socks4A"] = 6] = "Socks4A";
    CurlProxy[CurlProxy["Socks5Hostname"] = 7] = "Socks5Hostname";
})(CurlProxy || (exports.CurlProxy = CurlProxy = {}));
//# sourceMappingURL=CurlProxy.js.map