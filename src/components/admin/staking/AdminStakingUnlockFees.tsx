import { Card, Rate, TxButton } from "@/components/ui";
import { RateInput } from "@/components/ui/RateInput";
import {
  useWipLdyStakingUnlockFeesRateUd7x3,
  usePrepareWipLdyStakingSetUnlockFeesRate,
} from "@/generated";
import { ChangeEvent, FC, useState } from "react";
import { twMerge } from "tailwind-merge";
import { parseUnits } from "viem";
import { AdminBrick } from "../AdminBrick";

export const AdminStakingUnlockFeesRate: FC<React.ComponentPropsWithRef<typeof Card>> = ({
  className,
}) => {
  const { data: unlockFeesRate } = useWipLdyStakingUnlockFeesRateUd7x3({
    watch: true,
  });
  const [newUnlockFeesRate, setNewUnlockFeesRate] = useState(0);
  const preparation = usePrepareWipLdyStakingSetUnlockFeesRate({ args: [newUnlockFeesRate] });

  return (
    <AdminBrick title="Unlock fees rate">
      <p>
        This rate corresponds to the amount of staked $LDY to be burned when an account requests a
        premature unlock of its stake.
      </p>
      <p>
        Current value: <Rate value={unlockFeesRate} className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3">
        <RateInput
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewUnlockFeesRate(Number(parseUnits(e.target.value, 3)))
          }
        />
        <TxButton preparation={preparation} size="medium">
          Set
        </TxButton>
      </div>
    </AdminBrick>
  );
};
