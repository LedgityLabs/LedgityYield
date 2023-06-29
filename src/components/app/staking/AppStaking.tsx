"use client";

import { FC } from "react";
import { AppStakingTotalStaked } from "./AppStakingTotalStaked";
import { AppStakingExplanations } from "./AppStakingExplanations";
import { useContractAddress } from "@/hooks/useContractAddress";
import { AppStakingAPR } from "./AppStakingAPR";
import { AppStakingYourStake } from "./AppStakingYourStake";
import { AppStakingTier } from "./AppStakingTier";
import { AppStakingClaim } from "./AppStakingClaim";
import { AppStakingStake } from "./AppStakingStake";

export const AppStaking: FC = () => {
  const ltyAddress = useContractAddress("LTY");
  const ltyStakingAddress = useContractAddress("LTYStaking");
  if (!ltyAddress) return <p>Oops, it seems that LTY token is currently not available on this chain.</p>;
  if (!ltyStakingAddress)
    return <p>Oops, it seems that LTY token staking is currently not available on this chain.</p>;
  return (
    <section className="grid grid-cols-[repeat(5,1fr)] grid-rows-[repeat(8,1fr)] w-[1200px] h-[900px] gap-10 mb-10">
      <AppStakingTotalStaked className="col-span-2 row-span-2" />
      <AppStakingAPR className="col-start-3 row-span-2" />
      <AppStakingYourStake className="col-start-4 row-span-2" />
      <AppStakingTier className="col-start-5 row-span-2" />
      <AppStakingExplanations className="row-start-3 row-span-6 col-span-3" />
      <AppStakingClaim className="col-span-2 row-span-2" />
      <AppStakingStake className="col-span-2 row-span-4" />
      {/* <AppStakingStake className="col-span-2 row-span-2" /> */}
    </section>
  );
};
