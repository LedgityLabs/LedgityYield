import { Amount, Card } from "@/components/ui";
import React from "react";
import { twMerge } from "tailwind-merge";

export const AppDashboardProfits: React.PropsWithoutRef<typeof Card> = ({ className }) => {
  return (
    <Card
      circleIntensity={0.07}
      className={twMerge(
        "flex flex-col justify-between items-center py-4 px-6 [&:hover_>_span:last-of-type]:opacity-100 [&:hover_>_span:first-of-type]:opacity-50",
        className
      )}
    >
      <h2 className="text-center text-lg font-medium text-indigo-900/80">Total profits</h2>
      <span className="text-center text-4xl font-heavy font-heading text-green-600 transition-opacity">
        +133.14%
      </span>
      <span className="text-center text-xl font-heavy font-heading text-green-600 opacity-50 transition-opacity">
        <span className="text-fg/20">(</span>
        +$
        <Amount value={157789} />
        <span className="text-fg/20">)</span>
      </span>
    </Card>
  );
};
