/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { EventEmitter } from 'events';
import { Readable } from 'stream';
import { EasyNativeBinding, FileInfo, HttpPostField } from './types';
import { Share } from './Share';
import { HeaderInfo } from './parseHeaders';
import { DataCallbackOptions, ProgressCallbackOptions, StringListOptions, BlobOptions, CurlOptionName, SpecificOptions, CurlOptionValueType } from './generated/CurlOption';
import { CurlInfoName } from './generated/CurlInfo';
import { CurlChunk } from './enum/CurlChunk';
import { CurlCode } from './enum/CurlCode';
import { CurlFeature } from './enum/CurlFeature';
import { CurlFnMatchFunc } from './enum/CurlFnMatchFunc';
import { CurlFtpMethod } from './enum/CurlFtpMethod';
import { CurlFtpSsl } from './enum/CurlFtpSsl';
import { CurlGlobalInit } from './enum/CurlGlobalInit';
import { CurlGssApi } from './enum/CurlGssApi';
import { CurlHeader } from './enum/CurlHeader';
import { CurlHsts, CurlHstsCacheEntry, CurlHstsCacheCount } from './enum/CurlHsts';
import { CurlHttpVersion } from './enum/CurlHttpVersion';
import { CurlInfoDebug } from './enum/CurlInfoDebug';
import { CurlIpResolve } from './enum/CurlIpResolve';
import { CurlNetrc } from './enum/CurlNetrc';
import { CurlPause } from './enum/CurlPause';
import { CurlPreReqFunc } from './enum/CurlPreReqFunc';
import { CurlProgressFunc } from './enum/CurlProgressFunc';
import { CurlProtocol } from './enum/CurlProtocol';
import { CurlProxy } from './enum/CurlProxy';
import { CurlRtspRequest } from './enum/CurlRtspRequest';
import { CurlSshAuth } from './enum/CurlSshAuth';
import { CurlSslOpt } from './enum/CurlSslOpt';
import { CurlSslVersion } from './enum/CurlSslVersion';
import { CurlTimeCond } from './enum/CurlTimeCond';
import { CurlUseSsl } from './enum/CurlUseSsl';
import { CurlInfoNameSpecific, GetInfoReturn } from './types/EasyNativeBinding';
/**
 * Wrapper around {@link "Easy".Easy | `Easy`} class with a more *nodejs-friendly* interface.
 *
 * This uses an internal {@link "Multi".Multi | `Multi`} instance allowing for asynchronous
 * requests.
 *
 * @public
 */
