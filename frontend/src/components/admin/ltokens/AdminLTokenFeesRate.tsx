import { Card, Rate, TxButton } from "@/components/ui";
import { RateInput } from "@/components/ui/RateInput";
import { useReadLTokenFeesRateUd7x3, useSimulateLTokenSetFeesRate } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useEffect, useCallback, useState } from "react";
import { parseUnits } from "viem";
import { AdminBrick } from "../AdminBrick";
import { useQueryClient } from "@tanstack/react-query";
import { UseSimulateContractReturnType, useBlockNumber } from "wagmi";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenFeesRate: FC<Props> = ({ className, lTokenSymbol }) => {
  const underlyingTokenName = lTokenSymbol.slice(1);
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const { data: feesRate, queryKey } = useReadLTokenFeesRateUd7x3({
    address: lTokenAddress,
  });
  const [newFeesRate, setNewFeesRate] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const simulationResult = useSimulateLTokenSetFeesRate({
    address: lTokenAddress,
    args: [newFeesRate],
    query: {
      enabled: Boolean(lTokenAddress && newFeesRate >= 0),
    },
  });

  // Use double type assertion to avoid type checking
  const preparation = simulationResult as unknown as UseSimulateContractReturnType;

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
    setNewFeesRate(Number(parseUnits(value || "0", 3)));
    setHasUserInteracted(value !== "");
  };

  if (!lTokenAddress) return null;

  return (
    <AdminBrick title="Fees rate">
      <p>
        This rate corresponds to the % of fees charged to eligible {underlyingTokenName} withdrawal
        requests.
      </p>
      <p>
        Current value: <Rate value={feesRate} className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3">
        <RateInput
          onChange={handleRateChange}
          placeholder="Enter new rate"
        />
        <TxButton
          preparation={preparation}
          hasUserInteracted={hasUserInteracted}
          size="medium"
          disabled={newFeesRate < 0}
        >
          Set
        </TxButton>
      </div>
    </AdminBrick>
  );
};