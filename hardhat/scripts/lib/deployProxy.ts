import { ethers, upgrades } from "hardhat";
import { ContractId } from "../../deployments";
import { getContractAddress } from "./getContractAddress";
import { getContractName } from "./getContractName";

export async function deployProxy (
  contractId: ContractId,
  globalOwner: boolean = false,
  globalPause: boolean = false,
  globalBlacklist: boolean = false,
  args: any[] = []) {
  // Retrieve the contract name
  const contractName = getContractName(contractId);

  // Retrieve the contract factory
  const UpgradeableContract = await ethers.getContractFactory(contractName);

  // Try to upgrade the contract in case it has already been deployed
  try {
    const proxyAddress = getContractAddress(contractId);
    const contract = await upgrades.upgradeProxy(proxyAddress, UpgradeableContract);
    const address = await contract.getAddress();
    console.log(`Upgradeable '${contractId}' upgraded at: ${address}`);
    return contract;
  } catch (e) {
    // Else if proxy is address is missing or invalid, deploy a new contract
    if (e instanceof Error) {
      if (
        e.message.includes("doesn't look like an ERC 1967 proxy with a logic contract address") ||
        e.message.includes("not found")
      ) {
        // Add global contracts addresses to the arguments
        if (globalOwner) args = [getContractAddress("GlobalOwner"), ...args];
        if (globalPause) args = [getContractAddress("GlobalPause"), ...args];
        if (globalBlacklist) args = [getContractAddress("GlobalBlacklist"), ...args];

        const contract = await upgrades.deployProxy(UpgradeableContract, args);
        const address = await contract.getAddress();

        console.log(`Upgradeable '${contractId}' deployed at: ${address}`);
        return contract;
      }
    }
    throw e;
  }
}
