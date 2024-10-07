import { Address, Input, TxButton } from "@/components/ui";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  UseSimulateContractReturnType,
  useBlockNumber,
  useReadContract,
  useSimulateContract,
} from "wagmi";
import { zeroAddress } from "viem";
import { useContractAbi } from "@/hooks/useContractAbi";
import { useQueryClient } from "@tanstack/react-query";

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
  const contractAbi = useContractAbi(contractName);
  const { data: currentAddress, queryKey } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: getterFunctionName,
  });
  const [newAddress, setNewAddress] = useState<string>(zeroAddress);
  const preparation = useSimulateContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: setterFunctionName,
    args: [newAddress],
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
    <div className="flex flex-col gap-5">
      {displayName && <h4 className="text-lg font-semibold">{displayName}</h4>}
      <p>
        Current address: <Address address={currentAddress as `0x${string}`} copyable={true} />
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
          preparation={preparation as UseSimulateContractReturnType}
          disabled={newAddress === zeroAddress}
          hasUserInteracted={hasUserInteracted}
        >
          {txButtonName}
        </TxButton>
      </div>
    </div>
  );
};
