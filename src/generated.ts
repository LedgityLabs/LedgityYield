import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useNetwork,
  useChainId,
  Address,
} from 'wagmi'
import { ReadContractResult, WriteContractMode, PrepareWriteContractResult } from 'wagmi/actions'

import {
  getContract,
  GetContractArgs,
  readContract,
  ReadContractConfig,
  writeContract,
  WriteContractArgs,
  WriteContractPreparedArgs,
  WriteContractUnpreparedArgs,
  prepareWriteContract,
  PrepareWriteContractConfig,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GenericERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const genericErc20ABI = [
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
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'spender', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
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
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const globalBlacklistABI = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint8', type: 'uint8', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
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
    inputs: [{ name: 'globalOwner_', internalType: 'address', type: 'address' }],
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
  { stateMutability: 'view', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
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
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
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
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const globalBlacklistAddress = {
  31337: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
  42161: '0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350',
  59140: '0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf',
  59144: '0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350',
  421613: '0x1549647606A71B2a79b85AEb54631b8eA2a1939a',
} as const

/**
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export const globalBlacklistConfig = {
  address: globalBlacklistAddress,
  abi: globalBlacklistABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GlobalOwner
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const globalOwnerABI = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint8', type: 'uint8', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
    name: 'Upgraded',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'initialize', outputs: [] },
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
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
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
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const globalOwnerAddress = {
  31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  42161: '0xe4Af4573bFc5F04D8b84c61744de8A94059f2462',
  59140: '0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6',
  59144: '0xe4Af4573bFc5F04D8b84c61744de8A94059f2462',
  421613: '0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350',
} as const

/**
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export const globalOwnerConfig = { address: globalOwnerAddress, abi: globalOwnerABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GlobalPause
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const globalPauseABI = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint8', type: 'uint8', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'account', internalType: 'address', type: 'address', indexed: false }],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'account', internalType: 'address', type: 'address', indexed: false }],
    name: 'Unpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
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
    inputs: [{ name: 'globalOwner_', internalType: 'address', type: 'address' }],
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
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'pause', outputs: [] },
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
  { stateMutability: 'view', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'unpause', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
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
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const globalPauseAddress = {
  31337: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  42161: '0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB',
  59140: '0x4fB551213757619558A93a599a08524e9Dd59C67',
  59144: '0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB',
  421613: '0x06f54B7f27eEC56616b951598BaA3B84D7660AB4',
} as const

/**
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export const globalPauseConfig = { address: globalPauseAddress, abi: globalPauseABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ITransfersListener
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iTransfersListenerABI = [
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
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const ldyStakingABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
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
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const ldyStakingAddress = {
  31337: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
  42161: '0x06f54B7f27eEC56616b951598BaA3B84D7660AB4',
  59140: '0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6',
  59144: '0x06f54B7f27eEC56616b951598BaA3B84D7660AB4',
  421613: '0x5BFFC5303719f0dC6050a2D8042936714109985f',
} as const

/**
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export const ldyStakingConfig = { address: ldyStakingAddress, abi: ldyStakingABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const lTokenABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'newAPRUD7x3', internalType: 'uint16', type: 'uint16', indexed: false }],
    name: 'APRChangeEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'int256', type: 'int256', indexed: true },
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'action', internalType: 'enum LToken.Action', type: 'uint8', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'amountAfterFees', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newStatus', internalType: 'enum LToken.Status', type: 'uint8', indexed: false },
      { name: 'newId', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'ActivityEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'spender', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint8', type: 'uint8', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'balanceBefore', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'rewards', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'MintedRewardsEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'account', internalType: 'address', type: 'address', indexed: false }],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'newTVL', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'TVLChangeEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'account', internalType: 'address', type: 'address', indexed: false }],
    name: 'Unpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
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
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'claimFees', outputs: [] },
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
    outputs: [{ name: '', internalType: 'contract IERC20Upgradeable', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'ldyStaking',
    outputs: [{ name: '', internalType: 'contract LDYStaking', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'listenerContract', internalType: 'address', type: 'address' }],
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
  { stateMutability: 'view', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
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
    inputs: [{ name: 'feesRateUD7x3_', internalType: 'uint32', type: 'uint32' }],
    name: 'setFeesRate',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'fund_', internalType: 'address payable', type: 'address' }],
    name: 'setFund',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'ldyStakingAddress', internalType: 'address', type: 'address' }],
    name: 'setLDYStaking',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'retentionRateUD7x3_', internalType: 'uint32', type: 'uint32' }],
    name: 'setRetentionRate',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'withdrawer_', internalType: 'address payable', type: 'address' }],
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
    outputs: [{ name: '', internalType: 'contract ITransfersListener', type: 'address' }],
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
    outputs: [{ name: '', internalType: 'contract IERC20Upgradeable', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'listenerContract', internalType: 'address', type: 'address' }],
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
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
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
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const lTokenSignalerABI = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint8', type: 'uint8', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'lTokenAddress', internalType: 'address', type: 'address', indexed: true }],
    name: 'LTokenSignalEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
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
    inputs: [{ name: 'globalOwner_', internalType: 'address', type: 'address' }],
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
  { stateMutability: 'view', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'lTokenAddress', internalType: 'address', type: 'address' }],
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
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
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
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const lTokenSignalerAddress = {
  31337: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
  42161: '0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1',
  59140: '0x04a678103bE57c3d81100fe08e43C94e50adC37B',
  59144: '0xBA427517505b14C560854aED003304Fc69cbadfb',
  421613: '0x1dA817E33C0dB209C7b508B79F9dac4480f94522',
} as const

/**
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export const lTokenSignalerConfig = {
  address: lTokenSignalerAddress,
  abi: lTokenSignalerABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Multicall3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export const multicall3ABI = [
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct Multicall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'returnData', internalType: 'bytes[]', type: 'bytes[]' },
    ],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct Multicall3.Call3[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct Multicall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct Multicall3.Call3Value[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3Value',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct Multicall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct Multicall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'blockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct Multicall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getBasefee',
    outputs: [{ name: 'basefee', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'blockNumber', internalType: 'uint256', type: 'uint256' }],
    name: 'getBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getBlockNumber',
    outputs: [{ name: 'blockNumber', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getChainId',
    outputs: [{ name: 'chainid', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockCoinbase',
    outputs: [{ name: 'coinbase', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockDifficulty',
    outputs: [{ name: 'difficulty', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockGasLimit',
    outputs: [{ name: 'gaslimit', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockTimestamp',
    outputs: [{ name: 'timestamp', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'getEthBalance',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getLastBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct Multicall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'tryAggregate',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct Multicall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct Multicall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'tryBlockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct Multicall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
  },
] as const

/**
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export const multicall3Address = {
  31337: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
  421613: '0x87afDfde08722AF04a2991D4B4D71e00307DFB3E',
} as const

/**
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export const multicall3Config = { address: multicall3Address, abi: multicall3ABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OldLToken1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const oldLToken1ABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'newAPRUD7x3', internalType: 'uint16', type: 'uint16', indexed: false }],
    name: 'APRChangeEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'int256', type: 'int256', indexed: true },
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'action', internalType: 'enum OldLToken1.Action', type: 'uint8', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'amountAfterFees', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newStatus', internalType: 'enum OldLToken1.Status', type: 'uint8', indexed: false },
    ],
    name: 'ActivityEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'spender', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint8', type: 'uint8', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'balanceBefore', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'rewards', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'MintedRewardsEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'account', internalType: 'address', type: 'address', indexed: false }],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'newTVL', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'TVLChangeEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'account', internalType: 'address', type: 'address', indexed: false }],
    name: 'Unpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
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
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'claimFees', outputs: [] },
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
    outputs: [{ name: '', internalType: 'contract IERC20Upgradeable', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'ldyStaking',
    outputs: [{ name: '', internalType: 'contract LDYStaking', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'listenerContract', internalType: 'address', type: 'address' }],
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
  { stateMutability: 'view', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
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
    inputs: [{ name: 'feesRateUD7x3_', internalType: 'uint32', type: 'uint32' }],
    name: 'setFeesRate',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'fund_', internalType: 'address payable', type: 'address' }],
    name: 'setFund',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'ldyStakingAddress', internalType: 'address', type: 'address' }],
    name: 'setLDYStaking',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'retentionRateUD7x3_', internalType: 'uint32', type: 'uint32' }],
    name: 'setRetentionRate',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'withdrawer_', internalType: 'address payable', type: 'address' }],
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
    outputs: [{ name: '', internalType: 'contract ITransfersListener', type: 'address' }],
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
    outputs: [{ name: '', internalType: 'contract IERC20Upgradeable', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'listenerContract', internalType: 'address', type: 'address' }],
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
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
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
// PreMining
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const preMiningABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'lTokenAddress_', internalType: 'address', type: 'address' },
      { name: 'distributedLDY_', internalType: 'uint256', type: 'uint256' },
      { name: 'lockedHardCap_', internalType: 'int256', type: 'int256' },
      { name: 'minLockDuration_', internalType: 'uint8', type: 'uint8' },
      { name: 'maxLockDuration_', internalType: 'uint8', type: 'uint8' },
      { name: 'vestingDuration_', internalType: 'uint8', type: 'uint8' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'account', internalType: 'address', type: 'address', indexed: false }],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'account', internalType: 'address', type: 'address', indexed: false }],
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
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
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
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'pause', outputs: [] },
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
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'refWeight',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  { stateMutability: 'payable', type: 'function', inputs: [], name: 'requestUnlock', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'ldyTokenAddress', internalType: 'address', type: 'address' }],
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
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalWeight',
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
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'unpause', outputs: [] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'vestingDuration',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
] as const

/**
 *
 */
export const preMiningAddress = {
  31337: '0x9A676e781A523b5d0C0e43731313A708CB607508',
} as const

/**
 *
 */
export const preMiningConfig = { address: preMiningAddress, abi: preMiningABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WIP_LDYStaking
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const wipLdyStakingABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'newAPRUD7x3', internalType: 'uint16', type: 'uint16', indexed: false }],
    name: 'APRChangeEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint8', type: 'uint8', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'account', internalType: 'address', type: 'address', indexed: false }],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'newTotalStaked', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'TotalStakedUpdateEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'account', internalType: 'address', type: 'address', indexed: false }],
    name: 'Unpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
    name: 'Upgraded',
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'claim', outputs: [] },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'compound', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'fuel',
    outputs: [],
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
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'addedAmount', internalType: 'uint216', type: 'uint216' },
    ],
    name: 'getNewLockEndFor',
    outputs: [{ name: '', internalType: 'uint40', type: 'uint40' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tier', internalType: 'uint256', type: 'uint256' }],
    name: 'getTier',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
      { name: 'globalOwner_', internalType: 'address', type: 'address' },
      { name: 'globalPause_', internalType: 'address', type: 'address' },
      { name: 'globalBlacklist_', internalType: 'address', type: 'address' },
      { name: 'ldyTokenAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'invested',
    outputs: [{ name: '', internalType: 'contract IERC20Upgradeable', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'lockEndOf',
    outputs: [{ name: '', internalType: 'uint40', type: 'uint40' }],
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
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
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
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'recoverLDY', outputs: [] },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'renounceOwnership', outputs: [] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'rewardsOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'rewardsReserve',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [{ name: 'stakeLockDuration_', internalType: 'uint40', type: 'uint40' }],
    name: 'setStakeLockDuration',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tier', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setTier',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'unlockFeesRateUD7x3_', internalType: 'uint32', type: 'uint32' }],
    name: 'setUnlockFeesRate',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint216', type: 'uint216' }],
    name: 'stake',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'stakeLockDuration',
    outputs: [{ name: '', internalType: 'uint40', type: 'uint40' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'stakeOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'tierOf',
    outputs: [{ name: 'tier', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalStaked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'unlock', outputs: [] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'unlockFeesRateUD7x3',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint216', type: 'uint216' }],
    name: 'unstake',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link genericErc20ABI}__.
 */
export function useGenericErc20Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof genericErc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof genericErc20ABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: genericErc20ABI, ...config } as UseContractReadConfig<
    typeof genericErc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"allowance"`.
 */
export function useGenericErc20Allowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof genericErc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof genericErc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: genericErc20ABI,
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<typeof genericErc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useGenericErc20BalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof genericErc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof genericErc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: genericErc20ABI,
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof genericErc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"decimals"`.
 */
export function useGenericErc20Decimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof genericErc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof genericErc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: genericErc20ABI,
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<typeof genericErc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"name"`.
 */
export function useGenericErc20Name<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof genericErc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof genericErc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: genericErc20ABI,
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof genericErc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"symbol"`.
 */
export function useGenericErc20Symbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof genericErc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof genericErc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: genericErc20ABI,
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof genericErc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useGenericErc20TotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof genericErc20ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof genericErc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: genericErc20ABI,
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof genericErc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link genericErc20ABI}__.
 */
export function useGenericErc20Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof genericErc20ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof genericErc20ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof genericErc20ABI, TFunctionName, TMode>({
    abi: genericErc20ABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"approve"`.
 */
export function useGenericErc20Approve<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof genericErc20ABI, 'approve'>['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof genericErc20ABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof genericErc20ABI, 'approve', TMode>({
    abi: genericErc20ABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"burn"`.
 */
export function useGenericErc20Burn<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof genericErc20ABI, 'burn'>['request']['abi'],
        'burn',
        TMode
      > & { functionName?: 'burn' }
    : UseContractWriteConfig<typeof genericErc20ABI, 'burn', TMode> & {
        abi?: never
        functionName?: 'burn'
      } = {} as any,
) {
  return useContractWrite<typeof genericErc20ABI, 'burn', TMode>({
    abi: genericErc20ABI,
    functionName: 'burn',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"burnFrom"`.
 */
export function useGenericErc20BurnFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof genericErc20ABI, 'burnFrom'>['request']['abi'],
        'burnFrom',
        TMode
      > & { functionName?: 'burnFrom' }
    : UseContractWriteConfig<typeof genericErc20ABI, 'burnFrom', TMode> & {
        abi?: never
        functionName?: 'burnFrom'
      } = {} as any,
) {
  return useContractWrite<typeof genericErc20ABI, 'burnFrom', TMode>({
    abi: genericErc20ABI,
    functionName: 'burnFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function useGenericErc20DecreaseAllowance<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof genericErc20ABI, 'decreaseAllowance'>['request']['abi'],
        'decreaseAllowance',
        TMode
      > & { functionName?: 'decreaseAllowance' }
    : UseContractWriteConfig<typeof genericErc20ABI, 'decreaseAllowance', TMode> & {
        abi?: never
        functionName?: 'decreaseAllowance'
      } = {} as any,
) {
  return useContractWrite<typeof genericErc20ABI, 'decreaseAllowance', TMode>({
    abi: genericErc20ABI,
    functionName: 'decreaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function useGenericErc20IncreaseAllowance<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof genericErc20ABI, 'increaseAllowance'>['request']['abi'],
        'increaseAllowance',
        TMode
      > & { functionName?: 'increaseAllowance' }
    : UseContractWriteConfig<typeof genericErc20ABI, 'increaseAllowance', TMode> & {
        abi?: never
        functionName?: 'increaseAllowance'
      } = {} as any,
) {
  return useContractWrite<typeof genericErc20ABI, 'increaseAllowance', TMode>({
    abi: genericErc20ABI,
    functionName: 'increaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"mint"`.
 */
export function useGenericErc20Mint<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof genericErc20ABI, 'mint'>['request']['abi'],
        'mint',
        TMode
      > & { functionName?: 'mint' }
    : UseContractWriteConfig<typeof genericErc20ABI, 'mint', TMode> & {
        abi?: never
        functionName?: 'mint'
      } = {} as any,
) {
  return useContractWrite<typeof genericErc20ABI, 'mint', TMode>({
    abi: genericErc20ABI,
    functionName: 'mint',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"setDecimals"`.
 */
export function useGenericErc20SetDecimals<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof genericErc20ABI, 'setDecimals'>['request']['abi'],
        'setDecimals',
        TMode
      > & { functionName?: 'setDecimals' }
    : UseContractWriteConfig<typeof genericErc20ABI, 'setDecimals', TMode> & {
        abi?: never
        functionName?: 'setDecimals'
      } = {} as any,
) {
  return useContractWrite<typeof genericErc20ABI, 'setDecimals', TMode>({
    abi: genericErc20ABI,
    functionName: 'setDecimals',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function useGenericErc20Transfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof genericErc20ABI, 'transfer'>['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<typeof genericErc20ABI, 'transfer', TMode> & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any,
) {
  return useContractWrite<typeof genericErc20ABI, 'transfer', TMode>({
    abi: genericErc20ABI,
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useGenericErc20TransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof genericErc20ABI, 'transferFrom'>['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof genericErc20ABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof genericErc20ABI, 'transferFrom', TMode>({
    abi: genericErc20ABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link genericErc20ABI}__.
 */
export function usePrepareGenericErc20Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof genericErc20ABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: genericErc20ABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof genericErc20ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareGenericErc20Approve(
  config: Omit<
    UsePrepareContractWriteConfig<typeof genericErc20ABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: genericErc20ABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof genericErc20ABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"burn"`.
 */
export function usePrepareGenericErc20Burn(
  config: Omit<
    UsePrepareContractWriteConfig<typeof genericErc20ABI, 'burn'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: genericErc20ABI,
    functionName: 'burn',
    ...config,
  } as UsePrepareContractWriteConfig<typeof genericErc20ABI, 'burn'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"burnFrom"`.
 */
export function usePrepareGenericErc20BurnFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof genericErc20ABI, 'burnFrom'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: genericErc20ABI,
    functionName: 'burnFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof genericErc20ABI, 'burnFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function usePrepareGenericErc20DecreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof genericErc20ABI, 'decreaseAllowance'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: genericErc20ABI,
    functionName: 'decreaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof genericErc20ABI, 'decreaseAllowance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function usePrepareGenericErc20IncreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof genericErc20ABI, 'increaseAllowance'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: genericErc20ABI,
    functionName: 'increaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof genericErc20ABI, 'increaseAllowance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"mint"`.
 */
export function usePrepareGenericErc20Mint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof genericErc20ABI, 'mint'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: genericErc20ABI,
    functionName: 'mint',
    ...config,
  } as UsePrepareContractWriteConfig<typeof genericErc20ABI, 'mint'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"setDecimals"`.
 */
export function usePrepareGenericErc20SetDecimals(
  config: Omit<
    UsePrepareContractWriteConfig<typeof genericErc20ABI, 'setDecimals'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: genericErc20ABI,
    functionName: 'setDecimals',
    ...config,
  } as UsePrepareContractWriteConfig<typeof genericErc20ABI, 'setDecimals'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareGenericErc20Transfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof genericErc20ABI, 'transfer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: genericErc20ABI,
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof genericErc20ABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link genericErc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareGenericErc20TransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof genericErc20ABI, 'transferFrom'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: genericErc20ABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof genericErc20ABI, 'transferFrom'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalBlacklistABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function useGlobalBlacklistRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof globalBlacklistABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalBlacklistABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof globalBlacklistAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    ...config,
  } as UseContractReadConfig<typeof globalBlacklistABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"globalOwner"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function useGlobalBlacklistGlobalOwner<
  TFunctionName extends 'globalOwner',
  TSelectData = ReadContractResult<typeof globalBlacklistABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalBlacklistABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalBlacklistAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'globalOwner',
    ...config,
  } as UseContractReadConfig<typeof globalBlacklistABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"isBlacklisted"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function useGlobalBlacklistIsBlacklisted<
  TFunctionName extends 'isBlacklisted',
  TSelectData = ReadContractResult<typeof globalBlacklistABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalBlacklistABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalBlacklistAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'isBlacklisted',
    ...config,
  } as UseContractReadConfig<typeof globalBlacklistABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"owner"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function useGlobalBlacklistOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof globalBlacklistABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalBlacklistABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalBlacklistAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof globalBlacklistABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"proxiableUUID"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function useGlobalBlacklistProxiableUuid<
  TFunctionName extends 'proxiableUUID',
  TSelectData = ReadContractResult<typeof globalBlacklistABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalBlacklistABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalBlacklistAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<typeof globalBlacklistABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function useGlobalBlacklistRenounceOwnership<
  TFunctionName extends 'renounceOwnership',
  TSelectData = ReadContractResult<typeof globalBlacklistABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalBlacklistABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalBlacklistAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'renounceOwnership',
    ...config,
  } as UseContractReadConfig<typeof globalBlacklistABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function useGlobalBlacklistTransferOwnership<
  TFunctionName extends 'transferOwnership',
  TSelectData = ReadContractResult<typeof globalBlacklistABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalBlacklistABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalBlacklistAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'transferOwnership',
    ...config,
  } as UseContractReadConfig<typeof globalBlacklistABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalBlacklistABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function useGlobalBlacklistWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalBlacklistAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalBlacklistABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof globalBlacklistABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalBlacklistABI, TFunctionName, TMode>({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"blacklist"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function useGlobalBlacklistBlacklist<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalBlacklistAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalBlacklistABI, 'blacklist'>['request']['abi'],
        'blacklist',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'blacklist' }
    : UseContractWriteConfig<typeof globalBlacklistABI, 'blacklist', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'blacklist'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalBlacklistABI, 'blacklist', TMode>({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'blacklist',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"initialize"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function useGlobalBlacklistInitialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalBlacklistAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalBlacklistABI, 'initialize'>['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
    : UseContractWriteConfig<typeof globalBlacklistABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalBlacklistABI, 'initialize', TMode>({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"unBlacklist"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function useGlobalBlacklistUnBlacklist<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalBlacklistAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalBlacklistABI, 'unBlacklist'>['request']['abi'],
        'unBlacklist',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'unBlacklist' }
    : UseContractWriteConfig<typeof globalBlacklistABI, 'unBlacklist', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'unBlacklist'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalBlacklistABI, 'unBlacklist', TMode>({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'unBlacklist',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function useGlobalBlacklistUpgradeTo<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalBlacklistAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalBlacklistABI, 'upgradeTo'>['request']['abi'],
        'upgradeTo',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof globalBlacklistABI, 'upgradeTo', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeTo'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalBlacklistABI, 'upgradeTo', TMode>({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function useGlobalBlacklistUpgradeToAndCall<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalBlacklistAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalBlacklistABI, 'upgradeToAndCall'>['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeToAndCall' }
    : UseContractWriteConfig<typeof globalBlacklistABI, 'upgradeToAndCall', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeToAndCall'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalBlacklistABI, 'upgradeToAndCall', TMode>({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalBlacklistABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function usePrepareGlobalBlacklistWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalBlacklistABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof globalBlacklistAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalBlacklistABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"blacklist"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function usePrepareGlobalBlacklistBlacklist(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalBlacklistABI, 'blacklist'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalBlacklistAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'blacklist',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalBlacklistABI, 'blacklist'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"initialize"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function usePrepareGlobalBlacklistInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalBlacklistABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalBlacklistAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalBlacklistABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"unBlacklist"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function usePrepareGlobalBlacklistUnBlacklist(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalBlacklistABI, 'unBlacklist'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalBlacklistAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'unBlacklist',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalBlacklistABI, 'unBlacklist'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function usePrepareGlobalBlacklistUpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalBlacklistABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalBlacklistAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalBlacklistABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalBlacklistABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function usePrepareGlobalBlacklistUpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalBlacklistABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalBlacklistAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[chainId as keyof typeof globalBlacklistAddress],
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalBlacklistABI, 'upgradeToAndCall'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalOwnerABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function useGlobalOwnerRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof globalOwnerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalOwnerABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof globalOwnerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    ...config,
  } as UseContractReadConfig<typeof globalOwnerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalOwnerABI}__ and `functionName` set to `"owner"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function useGlobalOwnerOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof globalOwnerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalOwnerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalOwnerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof globalOwnerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalOwnerABI}__ and `functionName` set to `"pendingOwner"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function useGlobalOwnerPendingOwner<
  TFunctionName extends 'pendingOwner',
  TSelectData = ReadContractResult<typeof globalOwnerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalOwnerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalOwnerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    functionName: 'pendingOwner',
    ...config,
  } as UseContractReadConfig<typeof globalOwnerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalOwnerABI}__ and `functionName` set to `"proxiableUUID"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function useGlobalOwnerProxiableUuid<
  TFunctionName extends 'proxiableUUID',
  TSelectData = ReadContractResult<typeof globalOwnerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalOwnerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalOwnerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<typeof globalOwnerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalOwnerABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function useGlobalOwnerWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalOwnerAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalOwnerABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof globalOwnerABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalOwnerABI, TFunctionName, TMode>({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalOwnerABI}__ and `functionName` set to `"acceptOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function useGlobalOwnerAcceptOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalOwnerAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalOwnerABI, 'acceptOwnership'>['request']['abi'],
        'acceptOwnership',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'acceptOwnership' }
    : UseContractWriteConfig<typeof globalOwnerABI, 'acceptOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'acceptOwnership'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalOwnerABI, 'acceptOwnership', TMode>({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    functionName: 'acceptOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalOwnerABI}__ and `functionName` set to `"initialize"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function useGlobalOwnerInitialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalOwnerAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalOwnerABI, 'initialize'>['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
    : UseContractWriteConfig<typeof globalOwnerABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalOwnerABI, 'initialize', TMode>({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalOwnerABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function useGlobalOwnerRenounceOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalOwnerAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalOwnerABI, 'renounceOwnership'>['request']['abi'],
        'renounceOwnership',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'renounceOwnership' }
    : UseContractWriteConfig<typeof globalOwnerABI, 'renounceOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalOwnerABI, 'renounceOwnership', TMode>({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalOwnerABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function useGlobalOwnerTransferOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalOwnerAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalOwnerABI, 'transferOwnership'>['request']['abi'],
        'transferOwnership',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'transferOwnership' }
    : UseContractWriteConfig<typeof globalOwnerABI, 'transferOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalOwnerABI, 'transferOwnership', TMode>({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalOwnerABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function useGlobalOwnerUpgradeTo<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalOwnerAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalOwnerABI, 'upgradeTo'>['request']['abi'],
        'upgradeTo',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof globalOwnerABI, 'upgradeTo', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeTo'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalOwnerABI, 'upgradeTo', TMode>({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalOwnerABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function useGlobalOwnerUpgradeToAndCall<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalOwnerAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalOwnerABI, 'upgradeToAndCall'>['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeToAndCall' }
    : UseContractWriteConfig<typeof globalOwnerABI, 'upgradeToAndCall', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeToAndCall'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalOwnerABI, 'upgradeToAndCall', TMode>({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalOwnerABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function usePrepareGlobalOwnerWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalOwnerABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof globalOwnerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalOwnerABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalOwnerABI}__ and `functionName` set to `"acceptOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function usePrepareGlobalOwnerAcceptOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalOwnerABI, 'acceptOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalOwnerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    functionName: 'acceptOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalOwnerABI, 'acceptOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalOwnerABI}__ and `functionName` set to `"initialize"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function usePrepareGlobalOwnerInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalOwnerABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalOwnerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalOwnerABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalOwnerABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function usePrepareGlobalOwnerRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalOwnerABI, 'renounceOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalOwnerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalOwnerABI, 'renounceOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalOwnerABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function usePrepareGlobalOwnerTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalOwnerABI, 'transferOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalOwnerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalOwnerABI, 'transferOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalOwnerABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function usePrepareGlobalOwnerUpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalOwnerABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalOwnerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalOwnerABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalOwnerABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function usePrepareGlobalOwnerUpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalOwnerABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalOwnerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalOwnerABI,
    address: globalOwnerAddress[chainId as keyof typeof globalOwnerAddress],
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalOwnerABI, 'upgradeToAndCall'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalPauseABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function useGlobalPauseRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof globalPauseABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalPauseABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof globalPauseAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    ...config,
  } as UseContractReadConfig<typeof globalPauseABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"globalOwner"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function useGlobalPauseGlobalOwner<
  TFunctionName extends 'globalOwner',
  TSelectData = ReadContractResult<typeof globalPauseABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalPauseABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalPauseAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'globalOwner',
    ...config,
  } as UseContractReadConfig<typeof globalPauseABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"owner"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function useGlobalPauseOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof globalPauseABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalPauseABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalPauseAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof globalPauseABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"paused"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function useGlobalPausePaused<
  TFunctionName extends 'paused',
  TSelectData = ReadContractResult<typeof globalPauseABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalPauseABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalPauseAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'paused',
    ...config,
  } as UseContractReadConfig<typeof globalPauseABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"proxiableUUID"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function useGlobalPauseProxiableUuid<
  TFunctionName extends 'proxiableUUID',
  TSelectData = ReadContractResult<typeof globalPauseABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalPauseABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalPauseAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<typeof globalPauseABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function useGlobalPauseRenounceOwnership<
  TFunctionName extends 'renounceOwnership',
  TSelectData = ReadContractResult<typeof globalPauseABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalPauseABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalPauseAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'renounceOwnership',
    ...config,
  } as UseContractReadConfig<typeof globalPauseABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function useGlobalPauseTransferOwnership<
  TFunctionName extends 'transferOwnership',
  TSelectData = ReadContractResult<typeof globalPauseABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof globalPauseABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalPauseAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'transferOwnership',
    ...config,
  } as UseContractReadConfig<typeof globalPauseABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalPauseABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function useGlobalPauseWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalPauseAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalPauseABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof globalPauseABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalPauseABI, TFunctionName, TMode>({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"initialize"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function useGlobalPauseInitialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalPauseAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalPauseABI, 'initialize'>['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
    : UseContractWriteConfig<typeof globalPauseABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalPauseABI, 'initialize', TMode>({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"pause"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function useGlobalPausePause<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalPauseAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalPauseABI, 'pause'>['request']['abi'],
        'pause',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'pause' }
    : UseContractWriteConfig<typeof globalPauseABI, 'pause', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'pause'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalPauseABI, 'pause', TMode>({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'pause',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"unpause"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function useGlobalPauseUnpause<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalPauseAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalPauseABI, 'unpause'>['request']['abi'],
        'unpause',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'unpause' }
    : UseContractWriteConfig<typeof globalPauseABI, 'unpause', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'unpause'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalPauseABI, 'unpause', TMode>({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'unpause',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function useGlobalPauseUpgradeTo<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalPauseAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalPauseABI, 'upgradeTo'>['request']['abi'],
        'upgradeTo',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof globalPauseABI, 'upgradeTo', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeTo'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalPauseABI, 'upgradeTo', TMode>({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function useGlobalPauseUpgradeToAndCall<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof globalPauseAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof globalPauseABI, 'upgradeToAndCall'>['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeToAndCall' }
    : UseContractWriteConfig<typeof globalPauseABI, 'upgradeToAndCall', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeToAndCall'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof globalPauseABI, 'upgradeToAndCall', TMode>({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalPauseABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function usePrepareGlobalPauseWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalPauseABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof globalPauseAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalPauseABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"initialize"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function usePrepareGlobalPauseInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalPauseABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalPauseAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalPauseABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"pause"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function usePrepareGlobalPausePause(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalPauseABI, 'pause'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalPauseAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'pause',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalPauseABI, 'pause'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"unpause"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function usePrepareGlobalPauseUnpause(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalPauseABI, 'unpause'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalPauseAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'unpause',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalPauseABI, 'unpause'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function usePrepareGlobalPauseUpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalPauseABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalPauseAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalPauseABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link globalPauseABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function usePrepareGlobalPauseUpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof globalPauseABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof globalPauseAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: globalPauseABI,
    address: globalPauseAddress[chainId as keyof typeof globalPauseAddress],
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof globalPauseABI, 'upgradeToAndCall'>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTransfersListenerABI}__.
 */
export function useITransfersListenerWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof iTransfersListenerABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof iTransfersListenerABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof iTransfersListenerABI, TFunctionName, TMode>({
    abi: iTransfersListenerABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link iTransfersListenerABI}__ and `functionName` set to `"onLTokenTransfer"`.
 */
export function useITransfersListenerOnLTokenTransfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof iTransfersListenerABI,
          'onLTokenTransfer'
        >['request']['abi'],
        'onLTokenTransfer',
        TMode
      > & { functionName?: 'onLTokenTransfer' }
    : UseContractWriteConfig<typeof iTransfersListenerABI, 'onLTokenTransfer', TMode> & {
        abi?: never
        functionName?: 'onLTokenTransfer'
      } = {} as any,
) {
  return useContractWrite<typeof iTransfersListenerABI, 'onLTokenTransfer', TMode>({
    abi: iTransfersListenerABI,
    functionName: 'onLTokenTransfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTransfersListenerABI}__.
 */
export function usePrepareITransfersListenerWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTransfersListenerABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iTransfersListenerABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTransfersListenerABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link iTransfersListenerABI}__ and `functionName` set to `"onLTokenTransfer"`.
 */
export function usePrepareITransfersListenerOnLTokenTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof iTransfersListenerABI, 'onLTokenTransfer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: iTransfersListenerABI,
    functionName: 'onLTokenTransfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof iTransfersListenerABI, 'onLTokenTransfer'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ldyStakingABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function useLdyStakingRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof ldyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ldyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof ldyStakingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: ldyStakingABI,
    address: ldyStakingAddress[chainId as keyof typeof ldyStakingAddress],
    ...config,
  } as UseContractReadConfig<typeof ldyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ldyStakingABI}__ and `functionName` set to `"highTierAccounts"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function useLdyStakingHighTierAccounts<
  TFunctionName extends 'highTierAccounts',
  TSelectData = ReadContractResult<typeof ldyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ldyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof ldyStakingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: ldyStakingABI,
    address: ldyStakingAddress[chainId as keyof typeof ldyStakingAddress],
    functionName: 'highTierAccounts',
    ...config,
  } as UseContractReadConfig<typeof ldyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ldyStakingABI}__ and `functionName` set to `"owner"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function useLdyStakingOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof ldyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ldyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof ldyStakingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: ldyStakingABI,
    address: ldyStakingAddress[chainId as keyof typeof ldyStakingAddress],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof ldyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ldyStakingABI}__ and `functionName` set to `"pendingOwner"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function useLdyStakingPendingOwner<
  TFunctionName extends 'pendingOwner',
  TSelectData = ReadContractResult<typeof ldyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ldyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof ldyStakingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: ldyStakingABI,
    address: ldyStakingAddress[chainId as keyof typeof ldyStakingAddress],
    functionName: 'pendingOwner',
    ...config,
  } as UseContractReadConfig<typeof ldyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link ldyStakingABI}__ and `functionName` set to `"tierOf"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function useLdyStakingTierOf<
  TFunctionName extends 'tierOf',
  TSelectData = ReadContractResult<typeof ldyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof ldyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof ldyStakingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: ldyStakingABI,
    address: ldyStakingAddress[chainId as keyof typeof ldyStakingAddress],
    functionName: 'tierOf',
    ...config,
  } as UseContractReadConfig<typeof ldyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ldyStakingABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function useLdyStakingWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof ldyStakingAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof ldyStakingABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof ldyStakingABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof ldyStakingABI, TFunctionName, TMode>({
    abi: ldyStakingABI,
    address: ldyStakingAddress[chainId as keyof typeof ldyStakingAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ldyStakingABI}__ and `functionName` set to `"acceptOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function useLdyStakingAcceptOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof ldyStakingAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof ldyStakingABI, 'acceptOwnership'>['request']['abi'],
        'acceptOwnership',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'acceptOwnership' }
    : UseContractWriteConfig<typeof ldyStakingABI, 'acceptOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'acceptOwnership'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof ldyStakingABI, 'acceptOwnership', TMode>({
    abi: ldyStakingABI,
    address: ldyStakingAddress[chainId as keyof typeof ldyStakingAddress],
    functionName: 'acceptOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ldyStakingABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function useLdyStakingRenounceOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof ldyStakingAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof ldyStakingABI, 'renounceOwnership'>['request']['abi'],
        'renounceOwnership',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'renounceOwnership' }
    : UseContractWriteConfig<typeof ldyStakingABI, 'renounceOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof ldyStakingABI, 'renounceOwnership', TMode>({
    abi: ldyStakingABI,
    address: ldyStakingAddress[chainId as keyof typeof ldyStakingAddress],
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ldyStakingABI}__ and `functionName` set to `"setHighTierAccount"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function useLdyStakingSetHighTierAccount<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof ldyStakingAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof ldyStakingABI, 'setHighTierAccount'>['request']['abi'],
        'setHighTierAccount',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setHighTierAccount' }
    : UseContractWriteConfig<typeof ldyStakingABI, 'setHighTierAccount', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setHighTierAccount'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof ldyStakingABI, 'setHighTierAccount', TMode>({
    abi: ldyStakingABI,
    address: ldyStakingAddress[chainId as keyof typeof ldyStakingAddress],
    functionName: 'setHighTierAccount',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link ldyStakingABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function useLdyStakingTransferOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof ldyStakingAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof ldyStakingABI, 'transferOwnership'>['request']['abi'],
        'transferOwnership',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'transferOwnership' }
    : UseContractWriteConfig<typeof ldyStakingABI, 'transferOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof ldyStakingABI, 'transferOwnership', TMode>({
    abi: ldyStakingABI,
    address: ldyStakingAddress[chainId as keyof typeof ldyStakingAddress],
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ldyStakingABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function usePrepareLdyStakingWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ldyStakingABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof ldyStakingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: ldyStakingABI,
    address: ldyStakingAddress[chainId as keyof typeof ldyStakingAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof ldyStakingABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ldyStakingABI}__ and `functionName` set to `"acceptOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function usePrepareLdyStakingAcceptOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ldyStakingABI, 'acceptOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof ldyStakingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: ldyStakingABI,
    address: ldyStakingAddress[chainId as keyof typeof ldyStakingAddress],
    functionName: 'acceptOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof ldyStakingABI, 'acceptOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ldyStakingABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function usePrepareLdyStakingRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ldyStakingABI, 'renounceOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof ldyStakingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: ldyStakingABI,
    address: ldyStakingAddress[chainId as keyof typeof ldyStakingAddress],
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof ldyStakingABI, 'renounceOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ldyStakingABI}__ and `functionName` set to `"setHighTierAccount"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function usePrepareLdyStakingSetHighTierAccount(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ldyStakingABI, 'setHighTierAccount'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof ldyStakingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: ldyStakingABI,
    address: ldyStakingAddress[chainId as keyof typeof ldyStakingAddress],
    functionName: 'setHighTierAccount',
    ...config,
  } as UsePrepareContractWriteConfig<typeof ldyStakingABI, 'setHighTierAccount'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link ldyStakingABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function usePrepareLdyStakingTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof ldyStakingABI, 'transferOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof ldyStakingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: ldyStakingABI,
    address: ldyStakingAddress[chainId as keyof typeof ldyStakingAddress],
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof ldyStakingABI, 'transferOwnership'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__.
 */
