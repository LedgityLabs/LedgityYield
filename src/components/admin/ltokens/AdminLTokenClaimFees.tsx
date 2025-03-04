// Components
import { AdminBrick } from "@/components/admin/AdminBrick";
import { ClaimFeesTx } from "@/components/contracts";
import { Amount } from "@/components/ui";
// Hooks
import { useLTokenUnclaimedFees } from "@/hooks/contracts";
// Types
import { LTokenInfo } from "@/types";

export function AdminLTokenClaimFees({ tokenData }: { tokenData: LTokenInfo }) {
  const unclaimedFees = useLTokenUnclaimedFees(tokenData.address);

  return (
    <AdminBrick title="Unclaimed fees">
      <p>
        Current amount:{" "}
        <Amount
          value={unclaimedFees}
          suffix={tokenData.symbol}
          decimals={tokenData.decimals}
          className="font-bold"
        />
      </p>
      <div className="flex justify-center items-end gap-3">
        <ClaimFeesTx
          buttonText="Claim Fees"
          contractAddress={tokenData.address}
          disabled={!unclaimedFees}
        />
      </div>
    </AdminBrick>
  );
}
