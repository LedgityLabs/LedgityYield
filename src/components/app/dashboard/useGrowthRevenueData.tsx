import { usePublicClient, useWalletClient } from "wagmi";
import { getTokenUSDRate } from "@/lib/getTokenUSDRate";
import { ContractId } from "../../../../contracts/deployments";
import { formatUnits } from "viem";
import { readLToken } from "@/generated";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { getContractAddress } from "@/lib/getContractAddress";
import { useEffect, useState } from "react";
import { Activity, LToken, RewardsMint, execute } from "../../../../.graphclient";

type Data = Record<
  string,
  {
    timestamp: number;
    revenue: number;
    balanceBefore: number;
    growth: number;
  }[]
>;

const dataCacheDuration = 60 * 10; // 10 minutes
let dataCache: Promise<Data> | null = null;
let lastCacheTimestamp: number | null = null;

export const useGrowthRevenueData = () => {
  const lTokens = useAvailableLTokens();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [data, setData] = useState<Data>({});
  const [isDataLoading, setIsDataLoading] = useState(true);

  const computeData = async () => {
    // If data cache doesn't exist or isn't valid anymore
    if (
      lastCacheTimestamp === null ||
      dataCache === null ||
      Date.now() / 1000 - lastCacheTimestamp > dataCacheDuration
    ) {
      console.log("CACHE MISS");
      // Populate data cache
      dataCache = _computeData();
      lastCacheTimestamp = Date.now() / 1000;
    } else console.log("CACHE HIT");

    setData(await dataCache);
  };
  const _computeData = async () => {
    // Else compute new data
    const newData: Data = {};

    // Initialize empty data keys arrays
    lTokens.forEach((lToken) => (newData[lToken] = []));

    // Retrieve investments start timestamps for each L-Token
    const investmentStartRequest: {
      data: {
        ltokens: LToken[] & {
          activities: Activity[];
        };
      };
    } = await execute(
      `
    {
      ltokens {
        symbol
        activities(where: {account: "${
          walletClient!.account.address
        }" }, orderBy: timestamp, orderDirection: asc, first: 1) {
          timestamp
        }
      }
    }
    `,
    );

    // Push investment start as first data point
    for (const lToken of investmentStartRequest.data.ltokens) {
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
    const results: {
      data: {
        rewardsMints: [
          RewardsMint & {
            ltoken: LToken;
          },
        ];
      };
    } = await await execute(
      `
      {
        rewardsMints(where: { account: "${
          walletClient!.account.address
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
    );

    // Push each reward mint as data point
    for (const rewardsMint of results.data.rewardsMints) {
      const usdRate = await getTokenUSDRate(rewardsMint.ltoken.symbol.slice(1) as ContractId);

      // Convert revenue to decimals and then to USD
      let revenue = Number(formatUnits(BigInt(rewardsMint.revenue), rewardsMint.ltoken.decimals));
      revenue = revenue * usdRate;

      // Convert balance before to decimals and then to USD
      let balanceBefore = Number(
        formatUnits(BigInt(rewardsMint.balanceBefore), rewardsMint.ltoken.decimals),
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
    for (const lToken of lTokens) {
      const lTokenAddress = getContractAddress(lToken, publicClient.chain.id)!;
      const decimals = await readLToken({
        address: lTokenAddress,
        functionName: "decimals",
      });
      const _balanceBefore = await readLToken({
        address: lTokenAddress,
        functionName: "realBalanceOf",
        args: [walletClient!.account.address],
      });
      const unclaimedRewards = await readLToken({
        address: lTokenAddress,
        functionName: "unmintedRewardsOf",
        args: [walletClient!.account.address],
      });
      const usdRate = await getTokenUSDRate(lToken.slice(1) as ContractId);

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
    return newData;
  };

  useEffect(() => {
    if (walletClient) {
      setIsDataLoading(true);
      computeData().then(() => setIsDataLoading(false));
    }
  }, []);
  useEffect(() => {
    setIsDataLoading(true);
    computeData().then(() => setIsDataLoading(false));
  }, [walletClient]);
  return { data, isDataLoading };
};
