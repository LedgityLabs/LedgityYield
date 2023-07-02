import { FC } from "react";
import { LTokenId } from "../../../../../hardhat/deployments";
import { AdminLTokenAPR } from "./AdminLTokenAPR";

interface Props {
  lTokenId: LTokenId;
}

export const AdminLToken: FC<Props> = ({ lTokenId }) => {
  return (
    <section className="grid grid-cols-[repeat(3,1fr)] grid-flow-row w-[1200px] gap-10 pb-10">
      <AdminLTokenAPR lTokenId={lTokenId} />
      {/* Rentention rate */}
      {/* Claim fees */}
      {/* Set fund address */}
      {/* Set withdrawer address */}
      {/* Set staking address */}
      {/* Process big queued */}
      {/* Fund contract */}
    </section>
  );
};
