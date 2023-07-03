import { FC } from "react";
import { AdminStakingTiers } from "./AdminStakingTiers";
import { AdminStakingAPR } from "./AdminStakingAPR";
import { AdminStakingLTYInfos } from "./AdminStakingLTYInfos";
import { useContractAddress } from "@/hooks/useContractAddress";

export const AdminStaking: FC = () => {
  const ltyAddress = useContractAddress("LTY");
  const ltyStakingAddress = useContractAddress("LTYStaking");
  if (!ltyAddress) return <p>Oops, LTY token not available on this network.</p>;
  if (!ltyStakingAddress) return <p>Oops, LTYStaking contract not available on this network.</p>;

  return (
    <section className="grid grid-cols-[repeat(3,1fr)] grid-flow-row w-[1200px] gap-10 pb-10">
      <AdminStakingTiers />
      <AdminStakingAPR />
      <AdminStakingLTYInfos />
    </section>
  );
};
