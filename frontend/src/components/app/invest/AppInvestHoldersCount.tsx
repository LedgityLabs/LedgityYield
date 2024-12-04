"use client";
import { Spinner } from "@/components/ui";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { FC, useEffect, useState, useCallback } from "react";
import { createPublicClient, erc20Abi, http, zeroAddress, type Chain } from "viem";
import { getContractEvents } from "viem/actions";
import { arbitrum, linea, base } from "viem/chains";
import { getContractAddress } from "@/lib/getContractAddress";
import { useChainId } from "wagmi";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

interface ChainConfig {
 startBlock: bigint;
 chain: Chain;
}

type ChainConfigs = {
 [K in typeof arbitrum.id | typeof linea.id | typeof base.id]: ChainConfig;
};

const CHAIN_CONFIGS: ChainConfigs = {
 [arbitrum.id]: { startBlock: 211050n, chain: arbitrum },
 [linea.id]: { startBlock: 211050n, chain: linea },
 [base.id]: { startBlock: 211050n, chain: base },
};

export const AppInvestHoldersCount: FC<Props> = (props) => {
 const [holdersCount, setHoldersCount] = useState<number | "N/A">("N/A");
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const lTokens = useAvailableLTokens();
 const currentChainId = useChainId();

 const computeHoldersCount = useCallback(async () => {
   if (!currentChainId || !(currentChainId in CHAIN_CONFIGS)) {
     setHoldersCount("N/A");
     setError("Unsupported network");
     return;
   }

   setIsLoading(true);
   setError(null);
   
   try {
     const chainConfig = CHAIN_CONFIGS[currentChainId as keyof ChainConfigs];
     const client = createPublicClient({
       chain: chainConfig.chain,
       transport: http(),
     });

     let totalHolders = 0;
     
     await Promise.all(
       lTokens.map(async (lTokenSymbol) => {
         const lTokenAddress = getContractAddress(lTokenSymbol, String(currentChainId));
         if (!lTokenAddress) return;

         try {
           const logs = await getContractEvents(client, {
             address: lTokenAddress,
             abi: erc20Abi,
             eventName: "Transfer",
             fromBlock: chainConfig.startBlock,
             toBlock: "latest",
           });

           const holders = new Set<string>();
           logs.forEach((log) => {
             const { from, to } = log.args;
             if (from && ![lTokenAddress, zeroAddress].includes(from)) {
               holders.add(from);
             }
             if (to && ![lTokenAddress, zeroAddress].includes(to)) {
               holders.add(to);
             }
           });

           totalHolders += holders.size;
         } catch (err) {
           console.error(`Error fetching events for ${lTokenSymbol}:`, err);
         }
       })
     );

     setHoldersCount(totalHolders);
   } catch (error) {
     console.error("Error computing holders count:", error);
     setError("Failed to fetch holders count");
     setHoldersCount("N/A");
   } finally {
     setIsLoading(false);
   }
 }, [currentChainId, lTokens]);

 useEffect(() => {
   computeHoldersCount();
 }, [computeHoldersCount]);

 if (error) {
   return <div {...props} className="text-red-500">{error}</div>;
 }

 return (
   <div {...props}>
     {isLoading ? <Spinner /> : holdersCount}
   </div>
 );
};

export default AppInvestHoldersCount;