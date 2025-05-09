import { useEffect, useState } from "react";
// Components
import { Card } from "@/components/ui";
import { AppDashboardActivity } from "@/components/app/dashboard/AppDashboardActivity";
import { AppDashboardChart } from "@/components/app/dashboard/AppDashboardChart";
import { AppDashboardGrowth } from "@/components/app/dashboard/AppDashboardGrowth";
import { AppDashboardTokenBalances } from "@/components/app/dashboard/AppDashboardTokenBalances";
import { AppDashboardRevenue } from "@/components/app/dashboard/AppDashboardRevenue";

export function AppDashboard() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const figureSmallScreen = () => {
    if (window.innerWidth <= 750) setIsSmallScreen(true);
    else setIsSmallScreen(false);
  };
  useEffect(() => {
    figureSmallScreen();
    window.addEventListener("resize", figureSmallScreen);
    return () => window.removeEventListener("resize", figureSmallScreen);
  }, []);

  if (isSmallScreen)
    return (
      <div className="lg:w-[900px] w-full flex flex-col gap-10 justify-center items-center mb-10">
        <Card
          circleIntensity={0.07}
          defaultGradient={true}
          className="w-full flex flex-col gap-3 justify-between p-6"
        >
          <h3 className="text-xl text-center font-heading font-bold">
            Screen size not supported
          </h3>
          <p className="text-center font-semibold max-w-[400px]">
            The user dashboard is not yet supported on small screens, please
            open it from a laptop.
          </p>
        </Card>
      </div>
    );

  return (
    <>
      <div className="lg:w-[900px] w-full flex flex-col gap-10 justify-center items-center mb-10">
        <Card
          circleIntensity={0.07}
          defaultGradient={true}
          className="w-full flex justify-between "
        >
          <AppDashboardChart className="h-[680px] w-full" />
          <div className="p-10 pl-0 w-72 flex-col justify-between gap-10 h-full self-stretch flex-grow -mt-1">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2 items-end">
                <h3 className="font-bold text-lg text-fg/50 whitespace-nowrap">
                  Total growth
                </h3>
                <AppDashboardGrowth className="text-[1.92rem] text-fg font-heading font-bold" />
              </div>
              <div className="flex flex-col gap-2 items-end">
                <h3 className="font-bold text-lg text-fg/50 whitespace-nowrap">
                  Total revenues
                </h3>
                <AppDashboardRevenue className="text-[1.92rem] text-fg font-heading font-bold" />
              </div>

              <div className="flex flex-col gap-2 items-end">
                <h3 className="font-bold text-lg text-fg/50 whitespace-nowrap">
                  Invested
                </h3>
                <AppDashboardTokenBalances />
              </div>
            </div>
          </div>
        </Card>
        <Card
          circleIntensity={0.07}
          defaultGradient={true}
          className="w-full flex flex-col gap-8"
        >
          <h2 className="font-heading text-center text-2xl font-bold pt-8">
            Activity
          </h2>
          <AppDashboardActivity className="w-full" />
        </Card>
      </div>
    </>
  );
}
