// SPDX-License-Identifier: Apache-2.0

const { expect } = require('chai');
// prettier-ignore
const { ethers: { getContractAt } } = require('hardhat');

describe('USDC example -- balanceOf', function () {
    it('should get `balanceOf` account holder', async function () {
        // https://hashscan.io/mainnet/token/0.0.456858
        const usdc = await getContractAt('IERC20', '0x000000000000000000000000000000000006f89a');

        // https://hashscan.io/mainnet/account/0.0.6279
        const holderAddress = '0x0000000000000000000000000000000000001887';
        expect(await usdc['balanceOf'](holderAddress)).to.be.equal(31_166_366226);
    });
});
