import { Card } from "@/components/ui";
import Image from "next/image";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import bridgeIcon from "~/assets/icons/bridge.svg";

export const AppBridgeUSDC: FC = () => {
  return (
    <Card circleIntensity={0.07} className={twMerge("flex flex-col items-center px-4 pb-6 pt-10")}>
      <h2 className="inline-flex items-center justify-center gap-3 pb-4 text-center font-heading text-2xl font-bold text-fg/90">
        Bridge USDC
        <Image src={bridgeIcon} alt="Bridge Icon" height={23} className="opacity-90" />
      </h2>
      <p className="text-lg font-semibold text-primary">Transfer USDC to Linea chain.</p>
    </Card>
  );
};
