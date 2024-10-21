/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Object with constants to be used with the `HTTP_VERSION` option.
 *
 * `CURL_HTTP_VERSION_NONE` becomes `CurlHttpVersion.None`
 *   and `CURL_HTTP_VERSION_1_0` becomes `CurlHttpVersion.V1_0`
 *
 * @public
 */
export declare enum CurlHttpVersion {
    /**
     * Setting this means we don't care, and that we'd
     * like the library to choose the best possible
     * for us!
     */
    None = 0,
    V1_0 = 1,
    V1_1 = 2,
    V2_0 = 3,
    /**
     * Use version 2 for HTTPS, version 1.1 for HTTP
     */
    V2Tls = 4,
    /**
     * Use HTTP 2 without HTTP/1.1 Upgrade
     */
    V2PriorKnowledge = 5,
    v3 = 6
}
//# sourceMappingURL=CurlHttpVersion.d.ts.map