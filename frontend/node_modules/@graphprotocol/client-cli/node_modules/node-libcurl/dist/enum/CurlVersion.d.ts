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
export declare enum CurlVersion {
    /**
     * IPv6-enabled
     */
    Ipv6 = 1,
    /**
     * Kerberos V4 auth is supported (deprecated)
     */
    Kerberos4 = 2,
    /**
     * SSL options are present
     */
    Ssl = 4,
    /**
     * libz features are present
     */
    Libz = 8,
    /**
     * NTLM auth is supported
     */
    Ntlm = 16,
    /**
     * Negotiate auth is supported (deprecated)
     */
    GssNegotiate = 32,
    /**
     * libcurl was built with debug capabilities
     */
    Debug = 64,
    /**
     * Asynchronous DNS resolver is available
     */
    AsynchDns = 128,
    /**
     * SPNEGO auth is supported
     */
    Spnego = 256,
    /**
     * Supports files larger than 2GB
     */
    LargeFile = 512,
    /**
     * Internationized Domain Names are supported
     */
    Idn = 1024,
    /**
     * Built against Windows SSPI
     */
    Sspi = 2048,
    /**
     * Character conversions supported
     */
    Conv = 4096,
    /**
     * Debug memory tracking supported
     */
    CurlDebug = 8192,
    /**
     * TLS-SRP auth is supported
     */
    TlsAuthSrp = 16384,
    /**
     * NTLM delegation to winbind helper is supported
     */
    NtlmWb = 32768,
    /**
     * HTTP2 support built-in
     */
    Http2 = 65536,
    /**
     * Built against a GSS-API library
     */
    GssApi = 131072,
    /**
     * Kerberos V5 auth is supported
     */
    Kerberos5 = 262144,
    /**
     * Unix domain sockets support
     */
    UnixSockets = 524288,
    /**
     * Mozilla's Public Suffix List, used for cookie domain verification
     */
    Psl = 1048576,
    /**
     * HTTPS-proxy support built-in
     */
    HttpsProxy = 2097152,
    /**
     * Multiple SSL backends available
     */
    MultiSsl = 4194304,
    /**
     * Brotli features are present.
     */
    Brotli = 8388608,
    /**
     * Alt-Svc handling built-in
     */
    AltSvc = 16777216,
    /**
     * HTTP3 support built-in
     */
    Http3 = 33554432,
    /**
     * zstd features are present
     */
    Zstd = 67108864,
    /**
     * Unicode support on Windows
     */
    Unicode = 134217728,
    /**
     * libgsasl is supported
     */
    Gsasl = 536870912
}
//# sourceMappingURL=CurlVersion.d.ts.map