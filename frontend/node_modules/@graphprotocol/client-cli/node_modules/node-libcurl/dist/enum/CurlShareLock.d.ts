/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Options to be used when setting `SHARE` or `UNSHARE` with {@link "Share".Share.setOpt | `Share#setOpt`}.
 *
 * `CURL_LOCK_DATA_SSL_SESSION` becomes `CurlShareLock.DataSslSession`
 *
 * @public
 */
export declare enum CurlShareLock {
    DataNone = 0,
    /**
     * DataShare is used internally to say that
     *  the locking is just made to change the internal state of the share
     *  itself.
     */
    DataShare = 1,
    DataCookie = 2,
    DataDns = 3,
    DataSslSession = 4,
    DataConnect = 5,
    DataPsl = 6
}
//# sourceMappingURL=CurlShareLock.d.ts.map