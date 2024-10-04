import type { IncomingMessage, ServerResponse } from 'http';
import type { Http2ServerRequest, Http2ServerResponse } from 'http2';
import type { Socket } from 'net';
import type { Readable } from 'stream';
import type { FetchAPI, FetchEvent } from './types.js';
export declare function isAsyncIterable(body: any): body is AsyncIterable<any>;
export interface NodeRequest {
    protocol?: string;
    hostname?: string;
    body?: any;
    url?: string;
    originalUrl?: string;
    method?: string;
    headers?: any;
    req?: IncomingMessage | Http2ServerRequest;
    raw?: IncomingMessage | Http2ServerRequest;
    socket?: Socket;
    query?: any;
    once?(event: string, listener: (...args: any[]) => void): void;
    aborted?: boolean;
}
export type NodeResponse = ServerResponse | Http2ServerResponse;
export declare class ServerAdapterRequestAbortSignal extends EventTarget implements AbortSignal {
    aborted: boolean;
    private _onabort;
    reason: any;
    throwIfAborted(): void;
    sendAbort(): void;
    get onabort(): ((this: AbortSignal, ev: Event) => any) | null;
    set onabort(value: ((this: AbortSignal, ev: Event) => any) | null);
    any(signals: Iterable<AbortSignal>): AbortSignal;
}
export declare const nodeRequestResponseMap: WeakMap<NodeRequest, NodeResponse>;
export declare function normalizeNodeRequest(nodeRequest: NodeRequest, RequestCtor: typeof Request): Request;
export declare function isReadable(stream: any): stream is Readable;
export declare function isNodeRequest(request: any): request is NodeRequest;
export declare function isServerResponse(stream: any): stream is NodeResponse;
export declare function isReadableStream(stream: any): stream is ReadableStream;
export declare function isFetchEvent(event: any): event is FetchEvent;
export declare function sendNodeResponse(fetchResponse: Response, serverResponse: NodeResponse, nodeRequest: NodeRequest): Promise<void> | undefined;
export declare function isRequestInit(val: unknown): val is RequestInit;
export declare function completeAssign(...args: any[]): any;
export declare function isPromise<T>(val: T | Promise<T>): val is Promise<T>;
export declare function iterateAsyncVoid<TInput>(iterable: Iterable<TInput>, callback: (input: TInput, stopEarly: () => void) => Promise<void> | void): Promise<void> | void;
export declare function handleErrorFromRequestHandler(error: any, ResponseCtor: typeof Response): Response;
export declare function isolateObject<TIsolatedObject extends object>(originalCtx: TIsolatedObject, waitUntilPromises?: Promise<unknown>[]): TIsolatedObject;
export interface DeferredPromise<T = void> {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (reason: any) => void;
}
export declare function createDeferredPromise<T = void>(): DeferredPromise<T>;
export declare function handleAbortSignalAndPromiseResponse(response$: Promise<Response> | Response, abortSignal?: AbortSignal | null): Response | Promise<Response>;
export declare const decompressedResponseMap: WeakMap<Response, Response>;
export declare function getSupportedEncodings(fetchAPI: FetchAPI): CompressionFormat[];
export declare function handleResponseDecompression(response: Response, fetchAPI: FetchAPI): Response;
