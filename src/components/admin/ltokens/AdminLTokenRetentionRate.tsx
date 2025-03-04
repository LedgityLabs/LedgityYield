// Components
import { AdminBrick } from "@/components/admin/AdminBrick";
import { SetRetentionRateTx } from "@/components/contracts";
import { Rate, RateInput } from "@/components/ui";
// Hooks
import { useLTokenRetentionRateUd7x3 } from "@/hooks/contracts";
import { useState } from "react";
// Functions
import { parseUnits } from "viem";
// Types
import { LTokenInfo, TokenInfo } from "@/types";

export function AdminLTokenRetentionRate({
  tokenData,
  underlyingTokenData,
}: {
  tokenData: LTokenInfo;
  underlyingTokenData: TokenInfo;
}) {
  const retentionRate = useLTokenRetentionRateUd7x3(tokenData.address);
  const [newRetentionRate, setNewRetentionRate] = useState(0);

  function handleSetNewRetentionRate(e: React.ChangeEvent<HTMLInputElement>) {
    setNewRetentionRate(Number(parseUnits(e.target.value, 3)));
  }

  return (
    <AdminBrick title="Retention rate">
      <p>
        This rate corresponds to the target and maximal amount of{" "}
        {underlyingTokenData.symbol} to retain on the contract.
      </p>
      <p>
        Current value: <Rate value={retentionRate} className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3">
        <RateInput onChange={handleSetNewRetentionRate} />
        <SetRetentionRateTx
          contractAddress={tokenData.address}
          buttonText="Set Retention Rate"
          params={{ newRate: newRetentionRate }}
        />
      </div>
    </AdminBrick>
  );
}
