// SPDX-License-Identifier: Apache-2.0

require('@nomicfoundation/hardhat-ethers');
const { projectTestConfig } = require('../.testConfig');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    ...projectTestConfig,
    networks: {
        hardhat: {
            forking: {
                url: 'https://mainnet.hashio.io/api',
                blockNumber: 40804822,
                chainId: 295,
                workerPort: 1236,
            },
        },
    },
};
