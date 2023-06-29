import { Card, Rate } from "@/components/ui";
import { useLtyStakingGetApr, useLtyStakingTotalStaked } from "@/generated";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}

export const AppStakingAPR: FC<Props> = ({ className }) => {
  const { data: apr } = useLtyStakingGetApr();
  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex flex-col justify-center items-center py-4 px-10", className)}
    >
      <h2 className="text-center text-lg font-medium text-indigo-900/80">Current APR</h2>
      <div className="h-full flex justify-center items-center text-6xl font-heavy font-heading">
        <Rate value={apr} />
      </div>
    </Card>
  );
};
