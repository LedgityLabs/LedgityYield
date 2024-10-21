"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketState = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * This will be the type of the second parameter passed to the callback set with
 *  {@link "Easy".Easy.onSocketEvent|`Easy#onSocketEvent`}.
 * @public
 */
var SocketState;
(function (SocketState) {
    SocketState[SocketState["Readable"] = 1] = "Readable";
    SocketState[SocketState["Writable"] = 2] = "Writable";
})(SocketState || (exports.SocketState = SocketState = {}));
//# sourceMappingURL=SocketState.js.map