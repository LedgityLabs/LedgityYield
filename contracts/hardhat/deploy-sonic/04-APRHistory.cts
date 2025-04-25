import type { DeployFunction } from "hardhat-deploy/dist/types";

const deployerFunction: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}) => {
  const { deployer } = await getNamedAccounts();

  await deployments.deploy("APRHistory", {
    from: deployer,
    log: true,
    waitConfirmations: 1,
  });
};

export default deployerFunction;
