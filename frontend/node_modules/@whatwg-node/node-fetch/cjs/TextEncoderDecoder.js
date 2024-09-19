"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyfillTextDecoder = exports.PonyfillTextEncoder = void 0;
exports.PonyfillBtoa = PonyfillBtoa;
const utils_js_1 = require("./utils.js");
class PonyfillTextEncoder {
    encoding;
    constructor(encoding = 'utf-8') {
        this.encoding = encoding;
    }
    encode(input) {
        return Buffer.from(input, this.encoding);
    }
    encodeInto(source, destination) {
        const buffer = this.encode(source);
        const copied = buffer.copy(destination);
        return {
            read: copied,
            written: copied,
        };
    }
}
exports.PonyfillTextEncoder = PonyfillTextEncoder;
class PonyfillTextDecoder {
    encoding;
    fatal = false;
    ignoreBOM = false;
    constructor(encoding = 'utf-8', options) {
        this.encoding = encoding;
        if (options) {
            this.fatal = options.fatal || false;
            this.ignoreBOM = options.ignoreBOM || false;
        }
    }
    decode(input) {
        if (Buffer.isBuffer(input)) {
            return input.toString(this.encoding);
        }
        if ((0, utils_js_1.isArrayBufferView)(input)) {
            return Buffer.from(input.buffer, input.byteOffset, input.byteLength).toString(this.encoding);
        }
        return Buffer.from(input).toString(this.encoding);
    }
}
exports.PonyfillTextDecoder = PonyfillTextDecoder;
function PonyfillBtoa(input) {
    return Buffer.from(input, 'binary').toString('base64');
}
