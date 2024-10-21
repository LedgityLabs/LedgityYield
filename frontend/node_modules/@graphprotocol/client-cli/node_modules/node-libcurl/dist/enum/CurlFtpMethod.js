"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlFtpMethod = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be825453489/include/curl/curl.h#L873
// @TODO Fix enum members naming on semver major bump
/**
 * Object with constants for option `FTP_FILEMETHOD`
 *
 * `CURLFTPMETHOD_MULTICWD` becomes `CurlFtpMethod.MULTICWD`
 *
 * This is not following the PascalCase naming format because of a mistake. To not cause a breaking change
 *  it will stay this way until the next major version bump.
 *
 * @public
 */
var CurlFtpMethod;
(function (CurlFtpMethod) {
    /**
     * let libcurl pick
     */
    CurlFtpMethod[CurlFtpMethod["DEFAULT"] = 0] = "DEFAULT";
    /**
     * single CWD operation for each path part
     */
    CurlFtpMethod[CurlFtpMethod["MULTICWD"] = 1] = "MULTICWD";
    /**
     * no CWD at all
     */
    CurlFtpMethod[CurlFtpMethod["NOCWD"] = 2] = "NOCWD";
    /**
     * one CWD to full dir, then work on file
     */
    CurlFtpMethod[CurlFtpMethod["SINGLECWD"] = 3] = "SINGLECWD";
})(CurlFtpMethod || (exports.CurlFtpMethod = CurlFtpMethod = {}));
//# sourceMappingURL=CurlFtpMethod.js.map