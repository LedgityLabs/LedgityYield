// Hooks
import { useReadContracts } from "wagmi";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/utils/useLocalStorage";
// Datas
import { zeroAddress, Address } from "viem";
// Types
import { wrappedLTokenAbi, WLTokenInfo } from "@/types";

const NB_DATA_POINTS = 7;

export function useWLTokenInfos(
  tokenTargets: { address: `0x${string}` | undefined; chainId: number }[],
  userAddress?: `0x${string}`,
): WLTokenInfo[] {
  const [currentValue, setCurrentValue] = useState<WLTokenInfo[]>([]);

  const { localData, setLocalData } = useLocalStorage<WLTokenInfo[]>(
    "wltokenInfo",
    [],
  );

  useEffect(() => {
    if (!currentValue.length && localData.length) setCurrentValue(localData);
  }, [currentValue]);

  const tokensFiltered = [...new Set(tokenTargets)].filter(
    ({ address }) =>
      address !== "0x0000000000000000000000000000000000000000" &&
      address !== undefined,
  );

  const calls = tokensFiltered?.flatMap((token) => {
    const address = token.address ?? zeroAddress;
    const chainId = token.chainId;
    const tokenCalls = [
      {
        address,
        chainId,
        abi: wrappedLTokenAbi,
        functionName: "name",
      },
      {
        address,
        chainId,
        abi: wrappedLTokenAbi,
        functionName: "symbol",
      },
      {
        address,
        chainId,
        abi: wrappedLTokenAbi,
        functionName: "decimals",
      },
      {
        address,
        chainId,
        abi: wrappedLTokenAbi,
        functionName: "exchangeRate",
      },
      {
        address,
        chainId,
        abi: wrappedLTokenAbi,
        functionName: "totalSupply",
      },
      {
        address,
        chainId,
        abi: wrappedLTokenAbi,
        functionName: "lToken",
      },
      {
        address,
        chainId,
        abi: wrappedLTokenAbi,
        functionName: "balanceOf",
        args: [userAddress ?? zeroAddress],
      },
    ] as const;

    if (tokenCalls.length !== NB_DATA_POINTS)
      throw Error("Invalid number of data points");

    return tokenCalls;
  });

  const { data, error, refetch } = useReadContracts({
    query: {
      refetchInterval: 30 * 1000,
    },
    contracts: calls,
  });

  useEffect(() => {
    if (error || !data) {
      return;
    }

    const formattedData: WLTokenInfo[] = [];

    for (let i = 0; i < data.length; i += NB_DATA_POINTS) {
      const addressIndex = Math.floor(i / NB_DATA_POINTS);
      const address = tokenTargets?.[addressIndex].address ?? zeroAddress;
      const chainId = tokenTargets?.[addressIndex].chainId ?? 0;

      if (
        !address ||
        data
          .slice(i, i + NB_DATA_POINTS)
          .some((data) => data.result === undefined) ||
        data
          .slice(i, i + NB_DATA_POINTS)
          .some((data) => data.error !== undefined)
      ) {
        continue;
      }

      formattedData.push({
        address,
        chainId,
        name: data[i].result as string,
        symbol: data[i + 1].result as string,
        decimals: data[i + 2].result as number,
        exchangeRate: data[i + 3].result as number,
        totalSupply: data[i + 4].result as bigint,
        lToken: data[i + 5].result as Address,
        balance: userAddress ? (data[i + 6].result as bigint) : 0n,
      });
    }

    if (JSON.stringify(formattedData) !== JSON.stringify(currentValue)) {
      setCurrentValue(formattedData);
      setLocalData(formattedData);
    }
  }, [data, error, userAddress, currentValue]);

  return currentValue;
}
