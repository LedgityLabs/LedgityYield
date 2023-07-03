import { deploy } from "./deploy";
import { deployBeaconProxy } from "./deployBeaconProxy";
import { ContractId, testnetIds } from "../../deployments";
import { getChainId } from "./getChainId";
import { getContractAddress } from "./getContractAddress";

/** Variant of deployUpgradeable() that is specific to LTokens deployment. */
export async function deployLTokenBeaconProxy(
  underlyingSymbol: ContractId,
  globalOwner: boolean = true
) {
  // Retrive underlying token address
  let underlyingAddress = getContractAddress(underlyingSymbol);

  // Then, retrieve the LToken beacon address
  const lTokenBeaconAddress = getContractAddress("LToken");

  // Finally deploy the LToken beacon proxy
  return await deployBeaconProxy(lTokenBeaconAddress, "LToken", globalOwner, [underlyingAddress]);
}
