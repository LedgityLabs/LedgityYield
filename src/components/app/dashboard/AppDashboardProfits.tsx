import { Amount, Card } from "@/components/ui";
import React from "react";
import { twMerge } from "tailwind-merge";

export const AppDashboardProfits: React.PropsWithoutRef<typeof Card> = ({ className }) => {
  const rewards = 157789123456n;
  const decimals = 6;

  return (
    <Card
      circleIntensity={0.07}
      className={twMerge(
        "flex flex-col justify-between items-center py-4 px-7 [&:hover_>_span:last-of-type]:opacity-100 [&:hover_>_span:first-of-type]:opacity-50",
        className
      )}
    >
      <h2 className="text-center text-lg font-medium text-indigo-900/80">Total profits</h2>
      <span className="text-center text-4xl font-heavy font-heading text-emerald-500 transition-opacity">
        +133.14%
      </span>
      <span className="text-center text-xl font-heavy font-heading text-emerald-500 opacity-50 transition-opacity">
        <span className="text-fg/20">(</span>
        +$
        <Amount value={rewards} decimals={decimals} />
        <span className="text-fg/20">)</span>
      </span>
    </Card>
  );
};
