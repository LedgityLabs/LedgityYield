import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLdyStakingTotalWeightedStake } from "@/types";
import { Address } from "viem";

export function useTotalWeightedStake(): bigint {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLdyStakingTotalWeightedStake({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    args: [],
    query: {
      refetchInterval: 60 * 1000,
    },
  });

  return data || 0n;
}
