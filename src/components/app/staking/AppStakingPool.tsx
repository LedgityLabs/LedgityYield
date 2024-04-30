import { FC, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";
import { Button, Card } from "@/components/ui";
import { useGetStakingAprById, useGetUserStakingsByAddress } from "@/services/graph";
import { useAccount, useReadContract } from "wagmi";
import { useContractAddress } from "@/hooks/useContractAddress";
import { formatUnits, zeroAddress } from "viem";
import {
  useReadLdyDecimals,
  useReadLdyStakingEarned,
  useReadLdyStakingGetEarnedUser,
  useReadLdyStakingGetUserStakes,
  useReadLdyStakingRewardsDuration,
} from "@/generated";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { OneMonth, STAKING_APR_INFO_ID } from "@/constants/staking";
import { useAPYCalculation } from "@/hooks/useAPYCalculation";
import { useQueries } from "@tanstack/react-query";
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

export const AppStakingPool: FC = () => {
  const account = useAccount();
  const ldyStakingAddress = useContractAddress("LDYStaking");
  const { data: ldyDecimals } = useReadLdyDecimals();

  const [claimAmounts, setClaimAmounts] = useState<bigint[]>([0n]);

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

  // Fetch staking APR info from subgraph
  const {
    data: stakingAprInfo,
    refetch: refetchStakingAPR,
    isFetching: isFetchingAPR,
  } = useGetStakingAprById(STAKING_APR_INFO_ID);

  // Fetch claimable rewards array from ldyStaking Contract
  const { data: earnedArray, queryKey: earnedArrayQuery } = useReadLdyStakingGetEarnedUser({
    args: [account.address || zeroAddress],
  });

  return (
    <div className="flex flex-col justify-start gap-y-2 p-4 h-full">
      <div className="font-heading font-bold text-xl text-white">MY $LDY POOLS</div>
      <Carousel className="w-full justify-center">
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
                        {formatUnits(poolInfo.stakedAmount, ldyDecimals!)}
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
                        {userStakingInfo
                          ? formatUnits(
                              BigInt(userStakingInfo.stakingUsers[index].earnedAmount),
                              ldyDecimals!,
                            )
                          : 0}{" "}
                        Token
                      </span>
                    </div>
                    <div className="flex text-sm justify-between">
                      <span>APY</span>
                      <span className="font-semibold">
                        {stakingAprInfo
                          ? useAPYCalculation(
                              stakingAprInfo.stakingAPRInfo.APR,
                              false,
                              Number(poolInfo.duration),
                            )
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
                      <Button size="tiny" variant="primary" className="w-full">
                        UNSTAKE
                      </Button>
                    </div>
                    <div className="flex py-1 w-full">
                      <Button size="tiny" variant="outline" className="w-full">
                        CLAIM{" "}
                        {Number(formatUnits(BigInt(earnedArray![index]), ldyDecimals!)).toFixed(4)}{" "}
                        Token
                      </Button>
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
