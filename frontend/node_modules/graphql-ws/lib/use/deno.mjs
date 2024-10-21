import { makeServer } from '../server.mjs';
import { DEPRECATED_GRAPHQL_WS_PROTOCOL, CloseCode, } from '../common.mjs';
export { GRAPHQL_TRANSPORT_WS_PROTOCOL } from '../common.mjs';
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
 * import { schema } from './my-schema.ts/index.mjs';
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
export function makeHandler(options) {
    const server = makeServer(options);
    return function handle(socket) {
        socket.onerror = (err) => {
            console.error('Internal error emitted on the WebSocket socket. ' +
                'Please check your implementation.', err);
            socket.close(CloseCode.InternalServerError, 'Internal server error');
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
                            socket.close(CloseCode.InternalServerError, 'Internal server error');
                        }
                    };
                },
            }, { socket });
        };
        socket.onclose = (event) => {
            if (event.code === CloseCode.SubprotocolNotAcceptable &&
                socket.protocol === DEPRECATED_GRAPHQL_WS_PROTOCOL)
                console.warn(`Client provided the unsupported and deprecated subprotocol "${socket.protocol}" used by subscriptions-transport-ws.` +
                    'Please see https://www.apollographql.com/docs/apollo-server/data/subscriptions/#switching-from-subscriptions-transport-ws.');
            closed(event.code, event.reason);
        };
    };
}
