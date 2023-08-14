import { FC } from "react";
import { AdminStakingTiers } from "./AdminStakingTiers";
import { AdminStakingAPR } from "./AdminStakingAPR";
import { AdminStakingLDYInfos } from "./AdminStakingLDYInfos";
import { useContractAddress } from "@/hooks/useContractAddress";
import { AdminStakingUnlockFeesRate } from "./AdminStakingUnlockFees";
import { AdminMasonry } from "../AdminMasonry";
import { AdminStakingLockDuration } from "./AdminStakingLockDuration";

export const AdminStaking: FC = () => {
  const ldyAddress = useContractAddress("LDY");
  const ldyStakingAddress = useContractAddress("LDYStaking");
  if (!ldyAddress) return <p>Oops, LDY token not available on this network.</p>;
  if (!ldyStakingAddress) return <p>Oops, LDYStaking contract not available on this network.</p>;

  return (
    <AdminMasonry>
      <AdminStakingLDYInfos />
      <AdminStakingAPR />
      <AdminStakingUnlockFeesRate />
      <AdminStakingLockDuration />
      <AdminStakingTiers />
    </AdminMasonry>
  );
};
