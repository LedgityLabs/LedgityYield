// SPDX-License-Identifier: Apache-2.0

declare module 'hardhat/types/config' {
    interface HardhatNetworkForkingConfig {
        /**
         * The Hedera network chain ID to use when forking is enabled.
         */
        chainId?: number;

        /**
         * The Mirror Node URL used to fetch Hedera entity data determined by `chainId`.
         */
        mirrorNodeUrl?: string;

        /**
         * A TCP port where the JSON-RPC Forwarder will listen if Hedera forking is enabled.
         * If not provided, a default value will be used.
         */
        workerPort?: number;

        /**
         * List of [initial addresses](https://hardhat.org/hardhat-network/docs/reference#initial-state) used by Hardhat Network when forking.
         *
         * The JSON-RPC Forwarder will **not** forward
         * `eth_getCode` and `eth_getBalance` method calls for these addresses.
         * They **should not** have any associated code nor balance in the remote network.
         * It is intended as a way to make fewer requests to the remote JSON-RPC Relay.
         */
        localAddresses?: string[];
    }
}

declare module 'hardhat/types/runtime' {
    interface HardhatRuntimeEnvironment {
        jsonRPCForwarder?: Promise<import('worker_threads').Worker & { host: string }>;
    }
}

// Signals to TypeScript this file is a module and not a script.
// This suppresses missing type error when requiring this module.
export {};
