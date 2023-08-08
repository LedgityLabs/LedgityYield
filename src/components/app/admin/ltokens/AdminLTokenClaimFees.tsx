import { Amount, Card, TxButton } from "@/components/ui";
import { useLTokenUnclaimedFees, usePrepareLTokenClaimFees } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { FC } from "react";
import { AdminBrick } from "../AdminBrick";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenClaimFees: FC<Props> = ({ lTokenSymbol }) => {
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const { data: unclaimedFees } = useLTokenUnclaimedFees({
    address: lTokenAddress,
    watch: true,
  });
  const preparation = usePrepareLTokenClaimFees({ address: lTokenAddress });

  return (
    <AdminBrick title="Unclaimed fees">
      <p>
        Current amount: <Amount value={unclaimedFees} className="font-bold" suffix="LDY" />
      </p>
      <div className="flex justify-center items-end gap-3">
        <TxButton preparation={preparation} size="medium" disabled={unclaimedFees === 0n}>
          Claim
        </TxButton>
      </div>
    </AdminBrick>
  );
};
