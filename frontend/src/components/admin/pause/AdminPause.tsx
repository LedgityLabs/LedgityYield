import { FC, useEffect, useMemo } from "react";
import { AdminMasonry } from "../AdminMasonry";
import { AdminBrick } from "../AdminBrick";
import {
  useReadGlobalPausePaused,
  useSimulateGlobalPausePause,
  useSimulateGlobalPauseUnpause,
} from "@/generated";
import { TxButton } from "@/components/ui";
import { UseSimulateContractReturnType, useBlockNumber } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

export const AdminPause: FC = () => {
  const { data: paused, queryKey } = useReadGlobalPausePaused({});
  const pausePreparation = useSimulateGlobalPausePause();
  const unpausePreparation = useSimulateGlobalPauseUnpause();

  // Handle refetch when pause state changes
  useEffect(() => {
    if (pausePreparation && unpausePreparation) {
      pausePreparation.refetch();
      unpausePreparation.refetch();
    }
  }, [paused, pausePreparation, unpausePreparation]);

  // Memoize queryKeys array
  const queryKeys = useMemo(() => [queryKey], [queryKey]);

  const { data: blockNumber } = useBlockNumber({ watch: true });
  const queryClient = useQueryClient();

  // Handle block-based data refresh
  useEffect(() => {
    if (blockNumber && blockNumber % 5n === 0n && queryClient) {
      queryKeys.forEach((k) => {
        if (k) queryClient.invalidateQueries({ queryKey: k });
      });
    }
  }, [blockNumber, queryClient, queryKeys]);

  return (
    <AdminMasonry className="!columns-1 w-[400px]">
      <AdminBrick title="Global pause">
        <p>
          Calling pause will temporarily prevent any non-admin activity on all contracts of the
          Ledgity DeFi ecosystem. Note that this doesn&apos;t includes the LDY token contract, which
          is non-pausable.
        </p>
        <div className="flex gap-6 justify-center items-center">
          <TxButton
            preparation={pausePreparation as UseSimulateContractReturnType}
            disabled={paused}
            size="medium"
          >
            Pause
          </TxButton>
          <TxButton
            preparation={unpausePreparation as UseSimulateContractReturnType}
            disabled={!paused}
            size="medium"
          >
            Unpause
          </TxButton>
        </div>
      </AdminBrick>
    </AdminMasonry>
  );
};