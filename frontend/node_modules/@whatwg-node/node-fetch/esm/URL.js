import { resolveObjectURL } from 'buffer';
import { randomUUID } from 'crypto';
import FastQuerystring from 'fast-querystring';
import FastUrl from '@kamilkisiela/fast-url-parser';
import { PonyfillURLSearchParams } from './URLSearchParams.js';
FastUrl.queryString = FastQuerystring;
export class PonyfillURL extends FastUrl {
    constructor(url, base) {
        super();
        if (url.startsWith('data:')) {
            this.protocol = 'data:';
            this.pathname = url.slice('data:'.length);
            return;
        }
        this.parse(url, false);
        if (base) {
            const baseParsed = typeof base === 'string' ? new PonyfillURL(base) : base;
            this.protocol = this.protocol || baseParsed.protocol;
            this.host = this.host || baseParsed.host;
            this.pathname = this.pathname || baseParsed.pathname;
        }
    }
    get origin() {
        return `${this.protocol}//${this.host}`;
    }
    _searchParams;
    get searchParams() {
        if (!this._searchParams) {
            this._searchParams = new PonyfillURLSearchParams(this.query);
        }
        return this._searchParams;
    }
    get username() {
        return this.auth?.split(':')[0] || '';
    }
    set username(value) {
        this.auth = `${value}:${this.password}`;
    }
    get password() {
        return this.auth?.split(':')[1] || '';
    }
    set password(value) {
        this.auth = `${this.username}:${value}`;
    }
    toString() {
        return this.format();
    }
    toJSON() {
        return this.toString();
    }
    static blobRegistry = new Map();
    static createObjectURL(blob) {
        const blobUrl = `blob:whatwgnode:${randomUUID()}`;
        this.blobRegistry.set(blobUrl, blob);
        return blobUrl;
    }
    static resolveObjectURL(url) {
        if (!this.blobRegistry.has(url)) {
            URL.revokeObjectURL(url);
        }
        else {
            this.blobRegistry.delete(url);
        }
    }
    static getBlobFromURL(url) {
        return (this.blobRegistry.get(url) || resolveObjectURL(url));
    }
}
