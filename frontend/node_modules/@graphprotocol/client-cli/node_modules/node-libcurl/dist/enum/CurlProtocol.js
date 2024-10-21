"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlProtocol = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be8254534898fccafc5d6cd04f6235f283cfbd/include/curl/curl.h#L893
// not following Enum name convention here because it feels more natural that way
/**
 * Object with the protocols supported by libcurl, as bitmasks.
 * Should be used when setting `PROTOCOLS` and `REDIR_PROTOCOLS` options.
 *
 * `CURLPROTO_HTTP` becomes `CurlProtocol.HTTP`
 *
 * @public
 */
var CurlProtocol;
(function (CurlProtocol) {
    CurlProtocol[CurlProtocol["HTTP"] = 1] = "HTTP";
    CurlProtocol[CurlProtocol["HTTPS"] = 2] = "HTTPS";
    CurlProtocol[CurlProtocol["FTP"] = 4] = "FTP";
    CurlProtocol[CurlProtocol["FTPS"] = 8] = "FTPS";
    CurlProtocol[CurlProtocol["SCP"] = 16] = "SCP";
    CurlProtocol[CurlProtocol["SFTP"] = 32] = "SFTP";
    CurlProtocol[CurlProtocol["TELNET"] = 64] = "TELNET";
    CurlProtocol[CurlProtocol["LDAP"] = 128] = "LDAP";
    CurlProtocol[CurlProtocol["LDAPS"] = 256] = "LDAPS";
    CurlProtocol[CurlProtocol["DICT"] = 512] = "DICT";
    CurlProtocol[CurlProtocol["FILE"] = 1024] = "FILE";
    CurlProtocol[CurlProtocol["TFTP"] = 2048] = "TFTP";
    CurlProtocol[CurlProtocol["IMAP"] = 4096] = "IMAP";
    CurlProtocol[CurlProtocol["IMAPS"] = 8192] = "IMAPS";
    CurlProtocol[CurlProtocol["POP3"] = 16384] = "POP3";
    CurlProtocol[CurlProtocol["POP3S"] = 32768] = "POP3S";
    CurlProtocol[CurlProtocol["SMTP"] = 65536] = "SMTP";
    CurlProtocol[CurlProtocol["SMTPS"] = 131072] = "SMTPS";
    CurlProtocol[CurlProtocol["RTSP"] = 262144] = "RTSP";
    CurlProtocol[CurlProtocol["RTMP"] = 524288] = "RTMP";
    CurlProtocol[CurlProtocol["RTMPT"] = 1048576] = "RTMPT";
    CurlProtocol[CurlProtocol["RTMPE"] = 2097152] = "RTMPE";
    CurlProtocol[CurlProtocol["RTMPTE"] = 4194304] = "RTMPTE";
    CurlProtocol[CurlProtocol["RTMPS"] = 8388608] = "RTMPS";
    CurlProtocol[CurlProtocol["RTMPTS"] = 16777216] = "RTMPTS";
    CurlProtocol[CurlProtocol["GOPHER"] = 33554432] = "GOPHER";
    CurlProtocol[CurlProtocol["SMB"] = 67108864] = "SMB";
    CurlProtocol[CurlProtocol["SMBS"] = 134217728] = "SMBS";
    CurlProtocol[CurlProtocol["MQTT"] = 268435456] = "MQTT";
    CurlProtocol[CurlProtocol["GOPHERS"] = 536870912] = "GOPHERS";
    CurlProtocol[CurlProtocol["ALL"] = -1] = "ALL";
})(CurlProtocol || (exports.CurlProtocol = CurlProtocol = {}));
//# sourceMappingURL=CurlProtocol.js.map