// SPDX-License-Identifier: Apache-2.0

require('@nomicfoundation/hardhat-ethers');
const { projectTestConfig } = require('../.testConfig');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    ...projectTestConfig,
    networks: {
        hardhat: {
            forking: {
                url: 'https://testnet.hashio.io/api',
                // This allows Hardhat to enable JSON-RPC's response cache.
                // Forking from a block is not fully integrated yet into System Contract emulation.
                blockNumber: 10471740,
                chainId: 296,
                workerPort: 1237,
            },
        },
    },
};
