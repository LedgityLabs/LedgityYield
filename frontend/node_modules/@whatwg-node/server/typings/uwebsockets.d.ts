import type { FetchAPI } from './types.js';
import { ServerAdapterRequestAbortSignal } from './utils.js';
export interface UWSRequest {
    getMethod(): string;
    forEach(callback: (key: string, value: string) => void): void;
    getUrl(): string;
    getQuery(): string;
    getHeader(key: string): string | undefined;
    setYield(y: boolean): void;
}
export interface UWSResponse {
    onData(callback: (chunk: ArrayBuffer, isLast: boolean) => void): void;
    onAborted(callback: () => void): void;
    writeStatus(status: string): void;
    writeHeader(key: string, value: string): void;
    end(body?: any): void;
    close(): void;
    write(body: any): boolean;
    cork(callback: () => void): void;
}
export type UWSHandler = (res: UWSResponse, req: UWSRequest) => void | Promise<void>;
export declare function isUWSResponse(res: any): res is UWSResponse;
interface GetRequestFromUWSOpts {
    req: UWSRequest;
    res: UWSResponse;
    fetchAPI: FetchAPI;
    signal: AbortSignal;
}
export declare function getRequestFromUWSRequest({ req, res, fetchAPI, signal }: GetRequestFromUWSOpts): Request;
export declare function sendResponseToUwsOpts(uwsResponse: UWSResponse, fetchResponse: Response, signal: ServerAdapterRequestAbortSignal): Promise<void> | undefined;
export {};
