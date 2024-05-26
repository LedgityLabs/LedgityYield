import { OneMonth, StakeDurationMultipliers, MULTIPLIER_BASIS } from "@/constants/staking";
import { parseUnits } from "viem";

export const getAPYCalculation = (
  rewardRate: number,
  totalWeightedStake: number,
  stakeDurationIndex: number,
) => {
  // -------- APR and APY Formula ----------- //

  const OneToken = Number(parseUnits("1", 18));
  const OneYear = 12 * OneMonth;
  if (totalWeightedStake == 0) {
    totalWeightedStake = OneToken;
  }

  const rewardRatePerSecPerToken = (rewardRate * OneToken) / totalWeightedStake;
  const rewardRatePerYearPerToken = rewardRatePerSecPerToken * OneYear;
  const multiplier = StakeDurationMultipliers[stakeDurationIndex];
  const myStakeAmount = (OneToken * multiplier) / MULTIPLIER_BASIS;
  const myPortion = myStakeAmount / totalWeightedStake;
  const APY = rewardRatePerYearPerToken * myPortion * 100;
  return APY.toFixed(2);
};
