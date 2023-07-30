import { FC, useEffect } from "react";
import { AdminMasonry } from "../AdminMasonry";
import { AdminBrick } from "../AdminBrick";
import {
  useGlobalPausePaused,
  usePrepareGlobalPausePause,
  usePrepareGlobalPauseUnpause,
} from "@/generated";
import { TxButton } from "@/components/ui";

export const AdminPause: FC = () => {
  const { data: paused } = useGlobalPausePaused({
    watch: true,
  });
  const pausePreparation = usePrepareGlobalPausePause();
  const unpausePreparation = usePrepareGlobalPauseUnpause();
  useEffect(() => {
    pausePreparation.refetch();
    unpausePreparation.refetch();
  }, [paused]);

  return (
    <AdminMasonry className="!columns-1 w-[400px]">
      <AdminBrick title="Global pause">
        <p>
          Calling pause will temporarily prevent any non-admin activity on all contracts of the Ledgity
          DeFi ecosystem. Note that this doesn&apos;t includes the LDY token contract, which is
          non-pausable.
        </p>
        <div className="flex gap-6 justify-center items-center">
          <TxButton preparation={pausePreparation} disabled={paused} size="medium">
            Pause
          </TxButton>
          <TxButton preparation={unpausePreparation} disabled={!paused} size="medium">
            Unpause
          </TxButton>
        </div>
      </AdminBrick>
    </AdminMasonry>
  );
};
