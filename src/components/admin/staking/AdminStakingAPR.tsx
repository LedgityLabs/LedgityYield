import { Card, Rate, TxButton } from "@/components/ui";
import { RateInput } from "@/components/ui/RateInput";
import { useWipLdyStakingGetApr, usePrepareWipLdyStakingSetApr } from "@/generated";
import { ChangeEvent, FC, useState } from "react";
import { twMerge } from "tailwind-merge";
import { parseUnits } from "viem";
import { AdminBrick } from "../AdminBrick";

export const AdminStakingAPR: FC<React.ComponentPropsWithRef<typeof Card>> = ({ className }) => {
  const { data: apr } = useWipLdyStakingGetApr({
    watch: true,
  });
  const [newApr, setNewApr] = useState(0);
  const preparation = usePrepareWipLdyStakingSetApr({ args: [newApr] });

  return (
    <AdminBrick title="APR">
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
    </AdminBrick>
  );
};
