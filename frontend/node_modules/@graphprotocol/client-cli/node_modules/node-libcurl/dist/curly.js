"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curly = void 0;
const CurlOption_1 = require("./generated/CurlOption");
const Curl_1 = require("./Curl");
const CurlFeature_1 = require("./enum/CurlFeature");
// This is basically http.METHODS
const methods = [
    'acl',
    'bind',
    'checkout',
    'connect',
    'copy',
    'delete',
    'get',
    'head',
    'link',
    'lock',
    'm-search',
    'merge',
    'mkactivity',
    'mkcalendar',
    'mkcol',
    'move',
    'notify',
    'options',
    'patch',
    'post',
    'propfind',
    'proppatch',
    'purge',
    'put',
    'rebind',
    'report',
    'search',
    'source',
    'subscribe',
    'trace',
    'unbind',
    'unlink',
    'unlock',
    'unsubscribe',
];
const create = (defaultOptions = {}) => {
    function curly(url, options = {}) {
        const curlHandle = new Curl_1.Curl();
        curlHandle.enable(CurlFeature_1.CurlFeature.NoDataParsing);
        curlHandle.setOpt('URL', `${options.curlyBaseUrl || ''}${url}`);
        const finalOptions = {
            ...defaultOptions,
            ...options,
        };
        for (const key of Object.keys(finalOptions)) {
            const keyTyped = key;
            const optionName = keyTyped in CurlOption_1.CurlOptionCamelCaseMap
                ? CurlOption_1.CurlOptionCamelCaseMap[keyTyped]
                : keyTyped;
            // if it begins with curly we do not set it on the curlHandle
            // as it's an specific option for curly
            if (optionName.startsWith('curly'))
                continue;
            // @ts-ignore @TODO Try to type this
            curlHandle.setOpt(optionName, finalOptions[key]);
        }
        // streams!
        const { curlyStreamResponse, curlyStreamResponseHighWaterMark, curlyStreamUpload, } = finalOptions;
        const isUsingStream = !!(curlyStreamResponse || curlyStreamUpload);
        if (finalOptions.curlyProgressCallback) {
            if (typeof finalOptions.curlyProgressCallback !== 'function') {
                throw new TypeError('curlyProgressCallback must be a function with signature (number, number, number, number) => number');
            }
            const fnToCall = isUsingStream
                ? 'setStreamProgressCallback'
                : 'setProgressCallback';
            curlHandle[fnToCall](finalOptions.curlyProgressCallback);
        }
        if (curlyStreamResponse) {
            curlHandle.enable(CurlFeature_1.CurlFeature.StreamResponse);
            if (curlyStreamResponseHighWaterMark) {
                curlHandle.setStreamResponseHighWaterMark(curlyStreamResponseHighWaterMark);
            }
        }
        if (curlyStreamUpload) {
            curlHandle.setUploadStream(curlyStreamUpload);
        }
        const lowerCaseHeadersIfNecessary = (headers) => {
            // in-place modification
            // yeah, I know mutability is bad and all that
            if (finalOptions.curlyLowerCaseHeaders) {
                for (const headersReq of headers) {
                    const entries = Object.entries(headersReq);
                    for (const [headerKey, headerValue] of entries) {
                        delete headersReq[headerKey];
                        // @ts-expect-error ignoring this for now
                        headersReq[headerKey.toLowerCase()] = headerValue;
                    }
                }
            }
        };
        return new Promise((resolve, reject) => {
            let stream;
            if (curlyStreamResponse) {
                curlHandle.on('stream', (_stream, statusCode, headers) => {
                    lowerCaseHeadersIfNecessary(headers);
                    stream = _stream;
                    resolve({
                        // @ts-ignore cannot be subtype yada yada
                        data: stream,
                        statusCode,
                        headers,
                    });
                });
            }
            curlHandle.on('end', (statusCode, data, headers) => {
                curlHandle.close();
                // only need to the remaining here if we did not enabled
                // the stream response
                if (curlyStreamResponse) {
                    return;
                }
                const contentTypeEntry = Object.entries(headers[headers.length - 1]).find(([k]) => k.toLowerCase() === 'content-type');
                let contentType = (contentTypeEntry ? contentTypeEntry[1] : '');
                // remove the metadata of the content-type, like charset
                // See https://tools.ietf.org/html/rfc7231#section-3.1.1.5
                contentType = contentType.split(';')[0];
                const responseBodyParsers = {
                    ...curly.defaultResponseBodyParsers,
                    ...finalOptions.curlyResponseBodyParsers,
                };
                let foundParser = finalOptions.curlyResponseBodyParser;
                if (typeof foundParser === 'undefined') {
                    for (const [contentTypeFormat, parser] of Object.entries(responseBodyParsers)) {
                        if (typeof parser !== 'function') {
                            return reject(new TypeError(`Response body parser for ${contentTypeFormat} must be a function`));
                        }
                        if (contentType === contentTypeFormat) {
                            foundParser = parser;
                            break;
                        }
                        else if (contentTypeFormat === '*') {
                            foundParser = parser;
                            break;
                        }
                        else {
                            const partsFormat = contentTypeFormat.split('/');
                            const partsContentType = contentType.split('/');
                            if (partsContentType.length === partsFormat.length &&
                                partsContentType.every((val, index) => partsFormat[index] === '*' || partsFormat[index] === val)) {
                                foundParser = parser;
                                break;
                            }
                        }
                    }
                }
                if (foundParser && typeof foundParser !== 'function') {
                    return reject(new TypeError('`curlyResponseBodyParser` passed to curly must be false or a function.'));
                }
                lowerCaseHeadersIfNecessary(headers);
                try {
                    resolve({
                        statusCode: statusCode,
                        data: foundParser ? foundParser(data, headers) : data,
                        headers: headers,
                    });
                }
                catch (error) {
                    reject(error);
                }
            });
            curlHandle.on('error', (error, errorCode) => {
                curlHandle.close();
                // @ts-ignore
                error.code = errorCode;
                // @ts-ignore
                error.isCurlError = true;
                // oops, if have a stream it means the promise
                // has been resolved with it
                // so instead of rejecting the original promise
                // we are emitting the error event on the stream
                if (stream) {
                    stream.emit('error', error);
                }
                else {
                    reject(error);
                }
            });
            try {
                curlHandle.perform();
            }
            catch (error) /* istanbul ignore next: this should never happen 🤷‍♂️ */ {
                curlHandle.close();
                reject(error);
            }
        });
    }
    curly.create = create;
    curly.defaultResponseBodyParsers = {
        'application/json': (data, _headers) => {
            try {
                const string = data.toString('utf8');
                return JSON.parse(string);
            }
            catch (error) {
                throw new Error(`curly failed to parse "application/json" content as JSON. This is generally caused by receiving malformed JSON data from the server.
You can disable this automatic behavior by setting the option curlyResponseBodyParser to false, then a Buffer will be returned as the data.
You can also overwrite the "application/json" parser with your own by changing one of the following:
  - curly.defaultResponseBodyParsers['application/json']
  or
  - options.curlyResponseBodyParsers = { 'application/json': parser }

If you want just a single function to handle all content-types, you can use the option "curlyResponseBodyParser".
`);
            }
        },
        // We are in [INSERT CURRENT YEAR], let's assume everyone is using utf8 encoding for text/* content-type.
        'text/*': (data, _headers) => data.toString('utf8'),
        // otherwise let's just return the raw buffer
        '*': (data, _headers) => data,
    };
    const httpMethodOptionsMap = {
        get: null,
        post: (_m, o) => ({
            post: true,
            ...o,
        }),
        head: (_m, o) => ({
            nobody: true,
            ...o,
        }),
        _: (m, o) => ({
            customRequest: m.toUpperCase(),
            ...o,
        }),
    };
    for (const httpMethod of methods) {
        const httpMethodOptionsKey = Object.prototype.hasOwnProperty.call(httpMethodOptionsMap, httpMethod)
            ? httpMethod
            : '_';
        const httpMethodOptions = httpMethodOptionsMap[httpMethodOptionsKey];
        // @ts-ignore
        curly[httpMethod] =
            httpMethodOptions === null
                ? curly
                : (url, options = {}) => curly(url, {
                    ...httpMethodOptions(httpMethod, options),
                });
    }
    // @ts-ignore
    return curly;
};
/**
 * Curly function
 *
 * @public
 */
exports.curly = create();
//# sourceMappingURL=curly.js.map