import { useReadContracts } from "wagmi";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/utils/useLocalStorage";
import { zeroAddress, Address } from "viem";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { lTokenAbi } from "@/types";

export type LTokenBalanceAndReward = {
  address: Address;
  chainId: number;
  realBalance: bigint;
  unclaimedRewards: bigint;
};

export function useLTokenBalancesAndRewards(
  tokenTargets: { address: `0x${string}` | undefined; chainId: number }[],
  userAddress?: `0x${string}`,
): LTokenBalanceAndReward[] {
  const [currentValue, setCurrentValue] = useState<LTokenBalanceAndReward[]>(
    [],
  );
  const { localData, setLocalData } = useLocalStorage<LTokenBalanceAndReward[]>(
    "ltokenBalancesAndRewards",
    [],
  );
  const { appChainId } = useWeb3Context();

  useEffect(() => {
    if (!currentValue.length && localData.length) setCurrentValue(localData);
  }, [currentValue, localData]);

  const tokensFiltered = [...new Set(tokenTargets)].filter(
    ({ address }) =>
      address !== "0x0000000000000000000000000000000000000000" &&
      address !== undefined,
  );

  const calls = tokensFiltered?.flatMap((token) => {
    const address = token.address ?? zeroAddress;
    const chainId = token.chainId;
    return [
      {
        address,
        chainId,
        abi: lTokenAbi,
        functionName: "realBalanceOf",
        args: [userAddress ?? zeroAddress],
      },
      {
        address,
        chainId,
        abi: lTokenAbi,
        functionName: "unmintedRewardsOf",
        args: [userAddress ?? zeroAddress],
      },
    ] as const;
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

    const formattedData: LTokenBalanceAndReward[] = [];
    const NB_DATA_POINTS = 2; // realBalanceOf and unmintedRewardsOf

    for (let i = 0; i < data.length; i += NB_DATA_POINTS) {
      const addressIndex = Math.floor(i / NB_DATA_POINTS);
      const address =
        (tokenTargets?.[addressIndex].address as Address) ?? zeroAddress;
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
        realBalance: userAddress ? (data[i].result as bigint) : 0n,
        unclaimedRewards: userAddress ? (data[i + 1].result as bigint) : 0n,
      });
    }

    if (JSON.stringify(formattedData) !== JSON.stringify(currentValue)) {
      setCurrentValue(formattedData);
      setLocalData(formattedData);
    }
  }, [data, error, userAddress, currentValue, tokenTargets, setLocalData]);

  return currentValue;
}
