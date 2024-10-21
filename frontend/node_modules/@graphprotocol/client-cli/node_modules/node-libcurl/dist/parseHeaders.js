"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHeaders = void 0;
/**
 * Parses the headers that were stored while
 *  the request was being processed.
 *
 * @internal
 */
function parseHeaders(headersString) {
    const headers = headersString.split(/\r?\n|\r/g);
    const len = headers.length;
    const result = [];
    let isStatusLine = true;
    let currHeaders = {};
    for (let i = 0; i < len; i += 1) {
        // status line
        if (isStatusLine) {
            const header = headers[i].split(' ');
            currHeaders.result = {
                version: header.shift() || '',
                code: parseInt(header.shift() || '0', 10),
                reason: header.join(' '),
            };
            isStatusLine = false;
            continue;
        }
        // Empty string means empty line, which means another header group
        if (headers[i] === '') {
            result.push(currHeaders);
            currHeaders = {};
            isStatusLine = true;
            continue;
        }
        const header = headers[i].split(/:\s(.+)/);
        if (header[0].toUpperCase() === 'SET-COOKIE') {
            if (!currHeaders['Set-Cookie']) {
                currHeaders['Set-Cookie'] = [];
            }
            currHeaders['Set-Cookie'].push(header[1]);
        }
        else {
            currHeaders[header[0]] = header[1];
        }
    }
    return result;
}
exports.parseHeaders = parseHeaders;
//# sourceMappingURL=parseHeaders.js.map