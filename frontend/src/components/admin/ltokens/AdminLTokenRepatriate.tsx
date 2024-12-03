import { AllowanceTxButton, Amount, AmountInput, Card, Input, TxButton } from "@/components/ui";
import {
  useReadLTokenDecimals,
  useReadLTokenUnderlying,
  useSimulateLTokenRepatriate,
} from "@/generated";
import { ChangeEvent, FC, useEffect, useState, useCallback } from "react";
import { AdminBrick } from "../AdminBrick";
import { useContractAddress } from "@/hooks/useContractAddress";
import { erc20Abi, parseUnits, zeroAddress } from "viem";
import { UseSimulateContractReturnType, useAccount, useBlockNumber, useReadContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenRepatriate: FC<Props> = ({ lTokenSymbol }) => {
  const account = useAccount();
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const { data: lTokenDecimals } = useReadLTokenDecimals({
    address: lTokenAddress,
  });

  const { data: underlyingAddress } = useReadLTokenUnderlying({ address: lTokenAddress! });
  const { data: underlyingBalance, queryKey } = useReadContract({
    abi: erc20Abi,
    functionName: "balanceOf",
    address: underlyingAddress,
    args: [account.address || zeroAddress],
  });
  const { data: underlyingSymbol } = useReadContract({
    abi: erc20Abi,
    functionName: "symbol",
    address: underlyingAddress,
  });
  
  const [repatriatedAmount, setRepatriatedAmount] = useState(0n);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Get simulation result
  const simulationResult = useSimulateLTokenRepatriate({
    address: lTokenAddress,
    args: [repatriatedAmount],
    query: {
      enabled: Boolean(lTokenAddress && repatriatedAmount > 0n),
    },
  });

  // Create properly typed preparation object
  const preparation = {
    ...simulationResult,
    data: simulationResult.data
      ? {
          ...simulationResult.data,
          request: {
            ...simulationResult.data.request,
            __mode: "prepared" as const,
          },
        }
      : undefined,
  } as unknown as UseSimulateContractReturnType;

  // Handle data refresh
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const handleRefreshData = useCallback(() => {
    if (queryKey) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [queryClient, queryKey]);

  useEffect(() => {
    if (blockNumber && blockNumber % 5n === 0n) {
      handleRefreshData();
    }
  }, [blockNumber, handleRefreshData]);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRepatriatedAmount(value ? parseUnits(value, lTokenDecimals!) : 0n);
    setHasUserInteracted(value !== "");
  };

  if (!lTokenAddress || !lTokenDecimals) return null;

  return (
    <AdminBrick title="Repatriate funds">
      <p>
        This utility can only be called by the fund wallet and will safely transfer a given amount
        of {lTokenSymbol.slice(1)} from fund to {lTokenSymbol} contract.
      </p>
      <div className="flex justify-center items-end gap-3">
        <AmountInput
          maxValue={underlyingBalance}
          decimals={lTokenDecimals}
          symbol={underlyingSymbol}
          onChange={handleAmountChange}
        />
        <AllowanceTxButton
          size="medium"
          preparation={preparation}
          token={underlyingAddress!}
          spender={lTokenAddress}
          amount={repatriatedAmount}
          disabled={repatriatedAmount === 0n || !underlyingAddress}
          hasUserInteracted={hasUserInteracted}
          transactionSummary={
            <span>
              Repatriate{" "}
              <Amount
                value={repatriatedAmount}
                decimals={lTokenDecimals}
                suffix={underlyingSymbol}
                displaySymbol={true}
                className="text-indigo-300 underline underline-offset-4 decoration-indigo-300 decoration-2 whitespace-nowrap"
              />
            </span>
          }
        >
          Repatriate
        </AllowanceTxButton>
      </div>
    </AdminBrick>
  );
};