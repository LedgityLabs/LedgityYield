import { ethers, upgrades } from "hardhat";
import { ContractId } from "../../deployments";
import { getContractAddress } from "./getContractAddress";

export async function deployProxy(contractName: ContractId, globalOwner: boolean = false, args?: any[]) {
  // Retrieve the contract factory
  const UpgradeableContract = await ethers.getContractFactory(contractName);

  // Try to upgrade the contract in case it has already been deployed
  try {
    const proxyAddress = getContractAddress(contractName);
    console.log("PROXY ADDRESS", proxyAddress);
    const contract = await upgrades.upgradeProxy(proxyAddress, UpgradeableContract);
    const address = await contract.getAddress();
    console.log(`Upgradeable '${contractName}' upgraded at: ${address}`);
    return contract;
  } catch (e) {
    // Else if proxy is address is missing or invalid, deploy a new contract
    if (e instanceof Error) {
      if (
        e.message.includes("doesn't look like an ERC 1967 proxy with a logic contract address") ||
        e.message.includes("not found")
      ) {
        if (globalOwner) {
          const globalOwnerContractAddress = getContractAddress("GlobalOwner");
          if (args && args.length > 0) args = [globalOwnerContractAddress, ...args];
          else args = [globalOwnerContractAddress];
        }
        const contract = await upgrades.deployProxy(UpgradeableContract, args);
        const address = await contract.getAddress();

        console.log(`Upgradeable '${contractName}' deployed at: ${address}`);
        return contract;
      }
    }
    throw e;
  }
}
