"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlFnMatchFunc = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be8254534898fccafc5d6cd04f6235f283cfbd/include/curl/curl.h#L342
/**
 * Object to be used as the return value for the callback set with the option `FNMATCH_FUNCTION`
 *
 * `CURL_FNMATCHFUNC_MATCH` becomes `CurlFnMatch.Match`
 *
 * @public
 */
var CurlFnMatchFunc;
(function (CurlFnMatchFunc) {
    CurlFnMatchFunc[CurlFnMatchFunc["Match"] = 0] = "Match";
    CurlFnMatchFunc[CurlFnMatchFunc["NoMatch"] = 1] = "NoMatch";
    CurlFnMatchFunc[CurlFnMatchFunc["Fail"] = 2] = "Fail";
})(CurlFnMatchFunc || (exports.CurlFnMatchFunc = CurlFnMatchFunc = {}));
//# sourceMappingURL=CurlFnMatchFunc.js.map