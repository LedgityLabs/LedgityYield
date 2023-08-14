import { Card, TxButton } from "@/components/ui";
import {
  usePrepareLTokenProcessQueuedRequests,
  usePrepareLTokenSignalerSignalLToken,
} from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { FC } from "react";
import { AdminBrick } from "../AdminBrick";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenProcessRequests: FC<Props> = ({ lTokenSymbol }) => {
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const preparation = usePrepareLTokenProcessQueuedRequests({ address: lTokenAddress });

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
