import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLTokenUnclaimedFees } from "@/types";

export function useLTokenUnclaimedFees(): bigint {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLTokenUnclaimedFees({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    args: [],
    query: {
      refetchInterval: 15 * 1000,
    },
  });

  return data || 0n;
}
