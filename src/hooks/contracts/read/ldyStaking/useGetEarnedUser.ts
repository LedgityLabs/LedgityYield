import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLdyStakingGetEarnedUser } from "@/types";
import { Address, zeroAddress } from "viem";

export function useGetEarnedUser(
  account: Address | undefined,
): readonly bigint[] {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLdyStakingGetEarnedUser({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    args: [account || zeroAddress],
    query: {
      refetchInterval: 60 * 1000,
    },
  });

  return data || [];
}
