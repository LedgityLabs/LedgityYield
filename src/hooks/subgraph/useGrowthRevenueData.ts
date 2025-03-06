import { formatUnits } from "viem";
// Hooks
import { useEffect, useState } from "react";
import { useTokenPricesUsd } from "@/hooks/api/useTokenPricesUsd";
import { useAppDataContext } from "@/hooks/context/AppDataContextProvider";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useLTokenBalancesAndRewards } from "@/hooks/contracts";
import { useInvestmentStartData } from "@/hooks/subgraph/useInvestmentStartData";
import { useRewardsMintsData } from "@/hooks/subgraph/useRewardsMintsData";

export type GraphTokenEntry = {
  timestamp: number;
  revenue: number;
  balanceBefore: number;
  growth: number;
};

export type GraphTokenData = {
  [ltokenNames: string]: GraphTokenEntry[];
};

export function useGrowthRevenueData(): {
  growthData: GraphTokenData;
  isDataLoading: boolean;
  isDataError: boolean;
  dataErrorMessage?: string;
} {
  const { currentAccount, appChainId } = useWeb3Context();
  const { lTokenInfosCurrentChain, tokenInfos } = useAppDataContext();

  const underlyingTokenData = lTokenInfosCurrentChain
    .map((lToken) =>
      tokenInfos.find(
        (token) =>
          token.address.toLowerCase() === lToken.underlying.toLowerCase(),
      ),
    )
    .filter((token) => token !== undefined);

  const tokenPriceUsd = useTokenPricesUsd(
    underlyingTokenData.map((token) => token.symbol),
  );
  const rewardData = useLTokenBalancesAndRewards(
    lTokenInfosCurrentChain.map(({ address, chainId }) => ({
      address,
      chainId,
    })),
    currentAccount,
  );

  // Use our cached query hooks
  const {
    data: investmentStartData,
    isLoading: isInvestmentDataLoading,
    error: investmentDataError,
  } = useInvestmentStartData(appChainId, currentAccount);

  const {
    data: rewardsMintsData,
    isLoading: isRewardsMintsLoading,
    error: rewardsMintsError,
  } = useRewardsMintsData(appChainId, currentAccount);

  // Calculate the final data similarly to your original hook
  const [processedData, setProcessedData] = useState<GraphTokenData>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Process data when the query results change
  useEffect(() => {
    if (!currentAccount || !appChainId || isProcessing) return;
    if (!investmentStartData?.data && !rewardsMintsData?.data) return;
    if (!Object.keys(tokenPriceUsd).length || !rewardData.length) return;

    setIsProcessing(true);

    const newData: GraphTokenData = {};

    // Process investment start data
    if (investmentStartData?.data) {
      const investmentStartItems =
        investmentStartData.data[`c${appChainId}_ltokens`];

      // Push investment start as first data point
      for (const lToken of investmentStartItems || []) {
        if (lToken.activities && lToken.activities.length > 0) {
          newData[lToken.symbol] ??= [];

          newData[lToken.symbol].push({
            timestamp: Number(lToken.activities[0].timestamp),
            revenue: 0,
            balanceBefore: 0,
            growth: 0,
          });
        }
      }
    }

    // Process rewards mints data
    if (rewardsMintsData?.data) {
      const mintsEventsItems =
        rewardsMintsData.data[`c${appChainId}_rewardsMints`];

      for (const rewardsMint of mintsEventsItems || []) {
        const underlyingSymbol = rewardsMint.ltoken.symbol
          .slice(1)
          .toUpperCase();
        const usdRate = tokenPriceUsd[underlyingSymbol] || 0;

        // Convert revenue to decimals and then to USD
        const revenue =
          Number(
            formatUnits(
              BigInt(rewardsMint.revenue),
              rewardsMint.ltoken.decimals,
            ),
          ) * usdRate;

        // Convert balance before to decimals and then to USD
        let balanceBefore = Number(
          formatUnits(
            BigInt(rewardsMint.balanceBefore),
            rewardsMint.ltoken.decimals,
          ),
        );
        balanceBefore = balanceBefore * usdRate;

        newData[rewardsMint.ltoken.symbol] ??= [];
        newData[rewardsMint.ltoken.symbol].push({
          timestamp: Number(rewardsMint.timestamp),
          revenue: revenue,
          balanceBefore: balanceBefore,
          growth: Number(rewardsMint.growth),
        });
      }
    }

    // Process not yet minted rewards
    for (const lToken of lTokenInfosCurrentChain) {
      const underlyingSymbol = lToken.symbol.slice(1).toUpperCase();
      const lTokenAddress = lToken.address;
      const decimals = lToken.decimals;

      const { realBalance, unclaimedRewards } =
        rewardData.find(
          (data) =>
            data.address.toLowerCase() === lTokenAddress.toLowerCase() &&
            data.chainId === appChainId,
        ) || {};

      if (!realBalance || !unclaimedRewards) continue;

      const usdRate = tokenPriceUsd[underlyingSymbol] || 0;

      // Convert revenue to decimals and then to USD
      const timestamp = Math.floor(Date.now() / 1000);
      const revenue = Number(formatUnits(unclaimedRewards, decimals)) * usdRate;

      // Convert balance before to decimals and then to USD
      const formattedBalanceBefore = Number(formatUnits(realBalance, decimals));
      const balanceBefore = formattedBalanceBefore * usdRate;
      const growth = balanceBefore ? revenue / balanceBefore : 0;

      newData[lToken.symbol] ??= [];
      newData[lToken.symbol].push({
        timestamp,
        revenue,
        balanceBefore,
        growth,
      });
    }

    if (JSON.stringify(newData) !== JSON.stringify(processedData))
      setProcessedData(newData);

    setIsProcessing(false);
  }, [
    investmentStartData,
    rewardsMintsData,
    currentAccount,
    appChainId,
    lTokenInfosCurrentChain,
    rewardData,
  ]);

  return {
    growthData: processedData,
    isDataLoading:
      isInvestmentDataLoading || isRewardsMintsLoading || isProcessing,
    isDataError: !!investmentDataError || !!rewardsMintsError,
    dataErrorMessage: investmentDataError || rewardsMintsError,
  };
}
