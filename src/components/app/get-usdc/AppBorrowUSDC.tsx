import { Card } from "@/components/ui";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

export const AppBorrowUSDC: FC = () => {
  return (
    <Card circleIntensity={0.07} className={twMerge("flex flex-col items-center px-4 pb-6 pt-10")}>
      <h2 className="inline-flex items-center justify-center gap-3 pb-4 text-center font-heading text-2xl font-bold text-fg/90">
        Borrow USDC
        <i className="ri-hand-coin-fill text-3xl" />
      </h2>
      <p className="text-lg font-semibold text-primary">Borrow USDC against collateral.</p>
    </Card>
  );
};
