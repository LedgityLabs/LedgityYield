"use client";
import { AppDashboard } from "@/components/app/dashboard/AppDashboard";
import { AppInvest } from "@/components/app/invest/AppInvest";
import { AppLDYToken } from "@/components/app/ldy-token/AppLDYToken";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

import { type NextPage } from "next";

const Page: NextPage = () => {
  return (
    <Tabs
      defaultValue="invest"
      className="flex w-screen flex-col items-center justify-center gap-10"
    >
      <TabsList className="mb-6 mt-12">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="invest">Invest</TabsTrigger>
        <TabsTrigger value="ldy-token">
          LDY Token
          <span className="absolute -right-[50%] -top-5 rounded-xl bg-primary px-[0.47rem] py-[0.04rem] text-center text-[0.8rem] text-bg">
            Early Investors
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
