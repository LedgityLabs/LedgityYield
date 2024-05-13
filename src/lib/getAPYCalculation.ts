import { StakeDurations, OneMonth } from "@/constants/staking";

export const getAPYCalculation = (
  interestRate: string,
  useStakeIndex: boolean = true,
  stakeDuration: number,
) => {
  // -------- APR and APY Formula ----------- //
  // R: Interest rate(reward per token)
  // APR(%) = R * stakeDuration(ie. 1 month in sec) / 365 days(in sec) * 100
  // N: Number of compounds
  // APY(%) = (((1 + R/N )^N) – 1)*100

  const OneYear = 12 * OneMonth;
  const Duration = useStakeIndex ? StakeDurations[stakeDuration] * OneMonth : stakeDuration;

  const R = Number(interestRate);
  const APR = (((R * Duration) / OneYear) * 100).toFixed(2);
  console.log("APR: ", APR);
  const N = Duration / OneYear;
  const APY = (Math.pow(1 + R / N, N) - 1) * 100;
  return APY.toFixed(2);
};
