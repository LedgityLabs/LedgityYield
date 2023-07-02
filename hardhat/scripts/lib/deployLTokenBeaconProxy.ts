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
  // Retrieve current chainId
  const chainId = getChainId();

  // Retrive underlying token address
  let underlyingAddress: string;

  // If this is a testnet deployment
  if (testnetIds.includes(chainId)) {
    // Deploy a fake underlying token
    const underlyingContract = await deploy("GenericERC20", [
      `Fake ${underlyingSymbol}`,
      underlyingSymbol,
      6,
    ]);
    underlyingAddress = await underlyingContract.getAddress();
  }

  // Else retrieving the real underlying token contract address
  else underlyingAddress = getContractAddress(underlyingSymbol);

  // Then, retrieve the LToken beacon address
  const lTokenBeaconAddress = getContractAddress("LToken");

  // Finally deploy the LToken beacon proxy
  return await deployBeaconProxy(lTokenBeaconAddress, "LToken", globalOwner, [underlyingAddress]);
}
