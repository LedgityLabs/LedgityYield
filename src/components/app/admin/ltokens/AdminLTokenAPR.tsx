import { Card, Rate, TxButton } from "@/components/ui";
import { RateInput } from "@/components/ui/RateInput";
import { useLTokenGetApr, usePrepareLTokenSetApr } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useState } from "react";
import { twMerge } from "tailwind-merge";
import { parseUnits } from "viem";
import { LTokenId } from "../../../../../hardhat/deployments";
import { AdminBrick } from "../AdminBrick";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenId: LTokenId;
}

export const AdminLTokenAPR: FC<Props> = ({ className, lTokenId }) => {
  const lTokenAddress = useContractAddress(lTokenId);
  const { data: apr } = useLTokenGetApr({
    address: lTokenAddress,
    watch: true,
  });
  const [newApr, setNewApr] = useState(0);
  const preparation = usePrepareLTokenSetApr({ address: lTokenAddress, args: [newApr] });

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
