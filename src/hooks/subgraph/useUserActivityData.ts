import { useLocalStorage } from "@/hooks/utils/useLocalStorage";
import { Activity, execute } from "graphclient";
import { useCallback, useEffect, useState } from "react";

type UserActivityData = {
  [key: string]: Activity[];
};

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Hook for fetching and caching user activity data
 */
export function useUserActivityData(
  appChainId: number,
  currentAccount: string | undefined,
) {
  const cacheKey = `user-activity-${appChainId}-${currentAccount}`;
  const {
    localData: cachedData,
    lastUpdate,
    setLocalData: setCachedData,
  } = useLocalStorage<{
    data: UserActivityData;
    timestamp: number;
  }>(`${cacheKey}`, { data: {}, timestamp: 0 });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentChainActivityData, setCurrentChainActivityData] = useState<
    Activity[]
  >([]);

  const fetchData = useCallback(
    async (force = false) => {
      // Don't fetch if no address or chain ID
      if (!currentAccount || !appChainId) {
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
          c${appChainId}_activities(where: { account: "${currentAccount}" }) {
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

        const activities = result.data?.[`c${appChainId}_activities`];

        // Update cache
        setCachedData({
          data: {
            ...cachedData.data,
            [`c${appChainId}_activities`]: activities || [],
          },
          timestamp: now,
        });

        if (
          JSON.stringify(currentChainActivityData) !==
          JSON.stringify(activities)
        )
          setCurrentChainActivityData(activities);

        setIsLoading(false);
        return activities;
      } catch (e) {
        const errorMessage = "Failed to fetch user activity data";
        setError(errorMessage);
        console.error(errorMessage, e);
        setIsLoading(false);
        return null;
      }
    },
    [appChainId, currentAccount, isLoading],
  );

  useEffect(() => {
    if (
      !cachedData.data?.[`c${appChainId}_activities`] ||
      JSON.stringify(currentChainActivityData) ===
        JSON.stringify(cachedData.data?.[`c${appChainId}_activities`])
    )
      return;

    setCurrentChainActivityData(cachedData.data?.[`c${appChainId}_activities`]);
  }, [cachedData, appChainId, currentChainActivityData]);

  // Initial fetch on mount or when dependencies change
  useEffect(() => {
    if (!currentAccount || !appChainId) return;
    // Only fetch if we don't have data or if cache is expired
    const now = Date.now();
    if (!cachedData.data || now - cachedData.timestamp >= CACHE_EXPIRY) {
      fetchData();
    }
  }, [appChainId, currentAccount, fetchData]);

  // Process the raw data for easier consumption

  return {
    activityData: currentChainActivityData,
    isLoading,
    error,
    lastUpdate: cachedData.timestamp,
  };
}
