"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlFtpSsl = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be8254534/include/curl/curl.h#L846
/**
 * Object with constants for option `FTP_SSL_CCC`
 *
 * `CURLFTPSSL_CCC_NONE` becomes `CurlFtpSsl.CccNone`
 *
 * @public
 */
var CurlFtpSsl;
(function (CurlFtpSsl) {
    /**
     * do not send CCC
     */
    CurlFtpSsl[CurlFtpSsl["CccNone"] = 0] = "CccNone";
    /**
     * Let the server initiate the shutdown
     */
    CurlFtpSsl[CurlFtpSsl["CccPassive"] = 1] = "CccPassive";
    /**
     * Initiate the shutdown
     */
    CurlFtpSsl[CurlFtpSsl["CccActive"] = 2] = "CccActive";
})(CurlFtpSsl || (exports.CurlFtpSsl = CurlFtpSsl = {}));
//# sourceMappingURL=CurlFtpSsl.js.map