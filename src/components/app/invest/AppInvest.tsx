"use client";
import React, { FC } from "react";
import { AppInvestTVL } from "./AppInvestTVL";
import { AppInvestDistributedRewards } from "./AppInvestDistributedRewards";
import { AppInvestVariation } from "./AppInvestVariation";
import { AppInvestTokens } from "./AppInvestTokens";

export const AppInvest: FC = () => {
  console.log("APP INVEST RENDER");
  return (
    <div className="flex flex-col justify-center items-center w-[900px] ">
      <section className="grid grid-cols-3 w-full gap-10 mb-10">
        <AppInvestTVL />
        <AppInvestDistributedRewards />
        <AppInvestVariation />
        <AppInvestTokens className="col-span-3" />
      </section>
    </div>
  );
};
