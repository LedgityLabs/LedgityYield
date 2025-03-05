import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  ExecuteReturn,
  TransactionStatus,
  useWriteLTokenProcessBigQueuedRequest,
} from "@/types";
import { Address, Hash } from "viem";

export type ParamsProcessBigQueuedRequest = {
  requestId: bigint;
};

type FormattedParams = {
  requestId: bigint;
};

type Instance = {
  writeContract: ReturnType<
    typeof useWriteLTokenProcessBigQueuedRequest
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsProcessBigQueuedRequest): FormattedParams {
  return {
    requestId: params.requestId,
  };
}

function checkParams(
  params: ParamsProcessBigQueuedRequest,
): string | undefined {
  const { requestId } = formatParams(params);

  if (requestId < 0) {
    return "Invalid stake index";
  }

  return;
}

function useMakeInstance(address: Address | undefined): Instance {
  const { appChainId } = useWeb3Context();

  if (!address)
    console.warn(
      `Contract address of token not found for chainId ${appChainId}`,
    );

  // Hook for transaction execution only
  const {
    data: hash,
    error,
    writeContractAsync,
    status,
  } = useWriteLTokenProcessBigQueuedRequest();

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
  params: ParamsProcessBigQueuedRequest,
): Promise<ExecuteReturn> {
  try {
    if (!instance.address) throw Error("Contract address not found");

    // Format parameters for execution
    const { requestId } = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
      address: instance.address,
      args: [requestId],
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

export const configProcessBigQueuedRequest = {
  useMakeInstance,
  checkParams,
  execute,
};
