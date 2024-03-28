import { type DeployFunction } from "hardhat-deploy/dist/types";

module.exports = (async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // IMPORTANT: As $LDY token is not available yet, we deploy here a dummy
  // version of the contract so the LToken contract can work properly.It will
  // be replaced by the real one once the $LDY token is deployed.
  await deployments.deploy("LDYStaking", {
    from: deployer,
    log: true,
    args: [],
    waitConfirmations: chainId == "31337" ? 1 : 2,
  });
}) as DeployFunction;
