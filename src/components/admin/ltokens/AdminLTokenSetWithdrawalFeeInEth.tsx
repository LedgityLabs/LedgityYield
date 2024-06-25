import { Card, Input, TxButton, Rate } from "@/components/ui";
import { useContractAddress } from "@/hooks/useContractAddress";
import { AdminBrick } from "../AdminBrick";
import { ChangeEvent, FC, useState } from "react";
import { UseSimulateContractReturnType } from "wagmi";
import {useSimulateLTokenSetWithdrwalFeeInEth, useReadLTokenWithdrwalFeeInEth } from "@/generated";


interface Props extends React.ComponentPropsWithRef<typeof Card> {
    lTokenSymbol: string;
}

export const AdminLTokenSetWithdrawalFeeInEth: FC<Props> = ({ className, lTokenSymbol }) => {
    const lTokenAddress = useContractAddress(lTokenSymbol);
    const [newFees, setNewFees] = useState(BigInt(0));
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [inWei, setInWei] = useState(0);
    const preparation = useSimulateLTokenSetWithdrwalFeeInEth({ address: lTokenAddress, args: [newFees] });
    const { data: withdrawalFeeInEth, queryKey } = useReadLTokenWithdrwalFeeInEth({
    address: lTokenAddress
  });


    return (
        <AdminBrick title="SetFees">
            <p>
                This updates the current fee rate of lToken withdrawals.
            </p>
            <div>
                <label>
                    Eth Converter:
                    <Input
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setInWei(Number(e.target.value));
                        }}
                        placeholder="In Eth">
                    </Input>

                </label>
                <label>
                    in Wei:
                    <div className="border rounded border-black bg-white-200 p-2">
                        {inWei * 10 ** 18}
                    </div>
                </label>

            </div>
            <div>
                <p>
        Current value: {withdrawalFeeInEth?.toString() || "loading"}
      </p>
                <label >
                    Set withdrawal fee in Eth:
                    <Input
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setNewFees(BigInt(e.target.value));
                            if (hasUserInteracted === false) setHasUserInteracted(true);
                            if (e.target.value === "") setHasUserInteracted(false);

                        }}
                        type="text"
                    />
                </label>

                <TxButton
                    preparation={
                        preparation as UseSimulateContractReturnType
                    }
                    size="medium">
                    SetFees
                </TxButton>
            </div>

        </AdminBrick>
    )
}