// Components
import { Rate, RateInput } from "@/components/ui";
import { AdminBrick } from "../AdminBrick";
import { SetAprTx } from "@/components/contracts";
// Hooks
import { useLTokenGetApr } from "@/hooks/contracts";
import { useState } from "react";
// Functions
import { parseUnits } from "viem";
// Types
import { LTokenInfo } from "@/types";

export function AdminLTokenAPR({ tokenData }: { tokenData: LTokenInfo }) {
  const apr = useLTokenGetApr(tokenData.address);
  const [newApr, setNewApr] = useState(0);

  function handleSetApr(e: React.ChangeEvent<HTMLInputElement>) {
    setNewApr(Number(parseUnits(e.target.value, 3)));
  }

  return (
    <AdminBrick title="APR">
      <p>
        Current value: <Rate value={apr} className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3">
        <RateInput onChange={handleSetApr} />
        <SetAprTx
          contractAddress={tokenData.address}
          buttonText="Set APR"
          params={{ newRate: newApr }}
        />
      </div>
    </AdminBrick>
  );
}
