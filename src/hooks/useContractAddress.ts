import { getContractAddress } from "@/lib/getContractAddress";
import { usePublicClient } from "wagmi";

export const useContractAddress = (contractName: string) => {
  // Return undefined if the frontend is not connected to any chain
  const publicClient = usePublicClient();
  if (!publicClient.chain) return undefined;

  // Else, try to get the contract address on the current chain
  return getContractAddress(contractName, publicClient.chain.id);
};
