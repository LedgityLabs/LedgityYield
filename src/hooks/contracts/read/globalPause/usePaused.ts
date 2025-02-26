import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadGlobalPausePaused } from "@/types";

export function useGlobalPausePaused(): boolean | undefined {
  const { appChainId } = useWeb3Context();

  const { data } = useReadGlobalPausePaused({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    args: [],
    query: {
      // refetchInterval: 60 * 1000,
    },
  });

  return data;
}
