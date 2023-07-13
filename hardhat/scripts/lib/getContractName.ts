import { contracts, ContractId } from "../../deployments";

export function getContractName(contractId: ContractId) {
  // Try to retrieve the contract address from the deployments file, error if not found
  let contract = contracts[contractId];
  if (!contract) throw new Error(
    `Contract '${contractId}' not found in deployments.ts file.`
  );
  return contract.contractName ? contract.contractName : contractId;
}
