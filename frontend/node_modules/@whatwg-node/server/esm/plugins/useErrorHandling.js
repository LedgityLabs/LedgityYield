import { Response as DefaultResponseCtor } from '@whatwg-node/fetch';
import { isPromise } from '../utils.js';
export function createDefaultErrorHandler(ResponseCtor = DefaultResponseCtor) {
    return function defaultErrorHandler(e) {
        if (e.details || e.status || e.headers || e.name === 'HTTPError') {
            return new ResponseCtor(typeof e.details === 'object' ? JSON.stringify(e.details) : e.message, {
                status: e.status,
                headers: e.headers || {},
            });
        }
        console.error(e);
        return createDefaultErrorResponse(ResponseCtor);
    };
}
function createDefaultErrorResponse(ResponseCtor) {
    if (ResponseCtor.error) {
        return ResponseCtor.error();
    }
    return new ResponseCtor(null, { status: 500 });
}
export class HTTPError extends Error {
    status;
    message;
    headers;
    details;
    name = 'HTTPError';
    constructor(status = 500, message, headers = {}, details) {
        super(message);
        this.status = status;
        this.message = message;
        this.headers = headers;
        this.details = details;
        Error.captureStackTrace(this, HTTPError);
    }
}
export function useErrorHandling(onError) {
    return {
        onRequest({ requestHandler, setRequestHandler, fetchAPI }) {
            const errorHandler = onError || createDefaultErrorHandler(fetchAPI.Response);
            setRequestHandler(function handlerWithErrorHandling(request, serverContext) {
                try {
                    const response$ = requestHandler(request, serverContext);
                    if (isPromise(response$)) {
                        return response$.catch(e => errorHandler(e, request, serverContext) ||
                            createDefaultErrorResponse(fetchAPI.Response));
                    }
                    return response$;
                }
                catch (e) {
                    return (errorHandler(e, request, serverContext) || createDefaultErrorResponse(fetchAPI.Response));
                }
            });
        },
    };
}
