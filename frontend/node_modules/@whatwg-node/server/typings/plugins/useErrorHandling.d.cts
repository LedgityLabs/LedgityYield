import { ServerAdapterPlugin } from './types.cjs';
export declare function createDefaultErrorHandler<TServerContext = {}>(ResponseCtor?: typeof Response): ErrorHandler<TServerContext>;
export declare class HTTPError extends Error {
    status: number;
    message: string;
    headers: HeadersInit;
    details?: any;
    name: string;
    constructor(status: number, message: string, headers?: HeadersInit, details?: any);
}
export type ErrorHandler<TServerContext> = (e: any, request: Request, ctx: TServerContext) => Response | Promise<Response>;
export declare function useErrorHandling<TServerContext>(onError?: ErrorHandler<TServerContext>): ServerAdapterPlugin<TServerContext>;
