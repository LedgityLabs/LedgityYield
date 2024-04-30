import {
  hardhat,
  arbitrum,
  arbitrumGoerli,
  lineaTestnet,
  linea,
  base,
  baseSepolia,
  arbitrumSepolia,
  sepolia,
  mainnet,
} from "@wagmi/core/chains";

export enum ChainId {
  ETHEREUM = mainnet.id,
  ETHEREUM_SEPOLIA = sepolia.id,
  ARBITRUM_ONE = arbitrum.id,
  ARBITRUM_SEPOLIA = arbitrumSepolia.id,
  ARBITRUM_GOERLI = arbitrumGoerli.id,
  LINEA = linea.id,
  LINEA_GOERLI = lineaTestnet.id,
  BASE = base.id,
  BASE_SEPOLIA = baseSepolia.id,
  OKX_TESTNET = Number(195),
}

export const SUBGRAPH_CLIENT_URLS = {
  [ChainId.BASE_SEPOLIA]:
    "https://api.studio.thegraph.com/query/60646/ldystaking-subgraph/version/latest",
} satisfies Record<ChainId, string>;
