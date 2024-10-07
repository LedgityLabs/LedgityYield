import { FC, useEffect } from "react";
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
  const pausePreparation = useSimulateGlobalPausePause() as UseSimulateContractReturnType;
  const unpausePreparation = useSimulateGlobalPauseUnpause() as UseSimulateContractReturnType;
  useEffect(() => {
    pausePreparation.refetch();
    unpausePreparation.refetch();
  }, [paused, pausePreparation, unpausePreparation]);

  // Refresh some data every 5 blocks
  const queryKeys = [queryKey];
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const queryClient = useQueryClient();
  useEffect(() => {
    if (blockNumber && blockNumber % 5n === 0n)
      queryKeys.forEach((k) => queryClient.invalidateQueries({ queryKey: k }));
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
            preparation={pausePreparation}
            disabled={paused}
            size="medium"
          >
            Pause
          </TxButton>
          <TxButton
            preparation={unpausePreparation}
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