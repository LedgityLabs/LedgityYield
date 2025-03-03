import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLTokenWithdrawalQueueCursor } from "@/types";
import { Address } from "viem";

export function useLTokenWithdrawalQueueCursor(
  lTokenAddress: Address | undefined,
): bigint {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLTokenWithdrawalQueueCursor({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    address: lTokenAddress,
    args: [],
    query: {
      refetchInterval: 15 * 1000,
    },
  });

  return data || 0n;
}
