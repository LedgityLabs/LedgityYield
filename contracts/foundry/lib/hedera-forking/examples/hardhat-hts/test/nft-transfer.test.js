// SPDX-License-Identifier: Apache-2.0

const { expect } = require('chai');
// prettier-ignore
const { ethers: { getSigner, getSigners, getContractAt }, network: { provider } } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');

describe('NFT example -- transferFrom', function () {
    async function id() {
        return [(await getSigners())[0]];
    }

    it("should `transferFrom` tokens from account holder to one of Hardhat' signers", async function () {
        const [receiver] = await loadFixture(id);

        // https://hashscan.io/mainnet/token/0.0.4970613
        const nft = await getContractAt('IERC721', '0x00000000000000000000000000000000004bd875');

        const holderAddress = await nft['ownerOf'](1n);

        await provider.request({
            method: 'hardhat_impersonateAccount',
            params: [holderAddress],
        });

        const holder = await getSigner(holderAddress);
        await nft.connect(holder)['transferFrom'](holder, receiver, 1n);

        expect(await nft['ownerOf'](1n)).to.be.equal(receiver.address);
    });
});
