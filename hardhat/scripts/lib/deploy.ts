import { ethers } from "hardhat";

export async function deploy(contractName: string, args?: any[]) {
  const Contract = await ethers.getContractFactory(contractName);
  const contract = await (args ? Contract.deploy(...args) : Contract.deploy());
  const address = await contract.getAddress();
  console.log(`Contract '${contractName}' deployed at: ${address}`);
  return contract;
}