export function useLTokenRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: lTokenABI, ...config } as UseContractReadConfig<
    typeof lTokenABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"allowance"`.
 */
export function useLTokenAllowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useLTokenBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"decimals"`.
 */
export function useLTokenDecimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"depositFor"`.
 */
export function useLTokenDepositFor<
  TFunctionName extends 'depositFor',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'depositFor',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"feesRateUD7x3"`.
 */
export function useLTokenFeesRateUd7x3<
  TFunctionName extends 'feesRateUD7x3',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'feesRateUD7x3',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"frozenRequests"`.
 */
export function useLTokenFrozenRequests<
  TFunctionName extends 'frozenRequests',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'frozenRequests',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"fund"`.
 */
export function useLTokenFund<
  TFunctionName extends 'fund',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'fund',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"getAPR"`.
 */
export function useLTokenGetApr<
  TFunctionName extends 'getAPR',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'getAPR',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"getExpectedRetained"`.
 */
export function useLTokenGetExpectedRetained<
  TFunctionName extends 'getExpectedRetained',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'getExpectedRetained',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"getWithdrawnAmountAndFees"`.
 */
export function useLTokenGetWithdrawnAmountAndFees<
  TFunctionName extends 'getWithdrawnAmountAndFees',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'getWithdrawnAmountAndFees',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"globalBlacklist"`.
 */
