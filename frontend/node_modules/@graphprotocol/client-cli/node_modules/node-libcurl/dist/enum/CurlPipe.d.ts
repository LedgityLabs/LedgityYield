/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Object with bit constants to be used with the multi handle option `PIPELINING`
 * Those are available starting with libcurl 7.43.0.
 *
 * `CURLPIPE_NOTHING` becomes `CurlPipe.Nothing`
 *
 * @public
 */
export declare enum CurlPipe {
    Nothing = 0,
    /**
     * Deprecated and has no effect since version 7.62.0
     */
    Http1 = 1,
    /**
     * If this bit is set, libcurl will try to multiplex the new transfer over an existing connection if possible. This requires HTTP/2.
     *
     * This is enabled by default starting with version 7.62.0
     */
    Multiplex = 2
}
//# sourceMappingURL=CurlPipe.d.ts.map