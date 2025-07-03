// SPDX-License-Identifier: Apache-2.0

const path = require('path');
const { Worker } = require('worker_threads');
const debug = require('util').debuglog('hedera-forking-rpc');

/**
 * Starts a JSON-RPC Forwarder worker that forwards RPC calls to `forkUrl`.
 *
 * `localAddresses` is a list of local addresses used by the local Network when forking.
 * The JSON-RPC Forwarder will **not** forward `eth_getCode` and `eth_getBalance` method calls for these addresses.
 * They **should not** have any associated code nor balance in the remote network.
 * It is intended as a way to make fewer requests to the remote JSON-RPC Relay.
 *
 * @param {string} forkUrl the URL to forward calls to.
 * @param {string} mirrorNodeUrl used to fetch Hedera entity data.
 * @param {number=} chainId the `chainId` of the network it is forwarding to, if any.
 * @param {number=} workerPort a TCP port where the JSON-RPC Forwarder will listen. If not provided, a default value will be used.
 * @param {string[]=} localAddresses List of local addresses used by the local Network when forking.
 * @returns {Promise<Worker & {host: string}>} the running worker together with `host` the forwarder is listening on.
 */
function jsonRPCForwarder(forkUrl, mirrorNodeUrl, chainId, workerPort, localAddresses) {
    return new Promise(resolve => {
        const scriptPath = path.resolve(__dirname, 'json-rpc-forwarder');
        debug(`Creating JSON-RPC Forwarder server from \`${scriptPath}\``);
        const worker = new Worker(scriptPath, {
            workerData: {
                url: forkUrl,
                mirrorNodeUrl,
                chainId,
                workerPort,
                localAddresses,
            },
        });
        worker.on('error', err => console.log(err));
        worker.on('exit', code => debug(`JSON-RPC Forwarder Worker exited with code ${code}`));
        worker.on('message', message => {
            if (message.listening) {
                const host = `http://127.0.0.1:${message.port}`;
                resolve(Object.assign(worker, { host }));
            }
        });
        worker.unref();
        process.on('exit', code => debug(`Main process exited with code ${code}`));
    });
}

module.exports = { jsonRPCForwarder };
