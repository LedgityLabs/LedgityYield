import { ethers, upgrades } from "hardhat";
import { getContractAddress } from "./getContractAddress";

export async function deployBeaconProxy(
  beaconAddress: Parameters<typeof upgrades.deployBeaconProxy>[0],
  contractName: string,
  globalOwner: boolean = false,
  args?: any[]
) {
  const Contract = await ethers.getContractFactory(contractName);
  if (globalOwner) {
    const globalOwnerContractAddress = getContractAddress("GlobalOwner");
    if (args && args.length > 0) args = [globalOwnerContractAddress, ...args];
    else args = [globalOwnerContractAddress];
  }
  const contract = await upgrades.deployBeaconProxy(beaconAddress, Contract, args!);
  const address = await contract.getAddress();
  console.log(`Beacon proxy '${contractName}' deployed at: ${address}`);
  return contract;
}
