import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLTokenUsableUnderlyings } from "@/types";
import { Address } from "viem";

export function useLTokenUsableUnderlyings(
  lTokenAddress: Address | undefined,
): bigint {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLTokenUsableUnderlyings({
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
