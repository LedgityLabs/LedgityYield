import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { ADDRESSES, ContractName } from "@/data/addresses";

// @bw @dev temporary solution before replacing all old hooks
export function getTypedContractAddress(
  contractName: ContractName,
): `0x${string}` | undefined {
  const { appChainId } = useWeb3Context();

  return (ADDRESSES as any)[appChainId]?.[contractName as string];
}

export function getContractAddress(
  contractName: string,
): `0x${string}` | undefined {
  const { appChainId } = useWeb3Context();

  return (ADDRESSES as any)[appChainId]?.[contractName as string];
}
