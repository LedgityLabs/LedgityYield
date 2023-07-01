import { Amount, AmountInput, Card, TxButton } from "@/components/ui";
import {
  useLtyCap,
  useLtyDecimals,
  useLtyStakingGetTier,
  useLtyTotalSupply,
  usePrepareLtyStakingSetTier,
} from "@/generated";
import { ChangeEvent, FC, useState } from "react";
import { twMerge } from "tailwind-merge";
import { parseUnits } from "viem";

const TierSetter: FC<{ tierId: number }> = ({ tierId }) => {
  const { data: ltyDecimals } = useLtyDecimals();
  const { data: ltyCap } = useLtyCap();
  const { data: tierAmount } = useLtyStakingGetTier({
    args: [BigInt(tierId)],
    watch: true,
  });

  const [newTierAmount, setNewTierAmount] = useState(0n);
  const preparation = usePrepareLtyStakingSetTier({
    args: [BigInt(tierId), newTierAmount],
  });

  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-bold text-xl text-fg">Tier {tierId}</h4>
      <p>
        Current value:{" "}
        <Amount value={tierAmount} decimals={ltyDecimals} suffix="LTY" className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3 pt-3">
        <AmountInput
          maxName="Max"
          maxValue={ltyCap}
          decimals={ltyDecimals}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewTierAmount(parseUnits(e.target.value, ltyDecimals!))
          }
        />
        <TxButton size="medium" preparation={preparation}>
          Set
        </TxButton>
      </div>
    </div>
  );
};

export const AdminStakingTiers: FC<React.ComponentPropsWithRef<typeof Card>> = ({ className }) => {
  const tiersIds = [1, 2, 3];

  return (
    <Card circleIntensity={0.07} className={twMerge("p-8", className)}>
      <h3 className="text-center font-bold text-2xl pb-4 font-heading text-fg/90">Tiers</h3>
      <div className="flex flex-col gap-16 pt-6">
        {tiersIds.map((tierId) => (
          <TierSetter key={tierId} tierId={tierId} />
        ))}
      </div>
    </Card>
  );
};
