import {
  mainnet,
  hardhat,
  lineaTestnet,
  Chain,
  baseSepolia,
  sepolia,
  arbitrumSepolia,
  // arbitrum,
  // linea
} from "@wagmi/core/chains";

// Build chain icons map
export const chainsIcons = {
  1: "/assets/chains/ethereum-mainnet.svg",
  31337: "/assets/chains/hardhat.svg",
  421613: "/assets/chains/arbitrum-goerli.png",
  42161: "/assets/chains/arbitrum.svg",
  421614: "/assets/chains/arbitrum.svg",
  59140: "/assets/chains/linea-goerli.png",
  59144: "/assets/chains/linea.png",
  195: "/assets/chains/okxlogo.png",
  196: "/assets/chains/okxlogo.png",
  8453: "/assets/chains/base.png",
  84532: "/assets/chains/base.png",
  11155111: "/assets/chains/ethereum-sepolia.png",
} as { [key: number]: string };

const xlayerTestnet: Chain = {
  id: 195,
  name: "OKX Layer Testnet",
  nativeCurrency: {
    name: "Testnet OKB",
    symbol: "OKB",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testrpc.x1.tech"],
    },
  },
  blockExplorers: {
    default: { name: "OKLink", url: "https://www.oklink.com/x1-test" },
  },
  testnet: true,
};

const xlayerMainnet: Chain = {
  id: 196,
  name: "OKX Layer",
  nativeCurrency: {
    name: "Mainnet OKB",
    symbol: "OKB",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.xlayer.tech"],
    },
  },
  blockExplorers: {
    default: { name: "OKLink", url: "https://www.oklink.com/xlayer" },
  },
  testnet: false,
};

const arbitrum: Chain = {
  id: 42_161,
  name: 'Arbitrum One',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://arb-mainnet.g.alchemy.com/v2/Ui4vv-Z6n-6lAyB9spGYJL1pV3MDNnTh'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arbiscan',
      url: 'https://arbiscan.io',
      apiUrl: 'https://api.arbiscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 7654707,
    },
  },
};

const linea: Chain = {
  id: 59144,
  name: 'Linea Mainnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://linea-mainnet.g.alchemy.com/v2/Ui4vv-Z6n-6lAyB9spGYJL1pV3MDNnTh'],
    },
    public: {
      http: ['https://linea-mainnet.g.alchemy.com/v2/Ui4vv-Z6n-6lAyB9spGYJL1pV3MDNnTh'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Lineascan', 
      url: 'https://lineascan.build',
      apiUrl: 'https://api.lineascan.build/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 42,
    },
  },
};

/// Figure whether we're in dev or prod environment
let chainsEnv: "prod" | "dev" = "prod";
if (process.env.VERCEL_ENV === "preview") chainsEnv = "dev";
if (process.env.NODE_ENV !== "production") chainsEnv = "dev";

// Build chain lists for each environment, and export chains for the current one
const prodChains: readonly [Chain, ...Chain[]] = [
  mainnet,
  arbitrum,
  linea,
  xlayerMainnet,
];
const devChains: readonly [Chain, ...Chain[]] = [
  sepolia,
  hardhat,
  lineaTestnet,
  baseSepolia,
  arbitrumSepolia,
  arbitrum,
  linea,
  // ...prodChains,
  // xlayerTestnet,
  // xlayerMainnet,
];
export const chains: readonly [Chain, ...Chain[]] = chainsEnv === "prod" ? prodChains : devChains;