import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLTokenUnderlying } from "@/types";
import { Address, zeroAddress } from "viem";

export function useLTokenUnderlying(): Address {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLTokenUnderlying({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    args: [],
    query: {
      // refetchInterval: 60 * 1000,
    },
  });

  return data || zeroAddress;
}
