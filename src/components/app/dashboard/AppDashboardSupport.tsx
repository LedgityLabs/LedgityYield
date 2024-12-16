import { Card } from "@/components/ui";
import React from "react";
import { twMerge } from "tailwind-merge";

export const AppDashboardSupport: React.PropsWithoutRef<typeof Card> = ({
  className,
}) => {
  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex justify-center items-center", className)}
    >
      <p>Get support</p>
    </Card>
  );
};
