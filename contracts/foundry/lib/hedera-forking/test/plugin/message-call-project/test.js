// SPDX-License-Identifier: Apache-2.0

const hre = require('hardhat');
const { expect } = require('chai');

describe('message-call-project', function () {
    it('should get decimals through internal message call', async function () {
        const tokenAddress = '0x000000000000000000000000000000000047b52a';
        const contract = await hre.ethers.deployContract('CallToken');
        expect(await contract['getTokenDecimals'](tokenAddress)).to.be.equal(13n);
    });

    it('should create and get local token', async function () {
        const name = 'Message-Call-Project Token Name';
        const symbol = 'Message-Call-Project Token symbol';
        const decimals = 4n;
        const [treasury] = await hre.ethers.getSigners();

        const contract = await hre.ethers.deployContract('CallToken');
        const tx = await (
            await contract['createToken'](name, symbol, decimals, treasury.address, {
                value: 1_000n,
            })
        ).wait();
        const logs = tx.logs.map(
            (/** @type {{ topics: ReadonlyArray<string>; data: string; }} */ log) =>
                contract.interface.parseLog(log)
        );

        expect(logs).to.have.length(1);
        expect(logs[0].signature).to.be.equal('TokenCreated(address)');

        const tokenAddress = logs[0].args.toArray()[0];
        expect(await contract['getTokenDecimals'](tokenAddress)).to.be.equal(decimals);

        {
            const tx = await (await contract['logTokenInfo'](tokenAddress)).wait();
            const logs = tx.logs.map(
                (/** @type {{ topics: ReadonlyArray<string>; data: string; }} */ log) =>
                    contract.interface.parseLog(log)
            );

            expect(logs).to.have.length(1);
            expect(logs[0].signature).to.be.equal('GetTokenInfo(string,string,string)');
            expect(logs[0].args.toArray()).to.be.deep.equal([name, symbol, '']);
        }
    });
});
