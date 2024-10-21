"use strict";
/// <reference types="bun-types" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeHandler = exports.handleProtocols = void 0;
const common_1 = require("../common");
const server_1 = require("../server");
/**
 * Convenience export for checking the WebSocket protocol on the request in `Bun.serve`.
 */
var server_2 = require("../server");
Object.defineProperty(exports, "handleProtocols", { enumerable: true, get: function () { return server_2.handleProtocols; } });
/**
 * Use the server with [Bun](https://bun.sh/).
 * This is a basic starter, feel free to copy the code over and adjust it to your needs
 *
 * The WebSocket subprotocol is not available on the established socket and therefore
 * needs to be checked during the request handling.
 *
 * Additionally, the keep-alive logic _seems_ to be handled by Bun seeing that
 * they default [`sendPingsAutomatically` to `true`](https://github.com/oven-sh/bun/blob/6a163cf933542506354dc836bd92693bcae5939b/src/deps/uws.zig#L893).
 *
 * ```ts
 * import { makeHandler, handleProtocols } from 'graphql-ws/lib/use/lib/bun';
 * import { schema } from './my-schema';
 *
 * Bun.serve({
 *   fetch(req, server) {
 *     const [path, _search] = req.url.split('?');
 *     if (!path.endsWith('/graphql')) {
 *       return new Response('Not Found', { status: 404 });
 *     }
 *     if (req.headers.get('upgrade') != 'websocket') {
 *       return new Response('Upgrade Required', { status: 426 });
 *     }
 *     if (!handleProtocols(req.headers.get('sec-websocket-protocol') || '')) {
 *       return new Response('Bad Request', { status: 404 });
 *     }
 *     if (!server.upgrade(req)) {
 *       return new Response('Internal Server Error', { status: 500 });
 *     }
 *     return new Response();
 *   },
 *   websocket: makeHandler({ schema }),
 *   port: 4000,
 * });
 *
 * console.log('Listening to port 4000');
 * ```
 *
 * @category Server/bun
 */
function makeHandler(options) {
    const server = (0, server_1.makeServer)(options);
    const clients = new WeakMap();
    return {
        open(ws) {
            const client = {
                handleMessage: () => {
                    throw new Error('Message received before handler was registered');
                },
                closed: () => {
                    throw new Error('Closed before handler was registered');
                },
            };
            client.closed = server.opened({
                // TODO: use protocol on socket once Bun exposes it
                protocol: common_1.GRAPHQL_TRANSPORT_WS_PROTOCOL,
                send: async (message) => {
                    // ws might have been destroyed in the meantime, send only if exists
                    if (clients.has(ws)) {
                        ws.sendText(message);
                    }
                },
                close: (code, reason) => {
                    if (clients.has(ws)) {
                        ws.close(code, reason);
                    }
                },
                onMessage: (cb) => (client.handleMessage = cb),
            }, { socket: ws });
            clients.set(ws, client);
        },
        message(ws, message) {
            const client = clients.get(ws);
            if (!client)
                throw new Error('Message received for a missing client');
            return client.handleMessage(String(message));
        },
        close(ws, code, message) {
            const client = clients.get(ws);
            if (!client)
                throw new Error('Closing a missing client');
            return client.closed(code, message);
        },
    };
}
exports.makeHandler = makeHandler;
