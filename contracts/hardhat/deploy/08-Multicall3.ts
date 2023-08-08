import { type DeployFunction } from "hardhat-deploy/dist/types";

module.exports.default = (async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deployments.deploy("Multicall3", {
    from: deployer,
    log: true,
    args: [],
    waitConfirmations: chainId == "31337" ? 1 : 6,
  });
}) as DeployFunction;

// Skip deployment if not running on localnet
module.exports.skip = async function ({ getChainId }) {
  const chainId = await getChainId();
  return chainId === "31337";
} as DeployFunction;
