import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  ExecuteReturn,
  TransactionStatus,
  useWriteLTokenProcessQueuedRequests,
} from "@/types";
import { Address, Hash } from "viem";

export type ParamsProcessQueuedRequests = {};

type FormattedParams = {};

type Instance = {
  writeContract: ReturnType<
    typeof useWriteLTokenProcessQueuedRequests
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsProcessQueuedRequests): FormattedParams {
  return {};
}

function checkParams(params: ParamsProcessQueuedRequests): string | undefined {
  const {} = formatParams(params);

  return;
}

function makeInstance(address: Address | undefined): Instance {
  const { appChainId } = useWeb3Context();

  if (!address)
    console.error(
      `Contract address of token not found for chainId ${appChainId}`,
    );

  // Hook for transaction execution only
  const {
    data: hash,
    error,
    writeContractAsync,
    status,
  } = useWriteLTokenProcessQueuedRequests();

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
  params: ParamsProcessQueuedRequests,
): Promise<ExecuteReturn> {
  try {
    if (!instance.address) throw Error("Contract address not found");

    // Format parameters for execution
    const {} = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
      address: instance.address,
      args: [],
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

export const configProcessQueuedRequests = {
  makeInstance,
  checkParams,
  execute,
};
