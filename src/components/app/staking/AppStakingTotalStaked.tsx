import { Amount, Card } from "@/components/ui";
import { useGenericErc20Decimals, useLdyStakingTotalStaked } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}

export const AppStakingTotalStaked: FC<Props> = ({ className }) => {
  const ldyAddress = useContractAddress("LDY");
  const { data: ldyDecimals } = useGenericErc20Decimals({
    address: ldyAddress,
  });
  const { data: totalStaked } = useLdyStakingTotalStaked({
    watch: true,
  });
  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex justify-center items-center p-4 pl-10", className)}
    >
      <div className="flex h-full flex-col justify-center items-center ">
        <h2 className="text-center text-lg font-medium text-indigo-900/80 whitespace-nowrap">
          Total staked
        </h2>
        <div className="h-full flex justify-center items-center text-5xl font-heavy font-heading">
          <Amount value={totalStaked} decimals={ldyDecimals} suffix="LDY" displaySymbol={false} />
        </div>
      </div>
      <div className="flex justify-center items-center w-full h-full ml-10 bg-primary/10 rounded-3xl text-center">
        Chart
        <br />
        (coming soon)
      </div>
    </Card>
  );
};
