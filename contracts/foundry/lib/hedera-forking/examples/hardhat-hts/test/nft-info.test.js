// SPDX-License-Identifier: Apache-2.0

const { expect } = require('chai');
// prettier-ignore
const { ethers: { getContractAt } } = require('hardhat');

describe('NFT example -- informational', function () {
    it('should get name and symbol', async function () {
        // https://hashscan.io/mainnet/token/0.0.4970613
        const nft = await getContractAt('IERC721', '0x00000000000000000000000000000000004bd875');
        expect(await nft['name']()).to.be.equal('Concierge Collectibles');
        expect(await nft['symbol']()).to.be.equal('Concierge Collectibles');
    });
});
