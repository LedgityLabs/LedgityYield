import { type DeployFunction } from "hardhat-deploy/dist/types";

module.exports = (async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const globalOwner = await deployments.get("GlobalOwner");

  await deployments.deploy("GlobalBlacklist", {
    from: deployer,
    log: true,
    proxy: {
      proxyContract: "UUPS",
      execute: {
        init: {
          methodName: "initialize",
          args: [globalOwner.address],
        },
      },
    },
    waitConfirmations: chainId == "31337" ? 1 : 1,
  });
}) as DeployFunction;
