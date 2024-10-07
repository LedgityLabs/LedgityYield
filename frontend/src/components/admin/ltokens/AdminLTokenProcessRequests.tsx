import { Card, TxButton } from "@/components/ui";
import { useSimulateLTokenProcessQueuedRequests } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { FC } from "react";
import { AdminBrick } from "../AdminBrick";
import { UseSimulateContractReturnType } from "wagmi";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenProcessRequests: FC<Props> = ({ lTokenSymbol }) => {
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const preparation = useSimulateLTokenProcessQueuedRequests({ address: lTokenAddress }) as UseSimulateContractReturnType;

  return (
    <AdminBrick title="Process withdrawal requests">
      <div className="flex justify-center items-center">
        <TxButton preparation={preparation} size="medium">
          Process
        </TxButton>
      </div>
    </AdminBrick>
  );
};