export function useLTokenGlobalBlacklist<
  TFunctionName extends 'globalBlacklist',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'globalBlacklist',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"globalOwner"`.
 */
export function useLTokenGlobalOwner<
  TFunctionName extends 'globalOwner',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'globalOwner',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"globalPause"`.
 */
export function useLTokenGlobalPause<
  TFunctionName extends 'globalPause',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'globalPause',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"invested"`.
 */
export function useLTokenInvested<
  TFunctionName extends 'invested',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'invested',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"ldyStaking"`.
 */
export function useLTokenLdyStaking<
  TFunctionName extends 'ldyStaking',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'ldyStaking',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"name"`.
 */
export function useLTokenName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"owner"`.
 */
export function useLTokenOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"paused"`.
 */
export function useLTokenPaused<
  TFunctionName extends 'paused',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'paused',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"proxiableUUID"`.
 */
export function useLTokenProxiableUuid<
  TFunctionName extends 'proxiableUUID',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"realBalanceOf"`.
 */
export function useLTokenRealBalanceOf<
  TFunctionName extends 'realBalanceOf',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'realBalanceOf',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"realTotalSupply"`.
 */
export function useLTokenRealTotalSupply<
  TFunctionName extends 'realTotalSupply',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'realTotalSupply',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function useLTokenRenounceOwnership<
  TFunctionName extends 'renounceOwnership',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'renounceOwnership',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"retentionRateUD7x3"`.
 */
export function useLTokenRetentionRateUd7x3<
  TFunctionName extends 'retentionRateUD7x3',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'retentionRateUD7x3',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"rewardsRedirectsFromTo"`.
 */
export function useLTokenRewardsRedirectsFromTo<
  TFunctionName extends 'rewardsRedirectsFromTo',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'rewardsRedirectsFromTo',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"rewardsRedirectsToFrom"`.
 */
export function useLTokenRewardsRedirectsToFrom<
  TFunctionName extends 'rewardsRedirectsToFrom',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'rewardsRedirectsToFrom',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"symbol"`.
 */
export function useLTokenSymbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"totalQueued"`.
 */
export function useLTokenTotalQueued<
  TFunctionName extends 'totalQueued',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'totalQueued',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useLTokenTotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useLTokenTransferOwnership<
  TFunctionName extends 'transferOwnership',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'transferOwnership',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"transfersListeners"`.
 */
export function useLTokenTransfersListeners<
  TFunctionName extends 'transfersListeners',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'transfersListeners',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"unclaimedFees"`.
 */
export function useLTokenUnclaimedFees<
  TFunctionName extends 'unclaimedFees',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'unclaimedFees',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"underlying"`.
 */
export function useLTokenUnderlying<
  TFunctionName extends 'underlying',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'underlying',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"unmintedRewardsOf"`.
 */
export function useLTokenUnmintedRewardsOf<
  TFunctionName extends 'unmintedRewardsOf',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'unmintedRewardsOf',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"usableUnderlyings"`.
 */
export function useLTokenUsableUnderlyings<
  TFunctionName extends 'usableUnderlyings',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'usableUnderlyings',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"withdrawTo"`.
 */
export function useLTokenWithdrawTo<
  TFunctionName extends 'withdrawTo',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'withdrawTo',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"withdrawalQueue"`.
 */
export function useLTokenWithdrawalQueue<
  TFunctionName extends 'withdrawalQueue',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'withdrawalQueue',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"withdrawalQueueCursor"`.
 */
export function useLTokenWithdrawalQueueCursor<
  TFunctionName extends 'withdrawalQueueCursor',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'withdrawalQueueCursor',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"withdrawer"`.
 */
export function useLTokenWithdrawer<
  TFunctionName extends 'withdrawer',
  TSelectData = ReadContractResult<typeof lTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: lTokenABI,
    functionName: 'withdrawer',
    ...config,
  } as UseContractReadConfig<typeof lTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__.
 */
