import { ethers, network, upgrades } from "hardhat";
import { contracts } from "../../contracts";

export async function deployBeacon(contractName: string) {
  const BeaconContract = await ethers.getContractFactory(contractName);

  // Try to upgrade the beacon contract in case it has already been deployed
  try {
    const beaconAddress =
      contracts[network.name] &&
      contracts[network.name][contractName] &&
      contracts[network.name][contractName].address;
    if (!beaconAddress) throw new Error("Address not found");
    const contract = await upgrades.upgradeBeacon(beaconAddress, BeaconContract);
    const address = await contract.getAddress();
    console.log(`Beacon ${contractName} upgraded at: ${address}`);
    return contract;
  } catch (e) {
    // Else if proxy is address is missing or invalid, deploy a new contract
    if (e instanceof Error) {
      if (
        e.message.includes("Address not found") ||
        (network.name === "localhost" && e.message.includes("doesn't look like a beacon"))
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
