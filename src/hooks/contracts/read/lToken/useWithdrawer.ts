import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLTokenWithdrawer } from "@/types";
import { Address, zeroAddress } from "viem";

export function useLTokenWithdrawer(
  lTokenAddress: Address | undefined,
): Address {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLTokenWithdrawer({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    address: lTokenAddress,
    args: [],
    query: {
      // refetchInterval: 60 * 1000,
    },
  });

  return data || zeroAddress;
}
