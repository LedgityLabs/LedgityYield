import { Card, TxButton } from "@/components/ui";
import { useSimulateLTokenSignalerSignalLToken } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { FC, useMemo } from "react";
import { AdminBrick } from "../AdminBrick";
import { UseSimulateContractReturnType } from "wagmi";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenSignal: FC<Props> = ({ lTokenSymbol }) => {
  const lTokenAddress = useContractAddress(lTokenSymbol);

  // Get simulation result with proper options
  const simulationResult = useSimulateLTokenSignalerSignalLToken({
    args: [lTokenAddress!],
    query: {
      enabled: Boolean(lTokenAddress),
    },
  });

  // Create properly typed preparation object
  const preparation = useMemo(() => ({
    ...simulationResult,
    data: simulationResult.data
      ? {
          ...simulationResult.data,
          request: {
            ...simulationResult.data.request,
            __mode: "prepared" as const,
          },
        }
      : undefined,
  } as unknown as UseSimulateContractReturnType), [simulationResult]);

  if (!lTokenAddress) return null;

  return (
    <AdminBrick title="Data indexing">
      <div className="flex justify-center items-center">
        <TxButton
          preparation={preparation}
          size="medium"
          disabled={!lTokenAddress}
        >
          Signal
        </TxButton>
      </div>
    </AdminBrick>
  );
};