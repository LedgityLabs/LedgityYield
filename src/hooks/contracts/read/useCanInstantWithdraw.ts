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
 *
 * returns FALSE if cannot instant withdraw
 * returns UNDEFINED if data is not loaded yet
 */
export function useCanInstantWithdraw(
  lTokenAddress: Address | undefined,
  account: Address | undefined,
  amount: bigint,
): boolean | undefined {
  const { appChainId } = useWeb3Context();

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

  // If any data is missing, return undefined
  if (
    !lTokenAddress ||
    usableUnderlyings === undefined ||
    totalQueued === undefined ||
    isHighTier === undefined
  )
    return undefined;

  // If only high tier can use instant withdrawals and user isn't high tier
  if (onlyHighTier && isHighTier === false) {
    return false;
  }

  // Check liquidity conditions
  const hasLiquidityForQueue = totalQueued + amount <= usableUnderlyings;
  const hasLiquidityForInstant = amount <= usableUnderlyings;

  // Withdrawal is allowed if:
  // - Either: Contract has enough liquidity for all queued withdrawals + this one
  // - Or: User is high tier AND contract has enough liquidity for this withdrawal alone
  return hasLiquidityForQueue || (isHighTier && hasLiquidityForInstant);
}
