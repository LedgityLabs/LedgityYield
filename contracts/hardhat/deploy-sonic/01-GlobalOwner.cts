import type { DeployFunction } from "hardhat-deploy/dist/types";

const deployerFunction: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}) => {
  console.log("Starting GlobalOwner deployment...");
  const { deployer } = await getNamedAccounts();

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
    waitConfirmations: 1,
  });
};

export default deployerFunction;
