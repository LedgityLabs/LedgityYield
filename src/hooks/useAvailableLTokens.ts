import deployements from "../../contracts/deployments.json";
import dependencies from "../../contracts/dependencies.json";
import { usePublicClient } from "wagmi";

export const useAvailableLTokens = () => {
  // Return empty results if the frontend is not connected to any chain
  const publicClient = usePublicClient();
  if (!publicClient.chain) return [];

  // Return empty results if no contracts have been deployed on the current chain
  if (!Object.keys(deployements).includes(publicClient.chain.id.toString())) return [];

  // Else, get contracts deployed on the current chain
  const contracts =
    deployements[publicClient.chain.id.toString() as keyof typeof deployements][0].contracts;

  // Retrieve L-Tokens contracts (ones that are prefixed with "L" + the name of a dependency)
  let lTokensNames: string[] = [];
  Object.keys(contracts).forEach((contractName: string) => {
    if (Object.keys(dependencies).some((suffix) => contractName === "L" + suffix)) {
      lTokensNames.push(contractName);
    }
  });

  return lTokensNames;
};