declare class Curl extends EventEmitter {
    /**
     * Calls [`curl_global_init()`](http://curl.haxx.se/libcurl/c/curl_global_init.html).
     *
     * For **flags** see the the enum {@link CurlGlobalInit | `CurlGlobalInit`}.
     *
     * This is automatically called when the addon is loaded, to disable this, set the environment variable
     *  `NODE_LIBCURL_DISABLE_GLOBAL_INIT_CALL=false`
     */
    static globalInit: (flags: CurlGlobalInit) => number;
    /**
     * Calls [`curl_global_cleanup()`](http://curl.haxx.se/libcurl/c/curl_global_cleanup.html)
     *
     * This is automatically called when the process is exiting.
     */
    static globalCleanup: () => void;
    /**
     * Returns libcurl version string.
     *
     * The string shows which libraries libcurl was built with and their versions, example:
     * ```
     * libcurl/7.69.1-DEV OpenSSL/1.1.1d zlib/1.2.11 WinIDN libssh2/1.9.0_DEV nghttp2/1.40.0
     * ```
     */
    static getVersion: () => string;
    /**
     * This is the default user agent that is going to be used on all `Curl` instances.
     *
     * You can overwrite this in a per instance basis, calling `curlHandle.setOpt('USERAGENT', 'my-user-agent/1.0')`, or
     *  by directly changing this property so it affects all newly created `Curl` instances.
     *
     * To disable this behavior set this property to `null`.
     */
    static defaultUserAgent: string;
    /**
     * Integer representing the current libcurl version.
     *
     * It was built the following way:
     * ```
     * <8 bits major number> | <8 bits minor number> | <8 bits patch number>.
     * ```
     * Version `7.69.1` is therefore returned as `0x074501` / `476417`
     */
    static VERSION_NUM: number;
    /**
     * This is a object with members resembling the `CURLINFO_*` libcurl constants.
     *
     * It can be used with {@link "Easy".Easy.getInfo | `Easy#getInfo`} or {@link getInfo | `Curl#getInfo`}.
     *
     * See the official documentation of [`curl_easy_getinfo()`](http://curl.haxx.se/libcurl/c/curl_easy_getinfo.html)
     *  for reference.
     *
     * `CURLINFO_EFFECTIVE_URL` becomes `Curl.info.EFFECTIVE_URL`
     */
    static info: import("./generated/CurlInfo").CurlInfo;
    /**
     * This is a object with members resembling the `CURLOPT_*` libcurl constants.
     *
     * It can be used with {@link "Easy".Easy.setOpt | `Easy#setOpt`} or {@link setOpt | `Curl#setOpt`}.
     *
     * See the official documentation of [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     *  for reference.
     *
     * `CURLOPT_URL` becomes `Curl.option.URL`
     */
    static option: import("./generated/CurlOption").CurlOption;
    /**
     * Returns the number of handles currently open in the internal {@link "Multi".Multi | `Multi`} handle being used.
     */
    static getCount: () => number;
    /**
     * Whether this instance is running or not ({@link perform | `perform()`} was called).
     *
     * Make sure to not change their value, otherwise unexpected behavior would happen.
     *
     * This is marked as protected only with the TSDoc to not cause a breaking change.
     *
     * @protected
     */
    isRunning: boolean;
    /**
     * Whether this instance is closed or not ({@link close | `close()`} was called).
     *
     * Make sure to not change their value, otherwise unexpected behavior would happen.
     */
    get isOpen(): boolean;
    /**
     * Internal Easy handle being used
     */
    protected handle: EasyNativeBinding;
    /**
     * Stores current response payload.
     *
     * This will not store anything in case {@link CurlFeature.NoDataStorage | `NoDataStorage`} flag is enabled
     */
    protected chunks: Buffer[];
    /**
     * Current response length.
     *
     * Will always be zero in case {@link CurlFeature.NoDataStorage | `NoDataStorage`} flag is enabled
     */
    protected chunksLength: number;
    /**
     * Stores current headers payload.
     *
     * This will not store anything in case {@link CurlFeature.NoDataStorage | `NoDataStorage`} flag is enabled
     */
    protected headerChunks: Buffer[];
    /**
     * Current headers length.
     *
     * Will always be zero in case {@link CurlFeature.NoDataStorage | `NoDataStorage`} flag is enabled
     */
    protected headerChunksLength: number;
    /**
     * Currently enabled features.
     *
     * See {@link enable | `enable`} and {@link disable | `disable`}
     */
    protected features: CurlFeature;
    protected writeFunctionStream: Readable | null;
    protected readFunctionStream: Readable | null;
    protected streamReadFunctionCallbacksToClean: Array<[
        Readable,
        string,
        (...args: any[]) => void
    ]>;
    protected streamReadFunctionShouldEnd: boolean;
    protected streamReadFunctionShouldPause: boolean;
    protected streamReadFunctionPaused: boolean;
    protected streamWriteFunctionHighWaterMark: number | undefined;
    protected streamWriteFunctionShouldPause: boolean;
    protected streamWriteFunctionPaused: boolean;
    protected streamWriteFunctionFirstRun: boolean;
    protected streamPauseNext: boolean;
    protected streamContinueNext: boolean;
    protected streamError: false | Error;
    protected streamUserSuppliedProgressFunction: CurlOptionValueType['xferInfoFunction'];
    /**
     * @param cloneHandle {@link "Easy".Easy | `Easy`} handle that should be used instead of creating a new one.
     */
    constructor(cloneHandle?: EasyNativeBinding);
    /**
     * Callback called when an error is thrown on this handle.
     *
     * This is called from the internal callback we use with the {@link "Multi".Multi.onMessage | `onMessage`}
     *  method of the global {@link "Multi".Multi | `Multi`} handle used by all `Curl` instances.
     *
     * @protected
     */
    onError(error: Error, errorCode: CurlCode): void;
    /**
     * Callback called when this handle has finished the request.
     *
     * This is called from the internal callback we use with the {@link "Multi".Multi.onMessage | `onMessage`}
     *  method of the global {@link "Multi".Multi | `Multi`} handle used by all `Curl` instances.
     *
     * This should not be called in any other way.
     *
     * @protected
     */
    onEnd(): void;
    /**
     * Enables a feature, must not be used while a request is running.
     *
     * Use {@link CurlFeature | `CurlFeature`} for predefined constants.
     */
    enable(bitmask: CurlFeature): this;
    /**
     * Disables a feature, must not be used while a request is running.
     *
     * Use {@link CurlFeature | `CurlFeature`} for predefined constants.
     */
    disable(bitmask: CurlFeature): this;
    /**
     * This will set an internal `READFUNCTION` callback that will read all the data from this stream.
     *
     * One usage for that is to upload data directly from streams. Example:
     *
     * ```typescript
     *  const curl = new Curl()
     *  curl.setOpt('URL', 'https://some-domain/upload')
     *  curl.setOpt('UPLOAD', true)
     *  // so we do not need to set the content length
     *  curl.setOpt('HTTPHEADER', ['Transfer-Encoding: chunked'])
     *
     *  const filePath = './test.zip'
     *  const stream = fs.createReadStream(filePath)
     *  curl.setUploadStream(stream)
     *
     *  curl.setStreamProgressCallback(() => {
     *    // this will use the default progress callback from libcurl
     *    return CurlProgressFunc.Continue
     *  })
     *
     *  curl.on('end', (statusCode, data) => {
     *    console.log('\n'.repeat(5))
     *    // data length should be 0, as it was sent using the response stream
     *    console.log(
     *      `curl - end - status: ${statusCode} - data length: ${data.length}`,
     *    )
     *    curl.close()
     *  })
     *  curl.on('error', (error, errorCode) => {
     *    console.log('\n'.repeat(5))
     *    console.error('curl - error: ', error, errorCode)
     *    curl.close()
     *  })
     *  curl.perform()
     * ```
     *
     * Multiple calls with the same stream that was previously set has no effect.
     *
     * Setting this to `null` will remove the `READFUNCTION` callback and disable this behavior.
     *
     * @remarks
     *
     * This option is reset after each request, so if you want to upload the same data again using the same
     * `Curl` instance, you will need to provide a new stream.
     *
     * Make sure your libcurl version is greater than or equal 7.69.1.
     * Versions older than that one are not reliable for streams usage.
     */
    setUploadStream(stream: Readable | null): this;
    /**
     * Set the param to `null` to use the Node.js default value.
     *
     * @param highWaterMark This will passed directly to the `Readable` stream created to be returned as the response'
     *
     * @remarks
     * Only useful when the {@link CurlFeature.StreamResponse | `StreamResponse`} feature flag is enabled.
     */
    setStreamResponseHighWaterMark(highWaterMark: number | null): this;
    /**
     * This sets the callback to be used as the progress function when using any of the stream features.
     *
     * This is needed because when this `Curl` instance is enabled to use streams for upload/download, it needs
     * to set the libcurl progress function option to an internal function.
     *
     * If you are using any of the streams features, do not overwrite the progress callback to something else,
     * be it using {@link setOpt | `setOpt`} or {@link setProgressCallback | `setProgressCallback`}, as this would
     * cause undefined behavior.
     *
     * If are using this callback, there is no need to set the `NOPROGRESS` option to false (as you normally would).
     */
    setStreamProgressCallback(cb: CurlOptionValueType['xferInfoFunction']): this;
    /**
     * The option `XFERINFOFUNCTION` was introduced in curl version `7.32.0`,
     *  versions older than that should use `PROGRESSFUNCTION`.
     * If you don't want to mess with version numbers you can use this method,
     * instead of directly calling {@link Curl.setOpt | `Curl#setOpt`}.
     *
     * `NOPROGRESS` should be set to false to make this function actually get called.
     */
    setProgressCallback(cb: ((dltotal: number, dlnow: number, ultotal: number, ulnow: number) => number) | null): this;
    /**
     * Add this instance to the processing queue.
     * This method should be called only one time per request,
     *  otherwise it will throw an error.
     *
     * @remarks
     *
     * This basically calls the {@link "Multi".Multi.addHandle | `Multi#addHandle`} method.
     */
    perform(): this;
    /**
     * Perform any connection upkeep checks.
     *
     *
     * Official libcurl documentation: [`curl_easy_upkeep()`](http://curl.haxx.se/libcurl/c/curl_easy_upkeep.html)
     */
    upkeep(): this;
    /**
     * Use this function to pause / unpause a connection.
     *
     * The bitmask argument is a set of bits that sets the new state of the connection.
     *
     * Use {@link CurlPause | `CurlPause`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_pause()`](http://curl.haxx.se/libcurl/c/curl_easy_pause.html)
     */
    pause(bitmask: CurlPause): this;
    /**
     * Reset this handle options to their defaults.
     *
     * This will put the handle in a clean state, as if it was just created.
     *
     *
     * Official libcurl documentation: [`curl_easy_reset()`](http://curl.haxx.se/libcurl/c/curl_easy_reset.html)
     */
    reset(): this;
    /**
     * Duplicate this handle with all their options.
     * Keep in mind that, by default, this also means all event listeners.
     *
     *
     * Official libcurl documentation: [`curl_easy_duphandle()`](http://curl.haxx.se/libcurl/c/curl_easy_duphandle.html)
     *
     * @param shouldCopyEventListeners If you don't want to copy the event listeners, set this to `false`.
     */
    dupHandle(shouldCopyEventListeners?: boolean): Curl;
    /**
     * Close this handle.
     *
     * **NOTE:** After closing the handle, it must not be used anymore. Doing so will throw an error.
     *
     *
     * Official libcurl documentation: [`curl_easy_cleanup()`](http://curl.haxx.se/libcurl/c/curl_easy_cleanup.html)
     */
    close(): void;
    /**
     * This is used to reset a few properties to their pre-request state.
     */
    protected resetInternalState(): void;
    /**
     * When uploading a stream (by calling {@link setUploadStream | `setUploadStream`})
     * some event listeners are attached to the stream instance.
     * This will remove them so our callbacks are not called anymore.
     */
    protected cleanupReadFunctionStreamEvents(): void;
    /**
     * Returns headers from the current stored chunks - if any
     */
    protected getHeaders(): Buffer | HeaderInfo[];
    /**
     * The internal function passed to `PROGRESSFUNCTION` (`XFERINFOFUNCTION` on most recent libcurl versions)
     * when using any of the stream features.
     */
    protected streamModeProgressFunction(dltotal: number, dlnow: number, ultotal: number, ulnow: number): number;
    /**
     * This is the default callback passed to {@link setOpt | `setOpt('WRITEFUNCTION', cb)`}.
     */
    protected defaultWriteFunction(chunk: Buffer, size: number, nmemb: number): number;
    /**
     * This is used by the default callback passed to {@link setOpt | `setOpt('WRITEFUNCTION', cb)`}
     * when the feature to stream response is enabled.
     */
    protected defaultWriteFunctionStreamBased(chunk: Buffer, size: number, nmemb: number): number;
    /**
     * This is the default callback passed to {@link setOpt | `setOpt('HEADERFUNCTION', cb)`}.
     */
    protected defaultHeaderFunction(chunk: Buffer, size: number, nmemb: number): number;
    /**
     * Returns an object with a representation of the current libcurl version and their features/protocols.
     *
     * This is basically [`curl_version_info()`](https://curl.haxx.se/libcurl/c/curl_version_info.html)
     */
    static getVersionInfo: () => import("./types").CurlVersionInfoNativeBindingObject;
    /**
     * Returns a string that looks like the one returned by
     * ```bash
     * curl -V
     * ```
     * Example:
     * ```
     * Version: libcurl/7.69.1-DEV OpenSSL/1.1.1d zlib/1.2.11 WinIDN libssh2/1.9.0_DEV nghttp2/1.40.0
     * Protocols: dict, file, ftp, ftps, gopher, http, https, imap, imaps, ldap, ldaps, pop3, pop3s, rtsp, scp, sftp, smb, smbs, smtp, smtps, telnet, tftp
     * Features: AsynchDNS, IDN, IPv6, Largefile, SSPI, Kerberos, SPNEGO, NTLM, SSL, libz, HTTP2, HTTPS-proxy
     * ```
     */
    static getVersionInfoString: () => string;
    /**
     * Useful if you want to check if the current libcurl version is greater or equal than another one.
     * @param x major
     * @param y minor
     * @param z patch
     */
    static isVersionGreaterOrEqualThan: (x: number, y: number, z?: number) => boolean;
}
interface Curl {
    on(event: 'data', listener: (this: Curl, chunk: Buffer, curlInstance: Curl) => void): this;
    on(event: 'header', listener: (this: Curl, chunk: Buffer, curlInstance: Curl) => void): this;
    on(event: 'error', listener: (this: Curl, error: Error, errorCode: CurlCode, curlInstance: Curl) => void): this;
    /**
     * This is emitted if the StreamResponse feature was enabled.
     */
    on(event: 'stream', listener: (this: Curl, stream: Readable, status: number, headers: Buffer | HeaderInfo[], curlInstance: Curl) => void): this;
    /**
     * The `data` paramater passed to the listener callback will be one of the following:
     *  - Empty `Buffer` if the feature {@link CurlFeature.NoDataStorage | `NoDataStorage`} flag was enabled
     *  - Non-Empty `Buffer` if the feature {@link CurlFeature.NoDataParsing | `NoDataParsing`} flag was enabled
     *  - Otherwise, it will be a string, with the result of decoding the received data as a UTF8 string.
     *      If it's a JSON string for example, you still need to call JSON.parse on it. This library does no extra parsing
     *       whatsoever.
     *
     * The `headers` parameter passed to the listener callback will be one of the following:
     *  - Empty `Buffer` if the feature {@link CurlFeature.NoHeaderParsing | `NoHeaderStorage`} flag was enabled
     *  - Non-Empty `Buffer` if the feature {@link CurlFeature.NoHeaderParsing | `NoHeaderParsing`} flag was enabled
     *  - Otherwise, an array of parsed headers for each request
     *     libcurl made (if there were 2 redirects before the last request, the array will have 3 elements, one for each request)
     */
    on(event: 'end', listener: (this: Curl, status: number, data: string | Buffer, headers: Buffer | HeaderInfo[], curlInstance: Curl) => void): this;
    on(event: string, listener: Function): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: DataCallbackOptions, value: ((this: EasyNativeBinding, data: Buffer, size: number, nmemb: number) => number) | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: ProgressCallbackOptions, value: ((this: EasyNativeBinding, dltotal: number, dlnow: number, ultotal: number, ulnow: number) => number | CurlProgressFunc) | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: StringListOptions, value: string[] | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: BlobOptions, value: ArrayBuffer | Buffer | string | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'CHUNK_BGN_FUNCTION', value: ((this: EasyNativeBinding, fileInfo: FileInfo, remains: number) => CurlChunk) | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'CHUNK_END_FUNCTION', value: ((this: EasyNativeBinding) => CurlChunk) | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'DEBUGFUNCTION', value: ((this: EasyNativeBinding, type: CurlInfoDebug, data: Buffer) => 0) | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'FNMATCH_FUNCTION', value: ((this: EasyNativeBinding, pattern: string, value: string) => CurlFnMatchFunc) | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     * You can either return a single `CurlHstsReadCallbackResult` object or an array of `CurlHstsReadCallbackResult` objects.
     * If returning an array, the callback will only be called once per request.
     * If returning a single object, the callback will be called multiple times until `null` is returned.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'HSTSREADFUNCTION', value: ((this: EasyNativeBinding) => null | CurlHstsCacheEntry | CurlHstsCacheEntry[]) | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'HSTSWRITEFUNCTION', value: ((this: EasyNativeBinding, cacheEntry: CurlHstsCacheEntry, cacheCount: CurlHstsCacheCount) => any) | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'PREREQFUNCTION', value: ((this: EasyNativeBinding, connPrimaryIp: string, connLocalIp: string, connPrimaryPort: number, conLocalPort: number) => CurlPreReqFunc) | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'SEEKFUNCTION', value: ((this: EasyNativeBinding, offset: number, origin: number) => number) | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'TRAILERFUNCTION', value: ((this: EasyNativeBinding) => string[] | false) | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'SHARE', value: Share | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'HTTPPOST', value: HttpPostField[] | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'FTP_SSL_CCC', value: CurlFtpSsl | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'FTP_FILEMETHOD', value: CurlFtpMethod | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'GSSAPI_DELEGATION', value: CurlGssApi | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'HEADEROPT', value: CurlHeader | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'HTTP_VERSION', value: CurlHttpVersion | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'IPRESOLVE', value: CurlIpResolve | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'NETRC', value: CurlNetrc | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'PROTOCOLS', value: CurlProtocol | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'PROXY_SSL_OPTIONS', value: CurlSslOpt | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'PROXYTYPE', value: CurlProxy | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'REDIR_PROTOCOLS', value: CurlProtocol | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'RTSP_REQUEST', value: CurlRtspRequest | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'SSH_AUTH_TYPES', value: CurlSshAuth | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'SSL_OPTIONS', value: CurlSslOpt | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'SSLVERSION', value: CurlSslVersion | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'TIMECONDITION', value: CurlTimeCond | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'USE_SSL', value: CurlUseSsl | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: 'HSTS_CTRL', value: CurlHsts | null): this;
    /**
     * Use {@link "Curl".Curl.option|`Curl.option`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     */
    setOpt(option: Exclude<CurlOptionName, SpecificOptions>, value: string | number | boolean | null): this;
    /**
     * Returns information about the finished connection.
     *
     * Official libcurl documentation: [`curl_easy_getinfo()`](http://curl.haxx.se/libcurl/c/curl_easy_getinfo.html)
     *
     * @param info Info to retrieve. Use {@link "Curl".Curl.info | `Curl.info`} for predefined constants.
     */
    getInfo(info: 'CERTINFO'): GetInfoReturn<string[]>['data'];
    /**
     * Returns information about the finished connection.
     *
     * Official libcurl documentation: [`curl_easy_getinfo()`](http://curl.haxx.se/libcurl/c/curl_easy_getinfo.html)
     *
     * @param info Info to retrieve. Use {@link "Curl".Curl.info | `Curl.info`} for predefined constants.
     */
    getInfo(info: Exclude<CurlInfoName, CurlInfoNameSpecific>): GetInfoReturn['data'];
}
export { Curl };
//# sourceMappingURL=Curl.d.ts.map