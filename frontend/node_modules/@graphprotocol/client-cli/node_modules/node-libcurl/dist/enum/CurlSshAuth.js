"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlSshAuth = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be82545348/include/curl/curl.h#L741
/**
 * Object with constants for option `SSH_AUTH_TYPES`
 *
 * `CURLSSH_AUTH_PASSWORD` becomes `CurlSshAuth.Password`
 *
 * @public
 */
var CurlSshAuth;
(function (CurlSshAuth) {
    /**
     * all types supported by the server
     */
    CurlSshAuth[CurlSshAuth["Any"] = -1] = "Any";
    /**
     * none allowed, silly but complete
     */
    CurlSshAuth[CurlSshAuth["None"] = 0] = "None";
    /**
     * public/private key files
     */
    CurlSshAuth[CurlSshAuth["PublicKey"] = 1] = "PublicKey";
    /**
     * password
     */
    CurlSshAuth[CurlSshAuth["Password"] = 2] = "Password";
    /**
     * host key files
     */
    CurlSshAuth[CurlSshAuth["Host"] = 4] = "Host";
    /**
     * keyboard interactive
     */
    CurlSshAuth[CurlSshAuth["Keyboard"] = 8] = "Keyboard";
    /**
     * agent (ssh-agent, pageant...)
     */
    CurlSshAuth[CurlSshAuth["Agent"] = 16] = "Agent";
    /**
     * gssapi (kerberos, ...)
     */
    CurlSshAuth[CurlSshAuth["GssApi"] = 32] = "GssApi";
    CurlSshAuth[CurlSshAuth["Default"] = -1] = "Default";
})(CurlSshAuth || (exports.CurlSshAuth = CurlSshAuth = {}));
//# sourceMappingURL=CurlSshAuth.js.map