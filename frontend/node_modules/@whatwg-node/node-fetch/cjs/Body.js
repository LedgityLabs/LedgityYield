"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillBody = void 0;
const tslib_1 = require("tslib");
const stream_1 = require("stream");
const busboy_1 = tslib_1.__importDefault(require("busboy"));
const Blob_js_1 = require("./Blob.js");
const File_js_1 = require("./File.js");
const FormData_js_1 = require("./FormData.js");
const ReadableStream_js_1 = require("./ReadableStream.js");
const utils_js_1 = require("./utils.js");
var BodyInitType;
(function (BodyInitType) {
    BodyInitType["ReadableStream"] = "ReadableStream";
    BodyInitType["Blob"] = "Blob";
    BodyInitType["FormData"] = "FormData";
    BodyInitType["String"] = "String";
    BodyInitType["Readable"] = "Readable";
    BodyInitType["Buffer"] = "Buffer";
})(BodyInitType || (BodyInitType = {}));
class PonyfillBody {
    bodyInit;
    options;
    bodyUsed = false;
    contentType = null;
    contentLength = null;
    constructor(bodyInit, options = {}) {
        this.bodyInit = bodyInit;
        this.options = options;
        const { bodyFactory, contentType, contentLength, bodyType, buffer } = processBodyInit(bodyInit);
        this._bodyFactory = bodyFactory;
        this.contentType = contentType;
        this.contentLength = contentLength;
        this.bodyType = bodyType;
        this._buffer = buffer;
    }
    bodyType;
    _bodyFactory = () => null;
    _generatedBody = null;
    _buffer;
    generateBody() {
        if (this._generatedBody?.readable?.destroyed && this._buffer) {
            this._generatedBody.readable = stream_1.Readable.from(this._buffer);
        }
        if (this._generatedBody) {
            return this._generatedBody;
        }
        const body = this._bodyFactory();
        this._generatedBody = body;
        return body;
    }
    handleContentLengthHeader(forceSet = false) {
        const contentTypeInHeaders = this.headers.get('content-type');
        if (!contentTypeInHeaders) {
            if (this.contentType) {
                this.headers.set('content-type', this.contentType);
            }
        }
        else {
            this.contentType = contentTypeInHeaders;
        }
        const contentLengthInHeaders = this.headers.get('content-length');
        if (forceSet && this.bodyInit == null && !contentLengthInHeaders) {
            this.contentLength = 0;
            this.headers.set('content-length', '0');
        }
        if (!contentLengthInHeaders) {
            if (this.contentLength) {
                this.headers.set('content-length', this.contentLength.toString());
            }
        }
        else {
            this.contentLength = parseInt(contentLengthInHeaders, 10);
        }
    }
    get body() {
        const _body = this.generateBody();
        if (_body != null) {
            const ponyfillReadableStream = _body;
            const readable = _body.readable;
            return new Proxy(_body.readable, {
                get(_, prop) {
                    if (prop in ponyfillReadableStream) {
                        const ponyfillReadableStreamProp = ponyfillReadableStream[prop];
                        if (typeof ponyfillReadableStreamProp === 'function') {
                            return ponyfillReadableStreamProp.bind(ponyfillReadableStream);
                        }
                        return ponyfillReadableStreamProp;
                    }
                    if (prop in readable) {
                        const readableProp = readable[prop];
                        if (typeof readableProp === 'function') {
                            return readableProp.bind(readable);
                        }
                        return readableProp;
                    }
                },
            });
        }
        return null;
    }
    _chunks = null;
    _collectChunksFromReadable() {
        if (this._chunks) {
            return (0, utils_js_1.fakePromise)(this._chunks);
        }
        const _body = this.generateBody();
        if (!_body) {
            return (0, utils_js_1.fakePromise)([]);
        }
        this._chunks = [];
        _body.readable.on('data', chunk => {
            this._chunks.push(chunk);
        });
        return new Promise((resolve, reject) => {
            _body.readable.once('end', () => {
                resolve(this._chunks);
            });
            _body.readable.once('error', e => {
                reject(e);
            });
        });
    }
    _blob = null;
    blob() {
        if (this._blob) {
            return (0, utils_js_1.fakePromise)(this._blob);
        }
        if (this.bodyType === BodyInitType.Blob) {
            this._blob = this.bodyInit;
            return (0, utils_js_1.fakePromise)(this._blob);
        }
        if (this._buffer) {
            this._blob = new Blob_js_1.PonyfillBlob([this._buffer], {
                type: this.contentType || '',
                size: this.contentLength,
            });
            return (0, utils_js_1.fakePromise)(this._blob);
        }
        return this._collectChunksFromReadable().then(chunks => {
            this._blob = new Blob_js_1.PonyfillBlob(chunks, {
                type: this.contentType || '',
                size: this.contentLength,
            });
            return this._blob;
        });
    }
    _formData = null;
    formData(opts) {
        if (this._formData) {
            return (0, utils_js_1.fakePromise)(this._formData);
        }
        if (this.bodyType === BodyInitType.FormData) {
            this._formData = this.bodyInit;
            return (0, utils_js_1.fakePromise)(this._formData);
        }
        this._formData = new FormData_js_1.PonyfillFormData();
        const _body = this.generateBody();
        if (_body == null) {
            return (0, utils_js_1.fakePromise)(this._formData);
        }
        const formDataLimits = {
            ...this.options.formDataLimits,
            ...opts?.formDataLimits,
        };
        return new Promise((resolve, reject) => {
            const bb = (0, busboy_1.default)({
                headers: {
                    'content-type': this.contentType || '',
                },
                limits: formDataLimits,
                defParamCharset: 'utf-8',
            });
            bb.on('field', (name, value, { nameTruncated, valueTruncated }) => {
                if (nameTruncated) {
                    reject(new Error(`Field name size exceeded: ${formDataLimits?.fieldNameSize} bytes`));
                }
                if (valueTruncated) {
                    reject(new Error(`Field value size exceeded: ${formDataLimits?.fieldSize} bytes`));
                }
                this._formData.set(name, value);
            });
            bb.on('fieldsLimit', () => {
                reject(new Error(`Fields limit exceeded: ${formDataLimits?.fields}`));
            });
            bb.on('file', (name, fileStream, { filename, mimeType }) => {
                const chunks = [];
                fileStream.on('limit', () => {
                    reject(new Error(`File size limit exceeded: ${formDataLimits?.fileSize} bytes`));
                });
                fileStream.on('data', chunk => {
                    chunks.push(chunk);
                });
                fileStream.on('close', () => {
                    if (fileStream.truncated) {
                        reject(new Error(`File size limit exceeded: ${formDataLimits?.fileSize} bytes`));
                    }
                    const file = new File_js_1.PonyfillFile(chunks, filename, { type: mimeType });
                    this._formData.set(name, file);
                });
            });
            bb.on('filesLimit', () => {
                reject(new Error(`Files limit exceeded: ${formDataLimits?.files}`));
            });
            bb.on('partsLimit', () => {
                reject(new Error(`Parts limit exceeded: ${formDataLimits?.parts}`));
            });
            bb.on('close', () => {
                resolve(this._formData);
            });
            bb.on('error', (err = 'An error occurred while parsing the form data') => {
                const errMessage = err.message || err.toString();
                reject(new TypeError(errMessage, err.cause));
            });
            _body?.readable.pipe(bb);
        });
    }
    buffer() {
        if (this._buffer) {
            return (0, utils_js_1.fakePromise)(this._buffer);
        }
        if (this.bodyType === BodyInitType.Blob) {
            if ((0, Blob_js_1.hasBufferMethod)(this.bodyInit)) {
                return this.bodyInit.buffer().then(buf => {
                    this._buffer = buf;
                    return this._buffer;
                });
            }
            if ((0, Blob_js_1.hasBytesMethod)(this.bodyInit)) {
                return this.bodyInit.bytes().then(bytes => {
                    this._buffer = Buffer.from(bytes);
                    return this._buffer;
                });
            }
            if ((0, Blob_js_1.hasArrayBufferMethod)(this.bodyInit)) {
                return this.bodyInit.arrayBuffer().then(buf => {
                    this._buffer = Buffer.from(buf, undefined, buf.byteLength);
                    return this._buffer;
                });
            }
        }
        return this._collectChunksFromReadable().then(chunks => {
            if (chunks.length === 1) {
                this._buffer = chunks[0];
                return this._buffer;
            }
            this._buffer = Buffer.concat(chunks);
            return this._buffer;
        });
    }
    bytes() {
        return this.buffer();
    }
    arrayBuffer() {
        return this.buffer();
    }
    _json = null;
    json() {
        if (this._json) {
            return (0, utils_js_1.fakePromise)(this._json);
        }
        return this.text().then(text => {
            try {
                this._json = JSON.parse(text);
            }
            catch (e) {
                if (e instanceof SyntaxError) {
                    e.message += `, "${text}" is not valid JSON`;
                }
                throw e;
            }
            return this._json;
        });
    }
    _text = null;
    text() {
        if (this._text) {
            return (0, utils_js_1.fakePromise)(this._text);
        }
        if (this.bodyType === BodyInitType.String) {
            this._text = this.bodyInit;
            return (0, utils_js_1.fakePromise)(this._text);
        }
        return this.buffer().then(buffer => {
            this._text = buffer.toString('utf-8');
            return this._text;
        });
    }
}
exports.PonyfillBody = PonyfillBody;
function processBodyInit(bodyInit) {
    if (bodyInit == null) {
        return {
            bodyFactory: () => null,
            contentType: null,
            contentLength: null,
        };
    }
    if (typeof bodyInit === 'string') {
        const buffer = Buffer.from(bodyInit);
        const contentLength = buffer.byteLength;
        return {
            bodyType: BodyInitType.String,
            contentType: 'text/plain;charset=UTF-8',
            contentLength,
            buffer,
            bodyFactory() {
                const readable = stream_1.Readable.from(buffer);
                return new ReadableStream_js_1.PonyfillReadableStream(readable);
            },
        };
    }
    if (Buffer.isBuffer(bodyInit)) {
        return {
            bodyType: BodyInitType.Buffer,
            contentType: null,
            contentLength: bodyInit.length,
            buffer: bodyInit,
            bodyFactory() {
                const readable = stream_1.Readable.from(bodyInit);
                const body = new ReadableStream_js_1.PonyfillReadableStream(readable);
                return body;
            },
        };
    }
    if ((0, utils_js_1.isArrayBufferView)(bodyInit)) {
        const buffer = Buffer.from(bodyInit.buffer, bodyInit.byteOffset, bodyInit.byteLength);
        return {
            bodyType: BodyInitType.Buffer,
            contentLength: bodyInit.byteLength,
            contentType: null,
            buffer,
            bodyFactory() {
                const readable = stream_1.Readable.from(buffer);
                const body = new ReadableStream_js_1.PonyfillReadableStream(readable);
                return body;
            },
        };
    }
    if (bodyInit instanceof ReadableStream_js_1.PonyfillReadableStream && bodyInit.readable != null) {
        return {
            bodyType: BodyInitType.ReadableStream,
            bodyFactory: () => bodyInit,
            contentType: null,
            contentLength: null,
        };
    }
    if (isBlob(bodyInit)) {
        return {
            bodyType: BodyInitType.Blob,
            contentType: bodyInit.type,
            contentLength: bodyInit.size,
            bodyFactory() {
                return bodyInit.stream();
            },
        };
    }
    if (bodyInit instanceof ArrayBuffer) {
        const contentLength = bodyInit.byteLength;
        const buffer = Buffer.from(bodyInit, undefined, bodyInit.byteLength);
        return {
            bodyType: BodyInitType.Buffer,
            contentType: null,
            contentLength,
            buffer,
            bodyFactory() {
                const readable = stream_1.Readable.from(buffer);
                const body = new ReadableStream_js_1.PonyfillReadableStream(readable);
                return body;
            },
        };
    }
    if (bodyInit instanceof stream_1.Readable) {
        return {
            bodyType: BodyInitType.Readable,
            contentType: null,
            contentLength: null,
            bodyFactory() {
                const body = new ReadableStream_js_1.PonyfillReadableStream(bodyInit);
                return body;
            },
        };
    }
    if (isURLSearchParams(bodyInit)) {
        const contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
        return {
            bodyType: BodyInitType.String,
            contentType,
            contentLength: null,
            bodyFactory() {
                const body = new ReadableStream_js_1.PonyfillReadableStream(stream_1.Readable.from(bodyInit.toString()));
                return body;
            },
        };
    }
    if (isFormData(bodyInit)) {
        const boundary = Math.random().toString(36).substr(2);
        const contentType = `multipart/form-data; boundary=${boundary}`;
        return {
            bodyType: BodyInitType.FormData,
            contentType,
            contentLength: null,
            bodyFactory() {
                return (0, FormData_js_1.getStreamFromFormData)(bodyInit, boundary);
            },
        };
    }
    if (isReadableStream(bodyInit)) {
        return {
            contentType: null,
            contentLength: null,
            bodyFactory() {
                return new ReadableStream_js_1.PonyfillReadableStream(bodyInit);
            },
        };
    }
    if (bodyInit[Symbol.iterator] || bodyInit[Symbol.asyncIterator]) {
        return {
            contentType: null,
            contentLength: null,
            bodyFactory() {
                const readable = stream_1.Readable.from(bodyInit);
                return new ReadableStream_js_1.PonyfillReadableStream(readable);
            },
        };
    }
    throw new Error('Unknown body type');
}
function isFormData(value) {
    return value?.forEach != null;
}
function isBlob(value) {
    return value?.stream != null;
}
function isURLSearchParams(value) {
    return value?.sort != null;
}
function isReadableStream(value) {
    return value?.getReader != null;
}
