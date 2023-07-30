import { AllowanceTxButton, AmountInput, Card, DateTime, Rate, TxButton } from "@/components/ui";
import {
  useGenericErc20BalanceOf,
  useGenericErc20Decimals,
  useLdyStakingGetNewLockEndFor,
  useLdyStakingLockEndOf,
  useLdyStakingStakeOf,
  useLdyStakingUnlockFeesRateUd3,
  usePrepareLdyStakingStake,
  usePrepareLdyStakingUnlock,
  usePrepareLdyStakingUnstake,
} from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import Link from "next/link";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import { useWalletClient } from "wagmi";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}

const secondsPerDay = 24 * 60 * 60;

export const AppStakingStake: FC<Props> = ({ className }) => {
  const { data: walletClient } = useWalletClient();
  const ldyAddress = useContractAddress("LDY");
  const ldyStakingAddress = useContractAddress("LDYStaking");
  const { data: ldyDecimals } = useGenericErc20Decimals({
    address: ldyAddress,
  });
  const { data: ldyBalance } = useGenericErc20BalanceOf({
    address: ldyAddress,
    args: [walletClient ? walletClient.account.address : zeroAddress],
    watch: true,
  });
  const { data: stakedAmount } = useLdyStakingStakeOf({
    args: [walletClient ? walletClient.account.address : zeroAddress],
    watch: true,
  });
  const { data: lockEnd } = useLdyStakingLockEndOf({
    args: [walletClient ? walletClient.account.address : zeroAddress],
    watch: true,
  });

  const [depositedAmount, setDepositedAmount] = useState(0n);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0n);
  const { data: newLockEnd } = useLdyStakingGetNewLockEndFor({
    args: [walletClient ? walletClient.account.address : zeroAddress, depositedAmount],
  });
  const { data: unlockFees } = useLdyStakingUnlockFeesRateUd3();

  const stakePreparation = usePrepareLdyStakingStake({ args: [depositedAmount] });
  const unstakePreparation = usePrepareLdyStakingUnstake({ args: [withdrawnAmount] });
  const unlockNowPreparation = usePrepareLdyStakingUnlock();

  useEffect(() => {
    stakePreparation.refetch();
    unstakePreparation.refetch();
    unlockNowPreparation.refetch();
  }, [stakedAmount, lockEnd]);

  const lockEndDays = lockEnd
    ? ((lockEnd * 1000 - Date.now()) / (1000 * secondsPerDay)).toFixed(0)
    : "0";
  const lockDurationIncrease = newLockEnd && lockEnd ? newLockEnd - lockEnd : 0;
  const lockDurationDaysIncrease = lockDurationIncrease
    ? (lockDurationIncrease / secondsPerDay).toFixed(1)
    : "0.0";

  return (
    <Card circleIntensity={0.07} className={twMerge("flex flex-col items-center p-10", className)}>
      <h2 className="font-heading text-2xl">Stake</h2>
      <div className="h-full flex flex-col justify-around">
        <div className="flex flex-col gap-3">
          <div className="flex items-end gap-3">
            <AmountInput
              maxValue={ldyBalance}
              decimals={ldyDecimals}
              symbol="LDY"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDepositedAmount(parseUnits(e.target.value, ldyDecimals!))
              }
            />
            <AllowanceTxButton
              token={ldyAddress!}
              spender={ldyStakingAddress!}
              amount={depositedAmount}
              preparation={stakePreparation}
              size="medium"
            >
              Stake
            </AllowanceTxButton>
          </div>
          {stakedAmount && depositedAmount > 0n && !["0.0", "NaN"].includes(lockDurationDaysIncrease) ? (
            <p>
              Increasing your stake by {formatUnits(depositedAmount, ldyDecimals!)} LDY will increase
              your lock period by <span className="font-semibold">{lockDurationDaysIncrease} days</span>.
              Your can <Link href="/">learn more</Link> about lock period increase calculation.
            </p>
          ) : (
            <p></p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-end gap-3">
            <AmountInput
              maxName="Staked"
              maxValue={stakedAmount}
              decimals={ldyDecimals}
              symbol="LDY"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setWithdrawnAmount(parseUnits(e.target.value, ldyDecimals!))
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
          {(lockEnd && lockEnd * 1000 > Date.now() && (
            <p>
              Your stake is locked until{" "}
              <DateTime className="font-semibold" timestamp={lockEnd * 1000} output="date" /> (in{" "}
              <span className="font-semibold">{lockEndDays} days</span>)
              <br />
              <span className="pt-4 inline-flex flex-col justify-center items-center gap-3">
                <span className="text-center">
                  But you can prematurely unlock it by burning <Rate value={unlockFees} /> of your stake.
                </span>
                <TxButton preparation={unlockNowPreparation} className="inline" size="tiny">
                  Unlock now
                </TxButton>
              </span>
            </p>
          )) ||
            ""}
        </div>
      </div>
    </Card>
  );
};
