// SPDX-License-Identifier: Apache-2.0

const { expect } = require('chai');
// prettier-ignore
const { ethers: { getSigner, getSigners, getContractAt }, network: { provider } } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');

describe('USDC example -- transfer', function () {
    async function id() {
        return [(await getSigners())[0]];
    }

    it("should `tranfer` tokens from account holder to one of Hardhat' signers", async function () {
        const [receiver] = await loadFixture(id);

        // https://hashscan.io/mainnet/account/0.0.6279
        const holderAddress = '0x0000000000000000000000000000000000001887';
        await provider.request({
            method: 'hardhat_impersonateAccount',
            params: [holderAddress],
        });
        const holder = await getSigner(holderAddress);

        // https://hashscan.io/mainnet/token/0.0.456858
        const usdc = await getContractAt('IERC20', '0x000000000000000000000000000000000006f89a');

        expect(await usdc['balanceOf'](receiver.address)).to.be.equal(0n);

        await usdc.connect(holder)['transfer'](receiver, 10_000_000n);

        expect(await usdc['balanceOf'](receiver.address)).to.be.equal(10_000_000n);
    });
});
