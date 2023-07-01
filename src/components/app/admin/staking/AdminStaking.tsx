import { FC } from "react";
import { AdminStakingTiers } from "./AdminStakingTiers";
import { AdminStakingAPR } from "./AdminStakingAPR";

export const AdminStaking: FC = () => {
  return (
    <section className="grid grid-cols-[repeat(3,1fr)] grid-flow-row w-[1200px] gap-10 pb-10">
      <AdminStakingTiers />
      <AdminStakingAPR />
    </section>
  );
};
