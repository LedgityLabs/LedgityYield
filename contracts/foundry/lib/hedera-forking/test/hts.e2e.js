// SPDX-License-Identifier: Apache-2.0

const { strict: assert } = require('assert');
const { expect } = require('chai');
const { Contract, JsonRpcProvider, Wallet } = require('ethers');
const c = require('ansi-colors');

// @ts-expect-error https://github.com/hashgraph/hedera-sdk-js/issues/2722
const { Hbar, Client, PrivateKey, TokenCreateTransaction } = require('@hashgraph/sdk');
const { HTSAddress, getHIP719Code } = require('@hashgraph/system-contracts-forking');

const { jsonRPCForwarder } = require('@hashgraph/system-contracts-forking/forwarder');
const { anvil } = require('./.anvil.js');

const IHederaTokenService = require('../out/IHederaTokenService.sol/IHederaTokenService.json');
const IERC20 = require('../out/IERC20.sol/IERC20.json');
const IHRC719 = require('../out/IHRC719.sol/IHRC719.json');

const RedirectAbi = [
    'function redirectForToken(address token, bytes memory encodedFunctionSelector) external returns (int64 responseCode, bytes memory response)',
];

/**
 * Wrapper around `Contract::connect` to reify its return type.
 *
 * @param {import('ethers').Contract} contract
 * @param {import('ethers').ContractRunner} signer
 * @returns {import('ethers').Contract}
 */
function sendAs(contract, signer) {
    return /**@type{import('ethers').Contract}*/ (contract.connect(signer));
}

/**
 * @param {Promise<import('ethers').ContractTransactionResponse>} promise
 * @returns {Promise<void>}
 */
async function waitForTx(promise) {
    const tx = await promise;
    await tx.wait();
    // console.log(tx)
}

const OPTS = {
    gasLimit: 500_000,
};

/**
 * @param {string} accountId
 * @returns
 */
const toAddress = accountId =>
    '0x' + parseInt(accountId.replace('0.0.', '')).toString(16).padStart(40, '0');

const ft = {
    name: 'Random FT Token',
    symbol: 'RFT',
    totalSupply: 5_000_000,
    decimals: 3,
    treasury: {
        id: '0.0.1021',
        evmAddress: '0x17b2b8c63fa35402088640e426c6709a254c7ffb',
        privateKey: '0xeae4e00ece872dd14fb6dc7a04f390563c7d69d16326f2a703ec8e0934060cc7',
    },
};

const aliasKeys = /**@type{const}*/ ([
    [1012, '0x105d050185ccb907fba04dd92d8de9e32c18305e097ab41dadda21489a211524'],
    [1013, '0x2e1d968b041d84dd120a5860cee60cd83f9374ef527ca86996317ada3d0d03e7'],
    [1014, '0x45a5a7108a18dd5013cf2d5857a28144beadc9c70b3bdbd914e38df4e804b8d8'],
    [1015, '0x6e9d61a325be3f6675cf8b7676c70e4a004d2308e3e182370a41f5653d52c6bd'],
    [1016, '0x0b58b1bd44469ac9f813b5aeaf6213ddaea26720f0b2f133d08b6f234130a64f'],
    [1017, '0x95eac372e0f0df3b43740fa780e62458b2d2cc32d6a440877f1cc2a9ad0c35cc'],
    [1018, '0x6c6e6727b40c8d4b616ab0d26af357af09337299f09c66704146e14236972106'],
    [1019, '0x5072e7aa1b03f531b4731a32a021f6a5d20d5ddc4e55acbb71ae202fc6f3a26d'],
    [1020, '0x60fe891f13824a2c1da20fb6a14e28fa353421191069ba6b6d09dd6c29b90eff'],
    [1021, '0xeae4e00ece872dd14fb6dc7a04f390563c7d69d16326f2a703ec8e0934060cc7'],
]);

/**
 *
 * @param {*} options
 * @returns
 */
async function createToken({ noSupplyKey } = {}) {
    // https://github.com/hashgraph/hedera-local-node?tab=readme-ov-file#network-variables
    const accountId = '0.0.2';
    const privateKey =
        '302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137';

    const client = Client.forNetwork({ '127.0.0.1:50211': '0.0.3' })
        .setOperator(accountId, PrivateKey.fromStringDer(privateKey))
        .setDefaultMaxTransactionFee(new Hbar(100))
        .setDefaultMaxQueryPayment(new Hbar(50));
    let transaction = new TokenCreateTransaction()
        .setTokenName(ft.name)
        .setTokenSymbol(ft.symbol)
        .setTreasuryAccountId(ft.treasury.id)
        .setInitialSupply(ft.totalSupply)
        .setDecimals(ft.decimals)
        .setAdminKey(PrivateKey.fromStringDer(privateKey));
    if (!noSupplyKey) {
        transaction = transaction.setSupplyKey(PrivateKey.fromStringECDSA(ft.treasury.privateKey));
    }

    transaction = await transaction
        .freezeWith(client)
        .sign(PrivateKey.fromStringECDSA(ft.treasury.privateKey));
    const receipt = await (await transaction.execute(client)).getReceipt(client);
    const tokenId = receipt.tokenId;
    client.close();

    assert(tokenId !== null);
    return tokenId.toString();
}

