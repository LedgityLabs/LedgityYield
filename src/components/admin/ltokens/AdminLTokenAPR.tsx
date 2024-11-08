import { Card, Rate, TxButton } from "@/components/ui";
import { RateInput } from "@/components/ui/RateInput";
import { useReadLTokenGetApr, useSimulateLTokenSetApr } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useEffect, useState, useCallback } from "react";
import { parseUnits } from "viem";
import { AdminBrick } from "../AdminBrick";
import { UseSimulateContractReturnType, useBlockNumber } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenAPR: FC<Props> = ({ className, lTokenSymbol }) => {
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const { data: apr, queryKey } = useReadLTokenGetApr({
    address: lTokenAddress,
  });
  const [newApr, setNewApr] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Create the simulation with proper typing
  const simulation = useSimulateLTokenSetApr({
    address: lTokenAddress,
    args: [newApr],
    query: {
      enabled: Boolean(lTokenAddress && newApr >= 0),
    },
  });

  // Cast the simulation to the expected type
  const preparation = simulation as unknown as UseSimulateContractReturnType;

  // Refresh data every 5 blocks
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
    setNewApr(Number(parseUnits(value || "0", 3)));
    setHasUserInteracted(value !== "");
  };

  if (!lTokenAddress) return null;

  return (
    <AdminBrick title="APR">
      <p>
        Current value: <Rate value={apr} className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3">
        <RateInput
          onChange={handleRateChange}
          placeholder="Enter new APR"
        />
        <TxButton
          preparation={preparation}
          hasUserInteracted={hasUserInteracted}
          size="medium"
          disabled={newApr < 0}
        >
          Set
        </TxButton>
      </div>
    </AdminBrick>
  );
};