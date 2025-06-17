// SPDX-License-Identifier: Apache-2.0

require('@nomicfoundation/hardhat-ethers');
const { projectTestConfig } = require('../.testConfig');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    ...projectTestConfig,
    solidity: {
        version: '0.8.24',
        settings: {
            // Override compiler version to compile `Cancun.sol`
            // https://github.com/NomicFoundation/hardhat/issues/4851#issuecomment-1986148049
            //
            // From https://github.com/NomicFoundation/hardhat/issues/4232
            //
            // > Solc defaults the `evmVersion` parameter to shanghai since version 0.8.20.
            // > The main issue caused by this is that the compiler emits PUSH0 as an opcode.
            // > This opcode is supported on Ethereum L1 but as far as I know it hasn't been adopted on any other chain so far (except perhaps Gnosis Chain?).
            // > Most notably, it hasn't been adopted by L2s.
            // > On all these other chains, the PUSH0 opcode will be seen as an invalid opcode and cause the code to revert.
            // > [...]
            // > I suggest to set the default evmVersion to paris if the compiler version is >=0.8.20 and the user hasn't configured it themselves.
            evmVersion: 'cancun',
        },
    },
    networks: {
        hardhat: {
            // Custom `hardforkHistory` config to test is not overwritten by the plugin.
            chains: {
                296: {
                    hardforkHistory: {
                        'london': 1,
                    },
                },
            },
        },
    },
};
