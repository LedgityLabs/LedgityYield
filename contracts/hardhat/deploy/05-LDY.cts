import { type DeployFunction } from "hardhat-deploy/dist/types";

module.exports = (async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deployments.deploy("LDY", {
    from: deployer,
    contract: "LDY",
    log: true,
    waitConfirmations: chainId == "31337" ? 1 : 2,
  });
}) as DeployFunction;
