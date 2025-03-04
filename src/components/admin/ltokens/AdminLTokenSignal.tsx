// Components
import { AdminBrick } from "../AdminBrick";
import { SignalLTokenTx } from "@/components/contracts";
// Types
import { LTokenInfo } from "@/types";

export function AdminLTokenSignal({ tokenData }: { tokenData: LTokenInfo }) {
  return (
    <AdminBrick title="Data indexing">
      <div className="flex justify-center items-center">
        <SignalLTokenTx
          buttonText="Signal LToken"
          params={{
            lTokenAddress: tokenData.address,
          }}
        />
      </div>
    </AdminBrick>
  );
}
