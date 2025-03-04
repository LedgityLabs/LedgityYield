// Components
import { AdminBrick } from "@/components/admin/AdminBrick";
import { SetFeesRateTx } from "@/components/contracts";
import { Rate, RateInput } from "@/components/ui";
// Hooks
import { useLTokenFeesRateUd7x3 } from "@/hooks/contracts";
import { useState } from "react";
// Functions
import { parseUnits } from "viem";
// Types
import { LTokenInfo, TokenInfo } from "@/types";

export function AdminLTokenFeesRate({
  tokenData,
  underlyingTokenData,
}: {
  tokenData: LTokenInfo;
  underlyingTokenData: TokenInfo;
}) {
  const feeRate = useLTokenFeesRateUd7x3(tokenData.address);
  const [newFeeRate, setNewFeeRate] = useState(0);

  function handleSetFeeRate(e: React.ChangeEvent<HTMLInputElement>) {
    setNewFeeRate(Number(parseUnits(e.target.value, 3)));
  }

  return (
    <AdminBrick title="Fee rate">
      <p>
        This rate corresponds to the % of fees charged to eligible{" "}
        {underlyingTokenData.symbol} withdrawal requests.
      </p>
      <p>
        Current value: <Rate value={feeRate} className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3">
        <RateInput onChange={handleSetFeeRate} />
        <SetFeesRateTx
          buttonText="Set Fee Rate"
          contractAddress={tokenData.address}
          params={{ newRate: newFeeRate }}
        />
      </div>
    </AdminBrick>
  );
}
