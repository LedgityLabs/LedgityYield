import { Card } from "@/components/ui";
import { FC, useRef } from "react";
import { AppStakingPane } from "./AppStakingPane";
import { AppStakingDescription } from "./AppStakingDescription";
import { AppStakingPool } from "./AppStakingPool";

export const AppStaking: FC = () => {
  return (
    <section className="lg:w-[1080px] grid grid-cols-12 gap-5 pb-10 w-full h-full px-2">
      <Card
        circleIntensity={0.07}
        defaultGradient={true}
        className="w-full flex flex-col col-span-12 xl:col-span-6 gap-2 p-2"
      >
        <AppStakingPane />
      </Card>
      <Card
        circleIntensity={0.07}
        defaultGradient={true}
        className="w-full flex flex-col col-span-12 xl:col-span-6 gap-8 p-2"
      >
        <AppStakingDescription />
      </Card>
      <Card
        circleIntensity={0.07}
        defaultGradient={false}
        className="w-full flex flex-col gap-8 col-span-12 before:bg-primary p-2"
      >
        <AppStakingPool />
      </Card>
    </section>
  );
};
