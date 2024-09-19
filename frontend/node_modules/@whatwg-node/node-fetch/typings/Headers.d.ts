export type PonyfillHeadersInit = [string, string][] | Record<string, string> | Headers;
export declare function isHeadersLike(headers: any): headers is Headers;
export declare class PonyfillHeaders implements Headers {
    private headersInit?;
    private _map;
    private objectNormalizedKeysOfHeadersInit;
    private objectOriginalKeysOfHeadersInit;
    private _setCookies;
    constructor(headersInit?: PonyfillHeadersInit | undefined);
    private _get;
    private getMap;
    append(name: string, value: string): void;
    get(name: string): string | null;
    has(name: string): boolean;
    set(name: string, value: string): void;
    delete(name: string): void;
    forEach(callback: (value: string, key: string, parent: Headers) => void): void;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
    entries(): IterableIterator<[string, string]>;
    getSetCookie(): string[];
    [Symbol.iterator](): IterableIterator<[string, string]>;
}
