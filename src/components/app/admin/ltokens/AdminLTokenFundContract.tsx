import { AmountInput, Card, Input, TxButton } from "@/components/ui";
import { useLTokenDecimals, usePrepareLTokenFundContract } from "@/generated";
import { ChangeEvent, FC, useState } from "react";
import { AdminBrick } from "../AdminBrick";
import { LTokenId } from "../../../../../contracts/deployments";
import { useContractAddress } from "@/hooks/useContractAddress";
import { parseUnits } from "viem";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenId: LTokenId;
}

export const AdminLTokenFundContract: FC<Props> = ({ lTokenId }) => {
  const lTokenAddress = useContractAddress(lTokenId);
  const { data: lTokenDecimals } = useLTokenDecimals({
    address: lTokenAddress,
  });
  const [fundedAmount, setFundedAmount] = useState(0n);
  const preparation = usePrepareLTokenFundContract({ address: lTokenAddress, args: [fundedAmount] });

  return (
    <AdminBrick title="Fund contract">
      <p>
        This utility can only be called by the fund wallet and will safely transfer a given amount of{" "}
        {lTokenId.slice(1)} from fund to {lTokenId} contract.
      </p>
      <div className="flex justify-center items-end gap-3">
        <AmountInput
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFundedAmount(parseUnits(e.target.value, lTokenDecimals!))
          }
        />
        <TxButton preparation={preparation} size="medium">
          Fund
        </TxButton>
      </div>
    </AdminBrick>
  );
};
