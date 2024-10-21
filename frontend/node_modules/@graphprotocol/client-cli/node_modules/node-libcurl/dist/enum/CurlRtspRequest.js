"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlRtspRequest = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be82545348/include/curl/curl.h#L1987
/**
 * Object with constants for option `RTSP_REQUEST`
 * Only available on libcurl >= 7.20
 *
 * `CURL_RTSPREQ_OPTIONS` becomes `CurlRtspRequest.Options`
 *
 * @public
 */
var CurlRtspRequest;
(function (CurlRtspRequest) {
    CurlRtspRequest[CurlRtspRequest["None"] = 0] = "None";
    CurlRtspRequest[CurlRtspRequest["Options"] = 1] = "Options";
    CurlRtspRequest[CurlRtspRequest["Describe"] = 2] = "Describe";
    CurlRtspRequest[CurlRtspRequest["Announce"] = 3] = "Announce";
    CurlRtspRequest[CurlRtspRequest["Setup"] = 4] = "Setup";
    CurlRtspRequest[CurlRtspRequest["Play"] = 5] = "Play";
    CurlRtspRequest[CurlRtspRequest["Pause"] = 6] = "Pause";
    CurlRtspRequest[CurlRtspRequest["Teardown"] = 7] = "Teardown";
    CurlRtspRequest[CurlRtspRequest["GetParameter"] = 8] = "GetParameter";
    CurlRtspRequest[CurlRtspRequest["SetParameter"] = 9] = "SetParameter";
    CurlRtspRequest[CurlRtspRequest["Record"] = 10] = "Record";
    CurlRtspRequest[CurlRtspRequest["Receive"] = 11] = "Receive";
})(CurlRtspRequest || (exports.CurlRtspRequest = CurlRtspRequest = {}));
//# sourceMappingURL=CurlRtspRequest.js.map