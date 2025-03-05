import { getTypedContractAddress } from "@/functions/getContractAddress";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  useWritePreMiningRequestUnlock,
  ExecuteReturn,
  TransactionStatus,
} from "@/types";
import { Address, Hash } from "viem";

export type ParamsRequestUnlock = {
  msgValue: bigint | undefined;
};

type FormattedParams = {
  msgValue: bigint | undefined;
};

type Instance = {
  writeContract: ReturnType<
    typeof useWritePreMiningRequestUnlock
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsRequestUnlock): FormattedParams {
  return {
    msgValue: params.msgValue,
  };
}

function checkParams(params: ParamsRequestUnlock): string | undefined {
  const { msgValue } = formatParams(params);

  if (msgValue === undefined) {
    return "Invalid msgValue";
  }

  return;
}

function useMakeInstance(): Instance {
  const { appChainId } = useWeb3Context();
  const address = getTypedContractAddress("PreMining");

  if (!address)
    console.warn(
      `Contract address of ${"PreMining"} not found for chainId ${appChainId}`,
    );

  // Hook for transaction execution only
  const {
    data: hash,
    error,
    writeContractAsync,
    status,
  } = useWritePreMiningRequestUnlock();

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
  params: ParamsRequestUnlock,
): Promise<ExecuteReturn> {
  try {
    // Format parameters for execution
    const { msgValue } = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
      args: [],
      value: msgValue,
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

export const configRequestUnlock = {
  useMakeInstance,
  checkParams,
  execute,
};
