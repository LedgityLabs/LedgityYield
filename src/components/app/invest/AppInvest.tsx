"use client";
import React, { FC } from "react";
import { AppInvestTVL } from "./AppInvestTVL";
import { AppInvestDistributedRewards } from "./AppInvestDistributedRewards";
import { AppInvestVariation } from "./AppInvestVariation";
import { AppInvestTokens } from "./AppInvestTokens";
import { usePublicClient } from "wagmi";
import { AppInvestAirdrop } from "./AppInvestAirdrop";
import { Card } from "@/components/ui";
import Link from "next/link";
import Image from "next/image";
import flyingTokens from "~/assets/flying-tokens.webp";

export const AppInvest: FC = () => {
  const publicClient = usePublicClient();
  const isLinea = publicClient && [59144, 59140].includes(publicClient.chain.id);

  return (
    <div className="lg:w-[980px] w-full flex flex-col gap-8 pb-8">
      <Card defaultGradient={true} circleIntensity={0.07} className="w-full flex flex-col gap-10">
        <div className="flex gap-10 justify-between p-10 pt-8 pb-0">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg text-fg/50">TVL</h3>
            <AppInvestTVL className="text-[1.92rem] text-fg font-heading font-bold" />
          </div>
          <div className="flex gap-14">
            <div className="flex flex-col items-end gap-2">
              <h3 className="font-bold text-lg text-fg/50">Distributed yield</h3>
              <AppInvestDistributedRewards className="text-[1.92rem] text-fg/90 font-heading font-bold" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <h3 className="font-bold text-lg text-fg/50">APR variations</h3>
              <AppInvestVariation className="text-[1.92rem] text-fg/90 font-heading font-bold" />
            </div>
          </div>
        </div>
        <p className="px-10 font-medium text-lg w-[50%] text-fg/80 -mt-3">
          Invest USDC and get exposed to stable and high yield backed by RWA (Real World Assets).
          <br />
          <Link
            href="/docs"
            className="text-fg/95 font-semibold underline underline-offset-2 decoration-fg/20 hover:text-slate-900 transition-colors"
          >
            Read the documentation <i className="ri-arrow-right-line" />
          </Link>
        </p>
        <AppInvestTokens />
        <p className="text-center pb-5 -mt-5 opacity-60 font-medium text-[0.85rem]">
          By depositing you agree to our{" "}
          <Link
            href="/legal/terms-and-conditions"
            className="text-indigo-700 underline underline-offset-2 decoration-primary/40"
          >
            Terms & Conditions.
          </Link>
        </p>
      </Card>
      <Card className="before:bg-gradient-to-tr before:from-primary before:to-indigo-400 w-full p-10 py-5 flex justify-between items-center gap-3">
        <div className="flex flex-col justify-center gap-3">
          <div className="flex gap-5 items-center">
            <h3 className="font-extrabold text-3xl text-bg font-heading">Arbitrum Lockdrop</h3>
            <p className="inline-flex gap-1.5 justify-center items-center bg-indigo-700 px-2 pr-3 py-1 rounded-2xl text-sm text-bg font-semibold">
              <span className="rinline-block elative h-4 w-4 flex justify-center items-center ">
                <span className="inline-block absolute h-3 w-3 rounded-full animate-ping duration-[1500ms] bg-bg"></span>
                <span className="inline-block absolute h-3 w-3 rounded-full bg-bg"></span>
              </span>
              Ongoing
            </p>
          </div>
          <div className="text-bg font-semibold">
            Lock USDC and receive very first $LDY tokens! Limited to first 5M USDC.
          </div>
        </div>
        <Image src={flyingTokens} height={200} width={200} alt="Flying tokens" className="h-full" />

        <i className="ri-arrow-right-line text-4xl text-bg font-black" />
      </Card>
    </div>
  );
};
