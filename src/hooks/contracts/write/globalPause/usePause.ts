import { getTypedContractAddress } from "@/functions/getContractAddress";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  useWriteGlobalPausePause,
  ExecuteReturn,
  TransactionStatus,
} from "@/types";
import { Address, Hash } from "viem";

export type ParamsPause = {};

type FormattedParams = {};

type Instance = {
  writeContract: ReturnType<
    typeof useWriteGlobalPausePause
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsPause): FormattedParams {
  return {};
}

function checkParams(params: ParamsPause): string | undefined {
  const {} = formatParams(params);

  return;
}

function useMakeInstance(): Instance {
  const { appChainId } = useWeb3Context();
  const address = getTypedContractAddress("GlobalPause");

  if (!address)
    console.warn(
      `Contract address of ${"GlobalPause"} not found for chainId ${appChainId}`,
    );

  // Hook for transaction execution only
  const {
    data: hash,
    error,
    writeContractAsync,
    status,
  } = useWriteGlobalPausePause();

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
  params: ParamsPause,
): Promise<ExecuteReturn> {
  try {
    // Format parameters for execution
    const {} = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
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

export const configPause = {
  useMakeInstance,
  checkParams,
  execute,
};
