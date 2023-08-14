import { FC } from "react";
import { AppDashboardBalances } from "./AppDashboardBalances";
import { AppDashboardProfits } from "./AppDashboardProfits";
import { AppDashboardChart } from "./AppDashboardChart";
import { AppDashboardActivity } from "./AppDashboardActivity";

export const AppDashboard: FC = () => {
  return (
    <section className="grid h-[1200px] w-[1000px] grid-cols-[repeat(6,1fr)] grid-rows-[repeat(5,1fr)] gap-10 pb-10">
      <AppDashboardProfits className="col-span-2" />
      <AppDashboardBalances className="col-span-2 col-start-1 row-span-2 row-start-2" />
      <AppDashboardChart className="col-span-4 col-start-3 row-span-3 row-start-1 " />
      <AppDashboardActivity className="col-span-6 row-span-2" />
    </section>
  );
};