/**
 * @param {number} time
 * @param {string} why
 * @returns
 */
function sleep(time, why) {
    console.info(c.dim(why), `(${time} ms)`);
    return new Promise(resolve => setTimeout(resolve, time));
}

describe('::e2e', function () {
    this.timeout(60000);

    const jsonRpcRelayUrl = 'http://localhost:7546';
    const mirrorNodeUrl = 'http://localhost:5551/api/v1/';

    /** @type {string} */
    let anvilHost;

    before(async function () {
        process.env['DEBUG_DISABLE_BALANCE_BLOCKNUMBER'] = '1';

        for (const suite of suites) {
            suite.tokenId = await suite.create();
            suite.tokenAddress = toAddress(suite.tokenId);
            console.info(`Token "${suite.title}" ${suite.tokenId} @ ${suite.tokenAddress} created`);
        }

        await sleep(2000, `Waiting for tokens to propagate to Mirror Node`);

        for (const { title, tokenId } of suites) {
            const token = await (await fetch(`${mirrorNodeUrl}tokens/${tokenId}`)).json();
            expect('_status' in token, `Token "${title}" \`${tokenId}\` not found`).to.be.false;
        }

        const { host: forwarderUrl } = await jsonRPCForwarder(jsonRpcRelayUrl, mirrorNodeUrl, 298);
        anvilHost = await anvil(forwarderUrl);

        // Ensure HTS emulation is reachable
        const provider = new JsonRpcProvider(anvilHost, undefined, { batchMaxCount: 1 });
        expect(await provider.getCode(HTSAddress)).to.have.length.greaterThan(4);
        for (const { tokenAddress } of suites)
            expect(await provider.getCode(tokenAddress)).to.be.equal(getHIP719Code(tokenAddress));
    });

    /** @type {string} */ let tokenAddress;
    /** @type {Contract} */ let HTS;
    /** @type {Contract} */ let ERC20;
    /** @type {Wallet} */ let treasury;
    /** @type {{ [accountNum: number]: Wallet}} */ let wallets;

    const suites = [
        {
            title: 'with Fungible Token',
            create: () => createToken(),
            tokenInfo: undefined,
            tests() {
                const nonAssocAddress0 = '0x0000000000000000000000000000000001234567';
                const nonAssocAddress1 = '0xdadB0d80178819F2319190D340ce9A924f783711';
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const self = this;

                it("should retrieve token's `name`, `symbol` and `totalSupply`", async function () {
                    expect(await ERC20['name']()).to.be.equal(ft.name);
                    expect(await ERC20['symbol']()).to.be.equal(ft.symbol);
                    expect(await ERC20['totalSupply']()).to.be.equal(BigInt(ft.totalSupply));
                    expect(await ERC20['decimals']()).to.be.equal(BigInt(ft.decimals));
                });

                it('should retrieve `balanceOf` treasury account', async function () {
                    const value = await ERC20['balanceOf'](ft.treasury.evmAddress);
                    expect(value).to.be.equal(BigInt(ft.totalSupply));
                });

                it('should retrieve zero `balanceOf` for non-associated accounts', async function () {
                    expect(await ERC20['balanceOf'](nonAssocAddress0)).to.be.equal(0n);
                    expect(await ERC20['balanceOf'](nonAssocAddress1)).to.be.equal(0n);
                });

                it('should get it `isAssociated` for treasury account', async function () {
                    const value = await ERC20['isAssociated']({ from: ft.treasury.evmAddress });
                    expect(value).to.be.equal(true);
                });

                it('should get not `isAssociated` for existing non-associated account', async function () {
                    expect(
                        await ERC20['isAssociated']({ from: toAddress('0.0.1002') })
                    ).to.be.equal(false);
                    expect(
                        await ERC20['isAssociated']({ from: wallets[1012].address })
                    ).to.be.equal(false);
                });

                // These reverts instead of returning `false`.
                // Should we have the same behavior in emulated HTS?
                it('should get not `isAssociated` for non-existing non-associated accounts', async function () {
                    await assert.rejects(
                        () => ERC20['isAssociated']({ from: nonAssocAddress0 }),
                        Error
                    );
                    await assert.rejects(
                        () => ERC20['isAssociated']({ from: nonAssocAddress1 }),
                        Error
                    );
                });

                // To enable this, we need to change `getTokenInfo` to a `view` function
                it("should retrieve token's metadata through `getTokenInfo`", async function () {
                    const tokenInfo = await HTS['getTokenInfo'](tokenAddress);
                    if (self.tokenInfo === undefined) {
                        self.tokenInfo = tokenInfo;
                    } else {
                        expect(self.tokenInfo).to.be.deep.equal(tokenInfo);
                    }
                });

                it('should transfer from treasury to account and leave total supply untouched', async function () {
                    const amount = 200_000n;
                    const alice = wallets[1012];

                    const preTreasuryBalance = await ERC20['balanceOf'](ft.treasury.evmAddress);
                    expect(preTreasuryBalance).to.be.equal(BigInt(ft.totalSupply));
                    expect(await ERC20['balanceOf'](alice.address)).to.be.equal(0n);
                    const preTotalSupply = await ERC20['totalSupply']();

                    await waitForTx(
                        sendAs(ERC20, treasury)['transfer'](alice.address, amount, OPTS)
                    );

                    const postTreasuryBalance = await ERC20['balanceOf'](ft.treasury.evmAddress);
                    expect(postTreasuryBalance).to.be.equal(preTreasuryBalance - amount);
                    expect(await ERC20['balanceOf'](alice.address)).to.be.equal(amount);
                    const postTotalSupply = await ERC20['totalSupply']();
                    expect(postTotalSupply).to.be.equal(preTotalSupply);
                });

                it('should mint to treasury account and increase total supply', async function () {
                    const preTreasuryBalance = await ERC20['balanceOf'](ft.treasury.evmAddress);
                    const preTotalSupply = await ERC20['totalSupply']();

                    const amount = 1_000_000n;
                    await waitForTx(
                        sendAs(HTS, treasury)['mintToken'](tokenAddress, amount, [], OPTS)
                    );

                    const postTreasuryBalance = await ERC20['balanceOf'](ft.treasury.evmAddress);
                    expect(postTreasuryBalance).to.be.equal(preTreasuryBalance + amount);
                    const postTotalSupply = await ERC20['totalSupply']();
                    expect(postTotalSupply).to.be.equal(preTotalSupply + amount);
                });

                it('should burn from treasury account and decrease total supply', async function () {
                    const preTreasuryBalance = await ERC20['balanceOf'](ft.treasury.evmAddress);
                    const preTotalSupply = await ERC20['totalSupply']();

                    const amount = 500_000n;
                    await waitForTx(
                        sendAs(HTS, treasury)['burnToken'](tokenAddress, amount, [], OPTS)
                    );

                    const postTreasuryBalance = await ERC20['balanceOf'](ft.treasury.evmAddress);
                    expect(postTreasuryBalance).to.be.equal(preTreasuryBalance - amount);
                    const postTotalSupply = await ERC20['totalSupply']();
                    expect(postTotalSupply).to.be.equal(preTotalSupply - amount);
                });
            },
        },

        {
            title: 'with Fungible Token with no supply key',
            create: () => createToken({ noSupplyKey: true }),
            tests: () => {
                it('should not mint because there is no supply key', async function () {
                    const preTreasuryBalance = await ERC20['balanceOf'](ft.treasury.evmAddress);
                    const preTotalSupply = await ERC20['totalSupply']();

                    const amount = 1_000_000n;
                    await waitForTx(
                        sendAs(HTS, treasury)['mintToken'](tokenAddress, amount, [], OPTS)
                    );

                    const postTreasuryBalance = await ERC20['balanceOf'](ft.treasury.evmAddress);
                    expect(postTreasuryBalance).to.be.equal(preTreasuryBalance);
                    const postTotalSupply = await ERC20['totalSupply']();
                    expect(postTotalSupply).to.be.equal(preTotalSupply);
                });
            },
        },
    ].map(suite => ({ ...suite, tokenId: '', tokenAddress: '' }));

    suites.forEach(suite =>
        describe(suite.title, function () {
            [
                /**@type{const}*/ (['anvil/local-node', () => anvilHost]),
                /**@type{const}*/ (['local-node', () => jsonRpcRelayUrl]),
            ].forEach(([network, host]) => {
                describe(network, function () {
                    before(async function () {
                        tokenAddress = suite.tokenAddress;
                        const rpc = new JsonRpcProvider(host(), undefined, { batchMaxCount: 1 });
                        HTS = new Contract(
                            HTSAddress,
                            [...IHederaTokenService.abi, ...RedirectAbi],
                            rpc
                        );
                        treasury = new Wallet(ft.treasury.privateKey, rpc);
                        wallets = Object.fromEntries(
                            aliasKeys.map(([accId, pk]) => [accId, new Wallet(pk, rpc)])
                        );
                        ERC20 = new Contract(tokenAddress, [...IERC20.abi, ...IHRC719.abi], rpc);
                    });

                    suite.tests();
                });
            });
        })
    );
});
