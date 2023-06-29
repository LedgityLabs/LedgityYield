import { AmountInput, Card, Amount, TxButton } from "@/components/ui";
import { useLtyDecimals, useLtyStakingRewardsOf, usePrepareLtyStakingClaim } from "@/generated";
import { useDApp } from "@/hooks";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { zeroAddress } from "viem";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}

export const AppStakingClaim: FC<Props> = ({ className }) => {
  const { walletClient } = useDApp();
  const { data: ltyDecimals } = useLtyDecimals();
  const { data: unclaimedRewards } = useLtyStakingRewardsOf({
    args: [walletClient ? walletClient.account.address : zeroAddress],
    watch: true,
  });
  const preparation = usePrepareLtyStakingClaim();

  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex flex-col justify-between items-center p-7", className)}
    >
      <h2 className="font-heading text-2xl">Claim your rewards</h2>
      {(unclaimedRewards && unclaimedRewards > 0 && (
        <p>
          You&apos;ve{" "}
          <Amount className="font-bold" value={unclaimedRewards} decimals={ltyDecimals} suffix={"LTY"} />{" "}
          of unclaimed rewards.
        </p>
      )) || <p>No rewards yet.</p>}
      <div className="flex justify-center items-center gap-3">
        <TxButton
          preparation={preparation}
          disabled={!unclaimedRewards || unclaimedRewards === 0n ? true : false}
        >
          Claim
        </TxButton>
        <TxButton
          variant="outline"
          preparation={preparation}
          disabled={!unclaimedRewards || unclaimedRewards === 0n ? true : false}
        >
          Compound
        </TxButton>
      </div>
    </Card>
  );
};
