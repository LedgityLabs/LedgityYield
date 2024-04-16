import { type DeployFunction } from "hardhat-deploy/dist/types";
import { parseUnits } from "viem";

module.exports = (async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // Retrieve lusdc contract
  const ONE_MONTH = 31 * 24 * 60 * 60;
  const StakingDurations = [
    1 * ONE_MONTH, // 1 month
    6 * ONE_MONTH, // 6 months
    12 * ONE_MONTH, // 12 months
    24 * ONE_MONTH, // 24 months
    36 * ONE_MONTH, // 36 months
  ];
  const StakeDurationForPerks = 12 * ONE_MONTH;
  const StakeAmountForPerks = parseUnits("1000", 18);

  await deployments.deploy("LDYStaking", {
    from: deployer,
    log: true,
    args: [StakingDurations, StakeDurationForPerks, StakeAmountForPerks],
    waitConfirmations: chainId == "31337" ? 1 : 2,
  });
}) as DeployFunction;
