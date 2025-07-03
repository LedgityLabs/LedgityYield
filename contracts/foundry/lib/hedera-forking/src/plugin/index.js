// SPDX-License-Identifier: Apache-2.0

const { strict: assert } = require('assert');
const debug = require('util').debuglog('hedera-forking');
const { extendConfig, extendEnvironment } = require('hardhat/config');
const { jsonRPCForwarder } = require('../forwarder');
const { getAddresses } = require('./hardhat-addresses');

const chains = {
    295: 'https://mainnet-public.mirrornode.hedera.com/api/v1/',
    296: 'https://testnet.mirrornode.hedera.com/api/v1/',
    297: 'https://previewnet.mirrornode.hedera.com/api/v1/',
    298: 'http://localhost:5551/api/v1/',
};

/**
 * Extends the Hardhat config to setup hardfork history for Hedera networks and
 * determine whether system contract emulation should be activated.
 *
 * ### Hardfork History Setup
 *
 * This avoids the problem `No known hardfork for execution on historical block`
 * when running a forked network against a Hedera network.
 *
 * Note that the Hardhat config will be extended regardless of the selected network.
 * This is to simplify the `extendConfig` logic and it does not harm having the extra chains config.
 *
 * We use `shanghai` as the default hardfork because setting this to `cancun` leads to the error
 *
 * ```
 * internal error: entered unreachable code: error: Header(ExcessBlobGasNotSet)
 * ```
 *
 * which looks like an issue in EDR
 * https://github.com/NomicFoundation/edr/blob/8aded8ba38da741b6591a9550ab1f71cd138528e/crates/edr_evm/src/block/builder.rs#L99-L103.
 * Nevertheless `cancun` opcodes work fine when running a Hardhat forked network.
 *
 * https://hardhat.org/hardhat-network/docs/guides/forking-other-networks#using-a-custom-hardfork-history
 * https://hardhat.org/hardhat-network/docs/reference#chains
 *
 * ### Configuration of HTS emulation
 *
 * When `chainId` is present in the `forking` property, we try to activate HTS emulation.
 * In this step we only setup the config.
 * See `extendEnvironment` for its actual activation.
 */
extendConfig((config, userConfig) => {
    debug('extendConfig');

    const hardhatChains = config.networks.hardhat.chains;
    for (const chainIdKey of Object.keys(chains)) {
        const chainId = Number(chainIdKey);
        // This can be already set if the user configures a custom hardfork for a Hedera network.
        // We don't want to overwrite the value set by the user.
        if (hardhatChains.get(chainId) === undefined) {
            debug(`Setting hardfork history for chain ${chainId}`);
            hardhatChains.set(Number(chainId), {
                hardforkHistory: new Map().set('shanghai', 0),
            });
        } else {
            debug(`Hardfork history for chain ${chainId} set by the user`);
        }
    }

    const forking = userConfig.networks?.hardhat?.forking;
    if (forking !== undefined && 'chainId' in forking) {
        const chainId = Number(forking.chainId);
        const mirrorNodeUrl = chains[/**@type{keyof typeof chains}*/ (chainId)];
        if (mirrorNodeUrl !== undefined) {
            const workerPort = 'workerPort' in forking ? Number(forking.workerPort) : 1234;
            const forkingConfig = config.networks.hardhat.forking;
            // Should always be true
            if (forkingConfig !== undefined) {
                forkingConfig.chainId = chainId;
                forkingConfig.mirrorNodeUrl = mirrorNodeUrl;
                forkingConfig.workerPort = workerPort;
                forkingConfig.localAddresses = getAddresses(config.networks.hardhat.accounts);
                debug(`HTS emulation configured`);
            }
        } else {
            debug(`Mirror Node URL for chainId ${chainId} not found, HTS emulation disabled`);
        }
    }
});

/**
 * It creates a service `Worker` that intercepts the JSON-RPC calls made to the remote network.
 * This is called directly by EDR,
 * so we can hook into `eth_getCode` and `eth_getStorageAt` to provide HTS emulation.
 *
 * This needs to be done in the `extendEnvironment` (or `extendConfig`) because it changes the `forking.url`.
 * The `forking.url` is then used to create an `EdrProviderWrapper` instance.
 * The [`extendProvider`](https://hardhat.org/hardhat-runner/docs/advanced/building-plugins#extending-the-hardhat-provider)
 * hook runs after the `EdrProviderWrapper` has been constructed,
 * and it cannot be changed directly from the `EdrProviderWrapper` instance.
 *
 * This creates a problem because the `extendEnvironment` callback cannot be `async`.
 * Essentially the main issue is "since Hardhat needs to be loadable via `require` call, configuration must be synchronous".
 * See the following issues for more details
 *
 * - https://github.com/NomicFoundation/hardhat/issues/3287
 * - https://github.com/NomicFoundation/hardhat/issues/2496
 *
 * That is why we need to shift the setting of `chainId` and `workerPort` to the user,
 * so we can update the `forking.url` if needed **synchronously**.
 */
extendEnvironment(hre => {
    debug('extendEnvironment');

    if ('forking' in hre.network.config) {
        const forking = hre.network.config.forking;
        if (forking.chainId !== undefined) {
            const { url, mirrorNodeUrl, chainId, workerPort, localAddresses } = forking;
            assert(mirrorNodeUrl !== undefined);
            hre.jsonRPCForwarder = jsonRPCForwarder(
                url,
                mirrorNodeUrl,
                chainId,
                workerPort,
                localAddresses
            );
            forking.url = `http://127.0.0.1:${forking.workerPort}`;
        }
    }
});
