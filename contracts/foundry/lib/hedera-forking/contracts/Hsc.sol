// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Vm} from 'forge-std/Vm.sol';

import {HtsSystemContractJson, HTS_ADDRESS} from './HtsSystemContractJson.sol';
import {MirrorNode} from './MirrorNode.sol';
import {MirrorNodeFFI} from './MirrorNodeFFI.sol';

/**
 * Library to deploy and setup System Contracts.
 */
library Hsc {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256('hevm cheat code')))));

    /**
     * @notice Sets up the HTS emulation contract.
     * The HTS emulation contract will be deployed at `0x167` address using `vm.etch`.
     *
     * Remember to enable [`ffi`](https://book.getfoundry.sh/cheatcodes/ffi)
     * in your Foundry project to use HTS contract in your tests.
     * You can do this by adding the following lines to your `.toml` file
     *
     * ```toml
     * [profile.default]
     * ffi = true
     * ```
     *
     * Alternatively, you can include the `--ffi` flag when running `forge`.
     *
     * This is necessary because our library uses `ffi` to fetch remote state from the Mirror Node.
     *
     * > DISCLAIMER
     * > The HTS emulation contract **SHOULD BE ONLY** used to ease development workflow when working with Hedera Tokens.
     * > The HTS emulation contract **DOES NOT** replicate Hedera Token Services fully.
     * > That is, behavior might differ when switching from local development to a real Hedera network.
     * > **Always test your contracts against a real Hedera network before launching your contracts.**
     */
    function htsSetup() internal {
        htsSetup(new MirrorNodeFFI());
    }

    function htsSetup(MirrorNode mirrorNode) internal {
        _deployCodeTo('HtsSystemContractJson.sol', HTS_ADDRESS);
        HtsSystemContractJson(HTS_ADDRESS).setMirrorNodeProvider(mirrorNode);
        vm.allowCheatcodes(HTS_ADDRESS);
    }

    /**
     * @dev Taken from `StdCheats.sol:deployCodeTo`.
     * This is to avoid inheriting from `StdCheats`, and such simplifying usage.
     */
    function _deployCodeTo(string memory what, address where) private {
        bytes memory creationCode = vm.getCode(what);
        vm.etch(where, creationCode);
        (bool success, bytes memory runtimeBytecode) = where.call('');
        require(success, '__deployCodeTo(string,address): Failed to create runtime bytecode.');
        vm.etch(where, runtimeBytecode);
    }
}
