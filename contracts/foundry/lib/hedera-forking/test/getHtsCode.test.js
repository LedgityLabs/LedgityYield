// SPDX-License-Identifier: Apache-2.0

const { expect } = require('chai');

const { getHtsCode } = require('@hashgraph/system-contracts-forking');

describe('::getHtsCode', function () {
    it('should be larger than `0xfe` (invalid instruction bytecode)', function () {
        expect(getHtsCode()).to.have.lengthOf.above(4);
    });
});
