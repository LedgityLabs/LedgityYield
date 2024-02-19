import { hardhat, arbitrum, arbitrumGoerli, lineaTestnet, linea, Chain } from "@wagmi/core/chains";

// Build chain icons map
export const chainsIcons = {
  31337: "/assets/chains/hardhat.svg",
  421613: "/assets/chains/arbitrum-goerli.png",
  42161: "/assets/chains/arbitrum.svg",
  59140: "/assets/chains/linea-goerli.png",
  59144: "/assets/chains/linea.png",
  195: "/assets/chains/okxlogo.png",
} as { [key: number]: string };

const okcTestnet: Chain = {
  id: 195,
  name: 'OKC X1 Testnet',
  network: 'okc-X1-testnet',
  nativeCurrency: {
    name: 'Testnet OKB',
    symbol: 'OKB', 
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testrpc.x1.tech']
    } 
  },
  blockExplorers: {
    default: { name: 'OKLink', url: 'https://www.oklink.com/x1-test' }, 
  },
  testnet: true,
};
/// Figure whether we're in dev or prod environment
let chainsEnv: "prod" | "dev" = "prod";
if (process.env.VERCEL_ENV === "preview") chainsEnv = "dev";
if (process.env.NODE_ENV !== "production") chainsEnv = "dev";

// Build chain lists for each environment, and export chains for the current one
const prodChains: readonly [Chain, ...Chain[]] = [arbitrum, linea, okcTestnet];
const devChains: readonly [Chain, ...Chain[]] = [
  ...prodChains,
  hardhat,
  arbitrumGoerli,
  lineaTestnet,
];
export const chains: readonly [Chain, ...Chain[]] = chainsEnv === "prod" ? prodChains : devChains;
