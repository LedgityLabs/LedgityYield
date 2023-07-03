import { FC } from "react";
import { LTokenId } from "../../../../../hardhat/deployments";
import { AdminLTokenAPR } from "./AdminLTokenAPR";
import { AdminLTokenRetentionRate } from "./AdminLTokenRetentionRate";
import { AdminMasonry } from "../AdminMasonry";
import { AdminLTokenClaimFees } from "./AdminLTokenClaimFees";
import { AdminLTokenProcessBigQueued } from "./AdminLTokenProcessBigQueued";
import { AdminLTokenFundContract } from "./AdminLTokenFundContract";
import { AdminLTokenAddresses } from "./AdminLTokenAddresses";

interface Props {
  lTokenId: LTokenId;
}

export const AdminLToken: FC<Props> = ({ lTokenId }) => {
  return (
    <AdminMasonry>
      <AdminLTokenAPR lTokenId={lTokenId} />
      <AdminLTokenRetentionRate lTokenId={lTokenId} />
      <AdminLTokenClaimFees lTokenId={lTokenId} />
      <AdminLTokenProcessBigQueued lTokenId={lTokenId} />
      <AdminLTokenFundContract lTokenId={lTokenId} />
      <AdminLTokenAddresses lTokenId={lTokenId} />
    </AdminMasonry>
  );
};
