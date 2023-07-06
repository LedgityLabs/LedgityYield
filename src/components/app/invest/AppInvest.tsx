"use client";
import React, { FC } from "react";
import { AppInvestTVL } from "./AppInvestTVL";
import { AppInvestDistributedRewards } from "./AppInvestDistributedRewards";
import { AppInvestVariation } from "./AppInvestVariation";
import { AppInvestTokens } from "./AppInvestTokens";

export const AppInvest: FC = () => {
  const [tvlUsd, setTvlUsd] = React.useState(0n);
  return (
    <div className="flex flex-col justify-center items-center w-[900px] ">
      <section className="grid grid-cols-3 w-full gap-10 mb-10">
        <AppInvestTVL tvlUsd={tvlUsd} />
        <AppInvestDistributedRewards />
        <AppInvestVariation />
        <AppInvestTokens className="col-span-3" setTvlUsd={setTvlUsd} />
      </section>
    </div>
  );
};
