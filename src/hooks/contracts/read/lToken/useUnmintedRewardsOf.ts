import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLTokenUnmintedRewardsOf } from "@/types";
import { Address, zeroAddress } from "viem";

export function useLTokenUnmintedRewardsOf(
  lTokenAddress: Address | undefined,
  account: Address | undefined,
): bigint {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLTokenUnmintedRewardsOf({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    address: lTokenAddress,
    args: [account || zeroAddress],
    query: {
      // refetchInterval: 60 * 1000,
    },
  });

  if (!account || !data) return 0n;

  return data;
}
