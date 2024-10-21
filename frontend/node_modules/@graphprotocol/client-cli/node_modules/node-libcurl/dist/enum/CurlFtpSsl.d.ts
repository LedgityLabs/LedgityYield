/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Object with constants for option `FTP_SSL_CCC`
 *
 * `CURLFTPSSL_CCC_NONE` becomes `CurlFtpSsl.CccNone`
 *
 * @public
 */
export declare enum CurlFtpSsl {
    /**
     * do not send CCC
     */
    CccNone = 0,
    /**
     * Let the server initiate the shutdown
     */
    CccPassive = 1,
    /**
     * Initiate the shutdown
     */
    CccActive = 2
}
//# sourceMappingURL=CurlFtpSsl.d.ts.map