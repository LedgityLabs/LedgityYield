// SPDX-License-Identifier: Apache-2.0

const { strict: assert } = require('assert');
const { expect } = require('chai');

const { slotMapOf, packValues, setLedgerId } = require('../src/slotmap');
const { toIntHex256 } = require('../src/utils');

const mirrorNode =
    /** @type{Pick<import('@hashgraph/system-contracts-forking').IMirrorNodeClient, 'getAccount'>} */ ({
        getAccount: async address => ({ account: '', evm_address: address?.replace('0.0.', '') }),
    });

describe('::slotmap', function () {
    describe('slotMapOf', function () {
        ['MFCT', 'USDC'].forEach(symbol => {
            describe(symbol, function () {
                it(`should have valid slot fields`, async function () {
                    const map = slotMapOf(require(`../test/data/${symbol}/getToken.json`));

                    [...map._map.entries()].forEach(([slot, values]) => {
                        expect(slot).to.be.not.undefined;
                        expect(values).to.be.not.undefined;
                        expect(values.length).to.be.greaterThan(0);

                        values.forEach(async ({ value }) => {
                            if (typeof value === 'function') {
                                value = await value(mirrorNode, 0);
                            }
                            expect(values).to.be.a('string');
                            expect(value).to.be.have.length(64);
                            expect(() => BigInt(`0x${value}`)).to.not.throw(SyntaxError);
                        });
                    });
                });
            });
        });
    });

    describe('packValues', function () {
        it('should not accept empty values', function () {
            expect(() => packValues([])).to.throw('values must not be empty');
        });

        [
            {
                values: [{ offset: 0, value: '1234' }],
                result: 0x1234n,
            },
            {
                values: [
                    { offset: 0, value: '12' },
                    { offset: 1, value: '34' },
                    { offset: 2, value: '45' },
                ],
                result: 0x45_34_12n,
            },
            {
                values: [
                    { offset: 0, value: '1234567890abcdef' },
                    { offset: 8, value: '01' },
                    { offset: 9, value: '12345678' },
                ],
                result: 0x12345678_01_1234567890abcdefn,
            },
        ].forEach(({ values, result }) => {
            it(`should pack ${JSON.stringify(values)} into 0x${result.toString(16)}`, function () {
                expect(packValues(values)).to.be.equal(toIntHex256(result));
            });
        });
    });

    describe('setLedgerId', function () {
        const getLedgerId = () => {
            const map = slotMapOf(require(`../test/data/USDC/getToken.json`));
            const [[{ offset, value }]] = [...map._map.values()].filter(
                a => a.length === 1 && a[0].path.endsWith('.ledgerId')
            );
            assert(offset === 0);
            assert(typeof value === 'string');
            return Buffer.from(value.slice(0, -2), 'hex').toString().replaceAll('\u0000', '');
        };

        it('should return default ledgerId when no ledgedId has been set', function () {
            expect(getLedgerId()).to.be.equal('0x00');
        });

        [
            { chainId: undefined, ledgerId: '0x00' },
            { chainId: 1, ledgerId: '0x00' },
            { chainId: 295, ledgerId: '0x00' },
            { chainId: 296, ledgerId: '0x01' },
            { chainId: 297, ledgerId: '0x02' },
            { chainId: 298, ledgerId: '0x03' },
        ].forEach(({ chainId, ledgerId }) => {
            it(`should set ledgerId=${ledgerId} when chainId is ${chainId}`, function () {
                setLedgerId(chainId);
                expect(getLedgerId()).to.be.equal(ledgerId);
            });
        });
    });
});
