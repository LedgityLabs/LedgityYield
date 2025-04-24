import { type DeployFunction } from "hardhat-deploy/dist/types";

module.exports = (async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();

  await deployments.deploy("APRHistory", {
    from: deployer,
    log: true,
    waitConfirmations: 1,
  });
}) as DeployFunction;
