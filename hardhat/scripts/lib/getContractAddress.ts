import { getChainId } from "./getChainId";
import { contracts, ContractId } from "../../deployments";

export function getContractAddress(contractId: ContractId) {
  const chainId = getChainId();
  let contractAddress: `0x${string}`;

  // Try to retrieve the contract address from the deployments file
  // Error if not found
  try {
    contractAddress = contracts[contractId].address[chainId]!;
  } catch (e) {
    throw new Error(
      `Address of contract '${contractId}' on '${chainId}' network not found in contracts.ts file.`
    );
  }
  return contractAddress;
}
