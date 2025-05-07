import type { DeployFunction } from "hardhat-deploy/dist/types";

const deployerFunction: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}) => {
  const { deployer } = await getNamedAccounts();
  const aprHistory = await deployments.get("APRHistory");

  // Deploy the shared LToken implementation
  await deployments.deploy("LTokenSonic_Implementation", {
    contract: "LTokenSonic",
    from: deployer,
    log: true,
    libraries: {
      APRHistory: aprHistory.address,
    },
    waitConfirmations: 1,
  });
};

export default deployerFunction;
