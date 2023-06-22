import { Card, Switch } from "@/components/ui";
import { FC } from "react";

export const AppDashboard: FC = () => {
  return (
    <section className="grid grid-cols-[repeat(5,1fr)] grid-rows-[repeat(4,1fr)] w-[1200px] h-[900px] gap-10 pb-10">
      <Card className="flex justify-center items-center ">
        <p>Holding</p>
      </Card>
      <Card className="lex-col justify-center items-center py-4 px-4">
        <h2 className="text-center text-lg font-medium text-indigo-900/80">Total profits</h2>
        <div className="h-full -mt-5 flex justify-center items-center text-4xl font-heavy font-heading text-green-600">
          +133.14%
        </div>
      </Card>
      <Card className="flex justify-center items-center row-start-2 row-span-3 col-span-2">
        <p>Activity</p>
      </Card>
      <Card className="flex flex-col justify-center items-center row-span-3 col-span-3 p-10">
        <div className="h-full w-full bg-primary/10 rounded-3xl flex justify-center items-center">
          Chart (coming soon)
        </div>
        <div className=" mt-10">
          <div className="flex gap-3 justify-center items-center font-medium">
            <p>Revenue ($)</p>
            <Switch />
            <p>Growth (%)</p>
          </div>
        </div>
      </Card>
      <Card className="flex justify-center items-center col-start-3 col-span-3">
        <p>Get support</p>
      </Card>
    </section>
  );
};
