"use client";
import { AppDashboard } from "@/components/app/dashboard/AppDashboard";
import { AppGetUSDC } from "@/components/app/get-usdc/AppGetUSDC";
import { AppInvest } from "@/components/app/invest/AppInvest";
import { AppLockdrop } from "@/components/app/lockdrop/AppLockdrop";
import { AppMultiLockdrop } from "@/components/app/multi-lockdrop/AppMultiLockdrop";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { SwitchAppTabProvider } from "@/contexts/SwitchAppTabContext";
import { useSwitchAppTab } from "@/hooks/useSwitchAppTab";

import { type NextPage } from "next";
import { FC, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { usePublicClient } from "wagmi";

interface Props {
  defaultTab: string;
}

const AppTabs: FC<Props> = ({ defaultTab }) => {
  return (
    <SwitchAppTabProvider defaultTab={defaultTab}>
      <_AppTabs />
    </SwitchAppTabProvider>
  );
};

const _AppTabs: FC = () => {
  const publicClient = usePublicClient();
  const { currentTab, switchTab } = useSwitchAppTab();

  // Figure out if it's an Arbitrum/Linea user or not
  const isArbitrum = publicClient && [42161, 421613].includes(publicClient.chain.id);
  const isLinea = publicClient && [59144, 59140].includes(publicClient.chain.id);

  return (
    <Tabs
      value={currentTab}
      className="flex w-screen flex-col items-center justify-center gap-10"
      onValueChange={(v) => switchTab(v)}
    >
      <TabsList className="mb-6 mt-12">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger
          value="invest"
          className="[&_div:hover]:!opacity-100 [&_div:hover]:!grayscale-0"
        >
          Invest
        </TabsTrigger>
        {isArbitrum && (
          <TabsTrigger
            value="lockdrop"
            className="[&_div:hover]:!opacity-100 [&_div:hover]:!grayscale-0"
          >
            Lockdrop
            <div
              className={twMerge(
                "absolute right-[20%] -top-[2rem] z-20 flex items-center justify-center gap-1 rounded-xl bg-gradient-to-tr from-orange-500 to-orange-700 px-[0.47rem] py-[0.04rem] text-center text-[0.8rem] font-bold text-white",
                currentTab === "ldy-token" && "opacity-60 grayscale-[30%]",
              )}
            >
              <i className="ri-fire-fill text-x animate-pulse" />
              Hot
              <i className="ri-arrow-down-s-fill absolute -bottom-[1.33rem] left-1.5 -z-10 text-3xl text-orange-600/80"></i>
            </div>
          </TabsTrigger>
        )}
        {/* {isLinea && (
          <TabsTrigger
            value="multi-lockdrop"
            className="[&_div:hover]:!opacity-100 [&_div:hover]:!grayscale-0"
          >
            Multi-Lockdrop
            <div
              className={twMerge(
                "absolute right-[30%] -top-[2rem] z-20 flex items-center justify-center gap-1 rounded-xl bg-gradient-to-tr from-orange-500 to-orange-700 px-[0.47rem] py-[0.04rem] text-center text-[0.8rem] font-bold text-white",
                currentTab === "ldy-token" && "opacity-60 grayscale-[30%]",
              )}
            >
              <i className="ri-fire-fill text-x animate-pulse" />
              Hot
              <i className="ri-arrow-down-s-fill absolute -bottom-[1.33rem] left-1.5 -z-10 text-3xl text-orange-600/80"></i>
            </div>
          </TabsTrigger>
        )} */}
        {isLinea && <TabsTrigger value="get-usdc">Get USDC</TabsTrigger>}
      </TabsList>
      <div className="[&_>_*]:animate-fadeAndMoveIn [&_>_*]:[animation-duration:300ms]">
        <TabsContent value="dashboard">
          <AppDashboard />
        </TabsContent>
        <TabsContent value="invest">
          <AppInvest />
        </TabsContent>
        <TabsContent value="lockdrop">
          <AppLockdrop />
        </TabsContent>
        <TabsContent value="multi-lockdrop">
          <AppMultiLockdrop />
        </TabsContent>
        <TabsContent value="get-usdc">
          <AppGetUSDC />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default AppTabs;
