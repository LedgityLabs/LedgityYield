import { Card } from "@/components/ui";
import React, { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}
export const AppInvestAirdrop: FC<Props> = ({ className }) => {
  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("h-52 flex-col items-center justify-center px-10 py-4", className)}
    ></Card>
  );
};
