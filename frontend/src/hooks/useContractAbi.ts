import { getContractAbi } from "@/lib/getContractAbi";
import { useCurrentChain } from "./useCurrentChain";

export const useContractAbi = (contractName: string) => {
  // Return undefined if the frontend is not connected to any chain
  const chain = useCurrentChain();
  if (!chain || !chain.id) return undefined;

  // Else, try to get the contract address on the current chain
  return getContractAbi(contractName, chain.id);
};
