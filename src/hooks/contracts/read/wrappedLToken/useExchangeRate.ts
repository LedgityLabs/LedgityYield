import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadWrappedLTokenExchangeRate } from "@/types";
import { Address } from "viem";

/// @dev Return a RAY (27 decimals) exchange rate
export function useWrappedExchangeRate(
  wrappedTokenAddress: Address | undefined,
): bigint {
  const { appChainId } = useWeb3Context();

  const { data } = useReadWrappedLTokenExchangeRate({
    chainId: appChainId as any,
    address: wrappedTokenAddress,
    query: {
      refetchInterval: 30 * 1000,
    },
  });

  return data || 0n;
}
