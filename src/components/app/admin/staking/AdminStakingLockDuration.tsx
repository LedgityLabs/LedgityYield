import { Card, Input, TxButton } from "@/components/ui";
import { useLdyStakingStakeLockDuration, usePrepareLdyStakingSetStakeLockDuration } from "@/generated";
import { ChangeEvent, FC, useState } from "react";
import { AdminBrick } from "../AdminBrick";

const secondsPerDay = 60 * 60 * 24;

export const AdminStakingLockDuration: FC<React.ComponentPropsWithRef<typeof Card>> = () => {
  const { data: stakeLockDuration } = useLdyStakingStakeLockDuration({
    watch: true,
  });
  const [newStakeLockDuration, setNewStakeLockDuration] = useState(0);
  const preparation = usePrepareLdyStakingSetStakeLockDuration({ args: [newStakeLockDuration] });

  return (
    <AdminBrick title="Stake lock duration">
      <p>
        Current value: <span className="font-bold">{stakeLockDuration! / secondsPerDay} days</span>
      </p>
      <div className="flex justify-center items-end gap-3">
        <Input
          type="number"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewStakeLockDuration(Number.parseInt(e.target.value) * secondsPerDay)
          }
          placeholder="Duration (in days)"
          step={1}
        />
        <TxButton preparation={preparation} size="medium">
          Set
        </TxButton>
      </div>
    </AdminBrick>
  );
};
