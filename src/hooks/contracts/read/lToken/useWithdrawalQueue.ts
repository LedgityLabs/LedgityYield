import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLTokenWithdrawalQueue } from "@/types";
import { Address, zeroAddress } from "viem";

export function useLTokenWithdrawalQueue(
  lTokenAddress: Address | undefined,
  index: bigint,
): readonly [Address, bigint] {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLTokenWithdrawalQueue({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    address: lTokenAddress,
    args: [index],
    query: {
      refetchInterval: 15 * 1000,
    },
  });

  return data || [zeroAddress, 0n];
}
