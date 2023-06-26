"use client";
import { AdminBlacklist } from "@/components/app/admin/blacklist/AdminBlacklist";
import { AdminDashboard } from "@/components/app/admin/dashboard/AdminDashboard";
import { AdminLTokens } from "@/components/app/admin/ltokens/AdminLTokens";
import { AdminRecover } from "@/components/app/admin/recover/AdminRecover";
import { AdminStaking } from "@/components/app/admin/staking/AdminStaking";
import { AdminTesting } from "@/components/app/admin/testing/AdminTesting";
import { AppDashboard } from "@/components/app/dashboard/AppDashboard";
import { AppInvest } from "@/components/app/invest/AppInvest";
import { AppStaking } from "@/components/app/staking/AppStaking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { useDApp } from "@/hooks";

import { type NextPage } from "next";

const Page: NextPage = () => {
  const { chain } = useDApp();
  const isTestnet = chain?.testnet || chain.id == 31337;
  return (
    <>
      <h2 className="text-center font-bold text-4xl font-heading text-fg/90">Admin</h2>
      <Tabs
        defaultValue="dashboard"
        className="flex flex-col gap-10 justify-center w-screen items-center"
      >
        <TabsList className="mt-6 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="ltokens">L-Tokens</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
          <TabsTrigger value="blacklist">Blacklist</TabsTrigger>
          <TabsTrigger value="recover">Recover</TabsTrigger>
          {isTestnet && (
            <TabsTrigger value="testing" className="!text-blue-500">
              Testing
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="dashboard">
          <AdminDashboard />
        </TabsContent>
        <TabsContent value="ltokens">
          <AdminLTokens />
        </TabsContent>
        <TabsContent value="staking">
          <AdminStaking />
        </TabsContent>
        <TabsContent value="blacklist">
          <AdminBlacklist />
        </TabsContent>
        <TabsContent value="recover">
          <AdminRecover />
        </TabsContent>
        {isTestnet && (
          <TabsContent value="testing">
            <AdminTesting />
          </TabsContent>
        )}
      </Tabs>
    </>
  );
};

export default Page;
