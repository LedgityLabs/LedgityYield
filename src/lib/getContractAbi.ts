import deployments from "../../contracts/deployments.json";

export const getContractAbi = (contractName: string, chainId: number | string) => {
  let contractAbi: any | undefined;

  // Ensure chainId is a string
  chainId = chainId.toString();

  // If not found yet, search it in deployed contracts
  if (!contractAbi) {
    // @ts-ignore
    if (deployments[chainId] && deployments[chainId][0].contracts[contractName]) {
      // @ts-ignore
      contractAbi = deployments[chainId][0].contracts[contractName].abi;
    }
  }

  // Return address
  return contractAbi;
};
