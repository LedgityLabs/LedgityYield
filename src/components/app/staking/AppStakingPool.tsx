import { FC, useEffect } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";
import { TxButton } from "@/components/ui";
import { useGetUserStakingsByAddress } from "@/services/graph";
import { useAccount, usePublicClient } from "wagmi";
import { formatUnits, zeroAddress } from "viem";
import {
  useReadLdyStakingGetEarnedUser,
  useReadLdyStakingGetUserStakes,
  useSimulateLdyStakingGetReward,
  useSimulateLdyStakingUnstake,
} from "@/generated";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { OneMonth } from "@/constants/staking";
import { useAPYCalculation } from "@/hooks/useAPYCalculation";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import { USER_STAKING_QUERY } from "@/services/graph/queries";
import { IStakingAPRInfo } from "@/services/graph/hooks/useStakingEvent";
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

export const AppStakingPool: FC<{
  ldyTokenDecimals?: number;
  ldyTokenBalanceQuery?: QueryKey;
  stakingAprInfo?: IStakingAPRInfo;
}> = ({ ldyTokenDecimals, ldyTokenBalanceQuery, stakingAprInfo }) => {
  const queryClient = useQueryClient();
  const account = useAccount();
  const publicClient = usePublicClient();

  // Fetch user staking info including earnedAmount from subgraph
  const {
    data: userStakingInfo,
    refetch: refetchUserStakingInfo,
    isFetching: isFetchingStakingInfo,
  } = useGetUserStakingsByAddress(account.address || zeroAddress);

  // Fetch user staking info from ldyStaking contract
  const { data: stakingPools, queryKey: getUserStakesQuery } = useReadLdyStakingGetUserStakes({
    args: [account.address || zeroAddress],
  });

  // Fetch claimable rewards array from ldyStaking Contract
  const { data: rewardsArray, queryKey: rewardsArrayQuery } = useReadLdyStakingGetEarnedUser({
    args: [account.address || zeroAddress],
  });

  // Refetch staking info, earned array from subgraph & contracts on wallet, network change
  const queryKeys = [rewardsArrayQuery, getUserStakesQuery, [USER_STAKING_QUERY]];
  useEffect(() => {
    queryKeys.forEach((k) => queryClient.invalidateQueries({ queryKey: k }));
  }, [account.address, publicClient]);

  // Refetch staking info(earned info) on rewardsArray change
  useEffect(() => {
    // Refetch after 3 seconds due to subgraph latency
    const timeoutId = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: [USER_STAKING_QUERY] });
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [rewardsArray]);

  return (
    <div className="flex flex-col justify-start gap-y-2 p-4 h-full">
      <div className="font-heading font-bold text-xl text-white">MY $LDY POOLS</div>
      <Carousel
        className={twMerge(
          "w-full justify-center",
          (!stakingPools || !stakingPools.length) && "hidden",
        )}
      >
        <CarouselContent className="-ml-1">
          {stakingPools &&
            stakingPools.map((poolInfo, index) => (
              <CarouselItem key={index} className="px-2 md:basis-1/2 lg:basis-1/3">
                <div className="p-3 lg:p-4 rounded-lg bg-card-content-default">
                  <div className="flex flex-col justify-start">
                    <span className="font-semibold text-lg">Pool #{index + 1}</span>
                    <div className="flex text-sm justify-between">
                      <span>Staked Amount</span>
                      <span className="font-semibold">
                        {formatUnits(poolInfo.stakedAmount, ldyTokenDecimals!)}
                      </span>
                    </div>
                    <div className="flex text-sm justify-between">
                      <span>Duration</span>
                      <span className="font-semibold">
                        {Number(poolInfo.duration) / OneMonth} Months
                      </span>
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
                        {userStakingInfo &&
                        userStakingInfo.stakingUsers &&
                        userStakingInfo.stakingUsers[index]
                          ? formatUnits(
                              BigInt(userStakingInfo.stakingUsers[index].earnedAmount),
                              ldyTokenDecimals!,
                            )
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
                          args: [poolInfo.stakedAmount, BigInt(index)],
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
                          args: [BigInt(index)],
                        })}
                        variant="outline"
                        size="tiny"
                        disabled={
                          Number(
                            formatUnits(
                              BigInt(rewardsArray ? rewardsArray[index] : 0),
                              ldyTokenDecimals!,
                            ),
                          ) < 0.0001
                        }
                        className="w-full"
                        queryKeys={[rewardsArrayQuery, ldyTokenBalanceQuery]}
                      >
                        CLAIM{" "}
                        {Number(
                          formatUnits(
                            BigInt(rewardsArray ? rewardsArray[index] : 0),
                            ldyTokenDecimals!,
                          ),
                        ).toFixed(4)}{" "}
                        Token
                      </TxButton>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious size="tiny" />
        <CarouselNext size="tiny" />
      </Carousel>
    </div>
  );
};
