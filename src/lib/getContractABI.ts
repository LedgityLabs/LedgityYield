import { ContractId, contracts } from "../../contracts/deployments";

export const getContractABI = (contractId: ContractId) => {
  const contract = contracts[contractId];
  if (contract) {
    const abi = contract.abi;
    if (abi) return abi;
  }
  return undefined;
};
