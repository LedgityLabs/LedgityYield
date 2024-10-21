"use client";
import { type FC, useEffect, type ReactNode, useState } from "react";
import {
  useSimulateContract,
  useReadContract,
  useAccount,
  UseSimulateContractReturnType,
} from "wagmi";
import { erc20Abi, zeroAddress } from "viem";
import { TxButton } from "./TxButton";
import { Amount } from "./Amount";
import { twMerge } from "tailwind-merge";

interface Props extends React.ComponentPropsWithoutRef<typeof TxButton> {
  token: `0x${string}`;
  spender: `0x${string}`;
  amount?: bigint;
  preparation: UseSimulateContractReturnType;
  transactionSummary?: string | ReactNode;
  hasUserInteracted?: boolean;
  parentIsError?: boolean;
  parentError?: string;
  allowZeroAmount?: boolean;
}

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
  const [hasEnoughAllowance, setHasEnoughAllowance] = useState(false);
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
    setHasEnoughAllowance(allowance !== undefined && allowance >= amount);
  }, [allowance, amount]);

  let isError = false;
  let errorMessage = "";

  useEffect(() => {
    if (!balance || balance < amount) {
      isError = true;
      errorMessage = "Insufficient balance";
    }
  }, [balance, amount]);

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
        queryKeys={[balanceQueryKey, allowanceQueryKey]}
        {...props}
      />
      <TxButton
        className={twMerge(hasEnoughAllowance && "pointer-events-none hidden", className)}
        hideTooltips={hasEnoughAllowance}
        preparation={allowancePreparation as unknown as UseSimulateContractReturnType}
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
        queryKeys={[allowanceQueryKey]}
        {...props}
      >
        Allow
      </TxButton>
    </div>
  );
};