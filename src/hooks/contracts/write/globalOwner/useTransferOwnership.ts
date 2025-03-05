import { getTypedContractAddress } from "@/functions/getContractAddress";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  useWriteGlobalOwnerTransferOwnership,
  ExecuteReturn,
  TransactionStatus,
} from "@/types";
import { Address, Hash } from "viem";

export type ParamsTransferOwnership = {
  newOwner: Address;
};

type FormattedParams = {
  newOwner: Address;
};

type Instance = {
  writeContract: ReturnType<
    typeof useWriteGlobalOwnerTransferOwnership
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsTransferOwnership): FormattedParams {
  return {
    newOwner: params.newOwner,
  };
}

function checkParams(params: ParamsTransferOwnership): string | undefined {
  const {} = formatParams(params);

  return;
}

function useMakeInstance(): Instance {
  const { appChainId } = useWeb3Context();
  const address = getTypedContractAddress("GlobalOwner");

  if (!address)
    console.warn(
      `Contract address of ${"GlobalOwner"} not found for chainId ${appChainId}`,
    );

  // Hook for transaction execution only
  const {
    data: hash,
    error,
    writeContractAsync,
    status,
  } = useWriteGlobalOwnerTransferOwnership();

  return {
    writeContract: writeContractAsync,
    hash,
    error,
    chainId: appChainId,
    address,
    status,
  };
}

async function execute(
  instance: Instance,
  params: ParamsTransferOwnership,
): Promise<ExecuteReturn> {
  try {
    // Format parameters for execution
    const { newOwner } = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
      args: [newOwner],
    });

    return {
      hash, // returns the hash
      status: instance.status,
    };
  } catch (err: any) {
    return {
      status: "error",
      error: err.message || "Operation failed",
    };
  }
}

export const configTransferOwnership = {
  useMakeInstance,
  checkParams,
  execute,
};
