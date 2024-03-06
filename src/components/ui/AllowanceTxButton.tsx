"use client";
import { type FC, useEffect, type ReactNode } from "react";
import {
  useSimulateContract,
  useReadContract,
  useAccount,
  useBlockNumber,
  UseSimulateContractReturnType,
} from "wagmi";
import { erc20Abi, zeroAddress } from "viem";
import { TxButton } from "./TxButton";
import { Amount } from "./Amount";
import { twMerge } from "tailwind-merge";
import { useQueryClient } from "@tanstack/react-query";

interface Props extends React.ComponentPropsWithoutRef<typeof TxButton> {
  token: `0x${string}`;
  spender: `0x${string}`;
  amount?: bigint;
  preparation: UseSimulateContractReturnType;
  transactionSummary?: string | ReactNode;
  // This prevents displaying errors when user hasn't interacted with the button or input yet
  hasUserInteracted?: boolean;

  // Allow parent to force error state
  parentIsError?: boolean;
  parentError?: string;

  // Allow 0 amount
  allowZeroAmount?: boolean;
}
/**
 * A version of the TxButton that allows to ensure and set (if needed) a given ERC20 allowance before
 * signing the transaction.
 */
export const AllowanceTxButton: FC<Props> = ({
  token,
  spender,
  amount = 0n,
  preparation,
  transactionSummary = "",
  hasUserInteracted = false,
  parentIsError = false,
  parentError = undefined,
  allowZeroAmount = false,
  disabled,
  className,
  ...props
}) => {
  const account = useAccount();
  const { data: symbol } = useReadContract({
    abi: erc20Abi,
    functionName: "symbol",
    address: token,
  });
  const { data: decimals } = useReadContract({
    abi: erc20Abi,
    functionName: "decimals",
    address: token,
  });
  const { data: allowance, queryKey: allowanceQueryKey } = useReadContract({
    abi: erc20Abi,
    functionName: "allowance",
    address: token,
    args: [account.address || zeroAddress, spender],
  });
  const { data: balance, queryKey: balanceQueryKey } = useReadContract({
    abi: erc20Abi,
    functionName: "balanceOf",
    address: token,
    args: [account.address || zeroAddress],
  });
  const allowancePreparation = useSimulateContract({
    abi: erc20Abi,
    functionName: "approve",
    address: token,
    args: [spender, amount],
  });
  useEffect(() => {
    preparation.refetch();
  }, [allowance]);

  // Refresh some data every 5 blocks
  // const queryKeys = [allowanceQueryKey, balanceQueryKey];
  // const { data: blockNumber } = useBlockNumber({ watch: true });
  // const queryClient = useQueryClient();
  // useEffect(() => {
  //   if (blockNumber && blockNumber % 5n === 0n)
  //     queryKeys.forEach((k) => queryClient.invalidateQueries({ queryKey: k }));
  // }, [blockNumber, ...queryKeys]);

  const hasEnoughAllowance = Boolean(allowance !== undefined && allowance >= amount);

  // Check if the user has enough balance, and raise error else
  let isError = false;
  let errorMessage: string = "";
  if (!balance || balance < amount) {
    isError = true;
    errorMessage = "Insufficient balance";
  }

  return (
    <div>
      <TxButton
        className={twMerge(!hasEnoughAllowance && "pointer-events-none hidden", className)}
        hideTooltips={!hasEnoughAllowance}
        hasUserInteracted={hasUserInteracted}
        preparation={preparation}
        disabled={(amount === 0n && !allowZeroAmount) || disabled}
        transactionSummary={transactionSummary}
        parentIsError={isError}
        parentError={errorMessage}
        {...props}
      />
      <TxButton
        className={twMerge(hasEnoughAllowance && "pointer-events-none hidden", className)}
        hideTooltips={hasEnoughAllowance}
        preparation={allowancePreparation as UseSimulateContractReturnType}
        disabled={(amount === 0n && !allowZeroAmount) || disabled}
        hasUserInteracted={hasUserInteracted}
        parentIsError={parentIsError || isError}
        parentError={parentIsError ? parentError : errorMessage}
        transactionSummary={
          <span>
            Allow Ledgity Yield to use{" "}
            <Amount
              value={amount}
              decimals={decimals}
              suffix={symbol}
              displaySymbol={true}
              className="text-indigo-300 underline decoration-indigo-300 decoration-2 underline-offset-4 whitespace-nowrap"
            />
          </span>
        }
        {...props}
      >
        Allow
      </TxButton>
    </div>
  );
};
