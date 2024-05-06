import { StakeDurations, OneMonth } from "@/constants/staking";

export const getAPYCalculation = (
  apr: string,
  useStakeIndex: boolean = true,
  stakeDuration: number,
) => {
  // -------- APY Formula ----------- //
  // APY(%) = (((1 + r/n )^n) – 1)*100
  // r: APR(annual interest rate)
  // n: Number of compound periods

  const N = useStakeIndex ? StakeDurations[stakeDuration] * OneMonth : stakeDuration;
  const R = Number(apr);
  const APY = (Math.pow(1 + R / N, N) - 1) * 100;
  return APY.toFixed(2);
};
