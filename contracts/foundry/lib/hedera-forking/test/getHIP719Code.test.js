// SPDX-License-Identifier: Apache-2.0

const { expect } = require('chai');
const { getHIP719Code } = require('@hashgraph/system-contracts-forking');

describe('::getHIP719Code', function () {
    ['', '1234', '0x', '0x1234'].forEach(address => {
        it(`should throw when address is invalid \`${address}\``, function () {
            expect(() => getHIP719Code(address)).to.throw('Address must be a valid EVM address');
        });
    });

    ['0x', '0X'].forEach(prefix => {
        it(`should return bytecode containing address with prefix \`${prefix}\``, function () {
            const address = 'f39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
            expect(getHIP719Code(`${prefix}${address}`)).to.contain(address);
        });
    });
});
