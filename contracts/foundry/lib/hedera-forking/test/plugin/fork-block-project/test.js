// SPDX-License-Identifier: Apache-2.0

const { strict: assert } = require('assert');
const { expect } = require('chai');
require('@nomicfoundation/hardhat-chai-matchers');
const hre = require('hardhat');

const IERC20 = require('../../../out/IERC20.sol/IERC20.json');

describe('fork-block-project', function () {
    /**
     * https://hashscan.io/mainnet/token/0.0.1456986
     * https://mainnet.mirrornode.hedera.com/api/v1/tokens/0.0.1456986
     */
    const whbarAddress = '0x0000000000000000000000000000000000163b5a';

    /**
     * https://hashscan.io/mainnet/token/0.0.456858
     * https://mainnet.mirrornode.hedera.com/api/v1/tokens/0.0.456858
     */
    const usdcAddress = '0x000000000000000000000000000000000006f89a';

    it('should not fetch token data in a block where token is not yet created', async function () {
        const [account] = await hre.ethers.getSigners();

        const ft = await hre.ethers.getContractAt(IERC20.abi, whbarAddress);
        await expect(ft['name']()).to.be.rejectedWith('could not decode result data');
        await expect(ft['balanceOf'](account.address)).to.be.rejectedWith(
            'could not decode result data'
        );
    });

    it('should retrieve token data when forking from token creation block', async function () {
        // It is not possible to use token creation block 40804823
        // See issue https://github.com/hashgraph/hedera-forking/issues/277
        // 51400378 block number comes from https://github.com/hashgraph/hedera-forking/issues/277#issuecomment-2741910619
        resetTo(51400378);

        const ft = await hre.ethers.getContractAt(IERC20.abi, whbarAddress);
        expect(await ft['name']()).to.be.equal('Wrapped Hbar');
        expect(await ft['symbol']()).to.be.equal('WHBAR');
        expect(await ft['decimals']()).to.be.equal(8n);
    });

    it("should get account's correct balance at different forking blocks", async function () {
        const usdc = await hre.ethers.getContractAt(IERC20.abi, usdcAddress);
        const holderAddress = '0x0000000000000000000000000000000000001887';

        // Just some block number we verified the balance was changed in mainnet
        resetTo(70520505);
        expect(await usdc['balanceOf'](holderAddress)).to.be.equal(31_166_366226n);

        resetTo(70715000);
        expect(await usdc['balanceOf'](holderAddress)).to.be.equal(49_857_361652n);
    });
});

/**
 * @param {number} blockNumber
 */
async function resetTo(blockNumber) {
    const { forking } = hre.config.networks.hardhat;
    assert(forking !== undefined);

    await hre.network.provider.request({
        method: 'hardhat_reset',
        params: [
            {
                forking: {
                    // Forwards requests to `https://mainnet.hashio.io/api`
                    jsonRpcUrl: `http://127.0.0.1:${forking.workerPort}`,
                    blockNumber,
                },
            },
        ],
    });
}
