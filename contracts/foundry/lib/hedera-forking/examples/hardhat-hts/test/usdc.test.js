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

describe('USDC example', function () {
    /**
     * `signers[0]` is used in test `usdc-transfer.test`
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
     * https://hashscan.io/mainnet/token/0.0.456858
     * https://mainnet.mirrornode.hedera.com/api/v1/tokens/0.0.456858
     */
    const usdcAddress = '0x000000000000000000000000000000000006f89a';

    /** @type {import('ethers').Contract} */
    let usdc;

    /**
     * https://hashscan.io/mainnet/account/0.0.6279
     *
     * @type {import('@nomicfoundation/hardhat-ethers/signers').HardhatEthersSigner}
     */
    let holder;

    beforeEach(async function () {
        usdc = await ethers.getContractAt('IERC20', usdcAddress);

        const holderAddress = '0x0000000000000000000000000000000000001887';
        // https://hardhat.org/hardhat-network/docs/reference#hardhat_impersonateaccount
        await network.provider.request({
            method: 'hardhat_impersonateAccount',
            params: [holderAddress],
        });
        holder = await ethers.getSigner(holderAddress);
    });

    it('should get name, symbol and decimals', async function () {
        const name = await usdc['name']();
        const symbol = await usdc['symbol']();
        const decimals = await usdc['decimals']();
        expect(name).to.be.equal('USD Coin');
        expect(symbol).to.be.equal('USDC');
        expect(decimals).to.be.equal(6n);
    });

    it('should get Token name through a contract call', async function () {
        const CallToken = await ethers.getContractFactory('CallToken');
        const callToken = await CallToken.deploy();

        expect(await callToken['getTokenName'](usdcAddress)).to.be.equal('USD Coin');
    });

    it('should get `balanceOf` account holder', async function () {
        const balance = await usdc['balanceOf'](holder.getAddress());
        expect(balance).to.be.greaterThan(0n);
    });

    it("should `tranfer` tokens from account holder to one of Hardhat' signers", async function () {
        const { receiver } = await loadFixture(id);

        expect(await usdc['balanceOf'](receiver.address)).to.be.equal(0n);

        await connectAs(usdc, holder)['transfer'](receiver, 10_000_000n);

        expect(await usdc['balanceOf'](receiver.address)).to.be.equal(10_000_000n);
    });

    it("should `tranferFrom` tokens from account holder after `approve`d one of Hardhat' signers", async function () {
        const { receiver, spender } = await loadFixture(id);
        expect(await usdc['balanceOf'](receiver.address)).to.be.equal(0n);

        await connectAs(usdc, holder)['approve'](spender, 5_000_000n);

        expect(await usdc['allowance'](holder.address, spender.address)).to.be.equal(5_000_000n);

        await connectAs(usdc, spender)['transferFrom'](holder.address, receiver, 3_000_000n);

        expect(await usdc['allowance'](holder.address, spender.address)).to.be.equal(2_000_000n);
        expect(await usdc['balanceOf'](receiver.address)).to.be.equal(3_000_000n);
    });

    it("should indirectly `tranferFrom` tokens from account holder after `approve`d one of Hardhat' signers", async function () {
        const { receiver } = await loadFixture(id);
        expect(await usdc['balanceOf'](receiver.address)).to.be.equal(0n);

        const CallToken = await ethers.getContractFactory('CallToken');
        const callToken = await CallToken.deploy();
        const callTokenAddress = await callToken.getAddress();

        await connectAs(usdc, holder)['approve'](callTokenAddress, 3_000_000n);
        await connectAs(callToken, holder)['invokeTransferFrom'](usdcAddress, receiver, 2_000_000n);

        expect(await usdc['allowance'](holder.address, callTokenAddress)).to.be.equal(1_000_000n);
        expect(await usdc['balanceOf'](receiver.address)).to.be.equal(2_000_000n);
    });

    it('should invoke HTS directly to `getTokenInfo`', async function () {
        const { receiver } = await loadFixture(id);
        expect(await usdc['balanceOf'](receiver.address)).to.be.equal(0n);

        const CallToken = await ethers.getContractFactory('CallToken');
        const callToken = await CallToken.deploy();

        const tx = await (await callToken['getTokenInfo'](usdcAddress)).wait();
        const logs = tx.logs.map(log => callToken.interface.parseLog(log));

        expect(logs).to.have.length(1);
        expect(logs[0].signature).to.be.equal('GetTokenInfo(string,string,string)');
        expect(logs[0].args.toArray()).to.be.deep.equal(['USD Coin', 'USDC', 'USDC HBAR']);
    });
});
