"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlFileType = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be8254534898/include/curl/curl.h#L264
/**
 * Object with constants on the {@link FileInfo | `FileInfo`} object,
 *  used alongside the `CHUNK_BGN_FUNCTION` option
 *
 * `CURLFILETYPE_DEVICE_BLOCK` becomes `CurlFileType.DeviceBlock`
 *
 * @public
 */
var CurlFileType;
(function (CurlFileType) {
    CurlFileType[CurlFileType["File"] = 0] = "File";
    CurlFileType[CurlFileType["Directory"] = 1] = "Directory";
    CurlFileType[CurlFileType["Symlink"] = 2] = "Symlink";
    CurlFileType[CurlFileType["DeviceBlock"] = 3] = "DeviceBlock";
    CurlFileType[CurlFileType["DeviceChar"] = 4] = "DeviceChar";
    CurlFileType[CurlFileType["NamedPipe"] = 5] = "NamedPipe";
    CurlFileType[CurlFileType["Socket"] = 6] = "Socket";
    CurlFileType[CurlFileType["Door"] = 7] = "Door";
})(CurlFileType || (exports.CurlFileType = CurlFileType = {}));
//# sourceMappingURL=CurlFileType.js.map