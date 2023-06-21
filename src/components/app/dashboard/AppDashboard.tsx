import { Card } from "@/components/ui";
import { FC } from "react";

export const AppDashboard: FC = () => {
  return (
    <section className="grid grid-cols-5 grid-rows-3 w-[1200px] h-[630px] gap-10">
      <Card className="flex justify-center items-center ">
        <p>Holding</p>
      </Card>
      <Card className="flex justify-center items-center ">
        <p>Total profits</p>
      </Card>
      <Card className="flex justify-center items-center row-start-2 row-span-2 col-span-2">
        <p>Activity</p>
      </Card>
      <Card className="flex justify-center items-center row-span-3 col-span-3">
        <p>Charts</p>
      </Card>
    </section>
  );
};
