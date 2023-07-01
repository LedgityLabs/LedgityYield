import { Chain } from "wagmi";
import { arbitrum, avalanche, hardhat as _hardhat, mainnet, polygon, sepolia } from "wagmi/chains";
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

const hardhat: Chain = {
  ..._hardhat,
  contracts: {
    multicall3: {
      address: getContractAddress("Multicall3", 31337),
    },
  },
};

// Build chain icons map
export const chainsIcons = {
  1: "/assets/chains/ethereum.svg",
  137: "/assets/chains/polygon.svg",
  42161: "/assets/chains/arbitrum.svg",
  43114: "/assets/chains/avalanche.svg",
  295: "/assets/chains/hedera.svg",
  31337: "/assets/chains/hardhat.svg",
  11155111: "/assets/chains/sepolia.png",
} as { [key: number]: string };

// Figure whether we're in dev or prod environment
let chainsEnv: "prod" | "dev" = "prod";
if (process.env.VERCEL_ENV === "preview") chainsEnv = "dev";
if (process.env.NODE_ENV !== "production") chainsEnv = "dev";

// Build chain lists for each environment, and export chains for the current one
const prodChains = [mainnet, polygon, arbitrum, avalanche, hederaChain];
const devChains = [...prodChains, sepolia, hardhat];
// export const chains = chainsEnv === "prod" ? prodChains : devChains;
export const chains = devChains;
