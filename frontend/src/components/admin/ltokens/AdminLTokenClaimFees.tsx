import { Amount, Card, TxButton } from "@/components/ui";
import {
  useReadLTokenDecimals,
  useReadLTokenUnclaimedFees,
  useSimulateLTokenClaimFees,
} from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { FC, useEffect } from "react";
import { AdminBrick } from "../AdminBrick";
import { UseSimulateContractReturnType, useBlockNumber } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenClaimFees: FC<Props> = ({ lTokenSymbol }) => {
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const { data: unclaimedFees, queryKey } = useReadLTokenUnclaimedFees({
    address: lTokenAddress,
  });
  const { data: decimals } = useReadLTokenDecimals({ address: lTokenAddress });
  const preparation = useSimulateLTokenClaimFees({ address: lTokenAddress });

  // Refresh some data every 5 blocks
  const queryKeys = [queryKey];
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const queryClient = useQueryClient();
  useEffect(() => {
    if (blockNumber && blockNumber % 5n === 0n)
      queryKeys.forEach((k) => queryClient.invalidateQueries({ queryKey: k }));
  }, [blockNumber, ...queryKeys]);

  return (
    <AdminBrick title="Unclaimed fees">
      <p>
        Current amount:{" "}
        <Amount
          value={unclaimedFees}
          className="font-bold"
          suffix={lTokenSymbol}
          decimals={decimals}
        />
      </p>
      <div className="flex justify-center items-end gap-3">
        <TxButton
          preparation={preparation as UseSimulateContractReturnType}
          size="medium"
          disabled={unclaimedFees === 0n}
        >
          Claim
        </TxButton>
      </div>
    </AdminBrick>
  );
};
