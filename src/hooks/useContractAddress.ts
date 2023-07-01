import { getContractAddress } from "@/lib/getContractAddress";
import { ContractId } from "../../hardhat/deployments";
import { usePublicClient } from "wagmi";

export const useContractAddress = (contractId: ContractId) => {
  const publicClient = usePublicClient();
  if (!publicClient.chain) return null;
  return getContractAddress(contractId, publicClient.chain.id);
};
