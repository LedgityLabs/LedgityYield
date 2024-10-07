import { BodyPonyfillInit, PonyfillBody, PonyfillBodyOptions } from './Body.cjs';
import { PonyfillHeadersInit } from './Headers.cjs';
export type ResponsePonyfilInit = PonyfillBodyOptions & Omit<ResponseInit, 'headers'> & {
    url?: string;
    redirected?: boolean;
    headers?: PonyfillHeadersInit;
    type?: ResponseType;
};
export declare class PonyfillResponse<TJSON = any> extends PonyfillBody<TJSON> implements Response {
    headers: Headers;
    constructor(body?: BodyPonyfillInit | null, init?: ResponsePonyfilInit);
    get ok(): boolean;
    status: number;
    statusText: string;
    url: string;
    redirected: boolean;
    type: ResponseType;
    clone(): this;
    static error(): PonyfillResponse<any>;
    static redirect(url: string, status?: number): PonyfillResponse<any>;
    static json<T = any>(data: T, init?: ResponsePonyfilInit): PonyfillResponse<T>;
}
