import { FC } from "react";
import { LTokenId } from "../../../../../hardhat/deployments";
import { AdminLTokenAPR } from "./AdminLTokenAPR";
import { AdminLTokenRetentionRate } from "./AdminLTokenRetentionRate";
import { AdminMasonry } from "../AdminMasonry";
import { AdminLTokenClaimFees } from "./AdminLTokenClaimFees";

interface Props {
  lTokenId: LTokenId;
}

export const AdminLToken: FC<Props> = ({ lTokenId }) => {
  return (
    <AdminMasonry>
      <AdminLTokenAPR lTokenId={lTokenId} />
      <AdminLTokenRetentionRate lTokenId={lTokenId} />
      <AdminLTokenClaimFees lTokenId={lTokenId} />
      {/* Claim fees */}
      {/* Set staking address */}
      {/* Process big queued */}
      {/* Fund contract */}
      {/* Set fund address */}
      {/* Set withdrawer address */}
    </AdminMasonry>
  );
};
