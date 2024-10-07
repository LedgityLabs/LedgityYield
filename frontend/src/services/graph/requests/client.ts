import { GraphQLClient } from "graphql-request";
import { ChainId, SUBGRAPH_CLIENT_URLS } from "@/config/chains";

export const graphClientWithChain = (chainId: ChainId) => {
  return new GraphQLClient(SUBGRAPH_CLIENT_URLS[chainId]);
};
