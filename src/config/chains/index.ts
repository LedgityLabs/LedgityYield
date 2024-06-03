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
  XLAYER_TESTNET = Number(195),
  XLAYER = Number(196),
}

export const SUBGRAPH_CLIENT_URLS = {
  [ChainId.BASE_SEPOLIA]:
    "https://api.studio.thegraph.com/query/60646/ldystaking-subgraph/version/latest",
  [ChainId.ETHEREUM_SEPOLIA]:
    "https://api.studio.thegraph.com/query/60646/ledgity-sepolia/version/latest",
  [ChainId.XLAYER]: "https://api.studio.thegraph.com/query/60646/ledgity-okxmain/version/latest",
  [ChainId.ETHEREUM]:
    "https://api.studio.thegraph.com/query/60646/ledgity-eth-mainnet/version/latest",
} satisfies Record<ChainId, string>;
