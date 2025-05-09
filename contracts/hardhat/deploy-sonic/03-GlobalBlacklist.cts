import type { DeployFunction } from "hardhat-deploy/dist/types";

const deployerFunction: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}) => {
  const { deployer } = await getNamedAccounts();

  const globalOwner = await deployments.get("GlobalOwnerSonic");

  await deployments.deploy("GlobalBlacklistSonic", {
    from: deployer,
    log: true,
    proxy: {
      proxyContract: "UUPS",
      execute: {
        init: {
          methodName: "initializeAndRegister",
          args: [globalOwner.address],
        },
      },
    },
    waitConfirmations: 1,
  });
};

export default deployerFunction;
