"use client";
import React, { FC } from "react";
import { AppInvestTVL } from "./AppInvestTVL";
import { AppInvestDistributedRewards } from "./AppInvestDistributedRewards";
import { AppInvestVariation } from "./AppInvestVariation";
import { AppInvestTokens } from "./AppInvestTokens";
import { usePublicClient } from "wagmi";
import { AppInvestAirdrop } from "./AppInvestAirdrop";

export const AppInvest: FC = () => {
  const publicClient = usePublicClient();
  const isLinea = publicClient && [59144, 59140].includes(publicClient.chain.id);

  return (
    <div className="flex w-[900px] flex-col items-center justify-center ">
      <section className="mb-10 grid w-full grid-cols-3 gap-10">
        <AppInvestTVL />
        <AppInvestDistributedRewards />
        <AppInvestVariation />
        <AppInvestTokens className="col-span-3" />
        {isLinea && <AppInvestAirdrop className="col-span-3" />}
      </section>
    </div>
  );
};
