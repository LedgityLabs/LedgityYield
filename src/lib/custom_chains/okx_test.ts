import { defineChain } from '../../utils/chain/defineChain.js'

export const arbitrum = /*#__PURE__*/ defineChain({
  id: 42_161,
  name: 'Arbitrum One',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://arb1.arbitrum.io/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arbiscan',
      url: 'https://arbiscan.io',
      apiUrl: 'https://api.arbiscan.io/api',
    },
  },
 
})
