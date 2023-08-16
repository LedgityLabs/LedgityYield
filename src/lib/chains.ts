import { Chain } from "wagmi";
import { hardhat as _hardhat, arbitrum, arbitrumGoerli, lineaTestnet } from "wagmi/chains";
import { getContractAddress } from "./getContractAddress";

// Custom chains
const hederaChain: Chain = {
  id: 295,
  name: "Hedera",
  network: "hedera",
  nativeCurrency: {
    decimals: 8,
    name: "Hedera",
    symbol: "HBAR",
  },
  rpcUrls: {
    public: { http: ["https://mainnet.hashio.io/api"] },
    default: { http: ["https://mainnet.hashio.io/api"] },
  },
  blockExplorers: {
    hashscan: { name: "HashScan", url: "https://hashscan.io/" },
    default: { name: "HashScan", url: "https://hashscan.io/" },
  },
};

// To replace by the Wagmi implementation when wagmi@1.6.1 is released
export const linea = {
  id: 59_144,
  name: "Linea",
  network: "linea-mainnet",
  nativeCurrency: { name: "Linea Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    infura: {
      http: ["https://linea-mainnet.infura.io/v3"],
      webSocket: ["wss://linea-mainnet.infura.io/ws/v3"],
    },
    default: {
      http: ["https://rpc.linea.build"],
      webSocket: ["wss://rpc.linea.build"],
    },
    public: {
      http: ["https://rpc.linea.build"],
      webSocket: ["wss://rpc.linea.build"],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://lineascan.build",
    },
    etherscan: {
      name: "Etherscan",
      url: "https://lineascan.build",
    },
    blockscout: {
      name: "Blockscout",
      url: "https://explorer.linea.build",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 42,
    },
  },
  testnet: false,
} as const satisfies Chain;

// Augment hardhat chain with multicall3 contract address
const hardhat: Chain = {
  ..._hardhat,
};
const hardhatMulticall3Address = getContractAddress("Multicall3", 31337);
if (hardhatMulticall3Address)
  hardhat.contracts = {
    multicall3: {
      address: hardhatMulticall3Address,
    },
  };

// Build chain icons map
export const chainsIcons = {
  295: "/assets/chains/hedera.svg",
  31337: "/assets/chains/hardhat.svg",
  421613: "/assets/chains/arbitrum-goerli.png",
  42161: "/assets/chains/arbitrum.svg",
  59140: "/assets/chains/linea-goerli.png",
  59144: "/assets/chains/linea.png",
} as { [key: number]: string };

// Figure whether we're in dev or prod environment
let chainsEnv: "prod" | "dev" = "prod";
if (process.env.VERCEL_ENV === "preview") chainsEnv = "dev";
if (process.env.NODE_ENV !== "production") chainsEnv = "dev";

// Build chain lists for each environment, and export chains for the current one
const prodChains = [arbitrum, linea];
const devChains = [...prodChains, hederaChain, hardhat, arbitrumGoerli, lineaTestnet];
export const chains = chainsEnv === "prod" ? prodChains : devChains;
