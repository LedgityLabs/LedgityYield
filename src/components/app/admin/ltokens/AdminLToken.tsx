import { FC } from "react";
import { AdminLTokenAPR } from "./AdminLTokenAPR";
import { AdminLTokenRetentionRate } from "./AdminLTokenRetentionRate";
import { AdminMasonry } from "../AdminMasonry";
import { AdminLTokenClaimFees } from "./AdminLTokenClaimFees";
import { AdminLTokenProcessBigQueued } from "./AdminLTokenProcessBigQueued";
import { AdminLTokenRepatriate } from "./AdminLTokenRepatriate";
import { AdminLTokenAddresses } from "./AdminLTokenAddresses";
import { AdminLTokenSignal } from "./AdminLTokenSignal";
import { AdminLTokenProcessRequests } from "./AdminLTokenProcessRequests";

interface Props {
  lTokenSymbol: string;
}

export const AdminLToken: FC<Props> = ({ lTokenSymbol }) => {
  return (
    <AdminMasonry>
      <AdminLTokenAPR lTokenSymbol={lTokenSymbol} />
      <AdminLTokenRetentionRate lTokenSymbol={lTokenSymbol} />
      <AdminLTokenClaimFees lTokenSymbol={lTokenSymbol} />
      <AdminLTokenProcessRequests lTokenSymbol={lTokenSymbol} />
      <AdminLTokenProcessBigQueued lTokenSymbol={lTokenSymbol} />
      <AdminLTokenRepatriate lTokenSymbol={lTokenSymbol} />
      <AdminLTokenAddresses lTokenSymbol={lTokenSymbol} />
      <AdminLTokenSignal lTokenSymbol={lTokenSymbol} />
    </AdminMasonry>
  );
};
