import { useState, useEffect, useMemo } from "react";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadContracts } from "wagmi";
import { Address, formatUnits, zeroAddress } from "viem";
import { lTokenAbi } from "@/types";

type WithdrawalRequest = {
  id: bigint;
  account: Address;
  amount: bigint;
  isBig: boolean;
};

type WithdrawalRequestsResult = {
  requestsData: WithdrawalRequest[];
  nbStandardRequests: number;
  repatriationNeeded: boolean;
  repatriationAmount: string;
  isLoading: boolean;
  error: Error | null;
};

export function useBatchedWithdrawalRequests(
  lTokenAddress: Address | undefined,
  queueCursor: bigint | undefined,
  expectedRetained: bigint | undefined,
  usableUnderlyings: bigint | undefined,
  underlyingTokenData: { decimals: number } | undefined,
  batchSize: number = 50,
): WithdrawalRequestsResult {
  const { appChainId } = useWeb3Context();
  const [currentBatch, setCurrentBatch] = useState<bigint | null>(null);
  const [endOfQueue, setEndOfQueue] = useState(false);
  const [allRequests, setAllRequests] = useState<WithdrawalRequest[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Prepare batch contract calls
  const contractCalls = useMemo(() => {
    if (!lTokenAddress || !queueCursor || currentBatch === null || endOfQueue) {
      return [];
    }

    return Array.from({ length: batchSize }, (_, i) => {
      const index = currentBatch + BigInt(i);
      return {
        address: lTokenAddress,
        abi: lTokenAbi,
        functionName: "withdrawalQueue",
        args: [index],
        chainId: appChainId,
      } as const;
    });
  }, [
    lTokenAddress,
    queueCursor,
    currentBatch,
    endOfQueue,
    batchSize,
    appChainId,
  ]);

  // Get batch data
  const { data: batchData, isLoading: isBatchLoading } = useReadContracts({
    contracts: contractCalls,
    query: {
      enabled: contractCalls.length > 0,
      refetchInterval: 15 * 1000,
    },
  });

  // Initialize or reset batching process when queueCursor changes
  useEffect(() => {
    if (!!queueCursor) {
      setCurrentBatch(queueCursor);
      setAllRequests([]);
      setEndOfQueue(false);
      setError(null);
    }
  }, [queueCursor]);

  // Process batch results
  useEffect(() => {
    if (isProcessing || !batchData || !currentBatch || !expectedRetained) {
      return;
    }

    setIsProcessing(true);

    try {
      let foundEndOfQueue = false;
      const batchRequests: WithdrawalRequest[] = [];

      for (let i = 0; i < batchData.length; i++) {
        const result = batchData[i];

        // If we got an error or null, it might indicate the end of the queue
        if (!result?.result) {
          foundEndOfQueue = true;
          break;
        }

        const [account, amount] = result.result as readonly [Address, bigint];

        // Skip already processed requests (address is zero address)
        if (account === zeroAddress) continue;

        batchRequests.push({
          id: currentBatch + BigInt(i),
          account,
          amount,
          isBig: amount > expectedRetained / 2n,
        });
      }

      if (batchRequests.length === 0 && batchData.length > 0) {
        foundEndOfQueue = true;
      }

      // Update the state with the new batch data
      setAllRequests((prev) => [...prev, ...batchRequests]);

      if (foundEndOfQueue) {
        setEndOfQueue(true);
      } else {
        // Move to the next batch
        setCurrentBatch(currentBatch + BigInt(batchSize));
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setEndOfQueue(true);
    } finally {
      setIsProcessing(false);
    }
  }, [batchData, currentBatch, expectedRetained, batchSize, isProcessing]);

  // Calculate derived data
  const {
    requestsData,
    nbStandardRequests,
    repatriationNeeded,
    repatriationAmount,
  } = useMemo(() => {
    // Only calculate final results when we've reached the end of the queue
    if (!endOfQueue) {
      return {
        requestsData: allRequests,
        nbStandardRequests: 0,
        repatriationNeeded: false,
        repatriationAmount: "0",
      };
    }

    // Process non-big requests data
    const nonBigData = allRequests.reduce(
      (acc, item) => {
        if (!item.isBig) {
          acc.count++;
          acc.totalAmount += item.amount;
        }
        return acc;
      },
      { count: 0, totalAmount: 0n },
    );

    const needsRepatriation =
      usableUnderlyings !== undefined &&
      nonBigData.totalAmount > usableUnderlyings;

    const repatriationAmountRaw =
      needsRepatriation && usableUnderlyings !== undefined
        ? nonBigData.totalAmount - usableUnderlyings
        : 0n;

    return {
      requestsData: allRequests,
      nbStandardRequests: nonBigData.count,
      repatriationNeeded: needsRepatriation,
      repatriationAmount: formatUnits(
        repatriationAmountRaw,
        underlyingTokenData?.decimals || 0,
      ),
    };
  }, [allRequests, endOfQueue, usableUnderlyings, underlyingTokenData]);

  // Determine overall loading state
  const isLoading =
    isBatchLoading || isProcessing || (currentBatch !== null && !endOfQueue);

  return {
    requestsData,
    nbStandardRequests,
    repatriationNeeded,
    repatriationAmount,
    isLoading,
    error,
  };
}
