import { Chain } from "wagmi";
import { hardhat as _hardhat, arbitrum, arbitrumGoerli, lineaTestnet, linea } from "wagmi/chains";
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
    etherscan: { name: "HashScan", url: "https://hashscan.io/" },
    default: { name: "HashScan", url: "https://hashscan.io/" },
  },
};

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
