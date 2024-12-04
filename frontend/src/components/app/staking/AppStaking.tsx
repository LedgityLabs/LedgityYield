"use client";
import { Card } from "@/components/ui";
import { FC, useEffect, useMemo, useCallback } from "react";
import { AppStakingPanel } from "./AppStakingPanel";
import { AppStakingDescription } from "./AppStakingDescription";
import { AppStakingPools } from "./AppStakingPools";
import { useContractAddress } from "@/hooks/useContractAddress";
import { useAccount, usePublicClient, useReadContract } from "wagmi";
import { erc20Abi, zeroAddress } from "viem";
import {
 useReadLdyStakingRewardRatePerSec,
 useReadLdyStakingTotalWeightedStake,
} from "@/generated";
import { useQueryClient } from "@tanstack/react-query";

const LDY_SYMBOL = "LDY" as const;
const DEFAULT_DECIMALS = 18;

interface StakingProps {
 ldyTokenSymbol: string;
 ldyTokenAddress: `0x${string}`;
 ldyTokenBalance: bigint;
 ldyTokenDecimals: number;
 rewardRate: number;
 totalWeightedStake: number;
}

export const AppStaking: FC = () => {
 const queryClient = useQueryClient();
 const account = useAccount();
 const publicClient = usePublicClient();
 const ldyTokenAddress = useContractAddress(LDY_SYMBOL);

 const { data: ldyBalance, queryKey: ldyBalanceQuery } = useReadContract({
   abi: erc20Abi,
   functionName: "balanceOf",
   address: ldyTokenAddress,
   args: [account.address || zeroAddress],
   query: {
     enabled: Boolean(ldyTokenAddress && account.address)
   }
 });

 const { data: ldyDecimals } = useReadContract({
   abi: erc20Abi,
   address: ldyTokenAddress,
   functionName: "decimals",
   query: {
     enabled: Boolean(ldyTokenAddress)
   }
 });

 const { data: rewardRate, queryKey: rewardRateQuery } = useReadLdyStakingRewardRatePerSec();
 const { data: totalWeightedStake, queryKey: totalWeightedStakeQuery } = 
   useReadLdyStakingTotalWeightedStake();

 const apyQueryKeys = useMemo(() => 
   [rewardRateQuery, totalWeightedStakeQuery].filter(Boolean),
   [rewardRateQuery, totalWeightedStakeQuery]
 );

 const allQueryKeys = useMemo(() => 
   [ldyBalanceQuery, ...apyQueryKeys].filter(Boolean),
   [ldyBalanceQuery, apyQueryKeys]
 );

 const invalidateQueries = useCallback((keys: unknown[]) => {
   if (!queryClient) return;
   keys.forEach(key => {
     if (key) queryClient.invalidateQueries({ queryKey: key });
   });
 }, [queryClient]);

 // Network/account changes
 useEffect(() => {
   invalidateQueries(allQueryKeys);
 }, [account.address, publicClient, allQueryKeys, invalidateQueries]);

 // Balance changes
 useEffect(() => {
   invalidateQueries(apyQueryKeys);
 }, [ldyBalance, apyQueryKeys, invalidateQueries]);

 const stakingProps: StakingProps = {
   ldyTokenSymbol: LDY_SYMBOL,
   ldyTokenAddress: ldyTokenAddress || zeroAddress,
   ldyTokenBalance: ldyBalance || 0n,
   ldyTokenDecimals: ldyDecimals || DEFAULT_DECIMALS,
   rewardRate: Number(rewardRate) || 0,
   totalWeightedStake: Number(totalWeightedStake) || 0
 };

 return (
   <section className="lg:w-[1080px] grid grid-cols-12 gap-5 pb-10 w-full h-full px-2">
     <Card
       circleIntensity={0.07}
       defaultGradient={true}
       className="w-full flex flex-col col-span-12 xl:col-span-6 gap-2 p-2"
     >
       <AppStakingPanel {...stakingProps} />
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
         ldyTokenDecimals={stakingProps.ldyTokenDecimals}
         ldyTokenBalance={stakingProps.ldyTokenBalance}
         ldyTokenBalanceQuery={ldyBalanceQuery || []}
         rewardRate={stakingProps.rewardRate}
         totalWeightedStake={stakingProps.totalWeightedStake}
       />
     </Card>
   </section>
 );
};

export default AppStaking;