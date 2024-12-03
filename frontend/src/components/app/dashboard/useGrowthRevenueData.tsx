import { useAccount, usePublicClient } from "wagmi";
import { getTokenUSDRate } from "@/lib/getTokenUSDRate";
import { formatUnits, zeroAddress } from "viem";
import { readLToken } from "@/generated";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { getContractAddress } from "@/lib/getContractAddress";
import { useEffect, useState } from "react";
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

const SUPPORTED_NETWORKS = {
  42161: { 
    name: 'Arbitrum', 
    endpoint: process.env.NEXT_PUBLIC_ARBITRUM_SUBGRAPH_URL || '',
  },
  59144: { 
    name: 'Linea', 
    endpoint: process.env.NEXT_PUBLIC_LINEA_SUBGRAPH_URL || '',
  },
  8453: {  // Base Mainnet Chain ID
    name: 'Base',
    endpoint: process.env.NEXT_PUBLIC_BASE_SUBGRAPH_URL || '',
    prefix: ''
  }
};

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

  const getNetworkConfig = (chainId?: number) => {
    if (!chainId) return null;
    return SUPPORTED_NETWORKS[chainId as keyof typeof SUPPORTED_NETWORKS];
  };

  const querySubgraph = async (endpoint: string, query: string) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const computeData = async () => {
    if (!account || !account.chainId) {
      setIsError(true);
      setDataErrorMessage("No wallet connected");
      return;
    }

    const network = getNetworkConfig(account.chainId);
    if (!network) {
      setIsError(true);
      setDataErrorMessage("Unsupported network");
      return;
    }

    const cacheEntry = dataCache[account.chainId];
    if (!cacheEntry || Date.now() / 1000 - cacheEntry.timestamp > dataCacheDuration) {
      const newData = await _computeData(network.endpoint);

      if (newData === null) {
        setIsError(true);
        setDataErrorMessage("No data yet");
        return;
      }

      dataCache[account.chainId] = {
        data: newData,
        timestamp: Date.now() / 1000,
      };
    }

    setIsError(false);
    setDataErrorMessage(undefined);
    setData(dataCache[account.chainId].data);
  };

  const _computeData = async (endpoint: string) => {
    const newData: Data = {};
    lTokens.forEach((lToken) => (newData[lToken] = []));

    try {
      // Query investment starts
      const investmentStartQuery = `
        {
          ltokens {
            symbol
            activities(
              where: { account: "${account.address}" }
              orderBy: timestamp
              orderDirection: asc
              first: 1
            ) {
              timestamp
            }
          }
        }
      `;

      const investmentStartResult = await querySubgraph(endpoint, investmentStartQuery);
      const ltokens = investmentStartResult.data?.ltokens;

      if (!ltokens) return null;

      // Add investment start data points
      for (const lToken of ltokens) {
        if (lToken.activities && lToken.activities.length > 0) {
          newData[lToken.symbol].push({
            timestamp: Number(lToken.activities[0].timestamp),
            revenue: 0,
            balanceBefore: 0,
            growth: 0,
          });
        }
      }

      // Query rewards mints
      const rewardsMintsQuery = `
        {
          rewardsMints(
            where: { account: "${account.address}" }
            orderBy: timestamp
            orderDirection: asc
          ) {
            timestamp
            revenue
            growth
            balanceBefore
            ltoken {
              symbol
              decimals
            }
          }
        }
      `;

      const rewardsMintsResult = await querySubgraph(endpoint, rewardsMintsQuery);
      const rewardsMints = rewardsMintsResult.data?.rewardsMints;

      if (rewardsMints) {
        for (const mint of rewardsMints) {
          const usdRate = await getTokenUSDRate(mint.ltoken.symbol.slice(1));

          let revenue = Number(formatUnits(BigInt(mint.revenue), mint.ltoken.decimals));
          revenue = revenue * usdRate;

          let balanceBefore = Number(
            formatUnits(BigInt(mint.balanceBefore), mint.ltoken.decimals)
          );
          balanceBefore = balanceBefore * usdRate;

          newData[mint.ltoken.symbol].push({
            timestamp: Number(mint.timestamp),
            revenue,
            balanceBefore,
            growth: Number(mint.growth),
          });
        }
      }

      // Add unminted rewards
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

          let revenue = Number(formatUnits(unclaimedRewards, decimals));
          revenue = revenue * usdRate;

          let balanceBefore = Number(formatUnits(_balanceBefore, decimals));
          balanceBefore = balanceBefore * usdRate;

          newData[lToken].push({
            timestamp: Math.floor(Date.now() / 1000),
            revenue,
            balanceBefore,
            growth: balanceBefore ? revenue / balanceBefore : 0,
          });
        }
      }

      return newData;
    } catch (error) {
      console.error('Error computing data:', error);
      return null;
    }
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

export default useGrowthRevenueData;