import { Card, Rate, TxButton } from "@/components/ui";
import { RateInput } from "@/components/ui/RateInput";
import { useLtyStakingGetApr, usePrepareLtyStakingSetApr } from "@/generated";
import { ChangeEvent, FC, useState } from "react";
import { twMerge } from "tailwind-merge";
import { parseUnits } from "viem";

export const AdminStakingAPR: FC<React.ComponentPropsWithRef<typeof Card>> = ({ className }) => {
  const { data: apr } = useLtyStakingGetApr({
    watch: true,
  });
  const [newApr, setNewApr] = useState(0);
  const preparation = usePrepareLtyStakingSetApr({ args: [newApr] });

  return (
    <Card circleIntensity={0.07} className={twMerge("p-8", className)}>
      <h3 className="text-center font-bold text-2xl pb-4 font-heading text-fg/90">APR</h3>
      <p>
        Current value: <Rate value={apr} className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3">
        <RateInput
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewApr(Number(parseUnits(e.target.value, 3)))
          }
        />
        <TxButton preparation={preparation} size="medium">
          Set
        </TxButton>
      </div>
    </Card>
  );
};
