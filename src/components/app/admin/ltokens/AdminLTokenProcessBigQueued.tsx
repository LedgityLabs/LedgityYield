import { Card, Input, TxButton } from "@/components/ui";
import { usePrepareLTokenProcessBigQueuedRequest } from "@/generated";
import { ChangeEvent, FC, useState } from "react";
import { AdminBrick } from "../AdminBrick";
import { useContractAddress } from "@/hooks/useContractAddress";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenProcessBigQueued: FC<Props> = ({ lTokenSymbol }) => {
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const [requestId, setRequestId] = useState(0n);
  const preparation = usePrepareLTokenProcessBigQueuedRequest({
    address: lTokenAddress,
    args: [requestId],
  });
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  return (
    <AdminBrick title="Process big queued request">
      <p>
        This utility can only be called by the fund wallet and will process a given request using
        the fund&apos;s {lTokenSymbol.slice(1)} balance directly.
      </p>
      <div className="flex justify-center items-end gap-3">
        <Input
          type="number"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setRequestId(BigInt(e.target.value));
            if (hasUserInteracted === false) setHasUserInteracted(true);
            if (e.target.value === "") setHasUserInteracted(false);
          }}
          placeholder="Request ID"
          step={1}
        />
        <TxButton preparation={preparation} hasUserInteracted={hasUserInteracted} size="medium">
          Process
        </TxButton>
      </div>
    </AdminBrick>
  );
};
