import { useLocalStorage } from "@/hooks/utils/useLocalStorage";
import { Activity, execute } from "graphclient";
import { useCallback, useEffect, useState } from "react";

type UserActivityData = {
  data: {
    [key: string]: Activity[];
  };
};

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Hook for fetching and caching user activity data
 */
export function useUserActivityData(
  chainId: number,
  userAddress: string | undefined,
) {
  const cacheKey = `user-activity-${chainId}-${userAddress}`;
  const {
    localData: cachedData,
    lastUpdate,
    setLocalData: setCachedData,
  } = useLocalStorage<{
    data: UserActivityData | null;
    timestamp: number;
  }>(`${cacheKey}`, { data: null, timestamp: 0 });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchActivityData = useCallback(
    async (force = false) => {
      // Don't fetch if no address or chain ID
      if (!userAddress || !chainId) {
        return null;
      }

      // Don't fetch if loading or if cache is still valid
      const now = Date.now();
      if (
        isLoading ||
        (!force && cachedData.data && now - cachedData.timestamp < CACHE_EXPIRY)
      ) {
        return cachedData.data;
      }

      setIsLoading(true);
      setError(undefined);

      try {
        const query = `{
          c${chainId}_activities(where: { account: "${userAddress}" }) {
            id
            requestId
            ltoken {
              symbol
              decimals
            }
            timestamp
            action
            amount
            amountAfterFees
            status
          }
        }`;

        const result = await execute(query, {});
        const activities = result.data?.[`c${chainId}_activities`];

        // Create structured response
        const activityData: UserActivityData = {
          data: {
            [`c${chainId}_activities`]: activities || [],
          },
        };

        // Update cache
        setCachedData({
          data: activityData,
          timestamp: now,
        });

        setIsLoading(false);
        return activityData;
      } catch (e) {
        const errorMessage = "Failed to fetch user activity data";
        setError(errorMessage);
        console.error(errorMessage, e);
        setIsLoading(false);
        return null;
      }
    },
    [chainId, userAddress, cachedData, isLoading, setCachedData],
  );

  // Initial fetch on mount or when dependencies change
  useEffect(() => {
    if (userAddress && chainId) {
      // Only fetch if we don't have data or if cache is expired
      const now = Date.now();
      if (!cachedData.data || now - cachedData.timestamp >= CACHE_EXPIRY) {
        fetchActivityData();
      }
    }
  }, [chainId, userAddress, fetchActivityData, cachedData]);

  // Process the raw data for easier consumption
  const activityData = cachedData.data?.data?.[`c${chainId}_activities`] || [];

  return {
    activityData,
    isLoading,
    error,
    refetch: fetchActivityData,
    lastUpdate: cachedData.timestamp,
  };
}
