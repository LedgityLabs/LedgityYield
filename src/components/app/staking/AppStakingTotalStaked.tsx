import { Amount, Card } from "@/components/ui";
import { useLtyStakingTotalStaked } from "@/generated";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}

export const AppStakingTotalStaked: FC<Props> = ({ className }) => {
  const { data: totalStaked } = useLtyStakingTotalStaked();
  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex justify-center items-center p-4 pl-10", className)}
    >
      <div className="flex h-full flex-col justify-center items-center ">
        <h2 className="text-center text-lg font-medium text-indigo-900/80 whitespace-nowrap">
          Total staked
        </h2>
        <div className="h-full flex justify-center items-center text-5xl font-heavy font-heading">
          <Amount value={totalStaked} />
        </div>
      </div>
      <div className="flex justify-center items-center w-full h-full ml-10 bg-primary/10 rounded-3xl text-center">
        Chart
        <br />
        (coming soon)
      </div>
    </Card>
  );
};
