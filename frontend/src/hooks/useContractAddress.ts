import { getContractAddress } from "@/lib/getContractAddress";
import { useCurrentChain } from "./useCurrentChain";

export const useContractAddress = (contractName: string) => {
  // Return undefined if the frontend is not connected to any chain
  const currentChain = useCurrentChain();
  if (!currentChain) return undefined;

  // Else, try to get the contract address on the current chain
  return getContractAddress(contractName, currentChain.id);
};
