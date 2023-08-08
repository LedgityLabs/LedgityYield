import { AmountInput, Card, Input, TxButton } from "@/components/ui";
import { useLTokenDecimals, usePrepareLTokenRepatriate } from "@/generated";
import { ChangeEvent, FC, useState } from "react";
import { AdminBrick } from "../AdminBrick";
import { useContractAddress } from "@/hooks/useContractAddress";
import { parseUnits } from "viem";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenRepatriate: FC<Props> = ({ lTokenSymbol }) => {
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const { data: lTokenDecimals } = useLTokenDecimals({
    address: lTokenAddress,
  });
  const [repatriatedAmount, setRepatriatedAmount] = useState(0n);
  const preparation = usePrepareLTokenRepatriate({
    address: lTokenAddress,
    args: [repatriatedAmount],
  });

  return (
    <AdminBrick title="Fund contract">
      <p>
        This utility can only be called by the fund wallet and will safely transfer a given amount
        of {lTokenSymbol.slice(1)} from fund to {lTokenSymbol} contract.
      </p>
      <div className="flex justify-center items-end gap-3">
        <AmountInput
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRepatriatedAmount(parseUnits(e.target.value, lTokenDecimals!))
          }
        />
        <TxButton preparation={preparation} size="medium">
          Fund
        </TxButton>
      </div>
    </AdminBrick>
  );
};
