"use strict";
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlPx = void 0;
// https://github.com/curl/curl/blob/a4c26b0abebde418fddab7187ca089b78b6ef6d5/include/curl/curl.h#L697-L733
/**
 * Object with constants for usage with the info `PROXY_ERROR`
 *
 * `CURLPX_OK` becomes `CurlPx.Ok`
 *
 * @public
 */
var CurlPx;
(function (CurlPx) {
    CurlPx[CurlPx["Ok"] = 0] = "Ok";
    CurlPx[CurlPx["BadAddressType"] = 1] = "BadAddressType";
    CurlPx[CurlPx["BadVersion"] = 2] = "BadVersion";
    CurlPx[CurlPx["Closed"] = 3] = "Closed";
    CurlPx[CurlPx["Gssapi"] = 4] = "Gssapi";
    CurlPx[CurlPx["GssapiPermsg"] = 5] = "GssapiPermsg";
    CurlPx[CurlPx["GssapiProtection"] = 6] = "GssapiProtection";
    CurlPx[CurlPx["Identd"] = 7] = "Identd";
    CurlPx[CurlPx["IdentdDiffer"] = 8] = "IdentdDiffer";
    CurlPx[CurlPx["LongHostname"] = 9] = "LongHostname";
    CurlPx[CurlPx["LongPasswd"] = 10] = "LongPasswd";
    CurlPx[CurlPx["LongUser"] = 11] = "LongUser";
    CurlPx[CurlPx["NoAuth"] = 12] = "NoAuth";
    CurlPx[CurlPx["RecvAddress"] = 13] = "RecvAddress";
    CurlPx[CurlPx["RecvAuth"] = 14] = "RecvAuth";
    CurlPx[CurlPx["RecvConnect"] = 15] = "RecvConnect";
    CurlPx[CurlPx["RecvReqack"] = 16] = "RecvReqack";
    CurlPx[CurlPx["ReplyAddressTypeNotSupported"] = 17] = "ReplyAddressTypeNotSupported";
    CurlPx[CurlPx["ReplyCommandNotSupported"] = 18] = "ReplyCommandNotSupported";
    CurlPx[CurlPx["ReplyConnectionRefused"] = 19] = "ReplyConnectionRefused";
    CurlPx[CurlPx["ReplyGeneralServerFailure"] = 20] = "ReplyGeneralServerFailure";
    CurlPx[CurlPx["ReplyHostUnreachable"] = 21] = "ReplyHostUnreachable";
    CurlPx[CurlPx["ReplyNetworkUnreachable"] = 22] = "ReplyNetworkUnreachable";
    CurlPx[CurlPx["ReplyNotAllowed"] = 23] = "ReplyNotAllowed";
    CurlPx[CurlPx["ReplyTtlExpired"] = 24] = "ReplyTtlExpired";
    CurlPx[CurlPx["ReplyUnassigned"] = 25] = "ReplyUnassigned";
    CurlPx[CurlPx["RequestFailed"] = 26] = "RequestFailed";
    CurlPx[CurlPx["ResolveHost"] = 27] = "ResolveHost";
    CurlPx[CurlPx["SendAuth"] = 28] = "SendAuth";
    CurlPx[CurlPx["SendConnect"] = 29] = "SendConnect";
    CurlPx[CurlPx["SendRequest"] = 30] = "SendRequest";
    CurlPx[CurlPx["UnknownFail"] = 31] = "UnknownFail";
    CurlPx[CurlPx["UnknownMode"] = 32] = "UnknownMode";
    CurlPx[CurlPx["UserRejected"] = 33] = "UserRejected";
})(CurlPx || (exports.CurlPx = CurlPx = {}));
//# sourceMappingURL=CurlPx.js.map