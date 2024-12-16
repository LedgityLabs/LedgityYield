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
  const preparation = useSimulateLTokenProcessQueuedRequests({
    address: lTokenAddress,
  });

  return (
    <AdminBrick title="Process withdrawal requests">
      <div className="flex justify-center items-center">
        <TxButton
          preparation={preparation as UseSimulateContractReturnType}
          size="medium"
        >
          Process
        </TxButton>
      </div>
    </AdminBrick>
  );
};
