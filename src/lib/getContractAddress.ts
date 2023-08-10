import deployments from "../../contracts/deployments.json";
import dependencies from "../../contracts/dependencies.json";

export const getContractAddress = (
  contractName: string,
  chainId: number | string,
): `0x${string}` | undefined => {
  let contractAddress: `0x${string}` | undefined;

  // Ensure chainId is a string
  chainId = chainId.toString();

  // Search address in dependencies
  // @ts-ignore
  if (dependencies[contractName] && dependencies[contractName][chainId]) {
    // @ts-ignore
    contractAddress = dependencies[contractName][chainId];
  }

  // If not found yet, search it in deployed contracts
  if (!contractAddress) {
    // @ts-ignore
    if (deployments[chainId] && deployments[chainId][0].contracts[contractName]) {
      // @ts-ignore
      contractAddress = deployments[chainId][0].contracts[contractName].address;
    }
  }

  // Return address
  return contractAddress;
};
