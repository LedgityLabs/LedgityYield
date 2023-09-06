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
import flyingTokens from "~/assets/tokens/flying-ldy.png";
import { useSwitchAppTab } from "@/hooks/useSwitchAppTab";

export const AppInvest: FC = () => {
  const publicClient = usePublicClient();
  const isLinea = publicClient && [59144, 59140].includes(publicClient.chain.id);
  const { switchTab } = useSwitchAppTab();

  return (
    <div className="lg:w-[980px] w-full flex flex-col gap-8 pb-8">
      {!isLinea && (
        <a onClick={() => switchTab("lockdrop")} className="cursor-pointer">
          <Card
            defaultGradient={false}
            circleIntensity={0}
            animated={false}
            className="before:bg-gradient-to-tl before:from-[#20456c]/70 before:to-[#20456c] before:hover:opacity-95 before:transition-opacity w-full p-10 py-10 md:py-5 max-sm:pr-2 flex justify-between items-center gap-5 bg-[#28a0f0]/20"
          >
            <div className="flex gap-5 md:mr-0 -mr-[40px] md:flex-nowrap flex-wrap md:justify-start justify-center">
              <div className="flex flex-col justify-center md:items-start items-center gap-4">
                <p className="inline-flex gap-1.5 justify-center items-center bg-[#2676ca] px-2 pr-3 py-1 rounded-2xl text-sm text-bg font-semibold max-w-fit">
                  <span className="rinline-block elative h-4 w-4 flex justify-center items-center ">
                    <span className="inline-block absolute h-3 w-3 rounded-full animate-ping_ duration-[1500ms] bg-bg"></span>
                    <span className="inline-block absolute h-3 w-3 rounded-full bg-bg"></span>
                  </span>
                  Not started
                </p>
                <h3 className="font-extrabold text-4xl text-bg font-heading text-center">
                  Arbitrum Lockdrop
                </h3>

                <div className="text-bg font-semibold md:text-start text-center">
                  Lock USDC and receive very first $LDY tokens!{" "}
                  <span className="whitespace-nowrap">Limited to first 5M USDC.</span>
                </div>
              </div>
              <Image
                src={flyingTokens}
                height={200}
                width={200}
                alt="Flying tokens"
                className="h-full"
              />
            </div>

            <i className="ri-arrow-right-line text-4xl text-bg font-black" />
          </Card>
        </a>
      )}

      <Card
        defaultGradient={true}
        circleIntensity={0.07}
        className="w-full flex flex-col gap-10 relative overflow-hidden"
      >
        <span className="absolute px-2 py-1.5 pt-1 text-sm leading-none rounded-bl-lg rounded-br-lg text-bg top-0 left-5 bg-orange-700 font-medium">
          Beta
        </span>
        <div className="flex gap-10 justify-between flex-wrap-reverse p-10 pt-8 pb-0">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg text-fg/50">TVL</h3>
            <AppInvestTVL className="text-[1.92rem] text-fg font-heading font-bold" />
          </div>
          <div className="flex gap-14 flex-wrap">
            <div className="flex flex-col md:items-end items-start gap-2">
              <h3 className="font-bold text-lg text-fg/50 whitespace-nowrap">Distributed yield</h3>
              <AppInvestDistributedRewards className="text-[1.92rem] text-fg/90 font-heading font-bold" />
            </div>
            <div className="flex flex-col md:items-end items-start gap-2">
              <h3 className="font-bold text-lg text-fg/50 whitespace-nowrap">APR variations</h3>
              <AppInvestVariation className="text-[1.92rem] text-fg/90 font-heading font-bold" />
            </div>
          </div>
        </div>
        <p className="px-10 font-medium text-lg lg:w-[50%] md:w-[65%] sm:w-[80%] w-full text-fg/80 -mt-3">
          Invest USDC and get exposed to stable and high yield backed by RWA (Real World Assets).
          <br />
          <Link
            href="https://docs.ledgity.finance/"
            target="_blank"
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

      {/* {isLinea && (
        <Link href="/app/multi-lockdrop" className="w-full">
          <Card className="before:bg-gradient-to-tr before:from-primary before:to-indigo-400 before:hover:bg-gradient-to-br w-full p-10 py-5 flex justify-between items-center gap-3">
            <div className="flex flex-col justify-center gap-3">
              <div className="flex gap-5 items-center">
                <h3 className="font-extrabold text-3xl text-bg font-heading">
                  Linea Multi-Lockdrop
                </h3>
                <p className="inline-flex gap-1.5 justify-center items-center bg-indigo-700 px-2 pr-3 py-1 rounded-2xl text-sm text-bg font-semibold">
                  <span className="rinline-block elative h-4 w-4 flex justify-center items-center ">
                    <span className="inline-block absolute h-3 w-3 rounded-full animate-ping duration-[1500ms] bg-bg"></span>
                    <span className="inline-block absolute h-3 w-3 rounded-full bg-bg"></span>
                  </span>
                  Ongoing
                </p>
              </div>
              <div className="text-bg font-semibold">
                Lock USDC and receive tokens from 5+ major Linea projects.
              </div>
            </div>
            <Image
              src={flyingTokens}
              height={200}
              width={200}
              alt="Flying tokens"
              className="h-full"
            />

            <i className="ri-arrow-right-line text-4xl text-bg font-black" />
          </Card>
        </Link>
      )} */}
    </div>
  );
};
