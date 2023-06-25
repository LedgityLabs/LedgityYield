/** Variant of deployUpgradeable() that is specific to LTokens deployment. */
import { network } from "hardhat";
import { deploy } from "./deploy";
import { deployBeaconProxy } from "./deployBeaconProxy";
import { contracts } from "../../contracts";

export async function deployLTokenBeaconProxy(underlyingSymbol: string) {
  let underlyingAddress: string;
  // If this is a local deployment, deploy a fake EUROC token
  if (network.name === "localhost") {
    const eurocContract = await deploy("GenericStableToken", ["Fake EUROC", "EUROC", 6]);
    underlyingAddress = await eurocContract.getAddress();
  }
  // Else try retrieving the real underlying token contract address
  else {
    try {
      underlyingAddress = contracts[network.name][underlyingSymbol].address!;
    } catch (e) {
      throw new Error(
        `Address for underlying token '${underlyingSymbol}' for network '${network.name}' not found in contracts.ts file.`
      );
    }
  }

  let lTokenBeacon: string;
  try {
    lTokenBeacon = contracts[network.name].LToken.address!;
  } catch (e) {
    throw new Error(
      `Address for LToken beacon for network '${network.name}' not found in contracts.ts file.`
    );
  }
  return deployBeaconProxy(lTokenBeacon, "LToken", [underlyingAddress]);
}
