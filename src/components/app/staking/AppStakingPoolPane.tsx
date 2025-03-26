import { OneMonth, StakeDurations } from "@/data/oldConstants";
// Components
import { CarouselItem } from "@/components/ui/Carousel";
import { UnstakeTx, GetRewardTx } from "@/components/contracts";
// Function
import { getAPRCalculation } from "@/functions/getAPRCalculation";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { formatUnits, parseUnits } from "viem";
// Types
import { TokenInfo, UserStakeData } from "@/types";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(duration);

function getTimeLeftString(futureDateInMilSeconds: number) {
  const futureDate = dayjs(futureDateInMilSeconds);
  const now = dayjs();
  const diff = dayjs(futureDate).diff(now);

  if (diff <= 0) {
    return "Passed";
  } else {
    const duration = dayjs.duration(diff);
    return duration.humanize(true);
  }
}

export function AppStakingPoolPane({
  stakingInfo,
  ldyTokenData,
  rewards,
  rewardRate,
  totalWeightedStake,
}: {
  stakingInfo: UserStakeData;
  ldyTokenData: TokenInfo;
  rewards: bigint;
  rewardRate: number;
  totalWeightedStake: number;
}) {
  const amountRewards = Number(
    formatUnits(BigInt(rewards), ldyTokenData.decimals),
  ).toFixed(4);
  const formattedAmountRewards = amountRewards === "0.0000" ? 0 : amountRewards;

  const stakingApr = getAPRCalculation(
    rewardRate,
    totalWeightedStake,
    StakeDurations.findIndex((duration) => {
      return duration == Number(stakingInfo.duration) / OneMonth;
    }),
  );

  return (
    <CarouselItem className="px-2 md:basis-1/2 lg:basis-1/3">
      <div className="p-3 lg:p-4 rounded-lg bg-card-content-default">
        <div className="flex flex-col justify-start">
          <span className="font-semibold text-lg">
            Pool #{stakingInfo.stakeIndex + 1n}
          </span>
          <div className="flex text-sm justify-between">
            <span>Staked Amount</span>
            <span className="font-semibold">
              {formatUnits(stakingInfo.stakedAmount, ldyTokenData.decimals)}
            </span>
          </div>
          <div className="flex text-sm justify-between">
            <span>Duration</span>
            <span className="font-semibold">
              {Number(stakingInfo.duration) / OneMonth} Months
            </span>
          </div>
          <div className="flex text-sm justify-between">
            <span>Unlock Timestamp</span>
            <span className="font-semibold">
              {dayjs
                .utc(Number(stakingInfo.unStakeAt) * 1000)
                .format("DD/MM/YYYY")}
            </span>
          </div>
          <div className="flex text-sm justify-between">
            <span>Earned</span>
            <span className="font-semibold">
              {`${formattedAmountRewards} LDY`}
            </span>
          </div>
          <div className="flex text-sm justify-between">
            <span>APY</span>
            <span className="font-semibold">{`${stakingApr} %`}</span>
          </div>
          <div className="flex text-sm justify-between">
            <span>Time Left</span>
            <span className="font-semibold">
              {getTimeLeftString(Number(stakingInfo.unStakeAt) * 1000)}
            </span>
          </div>
          <div className="flex py-1 w-full">
            <UnstakeTx
              buttonText="Unstake LDY"
              disabled={dayjs().isBefore(Number(stakingInfo.unStakeAt) * 1000)}
              params={{
                stakeIndex: stakingInfo.stakeIndex,
                amount: formatUnits(
                  stakingInfo.stakedAmount,
                  ldyTokenData.decimals,
                ),
                tokenDecimals: ldyTokenData.decimals,
              }}
              className="w-full"
            />
          </div>
          <div className="flex py-1 w-full">
            <GetRewardTx
              buttonText="Claim Rewards"
              disabled={rewards < parseUnits("0.0001", ldyTokenData.decimals)}
              params={{
                stakeIndex: stakingInfo.stakeIndex,
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </CarouselItem>
  );
}
