// SPDX-License-Identifier: Apache-2.0

const { expect } = require('chai');
const { ethers, network } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');

/**
 * Wrapper around `Contract::connect` to reify its return type.
 *
 * @param {import('ethers').Contract} contract
 * @param {import('@nomicfoundation/hardhat-ethers/signers').HardhatEthersSigner} signer
 * @returns {import('ethers').Contract}
 */
const connectAs = (contract, signer) =>
    /**@type{import('ethers').Contract}*/ (contract.connect(signer));

describe('NFT example', function () {
    /**
     * `signers[0]` is used in test `nft-transfer.test`
     * Signers need to be different because otherwise the state is shared between test suites.
     * This is because to use the same fixture, the `id` function needs to be shared among them.
     *
     * See https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures for more details.
     */
    async function id() {
        const [, receiver, spender] = await ethers.getSigners();
        return { receiver, spender };
    }

    /**
     * https://hashscan.io/mainnet/token/0.0.5083205
     * https://mainnet.mirrornode.hedera.com/api/v1/tokens/0.0.5083205
     */
    const nftAddress = '0x00000000000000000000000000000000004d9045';

    /** @type {import('ethers').Contract} */
    let nft;

    /**
     * @type {import('@nomicfoundation/hardhat-ethers/signers').HardhatEthersSigner}
     */
    let holder;

    beforeEach(async function () {
        nft = await ethers.getContractAt('IERC721', nftAddress);
        const holderAddress = await nft['ownerOf'](1n);
        // https://hardhat.org/hardhat-network/docs/reference#hardhat_impersonateaccount
        await network.provider.request({
            method: 'hardhat_impersonateAccount',
            params: [holderAddress],
        });
        holder = await ethers.getSigner(holderAddress);
    });

    it('should get name, symbol and tokenURI', async function () {
        const name = await nft['name']();
        const symbol = await nft['symbol']();
        const tokenURI = await nft['tokenURI'](1n);

        expect(name).to.be.equal('THE BARKANEERS');
        expect(symbol).to.be.equal('BARKANEERS');
        expect(tokenURI).to.be.equal(
            'ipfs://bafkreif4hpsgflzzvd7c4abx5u5xwrrjl7wkimbjtndvkxodklxdam5upm'
        );
    });

    it('should get Token name through a contract call', async function () {
        const CallToken = await ethers.getContractFactory('CallNFT');
        const callToken = await CallToken.deploy();

        expect(await callToken['getTokenName'](nftAddress)).to.be.equal('THE BARKANEERS');
    });

    it('should get `ownerOf` account holder', async function () {
        const owner = await nft['ownerOf'](1n);
        expect(owner).to.be.equal(holder.address);
    });

    it("should `transferFrom` tokens from account holder after `approve`d one of Hardhat' signers", async function () {
        const { receiver, spender } = await loadFixture(id);
        const serialId = 1n;
        expect(await nft['ownerOf'](serialId)).to.be.equal(holder.address);
        await connectAs(nft, holder)['approve'](spender, serialId);
        expect(await nft['getApproved'](serialId)).to.be.equal(spender.address);
        await connectAs(nft, spender)['transferFrom'](holder, receiver, serialId);
        expect(await nft['getApproved'](serialId)).to.be.equal(
            '0x0000000000000000000000000000000000000000'
        );
        expect(await nft['ownerOf'](serialId)).to.be.equal(receiver);
    });

    it("should indirectly `transferFrom` tokens from account holder after `approve`d one of Hardhat' signers", async function () {
        const { receiver, spender } = await loadFixture(id);
        const serialId = 1n;
        const ownerAddress = await nft['ownerOf'](serialId);
        await network.provider.request({
            method: 'hardhat_impersonateAccount',
            params: [ownerAddress],
        });
        const owner = await ethers.getSigner(ownerAddress);
        expect(await nft['ownerOf'](serialId)).to.be.equal(owner.address);

        const CallToken = await ethers.getContractFactory('CallNFT');
        const callToken = await CallToken.deploy();
        const callTokenAddress = await callToken.getAddress();

        await connectAs(nft, owner)['approve'](callTokenAddress, serialId);
        await connectAs(callToken, spender)['invokeTransferFrom'](nftAddress, receiver, serialId);
        expect(await nft['getApproved'](serialId)).to.not.be.equal(spender.address);
        expect(await nft['ownerOf'](serialId)).to.be.equal(holder);
    });
});
