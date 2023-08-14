import { Address, Input, TxButton } from "@/components/ui";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useState } from "react";
import { useContractRead, usePrepareContractWrite } from "wagmi";
import { getContractABI } from "@/lib/getContractABI";
import { zeroAddress } from "viem";
import { useContractABI } from "@/hooks/useContractABI";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  displayName?: string;
  contractName: string;
  getterFunctionName: string;
  setterFunctionName: string;
  txButtonName?: string;
}

export const AdminAddressSetter: FC<Props> = ({
  displayName = null,
  contractName,
  getterFunctionName,
  setterFunctionName,
  txButtonName = "Set",
}) => {
  const contractAddress = useContractAddress(contractName);
  const contractABI = useContractABI(contractName);
  const { data: currentAddress } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: getterFunctionName,
    watch: true,
  }) as { data: `0x${string}` | undefined };
  const [newAddress, setNewAddress] = useState<string>(zeroAddress);
  const preparation = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: setterFunctionName,
    args: [newAddress],
  });
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {displayName && <h4 className="text-lg font-semibold">{displayName}</h4>}
      <p>
        Current address: <Address address={currentAddress} copyable={true} />
      </p>
      <div className="flex justify-center items-end gap-3">
        <Input
          type="text"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setNewAddress(e.target.value);
            if (hasUserInteracted === false) setHasUserInteracted(true);
            if (e.target.value === "") setHasUserInteracted(false);
          }}
        />
        <TxButton
          size="medium"
          // @ts-ignore
          preparation={preparation}
          disabled={newAddress === zeroAddress}
          hasUserInteracted={hasUserInteracted}
        >
          {txButtonName}
        </TxButton>
      </div>
    </div>
  );
};
