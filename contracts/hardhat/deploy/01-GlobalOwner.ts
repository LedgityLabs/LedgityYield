import { type DeployFunction } from "hardhat-deploy/dist/types";

module.exports.default = (async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deployments.deploy("GlobalOwner", {
    from: deployer,
    log: true,
    proxy: {
      proxyContract: "UUPS",
      execute: {
        init: {
          methodName: "initialize",
          args: [],
        },
      },
    },
    waitConfirmations: chainId == "31337" ? 1 : 6,
  });
}) as DeployFunction;
