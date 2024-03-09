import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GenericERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const genericErc20Abi = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: 'decimals_', internalType: 'uint8', type: 'uint8' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'mint',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'decimals_', internalType: 'uint8', type: 'uint8' }],
    name: 'setDecimals',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GlobalBlacklist
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const globalBlacklistAbi = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'blacklist',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'globalOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'globalOwner_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'isBlacklisted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'unBlacklist',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
  },
] as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const globalBlacklistAddress = {
  195: '0xc44395eC149C6743A268A901a38e5b02dc87D10C',
  31337: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
  42161: '0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350',
  59140: '0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf',
  59144: '0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350',
  421613: '0x1549647606A71B2a79b85AEb54631b8eA2a1939a',
} as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const globalBlacklistConfig = {
  address: globalBlacklistAddress,
  abi: globalBlacklistAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GlobalOwner
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const globalOwnerAbi = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
  },
] as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const globalOwnerAddress = {
  195: '0x2547A36186eCC16C25649B9234D4937216e45978',
  31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  42161: '0xe4Af4573bFc5F04D8b84c61744de8A94059f2462',
  59140: '0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6',
  59144: '0xe4Af4573bFc5F04D8b84c61744de8A94059f2462',
  421613: '0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350',
} as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const globalOwnerConfig = {
  address: globalOwnerAddress,
  abi: globalOwnerAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GlobalPause
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const globalPauseAbi = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'globalOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'globalOwner_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
  },
] as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const globalPauseAddress = {
  195: '0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6',
  31337: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  42161: '0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB',
  59140: '0x4fB551213757619558A93a599a08524e9Dd59C67',
  59144: '0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB',
  421613: '0x06f54B7f27eEC56616b951598BaA3B84D7660AB4',
} as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const globalPauseConfig = {
  address: globalPauseAddress,
  abi: globalPauseAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ITransfersListener
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iTransfersListenerAbi = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'onLTokenTransfer',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LDYStaking
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const ldyStakingAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'highTierAccounts',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'status', internalType: 'bool', type: 'bool' },
    ],
    name: 'setHighTierAccount',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'tierOf',
    outputs: [{ name: 'tier', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
] as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const ldyStakingAddress = {
  195: '0x045f9E9d2225319dF5E0909007FE7979E2674a32',
  31337: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
  42161: '0x4e80beDBD58b084a8946b7BA6814c28906Be2d02',
  59140: '0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6',
  59144: '0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1',
  421613: '0x5BFFC5303719f0dC6050a2D8042936714109985f',
} as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const ldyStakingConfig = {
  address: ldyStakingAddress,
  abi: ldyStakingAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const lTokenAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newAPRUD7x3',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false,
      },
    ],
    name: 'APRChangeEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'int256', type: 'int256', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'action',
        internalType: 'enum LToken.Action',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountAfterFees',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newStatus',
        internalType: 'enum LToken.Status',
        type: 'uint8',
        indexed: false,
      },
      { name: 'newId', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'ActivityEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'balanceBefore',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'rewards',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MintedRewardsEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newTVL',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TVLChangeEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'requestId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancelWithdrawalRequest',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'claimFees',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'depositFor',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'feesRateUD7x3',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'frozenRequests',
    outputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint96', type: 'uint96' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'fund',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getAPR',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getExpectedRetained',
    outputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getWithdrawnAmountAndFees',
    outputs: [
      { name: 'withdrawnAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'fees', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'globalBlacklist',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'globalOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'globalPause',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'globalOwner_', internalType: 'address', type: 'address' },
      { name: 'globalPause_', internalType: 'address', type: 'address' },
      { name: 'globalBlacklist_', internalType: 'address', type: 'address' },
      { name: 'ldyStaking_', internalType: 'address', type: 'address' },
      { name: 'underlyingToken', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'instantWithdrawal',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'invested',
    outputs: [
      { name: '', internalType: 'contract IERC20Upgradeable', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'ldyStaking',
    outputs: [
      { name: '', internalType: 'contract LDYStaking', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'listenerContract', internalType: 'address', type: 'address' },
    ],
    name: 'listenToTransfers',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'requestId', internalType: 'uint256', type: 'uint256' }],
    name: 'processBigQueuedRequest',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'processQueuedRequests',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'realBalanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'realTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recoverERC20',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'recoverUnderlying',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'repatriate',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'requestWithdrawal',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'retentionRateUD7x3',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'rewardsRedirectsFromTo',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'rewardsRedirectsToFrom',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'aprUD7x3', internalType: 'uint16', type: 'uint16' }],
    name: 'setAPR',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'feesRateUD7x3_', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'setFeesRate',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'fund_', internalType: 'address payable', type: 'address' },
    ],
    name: 'setFund',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'ldyStakingAddress', internalType: 'address', type: 'address' },
    ],
    name: 'setLDYStaking',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'retentionRateUD7x3_', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'setRetentionRate',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'withdrawer_', internalType: 'address payable', type: 'address' },
    ],
    name: 'setWithdrawer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
    ],
    name: 'startRewardsRedirection',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
    ],
    name: 'stopRewardsRedirection',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalQueued',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'transfersListeners',
    outputs: [
      {
        name: '',
        internalType: 'contract ITransfersListener',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'unclaimedFees',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'underlying',
    outputs: [
      { name: '', internalType: 'contract IERC20Upgradeable', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'listenerContract', internalType: 'address', type: 'address' },
    ],
    name: 'unlistenToTransfers',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'unmintedRewardsOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'usableUnderlyings',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawTo',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawalQueue',
    outputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint96', type: 'uint96' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'withdrawalQueueCursor',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'withdrawer',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LTokenSignaler
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const lTokenSignalerAbi = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'lTokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'LTokenSignalEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'globalOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'globalOwner_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'lTokenAddress', internalType: 'address', type: 'address' },
    ],
    name: 'signalLToken',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
  },
] as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const lTokenSignalerAddress = {
  195: '0x6A88b87aA4865e8d67D7CD32178bA03F885a088a',
  31337: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
  42161: '0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1',
  59140: '0x04a678103bE57c3d81100fe08e43C94e50adC37B',
  59144: '0xBA427517505b14C560854aED003304Fc69cbadfb',
  421613: '0x1dA817E33C0dB209C7b508B79F9dac4480f94522',
} as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const lTokenSignalerConfig = {
  address: lTokenSignalerAddress,
  abi: lTokenSignalerAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PreMining
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const preMiningAbi = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'lTokenAddress_', internalType: 'address', type: 'address' },
      { name: 'maxDistributedLDY_', internalType: 'uint256', type: 'uint256' },
      { name: 'lockedHardCap_', internalType: 'uint256', type: 'uint256' },
      { name: 'minLockDuration_', internalType: 'uint8', type: 'uint8' },
      { name: 'maxLockDuration_', internalType: 'uint8', type: 'uint8' },
      { name: 'vestingDuration_', internalType: 'uint8', type: 'uint8' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'duration',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'Lock',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'accountsLocks',
    outputs: [
      { name: 'amount', internalType: 'uint240', type: 'uint240' },
      { name: 'duration', internalType: 'uint8', type: 'uint8' },
      { name: 'hasUnlocked', internalType: 'bool', type: 'bool' },
      { name: 'claimedRewards', internalType: 'uint216', type: 'uint216' },
      { name: 'lockEndTimestamp', internalType: 'uint40', type: 'uint40' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'availableToClaim',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'claimPhaseStartTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'claimRewards',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'eligibleRewardsOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'endDepositPhase',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'hasClaimPhaseStarted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'hasDepositPhaseEnded',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'hasRecoveryPhaseStarted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'instantUnlock',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'lToken',
    outputs: [{ name: '', internalType: 'contract LToken', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'ldyToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'duration', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'lock',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'lockedHardCap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'maxDistributedLDY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'maxLockDuration',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'maxWeight',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'minLockDuration',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'processUnlockRequests',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recoverERC20',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [],
    name: 'requestUnlock',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'ldyTokenAddress', internalType: 'address', type: 'address' },
    ],
    name: 'setLDYToken',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'startClaimPhase',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'startRecoveryPhase',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalLocked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'underlyingToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'unlockRequests',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'unlockRequestsCursor',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'vestingDuration',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
] as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const preMiningAddress = {
  195: '0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9',
  31337: '0x9A676e781A523b5d0C0e43731313A708CB607508',
  42161: '0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c',
  59144: '0xd54d564606611A3502FE8909bBD3075dbeb77813',
} as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const preMiningConfig = {
  address: preMiningAddress,
  abi: preMiningAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link genericErc20Abi}__
 */
export const useReadGenericErc20 = /*#__PURE__*/ createUseReadContract({
  abi: genericErc20Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadGenericErc20Allowance = /*#__PURE__*/ createUseReadContract(
  { abi: genericErc20Abi, functionName: 'allowance' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadGenericErc20BalanceOf = /*#__PURE__*/ createUseReadContract(
  { abi: genericErc20Abi, functionName: 'balanceOf' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadGenericErc20Decimals = /*#__PURE__*/ createUseReadContract({
  abi: genericErc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"name"`
 */
export const useReadGenericErc20Name = /*#__PURE__*/ createUseReadContract({
  abi: genericErc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadGenericErc20Symbol = /*#__PURE__*/ createUseReadContract({
  abi: genericErc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadGenericErc20TotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: genericErc20Abi,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link genericErc20Abi}__
 */
export const useWriteGenericErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: genericErc20Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteGenericErc20Approve = /*#__PURE__*/ createUseWriteContract(
  { abi: genericErc20Abi, functionName: 'approve' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"burn"`
 */
export const useWriteGenericErc20Burn = /*#__PURE__*/ createUseWriteContract({
  abi: genericErc20Abi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"burnFrom"`
 */
export const useWriteGenericErc20BurnFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: genericErc20Abi,
    functionName: 'burnFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useWriteGenericErc20DecreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: genericErc20Abi,
    functionName: 'decreaseAllowance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useWriteGenericErc20IncreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: genericErc20Abi,
    functionName: 'increaseAllowance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"mint"`
 */
export const useWriteGenericErc20Mint = /*#__PURE__*/ createUseWriteContract({
  abi: genericErc20Abi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"setDecimals"`
 */
export const useWriteGenericErc20SetDecimals =
  /*#__PURE__*/ createUseWriteContract({
    abi: genericErc20Abi,
    functionName: 'setDecimals',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteGenericErc20Transfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: genericErc20Abi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteGenericErc20TransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: genericErc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link genericErc20Abi}__
 */
export const useSimulateGenericErc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: genericErc20Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateGenericErc20Approve =
  /*#__PURE__*/ createUseSimulateContract({
    abi: genericErc20Abi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"burn"`
 */
export const useSimulateGenericErc20Burn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: genericErc20Abi,
    functionName: 'burn',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"burnFrom"`
 */
export const useSimulateGenericErc20BurnFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: genericErc20Abi,
    functionName: 'burnFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useSimulateGenericErc20DecreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: genericErc20Abi,
    functionName: 'decreaseAllowance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useSimulateGenericErc20IncreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: genericErc20Abi,
    functionName: 'increaseAllowance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"mint"`
 */
export const useSimulateGenericErc20Mint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: genericErc20Abi,
    functionName: 'mint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"setDecimals"`
 */
export const useSimulateGenericErc20SetDecimals =
  /*#__PURE__*/ createUseSimulateContract({
    abi: genericErc20Abi,
    functionName: 'setDecimals',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateGenericErc20Transfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: genericErc20Abi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateGenericErc20TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: genericErc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link genericErc20Abi}__
 */
export const useWatchGenericErc20Event =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: genericErc20Abi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link genericErc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchGenericErc20ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: genericErc20Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link genericErc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchGenericErc20TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: genericErc20Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalBlacklistAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useReadGlobalBlacklist = /*#__PURE__*/ createUseReadContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"globalOwner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useReadGlobalBlacklistGlobalOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'globalOwner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"isBlacklisted"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useReadGlobalBlacklistIsBlacklisted =
  /*#__PURE__*/ createUseReadContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'isBlacklisted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useReadGlobalBlacklistOwner = /*#__PURE__*/ createUseReadContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useReadGlobalBlacklistProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'proxiableUUID',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useReadGlobalBlacklistRenounceOwnership =
  /*#__PURE__*/ createUseReadContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useReadGlobalBlacklistTransferOwnership =
  /*#__PURE__*/ createUseReadContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalBlacklistAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useWriteGlobalBlacklist = /*#__PURE__*/ createUseWriteContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"blacklist"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useWriteGlobalBlacklistBlacklist =
  /*#__PURE__*/ createUseWriteContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'blacklist',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useWriteGlobalBlacklistInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"unBlacklist"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useWriteGlobalBlacklistUnBlacklist =
  /*#__PURE__*/ createUseWriteContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'unBlacklist',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useWriteGlobalBlacklistUpgradeTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useWriteGlobalBlacklistUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalBlacklistAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useSimulateGlobalBlacklist =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"blacklist"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useSimulateGlobalBlacklistBlacklist =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'blacklist',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useSimulateGlobalBlacklistInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"unBlacklist"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useSimulateGlobalBlacklistUnBlacklist =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'unBlacklist',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useSimulateGlobalBlacklistUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useSimulateGlobalBlacklistUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useWatchGlobalBlacklistEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useWatchGlobalBlacklistAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useWatchGlobalBlacklistBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useWatchGlobalBlacklistInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useWatchGlobalBlacklistOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const useWatchGlobalBlacklistUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalOwnerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useReadGlobalOwner = /*#__PURE__*/ createUseReadContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useReadGlobalOwnerOwner = /*#__PURE__*/ createUseReadContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"pendingOwner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useReadGlobalOwnerPendingOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'pendingOwner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useReadGlobalOwnerProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'proxiableUUID',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalOwnerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useWriteGlobalOwner = /*#__PURE__*/ createUseWriteContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useWriteGlobalOwnerAcceptOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useWriteGlobalOwnerInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useWriteGlobalOwnerRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useWriteGlobalOwnerTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useWriteGlobalOwnerUpgradeTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useWriteGlobalOwnerUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalOwnerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useSimulateGlobalOwner = /*#__PURE__*/ createUseSimulateContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useSimulateGlobalOwnerAcceptOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useSimulateGlobalOwnerInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useSimulateGlobalOwnerRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useSimulateGlobalOwnerTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useSimulateGlobalOwnerUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useSimulateGlobalOwnerUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useWatchGlobalOwnerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useWatchGlobalOwnerAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useWatchGlobalOwnerBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useWatchGlobalOwnerInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useWatchGlobalOwnerOwnershipTransferStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    eventName: 'OwnershipTransferStarted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useWatchGlobalOwnerOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const useWatchGlobalOwnerUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalPauseAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useReadGlobalPause = /*#__PURE__*/ createUseReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"globalOwner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useReadGlobalPauseGlobalOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'globalOwner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useReadGlobalPauseOwner = /*#__PURE__*/ createUseReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useReadGlobalPausePaused = /*#__PURE__*/ createUseReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useReadGlobalPauseProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'proxiableUUID',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useReadGlobalPauseRenounceOwnership =
  /*#__PURE__*/ createUseReadContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useReadGlobalPauseTransferOwnership =
  /*#__PURE__*/ createUseReadContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalPauseAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useWriteGlobalPause = /*#__PURE__*/ createUseWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useWriteGlobalPauseInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useWriteGlobalPausePause = /*#__PURE__*/ createUseWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useWriteGlobalPauseUnpause = /*#__PURE__*/ createUseWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useWriteGlobalPauseUpgradeTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useWriteGlobalPauseUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalPauseAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useSimulateGlobalPause = /*#__PURE__*/ createUseSimulateContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useSimulateGlobalPauseInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useSimulateGlobalPausePause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'pause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useSimulateGlobalPauseUnpause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useSimulateGlobalPauseUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useSimulateGlobalPauseUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useWatchGlobalPauseEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useWatchGlobalPauseAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useWatchGlobalPauseBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useWatchGlobalPauseInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useWatchGlobalPauseOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"Paused"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useWatchGlobalPausePausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    eventName: 'Paused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"Unpaused"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useWatchGlobalPauseUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    eventName: 'Unpaused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const useWatchGlobalPauseUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTransfersListenerAbi}__
 */
export const useWriteITransfersListener = /*#__PURE__*/ createUseWriteContract({
  abi: iTransfersListenerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTransfersListenerAbi}__ and `functionName` set to `"onLTokenTransfer"`
 */
export const useWriteITransfersListenerOnLTokenTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: iTransfersListenerAbi,
    functionName: 'onLTokenTransfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTransfersListenerAbi}__
 */
export const useSimulateITransfersListener =
  /*#__PURE__*/ createUseSimulateContract({ abi: iTransfersListenerAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTransfersListenerAbi}__ and `functionName` set to `"onLTokenTransfer"`
 */
export const useSimulateITransfersListenerOnLTokenTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTransfersListenerAbi,
    functionName: 'onLTokenTransfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useReadLdyStaking = /*#__PURE__*/ createUseReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"highTierAccounts"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useReadLdyStakingHighTierAccounts =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'highTierAccounts',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useReadLdyStakingOwner = /*#__PURE__*/ createUseReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"pendingOwner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useReadLdyStakingPendingOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'pendingOwner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"tierOf"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useReadLdyStakingTierOf = /*#__PURE__*/ createUseReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'tierOf',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useWriteLdyStaking = /*#__PURE__*/ createUseWriteContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useWriteLdyStakingAcceptOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useWriteLdyStakingRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setHighTierAccount"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useWriteLdyStakingSetHighTierAccount =
  /*#__PURE__*/ createUseWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setHighTierAccount',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useWriteLdyStakingTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useSimulateLdyStaking = /*#__PURE__*/ createUseSimulateContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useSimulateLdyStakingAcceptOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useSimulateLdyStakingRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setHighTierAccount"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useSimulateLdyStakingSetHighTierAccount =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setHighTierAccount',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useSimulateLdyStakingTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useWatchLdyStakingEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useWatchLdyStakingOwnershipTransferStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'OwnershipTransferStarted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const useWatchLdyStakingOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__
 */
export const useReadLToken = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadLTokenAllowance = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadLTokenBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadLTokenDecimals = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"depositFor"`
 */
export const useReadLTokenDepositFor = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'depositFor',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"feesRateUD7x3"`
 */
export const useReadLTokenFeesRateUd7x3 = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'feesRateUD7x3',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"frozenRequests"`
 */
export const useReadLTokenFrozenRequests = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'frozenRequests',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"fund"`
 */
export const useReadLTokenFund = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"getAPR"`
 */
export const useReadLTokenGetApr = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'getAPR',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"getExpectedRetained"`
 */
export const useReadLTokenGetExpectedRetained =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenAbi,
    functionName: 'getExpectedRetained',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"getWithdrawnAmountAndFees"`
 */
export const useReadLTokenGetWithdrawnAmountAndFees =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenAbi,
    functionName: 'getWithdrawnAmountAndFees',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"globalBlacklist"`
 */
export const useReadLTokenGlobalBlacklist = /*#__PURE__*/ createUseReadContract(
  { abi: lTokenAbi, functionName: 'globalBlacklist' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"globalOwner"`
 */
export const useReadLTokenGlobalOwner = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'globalOwner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"globalPause"`
 */
export const useReadLTokenGlobalPause = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'globalPause',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"invested"`
 */
export const useReadLTokenInvested = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'invested',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"ldyStaking"`
 */
export const useReadLTokenLdyStaking = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'ldyStaking',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"name"`
 */
export const useReadLTokenName = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"owner"`
 */
export const useReadLTokenOwner = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"paused"`
 */
export const useReadLTokenPaused = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadLTokenProxiableUuid = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'proxiableUUID',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"realBalanceOf"`
 */
export const useReadLTokenRealBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'realBalanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"realTotalSupply"`
 */
export const useReadLTokenRealTotalSupply = /*#__PURE__*/ createUseReadContract(
  { abi: lTokenAbi, functionName: 'realTotalSupply' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useReadLTokenRenounceOwnership =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"retentionRateUD7x3"`
 */
export const useReadLTokenRetentionRateUd7x3 =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenAbi,
    functionName: 'retentionRateUD7x3',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"rewardsRedirectsFromTo"`
 */
export const useReadLTokenRewardsRedirectsFromTo =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenAbi,
    functionName: 'rewardsRedirectsFromTo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"rewardsRedirectsToFrom"`
 */
export const useReadLTokenRewardsRedirectsToFrom =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenAbi,
    functionName: 'rewardsRedirectsToFrom',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadLTokenSymbol = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"totalQueued"`
 */
export const useReadLTokenTotalQueued = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'totalQueued',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadLTokenTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useReadLTokenTransferOwnership =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"transfersListeners"`
 */
export const useReadLTokenTransfersListeners =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenAbi,
    functionName: 'transfersListeners',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"unclaimedFees"`
 */
export const useReadLTokenUnclaimedFees = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'unclaimedFees',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"underlying"`
 */
export const useReadLTokenUnderlying = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'underlying',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"unmintedRewardsOf"`
 */
export const useReadLTokenUnmintedRewardsOf =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenAbi,
    functionName: 'unmintedRewardsOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"usableUnderlyings"`
 */
export const useReadLTokenUsableUnderlyings =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenAbi,
    functionName: 'usableUnderlyings',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const useReadLTokenWithdrawTo = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'withdrawTo',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"withdrawalQueue"`
 */
export const useReadLTokenWithdrawalQueue = /*#__PURE__*/ createUseReadContract(
  { abi: lTokenAbi, functionName: 'withdrawalQueue' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"withdrawalQueueCursor"`
 */
export const useReadLTokenWithdrawalQueueCursor =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenAbi,
    functionName: 'withdrawalQueueCursor',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"withdrawer"`
 */
export const useReadLTokenWithdrawer = /*#__PURE__*/ createUseReadContract({
  abi: lTokenAbi,
  functionName: 'withdrawer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__
 */
export const useWriteLToken = /*#__PURE__*/ createUseWriteContract({
  abi: lTokenAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteLTokenApprove = /*#__PURE__*/ createUseWriteContract({
  abi: lTokenAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"cancelWithdrawalRequest"`
 */
export const useWriteLTokenCancelWithdrawalRequest =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenAbi,
    functionName: 'cancelWithdrawalRequest',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"claimFees"`
 */
export const useWriteLTokenClaimFees = /*#__PURE__*/ createUseWriteContract({
  abi: lTokenAbi,
  functionName: 'claimFees',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useWriteLTokenDecreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenAbi,
    functionName: 'decreaseAllowance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"deposit"`
 */
export const useWriteLTokenDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: lTokenAbi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useWriteLTokenIncreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenAbi,
    functionName: 'increaseAllowance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteLTokenInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: lTokenAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"instantWithdrawal"`
 */
export const useWriteLTokenInstantWithdrawal =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenAbi,
    functionName: 'instantWithdrawal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"listenToTransfers"`
 */
export const useWriteLTokenListenToTransfers =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenAbi,
    functionName: 'listenToTransfers',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"processBigQueuedRequest"`
 */
export const useWriteLTokenProcessBigQueuedRequest =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenAbi,
    functionName: 'processBigQueuedRequest',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"processQueuedRequests"`
 */
export const useWriteLTokenProcessQueuedRequests =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenAbi,
    functionName: 'processQueuedRequests',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"recoverERC20"`
 */
export const useWriteLTokenRecoverErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: lTokenAbi,
  functionName: 'recoverERC20',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"recoverUnderlying"`
 */
export const useWriteLTokenRecoverUnderlying =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenAbi,
    functionName: 'recoverUnderlying',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"repatriate"`
 */
export const useWriteLTokenRepatriate = /*#__PURE__*/ createUseWriteContract({
  abi: lTokenAbi,
  functionName: 'repatriate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"requestWithdrawal"`
 */
export const useWriteLTokenRequestWithdrawal =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenAbi,
    functionName: 'requestWithdrawal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setAPR"`
 */
export const useWriteLTokenSetApr = /*#__PURE__*/ createUseWriteContract({
  abi: lTokenAbi,
  functionName: 'setAPR',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setFeesRate"`
 */
export const useWriteLTokenSetFeesRate = /*#__PURE__*/ createUseWriteContract({
  abi: lTokenAbi,
  functionName: 'setFeesRate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setFund"`
 */
export const useWriteLTokenSetFund = /*#__PURE__*/ createUseWriteContract({
  abi: lTokenAbi,
  functionName: 'setFund',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setLDYStaking"`
 */
export const useWriteLTokenSetLdyStaking = /*#__PURE__*/ createUseWriteContract(
  { abi: lTokenAbi, functionName: 'setLDYStaking' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setRetentionRate"`
 */
export const useWriteLTokenSetRetentionRate =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenAbi,
    functionName: 'setRetentionRate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setWithdrawer"`
 */
export const useWriteLTokenSetWithdrawer = /*#__PURE__*/ createUseWriteContract(
  { abi: lTokenAbi, functionName: 'setWithdrawer' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"startRewardsRedirection"`
 */
export const useWriteLTokenStartRewardsRedirection =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenAbi,
    functionName: 'startRewardsRedirection',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"stopRewardsRedirection"`
 */
export const useWriteLTokenStopRewardsRedirection =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenAbi,
    functionName: 'stopRewardsRedirection',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteLTokenTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: lTokenAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteLTokenTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: lTokenAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"unlistenToTransfers"`
 */
export const useWriteLTokenUnlistenToTransfers =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenAbi,
    functionName: 'unlistenToTransfers',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useWriteLTokenUpgradeTo = /*#__PURE__*/ createUseWriteContract({
  abi: lTokenAbi,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteLTokenUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenAbi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__
 */
export const useSimulateLToken = /*#__PURE__*/ createUseSimulateContract({
  abi: lTokenAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateLTokenApprove = /*#__PURE__*/ createUseSimulateContract(
  { abi: lTokenAbi, functionName: 'approve' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"cancelWithdrawalRequest"`
 */
export const useSimulateLTokenCancelWithdrawalRequest =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'cancelWithdrawalRequest',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"claimFees"`
 */
export const useSimulateLTokenClaimFees =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'claimFees',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useSimulateLTokenDecreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'decreaseAllowance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"deposit"`
 */
export const useSimulateLTokenDeposit = /*#__PURE__*/ createUseSimulateContract(
  { abi: lTokenAbi, functionName: 'deposit' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useSimulateLTokenIncreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'increaseAllowance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateLTokenInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"instantWithdrawal"`
 */
export const useSimulateLTokenInstantWithdrawal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'instantWithdrawal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"listenToTransfers"`
 */
export const useSimulateLTokenListenToTransfers =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'listenToTransfers',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"processBigQueuedRequest"`
 */
export const useSimulateLTokenProcessBigQueuedRequest =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'processBigQueuedRequest',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"processQueuedRequests"`
 */
export const useSimulateLTokenProcessQueuedRequests =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'processQueuedRequests',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"recoverERC20"`
 */
export const useSimulateLTokenRecoverErc20 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'recoverERC20',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"recoverUnderlying"`
 */
export const useSimulateLTokenRecoverUnderlying =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'recoverUnderlying',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"repatriate"`
 */
export const useSimulateLTokenRepatriate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'repatriate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"requestWithdrawal"`
 */
export const useSimulateLTokenRequestWithdrawal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'requestWithdrawal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setAPR"`
 */
export const useSimulateLTokenSetApr = /*#__PURE__*/ createUseSimulateContract({
  abi: lTokenAbi,
  functionName: 'setAPR',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setFeesRate"`
 */
export const useSimulateLTokenSetFeesRate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'setFeesRate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setFund"`
 */
export const useSimulateLTokenSetFund = /*#__PURE__*/ createUseSimulateContract(
  { abi: lTokenAbi, functionName: 'setFund' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setLDYStaking"`
 */
export const useSimulateLTokenSetLdyStaking =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'setLDYStaking',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setRetentionRate"`
 */
export const useSimulateLTokenSetRetentionRate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'setRetentionRate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setWithdrawer"`
 */
export const useSimulateLTokenSetWithdrawer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'setWithdrawer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"startRewardsRedirection"`
 */
export const useSimulateLTokenStartRewardsRedirection =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'startRewardsRedirection',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"stopRewardsRedirection"`
 */
export const useSimulateLTokenStopRewardsRedirection =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'stopRewardsRedirection',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateLTokenTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateLTokenTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"unlistenToTransfers"`
 */
export const useSimulateLTokenUnlistenToTransfers =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'unlistenToTransfers',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useSimulateLTokenUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateLTokenUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenAbi}__
 */
export const useWatchLTokenEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: lTokenAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"APRChangeEvent"`
 */
export const useWatchLTokenAprChangeEventEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'APRChangeEvent',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"ActivityEvent"`
 */
export const useWatchLTokenActivityEventEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'ActivityEvent',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"AdminChanged"`
 */
export const useWatchLTokenAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchLTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"BeaconUpgraded"`
 */
export const useWatchLTokenBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchLTokenInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"MintedRewardsEvent"`
 */
export const useWatchLTokenMintedRewardsEventEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'MintedRewardsEvent',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchLTokenOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"Paused"`
 */
export const useWatchLTokenPausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'Paused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"TVLChangeEvent"`
 */
export const useWatchLTokenTvlChangeEventEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'TVLChangeEvent',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchLTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"Unpaused"`
 */
export const useWatchLTokenUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'Unpaused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchLTokenUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenSignalerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useReadLTokenSignaler = /*#__PURE__*/ createUseReadContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"globalOwner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useReadLTokenSignalerGlobalOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'globalOwner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useReadLTokenSignalerOwner = /*#__PURE__*/ createUseReadContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useReadLTokenSignalerProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'proxiableUUID',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useReadLTokenSignalerRenounceOwnership =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useReadLTokenSignalerTransferOwnership =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenSignalerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useWriteLTokenSignaler = /*#__PURE__*/ createUseWriteContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useWriteLTokenSignalerInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"signalLToken"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useWriteLTokenSignalerSignalLToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'signalLToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useWriteLTokenSignalerUpgradeTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useWriteLTokenSignalerUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenSignalerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useSimulateLTokenSignaler =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useSimulateLTokenSignalerInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"signalLToken"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useSimulateLTokenSignalerSignalLToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'signalLToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useSimulateLTokenSignalerUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useSimulateLTokenSignalerUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useWatchLTokenSignalerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useWatchLTokenSignalerAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useWatchLTokenSignalerBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useWatchLTokenSignalerInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `eventName` set to `"LTokenSignalEvent"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useWatchLTokenSignalerLTokenSignalEventEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    eventName: 'LTokenSignalEvent',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useWatchLTokenSignalerOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const useWatchLTokenSignalerUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMining = /*#__PURE__*/ createUseReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"accountsLocks"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningAccountsLocks =
  /*#__PURE__*/ createUseReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'accountsLocks',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"availableToClaim"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningAvailableToClaim =
  /*#__PURE__*/ createUseReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'availableToClaim',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"claimPhaseStartTimestamp"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningClaimPhaseStartTimestamp =
  /*#__PURE__*/ createUseReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'claimPhaseStartTimestamp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"eligibleRewardsOf"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningEligibleRewardsOf =
  /*#__PURE__*/ createUseReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'eligibleRewardsOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"hasClaimPhaseStarted"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningHasClaimPhaseStarted =
  /*#__PURE__*/ createUseReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'hasClaimPhaseStarted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"hasDepositPhaseEnded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningHasDepositPhaseEnded =
  /*#__PURE__*/ createUseReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'hasDepositPhaseEnded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"hasRecoveryPhaseStarted"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningHasRecoveryPhaseStarted =
  /*#__PURE__*/ createUseReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'hasRecoveryPhaseStarted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"lToken"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningLToken = /*#__PURE__*/ createUseReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'lToken',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"ldyToken"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningLdyToken = /*#__PURE__*/ createUseReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'ldyToken',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"lockedHardCap"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningLockedHardCap =
  /*#__PURE__*/ createUseReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'lockedHardCap',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"maxDistributedLDY"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningMaxDistributedLdy =
  /*#__PURE__*/ createUseReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'maxDistributedLDY',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"maxLockDuration"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningMaxLockDuration =
  /*#__PURE__*/ createUseReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'maxLockDuration',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"maxWeight"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningMaxWeight = /*#__PURE__*/ createUseReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'maxWeight',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"minLockDuration"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningMinLockDuration =
  /*#__PURE__*/ createUseReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'minLockDuration',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningOwner = /*#__PURE__*/ createUseReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningPaused = /*#__PURE__*/ createUseReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"pendingOwner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningPendingOwner = /*#__PURE__*/ createUseReadContract(
  {
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'pendingOwner',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"totalLocked"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningTotalLocked = /*#__PURE__*/ createUseReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'totalLocked',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"underlyingToken"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningUnderlyingToken =
  /*#__PURE__*/ createUseReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'underlyingToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"unlockRequests"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningUnlockRequests =
  /*#__PURE__*/ createUseReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'unlockRequests',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"unlockRequestsCursor"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningUnlockRequestsCursor =
  /*#__PURE__*/ createUseReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'unlockRequestsCursor',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"vestingDuration"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useReadPreMiningVestingDuration =
  /*#__PURE__*/ createUseReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'vestingDuration',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMining = /*#__PURE__*/ createUseWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMiningAcceptOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"claimRewards"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMiningClaimRewards =
  /*#__PURE__*/ createUseWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'claimRewards',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"endDepositPhase"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMiningEndDepositPhase =
  /*#__PURE__*/ createUseWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'endDepositPhase',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"instantUnlock"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMiningInstantUnlock =
  /*#__PURE__*/ createUseWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'instantUnlock',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"lock"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMiningLock = /*#__PURE__*/ createUseWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'lock',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMiningPause = /*#__PURE__*/ createUseWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"processUnlockRequests"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMiningProcessUnlockRequests =
  /*#__PURE__*/ createUseWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'processUnlockRequests',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"recoverERC20"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMiningRecoverErc20 =
  /*#__PURE__*/ createUseWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'recoverERC20',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMiningRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"requestUnlock"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMiningRequestUnlock =
  /*#__PURE__*/ createUseWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'requestUnlock',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"setLDYToken"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMiningSetLdyToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'setLDYToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"startClaimPhase"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMiningStartClaimPhase =
  /*#__PURE__*/ createUseWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'startClaimPhase',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"startRecoveryPhase"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMiningStartRecoveryPhase =
  /*#__PURE__*/ createUseWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'startRecoveryPhase',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMiningTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWritePreMiningUnpause = /*#__PURE__*/ createUseWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMining = /*#__PURE__*/ createUseSimulateContract({
  abi: preMiningAbi,
  address: preMiningAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningAcceptOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"claimRewards"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningClaimRewards =
  /*#__PURE__*/ createUseSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'claimRewards',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"endDepositPhase"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningEndDepositPhase =
  /*#__PURE__*/ createUseSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'endDepositPhase',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"instantUnlock"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningInstantUnlock =
  /*#__PURE__*/ createUseSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'instantUnlock',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"lock"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningLock = /*#__PURE__*/ createUseSimulateContract(
  { abi: preMiningAbi, address: preMiningAddress, functionName: 'lock' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningPause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'pause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"processUnlockRequests"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningProcessUnlockRequests =
  /*#__PURE__*/ createUseSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'processUnlockRequests',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"recoverERC20"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningRecoverErc20 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'recoverERC20',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"requestUnlock"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningRequestUnlock =
  /*#__PURE__*/ createUseSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'requestUnlock',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"setLDYToken"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningSetLdyToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'setLDYToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"startClaimPhase"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningStartClaimPhase =
  /*#__PURE__*/ createUseSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'startClaimPhase',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"startRecoveryPhase"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningStartRecoveryPhase =
  /*#__PURE__*/ createUseSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'startRecoveryPhase',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningUnpause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link preMiningAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWatchPreMiningEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: preMiningAbi, address: preMiningAddress },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link preMiningAbi}__ and `eventName` set to `"Lock"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWatchPreMiningLockEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: preMiningAbi,
    address: preMiningAddress,
    eventName: 'Lock',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link preMiningAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWatchPreMiningOwnershipTransferStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: preMiningAbi,
    address: preMiningAddress,
    eventName: 'OwnershipTransferStarted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link preMiningAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWatchPreMiningOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: preMiningAbi,
    address: preMiningAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link preMiningAbi}__ and `eventName` set to `"Paused"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWatchPreMiningPausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: preMiningAbi,
    address: preMiningAddress,
    eventName: 'Paused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link preMiningAbi}__ and `eventName` set to `"Unpaused"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWatchPreMiningUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: preMiningAbi,
    address: preMiningAddress,
    eventName: 'Unpaused',
  })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link genericErc20Abi}__
 */
export const readGenericErc20 = /*#__PURE__*/ createReadContract({
  abi: genericErc20Abi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"allowance"`
 */
export const readGenericErc20Allowance = /*#__PURE__*/ createReadContract({
  abi: genericErc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readGenericErc20BalanceOf = /*#__PURE__*/ createReadContract({
  abi: genericErc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"decimals"`
 */
export const readGenericErc20Decimals = /*#__PURE__*/ createReadContract({
  abi: genericErc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"name"`
 */
export const readGenericErc20Name = /*#__PURE__*/ createReadContract({
  abi: genericErc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"symbol"`
 */
export const readGenericErc20Symbol = /*#__PURE__*/ createReadContract({
  abi: genericErc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const readGenericErc20TotalSupply = /*#__PURE__*/ createReadContract({
  abi: genericErc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link genericErc20Abi}__
 */
export const writeGenericErc20 = /*#__PURE__*/ createWriteContract({
  abi: genericErc20Abi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"approve"`
 */
export const writeGenericErc20Approve = /*#__PURE__*/ createWriteContract({
  abi: genericErc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"burn"`
 */
export const writeGenericErc20Burn = /*#__PURE__*/ createWriteContract({
  abi: genericErc20Abi,
  functionName: 'burn',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"burnFrom"`
 */
export const writeGenericErc20BurnFrom = /*#__PURE__*/ createWriteContract({
  abi: genericErc20Abi,
  functionName: 'burnFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const writeGenericErc20DecreaseAllowance =
  /*#__PURE__*/ createWriteContract({
    abi: genericErc20Abi,
    functionName: 'decreaseAllowance',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"increaseAllowance"`
 */
export const writeGenericErc20IncreaseAllowance =
  /*#__PURE__*/ createWriteContract({
    abi: genericErc20Abi,
    functionName: 'increaseAllowance',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"mint"`
 */
export const writeGenericErc20Mint = /*#__PURE__*/ createWriteContract({
  abi: genericErc20Abi,
  functionName: 'mint',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"setDecimals"`
 */
export const writeGenericErc20SetDecimals = /*#__PURE__*/ createWriteContract({
  abi: genericErc20Abi,
  functionName: 'setDecimals',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"transfer"`
 */
export const writeGenericErc20Transfer = /*#__PURE__*/ createWriteContract({
  abi: genericErc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writeGenericErc20TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: genericErc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link genericErc20Abi}__
 */
export const simulateGenericErc20 = /*#__PURE__*/ createSimulateContract({
  abi: genericErc20Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"approve"`
 */
export const simulateGenericErc20Approve = /*#__PURE__*/ createSimulateContract(
  { abi: genericErc20Abi, functionName: 'approve' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"burn"`
 */
export const simulateGenericErc20Burn = /*#__PURE__*/ createSimulateContract({
  abi: genericErc20Abi,
  functionName: 'burn',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"burnFrom"`
 */
export const simulateGenericErc20BurnFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: genericErc20Abi,
    functionName: 'burnFrom',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const simulateGenericErc20DecreaseAllowance =
  /*#__PURE__*/ createSimulateContract({
    abi: genericErc20Abi,
    functionName: 'decreaseAllowance',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"increaseAllowance"`
 */
export const simulateGenericErc20IncreaseAllowance =
  /*#__PURE__*/ createSimulateContract({
    abi: genericErc20Abi,
    functionName: 'increaseAllowance',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"mint"`
 */
export const simulateGenericErc20Mint = /*#__PURE__*/ createSimulateContract({
  abi: genericErc20Abi,
  functionName: 'mint',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"setDecimals"`
 */
export const simulateGenericErc20SetDecimals =
  /*#__PURE__*/ createSimulateContract({
    abi: genericErc20Abi,
    functionName: 'setDecimals',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"transfer"`
 */
export const simulateGenericErc20Transfer =
  /*#__PURE__*/ createSimulateContract({
    abi: genericErc20Abi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link genericErc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateGenericErc20TransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: genericErc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link genericErc20Abi}__
 */
export const watchGenericErc20Event = /*#__PURE__*/ createWatchContractEvent({
  abi: genericErc20Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link genericErc20Abi}__ and `eventName` set to `"Approval"`
 */
export const watchGenericErc20ApprovalEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: genericErc20Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link genericErc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const watchGenericErc20TransferEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: genericErc20Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalBlacklistAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const readGlobalBlacklist = /*#__PURE__*/ createReadContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"globalOwner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const readGlobalBlacklistGlobalOwner = /*#__PURE__*/ createReadContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
  functionName: 'globalOwner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"isBlacklisted"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const readGlobalBlacklistIsBlacklisted =
  /*#__PURE__*/ createReadContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'isBlacklisted',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const readGlobalBlacklistOwner = /*#__PURE__*/ createReadContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const readGlobalBlacklistProxiableUuid =
  /*#__PURE__*/ createReadContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'proxiableUUID',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const readGlobalBlacklistRenounceOwnership =
  /*#__PURE__*/ createReadContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const readGlobalBlacklistTransferOwnership =
  /*#__PURE__*/ createReadContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalBlacklistAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const writeGlobalBlacklist = /*#__PURE__*/ createWriteContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"blacklist"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const writeGlobalBlacklistBlacklist = /*#__PURE__*/ createWriteContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
  functionName: 'blacklist',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const writeGlobalBlacklistInitialize = /*#__PURE__*/ createWriteContract(
  {
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'initialize',
  },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"unBlacklist"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const writeGlobalBlacklistUnBlacklist =
  /*#__PURE__*/ createWriteContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'unBlacklist',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const writeGlobalBlacklistUpgradeTo = /*#__PURE__*/ createWriteContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const writeGlobalBlacklistUpgradeToAndCall =
  /*#__PURE__*/ createWriteContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalBlacklistAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const simulateGlobalBlacklist = /*#__PURE__*/ createSimulateContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"blacklist"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const simulateGlobalBlacklistBlacklist =
  /*#__PURE__*/ createSimulateContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'blacklist',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const simulateGlobalBlacklistInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"unBlacklist"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const simulateGlobalBlacklistUnBlacklist =
  /*#__PURE__*/ createSimulateContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'unBlacklist',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const simulateGlobalBlacklistUpgradeTo =
  /*#__PURE__*/ createSimulateContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const simulateGlobalBlacklistUpgradeToAndCall =
  /*#__PURE__*/ createSimulateContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const watchGlobalBlacklistEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: globalBlacklistAbi, address: globalBlacklistAddress },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const watchGlobalBlacklistAdminChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const watchGlobalBlacklistBeaconUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const watchGlobalBlacklistInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const watchGlobalBlacklistOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xc44395eC149C6743A268A901a38e5b02dc87D10C)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const watchGlobalBlacklistUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalOwnerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const readGlobalOwner = /*#__PURE__*/ createReadContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const readGlobalOwnerOwner = /*#__PURE__*/ createReadContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"pendingOwner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const readGlobalOwnerPendingOwner = /*#__PURE__*/ createReadContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
  functionName: 'pendingOwner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const readGlobalOwnerProxiableUuid = /*#__PURE__*/ createReadContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
  functionName: 'proxiableUUID',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalOwnerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const writeGlobalOwner = /*#__PURE__*/ createWriteContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const writeGlobalOwnerAcceptOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const writeGlobalOwnerInitialize = /*#__PURE__*/ createWriteContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const writeGlobalOwnerRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const writeGlobalOwnerTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const writeGlobalOwnerUpgradeTo = /*#__PURE__*/ createWriteContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const writeGlobalOwnerUpgradeToAndCall =
  /*#__PURE__*/ createWriteContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalOwnerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const simulateGlobalOwner = /*#__PURE__*/ createSimulateContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const simulateGlobalOwnerAcceptOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const simulateGlobalOwnerInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const simulateGlobalOwnerRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const simulateGlobalOwnerTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const simulateGlobalOwnerUpgradeTo =
  /*#__PURE__*/ createSimulateContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const simulateGlobalOwnerUpgradeToAndCall =
  /*#__PURE__*/ createSimulateContract({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const watchGlobalOwnerEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const watchGlobalOwnerAdminChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const watchGlobalOwnerBeaconUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const watchGlobalOwnerInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const watchGlobalOwnerOwnershipTransferStartedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    eventName: 'OwnershipTransferStarted',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const watchGlobalOwnerOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2547A36186eCC16C25649B9234D4937216e45978)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const watchGlobalOwnerUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalPauseAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const readGlobalPause = /*#__PURE__*/ createReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"globalOwner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const readGlobalPauseGlobalOwner = /*#__PURE__*/ createReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'globalOwner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const readGlobalPauseOwner = /*#__PURE__*/ createReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const readGlobalPausePaused = /*#__PURE__*/ createReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'paused',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const readGlobalPauseProxiableUuid = /*#__PURE__*/ createReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'proxiableUUID',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const readGlobalPauseRenounceOwnership =
  /*#__PURE__*/ createReadContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const readGlobalPauseTransferOwnership =
  /*#__PURE__*/ createReadContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalPauseAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const writeGlobalPause = /*#__PURE__*/ createWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const writeGlobalPauseInitialize = /*#__PURE__*/ createWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const writeGlobalPausePause = /*#__PURE__*/ createWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const writeGlobalPauseUnpause = /*#__PURE__*/ createWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const writeGlobalPauseUpgradeTo = /*#__PURE__*/ createWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const writeGlobalPauseUpgradeToAndCall =
  /*#__PURE__*/ createWriteContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalPauseAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const simulateGlobalPause = /*#__PURE__*/ createSimulateContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const simulateGlobalPauseInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const simulateGlobalPausePause = /*#__PURE__*/ createSimulateContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const simulateGlobalPauseUnpause = /*#__PURE__*/ createSimulateContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const simulateGlobalPauseUpgradeTo =
  /*#__PURE__*/ createSimulateContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const simulateGlobalPauseUpgradeToAndCall =
  /*#__PURE__*/ createSimulateContract({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const watchGlobalPauseEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: globalPauseAbi,
  address: globalPauseAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const watchGlobalPauseAdminChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const watchGlobalPauseBeaconUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const watchGlobalPauseInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const watchGlobalPauseOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"Paused"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const watchGlobalPausePausedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    eventName: 'Paused',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"Unpaused"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const watchGlobalPauseUnpausedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    eventName: 'Unpaused',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x696C4B4f35Ee60e110cDaE5b3eBd78a5597f6Ac6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const watchGlobalPauseUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iTransfersListenerAbi}__
 */
export const writeITransfersListener = /*#__PURE__*/ createWriteContract({
  abi: iTransfersListenerAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iTransfersListenerAbi}__ and `functionName` set to `"onLTokenTransfer"`
 */
export const writeITransfersListenerOnLTokenTransfer =
  /*#__PURE__*/ createWriteContract({
    abi: iTransfersListenerAbi,
    functionName: 'onLTokenTransfer',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iTransfersListenerAbi}__
 */
export const simulateITransfersListener = /*#__PURE__*/ createSimulateContract({
  abi: iTransfersListenerAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link iTransfersListenerAbi}__ and `functionName` set to `"onLTokenTransfer"`
 */
export const simulateITransfersListenerOnLTokenTransfer =
  /*#__PURE__*/ createSimulateContract({
    abi: iTransfersListenerAbi,
    functionName: 'onLTokenTransfer',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const readLdyStaking = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"highTierAccounts"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const readLdyStakingHighTierAccounts = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'highTierAccounts',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const readLdyStakingOwner = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"pendingOwner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const readLdyStakingPendingOwner = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'pendingOwner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"tierOf"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const readLdyStakingTierOf = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'tierOf',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const writeLdyStaking = /*#__PURE__*/ createWriteContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const writeLdyStakingAcceptOwnership = /*#__PURE__*/ createWriteContract(
  {
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'acceptOwnership',
  },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const writeLdyStakingRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setHighTierAccount"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const writeLdyStakingSetHighTierAccount =
  /*#__PURE__*/ createWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setHighTierAccount',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const writeLdyStakingTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const simulateLdyStaking = /*#__PURE__*/ createSimulateContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const simulateLdyStakingAcceptOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const simulateLdyStakingRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setHighTierAccount"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const simulateLdyStakingSetHighTierAccount =
  /*#__PURE__*/ createSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setHighTierAccount',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const simulateLdyStakingTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const watchLdyStakingEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const watchLdyStakingOwnershipTransferStartedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'OwnershipTransferStarted',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x045f9E9d2225319dF5E0909007FE7979E2674a32)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x4e80beDBD58b084a8946b7BA6814c28906Be2d02)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const watchLdyStakingOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__
 */
export const readLToken = /*#__PURE__*/ createReadContract({ abi: lTokenAbi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"allowance"`
 */
export const readLTokenAllowance = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readLTokenBalanceOf = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"decimals"`
 */
export const readLTokenDecimals = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"depositFor"`
 */
export const readLTokenDepositFor = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'depositFor',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"feesRateUD7x3"`
 */
export const readLTokenFeesRateUd7x3 = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'feesRateUD7x3',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"frozenRequests"`
 */
export const readLTokenFrozenRequests = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'frozenRequests',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"fund"`
 */
export const readLTokenFund = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'fund',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"getAPR"`
 */
export const readLTokenGetApr = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'getAPR',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"getExpectedRetained"`
 */
export const readLTokenGetExpectedRetained = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'getExpectedRetained',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"getWithdrawnAmountAndFees"`
 */
export const readLTokenGetWithdrawnAmountAndFees =
  /*#__PURE__*/ createReadContract({
    abi: lTokenAbi,
    functionName: 'getWithdrawnAmountAndFees',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"globalBlacklist"`
 */
export const readLTokenGlobalBlacklist = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'globalBlacklist',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"globalOwner"`
 */
export const readLTokenGlobalOwner = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'globalOwner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"globalPause"`
 */
export const readLTokenGlobalPause = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'globalPause',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"invested"`
 */
export const readLTokenInvested = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'invested',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"ldyStaking"`
 */
export const readLTokenLdyStaking = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'ldyStaking',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"name"`
 */
export const readLTokenName = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"owner"`
 */
export const readLTokenOwner = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"paused"`
 */
export const readLTokenPaused = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'paused',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const readLTokenProxiableUuid = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'proxiableUUID',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"realBalanceOf"`
 */
export const readLTokenRealBalanceOf = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'realBalanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"realTotalSupply"`
 */
export const readLTokenRealTotalSupply = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'realTotalSupply',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const readLTokenRenounceOwnership = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"retentionRateUD7x3"`
 */
export const readLTokenRetentionRateUd7x3 = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'retentionRateUD7x3',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"rewardsRedirectsFromTo"`
 */
export const readLTokenRewardsRedirectsFromTo =
  /*#__PURE__*/ createReadContract({
    abi: lTokenAbi,
    functionName: 'rewardsRedirectsFromTo',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"rewardsRedirectsToFrom"`
 */
export const readLTokenRewardsRedirectsToFrom =
  /*#__PURE__*/ createReadContract({
    abi: lTokenAbi,
    functionName: 'rewardsRedirectsToFrom',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const readLTokenSymbol = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"totalQueued"`
 */
export const readLTokenTotalQueued = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'totalQueued',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readLTokenTotalSupply = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const readLTokenTransferOwnership = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"transfersListeners"`
 */
export const readLTokenTransfersListeners = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'transfersListeners',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"unclaimedFees"`
 */
export const readLTokenUnclaimedFees = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'unclaimedFees',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"underlying"`
 */
export const readLTokenUnderlying = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'underlying',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"unmintedRewardsOf"`
 */
export const readLTokenUnmintedRewardsOf = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'unmintedRewardsOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"usableUnderlyings"`
 */
export const readLTokenUsableUnderlyings = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'usableUnderlyings',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"withdrawTo"`
 */
export const readLTokenWithdrawTo = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'withdrawTo',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"withdrawalQueue"`
 */
export const readLTokenWithdrawalQueue = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'withdrawalQueue',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"withdrawalQueueCursor"`
 */
export const readLTokenWithdrawalQueueCursor = /*#__PURE__*/ createReadContract(
  { abi: lTokenAbi, functionName: 'withdrawalQueueCursor' },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"withdrawer"`
 */
export const readLTokenWithdrawer = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'withdrawer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__
 */
export const writeLToken = /*#__PURE__*/ createWriteContract({ abi: lTokenAbi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"approve"`
 */
export const writeLTokenApprove = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"cancelWithdrawalRequest"`
 */
export const writeLTokenCancelWithdrawalRequest =
  /*#__PURE__*/ createWriteContract({
    abi: lTokenAbi,
    functionName: 'cancelWithdrawalRequest',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"claimFees"`
 */
export const writeLTokenClaimFees = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'claimFees',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const writeLTokenDecreaseAllowance = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'decreaseAllowance',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"deposit"`
 */
export const writeLTokenDeposit = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"increaseAllowance"`
 */
export const writeLTokenIncreaseAllowance = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'increaseAllowance',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"initialize"`
 */
export const writeLTokenInitialize = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"instantWithdrawal"`
 */
export const writeLTokenInstantWithdrawal = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'instantWithdrawal',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"listenToTransfers"`
 */
export const writeLTokenListenToTransfers = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'listenToTransfers',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"processBigQueuedRequest"`
 */
export const writeLTokenProcessBigQueuedRequest =
  /*#__PURE__*/ createWriteContract({
    abi: lTokenAbi,
    functionName: 'processBigQueuedRequest',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"processQueuedRequests"`
 */
export const writeLTokenProcessQueuedRequests =
  /*#__PURE__*/ createWriteContract({
    abi: lTokenAbi,
    functionName: 'processQueuedRequests',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"recoverERC20"`
 */
export const writeLTokenRecoverErc20 = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'recoverERC20',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"recoverUnderlying"`
 */
export const writeLTokenRecoverUnderlying = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'recoverUnderlying',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"repatriate"`
 */
export const writeLTokenRepatriate = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'repatriate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"requestWithdrawal"`
 */
export const writeLTokenRequestWithdrawal = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'requestWithdrawal',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setAPR"`
 */
export const writeLTokenSetApr = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'setAPR',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setFeesRate"`
 */
export const writeLTokenSetFeesRate = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'setFeesRate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setFund"`
 */
export const writeLTokenSetFund = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'setFund',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setLDYStaking"`
 */
export const writeLTokenSetLdyStaking = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'setLDYStaking',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setRetentionRate"`
 */
export const writeLTokenSetRetentionRate = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'setRetentionRate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setWithdrawer"`
 */
export const writeLTokenSetWithdrawer = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'setWithdrawer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"startRewardsRedirection"`
 */
export const writeLTokenStartRewardsRedirection =
  /*#__PURE__*/ createWriteContract({
    abi: lTokenAbi,
    functionName: 'startRewardsRedirection',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"stopRewardsRedirection"`
 */
export const writeLTokenStopRewardsRedirection =
  /*#__PURE__*/ createWriteContract({
    abi: lTokenAbi,
    functionName: 'stopRewardsRedirection',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const writeLTokenTransfer = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeLTokenTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"unlistenToTransfers"`
 */
export const writeLTokenUnlistenToTransfers = /*#__PURE__*/ createWriteContract(
  { abi: lTokenAbi, functionName: 'unlistenToTransfers' },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const writeLTokenUpgradeTo = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const writeLTokenUpgradeToAndCall = /*#__PURE__*/ createWriteContract({
  abi: lTokenAbi,
  functionName: 'upgradeToAndCall',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__
 */
export const simulateLToken = /*#__PURE__*/ createSimulateContract({
  abi: lTokenAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"approve"`
 */
export const simulateLTokenApprove = /*#__PURE__*/ createSimulateContract({
  abi: lTokenAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"cancelWithdrawalRequest"`
 */
export const simulateLTokenCancelWithdrawalRequest =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenAbi,
    functionName: 'cancelWithdrawalRequest',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"claimFees"`
 */
export const simulateLTokenClaimFees = /*#__PURE__*/ createSimulateContract({
  abi: lTokenAbi,
  functionName: 'claimFees',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const simulateLTokenDecreaseAllowance =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenAbi,
    functionName: 'decreaseAllowance',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"deposit"`
 */
export const simulateLTokenDeposit = /*#__PURE__*/ createSimulateContract({
  abi: lTokenAbi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"increaseAllowance"`
 */
export const simulateLTokenIncreaseAllowance =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenAbi,
    functionName: 'increaseAllowance',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateLTokenInitialize = /*#__PURE__*/ createSimulateContract({
  abi: lTokenAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"instantWithdrawal"`
 */
export const simulateLTokenInstantWithdrawal =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenAbi,
    functionName: 'instantWithdrawal',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"listenToTransfers"`
 */
export const simulateLTokenListenToTransfers =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenAbi,
    functionName: 'listenToTransfers',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"processBigQueuedRequest"`
 */
export const simulateLTokenProcessBigQueuedRequest =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenAbi,
    functionName: 'processBigQueuedRequest',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"processQueuedRequests"`
 */
export const simulateLTokenProcessQueuedRequests =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenAbi,
    functionName: 'processQueuedRequests',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"recoverERC20"`
 */
export const simulateLTokenRecoverErc20 = /*#__PURE__*/ createSimulateContract({
  abi: lTokenAbi,
  functionName: 'recoverERC20',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"recoverUnderlying"`
 */
export const simulateLTokenRecoverUnderlying =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenAbi,
    functionName: 'recoverUnderlying',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"repatriate"`
 */
export const simulateLTokenRepatriate = /*#__PURE__*/ createSimulateContract({
  abi: lTokenAbi,
  functionName: 'repatriate',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"requestWithdrawal"`
 */
export const simulateLTokenRequestWithdrawal =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenAbi,
    functionName: 'requestWithdrawal',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setAPR"`
 */
export const simulateLTokenSetApr = /*#__PURE__*/ createSimulateContract({
  abi: lTokenAbi,
  functionName: 'setAPR',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setFeesRate"`
 */
export const simulateLTokenSetFeesRate = /*#__PURE__*/ createSimulateContract({
  abi: lTokenAbi,
  functionName: 'setFeesRate',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setFund"`
 */
export const simulateLTokenSetFund = /*#__PURE__*/ createSimulateContract({
  abi: lTokenAbi,
  functionName: 'setFund',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setLDYStaking"`
 */
export const simulateLTokenSetLdyStaking = /*#__PURE__*/ createSimulateContract(
  { abi: lTokenAbi, functionName: 'setLDYStaking' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setRetentionRate"`
 */
export const simulateLTokenSetRetentionRate =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenAbi,
    functionName: 'setRetentionRate',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setWithdrawer"`
 */
export const simulateLTokenSetWithdrawer = /*#__PURE__*/ createSimulateContract(
  { abi: lTokenAbi, functionName: 'setWithdrawer' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"startRewardsRedirection"`
 */
export const simulateLTokenStartRewardsRedirection =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenAbi,
    functionName: 'startRewardsRedirection',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"stopRewardsRedirection"`
 */
export const simulateLTokenStopRewardsRedirection =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenAbi,
    functionName: 'stopRewardsRedirection',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const simulateLTokenTransfer = /*#__PURE__*/ createSimulateContract({
  abi: lTokenAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateLTokenTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: lTokenAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"unlistenToTransfers"`
 */
export const simulateLTokenUnlistenToTransfers =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenAbi,
    functionName: 'unlistenToTransfers',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const simulateLTokenUpgradeTo = /*#__PURE__*/ createSimulateContract({
  abi: lTokenAbi,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const simulateLTokenUpgradeToAndCall =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenAbi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenAbi}__
 */
export const watchLTokenEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: lTokenAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"APRChangeEvent"`
 */
export const watchLTokenAprChangeEventEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'APRChangeEvent',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"ActivityEvent"`
 */
export const watchLTokenActivityEventEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'ActivityEvent',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"AdminChanged"`
 */
export const watchLTokenAdminChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const watchLTokenApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: lTokenAbi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"BeaconUpgraded"`
 */
export const watchLTokenBeaconUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchLTokenInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"MintedRewardsEvent"`
 */
export const watchLTokenMintedRewardsEventEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'MintedRewardsEvent',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchLTokenOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"Paused"`
 */
export const watchLTokenPausedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: lTokenAbi,
  eventName: 'Paused',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"TVLChangeEvent"`
 */
export const watchLTokenTvlChangeEventEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: lTokenAbi,
    eventName: 'TVLChangeEvent',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchLTokenTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: lTokenAbi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"Unpaused"`
 */
export const watchLTokenUnpausedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: lTokenAbi,
  eventName: 'Unpaused',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenAbi}__ and `eventName` set to `"Upgraded"`
 */
export const watchLTokenUpgradedEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: lTokenAbi,
  eventName: 'Upgraded',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenSignalerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const readLTokenSignaler = /*#__PURE__*/ createReadContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"globalOwner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const readLTokenSignalerGlobalOwner = /*#__PURE__*/ createReadContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
  functionName: 'globalOwner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const readLTokenSignalerOwner = /*#__PURE__*/ createReadContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const readLTokenSignalerProxiableUuid = /*#__PURE__*/ createReadContract(
  {
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'proxiableUUID',
  },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const readLTokenSignalerRenounceOwnership =
  /*#__PURE__*/ createReadContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const readLTokenSignalerTransferOwnership =
  /*#__PURE__*/ createReadContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenSignalerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const writeLTokenSignaler = /*#__PURE__*/ createWriteContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const writeLTokenSignalerInitialize = /*#__PURE__*/ createWriteContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"signalLToken"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const writeLTokenSignalerSignalLToken =
  /*#__PURE__*/ createWriteContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'signalLToken',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const writeLTokenSignalerUpgradeTo = /*#__PURE__*/ createWriteContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const writeLTokenSignalerUpgradeToAndCall =
  /*#__PURE__*/ createWriteContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenSignalerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const simulateLTokenSignaler = /*#__PURE__*/ createSimulateContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const simulateLTokenSignalerInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"signalLToken"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const simulateLTokenSignalerSignalLToken =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'signalLToken',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const simulateLTokenSignalerUpgradeTo =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const simulateLTokenSignalerUpgradeToAndCall =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const watchLTokenSignalerEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const watchLTokenSignalerAdminChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const watchLTokenSignalerBeaconUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const watchLTokenSignalerInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `eventName` set to `"LTokenSignalEvent"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const watchLTokenSignalerLTokenSignalEventEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    eventName: 'LTokenSignalEvent',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const watchLTokenSignalerOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x6A88b87aA4865e8d67D7CD32178bA03F885a088a)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const watchLTokenSignalerUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMining = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"accountsLocks"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningAccountsLocks = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'accountsLocks',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"availableToClaim"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningAvailableToClaim = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'availableToClaim',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"claimPhaseStartTimestamp"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningClaimPhaseStartTimestamp =
  /*#__PURE__*/ createReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'claimPhaseStartTimestamp',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"eligibleRewardsOf"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningEligibleRewardsOf = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'eligibleRewardsOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"hasClaimPhaseStarted"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningHasClaimPhaseStarted =
  /*#__PURE__*/ createReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'hasClaimPhaseStarted',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"hasDepositPhaseEnded"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningHasDepositPhaseEnded =
  /*#__PURE__*/ createReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'hasDepositPhaseEnded',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"hasRecoveryPhaseStarted"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningHasRecoveryPhaseStarted =
  /*#__PURE__*/ createReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'hasRecoveryPhaseStarted',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"lToken"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningLToken = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'lToken',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"ldyToken"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningLdyToken = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'ldyToken',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"lockedHardCap"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningLockedHardCap = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'lockedHardCap',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"maxDistributedLDY"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningMaxDistributedLdy = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'maxDistributedLDY',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"maxLockDuration"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningMaxLockDuration = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'maxLockDuration',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"maxWeight"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningMaxWeight = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'maxWeight',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"minLockDuration"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningMinLockDuration = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'minLockDuration',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningOwner = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningPaused = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'paused',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"pendingOwner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningPendingOwner = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'pendingOwner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"totalLocked"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningTotalLocked = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'totalLocked',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"underlyingToken"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningUnderlyingToken = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'underlyingToken',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"unlockRequests"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningUnlockRequests = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'unlockRequests',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"unlockRequestsCursor"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningUnlockRequestsCursor =
  /*#__PURE__*/ createReadContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'unlockRequestsCursor',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"vestingDuration"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const readPreMiningVestingDuration = /*#__PURE__*/ createReadContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'vestingDuration',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMining = /*#__PURE__*/ createWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMiningAcceptOwnership = /*#__PURE__*/ createWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'acceptOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"claimRewards"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMiningClaimRewards = /*#__PURE__*/ createWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'claimRewards',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"endDepositPhase"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMiningEndDepositPhase = /*#__PURE__*/ createWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'endDepositPhase',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"instantUnlock"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMiningInstantUnlock = /*#__PURE__*/ createWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'instantUnlock',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"lock"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMiningLock = /*#__PURE__*/ createWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'lock',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMiningPause = /*#__PURE__*/ createWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"processUnlockRequests"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMiningProcessUnlockRequests =
  /*#__PURE__*/ createWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'processUnlockRequests',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"recoverERC20"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMiningRecoverErc20 = /*#__PURE__*/ createWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'recoverERC20',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMiningRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"requestUnlock"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMiningRequestUnlock = /*#__PURE__*/ createWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'requestUnlock',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"setLDYToken"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMiningSetLdyToken = /*#__PURE__*/ createWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'setLDYToken',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"startClaimPhase"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMiningStartClaimPhase = /*#__PURE__*/ createWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'startClaimPhase',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"startRecoveryPhase"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMiningStartRecoveryPhase =
  /*#__PURE__*/ createWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'startRecoveryPhase',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMiningTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const writePreMiningUnpause = /*#__PURE__*/ createWriteContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMining = /*#__PURE__*/ createSimulateContract({
  abi: preMiningAbi,
  address: preMiningAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMiningAcceptOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"claimRewards"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMiningClaimRewards =
  /*#__PURE__*/ createSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'claimRewards',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"endDepositPhase"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMiningEndDepositPhase =
  /*#__PURE__*/ createSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'endDepositPhase',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"instantUnlock"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMiningInstantUnlock =
  /*#__PURE__*/ createSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'instantUnlock',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"lock"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMiningLock = /*#__PURE__*/ createSimulateContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'lock',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMiningPause = /*#__PURE__*/ createSimulateContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"processUnlockRequests"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMiningProcessUnlockRequests =
  /*#__PURE__*/ createSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'processUnlockRequests',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"recoverERC20"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMiningRecoverErc20 =
  /*#__PURE__*/ createSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'recoverERC20',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMiningRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"requestUnlock"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMiningRequestUnlock =
  /*#__PURE__*/ createSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'requestUnlock',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"setLDYToken"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMiningSetLdyToken =
  /*#__PURE__*/ createSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'setLDYToken',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"startClaimPhase"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMiningStartClaimPhase =
  /*#__PURE__*/ createSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'startClaimPhase',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"startRecoveryPhase"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMiningStartRecoveryPhase =
  /*#__PURE__*/ createSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'startRecoveryPhase',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMiningTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: preMiningAbi,
    address: preMiningAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const simulatePreMiningUnpause = /*#__PURE__*/ createSimulateContract({
  abi: preMiningAbi,
  address: preMiningAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link preMiningAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const watchPreMiningEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: preMiningAbi,
  address: preMiningAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link preMiningAbi}__ and `eventName` set to `"Lock"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const watchPreMiningLockEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: preMiningAbi,
  address: preMiningAddress,
  eventName: 'Lock',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link preMiningAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const watchPreMiningOwnershipTransferStartedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: preMiningAbi,
    address: preMiningAddress,
    eventName: 'OwnershipTransferStarted',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link preMiningAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const watchPreMiningOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: preMiningAbi,
    address: preMiningAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link preMiningAbi}__ and `eventName` set to `"Paused"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const watchPreMiningPausedEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: preMiningAbi, address: preMiningAddress, eventName: 'Paused' },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link preMiningAbi}__ and `eventName` set to `"Unpaused"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x2Bb79F621518BbA45dA5Ec57BC885C4686A60De9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const watchPreMiningUnpausedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: preMiningAbi,
    address: preMiningAddress,
    eventName: 'Unpaused',
  })
