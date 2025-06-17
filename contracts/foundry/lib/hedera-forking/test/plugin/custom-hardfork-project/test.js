// SPDX-License-Identifier: Apache-2.0

const hre = require('hardhat');
const { expect } = require('chai');

describe('custom-hardfork-project', function () {
    it("should not override user's hardfork customization", async function () {
        const { chains } = /** @type{import('hardhat/types').HardhatNetworkConfig} */ (
            hre.network.config
        );
        expect(chains.get(295)).to.be.deep.equal({
            hardforkHistory: new Map().set('shanghai', 0),
        });
        expect(chains.get(296)).to.be.deep.equal({
            hardforkHistory: new Map().set('london', 1),
        });
        expect(chains.get(297)).to.be.deep.equal({
            hardforkHistory: new Map().set('shanghai', 0),
        });
    });

    it('should get correct value when Cancun opcode is invoked', async function () {
        const contract = await hre.ethers.deployContract('Cancun');
        const result = await contract['getBlobBaseFee']();
        expect(result).to.be.equal(1n);
    });
});
