import { Amount, AmountInput, Card, TxButton } from "@/components/ui";
import {
  useLtyCap,
  useLtyDecimals,
  useLtyStakingGetTier,
  useLtyTotalSupply,
  usePrepareLtyStakingSetTier,
} from "@/generated";
import { ChangeEvent, FC, useState } from "react";
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
    <div className="py-6 flex flex-col gap-2">
      <h4 className="font-bold text-xl text-fg">Tier {tierId}</h4>
      <p>
        Current value:{" "}
        <Amount value={tierAmount} decimals={ltyDecimals} suffix="LTY" className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3">
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
export const AdminStaking: FC = () => {
  const tiersIds = [1, 2, 3];
  return (
    <section className="grid grid-cols-[repeat(3,1fr)] grid-flow-row w-[1200px] gap-10 pb-10">
      <Card circleIntensity={0.07} className="p-8">
        <h3 className="text-center font-bold text-2xl pb-4 font-heading text-fg/90">Tiers</h3>
        {tiersIds.map((tierId) => (
          <TierSetter key={tierId} tierId={tierId} />
        ))}
      </Card>
    </section>
  );
};
