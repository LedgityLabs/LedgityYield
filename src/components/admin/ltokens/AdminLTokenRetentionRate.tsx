import { Card, Rate, TxButton } from "@/components/ui";
import { RateInput } from "@/components/ui/RateInput";
import { useReadLTokenRetentionRateUd7x3, useSimulateLTokenSetRetentionRate } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useEffect, useCallback, useState } from "react";
import { parseUnits } from "viem";
import { AdminBrick } from "../AdminBrick";
import { UseSimulateContractReturnType, useBlockNumber } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenRetentionRate: FC<Props> = ({ className, lTokenSymbol }) => {
  const underlyingTokenName = lTokenSymbol.slice(1);
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const { data: retentionRate, queryKey } = useReadLTokenRetentionRateUd7x3({
    address: lTokenAddress,
  });
  const [newRetentionRate, setNewRetentionRate] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Get simulation result with proper options
  const simulationResult = useSimulateLTokenSetRetentionRate({
    address: lTokenAddress,
    args: [newRetentionRate],
    query: {
      enabled: Boolean(lTokenAddress && newRetentionRate >= 0),
    },
  });

  // Convert simulation result to expected type
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

  const handleRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewRetentionRate(value ? Number(parseUnits(value, 3)) : 0);
    setHasUserInteracted(value !== "");
  };

  if (!lTokenAddress) return null;

  return (
    <AdminBrick title="Retention rate">
      <p>
        This rate corresponds to the target and maximal amount of {underlyingTokenName} to retain on
        the contract.
      </p>
      <p>
        Current value: <Rate value={retentionRate} className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3">
        <RateInput
          onChange={handleRateChange}
          placeholder="Enter retention rate"
        />
        <TxButton
          preparation={preparation}
          hasUserInteracted={hasUserInteracted}
          size="medium"
          disabled={newRetentionRate < 0}
        >
          Set
        </TxButton>
      </div>
    </AdminBrick>
  );
};