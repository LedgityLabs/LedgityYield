import { AllowanceTxButton, AmountInput, Card, TxButton } from "@/components/ui";
import {
  useGenericErc20BalanceOf,
  useGenericErc20Decimals,
  useLtyStakingGetLockEndIncrease,
  useLtyStakingStakeOf,
  usePrepareLtyStakingStake,
  usePrepareLtyStakingUnstake,
} from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import Link from "next/link";
import { ChangeEvent, FC, useState } from "react";
import { twMerge } from "tailwind-merge";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import { useWalletClient } from "wagmi";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}

const secondsPerDay = 24 * 60 * 60;

export const AppStakingStake: FC<Props> = ({ className }) => {
  const { data: walletClient } = useWalletClient();
  const ltyAddress = useContractAddress("LTY");
  const ltyStakingAddress = useContractAddress("LTYStaking");
  const { data: ltyDecimals } = useGenericErc20Decimals({
    address: ltyAddress,
  });
  const { data: ltyBalance } = useGenericErc20BalanceOf({
    address: ltyAddress,
    args: [walletClient ? walletClient.account.address : zeroAddress],
    watch: true,
  });
  const { data: stakedAmount } = useLtyStakingStakeOf({
    args: [walletClient ? walletClient.account.address : zeroAddress],
    watch: true,
  });

  const [depositedAmount, setDepositedAmount] = useState(0n);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0n);
  const { data: lockPeriodIncrease } = useLtyStakingGetLockEndIncrease({
    args: [walletClient ? walletClient.account.address : zeroAddress, depositedAmount],
  });
  const stakePreparation = usePrepareLtyStakingStake({ args: [depositedAmount] });
  const unstakePreparation = usePrepareLtyStakingUnstake({ args: [withdrawnAmount] });
  const lockPeriodDaysIncrease = lockPeriodIncrease
    ? (lockPeriodIncrease / secondsPerDay).toFixed(1)
    : "0.0";

  return (
    <Card circleIntensity={0.07} className={twMerge("flex flex-col items-center p-10", className)}>
      <h2 className="font-heading text-2xl">Stake</h2>
      <div className="h-full flex flex-col justify-around">
        <div className="flex flex-col gap-3">
          <div className="flex items-end gap-3">
            <AmountInput
              maxValue={ltyBalance}
              decimals={ltyDecimals}
              symbol="LTY"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDepositedAmount(parseUnits(e.target.value, ltyDecimals!))
              }
            />
            <AllowanceTxButton
              token={ltyAddress!}
              spender={ltyStakingAddress!}
              amount={depositedAmount}
              preparation={stakePreparation}
              size="medium"
            >
              Stake
            </AllowanceTxButton>
          </div>
          {stakedAmount && depositedAmount > 0n && !["0.0", "NaN"].includes(lockPeriodDaysIncrease) ? (
            <p>
              Increasing your stake by {formatUnits(depositedAmount, ltyDecimals!)} LTY will increase
              your lock period by <span className="font-semibold">{lockPeriodDaysIncrease} days</span>.
              Your can <Link href="/">learn more</Link> about lock period increase calculation.
            </p>
          ) : (
            <p></p>
          )}
        </div>
        <div className="flex items-end gap-3">
          <AmountInput
            maxName="Staked"
            maxValue={stakedAmount}
            decimals={ltyDecimals}
            symbol="LTY"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setWithdrawnAmount(parseUnits(e.target.value, ltyDecimals!))
            }
          />
          <TxButton
            preparation={unstakePreparation}
            disabled={!withdrawnAmount || withdrawnAmount == 0n}
            variant="outline"
            size="medium"
          >
            Unstake
          </TxButton>
        </div>
      </div>
    </Card>
  );
};
