"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlChunk = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be82545348/include/curl/curl.h#L318
/**
 * Object to be used as the return value for the callbacks set
 *  with the options `CHUNK_BGN_FUNCTION` and `CHUNK_END_FUNCTION`.
 *
 * `CURL_CHUNK_BGN_FUNC_OK` becomes `CurlChunk.BgnFuncOk`
 *
 * @public
 */
var CurlChunk;
(function (CurlChunk) {
    CurlChunk[CurlChunk["BgnFuncOk"] = 0] = "BgnFuncOk";
    CurlChunk[CurlChunk["BgnFuncFail"] = 1] = "BgnFuncFail";
    CurlChunk[CurlChunk["BgnFuncSkip"] = 2] = "BgnFuncSkip";
    CurlChunk[CurlChunk["EndFuncOk"] = 0] = "EndFuncOk";
    CurlChunk[CurlChunk["EndFuncFail"] = 1] = "EndFuncFail";
})(CurlChunk || (exports.CurlChunk = CurlChunk = {}));
//# sourceMappingURL=CurlChunk.js.map