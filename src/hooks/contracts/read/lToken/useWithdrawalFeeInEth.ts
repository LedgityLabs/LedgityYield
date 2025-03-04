import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLTokenWithdrawalFeeInEth } from "@/types";
import { Address } from "viem";

export function useLTokenWithdrawalFeeInEth(
  lTokenAddress: Address | undefined,
): bigint | undefined {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLTokenWithdrawalFeeInEth({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    address: lTokenAddress,
    args: [],
    query: {
      refetchInterval: 15 * 1000,
    },
  });

  return data;
}
