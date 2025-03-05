import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  useReadLTokenUsableUnderlyings,
  useReadLTokenTotalQueued,
  useReadLTokenOnlyHighTierInstantWithdrawal,
  useReadLdyStakingHighTierAccounts,
} from "@/types";
import { Address, zeroAddress } from "viem";

/**
 * Checks the core conditions for an instant withdrawal to succeed
 * Simplified from the LToken contract
 */
export function useCanInstantWithdraw(
  account: Address | undefined,
  lTokenAddress: Address | undefined,
  amount: bigint,
): boolean | undefined {
  const { appChainId } = useWeb3Context();

  if (!lTokenAddress) return undefined;

  const { data: usableUnderlyings } = useReadLTokenUsableUnderlyings({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    address: lTokenAddress,
    args: [],
    query: {
      refetchInterval: 15 * 1000,
    },
  });
  const { data: totalQueued } = useReadLTokenTotalQueued({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    address: lTokenAddress,
    args: [],
    query: {
      refetchInterval: 15 * 1000,
    },
  });
  const { data: onlyHighTier } = useReadLTokenOnlyHighTierInstantWithdrawal({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    address: lTokenAddress,
    args: [],
    query: {
      refetchInterval: 15 * 1000,
    },
  });
  const { data: isHighTier } = useReadLdyStakingHighTierAccounts({
    // @dev Chain ID typesafety doing its job but getting in the way here
    chainId: appChainId as any,
    args: [account || zeroAddress],
    query: {
      refetchInterval: 15 * 1000,
    },
  });

  // If only high tier can use instant withdrawals and user isn't high tier
  if (onlyHighTier && isHighTier === false) {
    return false;
  }

  if (
    usableUnderlyings === undefined ||
    totalQueued === undefined ||
    isHighTier === undefined
  )
    return undefined;

  // Check liquidity conditions
  const hasLiquidityForQueue = totalQueued + amount <= usableUnderlyings;
  const hasLiquidityForInstant = amount <= usableUnderlyings;

  // Withdrawal is allowed if:
  // - Either: Contract has enough liquidity for all queued withdrawals + this one
  // - Or: User is high tier AND contract has enough liquidity for this withdrawal alone
  return hasLiquidityForQueue || (isHighTier && hasLiquidityForInstant);
}
