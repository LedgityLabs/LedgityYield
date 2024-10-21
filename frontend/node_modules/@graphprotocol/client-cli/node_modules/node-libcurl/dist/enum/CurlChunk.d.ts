/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Object to be used as the return value for the callbacks set
 *  with the options `CHUNK_BGN_FUNCTION` and `CHUNK_END_FUNCTION`.
 *
 * `CURL_CHUNK_BGN_FUNC_OK` becomes `CurlChunk.BgnFuncOk`
 *
 * @public
 */
export declare enum CurlChunk {
    BgnFuncOk = 0,
    BgnFuncFail = 1,
    BgnFuncSkip = 2,
    EndFuncOk = 0,
    EndFuncFail = 1
}
//# sourceMappingURL=CurlChunk.d.ts.map