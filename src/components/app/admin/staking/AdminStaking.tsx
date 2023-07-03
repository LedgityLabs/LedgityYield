import { FC } from "react";
import { AdminStakingTiers } from "./AdminStakingTiers";
import { AdminStakingAPR } from "./AdminStakingAPR";
import { AdminStakingLTYInfos } from "./AdminStakingLTYInfos";
import { useContractAddress } from "@/hooks/useContractAddress";
import { AdminStakingUnlockFeesRate } from "./AdminStakingUnlockFees";
import { AdminMasonry } from "../AdminMasonry";

export const AdminStaking: FC = () => {
  const ltyAddress = useContractAddress("LTY");
  const ltyStakingAddress = useContractAddress("LTYStaking");
  if (!ltyAddress) return <p>Oops, LTY token not available on this network.</p>;
  if (!ltyStakingAddress) return <p>Oops, LTYStaking contract not available on this network.</p>;

  return (
    <AdminMasonry>
      <AdminStakingLTYInfos />
      <AdminStakingAPR />
      <AdminStakingUnlockFeesRate />
      <AdminStakingTiers />
    </AdminMasonry>
  );
};
