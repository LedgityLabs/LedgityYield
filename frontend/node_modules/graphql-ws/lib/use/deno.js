"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeHandler = exports.GRAPHQL_TRANSPORT_WS_PROTOCOL = void 0;
const server_1 = require("../server");
const common_1 = require("../common");
var common_2 = require("../common");
Object.defineProperty(exports, "GRAPHQL_TRANSPORT_WS_PROTOCOL", { enumerable: true, get: function () { return common_2.GRAPHQL_TRANSPORT_WS_PROTOCOL; } });
/**
 * Use the server with [Deno](https://deno.com/).
 * This is a basic starter, feel free to copy the code over and adjust it to your needs.
 *
 * The keep-alive is set in `Deno.upgradeWebSocket` during the upgrade.
 *
 * Additionally, the required WebSocket protocol is also defined during the upgrade,
 * the correct example being:
 *
 * ```ts
 * import { serve } from 'https://deno.land/std/http/mod.ts';
 * import {
 *   makeHandler,
 *   GRAPHQL_TRANSPORT_WS_PROTOCOL,
 * } from 'https://esm.sh/graphql-ws/lib/use/deno';
 * import { schema } from './my-schema.ts';
 *
 * const handler = makeHandler({ schema });
 *
 * serve(
 *   (req: Request) => {
 *     const [path, _search] = req.url.split('?');
 *     if (!path.endsWith('/graphql')) {
 *       return new Response('Not Found', { status: 404 });
 *     }
 *     if (req.headers.get('upgrade') != 'websocket') {
 *       return new Response('Upgrade Required', { status: 426 });
 *     }
 *     const { socket, response } = Deno.upgradeWebSocket(req, {
 *       protocol: GRAPHQL_TRANSPORT_WS_PROTOCOL,
 *       idleTimeout: 12_000,
 *     });
 *     handler(socket);
 *     return response;
 *   },
 *   { port: 4000 },
 * );
 * ```
 *
 * @category Server/deno
 */
function makeHandler(options) {
    const server = (0, server_1.makeServer)(options);
    return function handle(socket) {
        socket.onerror = (err) => {
            console.error('Internal error emitted on the WebSocket socket. ' +
                'Please check your implementation.', err);
            socket.close(common_1.CloseCode.InternalServerError, 'Internal server error');
        };
        let closed = () => {
            // noop
        };
        socket.onopen = () => {
            closed = server.opened({
                protocol: socket.protocol,
                send: (msg) => socket.send(msg),
                close: (code, reason) => socket.close(code, reason),
                onMessage: (cb) => {
                    socket.onmessage = async (event) => {
                        try {
                            await cb(String(event.data));
                        }
                        catch (err) {
                            console.error('Internal error occurred during message handling. ' +
                                'Please check your implementation.', err);
                            socket.close(common_1.CloseCode.InternalServerError, 'Internal server error');
                        }
                    };
                },
            }, { socket });
        };
        socket.onclose = (event) => {
            if (event.code === common_1.CloseCode.SubprotocolNotAcceptable &&
                socket.protocol === common_1.DEPRECATED_GRAPHQL_WS_PROTOCOL)
                console.warn(`Client provided the unsupported and deprecated subprotocol "${socket.protocol}" used by subscriptions-transport-ws.` +
                    'Please see https://www.apollographql.com/docs/apollo-server/data/subscriptions/#switching-from-subscriptions-transport-ws.');
            closed(event.code, event.reason);
        };
    };
}
exports.makeHandler = makeHandler;
