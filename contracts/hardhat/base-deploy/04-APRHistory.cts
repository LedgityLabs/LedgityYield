import { type DeployFunction } from "hardhat-deploy/dist/types";

module.exports = (async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deployments.deploy("APRHistory", {
    from: deployer,
    log: true,
    waitConfirmations: 1,
  });
}) as DeployFunction;
