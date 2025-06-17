// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {console} from "forge-std/console.sol";

import {Hsc} from "../../contracts/Hsc.sol";
import {HTS_ADDRESS} from "../../contracts/HtsSystemContractJson.sol";
import {MirrorNode} from "../../contracts/MirrorNode.sol";
import {MirrorNodeFFI} from "../../contracts/MirrorNodeFFI.sol";
import {MirrorNodeMock} from "./MirrorNodeMock.sol";

abstract contract TestSetup {
    /**
     * https://hashscan.io/testnet/token/0.0.429274
     * https://testnet.mirrornode.hedera.com/api/v1/tokens/0.0.429274
     */
    address internal USDC = 0x0000000000000000000000000000000000068cDa;
    address internal USDC_TREASURY = 0x0000000000000000000000000000000000001438;

    /**
     * https://hashscan.io/testnet/token/0.0.4730999
     * https://testnet.mirrornode.hedera.com/api/v1/tokens/0.0.4730999
     */
    address internal MFCT = 0x0000000000000000000000000000000000483077;
    address internal MFCT_TREASURY = 0xa3612A87022a4706FC9452C50abd2703ac4Fd7d9;

    /**
     * https://hashscan.io/testnet/token/0.0.5206169
     * https://testnet.mirrornode.hedera.com/api/v1/tokens/0.0.5206169
     */
    address internal CTCF = 0x00000000000000000000000000000000004F7099;

    /**
     * https://hashscan.io/testnet/token/0.0.5308378
     * https://testnet.mirrornode.hedera.com/api/v1/tokens/0.0.5308378
     */
    address internal CFNFTFF = 0x000000000000000000000000000000000050FfDA;
    address internal CFNFTFF_TREASURY = 0x435d7D41D4f69F958bda7A8D9f549a0dD9B64c86;
    address internal CFNFTFF_ALLOWED_SPENDER = 0x000000000000000000000000000000000043F832;

    /**
     * 3 test modes.
     */
    enum TestMode {
        /**
         * No forking configuration was given for testing.
         * - Code is deployed locally.
         * - Data is mocked and provided locally.
         */
        NonFork,

        /**
         * HTS/FFI using Mirror Node requests as backend.
         * To enable this mode, Foundry must be set to fork from a Hedera remote network.
         * - Code using FFI is deployed locally.
         * - Data comes from `curl` requests, which can be mocked or a Hedera remote network.
         */
        FFI,

        /**
         * HTS bytecode comes from the Hedera remote network.
         * This is usually through the Hardhat plugin,
         * but also can be through `json-rpc-mock`.
         * - Code comes from remote network.
         * - Data comes from JSON-RPC `eth_getStorageAt` calls.
         */
        JSON_RPC
    }

    TestMode internal testMode;
    MirrorNode internal mirrorNode;

    function setUpMockStorageForNonFork() internal {
        if (HTS_ADDRESS.code.length == 0) {
            console.log("HTS code length is 0, non-fork test, code and data provided locally");
            MirrorNodeMock mirrorNodeMock = new MirrorNodeMock();
            mirrorNodeMock.deployHIP719Proxy(USDC, "USDC");
            mirrorNodeMock.deployHIP719Proxy(MFCT, "MFCT");
            mirrorNodeMock.deployHIP719Proxy(CTCF, "CTCF");
            mirrorNodeMock.deployHIP719Proxy(CFNFTFF, "CFNFTFF");
            mirrorNode = mirrorNodeMock;
            Hsc.htsSetup(mirrorNode);
            testMode = TestMode.NonFork;
        } else if (HTS_ADDRESS.code.length == 1) {
            console.log("HTS code length is 1, forking from a remote Hedera network, HTS/FFI code with Mirror Node backend is deployed here");
            mirrorNode = new MirrorNodeFFI();
            Hsc.htsSetup(mirrorNode);
            testMode = TestMode.FFI;
        } else {
            console.log("HTS code length is greater than 1 (%d), HTS code comes from forked network", HTS_ADDRESS.code.length);
            testMode = TestMode.JSON_RPC;
        }
    }
}
