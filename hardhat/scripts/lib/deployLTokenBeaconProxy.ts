/** Variant of deployUpgradeable() that is specific to LTokens deployment. */
import { network } from "hardhat";
import { deploy } from "./deploy";
import { deployBeaconProxy } from "./deployBeaconProxy";
import { ContractId, contracts, testnetIds } from "../../deployments";
import { getChainId } from "./getChainId";

export async function deployLTokenBeaconProxy(underlyingSymbol: ContractId) {
  // Retrieve current chainId
  const chainId = getChainId();

  // Retrive underlying token address
  let underlyingAddress: string;

  // If this is a testnet deployment, deploy a fake underlying token
  if (testnetIds.includes(chainId)) {
    const underlyingContract = await deploy("GenericStableToken", [
      `Fake ${underlyingSymbol}`,
      underlyingSymbol,
      6,
    ]);
    underlyingAddress = await underlyingContract.getAddress();
  }

  // Else try retrieving the real underlying token contract address, error if not found
  else {
    try {
      underlyingAddress = contracts[underlyingSymbol].address[chainId]!;
    } catch (e) {
      throw new Error(
        `Address for underlying token '${underlyingSymbol}' for network '${network.name} (${chainId})' not found in contracts.ts file.`
      );
    }
  }

  // Now try to retrieve the LToken beacon address for that network, error if not found
  let lTokenBeacon: string;
  try {
    lTokenBeacon = contracts.LToken.address[chainId];
  } catch (e) {
    throw new Error(
      `Address for LToken beacon for network '${network.name} (${chainId})' not found in contracts.ts file.`
    );
  }

  // Finally deploy the LToken beacon proxy
  console.log("UNDERLYING ADDRESS");
  console.log(underlyingAddress);
  const proxyContract = await deployBeaconProxy(lTokenBeacon, "LToken", [underlyingAddress]);
  console.log(await proxyContract.underlying());
  return proxyContract;
}
