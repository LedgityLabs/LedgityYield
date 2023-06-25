import { network } from "hardhat";

export function getChainId() {
  const chainId = network.config.chainId;
  if (!chainId)
    throw new Error(
      `Chain ID not configured in hardhat.config.ts for current network '${network.name}'.`
    );
  return chainId;
}
