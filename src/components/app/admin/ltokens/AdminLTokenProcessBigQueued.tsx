import { Card, Input, TxButton } from "@/components/ui";
import {
  useLtyStakingStakeLockDuration,
  usePrepareLTokenBigQueuedWithdraw,
  usePrepareLtyStakingSetStakeLockDuration,
} from "@/generated";
import { ChangeEvent, FC, useState } from "react";
import { AdminBrick } from "../AdminBrick";
import { LTokenId } from "../../../../../contracts/deployments";
import { useContractAddress } from "@/hooks/useContractAddress";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenId: LTokenId;
}

export const AdminLTokenProcessBigQueued: FC<Props> = ({ lTokenId }) => {
  const lTokenAddress = useContractAddress(lTokenId);
  const [requestId, setRequestId] = useState(0n);
  const preparation = usePrepareLTokenBigQueuedWithdraw({ address: lTokenAddress, args: [requestId] });

  return (
    <AdminBrick title="Process big queued request">
      <p>
        This utility can only be called by the fund wallet and will process a given request using the
        fund&apos;s {lTokenId.slice(1)} balance directly.
      </p>
      <div className="flex justify-center items-end gap-3">
        <Input
          type="number"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setRequestId(BigInt(e.target.value))}
          placeholder="Request ID"
          step={1}
        />
        <TxButton preparation={preparation} size="medium">
          Process
        </TxButton>
      </div>
    </AdminBrick>
  );
};
