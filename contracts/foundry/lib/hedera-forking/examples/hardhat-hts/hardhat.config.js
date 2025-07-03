// SPDX-License-Identifier: Apache-2.0

require('@nomicfoundation/hardhat-toolbox');
require('@hashgraph/system-contracts-forking/plugin');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: '0.8.27',
    networks: {
        hardhat: {
            forking: {
                url: 'https://mainnet.hashio.io/api',
                // This allows Hardhat to enable JSON-RPC's response cache.
                // Forking from a block is not fully integrated yet into HTS emulation.
                blockNumber: 70531900,
                chainId: 295,
                workerPort: 1235,
            },
        },
    },
};
