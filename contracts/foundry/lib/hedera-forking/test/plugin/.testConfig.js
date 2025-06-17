// SPDX-License-Identifier: Apache-2.0

require('@hashgraph/system-contracts-forking/plugin');

module.exports = {
    /**
     * Shared config for Hardhat test projects.
     *
     * @type import('hardhat/config').HardhatUserConfig
     */
    projectTestConfig: {
        mocha: {
            timeout: 30000,
        },
        solidity: '0.8.9',
        paths: {
            tests: '.',
            sources: '.',
        },
    },
};
