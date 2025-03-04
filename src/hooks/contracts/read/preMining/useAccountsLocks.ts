import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useReadPreMiningAccountsLocks } from "@/types";
import { Address, zeroAddress } from "viem";
import { subtractMonths } from "@/functions/helpers";

type PreMiningLock = {
  lockAmount: bigint;
  lockDuration: number;
  lockUnlocked: boolean;
  lockEnd: Date;
  lockStart: Date;
};

const defaultResult = {
  lockAmount: 0n,
  lockDuration: 0,
  lockUnlocked: false,
  lockEnd: new Date(),
  lockStart: new Date(),
};

export function usePreminingAccountsLocks(
  account: Address | undefined,
): PreMiningLock {
  const { appChainId } = useWeb3Context();

  const { data, error } = useReadPreMiningAccountsLocks({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    args: [account || zeroAddress],
    query: {
      // refetchInterval: 60 * 1000,
    },
  });

  if (!data || error) return defaultResult;

  const lockAmount = data[0];
  const lockDuration = data[1];
  const lockUnlocked = data[2];
  const lockEnd = new Date(Number(data[4]) * 1000);
  const lockStart = subtractMonths(lockEnd, lockDuration);

  return {
    lockAmount,
    lockDuration,
    lockUnlocked,
    lockEnd,
    lockStart,
  };
}
