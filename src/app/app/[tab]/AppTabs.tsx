"use client";
import { AppDashboard } from "@/components/app/dashboard/AppDashboard";
import { AppGetUSDC } from "@/components/app/get-usdc/AppGetUSDC";
import { AppInvest } from "@/components/app/invest/AppInvest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { SwitchAppTabProvider } from "@/contexts/SwitchAppTabContext";
import { useSwitchAppTab } from "@/hooks/useSwitchAppTab";

import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { AppPreMining } from "@/components/app/pre-mining/AppPreMining";
import { AppAirdrop } from "@/components/app/airdrop/AppAirdrop";
import { SessionProvider } from "next-auth/react";
import { AppStaking } from "@/components/app/staking/AppStaking";
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
  const { currentTab, switchTab } = useSwitchAppTab();
  return (
    <Tabs
      value={currentTab}
      className="flex w-screen max-w-[100vw] flex-col items-center justify-center sm:gap-10 gap-5"
      onValueChange={(v) => switchTab(v)}
    >
      <TabsList className="mb-6 mt-12 sm:w-fit w-[250px]">
        <TabsTrigger
          value="invest"
          className="[&_div:hover]:!opacity-100 [&_div:hover]:!grayscale-0"
        >
          Invest
        </TabsTrigger>
        <TabsTrigger value="airdrop">
          Airdrop
          <div
            className={twMerge(
              "absolute right-[20%] -top-[2rem] z-20 flex items-center justify-center gap-1 rounded-xl bg-gradient-to-bl from-[#20456c]/50 to-[red] px-[0.47rem] py-[0.04rem] text-center text-[0.8rem] font-bold text-white",
              currentTab === "airdrop" && "opacity-50 hover:opacity-100",
            )}
          >
            <i className="ri-fire-fill text-x animate-pulse" />
            Hot
            <i className="ri-arrow-down-s-fill absolute -bottom-[1.33rem] left-1.5 -z-10 text-3xl text-[#20456c]/90"></i>
          </div>
        </TabsTrigger>
        {/* <TabsTrigger
          value="pre-mining"
          className="[&_div:hover]:!opacity-100 [&_div:hover]:!grayscale-0"
        >
          Pre-Mining
        </TabsTrigger> */}

        {/* <TabsTrigger value="staking">Staking</TabsTrigger> */}
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
      </TabsList>
      <div className="[&_>_*]:animate-fadeAndMoveIn [&_>_*]:[animation-duration:300ms] sm:px-5 max-w-[100vw]">
        <SessionProvider>
          <TabsContent value="invest">
            <AppInvest />
          </TabsContent>
          {/* <TabsContent value="pre-mining">
            <AppPreMining />
          </TabsContent> */}
          <TabsContent value="airdrop">
            <AppAirdrop />
          </TabsContent>
          <TabsContent value="get-usdc">
            <AppGetUSDC />
          </TabsContent>
          <TabsContent value="staking">
            <AppStaking />
          </TabsContent>
          <TabsContent value="dashboard">
            <AppDashboard />
          </TabsContent>
        </SessionProvider>
      </div>
    </Tabs>
  );
};

export default AppTabs;
