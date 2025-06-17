// SPDX-License-Identifier: Apache-2.0

require('@nomicfoundation/hardhat-ethers');
const { projectTestConfig } = require('../.testConfig');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    ...projectTestConfig,
};
