import type { DeployFunction } from "hardhat-deploy/dist/types";

const deployerFunction: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}) => {
  const { deployer } = await getNamedAccounts();

  // Deploy the shared LToken implementation
  await deployments.deploy("WrappedLTokenHedera", {
    from: deployer,
    log: true,
    waitConfirmations: 1,
  });
};

export default deployerFunction;
