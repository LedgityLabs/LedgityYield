import { Card, Rate, TxButton } from "@/components/ui";
import { RateInput } from "@/components/ui/RateInput";
import { useLTokenRetentionRateUd7x3, usePrepareLTokenSetRetentionRate } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useState } from "react";
import { parseUnits } from "viem";
import { AdminBrick } from "../AdminBrick";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenRetentionRate: FC<Props> = ({ className, lTokenSymbol }) => {
  const underlyingTokenName = lTokenSymbol.slice(1);
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const { data: retentionRate } = useLTokenRetentionRateUd7x3({
    address: lTokenAddress,
    watch: true,
  });
  const [newRetentionRate, setNewRetentionRate] = useState(0);
  const preparation = usePrepareLTokenSetRetentionRate({
    address: lTokenAddress,
    args: [newRetentionRate],
  });
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  return (
    <AdminBrick title="Retention rate">
      <p>
        This rate corresponds to the target and maximal amount of {underlyingTokenName} to retain on
        the contract.
      </p>
      <p>
        Current value: <Rate value={retentionRate} className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3">
        <RateInput
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setNewRetentionRate(Number(parseUnits(e.target.value, 3)));
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
