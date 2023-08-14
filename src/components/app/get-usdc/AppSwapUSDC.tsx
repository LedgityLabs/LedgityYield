import { Card } from "@/components/ui";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

export const AppSwapUSDC: FC = () => {
  return (
    <Card circleIntensity={0.07} className={twMerge("flex flex-col items-center p-10")}>
      <h2 className="inline-flex items-center justify-center gap-3 pb-4 text-center font-heading text-2xl font-bold text-fg/90">
        Swap USDC
        <i className="ri-token-swap-fill text-3xl" />
      </h2>
      <p className="text-lg font-semibold text-primary">Exchange tokens for USDC.</p>
      <div className="mt-10 flex h-full w-full flex-grow flex-col gap-8">
        <div className="flex h-full w-full items-center justify-center rounded-3xl bg-gradient-to-bl from-fg/10 to-fg/25 text-lg font-semibold text-fg/70 opacity-70">
          Partner to be revealed
        </div>
        <div className="flex h-full w-full items-center justify-center rounded-3xl bg-gradient-to-bl from-fg/10 to-fg/25 text-lg font-semibold text-fg/70 opacity-70">
          Partner to be revealed
        </div>
        <div className="flex h-full w-full items-center justify-center rounded-3xl bg-gradient-to-bl from-fg/10 to-fg/25 text-lg font-semibold text-fg/70 opacity-70">
          Partner to be revealed
        </div>
      </div>
    </Card>
  );
};
