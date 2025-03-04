import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLdyStakingRewardRatePerSec } from "@/types";
import { Address } from "viem";

export function useRewardRatePerSec(): bigint {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLdyStakingRewardRatePerSec({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    args: [],
    query: {
      refetchInterval: 60 * 1000,
    },
  });

  return data || 0n;
}
