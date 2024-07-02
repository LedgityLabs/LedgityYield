import { FC } from "react";
import { AdminLTokenAPR } from "./AdminLTokenAPR";
import { AdminLTokenRetentionRate } from "./AdminLTokenRetentionRate";
import { AdminMasonry } from "../AdminMasonry";
import { AdminLTokenClaimFees } from "./AdminLTokenClaimFees";
import { AdminLTokenRepatriate } from "./AdminLTokenRepatriate";
import { AdminLTokenAddresses } from "./AdminLTokenAddresses";
import { AdminLTokenSignal } from "./AdminLTokenSignal";
import { AdminLTokenWithdrawalRequests } from "./AdminLTokenWithdrawalRequests";
import { AdminLTokenFeesRate } from "./AdminLTokenFeesRate";
import { AdminLTokenSetWithdrawalFeeInEth } from "./AdminLTokenSetWithdrawalFeeInEth";

interface Props {
  lTokenSymbol: string;
}

export const AdminLToken: FC<Props> = ({ lTokenSymbol }) => {
  return (
    <AdminMasonry>
      <AdminLTokenWithdrawalRequests lTokenSymbol={lTokenSymbol} />
      <AdminLTokenAddresses lTokenSymbol={lTokenSymbol} />
      <AdminLTokenAPR lTokenSymbol={lTokenSymbol} />
      <AdminLTokenRepatriate lTokenSymbol={lTokenSymbol} />
      <AdminLTokenRetentionRate lTokenSymbol={lTokenSymbol} />
      <AdminLTokenFeesRate lTokenSymbol={lTokenSymbol} />
      <AdminLTokenClaimFees lTokenSymbol={lTokenSymbol} />
      <AdminLTokenSignal lTokenSymbol={lTokenSymbol} />
      <AdminLTokenSetWithdrawalFeeInEth lTokenSymbol={lTokenSymbol} />
    </AdminMasonry>
  );
};
