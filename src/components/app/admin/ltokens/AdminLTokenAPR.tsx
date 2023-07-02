import { Card, Rate, TxButton } from "@/components/ui";
import { RateInput } from "@/components/ui/RateInput";
import { useLTokenGetApr, usePrepareLTokenSetApr } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useState } from "react";
import { twMerge } from "tailwind-merge";
import { parseUnits } from "viem";
import { LTokenId } from "../../../../../hardhat/deployments";

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
    <Card circleIntensity={0.07} className={twMerge("p-8 h-min", className)}>
      <h3 className="text-center font-bold text-2xl pb-8 font-heading text-fg/90">APR</h3>
      <p>
        Current value: <Rate value={apr} className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3 mt-4">
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
