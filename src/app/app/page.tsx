"use client";
import { AppDashboard } from "@/components/app/dashboard/AppDashboard";
import { AppInvest } from "@/components/app/invest/AppInvest";
// import { AppStaking } from "@/components/app/staking/AppStaking";
import { AppLDYToken } from "@/components/app/ldy-token/AppLDYToken";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

import { type NextPage } from "next";

const Page: NextPage = () => {
  return (
    <Tabs
      defaultValue="invest"
      className="flex flex-col gap-10 justify-center w-screen items-center"
    >
      <TabsList className="mt-12 mb-6">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="invest">Invest</TabsTrigger>
        <TabsTrigger value="ldy-token">
          LDY Token
          <span className="absolute -top-5 -right-[50%] bg-primary text-bg text-xs rounded-md px-2 py-1">
            Early investors
          </span>
        </TabsTrigger>
        {/* <TabsTrigger value="staking">Staking</TabsTrigger> */}
      </TabsList>
      <div className="[&_>_*]:animate-fadeAndMoveIn [&_>_*]:[animation-duration:300ms]">
        <TabsContent value="dashboard">
          <AppDashboard />
        </TabsContent>
        <TabsContent value="invest">
          <AppInvest />
        </TabsContent>
        {/* <TabsContent value="staking">
          <AppStaking />
        </TabsContent> */}
        <TabsContent value="ldy-token">
          <AppLDYToken />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default Page;
