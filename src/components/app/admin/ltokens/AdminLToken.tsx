import { FC } from "react";
import { LTokenId } from "../../../../../hardhat/deployments";
import { AdminLTokenAPR } from "./AdminLTokenAPR";
import { AdminLTokenRetentionRate } from "./AdminLTokenRetentionRate";
import { AdminMasonry } from "../AdminMasonry";

interface Props {
  lTokenId: LTokenId;
}

export const AdminLToken: FC<Props> = ({ lTokenId }) => {
  return (
    <AdminMasonry>
      <AdminLTokenAPR lTokenId={lTokenId} />
      <AdminLTokenRetentionRate lTokenId={lTokenId} />
      {/* Rentention rate */}
      {/* Claim fees */}
      {/* Set fund address */}
      {/* Set withdrawer address */}
      {/* Set staking address */}
      {/* Process big queued */}
      {/* Fund contract */}
    </AdminMasonry>
  );
};
