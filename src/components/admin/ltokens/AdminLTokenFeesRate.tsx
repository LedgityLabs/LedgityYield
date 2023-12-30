import { Card, Rate, TxButton } from "@/components/ui";
import { RateInput } from "@/components/ui/RateInput";
import { useLTokenFeesRateUd7x3, usePrepareLTokenSetFeesRate } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useState } from "react";
import { parseUnits } from "viem";
import { AdminBrick } from "../AdminBrick";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenFeesRate: FC<Props> = ({ className, lTokenSymbol }) => {
  const underlyingTokenName = lTokenSymbol.slice(1);
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const { data: feesRate } = useLTokenFeesRateUd7x3({
    address: lTokenAddress,
    watch: true,
  });
  const [newFeesRate, setNewFeesRate] = useState(0);
  const preparation = usePrepareLTokenSetFeesRate({
    address: lTokenAddress,
    args: [newFeesRate],
  });
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  return (
    <AdminBrick title="Fees rate">
      <p>
        This rate corresponds to the % of fees charged to eligible {underlyingTokenName} withdrawal
        requests.
      </p>
      <p>
        Current value: <Rate value={feesRate} className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3">
        <RateInput
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setNewFeesRate(Number(parseUnits(e.target.value, 3)));
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
