import type { DeployFunction } from "hardhat-deploy/dist/types";

const deployerFunction: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}) => {
  const { deployer } = await getNamedAccounts();

  // Get deployed contracts
  const globalOwner = await deployments.get("GlobalOwnerSonic");
  const globalPause = await deployments.get("GlobalPauseSonic");
  const globalBlacklist = await deployments.get("GlobalBlacklistSonic");
  const lToken = await deployments.get("LTokenSonic");

  // Deploy the shared LToken implementation
  await deployments.deploy("WrappedLTokenSonic", {
    from: deployer,
    log: true,
    proxy: {
      proxyContract: "UUPS",
      execute: {
        init: {
          methodName: "initializeAndRegister",
          args: [globalOwner.address, globalPause.address, globalBlacklist.address, lToken.address, "Wrapped LToken", "wLT"],
        },
      },
    },
    waitConfirmations: 1,
  });
};

export default deployerFunction;
