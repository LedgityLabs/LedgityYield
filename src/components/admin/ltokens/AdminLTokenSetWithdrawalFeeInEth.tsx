import { Card, Input, TxButton } from "@/components/ui";
import { useContractAddress } from "@/hooks/useContractAddress";
import { AdminBrick } from "../AdminBrick";
import { ChangeEvent, FC, useState } from "react";
import { UseSimulateContractReturnType } from "wagmi";
import { useSimulateLTokenSetWithdrwalFeeInEth, useReadLTokenWithdrwalFeeInEth } from "@/generated";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
    lTokenSymbol: string;
}

export const AdminLTokenSetWithdrawalFeeInEth: FC<Props> = ({ lTokenSymbol }) => {
    const lTokenAddress = useContractAddress(lTokenSymbol);
    const [newFees, setNewFees] = useState<bigint>(BigInt(0));
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');

    const preparation = useSimulateLTokenSetWithdrwalFeeInEth({ address: lTokenAddress, args: [newFees] });

    const { data: withdrawalFeeInEth } = useReadLTokenWithdrwalFeeInEth({
        address: lTokenAddress
    });

    function weiToEth(value: bigint): number {
        return Number(value) / 10 ** 18;
    }

    const ethToWei = (eth: number): bigint => {
        const converted = BigInt(Math.floor(eth * 10 ** 18));
        console.log(converted);
        return converted;
    }

    return (
        <AdminBrick title="SetFees">
            <p>
                This updates the current fee for lToken withdrawals in ETH.
            </p>
            <div>
                <p>
                    Current fee: {withdrawalFeeInEth
                        ? weiToEth(withdrawalFeeInEth).toFixed(4)
                        : "loading"} ETH
                </p>
                <label>
                    Set withdrawal fee in ETH:
                    <Input
                        type="number"
                        step="0.00001"
                        value={inputValue}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const ethValue = parseFloat(e.target.value);
                            setInputValue(e.target.value);
                            if (ethValue <= 0.02) { // Max 0.02 ETH (2% of 1 ETH)
                                const contractValue = ethToWei(ethValue);
                                setNewFees(contractValue);
                                if (hasUserInteracted === false) setHasUserInteracted(true);
                            } else {
                                alert("Value cannot exceed 0.02 ETH");
                            }
                        }}
                        placeholder="Enter ETH value"
                    />
                </label>
                <TxButton
                    preparation={
                        preparation as UseSimulateContractReturnType
                    }
                    size="medium"
                >
                    SetFees
                </TxButton>
            </div>
        </AdminBrick>
    )
}