import { Card, TxButton } from "@/components/ui";
import { useSimulateLTokenSignalerSignalLToken } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { FC } from "react";
import { AdminBrick } from "../AdminBrick";
import { UseSimulateContractReturnType } from "wagmi";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenSignal: FC<Props> = ({ lTokenSymbol }) => {
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const preparation = useSimulateLTokenSignalerSignalLToken({
    args: [lTokenAddress!],
  });

  return (
    <AdminBrick title="Data indexing">
      <div className="flex justify-center items-center">
        <TxButton
          preparation={preparation as unknown as UseSimulateContractReturnType}
          size="medium"
        >
          Signal
        </TxButton>
      </div>
    </AdminBrick>
  );
};
