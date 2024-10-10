import { Agent as HTTPAgent } from 'http';
import { Agent as HTTPSAgent } from 'https';
import { BodyPonyfillInit, PonyfillBody, PonyfillBodyOptions } from './Body.js';
import { PonyfillHeadersInit } from './Headers.js';
export type RequestPonyfillInit = PonyfillBodyOptions & Omit<RequestInit, 'body' | 'headers'> & {
    body?: BodyPonyfillInit | null;
    duplex?: 'half' | 'full';
    headers?: PonyfillHeadersInit;
    headersSerializer?: HeadersSerializer;
    agent?: HTTPAgent | HTTPSAgent | false;
};
type HeadersSerializer = (headers: Headers, onContentLength?: (contentLength: string) => void) => string[];
export declare class PonyfillRequest<TJSON = any> extends PonyfillBody<TJSON> implements Request {
    constructor(input: RequestInfo | URL, options?: RequestPonyfillInit);
    headersSerializer?: HeadersSerializer;
    cache: RequestCache;
    credentials: RequestCredentials;
    destination: RequestDestination;
    headers: Headers;
    integrity: string;
    keepalive: boolean;
    method: string;
    mode: RequestMode;
    priority: 'auto' | 'high' | 'low';
    redirect: RequestRedirect;
    referrer: string;
    referrerPolicy: ReferrerPolicy;
    url: string;
    duplex: 'half' | 'full';
    agent: HTTPAgent | HTTPSAgent | false | undefined;
    private _signal;
    get signal(): AbortSignal;
    clone(): PonyfillRequest<TJSON>;
    [Symbol.toStringTag]: string;
}
export {};