export function useLTokenWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof lTokenABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, TFunctionName, TMode>({
    abi: lTokenABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"approve"`.
 */
export function useLTokenApprove<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'approve'>['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof lTokenABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'approve', TMode>({
    abi: lTokenABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"cancelWithdrawalRequest"`.
 */
export function useLTokenCancelWithdrawalRequest<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'cancelWithdrawalRequest'>['request']['abi'],
        'cancelWithdrawalRequest',
        TMode
      > & { functionName?: 'cancelWithdrawalRequest' }
    : UseContractWriteConfig<typeof lTokenABI, 'cancelWithdrawalRequest', TMode> & {
        abi?: never
        functionName?: 'cancelWithdrawalRequest'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'cancelWithdrawalRequest', TMode>({
    abi: lTokenABI,
    functionName: 'cancelWithdrawalRequest',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"claimFees"`.
 */
export function useLTokenClaimFees<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'claimFees'>['request']['abi'],
        'claimFees',
        TMode
      > & { functionName?: 'claimFees' }
    : UseContractWriteConfig<typeof lTokenABI, 'claimFees', TMode> & {
        abi?: never
        functionName?: 'claimFees'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'claimFees', TMode>({
    abi: lTokenABI,
    functionName: 'claimFees',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function useLTokenDecreaseAllowance<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'decreaseAllowance'>['request']['abi'],
        'decreaseAllowance',
        TMode
      > & { functionName?: 'decreaseAllowance' }
    : UseContractWriteConfig<typeof lTokenABI, 'decreaseAllowance', TMode> & {
        abi?: never
        functionName?: 'decreaseAllowance'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'decreaseAllowance', TMode>({
    abi: lTokenABI,
    functionName: 'decreaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"deposit"`.
 */
export function useLTokenDeposit<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'deposit'>['request']['abi'],
        'deposit',
        TMode
      > & { functionName?: 'deposit' }
    : UseContractWriteConfig<typeof lTokenABI, 'deposit', TMode> & {
        abi?: never
        functionName?: 'deposit'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'deposit', TMode>({
    abi: lTokenABI,
    functionName: 'deposit',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function useLTokenIncreaseAllowance<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'increaseAllowance'>['request']['abi'],
        'increaseAllowance',
        TMode
      > & { functionName?: 'increaseAllowance' }
    : UseContractWriteConfig<typeof lTokenABI, 'increaseAllowance', TMode> & {
        abi?: never
        functionName?: 'increaseAllowance'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'increaseAllowance', TMode>({
    abi: lTokenABI,
    functionName: 'increaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"initialize"`.
 */
export function useLTokenInitialize<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'initialize'>['request']['abi'],
        'initialize',
        TMode
      > & { functionName?: 'initialize' }
    : UseContractWriteConfig<typeof lTokenABI, 'initialize', TMode> & {
        abi?: never
        functionName?: 'initialize'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'initialize', TMode>({
    abi: lTokenABI,
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"instantWithdrawal"`.
 */
export function useLTokenInstantWithdrawal<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'instantWithdrawal'>['request']['abi'],
        'instantWithdrawal',
        TMode
      > & { functionName?: 'instantWithdrawal' }
    : UseContractWriteConfig<typeof lTokenABI, 'instantWithdrawal', TMode> & {
        abi?: never
        functionName?: 'instantWithdrawal'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'instantWithdrawal', TMode>({
    abi: lTokenABI,
    functionName: 'instantWithdrawal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"listenToTransfers"`.
 */
export function useLTokenListenToTransfers<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'listenToTransfers'>['request']['abi'],
        'listenToTransfers',
        TMode
      > & { functionName?: 'listenToTransfers' }
    : UseContractWriteConfig<typeof lTokenABI, 'listenToTransfers', TMode> & {
        abi?: never
        functionName?: 'listenToTransfers'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'listenToTransfers', TMode>({
    abi: lTokenABI,
    functionName: 'listenToTransfers',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"processBigQueuedRequest"`.
 */
export function useLTokenProcessBigQueuedRequest<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'processBigQueuedRequest'>['request']['abi'],
        'processBigQueuedRequest',
        TMode
      > & { functionName?: 'processBigQueuedRequest' }
    : UseContractWriteConfig<typeof lTokenABI, 'processBigQueuedRequest', TMode> & {
        abi?: never
        functionName?: 'processBigQueuedRequest'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'processBigQueuedRequest', TMode>({
    abi: lTokenABI,
    functionName: 'processBigQueuedRequest',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"processQueuedRequests"`.
 */
export function useLTokenProcessQueuedRequests<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'processQueuedRequests'>['request']['abi'],
        'processQueuedRequests',
        TMode
      > & { functionName?: 'processQueuedRequests' }
    : UseContractWriteConfig<typeof lTokenABI, 'processQueuedRequests', TMode> & {
        abi?: never
        functionName?: 'processQueuedRequests'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'processQueuedRequests', TMode>({
    abi: lTokenABI,
    functionName: 'processQueuedRequests',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"recoverERC20"`.
 */
export function useLTokenRecoverErc20<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'recoverERC20'>['request']['abi'],
        'recoverERC20',
        TMode
      > & { functionName?: 'recoverERC20' }
    : UseContractWriteConfig<typeof lTokenABI, 'recoverERC20', TMode> & {
        abi?: never
        functionName?: 'recoverERC20'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'recoverERC20', TMode>({
    abi: lTokenABI,
    functionName: 'recoverERC20',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"recoverUnderlying"`.
 */
export function useLTokenRecoverUnderlying<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'recoverUnderlying'>['request']['abi'],
        'recoverUnderlying',
        TMode
      > & { functionName?: 'recoverUnderlying' }
    : UseContractWriteConfig<typeof lTokenABI, 'recoverUnderlying', TMode> & {
        abi?: never
        functionName?: 'recoverUnderlying'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'recoverUnderlying', TMode>({
    abi: lTokenABI,
    functionName: 'recoverUnderlying',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"repatriate"`.
 */
export function useLTokenRepatriate<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'repatriate'>['request']['abi'],
        'repatriate',
        TMode
      > & { functionName?: 'repatriate' }
    : UseContractWriteConfig<typeof lTokenABI, 'repatriate', TMode> & {
        abi?: never
        functionName?: 'repatriate'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'repatriate', TMode>({
    abi: lTokenABI,
    functionName: 'repatriate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"requestWithdrawal"`.
 */
export function useLTokenRequestWithdrawal<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'requestWithdrawal'>['request']['abi'],
        'requestWithdrawal',
        TMode
      > & { functionName?: 'requestWithdrawal' }
    : UseContractWriteConfig<typeof lTokenABI, 'requestWithdrawal', TMode> & {
        abi?: never
        functionName?: 'requestWithdrawal'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'requestWithdrawal', TMode>({
    abi: lTokenABI,
    functionName: 'requestWithdrawal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"setAPR"`.
 */
export function useLTokenSetApr<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'setAPR'>['request']['abi'],
        'setAPR',
        TMode
      > & { functionName?: 'setAPR' }
    : UseContractWriteConfig<typeof lTokenABI, 'setAPR', TMode> & {
        abi?: never
        functionName?: 'setAPR'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'setAPR', TMode>({
    abi: lTokenABI,
    functionName: 'setAPR',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"setFeesRate"`.
 */
export function useLTokenSetFeesRate<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'setFeesRate'>['request']['abi'],
        'setFeesRate',
        TMode
      > & { functionName?: 'setFeesRate' }
    : UseContractWriteConfig<typeof lTokenABI, 'setFeesRate', TMode> & {
        abi?: never
        functionName?: 'setFeesRate'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'setFeesRate', TMode>({
    abi: lTokenABI,
    functionName: 'setFeesRate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"setFund"`.
 */
export function useLTokenSetFund<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'setFund'>['request']['abi'],
        'setFund',
        TMode
      > & { functionName?: 'setFund' }
    : UseContractWriteConfig<typeof lTokenABI, 'setFund', TMode> & {
        abi?: never
        functionName?: 'setFund'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'setFund', TMode>({
    abi: lTokenABI,
    functionName: 'setFund',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"setLDYStaking"`.
 */
export function useLTokenSetLdyStaking<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'setLDYStaking'>['request']['abi'],
        'setLDYStaking',
        TMode
      > & { functionName?: 'setLDYStaking' }
    : UseContractWriteConfig<typeof lTokenABI, 'setLDYStaking', TMode> & {
        abi?: never
        functionName?: 'setLDYStaking'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'setLDYStaking', TMode>({
    abi: lTokenABI,
    functionName: 'setLDYStaking',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"setRetentionRate"`.
 */
export function useLTokenSetRetentionRate<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'setRetentionRate'>['request']['abi'],
        'setRetentionRate',
        TMode
      > & { functionName?: 'setRetentionRate' }
    : UseContractWriteConfig<typeof lTokenABI, 'setRetentionRate', TMode> & {
        abi?: never
        functionName?: 'setRetentionRate'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'setRetentionRate', TMode>({
    abi: lTokenABI,
    functionName: 'setRetentionRate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"setWithdrawer"`.
 */
export function useLTokenSetWithdrawer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'setWithdrawer'>['request']['abi'],
        'setWithdrawer',
        TMode
      > & { functionName?: 'setWithdrawer' }
    : UseContractWriteConfig<typeof lTokenABI, 'setWithdrawer', TMode> & {
        abi?: never
        functionName?: 'setWithdrawer'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'setWithdrawer', TMode>({
    abi: lTokenABI,
    functionName: 'setWithdrawer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"startRewardsRedirection"`.
 */
export function useLTokenStartRewardsRedirection<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'startRewardsRedirection'>['request']['abi'],
        'startRewardsRedirection',
        TMode
      > & { functionName?: 'startRewardsRedirection' }
    : UseContractWriteConfig<typeof lTokenABI, 'startRewardsRedirection', TMode> & {
        abi?: never
        functionName?: 'startRewardsRedirection'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'startRewardsRedirection', TMode>({
    abi: lTokenABI,
    functionName: 'startRewardsRedirection',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"stopRewardsRedirection"`.
 */
export function useLTokenStopRewardsRedirection<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'stopRewardsRedirection'>['request']['abi'],
        'stopRewardsRedirection',
        TMode
      > & { functionName?: 'stopRewardsRedirection' }
    : UseContractWriteConfig<typeof lTokenABI, 'stopRewardsRedirection', TMode> & {
        abi?: never
        functionName?: 'stopRewardsRedirection'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'stopRewardsRedirection', TMode>({
    abi: lTokenABI,
    functionName: 'stopRewardsRedirection',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"transfer"`.
 */
export function useLTokenTransfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'transfer'>['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<typeof lTokenABI, 'transfer', TMode> & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'transfer', TMode>({
    abi: lTokenABI,
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useLTokenTransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'transferFrom'>['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof lTokenABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'transferFrom', TMode>({
    abi: lTokenABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"unlistenToTransfers"`.
 */
export function useLTokenUnlistenToTransfers<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'unlistenToTransfers'>['request']['abi'],
        'unlistenToTransfers',
        TMode
      > & { functionName?: 'unlistenToTransfers' }
    : UseContractWriteConfig<typeof lTokenABI, 'unlistenToTransfers', TMode> & {
        abi?: never
        functionName?: 'unlistenToTransfers'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'unlistenToTransfers', TMode>({
    abi: lTokenABI,
    functionName: 'unlistenToTransfers',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"upgradeTo"`.
 */
export function useLTokenUpgradeTo<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'upgradeTo'>['request']['abi'],
        'upgradeTo',
        TMode
      > & { functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof lTokenABI, 'upgradeTo', TMode> & {
        abi?: never
        functionName?: 'upgradeTo'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'upgradeTo', TMode>({
    abi: lTokenABI,
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"upgradeToAndCall"`.
 */
export function useLTokenUpgradeToAndCall<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenABI, 'upgradeToAndCall'>['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & { functionName?: 'upgradeToAndCall' }
    : UseContractWriteConfig<typeof lTokenABI, 'upgradeToAndCall', TMode> & {
        abi?: never
        functionName?: 'upgradeToAndCall'
      } = {} as any,
) {
  return useContractWrite<typeof lTokenABI, 'upgradeToAndCall', TMode>({
    abi: lTokenABI,
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__.
 */
export function usePrepareLTokenWrite<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof lTokenABI, TFunctionName>, 'abi'> = {} as any,
) {
  return usePrepareContractWrite({ abi: lTokenABI, ...config } as UsePrepareContractWriteConfig<
    typeof lTokenABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareLTokenApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"cancelWithdrawalRequest"`.
 */
export function usePrepareLTokenCancelWithdrawalRequest(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'cancelWithdrawalRequest'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'cancelWithdrawalRequest',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'cancelWithdrawalRequest'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"claimFees"`.
 */
export function usePrepareLTokenClaimFees(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'claimFees'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'claimFees',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'claimFees'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function usePrepareLTokenDecreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'decreaseAllowance'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'decreaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'decreaseAllowance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"deposit"`.
 */
export function usePrepareLTokenDeposit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'deposit'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'deposit',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'deposit'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function usePrepareLTokenIncreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'increaseAllowance'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'increaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'increaseAllowance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"initialize"`.
 */
export function usePrepareLTokenInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'initialize'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"instantWithdrawal"`.
 */
export function usePrepareLTokenInstantWithdrawal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'instantWithdrawal'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'instantWithdrawal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'instantWithdrawal'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"listenToTransfers"`.
 */
export function usePrepareLTokenListenToTransfers(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'listenToTransfers'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'listenToTransfers',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'listenToTransfers'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"processBigQueuedRequest"`.
 */
export function usePrepareLTokenProcessBigQueuedRequest(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'processBigQueuedRequest'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'processBigQueuedRequest',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'processBigQueuedRequest'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"processQueuedRequests"`.
 */
export function usePrepareLTokenProcessQueuedRequests(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'processQueuedRequests'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'processQueuedRequests',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'processQueuedRequests'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"recoverERC20"`.
 */
export function usePrepareLTokenRecoverErc20(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'recoverERC20'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'recoverERC20',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'recoverERC20'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"recoverUnderlying"`.
 */
export function usePrepareLTokenRecoverUnderlying(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'recoverUnderlying'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'recoverUnderlying',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'recoverUnderlying'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"repatriate"`.
 */
export function usePrepareLTokenRepatriate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'repatriate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'repatriate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'repatriate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"requestWithdrawal"`.
 */
export function usePrepareLTokenRequestWithdrawal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'requestWithdrawal'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'requestWithdrawal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'requestWithdrawal'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"setAPR"`.
 */
export function usePrepareLTokenSetApr(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'setAPR'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'setAPR',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'setAPR'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"setFeesRate"`.
 */
export function usePrepareLTokenSetFeesRate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'setFeesRate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'setFeesRate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'setFeesRate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"setFund"`.
 */
export function usePrepareLTokenSetFund(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'setFund'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'setFund',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'setFund'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"setLDYStaking"`.
 */
export function usePrepareLTokenSetLdyStaking(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'setLDYStaking'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'setLDYStaking',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'setLDYStaking'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"setRetentionRate"`.
 */
export function usePrepareLTokenSetRetentionRate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'setRetentionRate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'setRetentionRate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'setRetentionRate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"setWithdrawer"`.
 */
export function usePrepareLTokenSetWithdrawer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'setWithdrawer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'setWithdrawer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'setWithdrawer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"startRewardsRedirection"`.
 */
export function usePrepareLTokenStartRewardsRedirection(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'startRewardsRedirection'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'startRewardsRedirection',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'startRewardsRedirection'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"stopRewardsRedirection"`.
 */
export function usePrepareLTokenStopRewardsRedirection(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'stopRewardsRedirection'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'stopRewardsRedirection',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'stopRewardsRedirection'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareLTokenTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'transfer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareLTokenTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'transferFrom'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'transferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"unlistenToTransfers"`.
 */
export function usePrepareLTokenUnlistenToTransfers(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'unlistenToTransfers'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'unlistenToTransfers',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'unlistenToTransfers'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"upgradeTo"`.
 */
export function usePrepareLTokenUpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'upgradeTo'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenABI}__ and `functionName` set to `"upgradeToAndCall"`.
 */
export function usePrepareLTokenUpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenABI, 'upgradeToAndCall'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: lTokenABI,
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenABI, 'upgradeToAndCall'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenSignalerABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function useLTokenSignalerRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof lTokenSignalerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenSignalerABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof lTokenSignalerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    ...config,
  } as UseContractReadConfig<typeof lTokenSignalerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenSignalerABI}__ and `functionName` set to `"globalOwner"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function useLTokenSignalerGlobalOwner<
  TFunctionName extends 'globalOwner',
  TSelectData = ReadContractResult<typeof lTokenSignalerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenSignalerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof lTokenSignalerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    functionName: 'globalOwner',
    ...config,
  } as UseContractReadConfig<typeof lTokenSignalerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenSignalerABI}__ and `functionName` set to `"owner"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function useLTokenSignalerOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof lTokenSignalerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenSignalerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof lTokenSignalerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof lTokenSignalerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenSignalerABI}__ and `functionName` set to `"proxiableUUID"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function useLTokenSignalerProxiableUuid<
  TFunctionName extends 'proxiableUUID',
  TSelectData = ReadContractResult<typeof lTokenSignalerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenSignalerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof lTokenSignalerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<typeof lTokenSignalerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenSignalerABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function useLTokenSignalerRenounceOwnership<
  TFunctionName extends 'renounceOwnership',
  TSelectData = ReadContractResult<typeof lTokenSignalerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenSignalerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof lTokenSignalerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    functionName: 'renounceOwnership',
    ...config,
  } as UseContractReadConfig<typeof lTokenSignalerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link lTokenSignalerABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function useLTokenSignalerTransferOwnership<
  TFunctionName extends 'transferOwnership',
  TSelectData = ReadContractResult<typeof lTokenSignalerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof lTokenSignalerABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof lTokenSignalerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    functionName: 'transferOwnership',
    ...config,
  } as UseContractReadConfig<typeof lTokenSignalerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenSignalerABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function useLTokenSignalerWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof lTokenSignalerAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenSignalerABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof lTokenSignalerABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof lTokenSignalerABI, TFunctionName, TMode>({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenSignalerABI}__ and `functionName` set to `"initialize"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function useLTokenSignalerInitialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof lTokenSignalerAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenSignalerABI, 'initialize'>['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
    : UseContractWriteConfig<typeof lTokenSignalerABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof lTokenSignalerABI, 'initialize', TMode>({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenSignalerABI}__ and `functionName` set to `"signalLToken"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function useLTokenSignalerSignalLToken<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof lTokenSignalerAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenSignalerABI, 'signalLToken'>['request']['abi'],
        'signalLToken',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'signalLToken' }
    : UseContractWriteConfig<typeof lTokenSignalerABI, 'signalLToken', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'signalLToken'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof lTokenSignalerABI, 'signalLToken', TMode>({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    functionName: 'signalLToken',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenSignalerABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function useLTokenSignalerUpgradeTo<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof lTokenSignalerAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenSignalerABI, 'upgradeTo'>['request']['abi'],
        'upgradeTo',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof lTokenSignalerABI, 'upgradeTo', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeTo'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof lTokenSignalerABI, 'upgradeTo', TMode>({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link lTokenSignalerABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function useLTokenSignalerUpgradeToAndCall<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof lTokenSignalerAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof lTokenSignalerABI, 'upgradeToAndCall'>['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeToAndCall' }
    : UseContractWriteConfig<typeof lTokenSignalerABI, 'upgradeToAndCall', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeToAndCall'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof lTokenSignalerABI, 'upgradeToAndCall', TMode>({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenSignalerABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function usePrepareLTokenSignalerWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenSignalerABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof lTokenSignalerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenSignalerABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenSignalerABI}__ and `functionName` set to `"initialize"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function usePrepareLTokenSignalerInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenSignalerABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof lTokenSignalerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenSignalerABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenSignalerABI}__ and `functionName` set to `"signalLToken"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function usePrepareLTokenSignalerSignalLToken(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenSignalerABI, 'signalLToken'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof lTokenSignalerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    functionName: 'signalLToken',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenSignalerABI, 'signalLToken'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenSignalerABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function usePrepareLTokenSignalerUpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenSignalerABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof lTokenSignalerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenSignalerABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link lTokenSignalerABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function usePrepareLTokenSignalerUpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof lTokenSignalerABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof lTokenSignalerAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[chainId as keyof typeof lTokenSignalerAddress],
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof lTokenSignalerABI, 'upgradeToAndCall'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multicall3ABI}__.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof multicall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    ...config,
  } as UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"getBasefee"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3GetBasefee<
  TFunctionName extends 'getBasefee',
  TSelectData = ReadContractResult<typeof multicall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'getBasefee',
    ...config,
  } as UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"getBlockHash"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3GetBlockHash<
  TFunctionName extends 'getBlockHash',
  TSelectData = ReadContractResult<typeof multicall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'getBlockHash',
    ...config,
  } as UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"getBlockNumber"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3GetBlockNumber<
  TFunctionName extends 'getBlockNumber',
  TSelectData = ReadContractResult<typeof multicall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'getBlockNumber',
    ...config,
  } as UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"getChainId"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3GetChainId<
  TFunctionName extends 'getChainId',
  TSelectData = ReadContractResult<typeof multicall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'getChainId',
    ...config,
  } as UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"getCurrentBlockCoinbase"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3GetCurrentBlockCoinbase<
  TFunctionName extends 'getCurrentBlockCoinbase',
  TSelectData = ReadContractResult<typeof multicall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'getCurrentBlockCoinbase',
    ...config,
  } as UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"getCurrentBlockDifficulty"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3GetCurrentBlockDifficulty<
  TFunctionName extends 'getCurrentBlockDifficulty',
  TSelectData = ReadContractResult<typeof multicall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'getCurrentBlockDifficulty',
    ...config,
  } as UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"getCurrentBlockGasLimit"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3GetCurrentBlockGasLimit<
  TFunctionName extends 'getCurrentBlockGasLimit',
  TSelectData = ReadContractResult<typeof multicall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'getCurrentBlockGasLimit',
    ...config,
  } as UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"getCurrentBlockTimestamp"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3GetCurrentBlockTimestamp<
  TFunctionName extends 'getCurrentBlockTimestamp',
  TSelectData = ReadContractResult<typeof multicall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'getCurrentBlockTimestamp',
    ...config,
  } as UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"getEthBalance"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3GetEthBalance<
  TFunctionName extends 'getEthBalance',
  TSelectData = ReadContractResult<typeof multicall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'getEthBalance',
    ...config,
  } as UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"getLastBlockHash"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3GetLastBlockHash<
  TFunctionName extends 'getLastBlockHash',
  TSelectData = ReadContractResult<typeof multicall3ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'getLastBlockHash',
    ...config,
  } as UseContractReadConfig<typeof multicall3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multicall3ABI}__.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof multicall3Address,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof multicall3ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof multicall3ABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof multicall3ABI, TFunctionName, TMode>({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"aggregate"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3Aggregate<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof multicall3Address,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof multicall3ABI, 'aggregate'>['request']['abi'],
        'aggregate',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'aggregate' }
    : UseContractWriteConfig<typeof multicall3ABI, 'aggregate', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'aggregate'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof multicall3ABI, 'aggregate', TMode>({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'aggregate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"aggregate3"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3Aggregate3<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof multicall3Address,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof multicall3ABI, 'aggregate3'>['request']['abi'],
        'aggregate3',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'aggregate3' }
    : UseContractWriteConfig<typeof multicall3ABI, 'aggregate3', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'aggregate3'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof multicall3ABI, 'aggregate3', TMode>({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'aggregate3',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"aggregate3Value"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3Aggregate3Value<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof multicall3Address,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof multicall3ABI, 'aggregate3Value'>['request']['abi'],
        'aggregate3Value',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'aggregate3Value' }
    : UseContractWriteConfig<typeof multicall3ABI, 'aggregate3Value', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'aggregate3Value'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof multicall3ABI, 'aggregate3Value', TMode>({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'aggregate3Value',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"blockAndAggregate"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3BlockAndAggregate<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof multicall3Address,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof multicall3ABI, 'blockAndAggregate'>['request']['abi'],
        'blockAndAggregate',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'blockAndAggregate' }
    : UseContractWriteConfig<typeof multicall3ABI, 'blockAndAggregate', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'blockAndAggregate'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof multicall3ABI, 'blockAndAggregate', TMode>({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'blockAndAggregate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"tryAggregate"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3TryAggregate<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof multicall3Address,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof multicall3ABI, 'tryAggregate'>['request']['abi'],
        'tryAggregate',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'tryAggregate' }
    : UseContractWriteConfig<typeof multicall3ABI, 'tryAggregate', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'tryAggregate'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof multicall3ABI, 'tryAggregate', TMode>({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'tryAggregate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"tryBlockAndAggregate"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function useMulticall3TryBlockAndAggregate<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof multicall3Address,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof multicall3ABI, 'tryBlockAndAggregate'>['request']['abi'],
        'tryBlockAndAggregate',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'tryBlockAndAggregate' }
    : UseContractWriteConfig<typeof multicall3ABI, 'tryBlockAndAggregate', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'tryBlockAndAggregate'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof multicall3ABI, 'tryBlockAndAggregate', TMode>({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'tryBlockAndAggregate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multicall3ABI}__.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function usePrepareMulticall3Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof multicall3ABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    ...config,
  } as UsePrepareContractWriteConfig<typeof multicall3ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"aggregate"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function usePrepareMulticall3Aggregate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof multicall3ABI, 'aggregate'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'aggregate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof multicall3ABI, 'aggregate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"aggregate3"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function usePrepareMulticall3Aggregate3(
  config: Omit<
    UsePrepareContractWriteConfig<typeof multicall3ABI, 'aggregate3'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'aggregate3',
    ...config,
  } as UsePrepareContractWriteConfig<typeof multicall3ABI, 'aggregate3'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"aggregate3Value"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function usePrepareMulticall3Aggregate3Value(
  config: Omit<
    UsePrepareContractWriteConfig<typeof multicall3ABI, 'aggregate3Value'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'aggregate3Value',
    ...config,
  } as UsePrepareContractWriteConfig<typeof multicall3ABI, 'aggregate3Value'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"blockAndAggregate"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function usePrepareMulticall3BlockAndAggregate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof multicall3ABI, 'blockAndAggregate'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'blockAndAggregate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof multicall3ABI, 'blockAndAggregate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"tryAggregate"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function usePrepareMulticall3TryAggregate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof multicall3ABI, 'tryAggregate'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'tryAggregate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof multicall3ABI, 'tryAggregate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multicall3ABI}__ and `functionName` set to `"tryBlockAndAggregate"`.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function usePrepareMulticall3TryBlockAndAggregate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof multicall3ABI, 'tryBlockAndAggregate'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof multicall3Address } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: multicall3ABI,
    address: multicall3Address[chainId as keyof typeof multicall3Address],
    functionName: 'tryBlockAndAggregate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof multicall3ABI, 'tryBlockAndAggregate'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__.
 */
export function useOldLToken1Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: oldLToken1ABI, ...config } as UseContractReadConfig<
    typeof oldLToken1ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"allowance"`.
 */
export function useOldLToken1Allowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useOldLToken1BalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"decimals"`.
 */
export function useOldLToken1Decimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"depositFor"`.
 */
export function useOldLToken1DepositFor<
  TFunctionName extends 'depositFor',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'depositFor',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"feesRateUD7x3"`.
 */
export function useOldLToken1FeesRateUd7x3<
  TFunctionName extends 'feesRateUD7x3',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'feesRateUD7x3',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"frozenRequests"`.
 */
export function useOldLToken1FrozenRequests<
  TFunctionName extends 'frozenRequests',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'frozenRequests',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"fund"`.
 */
export function useOldLToken1Fund<
  TFunctionName extends 'fund',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'fund',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"getAPR"`.
 */
export function useOldLToken1GetApr<
  TFunctionName extends 'getAPR',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'getAPR',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"getExpectedRetained"`.
 */
export function useOldLToken1GetExpectedRetained<
  TFunctionName extends 'getExpectedRetained',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'getExpectedRetained',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"getWithdrawnAmountAndFees"`.
 */
export function useOldLToken1GetWithdrawnAmountAndFees<
  TFunctionName extends 'getWithdrawnAmountAndFees',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'getWithdrawnAmountAndFees',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"globalBlacklist"`.
 */
export function useOldLToken1GlobalBlacklist<
  TFunctionName extends 'globalBlacklist',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'globalBlacklist',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"globalOwner"`.
 */
export function useOldLToken1GlobalOwner<
  TFunctionName extends 'globalOwner',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'globalOwner',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"globalPause"`.
 */
export function useOldLToken1GlobalPause<
  TFunctionName extends 'globalPause',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'globalPause',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"invested"`.
 */
export function useOldLToken1Invested<
  TFunctionName extends 'invested',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'invested',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"ldyStaking"`.
 */
export function useOldLToken1LdyStaking<
  TFunctionName extends 'ldyStaking',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'ldyStaking',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"name"`.
 */
export function useOldLToken1Name<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"owner"`.
 */
export function useOldLToken1Owner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"paused"`.
 */
export function useOldLToken1Paused<
  TFunctionName extends 'paused',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'paused',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"proxiableUUID"`.
 */
export function useOldLToken1ProxiableUuid<
  TFunctionName extends 'proxiableUUID',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"realBalanceOf"`.
 */
export function useOldLToken1RealBalanceOf<
  TFunctionName extends 'realBalanceOf',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'realBalanceOf',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"realTotalSupply"`.
 */
export function useOldLToken1RealTotalSupply<
  TFunctionName extends 'realTotalSupply',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'realTotalSupply',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function useOldLToken1RenounceOwnership<
  TFunctionName extends 'renounceOwnership',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'renounceOwnership',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"retentionRateUD7x3"`.
 */
export function useOldLToken1RetentionRateUd7x3<
  TFunctionName extends 'retentionRateUD7x3',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'retentionRateUD7x3',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"rewardsRedirectsFromTo"`.
 */
export function useOldLToken1RewardsRedirectsFromTo<
  TFunctionName extends 'rewardsRedirectsFromTo',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'rewardsRedirectsFromTo',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"rewardsRedirectsToFrom"`.
 */
export function useOldLToken1RewardsRedirectsToFrom<
  TFunctionName extends 'rewardsRedirectsToFrom',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'rewardsRedirectsToFrom',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"symbol"`.
 */
export function useOldLToken1Symbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"totalQueued"`.
 */
export function useOldLToken1TotalQueued<
  TFunctionName extends 'totalQueued',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'totalQueued',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useOldLToken1TotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useOldLToken1TransferOwnership<
  TFunctionName extends 'transferOwnership',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'transferOwnership',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"transfersListeners"`.
 */
export function useOldLToken1TransfersListeners<
  TFunctionName extends 'transfersListeners',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'transfersListeners',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"unclaimedFees"`.
 */
export function useOldLToken1UnclaimedFees<
  TFunctionName extends 'unclaimedFees',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'unclaimedFees',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"underlying"`.
 */
export function useOldLToken1Underlying<
  TFunctionName extends 'underlying',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'underlying',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"unmintedRewardsOf"`.
 */
export function useOldLToken1UnmintedRewardsOf<
  TFunctionName extends 'unmintedRewardsOf',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'unmintedRewardsOf',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"usableUnderlyings"`.
 */
export function useOldLToken1UsableUnderlyings<
  TFunctionName extends 'usableUnderlyings',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'usableUnderlyings',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"withdrawTo"`.
 */
export function useOldLToken1WithdrawTo<
  TFunctionName extends 'withdrawTo',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'withdrawTo',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"withdrawalQueue"`.
 */
export function useOldLToken1WithdrawalQueue<
  TFunctionName extends 'withdrawalQueue',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'withdrawalQueue',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"withdrawalQueueCursor"`.
 */
export function useOldLToken1WithdrawalQueueCursor<
  TFunctionName extends 'withdrawalQueueCursor',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'withdrawalQueueCursor',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"withdrawer"`.
 */
export function useOldLToken1Withdrawer<
  TFunctionName extends 'withdrawer',
  TSelectData = ReadContractResult<typeof oldLToken1ABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: oldLToken1ABI,
    functionName: 'withdrawer',
    ...config,
  } as UseContractReadConfig<typeof oldLToken1ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__.
 */
export function useOldLToken1Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof oldLToken1ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, TFunctionName, TMode>({
    abi: oldLToken1ABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"approve"`.
 */
export function useOldLToken1Approve<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'approve'>['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'approve', TMode>({
    abi: oldLToken1ABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"cancelWithdrawalRequest"`.
 */
export function useOldLToken1CancelWithdrawalRequest<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof oldLToken1ABI,
          'cancelWithdrawalRequest'
        >['request']['abi'],
        'cancelWithdrawalRequest',
        TMode
      > & { functionName?: 'cancelWithdrawalRequest' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'cancelWithdrawalRequest', TMode> & {
        abi?: never
        functionName?: 'cancelWithdrawalRequest'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'cancelWithdrawalRequest', TMode>({
    abi: oldLToken1ABI,
    functionName: 'cancelWithdrawalRequest',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"claimFees"`.
 */
export function useOldLToken1ClaimFees<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'claimFees'>['request']['abi'],
        'claimFees',
        TMode
      > & { functionName?: 'claimFees' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'claimFees', TMode> & {
        abi?: never
        functionName?: 'claimFees'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'claimFees', TMode>({
    abi: oldLToken1ABI,
    functionName: 'claimFees',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function useOldLToken1DecreaseAllowance<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'decreaseAllowance'>['request']['abi'],
        'decreaseAllowance',
        TMode
      > & { functionName?: 'decreaseAllowance' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'decreaseAllowance', TMode> & {
        abi?: never
        functionName?: 'decreaseAllowance'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'decreaseAllowance', TMode>({
    abi: oldLToken1ABI,
    functionName: 'decreaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"deposit"`.
 */
export function useOldLToken1Deposit<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'deposit'>['request']['abi'],
        'deposit',
        TMode
      > & { functionName?: 'deposit' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'deposit', TMode> & {
        abi?: never
        functionName?: 'deposit'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'deposit', TMode>({
    abi: oldLToken1ABI,
    functionName: 'deposit',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function useOldLToken1IncreaseAllowance<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'increaseAllowance'>['request']['abi'],
        'increaseAllowance',
        TMode
      > & { functionName?: 'increaseAllowance' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'increaseAllowance', TMode> & {
        abi?: never
        functionName?: 'increaseAllowance'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'increaseAllowance', TMode>({
    abi: oldLToken1ABI,
    functionName: 'increaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"initialize"`.
 */
export function useOldLToken1Initialize<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'initialize'>['request']['abi'],
        'initialize',
        TMode
      > & { functionName?: 'initialize' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'initialize', TMode> & {
        abi?: never
        functionName?: 'initialize'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'initialize', TMode>({
    abi: oldLToken1ABI,
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"instantWithdrawal"`.
 */
export function useOldLToken1InstantWithdrawal<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'instantWithdrawal'>['request']['abi'],
        'instantWithdrawal',
        TMode
      > & { functionName?: 'instantWithdrawal' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'instantWithdrawal', TMode> & {
        abi?: never
        functionName?: 'instantWithdrawal'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'instantWithdrawal', TMode>({
    abi: oldLToken1ABI,
    functionName: 'instantWithdrawal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"listenToTransfers"`.
 */
export function useOldLToken1ListenToTransfers<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'listenToTransfers'>['request']['abi'],
        'listenToTransfers',
        TMode
      > & { functionName?: 'listenToTransfers' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'listenToTransfers', TMode> & {
        abi?: never
        functionName?: 'listenToTransfers'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'listenToTransfers', TMode>({
    abi: oldLToken1ABI,
    functionName: 'listenToTransfers',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"processBigQueuedRequest"`.
 */
export function useOldLToken1ProcessBigQueuedRequest<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof oldLToken1ABI,
          'processBigQueuedRequest'
        >['request']['abi'],
        'processBigQueuedRequest',
        TMode
      > & { functionName?: 'processBigQueuedRequest' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'processBigQueuedRequest', TMode> & {
        abi?: never
        functionName?: 'processBigQueuedRequest'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'processBigQueuedRequest', TMode>({
    abi: oldLToken1ABI,
    functionName: 'processBigQueuedRequest',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"processQueuedRequests"`.
 */
export function useOldLToken1ProcessQueuedRequests<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'processQueuedRequests'>['request']['abi'],
        'processQueuedRequests',
        TMode
      > & { functionName?: 'processQueuedRequests' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'processQueuedRequests', TMode> & {
        abi?: never
        functionName?: 'processQueuedRequests'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'processQueuedRequests', TMode>({
    abi: oldLToken1ABI,
    functionName: 'processQueuedRequests',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"recoverERC20"`.
 */
export function useOldLToken1RecoverErc20<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'recoverERC20'>['request']['abi'],
        'recoverERC20',
        TMode
      > & { functionName?: 'recoverERC20' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'recoverERC20', TMode> & {
        abi?: never
        functionName?: 'recoverERC20'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'recoverERC20', TMode>({
    abi: oldLToken1ABI,
    functionName: 'recoverERC20',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"recoverUnderlying"`.
 */
export function useOldLToken1RecoverUnderlying<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'recoverUnderlying'>['request']['abi'],
        'recoverUnderlying',
        TMode
      > & { functionName?: 'recoverUnderlying' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'recoverUnderlying', TMode> & {
        abi?: never
        functionName?: 'recoverUnderlying'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'recoverUnderlying', TMode>({
    abi: oldLToken1ABI,
    functionName: 'recoverUnderlying',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"repatriate"`.
 */
export function useOldLToken1Repatriate<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'repatriate'>['request']['abi'],
        'repatriate',
        TMode
      > & { functionName?: 'repatriate' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'repatriate', TMode> & {
        abi?: never
        functionName?: 'repatriate'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'repatriate', TMode>({
    abi: oldLToken1ABI,
    functionName: 'repatriate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"requestWithdrawal"`.
 */
export function useOldLToken1RequestWithdrawal<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'requestWithdrawal'>['request']['abi'],
        'requestWithdrawal',
        TMode
      > & { functionName?: 'requestWithdrawal' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'requestWithdrawal', TMode> & {
        abi?: never
        functionName?: 'requestWithdrawal'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'requestWithdrawal', TMode>({
    abi: oldLToken1ABI,
    functionName: 'requestWithdrawal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"setAPR"`.
 */
export function useOldLToken1SetApr<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'setAPR'>['request']['abi'],
        'setAPR',
        TMode
      > & { functionName?: 'setAPR' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'setAPR', TMode> & {
        abi?: never
        functionName?: 'setAPR'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'setAPR', TMode>({
    abi: oldLToken1ABI,
    functionName: 'setAPR',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"setFeesRate"`.
 */
export function useOldLToken1SetFeesRate<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'setFeesRate'>['request']['abi'],
        'setFeesRate',
        TMode
      > & { functionName?: 'setFeesRate' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'setFeesRate', TMode> & {
        abi?: never
        functionName?: 'setFeesRate'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'setFeesRate', TMode>({
    abi: oldLToken1ABI,
    functionName: 'setFeesRate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"setFund"`.
 */
export function useOldLToken1SetFund<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'setFund'>['request']['abi'],
        'setFund',
        TMode
      > & { functionName?: 'setFund' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'setFund', TMode> & {
        abi?: never
        functionName?: 'setFund'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'setFund', TMode>({
    abi: oldLToken1ABI,
    functionName: 'setFund',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"setLDYStaking"`.
 */
export function useOldLToken1SetLdyStaking<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'setLDYStaking'>['request']['abi'],
        'setLDYStaking',
        TMode
      > & { functionName?: 'setLDYStaking' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'setLDYStaking', TMode> & {
        abi?: never
        functionName?: 'setLDYStaking'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'setLDYStaking', TMode>({
    abi: oldLToken1ABI,
    functionName: 'setLDYStaking',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"setRetentionRate"`.
 */
export function useOldLToken1SetRetentionRate<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'setRetentionRate'>['request']['abi'],
        'setRetentionRate',
        TMode
      > & { functionName?: 'setRetentionRate' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'setRetentionRate', TMode> & {
        abi?: never
        functionName?: 'setRetentionRate'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'setRetentionRate', TMode>({
    abi: oldLToken1ABI,
    functionName: 'setRetentionRate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"setWithdrawer"`.
 */
export function useOldLToken1SetWithdrawer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'setWithdrawer'>['request']['abi'],
        'setWithdrawer',
        TMode
      > & { functionName?: 'setWithdrawer' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'setWithdrawer', TMode> & {
        abi?: never
        functionName?: 'setWithdrawer'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'setWithdrawer', TMode>({
    abi: oldLToken1ABI,
    functionName: 'setWithdrawer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"startRewardsRedirection"`.
 */
export function useOldLToken1StartRewardsRedirection<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof oldLToken1ABI,
          'startRewardsRedirection'
        >['request']['abi'],
        'startRewardsRedirection',
        TMode
      > & { functionName?: 'startRewardsRedirection' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'startRewardsRedirection', TMode> & {
        abi?: never
        functionName?: 'startRewardsRedirection'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'startRewardsRedirection', TMode>({
    abi: oldLToken1ABI,
    functionName: 'startRewardsRedirection',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"stopRewardsRedirection"`.
 */
export function useOldLToken1StopRewardsRedirection<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof oldLToken1ABI,
          'stopRewardsRedirection'
        >['request']['abi'],
        'stopRewardsRedirection',
        TMode
      > & { functionName?: 'stopRewardsRedirection' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'stopRewardsRedirection', TMode> & {
        abi?: never
        functionName?: 'stopRewardsRedirection'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'stopRewardsRedirection', TMode>({
    abi: oldLToken1ABI,
    functionName: 'stopRewardsRedirection',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"transfer"`.
 */
export function useOldLToken1Transfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'transfer'>['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'transfer', TMode> & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'transfer', TMode>({
    abi: oldLToken1ABI,
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useOldLToken1TransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'transferFrom'>['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'transferFrom', TMode>({
    abi: oldLToken1ABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"unlistenToTransfers"`.
 */
export function useOldLToken1UnlistenToTransfers<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'unlistenToTransfers'>['request']['abi'],
        'unlistenToTransfers',
        TMode
      > & { functionName?: 'unlistenToTransfers' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'unlistenToTransfers', TMode> & {
        abi?: never
        functionName?: 'unlistenToTransfers'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'unlistenToTransfers', TMode>({
    abi: oldLToken1ABI,
    functionName: 'unlistenToTransfers',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"upgradeTo"`.
 */
export function useOldLToken1UpgradeTo<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'upgradeTo'>['request']['abi'],
        'upgradeTo',
        TMode
      > & { functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'upgradeTo', TMode> & {
        abi?: never
        functionName?: 'upgradeTo'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'upgradeTo', TMode>({
    abi: oldLToken1ABI,
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"upgradeToAndCall"`.
 */
export function useOldLToken1UpgradeToAndCall<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof oldLToken1ABI, 'upgradeToAndCall'>['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & { functionName?: 'upgradeToAndCall' }
    : UseContractWriteConfig<typeof oldLToken1ABI, 'upgradeToAndCall', TMode> & {
        abi?: never
        functionName?: 'upgradeToAndCall'
      } = {} as any,
) {
  return useContractWrite<typeof oldLToken1ABI, 'upgradeToAndCall', TMode>({
    abi: oldLToken1ABI,
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__.
 */
export function usePrepareOldLToken1Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({ abi: oldLToken1ABI, ...config } as UsePrepareContractWriteConfig<
    typeof oldLToken1ABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareOldLToken1Approve(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"cancelWithdrawalRequest"`.
 */
export function usePrepareOldLToken1CancelWithdrawalRequest(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'cancelWithdrawalRequest'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'cancelWithdrawalRequest',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'cancelWithdrawalRequest'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"claimFees"`.
 */
export function usePrepareOldLToken1ClaimFees(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'claimFees'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'claimFees',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'claimFees'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function usePrepareOldLToken1DecreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'decreaseAllowance'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'decreaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'decreaseAllowance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"deposit"`.
 */
export function usePrepareOldLToken1Deposit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'deposit'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'deposit',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'deposit'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function usePrepareOldLToken1IncreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'increaseAllowance'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'increaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'increaseAllowance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"initialize"`.
 */
export function usePrepareOldLToken1Initialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'initialize'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"instantWithdrawal"`.
 */
export function usePrepareOldLToken1InstantWithdrawal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'instantWithdrawal'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'instantWithdrawal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'instantWithdrawal'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"listenToTransfers"`.
 */
export function usePrepareOldLToken1ListenToTransfers(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'listenToTransfers'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'listenToTransfers',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'listenToTransfers'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"processBigQueuedRequest"`.
 */
export function usePrepareOldLToken1ProcessBigQueuedRequest(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'processBigQueuedRequest'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'processBigQueuedRequest',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'processBigQueuedRequest'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"processQueuedRequests"`.
 */
export function usePrepareOldLToken1ProcessQueuedRequests(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'processQueuedRequests'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'processQueuedRequests',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'processQueuedRequests'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"recoverERC20"`.
 */
export function usePrepareOldLToken1RecoverErc20(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'recoverERC20'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'recoverERC20',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'recoverERC20'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"recoverUnderlying"`.
 */
export function usePrepareOldLToken1RecoverUnderlying(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'recoverUnderlying'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'recoverUnderlying',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'recoverUnderlying'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"repatriate"`.
 */
export function usePrepareOldLToken1Repatriate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'repatriate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'repatriate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'repatriate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"requestWithdrawal"`.
 */
export function usePrepareOldLToken1RequestWithdrawal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'requestWithdrawal'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'requestWithdrawal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'requestWithdrawal'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"setAPR"`.
 */
export function usePrepareOldLToken1SetApr(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'setAPR'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'setAPR',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'setAPR'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"setFeesRate"`.
 */
export function usePrepareOldLToken1SetFeesRate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'setFeesRate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'setFeesRate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'setFeesRate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"setFund"`.
 */
export function usePrepareOldLToken1SetFund(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'setFund'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'setFund',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'setFund'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"setLDYStaking"`.
 */
export function usePrepareOldLToken1SetLdyStaking(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'setLDYStaking'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'setLDYStaking',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'setLDYStaking'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"setRetentionRate"`.
 */
export function usePrepareOldLToken1SetRetentionRate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'setRetentionRate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'setRetentionRate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'setRetentionRate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"setWithdrawer"`.
 */
export function usePrepareOldLToken1SetWithdrawer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'setWithdrawer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'setWithdrawer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'setWithdrawer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"startRewardsRedirection"`.
 */
export function usePrepareOldLToken1StartRewardsRedirection(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'startRewardsRedirection'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'startRewardsRedirection',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'startRewardsRedirection'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"stopRewardsRedirection"`.
 */
export function usePrepareOldLToken1StopRewardsRedirection(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'stopRewardsRedirection'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'stopRewardsRedirection',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'stopRewardsRedirection'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareOldLToken1Transfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'transfer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareOldLToken1TransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'transferFrom'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'transferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"unlistenToTransfers"`.
 */
export function usePrepareOldLToken1UnlistenToTransfers(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'unlistenToTransfers'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'unlistenToTransfers',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'unlistenToTransfers'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"upgradeTo"`.
 */
export function usePrepareOldLToken1UpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'upgradeTo'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link oldLToken1ABI}__ and `functionName` set to `"upgradeToAndCall"`.
 */
export function usePrepareOldLToken1UpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'upgradeToAndCall'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: oldLToken1ABI,
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof oldLToken1ABI, 'upgradeToAndCall'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__.
 *
 *
 */
export function usePreMiningRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"accountsLocks"`.
 *
 *
 */
export function usePreMiningAccountsLocks<
  TFunctionName extends 'accountsLocks',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'accountsLocks',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"availableToClaim"`.
 *
 *
 */
export function usePreMiningAvailableToClaim<
  TFunctionName extends 'availableToClaim',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'availableToClaim',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"claimPhaseStartTimestamp"`.
 *
 *
 */
export function usePreMiningClaimPhaseStartTimestamp<
  TFunctionName extends 'claimPhaseStartTimestamp',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'claimPhaseStartTimestamp',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"eligibleRewardsOf"`.
 *
 *
 */
export function usePreMiningEligibleRewardsOf<
  TFunctionName extends 'eligibleRewardsOf',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'eligibleRewardsOf',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"hasClaimPhaseStarted"`.
 *
 *
 */
export function usePreMiningHasClaimPhaseStarted<
  TFunctionName extends 'hasClaimPhaseStarted',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'hasClaimPhaseStarted',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"hasDepositPhaseEnded"`.
 *
 *
 */
export function usePreMiningHasDepositPhaseEnded<
  TFunctionName extends 'hasDepositPhaseEnded',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'hasDepositPhaseEnded',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"hasRecoveryPhaseStarted"`.
 *
 *
 */
export function usePreMiningHasRecoveryPhaseStarted<
  TFunctionName extends 'hasRecoveryPhaseStarted',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'hasRecoveryPhaseStarted',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"lToken"`.
 *
 *
 */
export function usePreMiningLToken<
  TFunctionName extends 'lToken',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'lToken',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"ldyToken"`.
 *
 *
 */
export function usePreMiningLdyToken<
  TFunctionName extends 'ldyToken',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'ldyToken',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"lockedHardCap"`.
 *
 *
 */
export function usePreMiningLockedHardCap<
  TFunctionName extends 'lockedHardCap',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'lockedHardCap',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"maxDistributedLDY"`.
 *
 *
 */
export function usePreMiningMaxDistributedLdy<
  TFunctionName extends 'maxDistributedLDY',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'maxDistributedLDY',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"maxLockDuration"`.
 *
 *
 */
export function usePreMiningMaxLockDuration<
  TFunctionName extends 'maxLockDuration',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'maxLockDuration',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"minLockDuration"`.
 *
 *
 */
export function usePreMiningMinLockDuration<
  TFunctionName extends 'minLockDuration',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'minLockDuration',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"owner"`.
 *
 *
 */
export function usePreMiningOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"paused"`.
 *
 *
 */
export function usePreMiningPaused<
  TFunctionName extends 'paused',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'paused',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"pendingOwner"`.
 *
 *
 */
export function usePreMiningPendingOwner<
  TFunctionName extends 'pendingOwner',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'pendingOwner',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"refWeight"`.
 *
 *
 */
export function usePreMiningRefWeight<
  TFunctionName extends 'refWeight',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'refWeight',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"totalLocked"`.
 *
 *
 */
export function usePreMiningTotalLocked<
  TFunctionName extends 'totalLocked',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'totalLocked',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"totalWeight"`.
 *
 *
 */
export function usePreMiningTotalWeight<
  TFunctionName extends 'totalWeight',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'totalWeight',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"underlyingToken"`.
 *
 *
 */
export function usePreMiningUnderlyingToken<
  TFunctionName extends 'underlyingToken',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'underlyingToken',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"unlockRequests"`.
 *
 *
 */
export function usePreMiningUnlockRequests<
  TFunctionName extends 'unlockRequests',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'unlockRequests',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"unlockRequestsCursor"`.
 *
 *
 */
export function usePreMiningUnlockRequestsCursor<
  TFunctionName extends 'unlockRequestsCursor',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'unlockRequestsCursor',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"vestingDuration"`.
 *
 *
 */
export function usePreMiningVestingDuration<
  TFunctionName extends 'vestingDuration',
  TSelectData = ReadContractResult<typeof preMiningABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return useContractRead({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'vestingDuration',
    ...config,
  } as UseContractReadConfig<typeof preMiningABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__.
 *
 *
 */
export function usePreMiningWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof preMiningABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, TFunctionName, TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"acceptOwnership"`.
 *
 *
 */
export function usePreMiningAcceptOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, 'acceptOwnership'>['request']['abi'],
        'acceptOwnership',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'acceptOwnership' }
    : UseContractWriteConfig<typeof preMiningABI, 'acceptOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'acceptOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, 'acceptOwnership', TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'acceptOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"claimRewards"`.
 *
 *
 */
export function usePreMiningClaimRewards<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, 'claimRewards'>['request']['abi'],
        'claimRewards',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'claimRewards' }
    : UseContractWriteConfig<typeof preMiningABI, 'claimRewards', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'claimRewards'
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, 'claimRewards', TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'claimRewards',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"endDepositPhase"`.
 *
 *
 */
export function usePreMiningEndDepositPhase<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, 'endDepositPhase'>['request']['abi'],
        'endDepositPhase',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'endDepositPhase' }
    : UseContractWriteConfig<typeof preMiningABI, 'endDepositPhase', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'endDepositPhase'
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, 'endDepositPhase', TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'endDepositPhase',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"instantUnlock"`.
 *
 *
 */
export function usePreMiningInstantUnlock<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, 'instantUnlock'>['request']['abi'],
        'instantUnlock',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'instantUnlock' }
    : UseContractWriteConfig<typeof preMiningABI, 'instantUnlock', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'instantUnlock'
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, 'instantUnlock', TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'instantUnlock',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"lock"`.
 *
 *
 */
export function usePreMiningLock<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, 'lock'>['request']['abi'],
        'lock',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'lock' }
    : UseContractWriteConfig<typeof preMiningABI, 'lock', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'lock'
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, 'lock', TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'lock',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"pause"`.
 *
 *
 */
export function usePreMiningPause<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, 'pause'>['request']['abi'],
        'pause',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'pause' }
    : UseContractWriteConfig<typeof preMiningABI, 'pause', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'pause'
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, 'pause', TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'pause',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"processUnlockRequests"`.
 *
 *
 */
export function usePreMiningProcessUnlockRequests<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, 'processUnlockRequests'>['request']['abi'],
        'processUnlockRequests',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'processUnlockRequests' }
    : UseContractWriteConfig<typeof preMiningABI, 'processUnlockRequests', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'processUnlockRequests'
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, 'processUnlockRequests', TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'processUnlockRequests',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"recoverERC20"`.
 *
 *
 */
export function usePreMiningRecoverErc20<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, 'recoverERC20'>['request']['abi'],
        'recoverERC20',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'recoverERC20' }
    : UseContractWriteConfig<typeof preMiningABI, 'recoverERC20', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'recoverERC20'
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, 'recoverERC20', TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'recoverERC20',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 *
 */
export function usePreMiningRenounceOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, 'renounceOwnership'>['request']['abi'],
        'renounceOwnership',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'renounceOwnership' }
    : UseContractWriteConfig<typeof preMiningABI, 'renounceOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, 'renounceOwnership', TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"requestUnlock"`.
 *
 *
 */
export function usePreMiningRequestUnlock<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, 'requestUnlock'>['request']['abi'],
        'requestUnlock',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'requestUnlock' }
    : UseContractWriteConfig<typeof preMiningABI, 'requestUnlock', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'requestUnlock'
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, 'requestUnlock', TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'requestUnlock',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"setLDYToken"`.
 *
 *
 */
export function usePreMiningSetLdyToken<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, 'setLDYToken'>['request']['abi'],
        'setLDYToken',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setLDYToken' }
    : UseContractWriteConfig<typeof preMiningABI, 'setLDYToken', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setLDYToken'
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, 'setLDYToken', TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'setLDYToken',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"startClaimPhase"`.
 *
 *
 */
export function usePreMiningStartClaimPhase<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, 'startClaimPhase'>['request']['abi'],
        'startClaimPhase',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'startClaimPhase' }
    : UseContractWriteConfig<typeof preMiningABI, 'startClaimPhase', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'startClaimPhase'
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, 'startClaimPhase', TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'startClaimPhase',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"startRecoveryPhase"`.
 *
 *
 */
export function usePreMiningStartRecoveryPhase<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, 'startRecoveryPhase'>['request']['abi'],
        'startRecoveryPhase',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'startRecoveryPhase' }
    : UseContractWriteConfig<typeof preMiningABI, 'startRecoveryPhase', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'startRecoveryPhase'
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, 'startRecoveryPhase', TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'startRecoveryPhase',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"transferOwnership"`.
 *
 *
 */
export function usePreMiningTransferOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, 'transferOwnership'>['request']['abi'],
        'transferOwnership',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'transferOwnership' }
    : UseContractWriteConfig<typeof preMiningABI, 'transferOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, 'transferOwnership', TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"unpause"`.
 *
 *
 */
export function usePreMiningUnpause<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof preMiningABI, 'unpause'>['request']['abi'],
        'unpause',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'unpause' }
    : UseContractWriteConfig<typeof preMiningABI, 'unpause', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'unpause'
      } = {} as any,
) {
  return useContractWrite<typeof preMiningABI, 'unpause', TMode>({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'unpause',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__.
 *
 *
 */
export function usePreparePreMiningWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"acceptOwnership"`.
 *
 *
 */
export function usePreparePreMiningAcceptOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, 'acceptOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'acceptOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, 'acceptOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"claimRewards"`.
 *
 *
 */
export function usePreparePreMiningClaimRewards(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, 'claimRewards'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'claimRewards',
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, 'claimRewards'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"endDepositPhase"`.
 *
 *
 */
export function usePreparePreMiningEndDepositPhase(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, 'endDepositPhase'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'endDepositPhase',
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, 'endDepositPhase'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"instantUnlock"`.
 *
 *
 */
export function usePreparePreMiningInstantUnlock(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, 'instantUnlock'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'instantUnlock',
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, 'instantUnlock'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"lock"`.
 *
 *
 */
export function usePreparePreMiningLock(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, 'lock'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'lock',
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, 'lock'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"pause"`.
 *
 *
 */
export function usePreparePreMiningPause(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, 'pause'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'pause',
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, 'pause'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"processUnlockRequests"`.
 *
 *
 */
export function usePreparePreMiningProcessUnlockRequests(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, 'processUnlockRequests'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'processUnlockRequests',
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, 'processUnlockRequests'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"recoverERC20"`.
 *
 *
 */
export function usePreparePreMiningRecoverErc20(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, 'recoverERC20'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'recoverERC20',
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, 'recoverERC20'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 *
 */
export function usePreparePreMiningRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, 'renounceOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, 'renounceOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"requestUnlock"`.
 *
 *
 */
export function usePreparePreMiningRequestUnlock(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, 'requestUnlock'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'requestUnlock',
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, 'requestUnlock'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"setLDYToken"`.
 *
 *
 */
export function usePreparePreMiningSetLdyToken(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, 'setLDYToken'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'setLDYToken',
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, 'setLDYToken'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"startClaimPhase"`.
 *
 *
 */
export function usePreparePreMiningStartClaimPhase(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, 'startClaimPhase'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'startClaimPhase',
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, 'startClaimPhase'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"startRecoveryPhase"`.
 *
 *
 */
export function usePreparePreMiningStartRecoveryPhase(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, 'startRecoveryPhase'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'startRecoveryPhase',
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, 'startRecoveryPhase'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"transferOwnership"`.
 *
 *
 */
export function usePreparePreMiningTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, 'transferOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, 'transferOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link preMiningABI}__ and `functionName` set to `"unpause"`.
 *
 *
 */
export function usePreparePreMiningUnpause(
  config: Omit<
    UsePrepareContractWriteConfig<typeof preMiningABI, 'unpause'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof preMiningAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    functionName: 'unpause',
    ...config,
  } as UsePrepareContractWriteConfig<typeof preMiningABI, 'unpause'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__.
 */
export function useWipLdyStakingRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: wipLdyStakingABI, ...config } as UseContractReadConfig<
    typeof wipLdyStakingABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"getAPR"`.
 */
export function useWipLdyStakingGetApr<
  TFunctionName extends 'getAPR',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'getAPR',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"getNewLockEndFor"`.
 */
export function useWipLdyStakingGetNewLockEndFor<
  TFunctionName extends 'getNewLockEndFor',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'getNewLockEndFor',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"getTier"`.
 */
export function useWipLdyStakingGetTier<
  TFunctionName extends 'getTier',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'getTier',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"globalBlacklist"`.
 */
export function useWipLdyStakingGlobalBlacklist<
  TFunctionName extends 'globalBlacklist',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'globalBlacklist',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"globalOwner"`.
 */
export function useWipLdyStakingGlobalOwner<
  TFunctionName extends 'globalOwner',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'globalOwner',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"globalPause"`.
 */
export function useWipLdyStakingGlobalPause<
  TFunctionName extends 'globalPause',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'globalPause',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"invested"`.
 */
export function useWipLdyStakingInvested<
  TFunctionName extends 'invested',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'invested',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"lockEndOf"`.
 */
export function useWipLdyStakingLockEndOf<
  TFunctionName extends 'lockEndOf',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'lockEndOf',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"owner"`.
 */
export function useWipLdyStakingOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"paused"`.
 */
export function useWipLdyStakingPaused<
  TFunctionName extends 'paused',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'paused',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"proxiableUUID"`.
 */
export function useWipLdyStakingProxiableUuid<
  TFunctionName extends 'proxiableUUID',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function useWipLdyStakingRenounceOwnership<
  TFunctionName extends 'renounceOwnership',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'renounceOwnership',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"rewardsOf"`.
 */
export function useWipLdyStakingRewardsOf<
  TFunctionName extends 'rewardsOf',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'rewardsOf',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"rewardsRedirectsFromTo"`.
 */
export function useWipLdyStakingRewardsRedirectsFromTo<
  TFunctionName extends 'rewardsRedirectsFromTo',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'rewardsRedirectsFromTo',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"rewardsRedirectsToFrom"`.
 */
export function useWipLdyStakingRewardsRedirectsToFrom<
  TFunctionName extends 'rewardsRedirectsToFrom',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'rewardsRedirectsToFrom',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"rewardsReserve"`.
 */
export function useWipLdyStakingRewardsReserve<
  TFunctionName extends 'rewardsReserve',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'rewardsReserve',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"stakeLockDuration"`.
 */
export function useWipLdyStakingStakeLockDuration<
  TFunctionName extends 'stakeLockDuration',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'stakeLockDuration',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"stakeOf"`.
 */
export function useWipLdyStakingStakeOf<
  TFunctionName extends 'stakeOf',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'stakeOf',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"tierOf"`.
 */
export function useWipLdyStakingTierOf<
  TFunctionName extends 'tierOf',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'tierOf',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"totalStaked"`.
 */
export function useWipLdyStakingTotalStaked<
  TFunctionName extends 'totalStaked',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'totalStaked',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useWipLdyStakingTransferOwnership<
  TFunctionName extends 'transferOwnership',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'transferOwnership',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"unlockFeesRateUD7x3"`.
 */
export function useWipLdyStakingUnlockFeesRateUd7x3<
  TFunctionName extends 'unlockFeesRateUD7x3',
  TSelectData = ReadContractResult<typeof wipLdyStakingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: wipLdyStakingABI,
    functionName: 'unlockFeesRateUD7x3',
    ...config,
  } as UseContractReadConfig<typeof wipLdyStakingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__.
 */
export function useWipLdyStakingWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wipLdyStakingABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof wipLdyStakingABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, TFunctionName, TMode>({
    abi: wipLdyStakingABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"claim"`.
 */
export function useWipLdyStakingClaim<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wipLdyStakingABI, 'claim'>['request']['abi'],
        'claim',
        TMode
      > & { functionName?: 'claim' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'claim', TMode> & {
        abi?: never
        functionName?: 'claim'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'claim', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'claim',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"compound"`.
 */
export function useWipLdyStakingCompound<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wipLdyStakingABI, 'compound'>['request']['abi'],
        'compound',
        TMode
      > & { functionName?: 'compound' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'compound', TMode> & {
        abi?: never
        functionName?: 'compound'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'compound', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'compound',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"fuel"`.
 */
export function useWipLdyStakingFuel<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wipLdyStakingABI, 'fuel'>['request']['abi'],
        'fuel',
        TMode
      > & { functionName?: 'fuel' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'fuel', TMode> & {
        abi?: never
        functionName?: 'fuel'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'fuel', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'fuel',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"initialize"`.
 */
export function useWipLdyStakingInitialize<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wipLdyStakingABI, 'initialize'>['request']['abi'],
        'initialize',
        TMode
      > & { functionName?: 'initialize' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'initialize', TMode> & {
        abi?: never
        functionName?: 'initialize'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'initialize', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"recoverERC20"`.
 */
export function useWipLdyStakingRecoverErc20<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wipLdyStakingABI, 'recoverERC20'>['request']['abi'],
        'recoverERC20',
        TMode
      > & { functionName?: 'recoverERC20' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'recoverERC20', TMode> & {
        abi?: never
        functionName?: 'recoverERC20'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'recoverERC20', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'recoverERC20',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"recoverLDY"`.
 */
export function useWipLdyStakingRecoverLdy<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wipLdyStakingABI, 'recoverLDY'>['request']['abi'],
        'recoverLDY',
        TMode
      > & { functionName?: 'recoverLDY' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'recoverLDY', TMode> & {
        abi?: never
        functionName?: 'recoverLDY'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'recoverLDY', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'recoverLDY',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"setAPR"`.
 */
export function useWipLdyStakingSetApr<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wipLdyStakingABI, 'setAPR'>['request']['abi'],
        'setAPR',
        TMode
      > & { functionName?: 'setAPR' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'setAPR', TMode> & {
        abi?: never
        functionName?: 'setAPR'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'setAPR', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'setAPR',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"setStakeLockDuration"`.
 */
export function useWipLdyStakingSetStakeLockDuration<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof wipLdyStakingABI,
          'setStakeLockDuration'
        >['request']['abi'],
        'setStakeLockDuration',
        TMode
      > & { functionName?: 'setStakeLockDuration' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'setStakeLockDuration', TMode> & {
        abi?: never
        functionName?: 'setStakeLockDuration'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'setStakeLockDuration', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'setStakeLockDuration',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"setTier"`.
 */
export function useWipLdyStakingSetTier<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wipLdyStakingABI, 'setTier'>['request']['abi'],
        'setTier',
        TMode
      > & { functionName?: 'setTier' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'setTier', TMode> & {
        abi?: never
        functionName?: 'setTier'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'setTier', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'setTier',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"setUnlockFeesRate"`.
 */
export function useWipLdyStakingSetUnlockFeesRate<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wipLdyStakingABI, 'setUnlockFeesRate'>['request']['abi'],
        'setUnlockFeesRate',
        TMode
      > & { functionName?: 'setUnlockFeesRate' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'setUnlockFeesRate', TMode> & {
        abi?: never
        functionName?: 'setUnlockFeesRate'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'setUnlockFeesRate', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'setUnlockFeesRate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"stake"`.
 */
export function useWipLdyStakingStake<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wipLdyStakingABI, 'stake'>['request']['abi'],
        'stake',
        TMode
      > & { functionName?: 'stake' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'stake', TMode> & {
        abi?: never
        functionName?: 'stake'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'stake', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'stake',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"startRewardsRedirection"`.
 */
export function useWipLdyStakingStartRewardsRedirection<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof wipLdyStakingABI,
          'startRewardsRedirection'
        >['request']['abi'],
        'startRewardsRedirection',
        TMode
      > & { functionName?: 'startRewardsRedirection' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'startRewardsRedirection', TMode> & {
        abi?: never
        functionName?: 'startRewardsRedirection'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'startRewardsRedirection', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'startRewardsRedirection',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"stopRewardsRedirection"`.
 */
export function useWipLdyStakingStopRewardsRedirection<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof wipLdyStakingABI,
          'stopRewardsRedirection'
        >['request']['abi'],
        'stopRewardsRedirection',
        TMode
      > & { functionName?: 'stopRewardsRedirection' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'stopRewardsRedirection', TMode> & {
        abi?: never
        functionName?: 'stopRewardsRedirection'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'stopRewardsRedirection', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'stopRewardsRedirection',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"unlock"`.
 */
export function useWipLdyStakingUnlock<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wipLdyStakingABI, 'unlock'>['request']['abi'],
        'unlock',
        TMode
      > & { functionName?: 'unlock' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'unlock', TMode> & {
        abi?: never
        functionName?: 'unlock'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'unlock', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'unlock',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"unstake"`.
 */
export function useWipLdyStakingUnstake<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wipLdyStakingABI, 'unstake'>['request']['abi'],
        'unstake',
        TMode
      > & { functionName?: 'unstake' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'unstake', TMode> & {
        abi?: never
        functionName?: 'unstake'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'unstake', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'unstake',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"upgradeTo"`.
 */
export function useWipLdyStakingUpgradeTo<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wipLdyStakingABI, 'upgradeTo'>['request']['abi'],
        'upgradeTo',
        TMode
      > & { functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'upgradeTo', TMode> & {
        abi?: never
        functionName?: 'upgradeTo'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'upgradeTo', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"upgradeToAndCall"`.
 */
export function useWipLdyStakingUpgradeToAndCall<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wipLdyStakingABI, 'upgradeToAndCall'>['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & { functionName?: 'upgradeToAndCall' }
    : UseContractWriteConfig<typeof wipLdyStakingABI, 'upgradeToAndCall', TMode> & {
        abi?: never
        functionName?: 'upgradeToAndCall'
      } = {} as any,
) {
  return useContractWrite<typeof wipLdyStakingABI, 'upgradeToAndCall', TMode>({
    abi: wipLdyStakingABI,
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__.
 */
export function usePrepareWipLdyStakingWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"claim"`.
 */
export function usePrepareWipLdyStakingClaim(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'claim'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'claim',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'claim'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"compound"`.
 */
export function usePrepareWipLdyStakingCompound(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'compound'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'compound',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'compound'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"fuel"`.
 */
export function usePrepareWipLdyStakingFuel(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'fuel'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'fuel',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'fuel'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"initialize"`.
 */
export function usePrepareWipLdyStakingInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'initialize'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"recoverERC20"`.
 */
export function usePrepareWipLdyStakingRecoverErc20(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'recoverERC20'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'recoverERC20',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'recoverERC20'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"recoverLDY"`.
 */
export function usePrepareWipLdyStakingRecoverLdy(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'recoverLDY'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'recoverLDY',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'recoverLDY'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"setAPR"`.
 */
export function usePrepareWipLdyStakingSetApr(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'setAPR'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'setAPR',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'setAPR'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"setStakeLockDuration"`.
 */
export function usePrepareWipLdyStakingSetStakeLockDuration(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'setStakeLockDuration'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'setStakeLockDuration',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'setStakeLockDuration'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"setTier"`.
 */
export function usePrepareWipLdyStakingSetTier(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'setTier'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'setTier',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'setTier'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"setUnlockFeesRate"`.
 */
export function usePrepareWipLdyStakingSetUnlockFeesRate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'setUnlockFeesRate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'setUnlockFeesRate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'setUnlockFeesRate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"stake"`.
 */
export function usePrepareWipLdyStakingStake(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'stake'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'stake',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'stake'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"startRewardsRedirection"`.
 */
export function usePrepareWipLdyStakingStartRewardsRedirection(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'startRewardsRedirection'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'startRewardsRedirection',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'startRewardsRedirection'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"stopRewardsRedirection"`.
 */
export function usePrepareWipLdyStakingStopRewardsRedirection(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'stopRewardsRedirection'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'stopRewardsRedirection',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'stopRewardsRedirection'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"unlock"`.
 */
export function usePrepareWipLdyStakingUnlock(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'unlock'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'unlock',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'unlock'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"unstake"`.
 */
export function usePrepareWipLdyStakingUnstake(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'unstake'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'unstake',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'unstake'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"upgradeTo"`.
 */
export function usePrepareWipLdyStakingUpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'upgradeTo'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wipLdyStakingABI}__ and `functionName` set to `"upgradeToAndCall"`.
 */
export function usePrepareWipLdyStakingUpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'upgradeToAndCall'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: wipLdyStakingABI,
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wipLdyStakingABI, 'upgradeToAndCall'>)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link genericErc20ABI}__.
 */
export function getGenericErc20(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: genericErc20ABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link genericErc20ABI}__.
 */
export function readGenericErc20<
  TAbi extends readonly unknown[] = typeof genericErc20ABI,
  TFunctionName extends string = string,
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return readContract({ abi: genericErc20ABI, ...config } as unknown as ReadContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link genericErc20ABI}__.
 */
export function writeGenericErc20<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof genericErc20ABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof genericErc20ABI, TFunctionName>, 'abi'>,
) {
  return writeContract({ abi: genericErc20ABI, ...config } as unknown as WriteContractArgs<
    typeof genericErc20ABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link genericErc20ABI}__.
 */
export function prepareWriteGenericErc20<
  TAbi extends readonly unknown[] = typeof genericErc20ABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({
    abi: genericErc20ABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link globalBlacklistABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function getGlobalBlacklist(
  config: Omit<GetContractArgs, 'abi' | 'address'> & {
    chainId?: keyof typeof globalBlacklistAddress
  },
) {
  return getContract({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[config.chainId as keyof typeof globalBlacklistAddress],
    ...config,
  })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalBlacklistABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function readGlobalBlacklist<
  TAbi extends readonly unknown[] = typeof globalBlacklistABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof globalBlacklistAddress
  },
) {
  return readContract({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[config.chainId as keyof typeof globalBlacklistAddress],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalBlacklistABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function writeGlobalBlacklist<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof globalBlacklistAddress,
>(
  config:
    | (Omit<
        WriteContractPreparedArgs<typeof globalBlacklistABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof globalBlacklistAddress
      })
    | (Omit<
        WriteContractUnpreparedArgs<typeof globalBlacklistABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof globalBlacklistAddress
      }),
) {
  return writeContract({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[config.chainId as keyof typeof globalBlacklistAddress],
    ...config,
  } as unknown as WriteContractArgs<typeof globalBlacklistABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link globalBlacklistABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 */
export function prepareWriteGlobalBlacklist<
  TAbi extends readonly unknown[] = typeof globalBlacklistABI,
  TFunctionName extends string = string,
>(
  config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof globalBlacklistAddress
  },
) {
  return prepareWriteContract({
    abi: globalBlacklistABI,
    address: globalBlacklistAddress[config.chainId as keyof typeof globalBlacklistAddress],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link globalOwnerABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function getGlobalOwner(
  config: Omit<GetContractArgs, 'abi' | 'address'> & { chainId?: keyof typeof globalOwnerAddress },
) {
  return getContract({
    abi: globalOwnerABI,
    address: globalOwnerAddress[config.chainId as keyof typeof globalOwnerAddress],
    ...config,
  })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalOwnerABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function readGlobalOwner<
  TAbi extends readonly unknown[] = typeof globalOwnerABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof globalOwnerAddress
  },
) {
  return readContract({
    abi: globalOwnerABI,
    address: globalOwnerAddress[config.chainId as keyof typeof globalOwnerAddress],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalOwnerABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function writeGlobalOwner<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof globalOwnerAddress,
>(
  config:
    | (Omit<WriteContractPreparedArgs<typeof globalOwnerABI, TFunctionName>, 'abi' | 'address'> & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof globalOwnerAddress
      })
    | (Omit<
        WriteContractUnpreparedArgs<typeof globalOwnerABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof globalOwnerAddress
      }),
) {
  return writeContract({
    abi: globalOwnerABI,
    address: globalOwnerAddress[config.chainId as keyof typeof globalOwnerAddress],
    ...config,
  } as unknown as WriteContractArgs<typeof globalOwnerABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link globalOwnerABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 */
export function prepareWriteGlobalOwner<
  TAbi extends readonly unknown[] = typeof globalOwnerABI,
  TFunctionName extends string = string,
>(
  config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof globalOwnerAddress
  },
) {
  return prepareWriteContract({
    abi: globalOwnerABI,
    address: globalOwnerAddress[config.chainId as keyof typeof globalOwnerAddress],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link globalPauseABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function getGlobalPause(
  config: Omit<GetContractArgs, 'abi' | 'address'> & { chainId?: keyof typeof globalPauseAddress },
) {
  return getContract({
    abi: globalPauseABI,
    address: globalPauseAddress[config.chainId as keyof typeof globalPauseAddress],
    ...config,
  })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalPauseABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function readGlobalPause<
  TAbi extends readonly unknown[] = typeof globalPauseABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof globalPauseAddress
  },
) {
  return readContract({
    abi: globalPauseABI,
    address: globalPauseAddress[config.chainId as keyof typeof globalPauseAddress],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalPauseABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function writeGlobalPause<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof globalPauseAddress,
>(
  config:
    | (Omit<WriteContractPreparedArgs<typeof globalPauseABI, TFunctionName>, 'abi' | 'address'> & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof globalPauseAddress
      })
    | (Omit<
        WriteContractUnpreparedArgs<typeof globalPauseABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof globalPauseAddress
      }),
) {
  return writeContract({
    abi: globalPauseABI,
    address: globalPauseAddress[config.chainId as keyof typeof globalPauseAddress],
    ...config,
  } as unknown as WriteContractArgs<typeof globalPauseABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link globalPauseABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 */
export function prepareWriteGlobalPause<
  TAbi extends readonly unknown[] = typeof globalPauseABI,
  TFunctionName extends string = string,
>(
  config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof globalPauseAddress
  },
) {
  return prepareWriteContract({
    abi: globalPauseABI,
    address: globalPauseAddress[config.chainId as keyof typeof globalPauseAddress],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link iTransfersListenerABI}__.
 */
export function getITransfersListener(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: iTransfersListenerABI, ...config })
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link iTransfersListenerABI}__.
 */
export function writeITransfersListener<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof iTransfersListenerABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof iTransfersListenerABI, TFunctionName>, 'abi'>,
) {
  return writeContract({ abi: iTransfersListenerABI, ...config } as unknown as WriteContractArgs<
    typeof iTransfersListenerABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link iTransfersListenerABI}__.
 */
export function prepareWriteITransfersListener<
  TAbi extends readonly unknown[] = typeof iTransfersListenerABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({
    abi: iTransfersListenerABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link ldyStakingABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function getLdyStaking(
  config: Omit<GetContractArgs, 'abi' | 'address'> & { chainId?: keyof typeof ldyStakingAddress },
) {
  return getContract({
    abi: ldyStakingABI,
    address: ldyStakingAddress[config.chainId as keyof typeof ldyStakingAddress],
    ...config,
  })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function readLdyStaking<
  TAbi extends readonly unknown[] = typeof ldyStakingABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof ldyStakingAddress
  },
) {
  return readContract({
    abi: ldyStakingABI,
    address: ldyStakingAddress[config.chainId as keyof typeof ldyStakingAddress],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function writeLdyStaking<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof ldyStakingAddress,
>(
  config:
    | (Omit<WriteContractPreparedArgs<typeof ldyStakingABI, TFunctionName>, 'abi' | 'address'> & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof ldyStakingAddress
      })
    | (Omit<WriteContractUnpreparedArgs<typeof ldyStakingABI, TFunctionName>, 'abi' | 'address'> & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof ldyStakingAddress
      }),
) {
  return writeContract({
    abi: ldyStakingABI,
    address: ldyStakingAddress[config.chainId as keyof typeof ldyStakingAddress],
    ...config,
  } as unknown as WriteContractArgs<typeof ldyStakingABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link ldyStakingABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 */
export function prepareWriteLdyStaking<
  TAbi extends readonly unknown[] = typeof ldyStakingABI,
  TFunctionName extends string = string,
>(
  config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof ldyStakingAddress
  },
) {
  return prepareWriteContract({
    abi: ldyStakingABI,
    address: ldyStakingAddress[config.chainId as keyof typeof ldyStakingAddress],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link lTokenABI}__.
 */
export function getLToken(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: lTokenABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenABI}__.
 */
export function readLToken<
  TAbi extends readonly unknown[] = typeof lTokenABI,
  TFunctionName extends string = string,
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return readContract({ abi: lTokenABI, ...config } as unknown as ReadContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenABI}__.
 */
export function writeLToken<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof lTokenABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof lTokenABI, TFunctionName>, 'abi'>,
) {
  return writeContract({ abi: lTokenABI, ...config } as unknown as WriteContractArgs<
    typeof lTokenABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link lTokenABI}__.
 */
export function prepareWriteLToken<
  TAbi extends readonly unknown[] = typeof lTokenABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({
    abi: lTokenABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link lTokenSignalerABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function getLTokenSignaler(
  config: Omit<GetContractArgs, 'abi' | 'address'> & {
    chainId?: keyof typeof lTokenSignalerAddress
  },
) {
  return getContract({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[config.chainId as keyof typeof lTokenSignalerAddress],
    ...config,
  })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenSignalerABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function readLTokenSignaler<
  TAbi extends readonly unknown[] = typeof lTokenSignalerABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof lTokenSignalerAddress
  },
) {
  return readContract({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[config.chainId as keyof typeof lTokenSignalerAddress],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenSignalerABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function writeLTokenSignaler<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof lTokenSignalerAddress,
>(
  config:
    | (Omit<
        WriteContractPreparedArgs<typeof lTokenSignalerABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof lTokenSignalerAddress
      })
    | (Omit<
        WriteContractUnpreparedArgs<typeof lTokenSignalerABI, TFunctionName>,
        'abi' | 'address'
      > & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof lTokenSignalerAddress
      }),
) {
  return writeContract({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[config.chainId as keyof typeof lTokenSignalerAddress],
    ...config,
  } as unknown as WriteContractArgs<typeof lTokenSignalerABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link lTokenSignalerABI}__.
 *
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 */
export function prepareWriteLTokenSignaler<
  TAbi extends readonly unknown[] = typeof lTokenSignalerABI,
  TFunctionName extends string = string,
>(
  config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof lTokenSignalerAddress
  },
) {
  return prepareWriteContract({
    abi: lTokenSignalerABI,
    address: lTokenSignalerAddress[config.chainId as keyof typeof lTokenSignalerAddress],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link multicall3ABI}__.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function getMulticall3(
  config: Omit<GetContractArgs, 'abi' | 'address'> & { chainId?: keyof typeof multicall3Address },
) {
  return getContract({
    abi: multicall3ABI,
    address: multicall3Address[config.chainId as keyof typeof multicall3Address],
    ...config,
  })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link multicall3ABI}__.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function readMulticall3<
  TAbi extends readonly unknown[] = typeof multicall3ABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof multicall3Address
  },
) {
  return readContract({
    abi: multicall3ABI,
    address: multicall3Address[config.chainId as keyof typeof multicall3Address],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link multicall3ABI}__.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function writeMulticall3<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof multicall3Address,
>(
  config:
    | (Omit<WriteContractPreparedArgs<typeof multicall3ABI, TFunctionName>, 'abi' | 'address'> & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof multicall3Address
      })
    | (Omit<WriteContractUnpreparedArgs<typeof multicall3ABI, TFunctionName>, 'abi' | 'address'> & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof multicall3Address
      }),
) {
  return writeContract({
    abi: multicall3ABI,
    address: multicall3Address[config.chainId as keyof typeof multicall3Address],
    ...config,
  } as unknown as WriteContractArgs<typeof multicall3ABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link multicall3ABI}__.
 *
 * -
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io//address/0x87afDfde08722AF04a2991D4B4D71e00307DFB3E)
 */
export function prepareWriteMulticall3<
  TAbi extends readonly unknown[] = typeof multicall3ABI,
  TFunctionName extends string = string,
>(
  config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof multicall3Address
  },
) {
  return prepareWriteContract({
    abi: multicall3ABI,
    address: multicall3Address[config.chainId as keyof typeof multicall3Address],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link oldLToken1ABI}__.
 */
export function getOldLToken1(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: oldLToken1ABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oldLToken1ABI}__.
 */
export function readOldLToken1<
  TAbi extends readonly unknown[] = typeof oldLToken1ABI,
  TFunctionName extends string = string,
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return readContract({ abi: oldLToken1ABI, ...config } as unknown as ReadContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oldLToken1ABI}__.
 */
export function writeOldLToken1<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof oldLToken1ABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof oldLToken1ABI, TFunctionName>, 'abi'>,
) {
  return writeContract({ abi: oldLToken1ABI, ...config } as unknown as WriteContractArgs<
    typeof oldLToken1ABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link oldLToken1ABI}__.
 */
export function prepareWriteOldLToken1<
  TAbi extends readonly unknown[] = typeof oldLToken1ABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({
    abi: oldLToken1ABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link preMiningABI}__.
 *
 *
 */
export function getPreMining(
  config: Omit<GetContractArgs, 'abi' | 'address'> & { chainId?: keyof typeof preMiningAddress },
) {
  return getContract({ abi: preMiningABI, address: preMiningAddress[31337], ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link preMiningABI}__.
 *
 *
 */
export function readPreMining<
  TAbi extends readonly unknown[] = typeof preMiningABI,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof preMiningAddress
  },
) {
  return readContract({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link preMiningABI}__.
 *
 *
 */
export function writePreMining<
  TFunctionName extends string,
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof preMiningAddress,
>(
  config:
    | (Omit<WriteContractPreparedArgs<typeof preMiningABI, TFunctionName>, 'abi' | 'address'> & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof preMiningAddress
      })
    | (Omit<WriteContractUnpreparedArgs<typeof preMiningABI, TFunctionName>, 'abi' | 'address'> & {
        mode: TMode
        chainId?: TMode extends 'prepared' ? TChainId : keyof typeof preMiningAddress
      }),
) {
  return writeContract({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    ...config,
  } as unknown as WriteContractArgs<typeof preMiningABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link preMiningABI}__.
 *
 *
 */
export function prepareWritePreMining<
  TAbi extends readonly unknown[] = typeof preMiningABI,
  TFunctionName extends string = string,
>(
  config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi' | 'address'> & {
    chainId?: keyof typeof preMiningAddress
  },
) {
  return prepareWriteContract({
    abi: preMiningABI,
    address: preMiningAddress[31337],
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link wipLdyStakingABI}__.
 */
export function getWipLdyStaking(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: wipLdyStakingABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link wipLdyStakingABI}__.
 */
export function readWipLdyStaking<
  TAbi extends readonly unknown[] = typeof wipLdyStakingABI,
  TFunctionName extends string = string,
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return readContract({ abi: wipLdyStakingABI, ...config } as unknown as ReadContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link wipLdyStakingABI}__.
 */
export function writeWipLdyStaking<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof wipLdyStakingABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof wipLdyStakingABI, TFunctionName>, 'abi'>,
) {
  return writeContract({ abi: wipLdyStakingABI, ...config } as unknown as WriteContractArgs<
    typeof wipLdyStakingABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link wipLdyStakingABI}__.
 */
export function prepareWriteWipLdyStaking<
  TAbi extends readonly unknown[] = typeof wipLdyStakingABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({
    abi: wipLdyStakingABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>)
}
