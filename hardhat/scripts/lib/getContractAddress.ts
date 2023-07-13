import { getChainId } from "./getChainId";
import { contracts, ContractId } from "../../deployments";

export function getContractAddress(contractId: ContractId) {
  const chainId = getChainId();
  let contractAddress: `0x${string}`;

  // Try to retrieve the contract address from the deployments file
  // Error if not found
  const err = new Error(
    `Address of contract '${contractId}' on '${chainId}' network not found in deployments.ts file.`
  );
  try {
    contractAddress = contracts[contractId].address[chainId]!;
    if (!contractAddress) throw err;
  } catch (e) {
    throw err;
  }
  return contractAddress;
}
