import { Amount, Card } from "@/components/ui";
import { useGenericErc20Decimals, useLdyStakingStakeOf } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { zeroAddress } from "viem";
import { useWalletClient } from "wagmi";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}

export const AppStakingYourStake: FC<Props> = ({ className }) => {
  const { data: walletClient } = useWalletClient();
  const ldyAddress = useContractAddress("LDY");
  const { data: ldyDecimals } = useGenericErc20Decimals({
    address: ldyAddress,
  });
  const { data: stake } = useLdyStakingStakeOf({
    args: [walletClient ? walletClient.account.address : zeroAddress],
    watch: true,
  });

  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex flex-col justify-center items-center py-4 px-10", className)}
    >
      <h2 className="text-center text-lg font-medium text-indigo-900/80">Your stake</h2>
      <div className="h-full flex justify-center items-center text-6xl font-heavy font-heading">
        <Amount value={stake} decimals={ldyDecimals} suffix="LDY" displaySymbol={false} />
      </div>
    </Card>
  );
};
