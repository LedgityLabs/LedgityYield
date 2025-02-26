import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadLTokenFund } from "@/types";
import { Address, zeroAddress } from "viem";

export function useLTokenFund(): Address {
  const { appChainId } = useWeb3Context();

  const { data } = useReadLTokenFund({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    args: [],
    query: {
      // refetchInterval: 60 * 1000,
    },
  });

  return data || zeroAddress;
}
