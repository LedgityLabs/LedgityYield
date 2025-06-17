// SPDX-License-Identifier: Apache-2.0

const { expect } = require('chai');
const { resetHardhatContext } = require('hardhat/plugins-testing');
const path = require('path');

describe('::plugin', function () {
    this.timeout(30000);

    [
        'custom-hardfork-project',
        'fork-block-project',
        'hedera-fork-project',
        'hedera-mainnet-project',
        'message-call-project',
        'non-hedera-project',
    ].forEach(project => {
        describe(`entering project \`${project}\`...`, function () {
            /**@type {import('hardhat/types').HardhatRuntimeEnvironment} */
            let hre;

            beforeEach('loading hardhat environment', function () {
                process.chdir(path.join(__dirname, project));
                hre = require('hardhat');
            });

            afterEach('resetting hardhat', async function () {
                resetHardhatContext();
                (await hre.jsonRPCForwarder)?.terminate();
            });

            it(`hardhat project test for \`${project}\``, async function () {
                const exitCode = await hre.run('test');
                expect(exitCode).to.be.equal(0, 'hardhat test failed');
            });
        });
    });
});
