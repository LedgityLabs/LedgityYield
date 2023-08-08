import deployments from "../../contracts/deployments.json";
import dependencies from "../../contracts/dependencies.json";

export const getContractAddress = (
  contractName: string,
  networkId: number | string,
): `0x${string}` | undefined => {
  let contractAddress: `0x${string}` | undefined;
  // Ensure networkId is a string
  networkId = networkId.toString();

  // Search address in dependencies
  // @ts-ignore
  if (dependencies[contractName] && dependencies[contractName][networkId]) {
    // @ts-ignore
    contractAddress = dependencies[contractName][networkId];
  }

  // If not found yet, search it in deployed contracts
  if (!contractAddress) {
    // @ts-ignore
    if (deployments[networkId] && deployments[networkId][0].contracts[contractName]) {
      // @ts-ignore
      contractAddress = deployments[networkId][0].contracts[contractName].address;
    }
  }

  // Return address
  return contractAddress;
};
