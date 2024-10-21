"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlNetrc = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be82545/include/curl/curl.h#L2003
/**
 * To be used with the `NETRC` option
 *
 * `CURL_NETRC_OPTIONAL` becomes `CurlNetrc.Optional`
 *
 * @public
 */
var CurlNetrc;
(function (CurlNetrc) {
    /**
     * The .netrc will never be read.
     * This is the default
     */
    CurlNetrc[CurlNetrc["Ignored"] = 0] = "Ignored";
    /**
     * A user:password in the URL will be preferred to one in the .netrc
     */
    CurlNetrc[CurlNetrc["Optional"] = 1] = "Optional";
    /**
     * A user:password in the URL will be ignored.
     * Unless one is set programmatically, the .netrc
     * will be queried.
     */
    CurlNetrc[CurlNetrc["Required"] = 2] = "Required";
})(CurlNetrc || (exports.CurlNetrc = CurlNetrc = {}));
//# sourceMappingURL=CurlNetrc.js.map