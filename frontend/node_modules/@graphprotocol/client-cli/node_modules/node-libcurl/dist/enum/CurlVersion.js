"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlVersion = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Object with constants for use with the `rawFeatures` member
 *  of {@link CurlVersionInfoNativeBindingObject | `CurlVersionInfoNativeBindingObject`}, which is returned
 *  from {@link Curl.getVersionInfo | `Curl.getVersionInfo`}.
 *
 * `CURL_VERSION_IPV6` becomes `CurlVersion.Ipv6`
 * `CURL_VERSION_GSSNEGOTIATE` becomes `CurlVersion.GssNegotiate`
 * ...
 *
 * @public
 */
var CurlVersion;
(function (CurlVersion) {
    /**
     * IPv6-enabled
     */
    CurlVersion[CurlVersion["Ipv6"] = 1] = "Ipv6";
    /**
     * Kerberos V4 auth is supported (deprecated)
     */
    CurlVersion[CurlVersion["Kerberos4"] = 2] = "Kerberos4";
    /**
     * SSL options are present
     */
    CurlVersion[CurlVersion["Ssl"] = 4] = "Ssl";
    /**
     * libz features are present
     */
    CurlVersion[CurlVersion["Libz"] = 8] = "Libz";
    /**
     * NTLM auth is supported
     */
    CurlVersion[CurlVersion["Ntlm"] = 16] = "Ntlm";
    /**
     * Negotiate auth is supported (deprecated)
     */
    CurlVersion[CurlVersion["GssNegotiate"] = 32] = "GssNegotiate";
    /**
     * libcurl was built with debug capabilities
     */
    CurlVersion[CurlVersion["Debug"] = 64] = "Debug";
    /**
     * Asynchronous DNS resolver is available
     */
    CurlVersion[CurlVersion["AsynchDns"] = 128] = "AsynchDns";
    /**
     * SPNEGO auth is supported
     */
    CurlVersion[CurlVersion["Spnego"] = 256] = "Spnego";
    /**
     * Supports files larger than 2GB
     */
    CurlVersion[CurlVersion["LargeFile"] = 512] = "LargeFile";
    /**
     * Internationized Domain Names are supported
     */
    CurlVersion[CurlVersion["Idn"] = 1024] = "Idn";
    /**
     * Built against Windows SSPI
     */
    CurlVersion[CurlVersion["Sspi"] = 2048] = "Sspi";
    /**
     * Character conversions supported
     */
    CurlVersion[CurlVersion["Conv"] = 4096] = "Conv";
    /**
     * Debug memory tracking supported
     */
    CurlVersion[CurlVersion["CurlDebug"] = 8192] = "CurlDebug";
    /**
     * TLS-SRP auth is supported
     */
    CurlVersion[CurlVersion["TlsAuthSrp"] = 16384] = "TlsAuthSrp";
    /**
     * NTLM delegation to winbind helper is supported
     */
    CurlVersion[CurlVersion["NtlmWb"] = 32768] = "NtlmWb";
    /**
     * HTTP2 support built-in
     */
    CurlVersion[CurlVersion["Http2"] = 65536] = "Http2";
    /**
     * Built against a GSS-API library
     */
    CurlVersion[CurlVersion["GssApi"] = 131072] = "GssApi";
    /**
     * Kerberos V5 auth is supported
     */
    CurlVersion[CurlVersion["Kerberos5"] = 262144] = "Kerberos5";
    /**
     * Unix domain sockets support
     */
    CurlVersion[CurlVersion["UnixSockets"] = 524288] = "UnixSockets";
    /**
     * Mozilla's Public Suffix List, used for cookie domain verification
     */
    CurlVersion[CurlVersion["Psl"] = 1048576] = "Psl";
    /**
     * HTTPS-proxy support built-in
     */
    CurlVersion[CurlVersion["HttpsProxy"] = 2097152] = "HttpsProxy";
    /**
     * Multiple SSL backends available
     */
    CurlVersion[CurlVersion["MultiSsl"] = 4194304] = "MultiSsl";
    /**
     * Brotli features are present.
     */
    CurlVersion[CurlVersion["Brotli"] = 8388608] = "Brotli";
    /**
     * Alt-Svc handling built-in
     */
    CurlVersion[CurlVersion["AltSvc"] = 16777216] = "AltSvc";
    /**
     * HTTP3 support built-in
     */
    CurlVersion[CurlVersion["Http3"] = 33554432] = "Http3";
    /**
     * zstd features are present
     */
    CurlVersion[CurlVersion["Zstd"] = 67108864] = "Zstd";
    /**
     * Unicode support on Windows
     */
    CurlVersion[CurlVersion["Unicode"] = 134217728] = "Unicode";
    // TODO(jonathan): when we add HSTS support - add it in here as 1 << 28
    /**
     * libgsasl is supported
     */
    CurlVersion[CurlVersion["Gsasl"] = 536870912] = "Gsasl";
})(CurlVersion || (exports.CurlVersion = CurlVersion = {}));
//# sourceMappingURL=CurlVersion.js.map