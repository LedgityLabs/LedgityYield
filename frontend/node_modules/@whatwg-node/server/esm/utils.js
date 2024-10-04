import { URL } from '@whatwg-node/fetch';
export function isAsyncIterable(body) {
    return (body != null && typeof body === 'object' && typeof body[Symbol.asyncIterator] === 'function');
}
function getPort(nodeRequest) {
    if (nodeRequest.socket?.localPort) {
        return nodeRequest.socket?.localPort;
    }
    const hostInHeader = nodeRequest.headers?.[':authority'] || nodeRequest.headers?.host;
    const portInHeader = hostInHeader?.split(':')?.[1];
    if (portInHeader) {
        return portInHeader;
    }
    return 80;
}
function getHostnameWithPort(nodeRequest) {
    if (nodeRequest.headers?.[':authority']) {
        return nodeRequest.headers?.[':authority'];
    }
    if (nodeRequest.headers?.host) {
        return nodeRequest.headers?.host;
    }
    const port = getPort(nodeRequest);
    if (nodeRequest.hostname) {
        return nodeRequest.hostname + ':' + port;
    }
    const localIp = nodeRequest.socket?.localAddress;
    if (localIp && !localIp?.includes('::') && !localIp?.includes('ffff')) {
        return `${localIp}:${port}`;
    }
    return 'localhost';
}
function buildFullUrl(nodeRequest) {
    const hostnameWithPort = getHostnameWithPort(nodeRequest);
    const protocol = nodeRequest.protocol || (nodeRequest.socket?.encrypted ? 'https' : 'http');
    const endpoint = nodeRequest.originalUrl || nodeRequest.url || '/graphql';
    return `${protocol}://${hostnameWithPort}${endpoint}`;
}
function isRequestBody(body) {
    const stringTag = body[Symbol.toStringTag];
    if (typeof body === 'string' ||
        stringTag === 'Uint8Array' ||
        stringTag === 'Blob' ||
        stringTag === 'FormData' ||
        stringTag === 'URLSearchParams' ||
        isAsyncIterable(body)) {
        return true;
    }
    return false;
}
export class ServerAdapterRequestAbortSignal extends EventTarget {
    aborted = false;
    _onabort = null;
    reason;
    throwIfAborted() {
        if (this.aborted) {
            throw this.reason;
        }
    }
    sendAbort() {
        this.reason = new DOMException('This operation was aborted', 'AbortError');
        this.aborted = true;
        this.dispatchEvent(new Event('abort'));
    }
    get onabort() {
        return this._onabort;
    }
    set onabort(value) {
        this._onabort = value;
        if (value) {
            this.addEventListener('abort', value);
        }
        else {
            this.removeEventListener('abort', value);
        }
    }
    any(signals) {
        return AbortSignal.any([...signals]);
    }
}
let bunNodeCompatModeWarned = false;
export const nodeRequestResponseMap = new WeakMap();
export function normalizeNodeRequest(nodeRequest, RequestCtor) {
    const rawRequest = nodeRequest.raw || nodeRequest.req || nodeRequest;
    let fullUrl = buildFullUrl(rawRequest);
    if (nodeRequest.query) {
        const url = new URL(fullUrl);
        for (const key in nodeRequest.query) {
            url.searchParams.set(key, nodeRequest.query[key]);
        }
        fullUrl = url.toString();
    }
    let signal;
    const nodeResponse = nodeRequestResponseMap.get(nodeRequest);
    nodeRequestResponseMap.delete(nodeRequest);
    let normalizedHeaders = nodeRequest.headers;
    if (nodeRequest.headers?.[':method']) {
        normalizedHeaders = {};
        for (const key in nodeRequest.headers) {
            if (!key.startsWith(':')) {
                normalizedHeaders[key] = nodeRequest.headers[key];
            }
        }
    }
    if (nodeResponse?.once) {
        let sendAbortSignal;
        // If ponyfilled
        if (RequestCtor !== globalThis.Request) {
            signal = new ServerAdapterRequestAbortSignal();
            sendAbortSignal = () => signal.sendAbort();
        }
        else {
            const controller = new AbortController();
            signal = controller.signal;
            sendAbortSignal = () => controller.abort();
        }
        const closeEventListener = () => {
            if (signal && !signal.aborted) {
                rawRequest.aborted = true;
                sendAbortSignal();
            }
        };
        nodeResponse.once('error', closeEventListener);
        nodeResponse.once('close', closeEventListener);
        nodeResponse.once('finish', () => {
            nodeResponse.removeListener('close', closeEventListener);
        });
    }
    if (nodeRequest.method === 'GET' || nodeRequest.method === 'HEAD') {
        return new RequestCtor(fullUrl, {
            method: nodeRequest.method,
            headers: normalizedHeaders,
            signal,
        });
    }
    /**
     * Some Node server frameworks like Serverless Express sends a dummy object with body but as a Buffer not string
     * so we do those checks to see is there something we can use directly as BodyInit
     * because the presence of body means the request stream is already consumed and,
     * rawRequest cannot be used as BodyInit/ReadableStream by Fetch API in this case.
     */
    const maybeParsedBody = nodeRequest.body;
    if (maybeParsedBody != null && Object.keys(maybeParsedBody).length > 0) {
        if (isRequestBody(maybeParsedBody)) {
            return new RequestCtor(fullUrl, {
                method: nodeRequest.method,
                headers: normalizedHeaders,
                body: maybeParsedBody,
                signal,
            });
        }
        const request = new RequestCtor(fullUrl, {
            method: nodeRequest.method,
            headers: normalizedHeaders,
            signal,
        });
        if (!request.headers.get('content-type')?.includes('json')) {
            request.headers.set('content-type', 'application/json; charset=utf-8');
        }
        return new Proxy(request, {
            get: (target, prop, receiver) => {
                switch (prop) {
                    case 'json':
                        return async () => maybeParsedBody;
                    case 'text':
                        return async () => JSON.stringify(maybeParsedBody);
                    default:
                        return Reflect.get(target, prop, receiver);
                }
            },
        });
    }
    // Temporary workaround for a bug in Bun Node compat mode
    if (globalThis.process?.versions?.bun && isReadable(rawRequest)) {
        if (!bunNodeCompatModeWarned) {
            bunNodeCompatModeWarned = true;
            console.warn(`You use Bun Node compatibility mode, which is not recommended!
It will affect your performance. Please check our Bun integration recipe, and avoid using 'http' for your server implementation.`);
        }
        return new RequestCtor(fullUrl, {
            method: nodeRequest.method,
            headers: normalizedHeaders,
            duplex: 'half',
            body: new ReadableStream({
                start(controller) {
                    rawRequest.on('data', chunk => {
                        controller.enqueue(chunk);
                    });
                    rawRequest.on('error', e => {
                        controller.error(e);
                    });
                    rawRequest.on('end', () => {
                        controller.close();
                    });
                },
                cancel(e) {
                    rawRequest.destroy(e);
                },
            }),
            signal,
        });
    }
    // perf: instead of spreading the object, we can just pass it as is and it performs better
    return new RequestCtor(fullUrl, {
        method: nodeRequest.method,
        headers: normalizedHeaders,
        body: rawRequest,
        duplex: 'half',
        signal,
    });
}
export function isReadable(stream) {
    return stream.read != null;
}
export function isNodeRequest(request) {
    return isReadable(request);
}
export function isServerResponse(stream) {
    // Check all used functions are defined
    return (stream != null &&
        stream.setHeader != null &&
        stream.end != null &&
        stream.once != null &&
        stream.write != null);
}
export function isReadableStream(stream) {
    return stream != null && stream.getReader != null;
}
export function isFetchEvent(event) {
    return event != null && event.request != null && event.respondWith != null;
}
function configureSocket(rawRequest) {
    rawRequest?.socket?.setTimeout?.(0);
    rawRequest?.socket?.setNoDelay?.(true);
    rawRequest?.socket?.setKeepAlive?.(true);
}
function endResponse(serverResponse) {
    // @ts-expect-error Avoid arguments adaptor trampoline https://v8.dev/blog/adaptor-frame
    serverResponse.end(null, null, null);
}
async function sendAsyncIterable(serverResponse, asyncIterable) {
    let closed = false;
    const closeEventListener = () => {
        closed = true;
    };
    serverResponse.once('error', closeEventListener);
    serverResponse.once('close', closeEventListener);
    serverResponse.once('finish', () => {
        serverResponse.removeListener('close', closeEventListener);
    });
    for await (const chunk of asyncIterable) {
        if (closed) {
            break;
        }
        if (!serverResponse
            // @ts-expect-error http and http2 writes are actually compatible
            .write(chunk)) {
            if (closed) {
                break;
            }
            await new Promise(resolve => serverResponse.once('drain', resolve));
        }
    }
    endResponse(serverResponse);
}
export function sendNodeResponse(fetchResponse, serverResponse, nodeRequest) {
    if (serverResponse.closed || serverResponse.destroyed || serverResponse.writableEnded) {
        return;
    }
    if (!fetchResponse) {
        serverResponse.statusCode = 404;
        serverResponse.end();
        return;
    }
    serverResponse.statusCode = fetchResponse.status;
    serverResponse.statusMessage = fetchResponse.statusText;
    let setCookiesSet = false;
    fetchResponse.headers.forEach((value, key) => {
        if (key === 'set-cookie') {
            if (setCookiesSet) {
                return;
            }
            setCookiesSet = true;
            const setCookies = fetchResponse.headers.getSetCookie?.();
            if (setCookies) {
                serverResponse.setHeader('set-cookie', setCookies);
                return;
            }
        }
        serverResponse.setHeader(key, value);
    });
    // Optimizations for node-fetch
    const bufOfRes = fetchResponse._buffer;
    if (bufOfRes) {
        // @ts-expect-error http and http2 writes are actually compatible
        serverResponse.write(bufOfRes);
        endResponse(serverResponse);
        return;
    }
    // Other fetch implementations
    const fetchBody = fetchResponse.body;
    if (fetchBody == null) {
        endResponse(serverResponse);
        return;
    }
    if (fetchBody[Symbol.toStringTag] === 'Uint8Array') {
        serverResponse
            // @ts-expect-error http and http2 writes are actually compatible
            .write(fetchBody);
        endResponse(serverResponse);
        return;
    }
    configureSocket(nodeRequest);
    if (isReadable(fetchBody)) {
        serverResponse.once('close', () => {
            fetchBody.destroy();
        });
        fetchBody.pipe(serverResponse);
        return;
    }
    if (isAsyncIterable(fetchBody)) {
        return sendAsyncIterable(serverResponse, fetchBody);
    }
}
export function isRequestInit(val) {
    return (val != null &&
        typeof val === 'object' &&
        ('body' in val ||
            'cache' in val ||
            'credentials' in val ||
            'headers' in val ||
            'integrity' in val ||
            'keepalive' in val ||
            'method' in val ||
            'mode' in val ||
            'redirect' in val ||
            'referrer' in val ||
            'referrerPolicy' in val ||
            'signal' in val ||
            'window' in val));
}
// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#copying_accessors
export function completeAssign(...args) {
    const [target, ...sources] = args.filter(arg => arg != null && typeof arg === 'object');
    sources.forEach(source => {
        // modified Object.keys to Object.getOwnPropertyNames
        // because Object.keys only returns enumerable properties
        const descriptors = Object.getOwnPropertyNames(source).reduce((descriptors, key) => {
            const descriptor = Object.getOwnPropertyDescriptor(source, key);
            if (descriptor) {
                descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
            }
            return descriptors;
        }, {});
        // By default, Object.assign copies enumerable Symbols, too
        Object.getOwnPropertySymbols(source).forEach(sym => {
            const descriptor = Object.getOwnPropertyDescriptor(source, sym);
            if (descriptor?.enumerable) {
                descriptors[sym] = descriptor;
            }
        });
        Object.defineProperties(target, descriptors);
    });
    return target;
}
export function isPromise(val) {
    return val?.then != null;
}
export function iterateAsyncVoid(iterable, callback) {
    const iterator = iterable[Symbol.iterator]();
    let stopEarlyFlag = false;
    function stopEarlyFn() {
        stopEarlyFlag = true;
    }
    function iterate() {
        const { done: endOfIterator, value } = iterator.next();
        if (endOfIterator) {
            return;
        }
        const result$ = callback(value, stopEarlyFn);
        if (isPromise(result$)) {
            return result$.then(() => {
                if (stopEarlyFlag) {
                    return;
                }
                return iterate();
            });
        }
        if (stopEarlyFlag) {
            return;
        }
        return iterate();
    }
    return iterate();
}
export function handleErrorFromRequestHandler(error, ResponseCtor) {
    return new ResponseCtor(error.stack || error.message || error.toString(), {
        status: error.status || 500,
    });
}
export function isolateObject(originalCtx, waitUntilPromises) {
    if (originalCtx == null) {
        if (waitUntilPromises == null) {
            return {};
        }
        originalCtx = {};
    }
    const extraProps = {};
    const deletedProps = new Set();
    return new Proxy(originalCtx, {
        get(originalCtx, prop) {
            if (waitUntilPromises != null && prop === 'waitUntil') {
                return function waitUntil(promise) {
                    waitUntilPromises.push(promise.catch(err => console.error(err)));
                };
            }
            const extraPropVal = extraProps[prop];
            if (extraPropVal != null) {
                if (typeof extraPropVal === 'function') {
                    return extraPropVal.bind(extraProps);
                }
                return extraPropVal;
            }
            if (deletedProps.has(prop)) {
                return undefined;
            }
            return originalCtx[prop];
        },
        set(_originalCtx, prop, value) {
            extraProps[prop] = value;
            return true;
        },
        has(originalCtx, prop) {
            if (waitUntilPromises != null && prop === 'waitUntil') {
                return true;
            }
            if (deletedProps.has(prop)) {
                return false;
            }
            if (prop in extraProps) {
                return true;
            }
            return prop in originalCtx;
        },
        defineProperty(_originalCtx, prop, descriptor) {
            return Reflect.defineProperty(extraProps, prop, descriptor);
        },
        deleteProperty(_originalCtx, prop) {
            if (prop in extraProps) {
                return Reflect.deleteProperty(extraProps, prop);
            }
            deletedProps.add(prop);
            return true;
        },
        ownKeys(originalCtx) {
            const extraKeys = Reflect.ownKeys(extraProps);
            const originalKeys = Reflect.ownKeys(originalCtx);
            const deletedKeys = Array.from(deletedProps);
            const allKeys = new Set(extraKeys.concat(originalKeys.filter(keys => !deletedKeys.includes(keys))));
            if (waitUntilPromises != null) {
                allKeys.add('waitUntil');
            }
            return Array.from(allKeys);
        },
        getOwnPropertyDescriptor(originalCtx, prop) {
            if (prop in extraProps) {
                return Reflect.getOwnPropertyDescriptor(extraProps, prop);
            }
            if (deletedProps.has(prop)) {
                return undefined;
            }
            return Reflect.getOwnPropertyDescriptor(originalCtx, prop);
        },
    });
}
export function createDeferredPromise() {
    let resolveFn;
    let rejectFn;
    const promise = new Promise(function deferredPromiseExecutor(resolve, reject) {
        resolveFn = resolve;
        rejectFn = reject;
    });
    return {
        promise,
        get resolve() {
            return resolveFn;
        },
        get reject() {
            return rejectFn;
        },
    };
}
export function handleAbortSignalAndPromiseResponse(response$, abortSignal) {
    if (isPromise(response$) && abortSignal) {
        const deferred$ = createDeferredPromise();
        abortSignal.addEventListener('abort', function abortSignalFetchErrorHandler() {
            deferred$.reject(abortSignal.reason);
        });
        response$
            .then(function fetchSuccessHandler(res) {
            deferred$.resolve(res);
        })
            .catch(function fetchErrorHandler(err) {
            deferred$.reject(err);
        });
        return deferred$.promise;
    }
    return response$;
}
export const decompressedResponseMap = new WeakMap();
const supportedEncodingsByFetchAPI = new WeakMap();
export function getSupportedEncodings(fetchAPI) {
    let supportedEncodings = supportedEncodingsByFetchAPI.get(fetchAPI);
    if (!supportedEncodings) {
        const possibleEncodings = ['deflate', 'gzip', 'deflate-raw', 'br'];
        if (fetchAPI.DecompressionStream['supportedFormats']) {
            supportedEncodings = fetchAPI.DecompressionStream['supportedFormats'];
        }
        else {
            supportedEncodings = possibleEncodings.filter(encoding => {
                // deflate-raw is not supported in Node.js >v20
                if (globalThis.process?.version?.startsWith('v2') &&
                    fetchAPI.DecompressionStream === globalThis.DecompressionStream &&
                    encoding === 'deflate-raw') {
                    return false;
                }
                try {
                    // eslint-disable-next-line no-new
                    new fetchAPI.DecompressionStream(encoding);
                    return true;
                }
                catch {
                    return false;
                }
            });
        }
        supportedEncodingsByFetchAPI.set(fetchAPI, supportedEncodings);
    }
    return supportedEncodings;
}
export function handleResponseDecompression(response, fetchAPI) {
    const contentEncodingHeader = response?.headers.get('content-encoding');
    if (!contentEncodingHeader || contentEncodingHeader === 'none') {
        return response;
    }
    if (!response?.body) {
        return response;
    }
    let decompressedResponse = decompressedResponseMap.get(response);
    if (!decompressedResponse || decompressedResponse.bodyUsed) {
        let decompressedBody = response.body;
        const contentEncodings = contentEncodingHeader.split(',');
        if (!contentEncodings.every(encoding => getSupportedEncodings(fetchAPI).includes(encoding))) {
            return new fetchAPI.Response(`Unsupported 'Content-Encoding': ${contentEncodingHeader}`, {
                status: 415,
                statusText: 'Unsupported Media Type',
            });
        }
        for (const contentEncoding of contentEncodings) {
            decompressedBody = decompressedBody.pipeThrough(new fetchAPI.DecompressionStream(contentEncoding));
        }
        decompressedResponse = new fetchAPI.Response(decompressedBody, response);
        decompressedResponseMap.set(response, decompressedResponse);
    }
    return decompressedResponse;
}
