import { Card, TxButton } from "@/components/ui";
import { usePrepareLTokenSignalerSignalLToken } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { FC } from "react";
import { LTokenId } from "../../../../../hardhat/deployments";
import { AdminBrick } from "../AdminBrick";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenId: LTokenId;
}

export const AdminLTokenSignal: FC<Props> = ({ lTokenId }) => {
  const lTokenAddress = useContractAddress(lTokenId);
  const preparation = usePrepareLTokenSignalerSignalLToken({ args: [lTokenAddress!] });

  return (
    <AdminBrick title="Data indexing">
      <div className="flex justify-center items-center">
        <TxButton preparation={preparation} size="medium">
          Signal
        </TxButton>
      </div>
    </AdminBrick>
  );
};
