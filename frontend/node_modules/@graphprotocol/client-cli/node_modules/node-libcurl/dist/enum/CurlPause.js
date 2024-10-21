"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlPause = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be8254/include/curl/curl.h#L2828
/**
 * Options to be used with {@link "Easy".Easy.pause | `Easy#pause`} and {@link "Curl".Curl.pause | `Curl#pause`}.
 *
 * `CURLPAUSE_RECV_CONT` becomes `CurlPause.RecvCont`
 *
 * @public
 */
var CurlPause;
(function (CurlPause) {
    CurlPause[CurlPause["Recv"] = 1] = "Recv";
    CurlPause[CurlPause["RecvCont"] = 0] = "RecvCont";
    CurlPause[CurlPause["Send"] = 4] = "Send";
    CurlPause[CurlPause["SendCont"] = 0] = "SendCont";
    CurlPause[CurlPause["All"] = 5] = "All";
    CurlPause[CurlPause["Cont"] = 0] = "Cont";
})(CurlPause || (exports.CurlPause = CurlPause = {}));
//# sourceMappingURL=CurlPause.js.map