// SPDX-License-Identifier: Apache-2.0

const { expect } = require('chai');
// prettier-ignore
const { ethers: { getContractAt } } = require('hardhat');

describe('NFT example -- ownerOf', function () {
    it('should get `ownerOf` account holder', async function () {
        // https://hashscan.io/mainnet/token/0.0.4970613
        const nft = await getContractAt('IERC721', '0x00000000000000000000000000000000004bd875');

        // The assertion below cannot be guaranteed, since we can only query the current owner of the NFT,
        // Note that the ownership of the NFT may change over time.
        expect(await nft['ownerOf'](1)).to.be.equal('0x0000000000000000000000000000000000161927');
    });
});
