import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLdyStakingGetUserStakes } from "@/types";
import { Address, zeroAddress } from "viem";
import { UserStakeData } from "@/types";

export function useGetUserStakes(
  account: Address | undefined,
): readonly UserStakeData[] {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLdyStakingGetUserStakes({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    args: [account || zeroAddress],
    query: {
      refetchInterval: 60 * 1000,
    },
  });

  return (
    data?.map((el, i) => ({
      ...el,
      stakeIndex: BigInt(i),
    })) || []
  );
}
