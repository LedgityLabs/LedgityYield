import { ethers, upgrades } from "hardhat";
import { ContractId, contracts } from "../../deployments";
import { getChainId } from "./getChainId";

export async function deployUpgradeable(contractName: ContractId, args?: any[]) {
  // Retrieve current chain Id
  const chainId = getChainId();

  // Try to upgrade the contract in case it has already been deployed
  const UpgradeableContract = await ethers.getContractFactory(contractName);
  try {
    const proxyAddress =
      contracts[contractName] &&
      contracts[contractName].address &&
      contracts[contractName].address[chainId];
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
