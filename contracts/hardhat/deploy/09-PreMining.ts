import { type DeployFunction } from "hardhat-deploy/dist/types";
import { parseUnits } from "viem";

module.exports = (async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const lusdc = await deployments.get("LUSDC");

  await deployments.deploy("PreMining", {
    from: deployer,
    log: true,
    args: [
      lusdc.address,
      parseUnits((1_125_000).toString(), 18),
      parseUnits((5_000_000).toString(), 6),
      3,
      12,
      6,
    ],
    waitConfirmations: chainId == "31337" ? 1 : 2,
  });
}) as DeployFunction;
