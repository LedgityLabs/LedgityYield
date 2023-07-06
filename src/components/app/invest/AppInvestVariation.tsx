import { Card, Rate } from "@/components/ui";
import { FC } from "react";

export const AppInvestVariation: FC = () => {
  return (
    <Card circleIntensity={0.07} className="h-52 flex-col justify-center items-center py-4 px-10">
      <h2 className="text-center text-lg font-medium text-indigo-900/80">1 year variation</h2>
      <div className="h-full -mt-5 flex justify-center items-center text-5xl font-heavy font-heading">
        <Rate value={137} prefix={"±"} />
      </div>
    </Card>
  );
};
