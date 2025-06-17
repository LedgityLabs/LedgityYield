// SPDX-License-Identifier: Apache-2.0

const { strict: assert } = require('assert');
const http = require('http');
const { workerData, parentPort } = require('worker_threads');
const debug = require('util').debuglog('hedera-forking-rpc');
const c = require('ansi-colors');

const { MirrorNodeClient } = require('./mirror-node-client');
const {
    getHtsCode,
    getHtsStorageAt,
    localTokens,
    HTSAddress,
    LONG_ZERO_PREFIX,
    getHIP719Code,
    setLedgerId,
} = require('..');

/** @type {Partial<import('hardhat/types').HardhatNetworkForkingConfig>} */
const { url: forkUrl, mirrorNodeUrl, chainId, workerPort, localAddresses = [] } = workerData;

setLedgerId(chainId);

assert(mirrorNodeUrl !== undefined, 'json-rpc-forwarder: Missing Mirror Node URL');

debug(
    c.yellow('Starting JSON-RPC Forwarder on :%s, forking url=%s mirror node url=%s'),
    workerPort,
    forkUrl,
    mirrorNodeUrl
);

const mirrorNodeClient = new MirrorNodeClient(mirrorNodeUrl);

/**
 * Function signature for `eth_*` method handlers.
 * The `params` argument comes from the JSON-RPC request,
 * so it must to be declared as `unknown[]`.
 * Therefore, each method handler should validate each element of `params` they use.
 *
 * When this handler returns `null`
 * it means the original call needs to be **forwarded** to the remote JSON-RPC Relay.
 *
 * @typedef {(params: unknown[], reqIdPrefix: string) => Promise<unknown | null>} EthHandler
 */

/**
 *
 */
const eth = {
    /** @type {EthHandler} */
    eth_getBalance: async ([address, _blockNumber]) => {
        assert(typeof address === 'string');
        return localAddresses.includes(address.toLowerCase()) ? '0x0' : null;
    },
    /** @type {EthHandler} */
    eth_getCode: async ([address, blockNumber]) => {
        assert(typeof address === 'string');
        if (localAddresses.includes(address.toLowerCase())) {
            return '0x';
        }
        if (address === HTSAddress) {
            debug(c.yellow('loading HTS Code at address %s'), address);
            return getHtsCode();
        }
        if (localTokens.includes(address)) {
            debug(c.yellow('loading HIP719 proxy code for local token at %s'), address);
            return getHIP719Code(address);
        }
        // Don't try to fetch token for Hardhat's `console.log`
        // https://github.com/NomicFoundation/hardhat/blob/e4e2b86776791840299db76cb13f7cecb6640c06/packages/hardhat-core/console.sol#L6
        // See issue https://github.com/hashgraph/hedera-forking/issues/182.
        // Given this address is expected to not have any bytecode, it's safe to return `0x`.
        if (address.toLowerCase() === '0x000000000000000000636f6e736f6c652e6c6f67') {
            return '0x';
        }
        if (address.startsWith(LONG_ZERO_PREFIX)) {
            const tokenId = `0.0.${parseInt(address, 16)}`;
            const token = await mirrorNodeClient.getTokenById(tokenId, Number(blockNumber));
            return token !== null ? getHIP719Code(address) : '0x';
        }
        return null;
    },

    /** @type {EthHandler} */
    eth_getStorageAt: async ([address, slot, blockNumber]) => {
        assert(typeof address === 'string');
        assert(typeof slot === 'string');
        return await getHtsStorageAt(address, slot, Number(blockNumber), mirrorNodeClient);
    },
};

const server = http.createServer(function (req, res) {
    assert(req.url === '/', 'Only root / url is supported');
    assert(req.method === 'POST', 'Only POST allowed');

    // https://nodejs.org/en/learn/modules/anatomy-of-an-http-transaction
    /** @type {Uint8Array[]} */
    const chunks = [];
    req.on('data', chunk => {
        chunks.push(chunk);
    }).on('end', async () => {
        const body = Buffer.concat(chunks).toString();
        const { jsonrpc, id, method, params } = JSON.parse(body);
        assert(jsonrpc === '2.0', 'Only JSON-RPC 2.0 allowed');

        const response = await (async function () {
            const handler = eth[/**@type{keyof typeof eth}*/ (method)];
            if (handler !== undefined) {
                const result = await handler(params, `[Request ID: ${id}]`);
                if (result !== null) {
                    debug(c.dim('non-forwarded request'), c.dim(id), c.blue(method), params);
                    return JSON.stringify({ jsonrpc, id, result });
                }
            }
            debug('fetch request', c.dim(id), c.blue(method), params);
            assert(forkUrl !== undefined);
            const result = await fetch(forkUrl, { method: 'POST', body });

            if (method === 'eth_getBlockByNumber') {
                const json = await result.json();
                for (const tx of json.result.transactions) {
                    tx.accessList = [];
                }
                return JSON.stringify(json);
            }

            return await result.text();
        })();

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(response);
        res.end('');
    });
});

server.listen(workerPort, () => {
    const address = server.address();
    assert(address !== null);
    assert(typeof address === 'object');

    parentPort?.postMessage({
        listening: true,
        ...address,
    });
    debug(`JSON-RPC Forwarder listening on port :${address.port}`);
});
