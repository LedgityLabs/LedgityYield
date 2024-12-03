import { AllowanceTxButton, Card, Input, TxButton } from "@/components/ui";
import {
  useReadLTokenUnderlying,
  useReadLTokenWithdrawalQueue,
  useSimulateLTokenProcessBigQueuedRequest,
} from "@/generated";
import { ChangeEvent, FC, useState } from "react";
import { AdminBrick } from "../AdminBrick";
import { useContractAddress } from "@/hooks/useContractAddress";
import { UseSimulateContractReturnType } from "wagmi";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenProcessBigQueued: FC<Props> = ({ lTokenSymbol }) => {
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const { data: underlyingAddress } = useReadLTokenUnderlying({ address: lTokenAddress! });
  const [requestId, setRequestId] = useState(0n);
  
  // Get simulation result
  const simulationResult = useSimulateLTokenProcessBigQueuedRequest({
    address: lTokenAddress,
    args: [requestId],
    query: {
      enabled: Boolean(lTokenAddress && requestId >= 0n),
    },
  });

  // Convert to expected type
  const preparation = {
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
  } as unknown as UseSimulateContractReturnType;

  const { data: requestData } = useReadLTokenWithdrawalQueue({
    address: lTokenAddress,
    args: [requestId],
  });
  const requestAmount = requestData ? requestData[1] : 0n;
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRequestId(value ? BigInt(value) : 0n);
    setHasUserInteracted(value !== "");
  };

  if (!lTokenAddress) return null;

  return (
    <AdminBrick title="Process big queued request">
      <p>
        This utility can only be called by the fund wallet and will process a given request using
        the fund&apos;s {lTokenSymbol.slice(1)} balance directly.
      </p>
      <div className="flex justify-center items-end gap-3">
        <Input
          type="number"
          onChange={handleInputChange}
          placeholder="Request ID"
          step={1}
          min={0}
        />
        <AllowanceTxButton
          preparation={preparation}
          hasUserInteracted={hasUserInteracted}
          token={underlyingAddress!}
          spender={lTokenAddress!}
          amount={requestAmount}
          size="medium"
          disabled={!requestId || requestId < 0n}
        >
          Process
        </AllowanceTxButton>
      </div>
    </AdminBrick>
  );
};