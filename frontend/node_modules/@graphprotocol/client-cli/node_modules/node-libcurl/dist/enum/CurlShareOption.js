"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlShareOption = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be82545348/include/curl/curl.h#L2685
// not following enum naming convention on this one to keep consistent with other curl options
/**
 * Options to be used with {@link "Share".Share.setOpt | `Share#setOpt`}.
 *
 * @public
 */
var CurlShareOption;
(function (CurlShareOption) {
    CurlShareOption[CurlShareOption["SHARE"] = 1] = "SHARE";
    CurlShareOption[CurlShareOption["UNSHARE"] = 2] = "UNSHARE";
})(CurlShareOption || (exports.CurlShareOption = CurlShareOption = {}));
//# sourceMappingURL=CurlShareOption.js.map