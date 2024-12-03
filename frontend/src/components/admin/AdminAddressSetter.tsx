import { Address, Input, TxButton } from "@/components/ui";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useEffect, useCallback, useState } from "react";
import {
  useBlockNumber,
  useReadContract,
  useSimulateContract,
  UseSimulateContractReturnType,
} from "wagmi";
import { zeroAddress, Abi } from "viem";
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
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const simulation = useSimulateContract({
    address: contractAddress,
    abi: contractAbi as Abi,
    functionName: setterFunctionName,
    args: [newAddress] as const,
    query: {
      enabled: Boolean(contractAddress && contractAbi && newAddress && newAddress !== zeroAddress),
    },
  });

  // Convert simulation to expected type
  const preparation = {
    ...simulation,
    data: simulation.data
      ? {
          ...simulation.data,
          request: {
            ...simulation.data.request,
            __mode: "prepared" as const,
          },
        }
      : undefined,
  } as UseSimulateContractReturnType;

  // Refresh data every 5 blocks
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const queryClient = useQueryClient();

  const handleRefreshData = useCallback(() => {
    if (queryKey) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [queryClient, queryKey]);

  useEffect(() => {
    if (blockNumber && blockNumber % 5n === 0n) {
      handleRefreshData();
    }
  }, [blockNumber, handleRefreshData]);

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewAddress(value);
    setHasUserInteracted(value !== "");
  };

  if (!contractAddress || !contractAbi) return null;

  return (
    <div className="flex flex-col gap-5">
      {displayName && <h4 className="text-lg font-semibold">{displayName}</h4>}
      <p>
        Current address: <Address address={currentAddress as `0x${string}`} copyable={true} />
      </p>
      <div className="flex justify-center items-end gap-3">
        <Input
          type="text"
          onChange={handleAddressChange}
          placeholder="Enter new address"
        />
        <TxButton
          size="medium"
          preparation={preparation}
          disabled={!newAddress || newAddress === zeroAddress}
          hasUserInteracted={hasUserInteracted}
        >
          {txButtonName}
        </TxButton>
      </div>
    </div>
  );
};