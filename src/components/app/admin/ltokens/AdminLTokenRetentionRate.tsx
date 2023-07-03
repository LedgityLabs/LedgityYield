import { Card, Rate, TxButton } from "@/components/ui";
import { RateInput } from "@/components/ui/RateInput";
import { useLTokenRetentionRateUd3, usePrepareLTokenSetRetentionRate } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useState } from "react";
import { twMerge } from "tailwind-merge";
import { parseUnits } from "viem";
import { LTokenId } from "../../../../../hardhat/deployments";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenId: LTokenId;
}

export const AdminLTokenRetentionRate: FC<Props> = ({ className, lTokenId }) => {
  const underlyingTokenName = lTokenId.slice(1);
  const lTokenAddress = useContractAddress(lTokenId);
  const { data: retentionRate } = useLTokenRetentionRateUd3({
    address: lTokenAddress,
    watch: true,
  });
  const [newRetentionRate, setNewRetentionRate] = useState(0);
  const preparation = usePrepareLTokenSetRetentionRate({
    address: lTokenAddress,
    args: [newRetentionRate],
  });

  return (
    <Card circleIntensity={0.07} className={twMerge("p-8 h-min flex flex-col gap-5", className)}>
      <h3 className="text-center font-bold text-2xl pb-4 font-heading text-fg/90">Retention rate</h3>
      <p>
        This rate corresponds to the target and maximal amount of {underlyingTokenName} to retain on the
        contract.
      </p>
      <p>
        Current value: <Rate value={retentionRate} className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3">
        <RateInput
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewRetentionRate(Number(parseUnits(e.target.value, 3)))
          }
        />
        <TxButton preparation={preparation} size="medium">
          Set
        </TxButton>
      </div>
    </Card>
  );
};
