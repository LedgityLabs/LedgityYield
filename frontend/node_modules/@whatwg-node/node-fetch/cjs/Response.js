"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillResponse = void 0;
const http_1 = require("http");
const Body_js_1 = require("./Body.js");
const Headers_js_1 = require("./Headers.js");
const JSON_CONTENT_TYPE = 'application/json; charset=utf-8';
class PonyfillResponse extends Body_js_1.PonyfillBody {
    headers;
    constructor(body, init) {
        super(body || null, init);
        this.headers =
            init?.headers && (0, Headers_js_1.isHeadersLike)(init.headers)
                ? init.headers
                : new Headers_js_1.PonyfillHeaders(init?.headers);
        this.status = init?.status || 200;
        this.statusText = init?.statusText || http_1.STATUS_CODES[this.status] || 'OK';
        this.url = init?.url || '';
        this.redirected = init?.redirected || false;
        this.type = init?.type || 'default';
        this.handleContentLengthHeader();
    }
    get ok() {
        return this.status >= 200 && this.status < 300;
    }
    status;
    statusText;
    url;
    redirected;
    type;
    clone() {
        return this;
    }
    static error() {
        return new PonyfillResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }
    static redirect(url, status = 302) {
        if (status < 300 || status > 399) {
            throw new RangeError('Invalid status code');
        }
        return new PonyfillResponse(null, {
            headers: {
                location: url,
            },
            status,
        });
    }
    static json(data, init = {}) {
        init.headers =
            init?.headers && (0, Headers_js_1.isHeadersLike)(init.headers)
                ? init.headers
                : new Headers_js_1.PonyfillHeaders(init?.headers);
        if (!init.headers.has('content-type')) {
            init.headers.set('content-type', JSON_CONTENT_TYPE);
        }
        return new PonyfillResponse(JSON.stringify(data), init);
    }
}
exports.PonyfillResponse = PonyfillResponse;
