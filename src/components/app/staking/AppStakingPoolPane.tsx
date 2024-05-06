import { FC } from "react";

import { CarouselItem } from "@/components/ui/Carousel";
import { TxButton } from "@/components/ui";
import { formatUnits } from "viem";
import { useSimulateLdyStakingGetReward, useSimulateLdyStakingUnstake } from "@/generated";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { OneMonth } from "@/constants/staking";
import { useAPYCalculation } from "@/hooks/useAPYCalculation";
import { QueryKey } from "@tanstack/react-query";
import { IStakingAPRInfo, IUserStakingInfo } from "@/services/graph/hooks/useStakingEvent";
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

export interface IPoolInfo {
  stakedAmount: bigint;
  unStakeAt: bigint;
  duration: bigint;
  rewardPerTokenPaid: bigint;
  rewards: bigint;
}

export const AppStakingPoolPane: FC<{
  poolInfo: IPoolInfo;
  poolIndex: number;
  ldyTokenDecimals: number;
  userStakingInfo: IUserStakingInfo | undefined;
  rewardsArray: readonly bigint[] | undefined;
  stakingAprInfo: IStakingAPRInfo | undefined;
  getUserStakesQuery?: QueryKey;
  ldyTokenBalanceQuery?: QueryKey;
  rewardsArrayQuery?: QueryKey;
}> = ({
  poolInfo,
  poolIndex,
  ldyTokenDecimals,
  userStakingInfo,
  rewardsArray,
  stakingAprInfo,
  getUserStakesQuery,
  ldyTokenBalanceQuery,
  rewardsArrayQuery,
  ...props
}) => {
  return (
    <CarouselItem key={poolIndex} className="px-2 md:basis-1/2 lg:basis-1/3">
      <div className="p-3 lg:p-4 rounded-lg bg-card-content-default">
        <div className="flex flex-col justify-start">
          <span className="font-semibold text-lg">Pool #{poolIndex + 1}</span>
          <div className="flex text-sm justify-between">
            <span>Staked Amount</span>
            <span className="font-semibold">
              {formatUnits(poolInfo.stakedAmount, ldyTokenDecimals!)}
            </span>
          </div>
          <div className="flex text-sm justify-between">
            <span>Duration</span>
            <span className="font-semibold">{Number(poolInfo.duration) / OneMonth} Months</span>
          </div>
          <div className="flex text-sm justify-between">
            <span>Unlock Timestamp</span>
            <span className="font-semibold">
              {dayjs.utc(Number(poolInfo.unStakeAt) * 1000).format("DD/MM/YYYY")}
            </span>
          </div>
          <div className="flex text-sm justify-between">
            <span>Earned</span>
            <span className="font-semibold">
              {userStakingInfo
                ? formatUnits(BigInt(userStakingInfo.earnedAmount), ldyTokenDecimals!)
                : 0}{" "}
              Token
            </span>
          </div>
          <div className="flex text-sm justify-between">
            <span>APY</span>
            <span className="font-semibold">
              {stakingAprInfo
                ? useAPYCalculation(stakingAprInfo.APR, false, Number(poolInfo.duration))
                : "-"}
              %
            </span>
          </div>
          <div className="flex text-sm justify-between">
            <span>Time Left</span>
            <span className="font-semibold">
              {dayjs(Number(poolInfo.unStakeAt) * 1000).fromNow(true)}
            </span>
          </div>
          <div className="flex py-1 w-full">
            <TxButton
              preparation={useSimulateLdyStakingUnstake({
                args: [poolInfo.stakedAmount, BigInt(poolIndex)],
              })}
              variant="primary"
              size="tiny"
              disabled={dayjs().isBefore(Number(poolInfo.unStakeAt) * 1000)}
              className="w-full"
              queryKeys={[ldyTokenBalanceQuery, getUserStakesQuery, rewardsArrayQuery]}
            >
              UNSTAKE
            </TxButton>
          </div>
          <div className="flex py-1 w-full">
            <TxButton
              preparation={useSimulateLdyStakingGetReward({
                args: [BigInt(poolIndex)],
              })}
              variant="outline"
              size="tiny"
              disabled={
                Number(
                  formatUnits(
                    BigInt(rewardsArray ? rewardsArray[poolIndex] : 0),
                    ldyTokenDecimals!,
                  ),
                ) < 0.0001
              }
              className="w-full"
              queryKeys={[rewardsArrayQuery, ldyTokenBalanceQuery]}
            >
              CLAIM{" "}
              {Number(
                formatUnits(BigInt(rewardsArray ? rewardsArray[poolIndex] : 0), ldyTokenDecimals!),
              ).toFixed(4)}{" "}
              Token
            </TxButton>
          </div>
        </div>
      </div>
    </CarouselItem>
  );
};
