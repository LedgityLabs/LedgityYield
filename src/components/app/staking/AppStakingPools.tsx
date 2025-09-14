//Components
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";
import { AppStakingPoolPane } from "@/components/app/staking/AppStakingPoolPane";
// Hooks
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useGetEarnedUser, useGetUserStakes } from "@/hooks/contracts";
// Types
import { TokenInfo } from "@/types";

export function AppStakingPools({
  ldyTokenData,
  rewardRate,
  totalWeightedStake,
}: {
  ldyTokenData: TokenInfo;
  ldyTokenBalance: bigint;
  rewardRate: number;
  totalWeightedStake: number;
}) {
  const { currentAccount } = useWeb3Context();

  const stakingInfos = useGetUserStakes(currentAccount);
  const rewardsArray = useGetEarnedUser(currentAccount);

  return (
    <div className="flex flex-col justify-start gap-y-2 p-4 h-full">
      <div className="font-heading font-bold text-xl text-white">
        MY $LDY POOLS
      </div>
      {!!stakingInfos.length && (
        <Carousel className="w-full justify-center">
          <CarouselContent className="-ml-1">
            {stakingInfos.map((stakingInfo, i) => (
              <AppStakingPoolPane
                key={i}
                stakingInfo={stakingInfo}
                ldyTokenData={ldyTokenData}
                rewards={rewardsArray[i] || 0n}
                rewardRate={rewardRate}
                totalWeightedStake={totalWeightedStake}
              />
            ))}
          </CarouselContent>
          <CarouselPrevious size="tiny" />
          <CarouselNext size="tiny" />
        </Carousel>
      )}
    </div>
  );
}
