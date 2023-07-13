import { getContractAddress } from "@/lib/getContractAddress";
import { ContractId } from "../../contracts/deployments";
import { usePublicClient } from "wagmi";

export const useContractAddress = (contractId: ContractId): `0x${string}` | undefined => {
  const publicClient = usePublicClient();
  if (!publicClient.chain) return undefined;
  return getContractAddress(contractId, publicClient.chain.id);
};
