import { getContractAddress } from "@/lib/getContractAddress";
import { ContractId } from "../../hardhat/deployments";
import { useDApp } from "./useDApp";

export const useContractAddress = (contractId: ContractId) => {
  const { chain } = useDApp();
  return getContractAddress(contractId, chain.id);
};
