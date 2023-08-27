import { type DeployFunction } from "hardhat-deploy/dist/types";
import { parseUnits } from "viem";

module.exports = (async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const lusdc = await deployments.get("LUSDC");

  await deployments.deploy("LineaMultiLockdrop", {
    contract: "Lockdrop",
    from: deployer,
    log: true,
    args: [lusdc.address, parseUnits((375_000).toString(), 18), -1, 3, 12, 6],
    waitConfirmations: chainId == "31337" ? 1 : 2,
  });
}) as DeployFunction;

// Skip deployment if not running on Linea or localnet
module.exports.skip = async function ({ getChainId }) {
  const chainId = await getChainId();
  return chainId !== "31337" && chainId !== "59144";
} as DeployFunction;
