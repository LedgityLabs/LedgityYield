import { Card, Rate, TxButton } from "@/components/ui";
import { RateInput } from "@/components/ui/RateInput";
import { useLTokenGetApr, usePrepareLTokenSetApr } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useState } from "react";
import { parseUnits } from "viem";
import { AdminBrick } from "../AdminBrick";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenAPR: FC<Props> = ({ className, lTokenSymbol }) => {
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const { data: apr } = useLTokenGetApr({
    address: lTokenAddress,
    watch: true,
  });
  const [newApr, setNewApr] = useState(0);
  const preparation = usePrepareLTokenSetApr({ address: lTokenAddress, args: [newApr] });
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  return (
    <AdminBrick title="APR">
      <p>
        Current value: <Rate value={apr} className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3">
        <RateInput
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setNewApr(Number(parseUnits(e.target.value, 3)));
            if (hasUserInteracted === false) setHasUserInteracted(true);
            if (e.target.value === "") setHasUserInteracted(false);
          }}
        />
        <TxButton preparation={preparation} hasUserInteracted={hasUserInteracted} size="medium">
          Set
        </TxButton>
      </div>
    </AdminBrick>
  );
};
