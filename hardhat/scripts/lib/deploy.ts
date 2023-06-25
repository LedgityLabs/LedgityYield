import { ethers } from "hardhat";

export async function deploy(contractName: string, args?: any[]) {
  const Contract = await ethers.getContractFactory(contractName);
  const contract = await Contract.deploy(...args!);
  const address = await contract.getAddress();
  console.log(`Contract '${contractName}' deployed at: ${address}`);
  return contract;
}
