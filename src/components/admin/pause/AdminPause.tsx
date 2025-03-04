// Components
import { AdminBrick } from "../AdminBrick";
import { AdminMasonry } from "../AdminMasonry";
import { PauseTx, UnpauseTx } from "@/components/contracts";
// Hooks
import { useGlobalPausePaused } from "@/hooks/contracts";

export function AdminPause() {
  const isPaused = useGlobalPausePaused();

  return (
    <AdminMasonry className="!columns-1 w-[400px]">
      <AdminBrick title="Global pause">
        <p>
          Calling pause will temporarily prevent any non-admin activity on all
          contracts of the Ledgity DeFi ecosystem. Note that this doesn't
          includes the LDY token contract, which is non-pausable.
        </p>
        <div className="flex gap-6 justify-center items-center">
          <PauseTx buttonText="Pause" disabled={isPaused} />
          <UnpauseTx buttonText="Unpause" disabled={!isPaused} />
        </div>
      </AdminBrick>
    </AdminMasonry>
  );
}
