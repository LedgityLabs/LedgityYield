// Hooks
import { useReadContracts } from "wagmi";
import { useEffect, useState } from "react";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useLocalStorage } from "@/hooks/utils/useLocalStorage";
// Data
import { zeroAddress } from "viem";
// Types
import { TokenInfo, genericErc20Abi } from "@/types";

const NB_DATA_POINTS = 3;

export function useTokenInfos(
  tokenTargets: { address: `0x${string}` | undefined; chainId?: number }[],
): TokenInfo[] {
  const { appChainId } = useWeb3Context();
  const [currentValue, setCurrentValue] = useState<TokenInfo[]>([]);

  const { localData, setLocalData } = useLocalStorage<TokenInfo[]>(
    "tokenInfo",
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
    const chainId = token.chainId ?? appChainId;
    const tokenCalls = [
      {
        address,
        chainId,
        abi: genericErc20Abi,
        functionName: "name",
      },
      {
        address,
        chainId,
        abi: genericErc20Abi,
        functionName: "symbol",
      },
      {
        address,
        chainId,
        abi: genericErc20Abi,
        functionName: "decimals",
      },
    ] as const;

    if (tokenCalls.length !== NB_DATA_POINTS)
      throw Error("Invalid number of data points");

    return tokenCalls;
  });

  const { data, error } = useReadContracts({
    query: {
      refetchInterval: 30 * 1000,
    },
    contracts: calls,
  });

  useEffect(() => {
    if (!data) return;

    if (error) {
      // console.warn("Some token info calls have failed");
      return;
    }

    const formattedData: TokenInfo[] = [];

    for (let i = 0; i < data.length; i += NB_DATA_POINTS) {
      const index = Math.floor(i / NB_DATA_POINTS);
      const { address, chainId } = tokenTargets?.[index] ?? zeroAddress;

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
        chainId: chainId ?? appChainId,
        name: data[i].result as string,
        symbol: data[i + 1].result as string,
        decimals: data[i + 2].result as number,
      });
    }

    if (JSON.stringify(formattedData) !== JSON.stringify(currentValue)) {
      setCurrentValue(formattedData);
      setLocalData(formattedData);
    }
  }, [data, error, currentValue]);

  return currentValue;
}
