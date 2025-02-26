import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLTokenGetApr } from "@/types";

export function useLTokenGetApr(): number {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLTokenGetApr({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    args: [],
    query: {
      // refetchInterval: 60 * 1000,
    },
  });

  return data || 0;
}
