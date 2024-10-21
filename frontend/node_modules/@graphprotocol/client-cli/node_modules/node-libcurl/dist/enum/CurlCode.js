"use strict";
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlShareCode = exports.CurlCode = exports.CurlMultiCode = void 0;
// https://github.com/curl/curl/blob/7e35eb7729/include/curl/multi.h#L61
/**
 * @public
 */
var CurlMultiCode;
(function (CurlMultiCode) {
    CurlMultiCode[CurlMultiCode["CURLM_CALL_MULTI_PERFORM"] = -1] = "CURLM_CALL_MULTI_PERFORM"; /* please call curl_multi_perform() or
    curl_multi_socket*() soon */
    CurlMultiCode[CurlMultiCode["CURLM_OK"] = 0] = "CURLM_OK";
    CurlMultiCode[CurlMultiCode["CURLM_BAD_HANDLE"] = 1] = "CURLM_BAD_HANDLE"; /* the passed-in handle is not a valid CURLM handle */
    CurlMultiCode[CurlMultiCode["CURLM_BAD_EASY_HANDLE"] = 2] = "CURLM_BAD_EASY_HANDLE"; /* an easy handle was not good/valid */
    CurlMultiCode[CurlMultiCode["CURLM_OUT_OF_MEMORY"] = 3] = "CURLM_OUT_OF_MEMORY"; /* if you ever get this, you're in deep sh*t */
    CurlMultiCode[CurlMultiCode["CURLM_INTERNAL_ERROR"] = 4] = "CURLM_INTERNAL_ERROR"; /* this is a libcurl bug */
    CurlMultiCode[CurlMultiCode["CURLM_BAD_SOCKET"] = 5] = "CURLM_BAD_SOCKET"; /* the passed in socket argument did not match */
    CurlMultiCode[CurlMultiCode["CURLM_UNKNOWN_OPTION"] = 6] = "CURLM_UNKNOWN_OPTION"; /* curl_multi_setopt() with unsupported option */
    CurlMultiCode[CurlMultiCode["CURLM_ADDED_ALREADY"] = 7] = "CURLM_ADDED_ALREADY"; /* an easy handle already added to a multi handle was
    attempted to get added - again */
    CurlMultiCode[CurlMultiCode["CURLM_RECURSIVE_API_CALL"] = 8] = "CURLM_RECURSIVE_API_CALL"; /* an api function was called from inside a
    callback */
    CurlMultiCode[CurlMultiCode["CURLM_WAKEUP_FAILURE"] = 9] = "CURLM_WAKEUP_FAILURE"; /* wakeup is unavailable or failed */
    CurlMultiCode[CurlMultiCode["CURLM_BAD_FUNCTION_ARGUMENT"] = 10] = "CURLM_BAD_FUNCTION_ARGUMENT"; /* function called with a bad parameter */
    CurlMultiCode[CurlMultiCode["CURLM_LAST"] = 11] = "CURLM_LAST";
    /* just to make code nicer when using curl_multi_socket() you can now check
       for CURLM_CALL_MULTI_SOCKET too in the same style it works for
       curl_multi_perform() and CURLM_CALL_MULTI_PERFORM */
    CurlMultiCode[CurlMultiCode["CURLM_CALL_MULTI_SOCKET"] = -1] = "CURLM_CALL_MULTI_SOCKET";
})(CurlMultiCode || (exports.CurlMultiCode = CurlMultiCode = {}));
// https://github.com/curl/curl/blob/e1be825453/include/curl/curl.h#L478
/**
 * @public
 */
