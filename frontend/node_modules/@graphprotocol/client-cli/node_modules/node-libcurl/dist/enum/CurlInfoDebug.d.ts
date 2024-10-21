/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * When the option `DEBUGFUNCTION` is set,
 *  the first argument to the callback will be one of these.
 *
 * `CURLINFO_SSL_DATA_IN` becomes `CurlInfoDebug.SslDataOut`
 *
 * @public
 */
export declare enum CurlInfoDebug {
    Text = 0,
    HeaderIn = 1,
    HeaderOut = 2,
    DataIn = 3,
    DataOut = 4,
    SslDataIn = 5,
    SslDataOut = 6
}
//# sourceMappingURL=CurlInfoDebug.d.ts.map