import { Address, Input, TxButton } from "@/components/ui";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useState } from "react";
import { ContractId } from "../../../../hardhat/deployments";
import { useContractRead, usePrepareContractWrite } from "wagmi";
import { getContractABI } from "@/lib/getContractABI";
import { zeroAddress } from "viem";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  displayName?: string;
  contractName: ContractId;
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
  const contractABI = getContractABI(contractName);
  const { data: currentAddress } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: getterFunctionName,
    watch: true,
  });
  const [newAddress, setNewAddress] = useState<string>(zeroAddress);
  const preparation = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: setterFunctionName,
    args: [newAddress],
  });

  return (
    <div className="flex flex-col gap-5">
      {displayName && <h4 className="text-lg font-semibold">{displayName}</h4>}
      <p>
        Current address: <Address address={currentAddress as `0x${string}`} copyable={true} />
      </p>
      <div className="flex justify-center items-end gap-3">
        <Input
          type="text"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewAddress(e.target.value)}
        />
        {/* @ts-ignore */}
        <TxButton preparation={preparation} disabled={newAddress === zeroAddress} size="medium">
          {txButtonName}
        </TxButton>
      </div>
    </div>
  );
};
