import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLTokenGetApr } from "@/types";
import { Address } from "viem";

export function useLTokenGetApr(lTokenAddress: Address | undefined): number {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLTokenGetApr({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    address: lTokenAddress,
    args: [],
    query: {
      refetchInterval: 15 * 1000,
    },
  });

  return data || 0;
}
