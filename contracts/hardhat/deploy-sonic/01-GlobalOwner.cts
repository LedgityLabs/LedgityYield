import type { DeployFunction } from "hardhat-deploy/dist/types";

const deployerFunction: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}) => {
  const { deployer } = await getNamedAccounts();

  await deployments.deploy("GlobalOwnerSonic", {
    from: deployer,
    log: true,
    proxy: {
      proxyContract: "UUPS",
      execute: {
        init: {
          methodName: "initializeAndRegister",
          args: [],
        },
      },
    },
    waitConfirmations: 1,
  });
};

export default deployerFunction;
