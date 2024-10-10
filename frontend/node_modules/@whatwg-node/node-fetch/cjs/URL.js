"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillURL = void 0;
const tslib_1 = require("tslib");
const buffer_1 = require("buffer");
const crypto_1 = require("crypto");
const fast_querystring_1 = tslib_1.__importDefault(require("fast-querystring"));
const fast_url_parser_1 = tslib_1.__importDefault(require("@kamilkisiela/fast-url-parser"));
const URLSearchParams_js_1 = require("./URLSearchParams.js");
fast_url_parser_1.default.queryString = fast_querystring_1.default;
class PonyfillURL extends fast_url_parser_1.default {
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
            this._searchParams = new URLSearchParams_js_1.PonyfillURLSearchParams(this.query);
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
        const blobUrl = `blob:whatwgnode:${(0, crypto_1.randomUUID)()}`;
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
        return (this.blobRegistry.get(url) || (0, buffer_1.resolveObjectURL)(url));
    }
}
exports.PonyfillURL = PonyfillURL;
