/// <reference types="node" />
/// <reference types="node" />
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Readable } from 'stream';
import { CurlOptionValueType } from './generated/CurlOption';
import { HeaderInfo } from './parseHeaders';
/**
 * Object the curly call resolves to.
 *
 * @public
 */
export interface CurlyResult<ResultData = any> {
    /**
     * Data will be the body of the requested URL
     */
    data: ResultData;
    /**
     * Parsed headers
     *
     * See {@link HeaderInfo}
     */
    headers: HeaderInfo[];
    /**
     * HTTP Status code for the last request
     */
    statusCode: number;
}
declare const methods: readonly ["acl", "bind", "checkout", "connect", "copy", "delete", "get", "head", "link", "lock", "m-search", "merge", "mkactivity", "mkcalendar", "mkcol", "move", "notify", "options", "patch", "post", "propfind", "proppatch", "purge", "put", "rebind", "report", "search", "source", "subscribe", "trace", "unbind", "unlink", "unlock", "unsubscribe"];
type HttpMethod = (typeof methods)[number];
export type CurlyResponseBodyParser = (data: Buffer, header: HeaderInfo[]) => any;
export type CurlyResponseBodyParsersProperty = {
    [key: string]: CurlyResponseBodyParser;
};
/**
 * These are the options accepted by the {@link CurlyFunction | `CurlyFunction`} API.
 *
 * Most libcurl options are accepted as their specific name, like `PROXY_CAPATH`, or as a camel
 * case version of that name, like `proxyCaPath`.
 *
 * Options specific to the `curly` API are prefixed with `curly`, like `curlyBaseUrl`.
 *
 * For quick navigation use the sidebar.
 */
export interface CurlyOptions extends CurlOptionValueType {
    /**
     * Set this to a callback function that should be used as the progress callback.
     *
     * This is the only reliable way to set the progress callback.
     *
     * @remarks
     *
     * This basically calls one of the following methods, depending on if any of the streams feature is being used or not:
     * - If using streams: {@link "Curl".Curl.setStreamProgressCallback | `Curl#setStreamProgressCallback`}
     * - else:  {@link "Curl".Curl.setProgressCallback | `Curl#setProgressCallback`}
     */
    curlyProgressCallback?: CurlOptionValueType['xferInfoFunction'];
    /**
     * If set to a function this will always be called
     * for all requests, ignoring other response body parsers.
     *
     * This can also be set to `false`, which will disable the response parsing and will make
     * the raw `Buffer` of the response to be returned.
     */
    curlyResponseBodyParser?: CurlyResponseBodyParser | false;
    /**
     * Add more response body parsers, or overwrite existing ones.
     *
     * This object is merged with the {@link CurlyFunction.defaultResponseBodyParsers | `curly.defaultResponseBodyParsers`}
     */
    curlyResponseBodyParsers?: CurlyResponseBodyParsersProperty;
    /**
     * If set, this value will always prefix the `URL` of the request.
     *
     * No special handling is done, so make sure you set the url correctly later on.
     */
    curlyBaseUrl?: string;
    /**
     * If `true`, `curly` will lower case all headers before returning then.
     *
     * By default this is `false`.
     */
    curlyLowerCaseHeaders?: boolean;
    /**
     * If `true`, `curly` will return the response data as a stream.
     *
     * The `curly` call will resolve as soon as the stream is available.
     *
     * When using this option, if an error is thrown in the internal {@link "Curl".Curl | `Curl`} instance
     * after the `curly` call has been resolved (it resolves as soon as the stream is available)
     * it will cause the `error` event to be emitted on the stream itself, this way it's possible
     * to handle these too, if necessary. The error object will have the property `isCurlError` set to `true`.
     *
     * Calling `destroy()` on the stream will always cause the `Curl` instance to emit the error event.
     * Even if an error argument was not supplied to `stream.destroy()`.
     *
     * By default this is `false`.
     *
     * @remarks
     *
     * Make sure your libcurl version is greater than or equal 7.69.1.
     * Versions older than that one are not reliable for streams usage.
     *
     * This basically enables the {@link CurlFeature.StreamResponse | `CurlFeature.StreamResponse`} feature
     * flag in the internal {@link "Curl".Curl | `Curl`} instance.
     */
    curlyStreamResponse?: boolean;
    /**
     * This will set the `hightWaterMark` option in the response stream, if `curlyStreamResponse` is `true`.
     *
     * @remarks
     *
     * This basically calls {@link "Curl".Curl.setStreamResponseHighWaterMark | `Curl#setStreamResponseHighWaterMark`}
     * method in the internal {@link "Curl".Curl | `Curl`} instance.
     */
    curlyStreamResponseHighWaterMark?: number;
    /**
     * If set, the contents of this stream will be uploaded to the server.
     *
     * Keep in mind that if you set this option you **SHOULD** not set
     * `progressFunction` or `xferInfoFunction`, as these are used internally.
     *
     * If you need to set a progress callback, use the `curlyProgressCallback` option.
     *
     * If the stream set here is destroyed before libcurl finishes uploading it, the error
     * `Curl upload stream was unexpectedly destroyed` (Code `42`) will be emitted in the
     * internal {@link "Curl".Curl | `Curl`} instance, and so will cause the curly call to be rejected with that error.
     *
     * If the stream was destroyed with a specific error, this error will be passed instead.
     *
     * By default this is not set.
     *
     * @remarks
     *
     * Make sure your libcurl version is greater than or equal 7.69.1.
     * Versions older than that one are not reliable for streams usage.
     *
     * This basically calls {@link "Curl".Curl.setUploadStream | `Curl#setUploadStream`}
     * method in the internal {@link "Curl".Curl | `Curl`} instance.
     */
    curlyStreamUpload?: Readable | null;
}
interface CurlyHttpMethodCall {
    /**
     * **EXPERIMENTAL** This API can change between minor releases
     *
     * Async wrapper around the Curl class.
     *
     * The `curly.<field>` being used will be the HTTP verb sent.
     *
     * @typeParam ResultData You can use this to specify the type of the `data` property returned from this call.
     */
    <ResultData = any>(url: string, options?: CurlyOptions): Promise<CurlyResult<ResultData>>;
}
type HttpMethodCalls = Record<HttpMethod, CurlyHttpMethodCall>;
export interface CurlyFunction extends HttpMethodCalls {
    /**
     * **EXPERIMENTAL** This API can change between minor releases
     *
     * Async wrapper around the Curl class.
     *
     * It's also possible to request using a specific http verb
     *  directly by using `curl.<http-verb>(url: string, options?: CurlyOptions)`, like:
     *
     * ```js
     * curly.get('https://www.google.com')
     * ```
     * @typeParam ResultData You can use this to specify the type of the `data` property returned from this call.
     */
    <ResultData = any>(url: string, options?: CurlyOptions): Promise<CurlyResult<ResultData>>;
    /**
     * **EXPERIMENTAL** This API can change between minor releases
     *
     * This returns a new `curly` with the specified options set by default.
     */
    create: (defaultOptions?: CurlyOptions) => CurlyFunction;
    /**
     * These are the default response body parsers to be used.
     *
     * By default there are parsers for the following:
     *
     * - application/json
     * - text/*
     * - *
     */
    defaultResponseBodyParsers: CurlyResponseBodyParsersProperty;
}
/**
 * Curly function
 *
 * @public
 */
export declare const curly: CurlyFunction;
export {};
//# sourceMappingURL=curly.d.ts.map