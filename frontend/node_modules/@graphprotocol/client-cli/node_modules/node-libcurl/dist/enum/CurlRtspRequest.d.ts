/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Object with constants for option `RTSP_REQUEST`
 * Only available on libcurl >= 7.20
 *
 * `CURL_RTSPREQ_OPTIONS` becomes `CurlRtspRequest.Options`
 *
 * @public
 */
export declare enum CurlRtspRequest {
    None = 0,
    Options = 1,
    Describe = 2,
    Announce = 3,
    Setup = 4,
    Play = 5,
    Pause = 6,
    Teardown = 7,
    GetParameter = 8,
    SetParameter = 9,
    Record = 10,
    Receive = 11
}
//# sourceMappingURL=CurlRtspRequest.d.ts.map