import { ethers, upgrades } from "hardhat";

export async function deployBeaconProxy(
  beaconAddress: Parameters<typeof upgrades.deployBeaconProxy>[0],
  contractName: string,
  args?: any[]
) {
  const Contract = await ethers.getContractFactory(contractName);
  const contract = await upgrades.deployBeaconProxy(beaconAddress, Contract, args!);
  const address = await contract.getAddress();
  console.log(`Beacon proxy '${contractName}' deployed at: ${address}`);
  return contract;
}
