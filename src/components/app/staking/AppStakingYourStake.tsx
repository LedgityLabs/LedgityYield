import { Amount, Card } from "@/components/ui";
import { useLtyDecimals, useLtyStakingStakeOf } from "@/generated";
import { useDApp } from "@/hooks";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { zeroAddress } from "viem";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}

export const AppStakingYourStake: FC<Props> = ({ className }) => {
  const { walletClient } = useDApp();
  const { data: stake } = useLtyStakingStakeOf({
    args: [walletClient ? walletClient.account.address : zeroAddress],
    watch: true,
  });
  const { data: ltyDecimals } = useLtyDecimals();

  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex flex-col justify-center items-center py-4 px-10", className)}
    >
      <h2 className="text-center text-lg font-medium text-indigo-900/80">Your stake</h2>
      <div className="h-full flex justify-center items-center text-6xl font-heavy font-heading">
        <Amount value={stake} decimals={ltyDecimals} suffix="LTY" displaySymbol={false} />
      </div>
    </Card>
  );
};
