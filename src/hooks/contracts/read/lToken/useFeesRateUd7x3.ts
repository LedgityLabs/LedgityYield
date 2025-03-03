import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLTokenFeesRateUd7x3 } from "@/types";
import { Address } from "viem";

export function useLTokenFeesRateUd7x3(
  lTokenAddress: Address | undefined,
): number {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLTokenFeesRateUd7x3({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    address: lTokenAddress,
    args: [],
    query: {
      // refetchInterval: 60 * 1000,
    },
  });

  return data || 0;
}
