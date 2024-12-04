import {
  arbitrum,
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
  LINEA = linea.id,
  LINEA_GOERLI = lineaTestnet.id,
  BASE = base.id,
  BASE_SEPOLIA = baseSepolia.id,
}

export const SUBGRAPH_CLIENT_URLS = {
  [ChainId.BASE_SEPOLIA]:
    "https://api.studio.thegraph.com/query/60646/ldystaking-subgraph/version/latest",
  [ChainId.ETHEREUM_SEPOLIA]:
    "https://api.studio.thegraph.com/query/60646/ledgity-sepolia/version/latest",
  [ChainId.ETHEREUM]:
    "https://api.studio.thegraph.com/query/60646/ledgity-eth-mainnet/version/latest",
  [ChainId.ARBITRUM_ONE]:
    "https://subgraph.satsuma-prod.com/8a26f33a279b/ledgity--128781/ledgity-arbi-main/api",
  [ChainId.BASE]:
    "https://subgraph.satsuma-prod.com/8a26f33a279b/ledgity--128781/ledgity-base/api",
  [ChainId.LINEA]:
    "https://subgraph.satsuma-prod.com/8a26f33a279b/ledgity--128781/ledgity-linea/api"
} satisfies Record<ChainId, string>;
