"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlHstsCallback = exports.CurlHsts = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/de1004eb0f917b265f187c14d9abaaf7f13f8422/include/curl/curl.h#L995
/**
 * Object with bitmasks that should be used with the `HSTS_CTRL` option.
 *
 * `CURLAUTH_BASIC` becomes `CurlAuth.Basic`
 *
 * @public
 */
var CurlHsts;
(function (CurlHsts) {
    /**
     * Disable the in-memory HSTS cache for this handle.
     */
    CurlHsts[CurlHsts["Disabled"] = 0] = "Disabled";
    /**
     * Enable the in-memory HSTS cache for this handle.
     */
    CurlHsts[CurlHsts["Enable"] = 1] = "Enable";
    /**
     * Make the HSTS file (if specified) read-only - makes libcurl not save the cache to the file when closing the handle.
     */
    CurlHsts[CurlHsts["ReadonlyFile"] = 2] = "ReadonlyFile";
})(CurlHsts || (exports.CurlHsts = CurlHsts = {}));
// https://github.com/curl/curl/blob/de1004eb0f917b265f187c14d9abaaf7f13f8422/include/curl/curl.h#L981-L985
/**
 * Object with constants to be used as the return value for the callbacks set for options `HSTSWRITEFUNCTION` and `HSTSREADFUNCTION`.
 *
 * `CURLSTS_OK` becomes `CurlHstsCallback.Ok`
 *
 * @public
 */
var CurlHstsCallback;
(function (CurlHstsCallback) {
    CurlHstsCallback[CurlHstsCallback["Ok"] = 0] = "Ok";
    CurlHstsCallback[CurlHstsCallback["Done"] = 1] = "Done";
    CurlHstsCallback[CurlHstsCallback["Fail"] = 2] = "Fail";
})(CurlHstsCallback || (exports.CurlHstsCallback = CurlHstsCallback = {}));
//# sourceMappingURL=CurlHsts.js.map