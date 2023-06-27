import { ContractId, contracts, lTokensIds } from "../../hardhat/deployments";
import { useDApp } from "./useDApp";

export const useAvailableLTokens = () => {
  const { chain } = useDApp();
  const availableLTokensIds = lTokensIds.filter((id) => contracts[id].address[chain.id]);
  return availableLTokensIds;
};
