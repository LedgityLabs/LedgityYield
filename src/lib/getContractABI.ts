import deployments from "../../contracts/deployments.json";
import dependencies from "../../contracts/dependencies.json";
export const getContractABI = (contractName: string, chainId: number | string) => {
  let contractABI: any | undefined;

  // Ensure chainId is a string
  chainId = chainId.toString();

  // Search ABI in dependencies
  // @ts-ignore
  // if (dependencies[contractName] && dependencies[contractName][chainId]) {
  //   // @ts-ignore
  //   contractAddress = dependencies[contractName][chainId];
  // }

  // If not found yet, search it in deployed contracts
  if (!contractABI) {
    // @ts-ignore
    if (deployments[chainId] && deployments[chainId][0].contracts[contractName]) {
      // @ts-ignore
      contractABI = deployments[chainId][0].contracts[contractName].abi;
    }
  }

  // Return address
  return contractABI;
};
