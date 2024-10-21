/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Object with constants for option `SSH_AUTH_TYPES`
 *
 * `CURLSSH_AUTH_PASSWORD` becomes `CurlSshAuth.Password`
 *
 * @public
 */
export declare enum CurlSshAuth {
    /**
     * all types supported by the server
     */
    Any = -1,
    /**
     * none allowed, silly but complete
     */
    None = 0,
    /**
     * public/private key files
     */
    PublicKey = 1,
    /**
     * password
     */
    Password = 2,
    /**
     * host key files
     */
    Host = 4,
    /**
     * keyboard interactive
     */
    Keyboard = 8,
    /**
     * agent (ssh-agent, pageant...)
     */
    Agent = 16,
    /**
     * gssapi (kerberos, ...)
     */
    GssApi = 32,
    Default = -1
}
//# sourceMappingURL=CurlSshAuth.d.ts.map