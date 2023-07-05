import { contracts, lTokensIds } from "../../hardhat/deployments";
import { usePublicClient } from "wagmi";

export const useAvailableLTokens = () => {
  const publicClient = usePublicClient();
  if (!publicClient.chain) return [];
  const availableLTokensIds = lTokensIds.filter((id) => contracts[id].address[publicClient.chain.id]);
  return availableLTokensIds;
};
