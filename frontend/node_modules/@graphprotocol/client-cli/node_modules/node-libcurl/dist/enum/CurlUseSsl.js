"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlUseSsl = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be8254534898/include/curl/curl.h#L801
/**
 * Object with constants for option `USE_SSL`
 *
 * `CURLUSESSL_NONE` becomes `CurlUseSsl.None`
 *
 * @public
 */
var CurlUseSsl;
(function (CurlUseSsl) {
    CurlUseSsl[CurlUseSsl["None"] = 0] = "None";
    CurlUseSsl[CurlUseSsl["Try"] = 1] = "Try";
    CurlUseSsl[CurlUseSsl["Control"] = 2] = "Control";
    CurlUseSsl[CurlUseSsl["All"] = 3] = "All";
})(CurlUseSsl || (exports.CurlUseSsl = CurlUseSsl = {}));
//# sourceMappingURL=CurlUseSsl.js.map