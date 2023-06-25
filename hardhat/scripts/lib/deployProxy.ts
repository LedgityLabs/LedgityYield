import { ethers, network, upgrades } from "hardhat";
import { contracts } from "../../contracts";

export async function deployUpgradeable(contractName: string, args?: any[]) {
  const UpgradeableContract = await ethers.getContractFactory(contractName);

  // Try to upgrade the contract in case it has already been deployed
  try {
    const proxyAddress =
      contracts[network.name] &&
      contracts[network.name][contractName] &&
      contracts[network.name][contractName].address;
    if (!proxyAddress) throw new Error("Address not found");
    const contract = await upgrades.upgradeProxy(proxyAddress, UpgradeableContract);
    const address = await contract.getAddress();
    console.log(`Upgradeable '${contractName}' upgraded at: ${address}`);
    return contract;
  } catch (e) {
    // Else if proxy is address is missing or invalid, deploy a new contract
    if (e instanceof Error) {
      if (
        e.message.includes("doesn't look like an ERC 1967 proxy with a logic contract address") ||
        e.message.includes("Address not found")
      ) {
        const contract = await upgrades.deployProxy(UpgradeableContract, args);
        const address = await contract.getAddress();
        console.log(`Upgradeable '${contractName}' deployed at: ${address}`);
        return contract;
      }
    }
    throw e;
  }
}
