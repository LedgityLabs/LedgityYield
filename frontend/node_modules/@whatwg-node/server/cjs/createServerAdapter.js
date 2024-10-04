"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerAdapter = createServerAdapter;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/ban-types */
const DefaultFetchAPI = tslib_1.__importStar(require("@whatwg-node/fetch"));
const utils_js_1 = require("./utils.js");
const uwebsockets_js_1 = require("./uwebsockets.js");
async function handleWaitUntils(waitUntilPromises) {
    await Promise.allSettled(waitUntilPromises);
}
// Required for envs like nextjs edge runtime
function isRequestAccessible(serverContext) {
    try {
        return !!serverContext?.request;
    }
    catch {
        return false;
    }
}
const EMPTY_OBJECT = {};
function createServerAdapter(serverAdapterBaseObject, options) {
    const fetchAPI = {
        ...DefaultFetchAPI,
        ...options?.fetchAPI,
    };
    const givenHandleRequest = typeof serverAdapterBaseObject === 'function'
        ? serverAdapterBaseObject
        : serverAdapterBaseObject.handle;
    const onRequestHooks = [];
    const onResponseHooks = [];
    if (options?.plugins != null) {
        for (const plugin of options.plugins) {
            if (plugin.onRequest) {
                onRequestHooks.push(plugin.onRequest);
            }
            if (plugin.onResponse) {
                onResponseHooks.push(plugin.onResponse);
            }
        }
    }
    const handleRequest = onRequestHooks.length > 0 || onResponseHooks.length > 0
        ? function handleRequest(request, serverContext) {
            let requestHandler = givenHandleRequest;
            let response;
            if (onRequestHooks.length === 0) {
                return handleEarlyResponse();
            }
            let url = new Proxy(EMPTY_OBJECT, {
                get(_target, prop, _receiver) {
                    url = new fetchAPI.URL(request.url, 'http://localhost');
                    return Reflect.get(url, prop, url);
                },
            });
            const onRequestHooksIteration$ = (0, utils_js_1.iterateAsyncVoid)(onRequestHooks, (onRequestHook, stopEarly) => onRequestHook({
                request,
                setRequest(newRequest) {
                    request = newRequest;
                },
                serverContext,
                fetchAPI,
                url,
                requestHandler,
                setRequestHandler(newRequestHandler) {
                    requestHandler = newRequestHandler;
                },
                endResponse(newResponse) {
                    response = newResponse;
                    if (newResponse) {
                        stopEarly();
                    }
                },
            }));
            function handleResponse(response) {
                if (onResponseHooks.length === 0) {
                    return response;
                }
                const onResponseHookPayload = {
                    request,
                    response,
                    serverContext,
                    setResponse(newResponse) {
                        response = newResponse;
                    },
                    fetchAPI,
                };
                const onResponseHooksIteration$ = (0, utils_js_1.iterateAsyncVoid)(onResponseHooks, onResponseHook => onResponseHook(onResponseHookPayload));
                if ((0, utils_js_1.isPromise)(onResponseHooksIteration$)) {
                    return onResponseHooksIteration$.then(() => response);
                }
                return response;
            }
            function handleEarlyResponse() {
                if (!response) {
                    const response$ = requestHandler(request, serverContext);
                    if ((0, utils_js_1.isPromise)(response$)) {
                        return response$.then(handleResponse);
                    }
                    return handleResponse(response$);
                }
                return handleResponse(response);
            }
            if ((0, utils_js_1.isPromise)(onRequestHooksIteration$)) {
                return onRequestHooksIteration$.then(handleEarlyResponse);
            }
            return handleEarlyResponse();
        }
        : givenHandleRequest;
    // TODO: Remove this on the next major version
    function handleNodeRequest(nodeRequest, ...ctx) {
        const serverContext = ctx.length > 1 ? (0, utils_js_1.completeAssign)(...ctx) : ctx[0] || {};
        const request = (0, utils_js_1.normalizeNodeRequest)(nodeRequest, fetchAPI.Request);
        return handleRequest(request, serverContext);
    }
    function handleNodeRequestAndResponse(nodeRequest, nodeResponseOrContainer, ...ctx) {
        const nodeResponse = nodeResponseOrContainer.raw || nodeResponseOrContainer;
        utils_js_1.nodeRequestResponseMap.set(nodeRequest, nodeResponse);
        return handleNodeRequest(nodeRequest, ...ctx);
    }
    function requestListener(nodeRequest, nodeResponse, ...ctx) {
        const waitUntilPromises = [];
        const defaultServerContext = {
            req: nodeRequest,
            res: nodeResponse,
            waitUntil(cb) {
                waitUntilPromises.push(cb.catch(err => console.error(err)));
            },
        };
        let response$;
        try {
            response$ = handleNodeRequestAndResponse(nodeRequest, nodeResponse, defaultServerContext, ...ctx);
        }
        catch (err) {
            response$ = (0, utils_js_1.handleErrorFromRequestHandler)(err, fetchAPI.Response);
        }
        if ((0, utils_js_1.isPromise)(response$)) {
            return response$
                .catch((e) => (0, utils_js_1.handleErrorFromRequestHandler)(e, fetchAPI.Response))
                .then(response => (0, utils_js_1.sendNodeResponse)(response, nodeResponse, nodeRequest))
                .catch(err => {
                console.error(`Unexpected error while handling request: ${err.message || err}`);
            });
        }
        try {
            return (0, utils_js_1.sendNodeResponse)(response$, nodeResponse, nodeRequest);
        }
        catch (err) {
            console.error(`Unexpected error while handling request: ${err.message || err}`);
        }
    }
    function handleUWS(res, req, ...ctx) {
        const waitUntilPromises = [];
        const defaultServerContext = {
            res,
            req,
            waitUntil(cb) {
                waitUntilPromises.push(cb.catch(err => console.error(err)));
            },
        };
        const filteredCtxParts = ctx.filter(partCtx => partCtx != null);
        const serverContext = filteredCtxParts.length > 0
            ? (0, utils_js_1.completeAssign)(defaultServerContext, ...ctx)
            : defaultServerContext;
        const signal = new utils_js_1.ServerAdapterRequestAbortSignal();
        const originalResEnd = res.end.bind(res);
        let resEnded = false;
        res.end = function (data) {
            resEnded = true;
            return originalResEnd(data);
        };
        const originalOnAborted = res.onAborted.bind(res);
        originalOnAborted(function () {
            signal.sendAbort();
        });
        res.onAborted = function (cb) {
            signal.addEventListener('abort', cb);
        };
        const request = (0, uwebsockets_js_1.getRequestFromUWSRequest)({
            req,
            res,
            fetchAPI,
            signal,
        });
        let response$;
        try {
            response$ = handleRequest(request, serverContext);
        }
        catch (err) {
            response$ = (0, utils_js_1.handleErrorFromRequestHandler)(err, fetchAPI.Response);
        }
        if ((0, utils_js_1.isPromise)(response$)) {
            return response$
                .catch((e) => (0, utils_js_1.handleErrorFromRequestHandler)(e, fetchAPI.Response))
                .then(response => {
                if (!signal.aborted && !resEnded) {
                    return (0, uwebsockets_js_1.sendResponseToUwsOpts)(res, response, signal);
                }
            })
                .catch(err => {
                console.error(`Unexpected error while handling request: \n${err.stack || err.message || err}`);
            });
        }
        try {
            if (!signal.aborted && !resEnded) {
                return (0, uwebsockets_js_1.sendResponseToUwsOpts)(res, response$, signal);
            }
        }
        catch (err) {
            console.error(`Unexpected error while handling request: \n${err.stack || err.message || err}`);
        }
    }
    function handleEvent(event, ...ctx) {
        if (!event.respondWith || !event.request) {
            throw new TypeError(`Expected FetchEvent, got ${event}`);
        }
        const filteredCtxParts = ctx.filter(partCtx => partCtx != null);
        const serverContext = filteredCtxParts.length > 0
            ? (0, utils_js_1.completeAssign)({}, event, ...filteredCtxParts)
            : (0, utils_js_1.isolateObject)(event);
        const response$ = handleRequest(event.request, serverContext);
        event.respondWith(response$);
    }
    function handleRequestWithWaitUntil(request, ...ctx) {
        const filteredCtxParts = ctx.filter(partCtx => partCtx != null);
        let waitUntilPromises;
        const serverContext = filteredCtxParts.length > 1
            ? (0, utils_js_1.completeAssign)({}, ...filteredCtxParts)
            : (0, utils_js_1.isolateObject)(filteredCtxParts[0], filteredCtxParts[0] == null || filteredCtxParts[0].waitUntil == null
                ? (waitUntilPromises = [])
                : undefined);
        const response$ = handleRequest(request, serverContext);
        if (waitUntilPromises?.length) {
            return handleWaitUntils(waitUntilPromises).then(() => response$);
        }
        return response$;
    }
    const fetchFn = (input, ...maybeCtx) => {
        if (typeof input === 'string' || 'href' in input) {
            const [initOrCtx, ...restOfCtx] = maybeCtx;
            if ((0, utils_js_1.isRequestInit)(initOrCtx)) {
                const request = new fetchAPI.Request(input, initOrCtx);
                const res$ = handleRequestWithWaitUntil(request, ...restOfCtx);
                return (0, utils_js_1.handleAbortSignalAndPromiseResponse)(res$, initOrCtx?.signal);
            }
            const request = new fetchAPI.Request(input);
            return handleRequestWithWaitUntil(request, ...maybeCtx);
        }
        const res$ = handleRequestWithWaitUntil(input, ...maybeCtx);
        return (0, utils_js_1.handleAbortSignalAndPromiseResponse)(res$, input._signal);
    };
    const genericRequestHandler = (input, ...maybeCtx) => {
        // If it is a Node request
        const [initOrCtxOrRes, ...restOfCtx] = maybeCtx;
        if ((0, utils_js_1.isNodeRequest)(input)) {
            if (!(0, utils_js_1.isServerResponse)(initOrCtxOrRes)) {
                throw new TypeError(`Expected ServerResponse, got ${initOrCtxOrRes}`);
            }
            return requestListener(input, initOrCtxOrRes, ...restOfCtx);
        }
        if ((0, uwebsockets_js_1.isUWSResponse)(input)) {
            return handleUWS(input, initOrCtxOrRes, ...restOfCtx);
        }
        if ((0, utils_js_1.isServerResponse)(initOrCtxOrRes)) {
            throw new TypeError('Got Node response without Node request');
        }
        // Is input a container object over Request?
        if (isRequestAccessible(input)) {
            // Is it FetchEvent?
            if ((0, utils_js_1.isFetchEvent)(input)) {
                return handleEvent(input, ...maybeCtx);
            }
            // In this input is also the context
            return handleRequestWithWaitUntil(input.request, input, ...maybeCtx);
        }
        // Or is it Request itself?
        // Then ctx is present and it is the context
        return fetchFn(input, ...maybeCtx);
    };
    const adapterObj = {
        handleRequest: handleRequestWithWaitUntil,
        fetch: fetchFn,
        handleNodeRequest,
        handleNodeRequestAndResponse,
        requestListener,
        handleEvent,
        handleUWS,
        handle: genericRequestHandler,
    };
    const serverAdapter = new Proxy(genericRequestHandler, {
        // It should have all the attributes of the handler function and the server instance
        has: (_, prop) => {
            return (prop in adapterObj ||
                prop in genericRequestHandler ||
                (serverAdapterBaseObject && prop in serverAdapterBaseObject));
        },
        get: (_, prop) => {
            const adapterProp = adapterObj[prop];
            if (adapterProp) {
                if (adapterProp.bind) {
                    return adapterProp.bind(adapterObj);
                }
                return adapterProp;
            }
            const handleProp = genericRequestHandler[prop];
            if (handleProp) {
                if (handleProp.bind) {
                    return handleProp.bind(genericRequestHandler);
                }
                return handleProp;
            }
            if (serverAdapterBaseObject) {
                const serverAdapterBaseObjectProp = serverAdapterBaseObject[prop];
                if (serverAdapterBaseObjectProp) {
                    if (serverAdapterBaseObjectProp.bind) {
                        return function (...args) {
                            const returnedVal = serverAdapterBaseObject[prop](...args);
                            if (returnedVal === serverAdapterBaseObject) {
                                return serverAdapter;
                            }
                            return returnedVal;
                        };
                    }
                    return serverAdapterBaseObjectProp;
                }
            }
        },
        apply(_, __, args) {
            return genericRequestHandler(...args);
        },
    });
    return serverAdapter;
}
