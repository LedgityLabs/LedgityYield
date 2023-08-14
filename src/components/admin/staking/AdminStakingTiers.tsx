import { Amount, AmountInput, Card, TxButton } from "@/components/ui";
import {
  useGenericErc20Decimals,
  useGenericErc20TotalSupply,
  useWipLdyStakingGetTier,
  usePrepareWipLdyStakingSetTier,
} from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useState } from "react";
import { twMerge } from "tailwind-merge";
import { parseUnits } from "viem";
import { AdminBrick } from "../AdminBrick";

const TierSetter: FC<{ tierId: number }> = ({ tierId }) => {
  const ldyAddress = useContractAddress("LDY");
  const { data: ldyDecimals } = useGenericErc20Decimals({
    address: ldyAddress,
  });
  const { data: ldySupply } = useGenericErc20TotalSupply({
    address: ldyAddress,
  });
  const { data: tierAmount } = useWipLdyStakingGetTier({
    args: [BigInt(tierId)],
    watch: true,
  });

  const [newTierAmount, setNewTierAmount] = useState(0n);
  const preparation = usePrepareWipLdyStakingSetTier({
    args: [BigInt(tierId), newTierAmount],
  });

  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-bold text-xl text-fg">Tier {tierId}</h4>
      <p>
        Current value:{" "}
        <Amount value={tierAmount} decimals={ldyDecimals} suffix="LDY" className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3 pt-3">
        <AmountInput
          maxName="Max"
          maxValue={ldySupply}
          decimals={ldyDecimals}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewTierAmount(parseUnits(e.target.value, ldyDecimals!))
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
    <AdminBrick title="Tiers">
      <div className="flex flex-col gap-16">
        {tiersIds.map((tierId) => (
          <TierSetter key={tierId} tierId={tierId} />
        ))}
      </div>
    </AdminBrick>
  );
};
