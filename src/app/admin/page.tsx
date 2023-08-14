"use client";
import { AdminDashboard } from "@/components/admin/dashboard/AdminDashboard";
import { AdminLTokens } from "@/components/admin/ltokens/AdminLTokens";
import { AdminBlacklist } from "@/components/admin/blacklist/AdminBlacklist";
import { AdminRecover } from "@/components/admin/recover/AdminRecover";
import { AdminTesting } from "@/components/admin/testing/AdminTesting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { type NextPage } from "next";
import { usePublicClient } from "wagmi";
import { AdminOwnership } from "@/components/admin/ownership/AdminOwnership";
import { AdminPause } from "@/components/admin/pause/AdminPause";

const Page: NextPage = () => {
  const publicClient = usePublicClient();
  if (!publicClient.chain) return null;
  const isLocalnet = publicClient.chain.id === 31337;
  return (
    <>
      <h2 className="text-center font-heading text-4xl font-bold text-fg/90">Admin</h2>
      <Tabs
        defaultValue="dashboard"
        className="flex w-screen flex-col items-center justify-center gap-10"
      >
        <TabsList className="mb-6 mt-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="ltokens">L-Tokens</TabsTrigger>
          <TabsTrigger value="recover">Recover</TabsTrigger>
          <TabsTrigger value="ownership">Ownership</TabsTrigger>
          <TabsTrigger value="pause">Pause</TabsTrigger>
          <TabsTrigger value="blacklist">Blacklist</TabsTrigger>
          {isLocalnet && (
            <TabsTrigger value="testing" className="!text-blue-500">
              Testing
            </TabsTrigger>
          )}
        </TabsList>
        <div className="pb-10 [&_>_*]:animate-fadeAndMoveIn">
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="ltokens">
            <AdminLTokens />
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

          {isLocalnet && (
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
