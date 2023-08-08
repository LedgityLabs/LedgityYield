import * as generated from "../generated";

export const getContractABI = (contractName: string) => {
  const propName = contractName.charAt(0).toLowerCase() + contractName.slice(1) + "ABI";
  // @ts-ignore
  return generated[propName];
};
