import { AmountInput, Card, Amount, TxButton } from "@/components/ui";
import {
  useLtyDecimals,
  useLtyStakingRewardsOf,
  usePrepareLtyStakingClaim,
  usePrepareLtyStakingCompound,
} from "@/generated";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import { useWalletClient } from "wagmi";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}

export const AppStakingClaim: FC<Props> = ({ className }) => {
  const { data: walletClient } = useWalletClient();
  const { data: ltyDecimals } = useLtyDecimals();
  const { data: unclaimedRewards } = useLtyStakingRewardsOf({
    args: [walletClient ? walletClient.account.address : zeroAddress],
    watch: true,
  });
  // Note: As <Amount/> will render the unclaimed rewards with two decimals of precision
  // if they are <1, testing if rounded value is > 0 prevents display 0.00 of unclaimed
  // rewards to users.
  const hasUnclaimedRewards =
    unclaimedRewards && Math.round(Number(formatUnits(unclaimedRewards, ltyDecimals!)) * 100) / 100 > 0;
  const claimPreparation = usePrepareLtyStakingClaim();
  const compoundPreparation = usePrepareLtyStakingCompound();

  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex flex-col justify-between items-center p-7", className)}
    >
      <h2 className="font-heading text-2xl">Claim your rewards</h2>
      {(hasUnclaimedRewards && (
        <p>
          You&apos;ve{" "}
          <Amount className="font-bold" value={unclaimedRewards} decimals={ltyDecimals} suffix={"LTY"} />{" "}
          of unclaimed rewards.
        </p>
      )) || <p>No rewards yet.</p>}
      <div className="flex justify-center items-center gap-3">
        <TxButton
          preparation={claimPreparation}
          disabled={!hasUnclaimedRewards}
          transactionSummary={
            <p>
              Claiming your{" "}
              <Amount
                className="font-bold"
                value={unclaimedRewards}
                decimals={ltyDecimals}
                suffix={"LTY"}
              />{" "}
              of unclaimed rewards.
            </p>
          }
        >
          Claim
        </TxButton>
        <TxButton
          variant="outline"
          preparation={compoundPreparation}
          disabled={!hasUnclaimedRewards}
          transactionSummary={
            <p>
              Stake (compound) your{" "}
              <Amount
                className="font-bold"
                value={unclaimedRewards}
                decimals={ltyDecimals}
                suffix={"LTY"}
              />{" "}
              of unclaimed rewards.
            </p>
          }
        >
          Compound
        </TxButton>
      </div>
    </Card>
  );
};
