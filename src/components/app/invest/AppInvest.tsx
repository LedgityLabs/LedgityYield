"use client";
import React, { FC } from "react";
import { AppInvestTVL } from "./AppInvestTVL";
import { AppInvestDistributedRewards } from "./AppInvestDistributedRewards";
import { AppInvestVariation } from "./AppInvestVariation";
import { AppInvestTokens } from "./AppInvestTokens";
import { Card } from "@/components/ui";
import Link from "next/link";
import { useSwitchAppTab } from "@/hooks/useSwitchAppTab";
import { AppInvestHoldersCount } from "./AppInvestHoldersCount";

export const AppInvest: FC = () => {
  const { switchTab } = useSwitchAppTab();

  return (
    <div className="lg:w-[980px] w-full flex flex-col gap-8 pb-8">
      <a
        onClick={() => switchTab("airdrop")}
        className="cursor-pointer h-40 bg-[url('/assets/banners/multi-airdrop.png')] rounded-[1.8rem] bg-center bg-cover w-full opacity-95 border-[3px] border-fg/30 hover:opacity-100 hover:contrast-[105%] transition-[opacity,filter]"
      ></a>
      {/* <a onClick={() => switchTab("airdrop")} className="cursor-pointer">
        <Card
          defaultGradient={false}
          circleIntensity={0}
          animated={false}
          className="relative before:bg-gradient-to-tr before:from-[#20456c] before:via-[#20456c] before:to-[#20456c]/70 before:hover:opacity-95 before:transition-opacity w-full sm:p-10 p-7 flex justify-between items-center gap-5 bg-[#28a0f0]/20 bg-[url('/assets/textures/flying-tokens.png')] bg-contain before:inset-0"
        >
          <div className="flex gap-5">
            <div className="flex flex-col justify-center items-start gap-4">
              <div className="flex gap-3 items-center flex-wrap-reverse pr-10">
                <h3 className="font-extrabold text-4xl text-bg font-heading whitespace-nowrap">
                  Multi-Airdrop
                </h3>
                <p className="inline-flex gap-1.5 justify-center items-center bg-[#2676ca] px-2 pr-3 py-1 rounded-2xl text-sm text-bg font-semibold max-w-fit">
                  <span className="rinline-block elative h-4 w-4 flex justify-center items-center ">
                    <span className="inline-block absolute h-3 w-3 rounded-full animate-ping duration-[1500ms] bg-bg"></span>
                    <span className="inline-block absolute h-3 w-3 rounded-full bg-bg"></span>
                  </span>
                  Ongoing
                </p>
              </div>

              <div className="text-bg font-semibold">
                Be early and receive $LDY tokens + tokens from Ledgity&apos;s partners.
              </div>
            </div>
          </div>

          <span className="sm:static absolute top-7 right-7">
            <i className="ri-arrow-right-line text-4xl text-bg font-black " />
          </span>
        </Card>
      </a> */}
      <Card
        defaultGradient={true}
        circleIntensity={0.07}
        className="w-full flex flex-col gap-10 relative overflow-hidden"
      >
        <span className="absolute px-2 py-1.5 pt-1 text-sm leading-none rounded-bl-lg rounded-br-lg text-bg top-0 left-5 bg-orange-700 font-medium drop-shadow-md">
          Beta
        </span>
        <div className="flex sm:gap-10 gap-6 justify-between flex-wrap-reverse sm:p-10 p-5 pt-8 pb-0">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg text-fg/50">TVL</h3>
            <AppInvestTVL className="text-[1.92rem] text-fg font-heading font-bold" />
          </div>
          <div className="flex sm:gap-14 gap-10 flex-wrap">
            <div className="flex flex-col md:items-end items-start gap-2">
              <h3 className="font-bold text-lg text-fg/50 whitespace-nowrap">Holders</h3>
              <AppInvestHoldersCount className="text-[1.92rem] text-fg/90 font-heading font-bold" />
            </div>
            <div className="flex flex-col md:items-end items-start gap-2">
              <h3 className="font-bold text-lg text-fg/50 whitespace-nowrap">APR variations</h3>
              <AppInvestVariation className="text-[1.92rem] text-fg/90 font-heading font-bold" />
            </div>
          </div>
        </div>
        <p className="sm:px-10 px-5 font-medium text-lg lg:w-[60%] md:w-[65%] sm:w-[80%] w-full text-fg/80 -mt-3">
          Invest USDC and get exposed to real, stable and high-efficiency yield backed by RWA (Real
          World Assets).
          <br />
          <Link
            href="https://docs.ledgity.finance/"
            target="_blank"
            className="text-fg/95 font-semibold underline underline-offset-2 decoration-fg/20 hover:text-slate-900 transition-colors"
          >
            Read the{" "}
            <span className="whitespace-nowrap">
              documentation <i className="ri-arrow-right-line" />
            </span>
          </Link>
        </p>
        <AppInvestTokens />
        <p className="text-center pb-5 -mt-5 opacity-60 font-medium text-[0.85rem] px-5">
          By depositing you agree to our{" "}
          <Link
            href="/legal/terms-and-conditions"
            className="text-indigo-700 underline underline-offset-2 decoration-primary/40"
          >
            Terms & Conditions.
          </Link>
        </p>
      </Card>
    </div>
  );
};
