"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUWSResponse = isUWSResponse;
exports.getRequestFromUWSRequest = getRequestFromUWSRequest;
exports.sendResponseToUwsOpts = sendResponseToUwsOpts;
function isUWSResponse(res) {
    return !!res.onData;
}
function getRequestFromUWSRequest({ req, res, fetchAPI, signal }) {
    let body;
    const method = req.getMethod();
    if (method !== 'get' && method !== 'head') {
        let controller;
        body = new fetchAPI.ReadableStream({
            start(c) {
                controller = c;
            },
        });
        const readable = body.readable;
        if (readable) {
            signal.addEventListener('abort', () => {
                readable.push(null);
            });
            res.onData(function (ab, isLast) {
                const chunk = Buffer.from(ab, 0, ab.byteLength);
                readable.push(Buffer.from(chunk));
                if (isLast) {
                    readable.push(null);
                }
            });
        }
        else {
            let closed = false;
            signal.addEventListener('abort', () => {
                if (!closed) {
                    closed = true;
                    controller.close();
                }
            });
            res.onData(function (ab, isLast) {
                const chunk = Buffer.from(ab, 0, ab.byteLength);
                controller.enqueue(Buffer.from(chunk));
                if (isLast) {
                    closed = true;
                    controller.close();
                }
            });
        }
    }
    const headers = new fetchAPI.Headers();
    req.forEach((key, value) => {
        headers.append(key, value);
    });
    let url = `http://localhost${req.getUrl()}`;
    const query = req.getQuery();
    if (query) {
        url += `?${query}`;
    }
    return new fetchAPI.Request(url, {
        method,
        headers,
        body: body,
        signal,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - not in the TS types yet
        duplex: 'half',
    });
}
async function forwardResponseBodyToUWSResponse(uwsResponse, fetchResponse, signal) {
    for await (const chunk of fetchResponse.body) {
        if (signal.aborted) {
            return;
        }
        uwsResponse.cork(() => {
            uwsResponse.write(chunk);
        });
    }
    uwsResponse.cork(() => {
        uwsResponse.end();
    });
}
function sendResponseToUwsOpts(uwsResponse, fetchResponse, signal) {
    if (!fetchResponse) {
        uwsResponse.writeStatus('404 Not Found');
        uwsResponse.end();
        return;
    }
    const bufferOfRes = fetchResponse._buffer;
    if (signal.aborted) {
        return;
    }
    uwsResponse.cork(() => {
        uwsResponse.writeStatus(`${fetchResponse.status} ${fetchResponse.statusText}`);
        for (const [key, value] of fetchResponse.headers) {
            // content-length causes an error with Node.js's fetch
            if (key !== 'content-length') {
                if (key === 'set-cookie') {
                    const setCookies = fetchResponse.headers.getSetCookie?.();
                    if (setCookies) {
                        for (const setCookie of setCookies) {
                            uwsResponse.writeHeader(key, setCookie);
                        }
                        continue;
                    }
                }
                uwsResponse.writeHeader(key, value);
            }
        }
        if (bufferOfRes) {
            uwsResponse.end(bufferOfRes);
        }
    });
    if (bufferOfRes) {
        return;
    }
    if (!fetchResponse.body) {
        uwsResponse.end();
        return;
    }
    return forwardResponseBodyToUWSResponse(uwsResponse, fetchResponse, signal);
}
