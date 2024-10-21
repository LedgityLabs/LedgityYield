"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlSslOpt = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be8254534898fccafc5d6cd04f6235f283cfbd/include/curl/curl.h#L7
/**
 * Object with constants for option `SSL_OPTIONS` and/or `PROXY_SSL_OPTIONS`
 *
 * `CURLSSLOPT_ALLOW_BEAST` becomes `CurlSslOpt.AllowBeast`
 *
 * @public
 */
var CurlSslOpt;
(function (CurlSslOpt) {
    /**
     * Tells libcurl to allow the BEAST SSL vulnerability in the
     * name of improving interoperability with older servers. Some SSL libraries
     * have introduced work-arounds for this flaw but those work-arounds sometimes
     * make the SSL communication fail. To regain functionality with those broken
     * servers, a user can this way allow the vulnerability back.
     */
    CurlSslOpt[CurlSslOpt["AllowBeast"] = 1] = "AllowBeast";
    /**
     * Tells libcurl to disable certificate revocation checks for those
     * SSL backends where such behavior is present.
     */
    CurlSslOpt[CurlSslOpt["NoRevoke"] = 2] = "NoRevoke";
    /**
     * Tells libcurl to *NOT* accept a partial certificate chain
     * if possible. The OpenSSL backend has this ability.
     */
    CurlSslOpt[CurlSslOpt["NoPartialChain"] = 4] = "NoPartialChain";
    /**
     * Tells libcurl to ignore certificate revocation offline
     * checks and ignore missing revocation list for those SSL backends where such
     * behavior is present.
     */
    CurlSslOpt[CurlSslOpt["RevokeBestEffort"] = 8] = "RevokeBestEffort";
    /**
     * Tells libcurl to use standard certificate store of
     * operating system. Currently implemented under MS-Windows.
     */
    CurlSslOpt[CurlSslOpt["NativeCa"] = 16] = "NativeCa";
    /**
     * Tells libcurl to automatically locate and use
     * a client certificate for authentication. (Schannel)
     *
     * Added with libcurl 7.77 - This was the default in previous versions
     */
    CurlSslOpt[CurlSslOpt["AutoClientCert"] = 32] = "AutoClientCert";
})(CurlSslOpt || (exports.CurlSslOpt = CurlSslOpt = {}));
//# sourceMappingURL=CurlSslOpt.js.map