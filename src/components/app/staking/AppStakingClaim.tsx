import { Card, Amount, TxButton } from "@/components/ui";
import {
  useGenericErc20Decimals,
  useLdyStakingRewardsOf,
  usePrepareLdyStakingClaim,
  usePrepareLdyStakingCompound,
} from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { formatUnits, zeroAddress } from "viem";
import { useWalletClient } from "wagmi";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}

export const AppStakingClaim: FC<Props> = ({ className }) => {
  const { data: walletClient } = useWalletClient();
  const ldyAddress = useContractAddress("LDY");
  const { data: ldyDecimals } = useGenericErc20Decimals({
    address: ldyAddress,
  });
  const { data: unclaimedRewards } = useLdyStakingRewardsOf({
    args: [walletClient ? walletClient.account.address : zeroAddress],
    watch: true,
  });
  // Note: As <Amount/> will render the unclaimed rewards with two decimals of precision
  // if they are <1, testing if rounded value is > 0 prevents display 0.00 of unclaimed
  // rewards to users.
  const hasUnclaimedRewards =
    unclaimedRewards && Math.round(Number(formatUnits(unclaimedRewards, ldyDecimals!)) * 100) / 100 > 0;
  const claimPreparation = usePrepareLdyStakingClaim();
  const compoundPreparation = usePrepareLdyStakingCompound();

  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex flex-col justify-between items-center p-7", className)}
    >
      <h2 className="font-heading text-2xl">Claim your rewards</h2>
      {(hasUnclaimedRewards && (
        <p>
          You&apos;ve{" "}
          <Amount className="font-bold" value={unclaimedRewards} decimals={ldyDecimals} suffix={"LDY"} />{" "}
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
                decimals={ldyDecimals}
                suffix={"LDY"}
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
                decimals={ldyDecimals}
                suffix={"LDY"}
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
