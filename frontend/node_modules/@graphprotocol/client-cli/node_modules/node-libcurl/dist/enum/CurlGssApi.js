"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlGssApi = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be8254534898fccafc5d6cd04f6235f283cfbd/include/curl/curl.h#L7
/**
 * Object with constants for option `GSSAPI_DELEGATION`
 *
 * `CURLGSSAPI_DELEGATION_FLAG` becomes `CurlGssApi.DelegationFlag`
 *
 * @public
 */
var CurlGssApi;
(function (CurlGssApi) {
    /**
     * None, default
     */
    CurlGssApi[CurlGssApi["None"] = 0] = "None";
    /**
     * if permitted by policy
     */
    CurlGssApi[CurlGssApi["PolicyFlag"] = 1] = "PolicyFlag";
    /**
     * delegate always
     */
    CurlGssApi[CurlGssApi["DelegationFlag"] = 2] = "DelegationFlag";
})(CurlGssApi || (exports.CurlGssApi = CurlGssApi = {}));
//# sourceMappingURL=CurlGssApi.js.map