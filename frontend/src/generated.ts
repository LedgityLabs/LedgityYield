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
// EthVault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const ethVaultAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AmountMustBeGreaterThanZero' },
  { type: 'error', inputs: [], name: 'ContractLocked' },
  {
    type: 'error',
    inputs: [
      { name: 'requested', internalType: 'uint256', type: 'uint256' },
      { name: 'available', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'requestedEpochs', internalType: 'uint256', type: 'uint256' },
      { name: 'availableEpochs', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientClaimableEpochs',
  },
  {
    type: 'error',
    inputs: [
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientFundsReturned',
  },
  {
    type: 'error',
    inputs: [
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientStake',
  },
  {
    type: 'error',
    inputs: [
      { name: 'requestedEpochs', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidEpochsToClaim',
  },
  { type: 'error', inputs: [], name: 'NoActiveStake' },
  { type: 'error', inputs: [], name: 'NoRewardToClaim' },
  { type: 'error', inputs: [], name: 'NoRewardsToAllocate' },
  { type: 'error', inputs: [], name: 'NoStakeToExit' },
  { type: 'error', inputs: [], name: 'NotFundwallet' },
  { type: 'error', inputs: [], name: 'NotWithdrawable' },
  { type: 'error', inputs: [], name: 'RewardsAlreadyAllocated' },
  { type: 'error', inputs: [], name: 'TransferFailed' },
  { type: 'error', inputs: [], name: 'UnClaimableRewards' },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'string', type: 'string' }],
    name: 'WrongPhase',
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
      {
        name: 'epochNumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EpochOpened',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'epochNumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalValueLocked',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EpochRunning',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'epochNumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EpochTerminated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldFundWallet',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newFundWallet',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'FundWalletChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'epochId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'FundsTransferredToFundWallet',
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
      { name: 'locked', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'LockingContract',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldMinimumStake',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newMinimumStake',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinimumStakeChanged',
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
        name: 'epochNumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'rewardAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardsAllocated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'claimable', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'RewardsClaimabilityChanged',
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
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'epochNumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UserDeposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'epochNumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UserRewardClaim',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'epochNumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UserWithdraw',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocateRewards',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_user', internalType: 'address', type: 'address' }],
    name: 'calculateRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claimRewards',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_numberOfEpochs', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claimRewardsForEpochs',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claimableRewards',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentEpochId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentEpochStatus',
    outputs: [
      { name: '', internalType: 'enum EthVault.EpochStatus', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'enter',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'epochs',
    outputs: [
      { name: 'totalValueLocked', internalType: 'uint256', type: 'uint256' },
      { name: 'totalEpochRewards', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'exit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'fundWallet',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllEpochs',
    outputs: [
      {
        name: '',
        internalType: 'struct EthVault.Epoch[]',
        type: 'tuple[]',
        components: [
          {
            name: 'totalValueLocked',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalEpochRewards',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentEpoch',
    outputs: [
      {
        name: '',
        internalType: 'struct EthVault.Epoch',
        type: 'tuple',
        components: [
          {
            name: 'totalValueLocked',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalEpochRewards',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_user', internalType: 'address', type: 'address' }],
    name: 'getEpochLengthToClaim',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_user', internalType: 'address', type: 'address' }],
    name: 'hasClaimableRewards',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_fundWallet', internalType: 'address', type: 'address' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lockFundsAndRunCurrentEpoch',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_locked', internalType: 'bool', type: 'bool' }],
    name: 'lockOrUnlockContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'locked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'mininmumStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_fundWallet', internalType: 'address', type: 'address' }],
    name: 'setFundWallet',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_mininmumStake', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMinimumStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'terminateCurrentAndOpenNextEpoch',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'userStakes',
    outputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'lastEpochClaimedAt', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
] as const

/**
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const ethVaultAddress = {
  31337: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
  11155111: '0x97AD00e93366477C90B50305d31aeB66eE2Fe48E',
} as const

/**
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const ethVaultConfig = {
  address: ethVaultAddress,
  abi: ethVaultAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GenericERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const genericErc20Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: 'decimals_', internalType: 'uint8', type: 'uint8' },
    ],
    stateMutability: 'nonpayable',
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
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'decimals_', internalType: 'uint8', type: 'uint8' }],
    name: 'setDecimals',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GlobalBlacklist
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const globalBlacklistAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
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
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Blacklisted',
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
    name: 'Unblacklisted',
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
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'blacklist',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'globalOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'globalOwner_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'isBlacklisted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'unBlacklist',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const globalBlacklistAddress = {
  1: '0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E',
  195: '0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6',
  196: '0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6',
  31337: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
  42161: '0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350',
  59140: '0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf',
  59144: '0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350',
  84532: '0x98002b5c06b44c8769dA3DAe97CA498aB6F97137',
  421613: '0x1549647606A71B2a79b85AEb54631b8eA2a1939a',
  421614: '0x8584BCd220A048104e654F842C56E33d37d6aEe3',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const globalBlacklistConfig = {
  address: globalBlacklistAddress,
  abi: globalBlacklistAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GlobalOwner
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const globalOwnerAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
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
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const globalOwnerAddress = {
  1: '0x730C21c81F2baaDEB54daD63050D42474a824900',
  195: '0x4717bca6978f1BCAb59b7bc0B6849aba6062834c',
  196: '0x4717bca6978f1BCAb59b7bc0B6849aba6062834c',
  31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  42161: '0xe4Af4573bFc5F04D8b84c61744de8A94059f2462',
  59140: '0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6',
  59144: '0xe4Af4573bFc5F04D8b84c61744de8A94059f2462',
  84532: '0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53',
  421613: '0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350',
  421614: '0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const globalOwnerConfig = {
  address: globalOwnerAddress,
  abi: globalOwnerAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GlobalPause
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const globalPauseAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
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
    type: 'function',
    inputs: [],
    name: 'globalOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'globalOwner_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const globalPauseAddress = {
  1: '0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E',
  195: '0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078',
  196: '0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078',
  31337: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  42161: '0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB',
  59140: '0x4fB551213757619558A93a599a08524e9Dd59C67',
  59144: '0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB',
  84532: '0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5',
  421613: '0x06f54B7f27eEC56616b951598BaA3B84D7660AB4',
  421614: '0x98002b5c06b44c8769dA3DAe97CA498aB6F97137',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'onLTokenTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LDY
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const ldyAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
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
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const ldyAddress = {
  195: '0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b',
  196: '0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b',
  84532: '0x8584BCd220A048104e654F842C56E33d37d6aEe3',
  421614: '0xB5C69197e5D6A52c776384479B529D2d76f9e2De',
} as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const ldyConfig = { address: ldyAddress, abi: ldyAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LDYStaking
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const ldyStakingAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
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
        name: 'rewardAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'rewardPerSec',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NotifiedRewardAmount',
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
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'stakeIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reward',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardPaid',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'stakeIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Staked',
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
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'stakeIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Unstaked',
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
    type: 'function',
    inputs: [],
    name: 'MULTIPLIER_BASIS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'stakeIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'earned',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'finishAt',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getEarnedUser',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'stakeIndex', internalType: 'uint256', type: 'uint256' }],
    name: 'getReward',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'getStakeDurationInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct LDYStaking.StakeDurationInfo',
        type: 'tuple',
        components: [
          { name: 'duration', internalType: 'uint256', type: 'uint256' },
          { name: 'multiplier', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getUserStakes',
    outputs: [
      {
        name: '',
        internalType: 'struct LDYStaking.StakingInfo[]',
        type: 'tuple[]',
        components: [
          { name: 'stakedAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'unStakeAt', internalType: 'uint256', type: 'uint256' },
          { name: 'duration', internalType: 'uint256', type: 'uint256' },
          {
            name: 'rewardPerTokenPaid',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'rewards', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'globalBlacklist',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'globalOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'globalPause',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'highTierAccounts',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'globalOwner_', internalType: 'address', type: 'address' },
      { name: 'globalPause_', internalType: 'address', type: 'address' },
      { name: 'globalBlacklist_', internalType: 'address', type: 'address' },
      { name: 'stakeRewardToken_', internalType: 'address', type: 'address' },
      {
        name: 'stakeDurationInfos_',
        internalType: 'struct LDYStaking.StakeDurationInfo[]',
        type: 'tuple[]',
        components: [
          { name: 'duration', internalType: 'uint256', type: 'uint256' },
          { name: 'multiplier', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'stakeDurationForPerks_',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'stakeAmountForPerks_',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastTimeRewardApplicable',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastUpdateTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'notifyRewardAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'durationInfo',
        internalType: 'struct LDYStaking.StakeDurationInfo',
        type: 'tuple',
        components: [
          { name: 'duration', internalType: 'uint256', type: 'uint256' },
          { name: 'multiplier', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'pushStakeDurationInfo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recoverERC20',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rewardPerToken',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rewardPerTokenStored',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rewardRatePerSec',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rewardsDuration',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'duration', internalType: 'uint256', type: 'uint256' }],
    name: 'setRewardsDuration',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'stakeAmountForPerks_',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setStakeAmountForPerks',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'stakeDurationForPerks_',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setStakeDurationForPerks',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'stakeDurationIndex', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stakeAmountForPerks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stakeDurationForPerks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'stakeDurationInfos',
    outputs: [
      { name: 'duration', internalType: 'uint256', type: 'uint256' },
      { name: 'multiplier', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stakeRewardToken',
    outputs: [
      { name: '', internalType: 'contract IERC20Upgradeable', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'tierOf',
    outputs: [{ name: 'tier', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalStaked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalWeightedStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'stakeIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'userStakingInfo',
    outputs: [
      { name: 'stakedAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'unStakeAt', internalType: 'uint256', type: 'uint256' },
      { name: 'duration', internalType: 'uint256', type: 'uint256' },
      { name: 'rewardPerTokenPaid', internalType: 'uint256', type: 'uint256' },
      { name: 'rewards', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const ldyStakingAddress = {
  1: '0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e',
  195: '0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895',
  196: '0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895',
  31337: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
  42161: '0x98002b5c06b44c8769dA3DAe97CA498aB6F97137',
  59140: '0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6',
  59144: '0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1',
  84532: '0xB5C69197e5D6A52c776384479B529D2d76f9e2De',
  421613: '0x5BFFC5303719f0dC6050a2D8042936714109985f',
  421614: '0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
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
        name: 'userAccount',
        internalType: 'address',
        type: 'address',
        indexed: false,
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
      {
        name: 'referralCode',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
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
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'requestId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancelWithdrawalRequest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claimFees',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'refCode', internalType: 'string', type: 'string' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'depositFor',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feesRateUD7x3',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'frozenRequests',
    outputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint96', type: 'uint96' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'fund',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAPR',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getExpectedRetained',
    outputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'globalBlacklist',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'globalOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'globalPause',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
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
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'instantWithdrawal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'invested',
    outputs: [
      { name: '', internalType: 'contract IERC20Upgradeable', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ldyStaking',
    outputs: [
      { name: '', internalType: 'contract LDYStaking', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'listenerContract', internalType: 'address', type: 'address' },
    ],
    name: 'listenToTransfers',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'requestId', internalType: 'uint256', type: 'uint256' }],
    name: 'processBigQueuedRequest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'processQueuedRequests',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'realBalanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'realTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recoverERC20',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recoverUnderlying',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'repatriate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'requestWithdrawal',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'retentionRateUD7x3',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'rewardsRedirectsFromTo',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'rewardsRedirectsToFrom',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'aprUD7x3', internalType: 'uint16', type: 'uint16' }],
    name: 'setAPR',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'feesRateUD7x3_', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'setFeesRate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'fund_', internalType: 'address payable', type: 'address' },
    ],
    name: 'setFund',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ldyStakingAddress', internalType: 'address', type: 'address' },
    ],
    name: 'setLDYStaking',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'retentionRateUD7x3_', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'setRetentionRate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'withdrawalFeeInEth_', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setWithdrawalFeeInEth',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'withdrawer_', internalType: 'address payable', type: 'address' },
    ],
    name: 'setWithdrawer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
    ],
    name: 'startRewardsRedirection',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
    ],
    name: 'stopRewardsRedirection',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalQueued',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'view',
  },
  {
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unclaimedFees',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'underlying',
    outputs: [
      { name: '', internalType: 'contract IERC20Upgradeable', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'listenerContract', internalType: 'address', type: 'address' },
    ],
    name: 'unlistenToTransfers',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'unmintedRewardsOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'usableUnderlyings',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawTo',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdrawalFeeInEth',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawalQueue',
    outputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint96', type: 'uint96' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdrawalQueueCursor',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdrawer',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LTokenSignaler
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const lTokenSignalerAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
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
    type: 'function',
    inputs: [],
    name: 'globalOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'globalOwner_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'lTokenAddress', internalType: 'address', type: 'address' },
    ],
    name: 'signalLToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const lTokenSignalerAddress = {
  195: '0x011C5B18aBC74A341209b12D1A6fD7B59E423428',
  196: '0x011C5B18aBC74A341209b12D1A6fD7B59E423428',
  42161: '0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1',
  59140: '0x04a678103bE57c3d81100fe08e43C94e50adC37B',
  59144: '0xBA427517505b14C560854aED003304Fc69cbadfb',
  84532: '0x7A02c93681450241e97C87a2Decb511b42BB16f5',
  421613: '0x1dA817E33C0dB209C7b508B79F9dac4480f94522',
  421614: '0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e',
} as const

/**
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const lTokenSignalerConfig = {
  address: lTokenSignalerAddress,
  abi: lTokenSignalerAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PreMining
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const preMiningAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'lTokenAddress_', internalType: 'address', type: 'address' },
      { name: 'maxDistributedLDY_', internalType: 'uint256', type: 'uint256' },
      { name: 'lockedHardCap_', internalType: 'uint256', type: 'uint256' },
      { name: 'minLockDuration_', internalType: 'uint8', type: 'uint8' },
      { name: 'maxLockDuration_', internalType: 'uint8', type: 'uint8' },
      { name: 'vestingDuration_', internalType: 'uint8', type: 'uint8' },
    ],
    stateMutability: 'nonpayable',
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
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'availableToClaim',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claimPhaseStartTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claimRewards',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'eligibleRewardsOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'endDepositPhase',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'hasClaimPhaseStarted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'hasDepositPhaseEnded',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'hasRecoveryPhaseStarted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'instantUnlock',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lToken',
    outputs: [{ name: '', internalType: 'contract LToken', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ldyToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'duration', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'lock',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lockedHardCap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxDistributedLDY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxLockDuration',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxWeight',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minLockDuration',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'processUnlockRequests',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recoverERC20',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requestUnlock',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ldyTokenAddress', internalType: 'address', type: 'address' },
    ],
    name: 'setLDYToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startClaimPhase',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startRecoveryPhase',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalLocked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'underlyingToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'unlockRequests',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unlockRequestsCursor',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'vestingDuration',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const preMiningAddress = {
  42161: '0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c',
  59144: '0xd54d564606611A3502FE8909bBD3075dbeb77813',
} as const

/**
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVault = /*#__PURE__*/ createUseReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"calculateRewards"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVaultCalculateRewards =
  /*#__PURE__*/ createUseReadContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'calculateRewards',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"claimableRewards"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVaultClaimableRewards =
  /*#__PURE__*/ createUseReadContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'claimableRewards',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"currentEpochId"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVaultCurrentEpochId =
  /*#__PURE__*/ createUseReadContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'currentEpochId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"currentEpochStatus"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVaultCurrentEpochStatus =
  /*#__PURE__*/ createUseReadContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'currentEpochStatus',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"epochs"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVaultEpochs = /*#__PURE__*/ createUseReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'epochs',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"fundWallet"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVaultFundWallet = /*#__PURE__*/ createUseReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'fundWallet',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"getAllEpochs"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVaultGetAllEpochs = /*#__PURE__*/ createUseReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'getAllEpochs',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"getCurrentEpoch"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVaultGetCurrentEpoch =
  /*#__PURE__*/ createUseReadContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'getCurrentEpoch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"getEpochLengthToClaim"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVaultGetEpochLengthToClaim =
  /*#__PURE__*/ createUseReadContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'getEpochLengthToClaim',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"hasClaimableRewards"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVaultHasClaimableRewards =
  /*#__PURE__*/ createUseReadContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'hasClaimableRewards',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"locked"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVaultLocked = /*#__PURE__*/ createUseReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'locked',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"mininmumStake"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVaultMininmumStake = /*#__PURE__*/ createUseReadContract(
  { abi: ethVaultAbi, address: ethVaultAddress, functionName: 'mininmumStake' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"owner"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVaultOwner = /*#__PURE__*/ createUseReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVaultProxiableUuid = /*#__PURE__*/ createUseReadContract(
  { abi: ethVaultAbi, address: ethVaultAddress, functionName: 'proxiableUUID' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"userStakes"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useReadEthVaultUserStakes = /*#__PURE__*/ createUseReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'userStakes',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVault = /*#__PURE__*/ createUseWriteContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"allocateRewards"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVaultAllocateRewards =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'allocateRewards',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"claimRewards"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVaultClaimRewards =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'claimRewards',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"claimRewardsForEpochs"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVaultClaimRewardsForEpochs =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'claimRewardsForEpochs',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"enter"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVaultEnter = /*#__PURE__*/ createUseWriteContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'enter',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"exit"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVaultExit = /*#__PURE__*/ createUseWriteContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'exit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"initialize"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVaultInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"lockFundsAndRunCurrentEpoch"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVaultLockFundsAndRunCurrentEpoch =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'lockFundsAndRunCurrentEpoch',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"lockOrUnlockContract"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVaultLockOrUnlockContract =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'lockOrUnlockContract',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVaultRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"setFundWallet"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVaultSetFundWallet =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'setFundWallet',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"setMinimumStake"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVaultSetMinimumStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'setMinimumStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"terminateCurrentAndOpenNextEpoch"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVaultTerminateCurrentAndOpenNextEpoch =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'terminateCurrentAndOpenNextEpoch',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVaultTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVaultUpgradeTo = /*#__PURE__*/ createUseWriteContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWriteEthVaultUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVault = /*#__PURE__*/ createUseSimulateContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"allocateRewards"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVaultAllocateRewards =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'allocateRewards',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"claimRewards"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVaultClaimRewards =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'claimRewards',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"claimRewardsForEpochs"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVaultClaimRewardsForEpochs =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'claimRewardsForEpochs',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"enter"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVaultEnter = /*#__PURE__*/ createUseSimulateContract(
  { abi: ethVaultAbi, address: ethVaultAddress, functionName: 'enter' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"exit"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVaultExit = /*#__PURE__*/ createUseSimulateContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'exit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"initialize"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVaultInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"lockFundsAndRunCurrentEpoch"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVaultLockFundsAndRunCurrentEpoch =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'lockFundsAndRunCurrentEpoch',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"lockOrUnlockContract"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVaultLockOrUnlockContract =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'lockOrUnlockContract',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVaultRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"setFundWallet"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVaultSetFundWallet =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'setFundWallet',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"setMinimumStake"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVaultSetMinimumStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'setMinimumStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"terminateCurrentAndOpenNextEpoch"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVaultTerminateCurrentAndOpenNextEpoch =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'terminateCurrentAndOpenNextEpoch',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVaultTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVaultUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useSimulateEthVaultUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ethVaultAbi,
  address: ethVaultAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"EpochOpened"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultEpochOpenedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'EpochOpened',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"EpochRunning"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultEpochRunningEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'EpochRunning',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"EpochTerminated"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultEpochTerminatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'EpochTerminated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"FundWalletChanged"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultFundWalletChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'FundWalletChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"FundsTransferredToFundWallet"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultFundsTransferredToFundWalletEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'FundsTransferredToFundWallet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"Initialized"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"LockingContract"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultLockingContractEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'LockingContract',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"MinimumStakeChanged"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultMinimumStakeChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'MinimumStakeChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"RewardsAllocated"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultRewardsAllocatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'RewardsAllocated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"RewardsClaimabilityChanged"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultRewardsClaimabilityChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'RewardsClaimabilityChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"Upgraded"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"UserDeposit"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultUserDepositEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'UserDeposit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"UserRewardClaim"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultUserRewardClaimEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'UserRewardClaim',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"UserWithdraw"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const useWatchEthVaultUserWithdrawEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'UserWithdraw',
  })

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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const useReadGlobalBlacklist = /*#__PURE__*/ createUseReadContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"globalOwner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const useReadGlobalBlacklistOwner = /*#__PURE__*/ createUseReadContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const useWriteGlobalBlacklist = /*#__PURE__*/ createUseWriteContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"blacklist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const useSimulateGlobalBlacklist =
  /*#__PURE__*/ createUseSimulateContract({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"blacklist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const useWatchGlobalBlacklistEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const useWatchGlobalBlacklistBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"Blacklisted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const useWatchGlobalBlacklistBlacklistedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'Blacklisted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const useWatchGlobalBlacklistOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"Unblacklisted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const useWatchGlobalBlacklistUnblacklistedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'Unblacklisted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const useReadGlobalOwner = /*#__PURE__*/ createUseReadContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const useReadGlobalOwnerOwner = /*#__PURE__*/ createUseReadContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"pendingOwner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const useWriteGlobalOwner = /*#__PURE__*/ createUseWriteContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const useSimulateGlobalOwner = /*#__PURE__*/ createUseSimulateContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const useWatchGlobalOwnerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalOwnerAbi,
    address: globalOwnerAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const useReadGlobalPause = /*#__PURE__*/ createUseReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"globalOwner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const useReadGlobalPauseOwner = /*#__PURE__*/ createUseReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const useReadGlobalPausePaused = /*#__PURE__*/ createUseReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const useWriteGlobalPause = /*#__PURE__*/ createUseWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const useWriteGlobalPausePause = /*#__PURE__*/ createUseWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const useWriteGlobalPauseUnpause = /*#__PURE__*/ createUseWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const useSimulateGlobalPause = /*#__PURE__*/ createUseSimulateContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const useWatchGlobalPauseEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: globalPauseAbi,
    address: globalPauseAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useReadLdy = /*#__PURE__*/ createUseReadContract({
  abi: ldyAbi,
  address: ldyAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"allowance"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useReadLdyAllowance = /*#__PURE__*/ createUseReadContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"balanceOf"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useReadLdyBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"decimals"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useReadLdyDecimals = /*#__PURE__*/ createUseReadContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"name"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useReadLdyName = /*#__PURE__*/ createUseReadContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"symbol"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useReadLdySymbol = /*#__PURE__*/ createUseReadContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"totalSupply"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useReadLdyTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useWriteLdy = /*#__PURE__*/ createUseWriteContract({
  abi: ldyAbi,
  address: ldyAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useWriteLdyApprove = /*#__PURE__*/ createUseWriteContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useWriteLdyBurn = /*#__PURE__*/ createUseWriteContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"burnFrom"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useWriteLdyBurnFrom = /*#__PURE__*/ createUseWriteContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'burnFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useWriteLdyDecreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: ldyAbi,
    address: ldyAddress,
    functionName: 'decreaseAllowance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useWriteLdyIncreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: ldyAbi,
    address: ldyAddress,
    functionName: 'increaseAllowance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useWriteLdyTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useWriteLdyTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useSimulateLdy = /*#__PURE__*/ createUseSimulateContract({
  abi: ldyAbi,
  address: ldyAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useSimulateLdyApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useSimulateLdyBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"burnFrom"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useSimulateLdyBurnFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'burnFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useSimulateLdyDecreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyAbi,
    address: ldyAddress,
    functionName: 'decreaseAllowance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useSimulateLdyIncreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyAbi,
    address: ldyAddress,
    functionName: 'increaseAllowance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useSimulateLdyTransfer = /*#__PURE__*/ createUseSimulateContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useSimulateLdyTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyAbi,
    address: ldyAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useWatchLdyEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ldyAbi,
  address: ldyAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyAbi}__ and `eventName` set to `"Approval"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useWatchLdyApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyAbi,
    address: ldyAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyAbi}__ and `eventName` set to `"Transfer"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const useWatchLdyTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyAbi,
    address: ldyAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStaking = /*#__PURE__*/ createUseReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"MULTIPLIER_BASIS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingMultiplierBasis =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'MULTIPLIER_BASIS',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"earned"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingEarned = /*#__PURE__*/ createUseReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'earned',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"finishAt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingFinishAt = /*#__PURE__*/ createUseReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'finishAt',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"getEarnedUser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingGetEarnedUser =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'getEarnedUser',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"getStakeDurationInfo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingGetStakeDurationInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'getStakeDurationInfo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"getUserStakes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingGetUserStakes =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'getUserStakes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"globalBlacklist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingGlobalBlacklist =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'globalBlacklist',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"globalOwner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingGlobalOwner = /*#__PURE__*/ createUseReadContract(
  {
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'globalOwner',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"globalPause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingGlobalPause = /*#__PURE__*/ createUseReadContract(
  {
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'globalPause',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"highTierAccounts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingHighTierAccounts =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'highTierAccounts',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"lastTimeRewardApplicable"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingLastTimeRewardApplicable =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'lastTimeRewardApplicable',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"lastUpdateTime"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingLastUpdateTime =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'lastUpdateTime',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingOwner = /*#__PURE__*/ createUseReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingPaused = /*#__PURE__*/ createUseReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'proxiableUUID',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingRenounceOwnership =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"rewardPerToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingRewardPerToken =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'rewardPerToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"rewardPerTokenStored"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingRewardPerTokenStored =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'rewardPerTokenStored',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"rewardRatePerSec"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingRewardRatePerSec =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'rewardRatePerSec',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"rewardsDuration"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingRewardsDuration =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'rewardsDuration',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"stakeAmountForPerks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingStakeAmountForPerks =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'stakeAmountForPerks',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"stakeDurationForPerks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingStakeDurationForPerks =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'stakeDurationForPerks',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"stakeDurationInfos"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingStakeDurationInfos =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'stakeDurationInfos',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"stakeRewardToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingStakeRewardToken =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'stakeRewardToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"tierOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingTierOf = /*#__PURE__*/ createUseReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'tierOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"totalRewards"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingTotalRewards =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'totalRewards',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"totalStaked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingTotalStaked = /*#__PURE__*/ createUseReadContract(
  {
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'totalStaked',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"totalWeightedStake"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingTotalWeightedStake =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'totalWeightedStake',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingTransferOwnership =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"userStakingInfo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useReadLdyStakingUserStakingInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'userStakingInfo',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWriteLdyStaking = /*#__PURE__*/ createUseWriteContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"getReward"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWriteLdyStakingGetReward = /*#__PURE__*/ createUseWriteContract(
  { abi: ldyStakingAbi, address: ldyStakingAddress, functionName: 'getReward' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWriteLdyStakingInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"notifyRewardAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWriteLdyStakingNotifyRewardAmount =
  /*#__PURE__*/ createUseWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'notifyRewardAmount',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"pushStakeDurationInfo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWriteLdyStakingPushStakeDurationInfo =
  /*#__PURE__*/ createUseWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'pushStakeDurationInfo',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"recoverERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWriteLdyStakingRecoverErc20 =
  /*#__PURE__*/ createUseWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'recoverERC20',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setRewardsDuration"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWriteLdyStakingSetRewardsDuration =
  /*#__PURE__*/ createUseWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setRewardsDuration',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setStakeAmountForPerks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWriteLdyStakingSetStakeAmountForPerks =
  /*#__PURE__*/ createUseWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setStakeAmountForPerks',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setStakeDurationForPerks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWriteLdyStakingSetStakeDurationForPerks =
  /*#__PURE__*/ createUseWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setStakeDurationForPerks',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"stake"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWriteLdyStakingStake = /*#__PURE__*/ createUseWriteContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'stake',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"unstake"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWriteLdyStakingUnstake = /*#__PURE__*/ createUseWriteContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'unstake',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWriteLdyStakingUpgradeTo = /*#__PURE__*/ createUseWriteContract(
  { abi: ldyStakingAbi, address: ldyStakingAddress, functionName: 'upgradeTo' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWriteLdyStakingUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useSimulateLdyStaking = /*#__PURE__*/ createUseSimulateContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"getReward"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useSimulateLdyStakingGetReward =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'getReward',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useSimulateLdyStakingInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"notifyRewardAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useSimulateLdyStakingNotifyRewardAmount =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'notifyRewardAmount',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"pushStakeDurationInfo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useSimulateLdyStakingPushStakeDurationInfo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'pushStakeDurationInfo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"recoverERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useSimulateLdyStakingRecoverErc20 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'recoverERC20',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setRewardsDuration"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useSimulateLdyStakingSetRewardsDuration =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setRewardsDuration',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setStakeAmountForPerks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useSimulateLdyStakingSetStakeAmountForPerks =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setStakeAmountForPerks',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setStakeDurationForPerks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useSimulateLdyStakingSetStakeDurationForPerks =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setStakeDurationForPerks',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"stake"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useSimulateLdyStakingStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'stake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"unstake"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useSimulateLdyStakingUnstake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'unstake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useSimulateLdyStakingUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'upgradeTo',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useSimulateLdyStakingUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWatchLdyStakingEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWatchLdyStakingAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWatchLdyStakingBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWatchLdyStakingInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"NotifiedRewardAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWatchLdyStakingNotifiedRewardAmountEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'NotifiedRewardAmount',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWatchLdyStakingOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"Paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWatchLdyStakingPausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'Paused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"RewardPaid"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWatchLdyStakingRewardPaidEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'RewardPaid',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"Staked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWatchLdyStakingStakedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'Staked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"Unpaused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWatchLdyStakingUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'Unpaused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"Unstaked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWatchLdyStakingUnstakedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'Unstaked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const useWatchLdyStakingUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'Upgraded',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"withdrawalFeeInEth"`
 */
export const useReadLTokenWithdrawalFeeInEth =
  /*#__PURE__*/ createUseReadContract({
    abi: lTokenAbi,
    functionName: 'withdrawalFeeInEth',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setWithdrawalFeeInEth"`
 */
export const useWriteLTokenSetWithdrawalFeeInEth =
  /*#__PURE__*/ createUseWriteContract({
    abi: lTokenAbi,
    functionName: 'setWithdrawalFeeInEth',
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setWithdrawalFeeInEth"`
 */
export const useSimulateLTokenSetWithdrawalFeeInEth =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenAbi,
    functionName: 'setWithdrawalFeeInEth',
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const useReadLTokenSignaler = /*#__PURE__*/ createUseReadContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"globalOwner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const useReadLTokenSignalerOwner = /*#__PURE__*/ createUseReadContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const useWriteLTokenSignaler = /*#__PURE__*/ createUseWriteContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const useSimulateLTokenSignaler =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const useWatchLTokenSignalerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lTokenSignalerAbi,
    address: lTokenSignalerAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useSimulatePreMiningLock = /*#__PURE__*/ createUseSimulateContract(
  { abi: preMiningAbi, address: preMiningAddress, functionName: 'lock' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link preMiningAbi}__ and `functionName` set to `"pause"`
 *
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
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const useWatchPreMiningEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: preMiningAbi, address: preMiningAddress },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link preMiningAbi}__ and `eventName` set to `"Lock"`
 *
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVault = /*#__PURE__*/ createReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"calculateRewards"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVaultCalculateRewards = /*#__PURE__*/ createReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'calculateRewards',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"claimableRewards"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVaultClaimableRewards = /*#__PURE__*/ createReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'claimableRewards',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"currentEpochId"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVaultCurrentEpochId = /*#__PURE__*/ createReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'currentEpochId',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"currentEpochStatus"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVaultCurrentEpochStatus = /*#__PURE__*/ createReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'currentEpochStatus',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"epochs"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVaultEpochs = /*#__PURE__*/ createReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'epochs',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"fundWallet"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVaultFundWallet = /*#__PURE__*/ createReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'fundWallet',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"getAllEpochs"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVaultGetAllEpochs = /*#__PURE__*/ createReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'getAllEpochs',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"getCurrentEpoch"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVaultGetCurrentEpoch = /*#__PURE__*/ createReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'getCurrentEpoch',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"getEpochLengthToClaim"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVaultGetEpochLengthToClaim =
  /*#__PURE__*/ createReadContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'getEpochLengthToClaim',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"hasClaimableRewards"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVaultHasClaimableRewards = /*#__PURE__*/ createReadContract(
  {
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'hasClaimableRewards',
  },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"locked"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVaultLocked = /*#__PURE__*/ createReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'locked',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"mininmumStake"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVaultMininmumStake = /*#__PURE__*/ createReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'mininmumStake',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"owner"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVaultOwner = /*#__PURE__*/ createReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVaultProxiableUuid = /*#__PURE__*/ createReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'proxiableUUID',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"userStakes"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const readEthVaultUserStakes = /*#__PURE__*/ createReadContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'userStakes',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVault = /*#__PURE__*/ createWriteContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"allocateRewards"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVaultAllocateRewards = /*#__PURE__*/ createWriteContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'allocateRewards',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"claimRewards"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVaultClaimRewards = /*#__PURE__*/ createWriteContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'claimRewards',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"claimRewardsForEpochs"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVaultClaimRewardsForEpochs =
  /*#__PURE__*/ createWriteContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'claimRewardsForEpochs',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"enter"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVaultEnter = /*#__PURE__*/ createWriteContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'enter',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"exit"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVaultExit = /*#__PURE__*/ createWriteContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'exit',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"initialize"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVaultInitialize = /*#__PURE__*/ createWriteContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"lockFundsAndRunCurrentEpoch"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVaultLockFundsAndRunCurrentEpoch =
  /*#__PURE__*/ createWriteContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'lockFundsAndRunCurrentEpoch',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"lockOrUnlockContract"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVaultLockOrUnlockContract =
  /*#__PURE__*/ createWriteContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'lockOrUnlockContract',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVaultRenounceOwnership = /*#__PURE__*/ createWriteContract(
  {
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'renounceOwnership',
  },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"setFundWallet"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVaultSetFundWallet = /*#__PURE__*/ createWriteContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'setFundWallet',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"setMinimumStake"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVaultSetMinimumStake = /*#__PURE__*/ createWriteContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'setMinimumStake',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"terminateCurrentAndOpenNextEpoch"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVaultTerminateCurrentAndOpenNextEpoch =
  /*#__PURE__*/ createWriteContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'terminateCurrentAndOpenNextEpoch',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVaultTransferOwnership = /*#__PURE__*/ createWriteContract(
  {
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'transferOwnership',
  },
)

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVaultUpgradeTo = /*#__PURE__*/ createWriteContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const writeEthVaultUpgradeToAndCall = /*#__PURE__*/ createWriteContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'upgradeToAndCall',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVault = /*#__PURE__*/ createSimulateContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"allocateRewards"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVaultAllocateRewards =
  /*#__PURE__*/ createSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'allocateRewards',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"claimRewards"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVaultClaimRewards =
  /*#__PURE__*/ createSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'claimRewards',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"claimRewardsForEpochs"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVaultClaimRewardsForEpochs =
  /*#__PURE__*/ createSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'claimRewardsForEpochs',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"enter"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVaultEnter = /*#__PURE__*/ createSimulateContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'enter',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"exit"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVaultExit = /*#__PURE__*/ createSimulateContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'exit',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"initialize"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVaultInitialize = /*#__PURE__*/ createSimulateContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"lockFundsAndRunCurrentEpoch"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVaultLockFundsAndRunCurrentEpoch =
  /*#__PURE__*/ createSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'lockFundsAndRunCurrentEpoch',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"lockOrUnlockContract"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVaultLockOrUnlockContract =
  /*#__PURE__*/ createSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'lockOrUnlockContract',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVaultRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"setFundWallet"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVaultSetFundWallet =
  /*#__PURE__*/ createSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'setFundWallet',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"setMinimumStake"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVaultSetMinimumStake =
  /*#__PURE__*/ createSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'setMinimumStake',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"terminateCurrentAndOpenNextEpoch"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVaultTerminateCurrentAndOpenNextEpoch =
  /*#__PURE__*/ createSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'terminateCurrentAndOpenNextEpoch',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVaultTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVaultUpgradeTo = /*#__PURE__*/ createSimulateContract({
  abi: ethVaultAbi,
  address: ethVaultAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ethVaultAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const simulateEthVaultUpgradeToAndCall =
  /*#__PURE__*/ createSimulateContract({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ethVaultAbi,
  address: ethVaultAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultAdminChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultBeaconUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"EpochOpened"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultEpochOpenedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'EpochOpened',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"EpochRunning"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultEpochRunningEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'EpochRunning',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"EpochTerminated"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultEpochTerminatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'EpochTerminated',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"FundWalletChanged"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultFundWalletChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'FundWalletChanged',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"FundsTransferredToFundWallet"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultFundsTransferredToFundWalletEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'FundsTransferredToFundWallet',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"Initialized"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"LockingContract"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultLockingContractEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'LockingContract',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"MinimumStakeChanged"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultMinimumStakeChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'MinimumStakeChanged',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"RewardsAllocated"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultRewardsAllocatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'RewardsAllocated',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"RewardsClaimabilityChanged"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultRewardsClaimabilityChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'RewardsClaimabilityChanged',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"Upgraded"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"UserDeposit"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultUserDepositEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'UserDeposit',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"UserRewardClaim"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultUserRewardClaimEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'UserRewardClaim',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ethVaultAbi}__ and `eventName` set to `"UserWithdraw"`
 *
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x97AD00e93366477C90B50305d31aeB66eE2Fe48E)
 */
export const watchEthVaultUserWithdrawEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ethVaultAbi,
    address: ethVaultAddress,
    eventName: 'UserWithdraw',
  })

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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const readGlobalBlacklist = /*#__PURE__*/ createReadContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"globalOwner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const readGlobalBlacklistGlobalOwner = /*#__PURE__*/ createReadContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
  functionName: 'globalOwner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"isBlacklisted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const readGlobalBlacklistOwner = /*#__PURE__*/ createReadContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const writeGlobalBlacklist = /*#__PURE__*/ createWriteContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"blacklist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const writeGlobalBlacklistBlacklist = /*#__PURE__*/ createWriteContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
  functionName: 'blacklist',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const writeGlobalBlacklistUpgradeTo = /*#__PURE__*/ createWriteContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const simulateGlobalBlacklist = /*#__PURE__*/ createSimulateContract({
  abi: globalBlacklistAbi,
  address: globalBlacklistAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalBlacklistAbi}__ and `functionName` set to `"blacklist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const watchGlobalBlacklistEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: globalBlacklistAbi, address: globalBlacklistAddress },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const watchGlobalBlacklistBeaconUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"Blacklisted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const watchGlobalBlacklistBlacklistedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'Blacklisted',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const watchGlobalBlacklistOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"Unblacklisted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 */
export const watchGlobalBlacklistUnblacklistedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: globalBlacklistAbi,
    address: globalBlacklistAddress,
    eventName: 'Unblacklisted',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalBlacklistAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xFC71827E981Fe166299736f1A1CCc4f5d3a2597E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x9bD7AF4a9Af603A0f4f53d39Ab2a97Cea7E4A7e6)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7fbE57dD4Ba76CACBFfBA821EE0B7faa240a11bf)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1549647606A71B2a79b85AEb54631b8eA2a1939a)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const readGlobalOwner = /*#__PURE__*/ createReadContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const readGlobalOwnerOwner = /*#__PURE__*/ createReadContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"pendingOwner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const readGlobalOwnerPendingOwner = /*#__PURE__*/ createReadContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
  functionName: 'pendingOwner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const readGlobalOwnerProxiableUuid = /*#__PURE__*/ createReadContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
  functionName: 'proxiableUUID',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalOwnerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const writeGlobalOwner = /*#__PURE__*/ createWriteContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const writeGlobalOwnerInitialize = /*#__PURE__*/ createWriteContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const writeGlobalOwnerUpgradeTo = /*#__PURE__*/ createWriteContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const simulateGlobalOwner = /*#__PURE__*/ createSimulateContract({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalOwnerAbi}__ and `functionName` set to `"acceptOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 */
export const watchGlobalOwnerEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: globalOwnerAbi,
  address: globalOwnerAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalOwnerAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x730C21c81F2baaDEB54daD63050D42474a824900)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x4717bca6978f1BCAb59b7bc0B6849aba6062834c)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0xDbac01A784fB7E5F1Ae9c8d61f776A2d9d59faB6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xe4Af4573bFc5F04D8b84c61744de8A94059f2462)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xd42B1065Ac03F3965b11ef19ee98b0165A2C4E53)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0xcA55A2394876e7Cf52e99Ab36Fc9151a7d9CF350)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const readGlobalPause = /*#__PURE__*/ createReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"globalOwner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const readGlobalPauseGlobalOwner = /*#__PURE__*/ createReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'globalOwner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const readGlobalPauseOwner = /*#__PURE__*/ createReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const readGlobalPausePaused = /*#__PURE__*/ createReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'paused',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const readGlobalPauseProxiableUuid = /*#__PURE__*/ createReadContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'proxiableUUID',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const writeGlobalPause = /*#__PURE__*/ createWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const writeGlobalPauseInitialize = /*#__PURE__*/ createWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const writeGlobalPausePause = /*#__PURE__*/ createWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const writeGlobalPauseUnpause = /*#__PURE__*/ createWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const writeGlobalPauseUpgradeTo = /*#__PURE__*/ createWriteContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const simulateGlobalPause = /*#__PURE__*/ createSimulateContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const simulateGlobalPausePause = /*#__PURE__*/ createSimulateContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const simulateGlobalPauseUnpause = /*#__PURE__*/ createSimulateContract({
  abi: globalPauseAbi,
  address: globalPauseAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link globalPauseAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 */
export const watchGlobalPauseEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: globalPauseAbi,
  address: globalPauseAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link globalPauseAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f6eB78d4A05Ef3Ec6a0194A552e08f804d46e8E)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x30b62e9e4aA50Cab8974433CD1EB1C1C7fc40078)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x4fB551213757619558A93a599a08524e9Dd59C67)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd4D4c68CE70fa88B9E527DD3A4a6d19c5cbdd4dB)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x061b0B71B87Bd4Ff6086011a17589ea08DaA49A5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x06f54B7f27eEC56616b951598BaA3B84D7660AB4)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const readLdy = /*#__PURE__*/ createReadContract({
  abi: ldyAbi,
  address: ldyAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"allowance"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const readLdyAllowance = /*#__PURE__*/ createReadContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"balanceOf"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const readLdyBalanceOf = /*#__PURE__*/ createReadContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"decimals"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const readLdyDecimals = /*#__PURE__*/ createReadContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"name"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const readLdyName = /*#__PURE__*/ createReadContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"symbol"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const readLdySymbol = /*#__PURE__*/ createReadContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"totalSupply"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const readLdyTotalSupply = /*#__PURE__*/ createReadContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const writeLdy = /*#__PURE__*/ createWriteContract({
  abi: ldyAbi,
  address: ldyAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const writeLdyApprove = /*#__PURE__*/ createWriteContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const writeLdyBurn = /*#__PURE__*/ createWriteContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"burnFrom"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const writeLdyBurnFrom = /*#__PURE__*/ createWriteContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'burnFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const writeLdyDecreaseAllowance = /*#__PURE__*/ createWriteContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'decreaseAllowance',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const writeLdyIncreaseAllowance = /*#__PURE__*/ createWriteContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'increaseAllowance',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const writeLdyTransfer = /*#__PURE__*/ createWriteContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const writeLdyTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const simulateLdy = /*#__PURE__*/ createSimulateContract({
  abi: ldyAbi,
  address: ldyAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const simulateLdyApprove = /*#__PURE__*/ createSimulateContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const simulateLdyBurn = /*#__PURE__*/ createSimulateContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"burnFrom"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const simulateLdyBurnFrom = /*#__PURE__*/ createSimulateContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'burnFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"decreaseAllowance"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const simulateLdyDecreaseAllowance =
  /*#__PURE__*/ createSimulateContract({
    abi: ldyAbi,
    address: ldyAddress,
    functionName: 'decreaseAllowance',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"increaseAllowance"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const simulateLdyIncreaseAllowance =
  /*#__PURE__*/ createSimulateContract({
    abi: ldyAbi,
    address: ldyAddress,
    functionName: 'increaseAllowance',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const simulateLdyTransfer = /*#__PURE__*/ createSimulateContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const simulateLdyTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: ldyAbi,
  address: ldyAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyAbi}__
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const watchLdyEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ldyAbi,
  address: ldyAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyAbi}__ and `eventName` set to `"Approval"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const watchLdyApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ldyAbi,
  address: ldyAddress,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyAbi}__ and `eventName` set to `"Transfer"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x8584BCd220A048104e654F842C56E33d37d6aEe3)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 */
export const watchLdyTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ldyAbi,
  address: ldyAddress,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStaking = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"MULTIPLIER_BASIS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingMultiplierBasis = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'MULTIPLIER_BASIS',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"earned"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingEarned = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'earned',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"finishAt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingFinishAt = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'finishAt',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"getEarnedUser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingGetEarnedUser = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'getEarnedUser',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"getStakeDurationInfo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingGetStakeDurationInfo =
  /*#__PURE__*/ createReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'getStakeDurationInfo',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"getUserStakes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingGetUserStakes = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'getUserStakes',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"globalBlacklist"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingGlobalBlacklist = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'globalBlacklist',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"globalOwner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingGlobalOwner = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'globalOwner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"globalPause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingGlobalPause = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'globalPause',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"highTierAccounts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingHighTierAccounts = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'highTierAccounts',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"lastTimeRewardApplicable"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingLastTimeRewardApplicable =
  /*#__PURE__*/ createReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'lastTimeRewardApplicable',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"lastUpdateTime"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingLastUpdateTime = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'lastUpdateTime',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingOwner = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingPaused = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'paused',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingProxiableUuid = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'proxiableUUID',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingRenounceOwnership = /*#__PURE__*/ createReadContract(
  {
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'renounceOwnership',
  },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"rewardPerToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingRewardPerToken = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'rewardPerToken',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"rewardPerTokenStored"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingRewardPerTokenStored =
  /*#__PURE__*/ createReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'rewardPerTokenStored',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"rewardRatePerSec"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingRewardRatePerSec = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'rewardRatePerSec',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"rewardsDuration"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingRewardsDuration = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'rewardsDuration',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"stakeAmountForPerks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingStakeAmountForPerks =
  /*#__PURE__*/ createReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'stakeAmountForPerks',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"stakeDurationForPerks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingStakeDurationForPerks =
  /*#__PURE__*/ createReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'stakeDurationForPerks',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"stakeDurationInfos"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingStakeDurationInfos =
  /*#__PURE__*/ createReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'stakeDurationInfos',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"stakeRewardToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingStakeRewardToken = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'stakeRewardToken',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"tierOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingTierOf = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'tierOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"totalRewards"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingTotalRewards = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'totalRewards',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"totalStaked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingTotalStaked = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'totalStaked',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"totalWeightedStake"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingTotalWeightedStake =
  /*#__PURE__*/ createReadContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'totalWeightedStake',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingTransferOwnership = /*#__PURE__*/ createReadContract(
  {
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'transferOwnership',
  },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"userStakingInfo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const readLdyStakingUserStakingInfo = /*#__PURE__*/ createReadContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'userStakingInfo',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const writeLdyStaking = /*#__PURE__*/ createWriteContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"getReward"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const writeLdyStakingGetReward = /*#__PURE__*/ createWriteContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'getReward',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const writeLdyStakingInitialize = /*#__PURE__*/ createWriteContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"notifyRewardAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const writeLdyStakingNotifyRewardAmount =
  /*#__PURE__*/ createWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'notifyRewardAmount',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"pushStakeDurationInfo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const writeLdyStakingPushStakeDurationInfo =
  /*#__PURE__*/ createWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'pushStakeDurationInfo',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"recoverERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const writeLdyStakingRecoverErc20 = /*#__PURE__*/ createWriteContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'recoverERC20',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setRewardsDuration"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const writeLdyStakingSetRewardsDuration =
  /*#__PURE__*/ createWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setRewardsDuration',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setStakeAmountForPerks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const writeLdyStakingSetStakeAmountForPerks =
  /*#__PURE__*/ createWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setStakeAmountForPerks',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setStakeDurationForPerks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const writeLdyStakingSetStakeDurationForPerks =
  /*#__PURE__*/ createWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setStakeDurationForPerks',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"stake"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const writeLdyStakingStake = /*#__PURE__*/ createWriteContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'stake',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"unstake"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const writeLdyStakingUnstake = /*#__PURE__*/ createWriteContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'unstake',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const writeLdyStakingUpgradeTo = /*#__PURE__*/ createWriteContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const writeLdyStakingUpgradeToAndCall =
  /*#__PURE__*/ createWriteContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const simulateLdyStaking = /*#__PURE__*/ createSimulateContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"getReward"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const simulateLdyStakingGetReward = /*#__PURE__*/ createSimulateContract(
  { abi: ldyStakingAbi, address: ldyStakingAddress, functionName: 'getReward' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const simulateLdyStakingInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"notifyRewardAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const simulateLdyStakingNotifyRewardAmount =
  /*#__PURE__*/ createSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'notifyRewardAmount',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"pushStakeDurationInfo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const simulateLdyStakingPushStakeDurationInfo =
  /*#__PURE__*/ createSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'pushStakeDurationInfo',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"recoverERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const simulateLdyStakingRecoverErc20 =
  /*#__PURE__*/ createSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'recoverERC20',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setRewardsDuration"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const simulateLdyStakingSetRewardsDuration =
  /*#__PURE__*/ createSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setRewardsDuration',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setStakeAmountForPerks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const simulateLdyStakingSetStakeAmountForPerks =
  /*#__PURE__*/ createSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setStakeAmountForPerks',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"setStakeDurationForPerks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const simulateLdyStakingSetStakeDurationForPerks =
  /*#__PURE__*/ createSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'setStakeDurationForPerks',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"stake"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const simulateLdyStakingStake = /*#__PURE__*/ createSimulateContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'stake',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"unstake"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const simulateLdyStakingUnstake = /*#__PURE__*/ createSimulateContract({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
  functionName: 'unstake',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"upgradeTo"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const simulateLdyStakingUpgradeTo = /*#__PURE__*/ createSimulateContract(
  { abi: ldyStakingAbi, address: ldyStakingAddress, functionName: 'upgradeTo' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ldyStakingAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const simulateLdyStakingUpgradeToAndCall =
  /*#__PURE__*/ createSimulateContract({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const watchLdyStakingEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ldyStakingAbi,
  address: ldyStakingAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const watchLdyStakingAdminChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'AdminChanged',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const watchLdyStakingBeaconUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'BeaconUpgraded',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"Initialized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const watchLdyStakingInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"NotifiedRewardAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const watchLdyStakingNotifiedRewardAmountEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'NotifiedRewardAmount',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const watchLdyStakingOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"Paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const watchLdyStakingPausedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'Paused',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"RewardPaid"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const watchLdyStakingRewardPaidEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'RewardPaid',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"Staked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const watchLdyStakingStakedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'Staked',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"Unpaused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const watchLdyStakingUnpausedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'Unpaused',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"Unstaked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const watchLdyStakingUnstakedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'Unstaked',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ldyStakingAbi}__ and `eventName` set to `"Upgraded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2AeDFB927Aa2aE87c220b9071c0A1209786b5C5e)
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0xd132b6D2cfACa8B5b9e0bA8004Df6275380fa895)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x98002b5c06b44c8769dA3DAe97CA498aB6F97137)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x7A78A93dad6A64d0A92C913C008dC79dBf919Fa6)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0xB5C69197e5D6A52c776384479B529D2d76f9e2De)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x5BFFC5303719f0dC6050a2D8042936714109985f)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x20Cb912b0E1B8018F2E308A7f6f2Da66754923E4)
 */
export const watchLdyStakingUpgradedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ldyStakingAbi,
    address: ldyStakingAddress,
    eventName: 'Upgraded',
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
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"withdrawalFeeInEth"`
 */
export const readLTokenWithdrawalFeeInEth = /*#__PURE__*/ createReadContract({
  abi: lTokenAbi,
  functionName: 'withdrawalFeeInEth',
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
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setWithdrawalFeeInEth"`
 */
export const writeLTokenSetWithdrawalFeeInEth =
  /*#__PURE__*/ createWriteContract({
    abi: lTokenAbi,
    functionName: 'setWithdrawalFeeInEth',
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
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenAbi}__ and `functionName` set to `"setWithdrawalFeeInEth"`
 */
export const simulateLTokenSetWithdrawalFeeInEth =
  /*#__PURE__*/ createSimulateContract({
    abi: lTokenAbi,
    functionName: 'setWithdrawalFeeInEth',
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const readLTokenSignaler = /*#__PURE__*/ createReadContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"globalOwner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const readLTokenSignalerGlobalOwner = /*#__PURE__*/ createReadContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
  functionName: 'globalOwner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const readLTokenSignalerOwner = /*#__PURE__*/ createReadContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const writeLTokenSignaler = /*#__PURE__*/ createWriteContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const writeLTokenSignalerInitialize = /*#__PURE__*/ createWriteContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"signalLToken"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const writeLTokenSignalerUpgradeTo = /*#__PURE__*/ createWriteContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
  functionName: 'upgradeTo',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const simulateLTokenSignaler = /*#__PURE__*/ createSimulateContract({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
 */
export const watchLTokenSignalerEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: lTokenSignalerAbi,
  address: lTokenSignalerAddress,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link lTokenSignalerAbi}__ and `eventName` set to `"AdminChanged"`
 *
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on X1 Testnet Ok Link__](https://www.oklink.com/x1-test/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on X Layer Mainnet Ok Link__](https://www.oklink.com/xlayer/address/0x011C5B18aBC74A341209b12D1A6fD7B59E423428)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x627Ff3485a2e34916a6E1c0D0b350A422F5d89D1)
 * - [__View Contract on Linea Goerli Testnet Etherscan__](https://goerli.lineascan.build/address/0x04a678103bE57c3d81100fe08e43C94e50adC37B)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xBA427517505b14C560854aED003304Fc69cbadfb)
 * - [__View Contract on Base Sepolia Basescan__](https://sepolia.basescan.org/address/0x7A02c93681450241e97C87a2Decb511b42BB16f5)
 * - [__View Contract on Arbitrum Goerli Arbiscan__](https://goerli.arbiscan.io/address/0x1dA817E33C0dB209C7b508B79F9dac4480f94522)
 * - [__View Contract on Arbitrum Sepolia Arbiscan__](https://sepolia.arbiscan.io/address/0x8AeD5D3C5844D26671Ae63BE08aD2A6903BD293e)
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
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const watchPreMiningPausedEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: preMiningAbi, address: preMiningAddress, eventName: 'Paused' },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link preMiningAbi}__ and `eventName` set to `"Unpaused"`
 *
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0x9d7AEDefE90B880c5a9Bed4FcBd3faD0ea5AA06c)
 * - [__View Contract on Linea Mainnet Etherscan__](https://lineascan.build/address/0xd54d564606611A3502FE8909bBD3075dbeb77813)
 */
export const watchPreMiningUnpausedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: preMiningAbi,
    address: preMiningAddress,
    eventName: 'Unpaused',
  })
