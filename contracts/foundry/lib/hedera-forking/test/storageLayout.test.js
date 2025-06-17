// SPDX-License-Identifier: Apache-2.0

const { expect } = require('chai');

const {
    storageLayout: { storage, types },
} = require('../out/HtsSystemContract.sol/HtsSystemContract.json');

describe('::storageLayout', function () {
    describe('storage', function () {
        it('should have one slot per field (sanity check to ensure slots are unique and not shared between fields)', function () {
            const set = new Set(storage.map(slot => Number(slot.slot)));
            expect(set.size).to.be.equal(storage.length);
        });

        describe('slots', function () {
            storage.forEach(({ label, offset, slot, type }) => {
                it(`should have slot \`${label}(${slot}): ${type}\` at \`offset\` \`0\` (to avoid packing, thus avoiding making many requests per slot)`, function () {
                    expect(offset, label).to.be.equal(0);
                });
            });
        });
    });

    describe('types', function () {
        it('should contain only supported encodings, i.e., no `mapping`', function () {
            const encodings = new Set(Object.values(types).map(({ encoding }) => encoding));
            expect([...encodings]).to.be.have.members(['inplace', 'bytes', 'dynamic_array']);
        });
    });
});
