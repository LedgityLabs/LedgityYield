import { type DeployFunction } from "hardhat-deploy/dist/types";
import { parseUnits } from "viem";

module.exports = (async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // Retrieve LDY contract
  const ldyToken = await deployments.get("LDY");

  // Retrieve global contracts
  const globalOwner = await deployments.get("GlobalOwner");
  const globalPause = await deployments.get("GlobalPause");
  const globalBlacklist = await deployments.get("GlobalBlacklist");

  const ONE_MONTH = 31 * 24 * 60 * 60;
  const stakingDurations = [
    [0 * ONE_MONTH, 10000], // 0 month
    [1 * ONE_MONTH, 40000], // 1 month
    [6 * ONE_MONTH, 60000], // 6 month
    [12 * ONE_MONTH, 100000], // 12 month
    // [24 * ONE_MONTH, 30000], // 24 month
    // [36 * ONE_MONTH, 40000], // 36 month
  ];
  const stakeDurationForPerks = 12 * ONE_MONTH;
  const stakeAmountForPerks = parseUnits("1000", 18);

  await deployments.deploy("LDYStaking", {
    from: deployer,
    log: true,
    proxy: {
      proxyContract: "UUPS",
      execute: {
        init: {
          methodName: "initialize",
          args: [
            globalOwner.address,
            globalPause.address,
            globalBlacklist.address,
            ldyToken.address,
            stakingDurations,
            stakeDurationForPerks,
            stakeAmountForPerks,
          ],
        },
      },
    },
    waitConfirmations: chainId == "31337" ? 1 : 2,
  });
}) as DeployFunction;
