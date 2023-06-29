import { AllowanceTxButton, AmountInput, Card, TxButton } from "@/components/ui";
import {
  useLtyBalanceOf,
  useLtyDecimals,
  useLtyStakingRewardsOf,
  useLtyStakingStakeOf,
  usePrepareLtyStakingStake,
  usePrepareLtyStakingUnstake,
} from "@/generated";
import { useDApp } from "@/hooks";
import { useContractAddress } from "@/hooks/useContractAddress";
import { getContractAddress } from "@/lib/getContractAddress";
import { ChangeEvent, FC, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { parseUnits, zeroAddress } from "viem";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}

export const AppStakingStake: FC<Props> = ({ className }) => {
  const { walletClient } = useDApp();
  const ltyAddress = useContractAddress("LTY");
  const ltyStakingAddress = useContractAddress("LTYStaking");
  const { data: ltyDecimals } = useLtyDecimals();
  const { data: ltyBalance } = useLtyBalanceOf({
    args: [walletClient ? walletClient.account.address : zeroAddress],
    watch: true,
  });
  const { data: stakedAmount } = useLtyStakingStakeOf({
    args: [walletClient ? walletClient.account.address : zeroAddress],
    watch: true,
  });

  const [depositedAmount, setDepositedAmount] = useState(0n);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0n);
  const stakePreparation = usePrepareLtyStakingStake({ args: [depositedAmount] });
  const unstakePreparation = usePrepareLtyStakingUnstake({ args: [withdrawnAmount] });

  return (
    <Card circleIntensity={0.07} className={twMerge("flex flex-col items-center p-10", className)}>
      <h2 className="font-heading text-2xl">Stake</h2>
      <div className="h-full flex flex-col justify-around">
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
            token={ltyAddress}
            spender={ltyStakingAddress!}
            amount={depositedAmount}
            preparation={stakePreparation}
            size="medium"
          >
            Stake
          </AllowanceTxButton>
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
