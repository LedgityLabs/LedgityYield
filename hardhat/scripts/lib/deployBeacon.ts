import { ethers, upgrades } from "hardhat";
import { ContractId, contracts } from "../../deployments";
import { getChainId } from "./getChainId";
import { getContractAddress } from "./getContractAddress";

export async function deployBeacon(contractName: ContractId) {
  // Retrieve current chain Id
  const chainId = getChainId();

  // Retrieve the contract factory
  const BeaconContract = await ethers.getContractFactory(contractName);

  // Try to upgrade the beacon contract in case it has already been deployed
  try {
    const beaconAddress = getContractAddress(contractName);
    const contract = await upgrades.upgradeBeacon(beaconAddress, BeaconContract);
    const address = await contract.getAddress();
    console.log(`Beacon '${contractName}' upgraded at: ${address}`);
    return contract;
  } catch (e) {
    // Else if proxy is address is missing or invalid, deploy a new contract
    if (e instanceof Error) {
      if (
        e.message.includes("Address not found") ||
        (chainId === 31337 && e.message.includes("doesn't look like a beacon"))
      ) {
        const contract = await upgrades.deployBeacon(BeaconContract);
        const address = await contract.getAddress();
        console.log(`Beacon '${contractName}' deployed at: ${address}`);
        return contract;
      }
    }
    throw e;
  }
}
