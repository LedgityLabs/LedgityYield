// SPDX-License-Identifier: Apache-2.0

const hre = require('hardhat');
const { expect } = require('chai');

describe('non-hedera-project', function () {
    it('should leave `forking` config untouched', async function () {
        expect(hre.config.networks.hardhat.forking).to.be.undefined;
    });

    it('should not activate JSON-RPC Forwarder', async function () {
        expect(hre.jsonRPCForwarder).to.be.undefined;
    });

    it('should load Hedera hardfork history even on non-Hedera projects', async function () {
        const { chains } = /** @type{import('hardhat/types').HardhatNetworkConfig} */ (
            hre.network.config
        );
        expect(chains.get(295)).to.be.deep.equal({
            hardforkHistory: new Map().set('shanghai', 0),
        });
        expect(chains.get(296)).to.be.deep.equal({
            hardforkHistory: new Map().set('shanghai', 0),
        });
        expect(chains.get(297)).to.be.deep.equal({
            hardforkHistory: new Map().set('shanghai', 0),
        });
    });
});
