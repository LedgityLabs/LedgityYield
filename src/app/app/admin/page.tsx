"use client";
import { AdminDashboard } from "@/components/app/admin/dashboard/AdminDashboard";
import { AdminLTY } from "@/components/app/admin/lty/AdminLTY";
import { AdminLTokens } from "@/components/app/admin/ltokens/AdminLTokens";
import { AdminStaking } from "@/components/app/admin/staking/AdminStaking";
import { AdminBlacklist } from "@/components/app/admin/blacklist/AdminBlacklist";
import { AdminRecover } from "@/components/app/admin/recover/AdminRecover";
import { AdminTesting } from "@/components/app/admin/testing/AdminTesting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { type NextPage } from "next";
import { usePublicClient } from "wagmi";
import { AdminOwnership } from "@/components/app/admin/ownership/AdminOwnership";
import { AdminPause } from "@/components/app/admin/pause/AdminPause";

const Page: NextPage = () => {
  const publicClient = usePublicClient();
  if (!publicClient.chain) return null;
  const isTestnet = !publicClient.chain?.testnet || !(publicClient.chain.id === 31337);
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
          <TabsTrigger value="lty">LTY</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
          <TabsTrigger value="recover">Recover</TabsTrigger>
          <TabsTrigger value="ownership">Ownership</TabsTrigger>
          <TabsTrigger value="pause">Pause</TabsTrigger>
          <TabsTrigger value="blacklist">Blacklist</TabsTrigger>
          {isTestnet && (
            <TabsTrigger value="testing" className="!text-blue-500">
              Testing
            </TabsTrigger>
          )}
        </TabsList>
        <div className="[&_>_*]:animate-fadeAndMoveIn">
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="ltokens">
            <AdminLTokens />
          </TabsContent>

          <TabsContent value="lty">
            <AdminLTY />
          </TabsContent>

          <TabsContent value="staking">
            <AdminStaking />
          </TabsContent>

          <TabsContent value="recover">
            <AdminRecover />
          </TabsContent>

          <TabsContent value="ownership">
            <AdminOwnership />
          </TabsContent>

          <TabsContent value="pause">
            <AdminPause />
          </TabsContent>

          <TabsContent value="blacklist">
            <AdminBlacklist />
          </TabsContent>

          {isTestnet && (
            <TabsContent value="testing">
              <AdminTesting />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </>
  );
};

export default Page;
