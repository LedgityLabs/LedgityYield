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
                blockNumber: 10471740,
                chainId: 296,
                workerPort: 1235,
            },
        },
    },
};
