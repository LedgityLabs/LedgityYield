// SPDX-License-Identifier: Apache-2.0

const { strict: assert } = require('assert');
const { expect } = require('chai');
const { getHIP719Code } = require('@hashgraph/system-contracts-forking');
const sinon = require('sinon');
const { JsonRpcProvider } = require('ethers');
const hre = require('hardhat');

const IERC20 = require('../../../out/IERC20.sol/IERC20.json');

describe('hedera-fork-project', function () {
    const tokenAddress = '0x000000000000000000000000000000000047b52a';
    const accountAddress = '0x292c4acf9ec49af888d4051eb4a4dc53694d1380';
    const spenderAddress = '0x000000000000000000000000000000000043f832';

    /** @type {import('sinon').SinonStub} */
    let fetchStub;

    /** @type {import('ethers').Contract} */
    let ft;

    before(async function () {
        await hre.network.provider.send('hardhat_setCode', [
            tokenAddress,
            getHIP719Code(tokenAddress),
        ]);
        ft = await hre.ethers.getContractAt(IERC20.abi, tokenAddress);
        fetchStub = sinon.stub(global, 'fetch');
        for (const { endpoint, response } of require('./mirrorNodeResponses.json')) {
            fetchStub
                .withArgs(`https://testnet.mirrornode.hedera.com/api/v1/${endpoint}`)
                .resolves(new Response(response));
        }
    });

    after(function () {
        fetchStub.restore();
    });

    it('should have loaded the JSON-RPC Forwarder', async function () {
        const forking = hre.userConfig.networks?.hardhat?.forking;

        assert(forking !== undefined);
        assert('workerPort' in forking);
        assert('chainId' in forking);
        assert(typeof forking.chainId === 'number');

        const provider = new JsonRpcProvider(`http://127.0.0.1:${forking.workerPort}`);
        const network = await provider.getNetwork();

        expect(network.chainId).to.be.equal(BigInt(forking.chainId));
    });

    it('show decimals', async function () {
        expect(await ft['decimals']()).to.be.equal(13n);
    });

    it('get name', async function () {
        expect(await ft['name']()).to.be.equal(
            'Very long string, just to make sure that it exceeds 31 bytes and requires more than 1 storage slot.'
        );
    });

    it('get symbol', async function () {
        expect(await ft['symbol']()).to.be.equal('SHRT');
    });

    it('get balance', async function () {
        expect(await ft['balanceOf'](accountAddress)).to.be.equal(9995n);
    });

    it('get allowance', async function () {
        expect(await ft['allowance'](accountAddress, spenderAddress)).to.be.equal(0n);
    });

    it('should get correct value when non-HTS address is called', async function () {
        const contract = await hre.ethers.deployContract('One');
        const result = await contract['getOne']();
        expect(result).to.be.equal(1n);
    });
});
