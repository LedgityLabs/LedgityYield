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

type AnySimulateContractReturnType = UseSimulateContractReturnType<any, any, any, any, any, any>;

interface Props extends React.ComponentPropsWithoutRef<typeof TxButton> {
  token: `0x${string}`;
  spender: `0x${string}`;
  amount?: bigint;
  preparation: AnySimulateContractReturnType;
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
  const { address } = useAccount();
  const [hasEnoughAllowance, setHasEnoughAllowance] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Token info
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

  // Balance and allowance
  const { data: allowance, queryKey: allowanceQueryKey } = useReadContract({
    abi: erc20Abi,
    functionName: "allowance",
    address: token,
    args: [address || zeroAddress, spender],
  });

  const { data: balance, queryKey: balanceQueryKey } = useReadContract({
    abi: erc20Abi,
    functionName: "balanceOf",
    address: token,
    args: [address || zeroAddress],
  });

  const allowanceSimulation = useSimulateContract({
    abi: erc20Abi,
    functionName: "approve",
    address: token,
    args: [spender, amount],
  }) as AnySimulateContractReturnType;

  // Check and update allowance
  useEffect(() => {
    if (amount === 0n) {
      setHasEnoughAllowance(true);
      return;
    }

    if (allowance !== undefined) {
      setHasEnoughAllowance(allowance >= amount);
      // Refetch preparation only if we need approval
      if (allowance < amount) {
        preparation.refetch?.();
      }
    }
  }, [allowance, amount, preparation]);

  // Check balance and update error state
  useEffect(() => {
    const insufficientBalance = balance !== undefined && balance < amount;
    setIsError(insufficientBalance);
    setErrorMessage(insufficientBalance ? "Insufficient balance" : "");
  }, [balance, amount]);

  return (
    <div>
      {/* Main Transaction Button */}
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

      {/* Approval Button */}
      <TxButton
        className={twMerge(hasEnoughAllowance && "pointer-events-none hidden", className)}
        hideTooltips={hasEnoughAllowance}
        preparation={allowanceSimulation}
        disabled={(amount === 0n && !allowZeroAmount) || disabled}
        hasUserInteracted={hasUserInteracted}
        parentIsError={parentIsError || isError}
        parentError={parentError || errorMessage}
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