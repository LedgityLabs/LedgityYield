import { Card } from "@/components/ui";
import { FC, useEffect, useRef } from "react";
import { AppStakingPane } from "./AppStakingPane";
import { AppStakingDescription } from "./AppStakingDescription";
import { AppStakingPools } from "./AppStakingPools";
import { useContractAddress } from "@/hooks/useContractAddress";
import { useAccount, usePublicClient } from "wagmi";
import { zeroAddress } from "viem";
import { useReadLdyBalanceOf, useReadLdyDecimals } from "@/generated";
import { useQueryClient } from "@tanstack/react-query";
import { useGetStakingAprById } from "@/services/graph";
import { STAKING_APR_INFO_ID } from "@/constants/staking";
import { STAKING_APR_INFO_QUERY } from "@/services/graph/queries";

export const AppStaking: FC = () => {
  const queryClient = useQueryClient();
  const account = useAccount();
  const publicClient = usePublicClient();
  const ldySymbol = "LDY";
  const ldyTokenAddress = useContractAddress(ldySymbol);

  const { data: ldyBalance, queryKey: ldyBalanceQuery } = useReadLdyBalanceOf({
    args: [account.address || zeroAddress],
  });

  const { data: ldyDecimals } = useReadLdyDecimals();

  const {
    data: stakingAprInfo,
    refetch: refetchStakingAPR,
    isFetching: isFetchingAPR,
  } = useGetStakingAprById(STAKING_APR_INFO_ID);

  // Refetch LdyBalance & APR from contract on network/wallet change
  const queryKeys = [ldyBalanceQuery, [STAKING_APR_INFO_QUERY]];
  useEffect(() => {
    queryKeys.forEach((k) => queryClient.invalidateQueries({ queryKey: k }));
  }, [account.address, publicClient]);

  // Refetch stakingAPR on ldyBalance change.
  useEffect(() => {
    // Refetch after 3 seconds due to subgraph latency
    const timeoutId = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: [STAKING_APR_INFO_QUERY] });
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [ldyBalance]);

  return (
    <section className="lg:w-[1080px] grid grid-cols-12 gap-5 pb-10 w-full h-full px-2">
      <Card
        circleIntensity={0.07}
        defaultGradient={true}
        className="w-full flex flex-col col-span-12 xl:col-span-6 gap-2 p-2"
      >
        <AppStakingPane
          ldyTokenSymbol={ldySymbol}
          ldyTokenAddress={ldyTokenAddress || zeroAddress}
          ldyTokenBalance={ldyBalance || 0n}
          ldyTokenDecimals={ldyDecimals || 18}
          stakingAprInfo={stakingAprInfo ? stakingAprInfo.stakingAPRInfo || undefined : undefined}
        />
      </Card>
      <Card
        circleIntensity={0.07}
        defaultGradient={true}
        className="w-full flex flex-col col-span-12 xl:col-span-6 gap-8 p-2"
      >
        <AppStakingDescription />
      </Card>
      <Card
        circleIntensity={0.07}
        defaultGradient={false}
        className="w-full flex flex-col gap-8 col-span-12 before:bg-primary p-2"
      >
        <AppStakingPools
          ldyTokenDecimals={ldyDecimals || 18}
          ldyTokenBalanceQuery={ldyBalanceQuery || []}
          stakingAprInfo={stakingAprInfo ? stakingAprInfo.stakingAPRInfo || undefined : undefined}
        />
      </Card>
    </section>
  );
};
