// SPDX-License-Identifier: Apache-2.0

const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Create Token example', function () {
    it('should create and get local token', async function () {
        const name = 'Fungible Token';
        const symbol = 'FT';
        const decimals = 4n;
        const [treasury] = await ethers.getSigners();

        const contract = await ethers.deployContract('CallToken');
        const tx = await (
            await contract['createToken'](name, symbol, decimals, treasury.address, {
                value: 1_000n,
            })
        ).wait();
        const logs = tx.logs.map(log => contract.interface.parseLog(log));

        expect(logs).to.have.length(1);
        expect(logs[0].signature).to.be.equal('TokenCreated(address)');

        const tokenAddress = logs[0].args.toArray()[0];
        {
            const tx = await (await contract['getTokenInfo'](tokenAddress)).wait();
            const logs = tx.logs.map(log => contract.interface.parseLog(log));

            expect(logs).to.have.length(1);
            expect(logs[0].signature).to.be.equal('GetTokenInfo(string,string,string)');
            expect(logs[0].args.toArray()).to.be.deep.equal([name, symbol, '']);
        }
    });
});
