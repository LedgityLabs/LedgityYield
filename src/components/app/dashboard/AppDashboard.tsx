import { FC } from "react";
import { AppDashboardBalances } from "./AppDashboardBalances";
import { AppDashboardProfits } from "./AppDashboardProfits";
import { AppDashboardChart } from "./AppDashboardChart";
import { AppDashboardActivity } from "./AppDashboardActivity";
import { AppDashboardSupport } from "./AppDashboardSupport";

export const AppDashboard: FC = () => {
  return (
    <section className="grid grid-cols-[1fr,0.7fr,1.2fr,repeat(3,1fr)] grid-rows-[repeat(4,1fr)] w-[1200px] h-[900px] gap-10 pb-10">
      <AppDashboardBalances className="col-span-2" />
      <AppDashboardProfits />
      <AppDashboardActivity className="row-start-2 row-span-3 col-span-3" />
      <AppDashboardChart className="row-span-3 col-span-3 " />
      <AppDashboardSupport className="col-start-4 col-span-3" />
    </section>
  );
};
