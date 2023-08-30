"use client";
import { type FC, useEffect, type ReactNode } from "react";
import { usePrepareContractWrite, useWalletClient } from "wagmi";
import {
  useGenericErc20Allowance,
  useGenericErc20BalanceOf,
  useGenericErc20Decimals,
  useGenericErc20Symbol,
  usePrepareGenericErc20Approve,
} from "@/generated";
import { zeroAddress } from "viem";
import { TxButton } from "./TxButton";
import { Amount } from "./Amount";
import { twMerge } from "tailwind-merge";

interface Props extends React.ComponentPropsWithoutRef<typeof TxButton> {
  token: `0x${string}`;
  spender: `0x${string}`;
  amount?: bigint;
  preparation: ReturnType<typeof usePrepareContractWrite>;
  transactionSummary?: string | ReactNode;
  // This prevents displaying errors when user hasn't interacted with the button or input yet
  hasUserInteracted?: boolean;

  // Allow parent to force error state
  parentIsError?: boolean;
  parentError?: string;
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
  disabled,
  className,
  ...props
}) => {
  const { data: walletClient } = useWalletClient();
  const { data: symbol } = useGenericErc20Symbol({ address: token });
  const { data: decimals } = useGenericErc20Decimals({ address: token });
  const { data: allowance } = useGenericErc20Allowance({
    address: token,
    args: [walletClient?.account.address || zeroAddress, spender],
    watch: true,
  });
  const { data: balance } = useGenericErc20BalanceOf({
    address: token,
    args: [walletClient?.account.address || zeroAddress],
    watch: true,
  });
  const allowancePreparation = usePrepareGenericErc20Approve({
    address: token,
    args: [spender, amount],
  });
  useEffect(() => {
    preparation.refetch();
  }, [allowance]);

  const hasEnoughAllowance = Boolean(allowance && allowance >= amount);

  // Check if the user has enough balance, and raise error else
  let isError = false;
  let errorMessage: string = "";
  if (balance && balance < amount) {
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
        disabled={amount === 0n || disabled}
        transactionSummary={transactionSummary}
        parentIsError={isError}
        parentError={errorMessage}
        {...props}
      />
      <TxButton
        className={twMerge(hasEnoughAllowance && "pointer-events-none hidden", className)}
        hideTooltips={hasEnoughAllowance}
        preparation={allowancePreparation}
        disabled={amount === 0n}
        hasUserInteracted={hasUserInteracted}
        parentIsError={parentIsError || isError}
        parentError={parentIsError ? parentError : errorMessage}
        transactionSummary={
          <span>
            Allow Ledgity Yield to spend{" "}
            <Amount
              value={amount}
              decimals={decimals}
              suffix={symbol}
              displaySymbol={true}
              className="text-indigo-300 underline decoration-indigo-300 decoration-2 underline-offset-4"
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
