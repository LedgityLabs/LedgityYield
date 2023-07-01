import { Card } from "@/components/ui";
import { useLtyStakingGetTierOf } from "@/generated";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { zeroAddress } from "viem";
import { useWalletClient } from "wagmi";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}

export const AppStakingTier: FC<Props> = ({ className }) => {
  const { data: walletClient } = useWalletClient();
  const { data: tier } = useLtyStakingGetTierOf({
    args: [walletClient ? walletClient.account.address : zeroAddress],
    watch: true,
  });

  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex flex-col justify-center items-center py-4 px-10", className)}
    >
      <h2 className="text-center text-lg font-medium text-indigo-900/80 whitespace-nowrap">
        Eligible to tier
      </h2>
      <div className="h-full flex justify-center items-center text-6xl font-heavy font-heading">
        {tier && tier > 0 ? tier.toString() : "N/A"}
      </div>
    </Card>
  );
};
