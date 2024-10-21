/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Options to be used with {@link "Easy".Easy.pause | `Easy#pause`} and {@link "Curl".Curl.pause | `Curl#pause`}.
 *
 * `CURLPAUSE_RECV_CONT` becomes `CurlPause.RecvCont`
 *
 * @public
 */
export declare enum CurlPause {
    Recv = 1,
    RecvCont = 0,
    Send = 4,
    SendCont = 0,
    All = 5,
    Cont = 0
}
//# sourceMappingURL=CurlPause.d.ts.map