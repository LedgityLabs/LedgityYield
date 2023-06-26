/** Variant of deployUpgradeable() that is specific to LTokens deployment. */
import { network } from "hardhat";
import { deploy } from "./deploy";
import { deployBeaconProxy } from "./deployBeaconProxy";
import { ContractId, contracts } from "../../contracts";
import { getChainId } from "./getChainId";

export async function deployLTokenBeaconProxy(underlyingSymbol: ContractId) {
  // Retrieve current chainId
  const chainId = getChainId();

  // Retrive underlying token address
  let underlyingAddress: string;
  // If this is a local deployment, deploy a fake underlying token token
  if (chainId === 31337) {
    const underlyingContract = await deploy("GenericStableToken", [
      `Fake ${underlyingSymbol}`,
      underlyingSymbol,
      6,
    ]);
    underlyingAddress = await underlyingContract.getAddress();
  }
  // Else try retrieving the real underlying token contract address
  else {
    try {
      underlyingAddress = contracts[underlyingSymbol].address[chainId]!;
    } catch (e) {
      throw new Error(
        `Address for underlying token '${underlyingSymbol}' for network '${network.name} (${chainId})' not found in contracts.ts file.`
      );
    }
  }

  let lTokenBeacon: string;
  try {
    lTokenBeacon = contracts.LToken.address[chainId];
  } catch (e) {
    throw new Error(
      `Address for LToken beacon for network '${network.name} (${chainId})' not found in contracts.ts file.`
    );
  }
  return deployBeaconProxy(lTokenBeacon, "LToken", [underlyingAddress]);
}
