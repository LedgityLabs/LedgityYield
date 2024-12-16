import { Card, Rate, TxButton } from "@/components/ui";
import { RateInput } from "@/components/ui/RateInput";
import { useReadLTokenGetApr, useSimulateLTokenSetApr } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { parseUnits } from "viem";
import { AdminBrick } from "../AdminBrick";
import { UseSimulateContractReturnType, useBlockNumber } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenAPR: FC<Props> = ({ className, lTokenSymbol }) => {
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const { data: apr, queryKey } = useReadLTokenGetApr({
    address: lTokenAddress,
  });
  const [newApr, setNewApr] = useState(0);
  const preparation = useSimulateLTokenSetApr({
    address: lTokenAddress,
    args: [newApr],
  });
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Refresh some data every 5 blocks
  const queryKeys = [queryKey];
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const queryClient = useQueryClient();
  useEffect(() => {
    if (blockNumber && blockNumber % 5n === 0n)
      queryKeys.forEach((k) => queryClient.invalidateQueries({ queryKey: k }));
  }, [blockNumber, ...queryKeys]);

  return (
    <AdminBrick title="APR">
      <p>
        Current value: <Rate value={apr} className="font-bold" />
      </p>
      <div className="flex justify-center items-end gap-3">
        <RateInput
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setNewApr(Number(parseUnits(e.target.value, 3)));
            if (hasUserInteracted === false) setHasUserInteracted(true);
            if (e.target.value === "") setHasUserInteracted(false);
          }}
        />
        <TxButton
          preparation={preparation as UseSimulateContractReturnType}
          hasUserInteracted={hasUserInteracted}
          size="medium"
        >
          Set
        </TxButton>
      </div>
    </AdminBrick>
  );
};
