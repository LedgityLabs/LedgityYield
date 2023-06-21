import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

import { type NextPage } from "next";

const Page: NextPage = () => {
  return (
    <Tabs defaultValue="invest" className="flex flex-col justify-center w-screen items-center">
      <TabsList>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="invest">Invest</TabsTrigger>
        <TabsTrigger value="staking">Staking</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard" className="flex justify-center">
        <p className="mt-8">DASHBOARD</p>
      </TabsContent>
      <TabsContent value="invest" className="flex justify-center">
        <p className="mt-8">INVEST</p>
      </TabsContent>
      <TabsContent value="staking" className="flex justify-center">
        <p className="mt-8">STAKING</p>
      </TabsContent>
    </Tabs>
  );
};

export default Page;
