import { useAccount, usePublicClient } from "wagmi";
import { getTokenUSDRate } from "@/lib/getTokenUSDRate";
import { formatUnits, zeroAddress } from "viem";
import { readLToken } from "@/generated";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { getContractAddress } from "@/lib/getContractAddress";
import { useEffect, useState } from "react";
import { Activity, LToken, RewardsMint, execute } from "graphclient";
import { config } from "@/lib/dapp/config";
import { useCurrentChain } from "@/hooks/useCurrentChain";

type Data = Record<
  string,
  {
    timestamp: number;
    revenue: number;
    balanceBefore: number;
    growth: number;
  }[]
>;

interface CacheEntry {
  timestamp: number;
  data: Data;
}

const dataCacheDuration = 60 * 10; // 10 minutes
let dataCache: Record<number, CacheEntry> = {};

export const useGrowthRevenueData = () => {
  const lTokens = useAvailableLTokens();
  const publicClient = usePublicClient();
  const currentChain = useCurrentChain();
  const account = useAccount();
  const [data, setData] = useState<Data>({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isDataError, setIsError] = useState(false);
  const [dataErrorMessage, setDataErrorMessage] = useState<string>();

  const computeData = async () => {
    // If no wallet connected
    if (!account || !account.chainId) {
      setIsError(true);
      setDataErrorMessage("No wallet connected");
      return;
    }

    // If data cache doesn't exist or isn't valid anymore
    const cacheEntry = dataCache[account.chainId];
    if (
      !cacheEntry ||
      Date.now() / 1000 - cacheEntry.timestamp > dataCacheDuration
    ) {
      // Get new data
      const newData = await _computeData();

      // If there is no data
      if (newData === null) {
        setIsError(true);
        setDataErrorMessage("No data yet");
        return;
      }

      // Refresh cached data
      dataCache[account.chainId] = {
        data: newData,
        timestamp: Date.now() / 1000,
      };
    }

    // Else remove errors
    setIsError(false);
    setDataErrorMessage(undefined);

    // Update data
    setData(dataCache[account.chainId].data);
  };

  const _computeData = async () => {
    // Else compute new data
    const newData: Data = {};

    // Initialize empty data keys arrays
    lTokens.forEach((lToken) => (newData[lToken] = []));

    // Retrieve investments start timestamps for each L-Token
    // @ts-ignore
    const investmentStartRequest: {
      data: {
        [key: string]: LToken[] & {
          activities: Activity[];
        };
      };
    } = await execute(
      `
      {
        c${account.chainId}_ltokens {
          symbol
          activities(where: {account: "${
            account.address
          }" }, orderBy: timestamp, orderDirection: asc, first: 1) {
            timestamp
          }
        }
      }
      `,
      {},
    );

    // Return empty data if there is no investment start
    if (!investmentStartRequest.data) return null;
    const investmentStartData =
      investmentStartRequest.data[`c${account.chainId}_ltokens`];
    if (!investmentStartData) return null;

    // Push investment start as first data point
    for (const lToken of investmentStartData) {
      if (lToken.activities && lToken.activities.length > 0) {
        newData[lToken.symbol].push({
          timestamp: Number(lToken.activities[0].timestamp),
          revenue: 0,
          balanceBefore: 0,
          growth: 0,
        });
      }
    }

    // Retrieve all rewards mints events data
    // @ts-ignore
    const mintsEventsRequest: {
      data: {
        [key: string]: [
          RewardsMint & {
            ltoken: LToken;
          },
        ];
      };
    } = await execute(
      `
      {
        c${account.chainId}_rewardsMints(where: { account: "${
          account.address
        }" }, orderBy: timestamp, orderDirection: asc) {
          timestamp
          revenue
          growth
          balanceBefore
          ltoken {
            id
            symbol
            decimals
          }
        }
      }
      `,
      {},
    );

    // Push each reward mint as data point
    const mintsEventsData =
      mintsEventsRequest.data[`c${account.chainId}_rewardsMints`];
    for (const rewardsMint of mintsEventsData) {
      const usdRate = await getTokenUSDRate(rewardsMint.ltoken.symbol.slice(1));

      // Convert revenue to decimals and then to USD
      let revenue = Number(
        formatUnits(BigInt(rewardsMint.revenue), rewardsMint.ltoken.decimals),
      );
      revenue = revenue * usdRate;

      // Convert balance before to decimals and then to USD
      let balanceBefore = Number(
        formatUnits(
          BigInt(rewardsMint.balanceBefore),
          rewardsMint.ltoken.decimals,
        ),
      );
      balanceBefore = balanceBefore * usdRate;

      newData[rewardsMint.ltoken.symbol].push({
        timestamp: Number(rewardsMint.timestamp),
        revenue: revenue,
        balanceBefore: balanceBefore,
        growth: Number(rewardsMint.growth),
      });
    }

    // Push not yet minted rewards as data point
    if (currentChain) {
      for (const lToken of lTokens) {
        const lTokenAddress = getContractAddress(lToken, currentChain.id)!;
        const decimals = await readLToken(config, {
          address: lTokenAddress,
          functionName: "decimals",
        });
        const _balanceBefore = await readLToken(config, {
          address: lTokenAddress,
          functionName: "realBalanceOf",
          args: [account.address || zeroAddress],
        });
        const unclaimedRewards = await readLToken(config, {
          address: lTokenAddress,
          functionName: "unmintedRewardsOf",
          args: [account.address || zeroAddress],
        });
        const usdRate = await getTokenUSDRate(lToken.slice(1));

        // Convert revenue to decimals and then to USD
        let revenue = Number(formatUnits(unclaimedRewards, decimals));
        revenue = revenue * usdRate;

        // Convert balance before to decimals and then to USD
        let balanceBefore = Number(formatUnits(_balanceBefore, decimals));
        balanceBefore = balanceBefore * usdRate;

        newData[lToken].push({
          timestamp: Math.floor(Date.now() / 1000),
          revenue: revenue,
          balanceBefore: balanceBefore,
          growth: balanceBefore ? revenue / balanceBefore : 0,
        });
      }
    }

    setDataErrorMessage(undefined);
    setIsError(false);
    return newData;
  };

  useEffect(() => {
    setIsDataLoading(true);
    computeData().then(() => setIsDataLoading(false));
  }, []);

  useEffect(() => {
    setIsDataLoading(true);
    computeData().then(() => setIsDataLoading(false));
  }, [account.address, publicClient]);

  return { data, isDataLoading, isDataError, dataErrorMessage };
};