var CurlCode;
(function (CurlCode) {
    CurlCode[CurlCode["CURLE_OK"] = 0] = "CURLE_OK";
    CurlCode[CurlCode["CURLE_UNSUPPORTED_PROTOCOL"] = 1] = "CURLE_UNSUPPORTED_PROTOCOL"; /* 1 */
    CurlCode[CurlCode["CURLE_FAILED_INIT"] = 2] = "CURLE_FAILED_INIT"; /* 2 */
    CurlCode[CurlCode["CURLE_URL_MALFORMAT"] = 3] = "CURLE_URL_MALFORMAT"; /* 3 */
    CurlCode[CurlCode["CURLE_NOT_BUILT_IN"] = 4] = "CURLE_NOT_BUILT_IN"; /* 4 - [was obsoleted in August 2007 for
                                      7.17.0, reused in April 2011 for 7.21.5] */
    CurlCode[CurlCode["CURLE_COULDNT_RESOLVE_PROXY"] = 5] = "CURLE_COULDNT_RESOLVE_PROXY"; /* 5 */
    CurlCode[CurlCode["CURLE_COULDNT_RESOLVE_HOST"] = 6] = "CURLE_COULDNT_RESOLVE_HOST"; /* 6 */
    CurlCode[CurlCode["CURLE_COULDNT_CONNECT"] = 7] = "CURLE_COULDNT_CONNECT"; /* 7 */
    CurlCode[CurlCode["CURLE_WEIRD_SERVER_REPLY"] = 8] = "CURLE_WEIRD_SERVER_REPLY"; /* 8 */
    CurlCode[CurlCode["CURLE_REMOTE_ACCESS_DENIED"] = 9] = "CURLE_REMOTE_ACCESS_DENIED"; /* 9 a service was denied by the server
                                      due to lack of access - when login fails
                                      this is not returned. */
    CurlCode[CurlCode["CURLE_FTP_ACCEPT_FAILED"] = 10] = "CURLE_FTP_ACCEPT_FAILED"; /* 10 - [was obsoleted in April 2006 for
                                      7.15.4, reused in Dec 2011 for 7.24.0]*/
    CurlCode[CurlCode["CURLE_FTP_WEIRD_PASS_REPLY"] = 11] = "CURLE_FTP_WEIRD_PASS_REPLY"; /* 11 */
    CurlCode[CurlCode["CURLE_FTP_ACCEPT_TIMEOUT"] = 12] = "CURLE_FTP_ACCEPT_TIMEOUT"; /* 12 - timeout occurred accepting server
                                      [was obsoleted in August 2007 for 7.17.0,
                                      reused in Dec 2011 for 7.24.0]*/
    CurlCode[CurlCode["CURLE_FTP_WEIRD_PASV_REPLY"] = 13] = "CURLE_FTP_WEIRD_PASV_REPLY"; /* 13 */
    CurlCode[CurlCode["CURLE_FTP_WEIRD_227_FORMAT"] = 14] = "CURLE_FTP_WEIRD_227_FORMAT"; /* 14 */
    CurlCode[CurlCode["CURLE_FTP_CANT_GET_HOST"] = 15] = "CURLE_FTP_CANT_GET_HOST"; /* 15 */
    CurlCode[CurlCode["CURLE_HTTP2"] = 16] = "CURLE_HTTP2"; /* 16 - A problem in the http2 framing layer.
                                      [was obsoleted in August 2007 for 7.17.0,
                                      reused in July 2014 for 7.38.0] */
    CurlCode[CurlCode["CURLE_FTP_COULDNT_SET_TYPE"] = 17] = "CURLE_FTP_COULDNT_SET_TYPE"; /* 17 */
    CurlCode[CurlCode["CURLE_PARTIAL_FILE"] = 18] = "CURLE_PARTIAL_FILE"; /* 18 */
    CurlCode[CurlCode["CURLE_FTP_COULDNT_RETR_FILE"] = 19] = "CURLE_FTP_COULDNT_RETR_FILE"; /* 19 */
    CurlCode[CurlCode["CURLE_OBSOLETE20"] = 20] = "CURLE_OBSOLETE20"; /* 20 - NOT USED */
    CurlCode[CurlCode["CURLE_QUOTE_ERROR"] = 21] = "CURLE_QUOTE_ERROR"; /* 21 - quote command failure */
    CurlCode[CurlCode["CURLE_HTTP_RETURNED_ERROR"] = 22] = "CURLE_HTTP_RETURNED_ERROR"; /* 22 */
    CurlCode[CurlCode["CURLE_WRITE_ERROR"] = 23] = "CURLE_WRITE_ERROR"; /* 23 */
    CurlCode[CurlCode["CURLE_OBSOLETE24"] = 24] = "CURLE_OBSOLETE24"; /* 24 - NOT USED */
    CurlCode[CurlCode["CURLE_UPLOAD_FAILED"] = 25] = "CURLE_UPLOAD_FAILED"; /* 25 - failed upload "command" */
    CurlCode[CurlCode["CURLE_READ_ERROR"] = 26] = "CURLE_READ_ERROR"; /* 26 - couldn't open/read from file */
    CurlCode[CurlCode["CURLE_OUT_OF_MEMORY"] = 27] = "CURLE_OUT_OF_MEMORY"; /* 27 */
    /* Note: CURLE_OUT_OF_MEMORY may sometimes indicate a conversion error
             instead of a memory allocation error if CURL_DOES_CONVERSIONS
             is defined
    */
    CurlCode[CurlCode["CURLE_OPERATION_TIMEDOUT"] = 28] = "CURLE_OPERATION_TIMEDOUT"; /* 28 - the timeout time was reached */
    CurlCode[CurlCode["CURLE_OBSOLETE29"] = 29] = "CURLE_OBSOLETE29"; /* 29 - NOT USED */
    CurlCode[CurlCode["CURLE_FTP_PORT_FAILED"] = 30] = "CURLE_FTP_PORT_FAILED"; /* 30 - FTP PORT operation failed */
    CurlCode[CurlCode["CURLE_FTP_COULDNT_USE_REST"] = 31] = "CURLE_FTP_COULDNT_USE_REST"; /* 31 - the REST command failed */
    CurlCode[CurlCode["CURLE_OBSOLETE32"] = 32] = "CURLE_OBSOLETE32"; /* 32 - NOT USED */
    CurlCode[CurlCode["CURLE_RANGE_ERROR"] = 33] = "CURLE_RANGE_ERROR"; /* 33 - RANGE "command" didn't work */
    CurlCode[CurlCode["CURLE_HTTP_POST_ERROR"] = 34] = "CURLE_HTTP_POST_ERROR"; /* 34 */
    CurlCode[CurlCode["CURLE_SSL_CONNECT_ERROR"] = 35] = "CURLE_SSL_CONNECT_ERROR"; /* 35 - wrong when connecting with SSL */
    CurlCode[CurlCode["CURLE_BAD_DOWNLOAD_RESUME"] = 36] = "CURLE_BAD_DOWNLOAD_RESUME"; /* 36 - couldn't resume download */
    CurlCode[CurlCode["CURLE_FILE_COULDNT_READ_FILE"] = 37] = "CURLE_FILE_COULDNT_READ_FILE"; /* 37 */
    CurlCode[CurlCode["CURLE_LDAP_CANNOT_BIND"] = 38] = "CURLE_LDAP_CANNOT_BIND"; /* 38 */
    CurlCode[CurlCode["CURLE_LDAP_SEARCH_FAILED"] = 39] = "CURLE_LDAP_SEARCH_FAILED"; /* 39 */
    CurlCode[CurlCode["CURLE_OBSOLETE40"] = 40] = "CURLE_OBSOLETE40"; /* 40 - NOT USED */
    CurlCode[CurlCode["CURLE_FUNCTION_NOT_FOUND"] = 41] = "CURLE_FUNCTION_NOT_FOUND"; /* 41 - NOT USED starting with 7.53.0 */
    CurlCode[CurlCode["CURLE_ABORTED_BY_CALLBACK"] = 42] = "CURLE_ABORTED_BY_CALLBACK"; /* 42 */
    CurlCode[CurlCode["CURLE_BAD_FUNCTION_ARGUMENT"] = 43] = "CURLE_BAD_FUNCTION_ARGUMENT"; /* 43 */
    CurlCode[CurlCode["CURLE_OBSOLETE44"] = 44] = "CURLE_OBSOLETE44"; /* 44 - NOT USED */
    CurlCode[CurlCode["CURLE_INTERFACE_FAILED"] = 45] = "CURLE_INTERFACE_FAILED"; /* 45 - CURLOPT_INTERFACE failed */
    CurlCode[CurlCode["CURLE_OBSOLETE46"] = 46] = "CURLE_OBSOLETE46"; /* 46 - NOT USED */
    CurlCode[CurlCode["CURLE_TOO_MANY_REDIRECTS"] = 47] = "CURLE_TOO_MANY_REDIRECTS"; /* 47 - catch endless re-direct loops */
    CurlCode[CurlCode["CURLE_UNKNOWN_OPTION"] = 48] = "CURLE_UNKNOWN_OPTION"; /* 48 - User specified an unknown option */
    CurlCode[CurlCode["CURLE_SETOPT_OPTION_SYNTAX"] = 49] = "CURLE_SETOPT_OPTION_SYNTAX"; /* 49 - Malformed telnet option */
    CurlCode[CurlCode["CURLE_OBSOLETE50"] = 50] = "CURLE_OBSOLETE50"; /* 50 - NOT USED */
    CurlCode[CurlCode["CURLE_OBSOLETE51"] = 51] = "CURLE_OBSOLETE51"; /* 51 - NOT USED */
    CurlCode[CurlCode["CURLE_GOT_NOTHING"] = 52] = "CURLE_GOT_NOTHING"; /* 52 - when this is a specific error */
    CurlCode[CurlCode["CURLE_SSL_ENGINE_NOTFOUND"] = 53] = "CURLE_SSL_ENGINE_NOTFOUND"; /* 53 - SSL crypto engine not found */
    CurlCode[CurlCode["CURLE_SSL_ENGINE_SETFAILED"] = 54] = "CURLE_SSL_ENGINE_SETFAILED"; /* 54 - can not set SSL crypto engine as
                                      default */
    CurlCode[CurlCode["CURLE_SEND_ERROR"] = 55] = "CURLE_SEND_ERROR"; /* 55 - failed sending network data */
    CurlCode[CurlCode["CURLE_RECV_ERROR"] = 56] = "CURLE_RECV_ERROR"; /* 56 - failure in receiving network data */
    CurlCode[CurlCode["CURLE_OBSOLETE57"] = 57] = "CURLE_OBSOLETE57"; /* 57 - NOT IN USE */
    CurlCode[CurlCode["CURLE_SSL_CERTPROBLEM"] = 58] = "CURLE_SSL_CERTPROBLEM"; /* 58 - problem with the local certificate */
    CurlCode[CurlCode["CURLE_SSL_CIPHER"] = 59] = "CURLE_SSL_CIPHER"; /* 59 - couldn't use specified cipher */
    CurlCode[CurlCode["CURLE_PEER_FAILED_VERIFICATION"] = 60] = "CURLE_PEER_FAILED_VERIFICATION"; /* 60 - peer's certificate or fingerprint
                                       wasn't verified fine */
    CurlCode[CurlCode["CURLE_BAD_CONTENT_ENCODING"] = 61] = "CURLE_BAD_CONTENT_ENCODING"; /* 61 - Unrecognized/bad encoding */
    CurlCode[CurlCode["CURLE_LDAP_INVALID_URL"] = 62] = "CURLE_LDAP_INVALID_URL"; /* 62 - Invalid LDAP URL */
    CurlCode[CurlCode["CURLE_FILESIZE_EXCEEDED"] = 63] = "CURLE_FILESIZE_EXCEEDED"; /* 63 - Maximum file size exceeded */
    CurlCode[CurlCode["CURLE_USE_SSL_FAILED"] = 64] = "CURLE_USE_SSL_FAILED"; /* 64 - Requested FTP SSL level failed */
    CurlCode[CurlCode["CURLE_SEND_FAIL_REWIND"] = 65] = "CURLE_SEND_FAIL_REWIND"; /* 65 - Sending the data requires a rewind
                                      that failed */
    CurlCode[CurlCode["CURLE_SSL_ENGINE_INITFAILED"] = 66] = "CURLE_SSL_ENGINE_INITFAILED"; /* 66 - failed to initialise ENGINE */
    CurlCode[CurlCode["CURLE_LOGIN_DENIED"] = 67] = "CURLE_LOGIN_DENIED"; /* 67 - user, password or similar was not
                                      accepted and we failed to login */
    CurlCode[CurlCode["CURLE_TFTP_NOTFOUND"] = 68] = "CURLE_TFTP_NOTFOUND"; /* 68 - file not found on server */
    CurlCode[CurlCode["CURLE_TFTP_PERM"] = 69] = "CURLE_TFTP_PERM"; /* 69 - permission problem on server */
    CurlCode[CurlCode["CURLE_REMOTE_DISK_FULL"] = 70] = "CURLE_REMOTE_DISK_FULL"; /* 70 - out of disk space on server */
    CurlCode[CurlCode["CURLE_TFTP_ILLEGAL"] = 71] = "CURLE_TFTP_ILLEGAL"; /* 71 - Illegal TFTP operation */
    CurlCode[CurlCode["CURLE_TFTP_UNKNOWNID"] = 72] = "CURLE_TFTP_UNKNOWNID"; /* 72 - Unknown transfer ID */
    CurlCode[CurlCode["CURLE_REMOTE_FILE_EXISTS"] = 73] = "CURLE_REMOTE_FILE_EXISTS"; /* 73 - File already exists */
    CurlCode[CurlCode["CURLE_TFTP_NOSUCHUSER"] = 74] = "CURLE_TFTP_NOSUCHUSER"; /* 74 - No such user */
    CurlCode[CurlCode["CURLE_CONV_FAILED"] = 75] = "CURLE_CONV_FAILED"; /* 75 - conversion failed */
    CurlCode[CurlCode["CURLE_CONV_REQD"] = 76] = "CURLE_CONV_REQD"; /* 76 - caller must register conversion
                                      callbacks using curl_easy_setopt options
                                      CURLOPT_CONV_FROM_NETWORK_FUNCTION,
                                      CURLOPT_CONV_TO_NETWORK_FUNCTION, and
                                      CURLOPT_CONV_FROM_UTF8_FUNCTION */
    CurlCode[CurlCode["CURLE_SSL_CACERT_BADFILE"] = 77] = "CURLE_SSL_CACERT_BADFILE"; /* 77 - could not load CACERT file, missing
                                      or wrong format */
    CurlCode[CurlCode["CURLE_REMOTE_FILE_NOT_FOUND"] = 78] = "CURLE_REMOTE_FILE_NOT_FOUND"; /* 78 - remote file not found */
    CurlCode[CurlCode["CURLE_SSH"] = 79] = "CURLE_SSH"; /* 79 - error from the SSH layer, somewhat
                                      generic so the error message will be of
                                      interest when this has happened */
    CurlCode[CurlCode["CURLE_SSL_SHUTDOWN_FAILED"] = 80] = "CURLE_SSL_SHUTDOWN_FAILED"; /* 80 - Failed to shut down the SSL
                                      connection */
    CurlCode[CurlCode["CURLE_AGAIN"] = 81] = "CURLE_AGAIN"; /* 81 - socket is not ready for send/recv,
                                      wait till it's ready and try again (Added
                                      in 7.18.2) */
    CurlCode[CurlCode["CURLE_SSL_CRL_BADFILE"] = 82] = "CURLE_SSL_CRL_BADFILE"; /* 82 - could not load CRL file, missing or
                                      wrong format (Added in 7.19.0) */
    CurlCode[CurlCode["CURLE_SSL_ISSUER_ERROR"] = 83] = "CURLE_SSL_ISSUER_ERROR"; /* 83 - Issuer check failed.  (Added in
                                      7.19.0) */
    CurlCode[CurlCode["CURLE_FTP_PRET_FAILED"] = 84] = "CURLE_FTP_PRET_FAILED"; /* 84 - a PRET command failed */
    CurlCode[CurlCode["CURLE_RTSP_CSEQ_ERROR"] = 85] = "CURLE_RTSP_CSEQ_ERROR"; /* 85 - mismatch of RTSP CSeq numbers */
    CurlCode[CurlCode["CURLE_RTSP_SESSION_ERROR"] = 86] = "CURLE_RTSP_SESSION_ERROR"; /* 86 - mismatch of RTSP Session Ids */
    CurlCode[CurlCode["CURLE_FTP_BAD_FILE_LIST"] = 87] = "CURLE_FTP_BAD_FILE_LIST"; /* 87 - unable to parse FTP file list */
    CurlCode[CurlCode["CURLE_CHUNK_FAILED"] = 88] = "CURLE_CHUNK_FAILED"; /* 88 - chunk callback reported error */
    CurlCode[CurlCode["CURLE_NO_CONNECTION_AVAILABLE"] = 89] = "CURLE_NO_CONNECTION_AVAILABLE"; /* 89 - No connection available, the
                                      session will be queued */
    CurlCode[CurlCode["CURLE_SSL_PINNEDPUBKEYNOTMATCH"] = 90] = "CURLE_SSL_PINNEDPUBKEYNOTMATCH"; /* 90 - specified pinned public key did not
                                       match */
    CurlCode[CurlCode["CURLE_SSL_INVALIDCERTSTATUS"] = 91] = "CURLE_SSL_INVALIDCERTSTATUS"; /* 91 - invalid certificate status */
    CurlCode[CurlCode["CURLE_HTTP2_STREAM"] = 92] = "CURLE_HTTP2_STREAM"; /* 92 - stream error in HTTP/2 framing layer */
    CurlCode[CurlCode["CURLE_RECURSIVE_API_CALL"] = 93] = "CURLE_RECURSIVE_API_CALL"; /* 93 - an api function was called from inside a callback */
    CurlCode[CurlCode["CURLE_AUTH_ERROR"] = 94] = "CURLE_AUTH_ERROR"; /* 94 - an authentication function returned an error */
    CurlCode[CurlCode["CURLE_HTTP3"] = 95] = "CURLE_HTTP3"; /* 95 - An HTTP/3 layer problem */
    CurlCode[CurlCode["CURLE_QUIC_CONNECT_ERROR"] = 96] = "CURLE_QUIC_CONNECT_ERROR"; /* 96 - QUIC connection error */
    CurlCode[CurlCode["CURLE_PROXY"] = 97] = "CURLE_PROXY"; /* 97 - proxy handshake error */
    CurlCode[CurlCode["CURLE_SSL_CLIENTCERT"] = 98] = "CURLE_SSL_CLIENTCERT"; /* 98 - client-side certificate required */
    CurlCode[CurlCode["CURLE_LAST"] = 99] = "CURLE_LAST";
    /*  compatibility with older names */
    CurlCode[CurlCode["CURLE_FTP_WEIRD_SERVER_REPLY"] = 8] = "CURLE_FTP_WEIRD_SERVER_REPLY";
    CurlCode[CurlCode["CURLE_SSL_CACERT"] = 60] = "CURLE_SSL_CACERT";
    CurlCode[CurlCode["CURLE_UNKNOWN_TELNET_OPTION"] = 48] = "CURLE_UNKNOWN_TELNET_OPTION";
    CurlCode[CurlCode["CURLE_SSL_PEER_CERTIFICATE"] = 60] = "CURLE_SSL_PEER_CERTIFICATE";
    CurlCode[CurlCode["CURLE_TELNET_OPTION_SYNTAX"] = 49] = "CURLE_TELNET_OPTION_SYNTAX";
    CurlCode[CurlCode["CURLE_FTP_ACCESS_DENIED"] = 9] = "CURLE_FTP_ACCESS_DENIED";
    CurlCode[CurlCode["CURLE_FTP_COULDNT_SET_BINARY"] = 17] = "CURLE_FTP_COULDNT_SET_BINARY";
    CurlCode[CurlCode["CURLE_FTP_QUOTE_ERROR"] = 21] = "CURLE_FTP_QUOTE_ERROR";
    CurlCode[CurlCode["CURLE_TFTP_DISKFULL"] = 70] = "CURLE_TFTP_DISKFULL";
    CurlCode[CurlCode["CURLE_TFTP_EXISTS"] = 73] = "CURLE_TFTP_EXISTS";
    CurlCode[CurlCode["CURLE_HTTP_RANGE_ERROR"] = 33] = "CURLE_HTTP_RANGE_ERROR";
    CurlCode[CurlCode["CURLE_FTP_SSL_FAILED"] = 64] = "CURLE_FTP_SSL_FAILED";
    /* The following were added earlier */
    CurlCode[CurlCode["CURLE_OPERATION_TIMEOUTED"] = 28] = "CURLE_OPERATION_TIMEOUTED";
    CurlCode[CurlCode["CURLE_HTTP_NOT_FOUND"] = 22] = "CURLE_HTTP_NOT_FOUND";
    CurlCode[CurlCode["CURLE_HTTP_PORT_FAILED"] = 45] = "CURLE_HTTP_PORT_FAILED";
    CurlCode[CurlCode["CURLE_FTP_COULDNT_STOR_FILE"] = 25] = "CURLE_FTP_COULDNT_STOR_FILE";
    CurlCode[CurlCode["CURLE_FTP_PARTIAL_FILE"] = 18] = "CURLE_FTP_PARTIAL_FILE";
    CurlCode[CurlCode["CURLE_FTP_BAD_DOWNLOAD_RESUME"] = 36] = "CURLE_FTP_BAD_DOWNLOAD_RESUME";
})(CurlCode || (exports.CurlCode = CurlCode = {}));
// https://github.com/curl/curl/blob/e1be825453/include/curl/curl.h#L2675
/**
 * @public
 */
var CurlShareCode;
(function (CurlShareCode) {
    CurlShareCode[CurlShareCode["CURLSHE_OK"] = 0] = "CURLSHE_OK"; /* all is fine */
    CurlShareCode[CurlShareCode["CURLSHE_BAD_OPTION"] = 1] = "CURLSHE_BAD_OPTION"; /* 1 */
    CurlShareCode[CurlShareCode["CURLSHE_IN_USE"] = 2] = "CURLSHE_IN_USE"; /* 2 */
    CurlShareCode[CurlShareCode["CURLSHE_INVALID"] = 3] = "CURLSHE_INVALID"; /* 3 */
    CurlShareCode[CurlShareCode["CURLSHE_NOMEM"] = 4] = "CURLSHE_NOMEM"; /* 4 out of memory */
    CurlShareCode[CurlShareCode["CURLSHE_NOT_BUILT_IN"] = 5] = "CURLSHE_NOT_BUILT_IN"; /* 5 feature not present in lib */
    CurlShareCode[CurlShareCode["CURLSHE_LAST"] = 6] = "CURLSHE_LAST";
})(CurlShareCode || (exports.CurlShareCode = CurlShareCode = {}));
//# sourceMappingURL=CurlCode.js.map