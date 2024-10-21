/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Object with the protocols supported by libcurl, as bitmasks.
 * Should be used when setting `PROTOCOLS` and `REDIR_PROTOCOLS` options.
 *
 * `CURLPROTO_HTTP` becomes `CurlProtocol.HTTP`
 *
 * @public
 */
export declare enum CurlProtocol {
    HTTP = 1,
    HTTPS = 2,
    FTP = 4,
    FTPS = 8,
    SCP = 16,
    SFTP = 32,
    TELNET = 64,
    LDAP = 128,
    LDAPS = 256,
    DICT = 512,
    FILE = 1024,
    TFTP = 2048,
    IMAP = 4096,
    IMAPS = 8192,
    POP3 = 16384,
    POP3S = 32768,
    SMTP = 65536,
    SMTPS = 131072,
    RTSP = 262144,
    RTMP = 524288,
    RTMPT = 1048576,
    RTMPE = 2097152,
    RTMPTE = 4194304,
    RTMPS = 8388608,
    RTMPTS = 16777216,
    GOPHER = 33554432,
    SMB = 67108864,
    SMBS = 134217728,
    MQTT = 268435456,
    GOPHERS = 536870912,
    ALL = -1
}
//# sourceMappingURL=CurlProtocol.d.ts.map