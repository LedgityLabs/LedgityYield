// SPDX-License-Identifier: Apache-2.0

const path = require('path');
const { Worker } = require('worker_threads');
const { expect } = require('chai');
const ethers = require('ethers');

const { anvil } = require('./.anvil.js');
const IERC20 = require('../out/IERC20.sol/IERC20.json');

/**
 * @returns {Promise<string>}
 */
function jsonRpcMock() {
    return new Promise(resolve => {
        const scriptPath = path.resolve(__dirname, 'scripts/json-rpc-mock');
        const worker = new Worker(scriptPath);
        worker.on('error', err => console.log(err));
        worker.on('exit', code => console.log(`JSON-RPC Mock Worker exited with code ${code}`));
        worker.on('message', message => {
            if (message.listening) {
                resolve(`http://localhost:${message.port}`);
            }
        });
        worker.unref();
    });
}

describe('::anvil', function () {
    /**@type {ethers.JsonRpcProvider} */
    let mockProvider;

    /**@type {ethers.JsonRpcProvider} */
    let anvilProvider;

    before(async function () {
        const mockHost = await jsonRpcMock();
        const anvilHost = await anvil(mockHost);
        console.log('Anvil listening on', anvilHost);

        // Disable batch requests because `json-rpc-mock` does not support them
        mockProvider = new ethers.JsonRpcProvider(mockHost, undefined, {
            batchMaxCount: 1,
        });
        anvilProvider = new ethers.JsonRpcProvider(anvilHost);

        const n = await anvilProvider.getNetwork();
        console.log("Anvil's chain id", n.chainId);
    });

    [
        /**
         * https://hashscan.io/testnet/token/0.0.429274
         * https://testnet.mirrornode.hedera.com/api/v1/tokens/0.0.429274
         */
        {
            address: '0x0000000000000000000000000000000000068cDa',
            name: 'USD Coin',
            symbol: 'USDC',
            decimals: 6n,
            // 1 request for each field: `tokenType` (implicit), `name`, `symbol` and `decimals` (4)
            // (both `name` and `symbol` have less than 32 bytes)
            nrequests: 4,
        },
        /**
         * https://hashscan.io/testnet/token/0.0.4730999
         * https://testnet.mirrornode.hedera.com/api/v1/tokens/0.0.4730999
         */
        {
            address: '0x0000000000000000000000000000000000483077',
            name: 'My Crypto Token is the name which the string length is greater than 31',
            symbol: 'Token symbol must be exactly 32!',
            decimals: 0n,
            // 1 request for each field: `tokenType` (implicit), `name`, `symbol` and `decimals` (4)
            // plus (3) for additional `name` words and (1) for additional `symbol` word
            nrequests: 8,
        },
    ].forEach(({ address, name, symbol, decimals, nrequests }) => {
        it(`should get token metadata for token \`${name}\``, async function () {
            const ft = new ethers.Contract(address, IERC20.abi, anvilProvider);
            expect(await ft['name']()).to.be.equal(name);
            expect(await ft['symbol']()).to.be.equal(symbol);
            expect(await ft['decimals']()).to.be.equal(decimals);
            expect(await mockProvider.send('test_getMirrorNodeRequests', [])).to.have.length(
                nrequests
            );
        });
    });
});
