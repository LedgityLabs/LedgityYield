import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  ExecuteReturn,
  TransactionStatus,
  useWriteLTokenSetFeesRate,
} from "@/types";
import { Address, Hash, parseUnits } from "viem";

export type ParamsSetFeesRate = {
  newRate: number; // base 100
};

type FormattedParams = {
  newRate: number;
};

type Instance = {
  writeContract: ReturnType<
    typeof useWriteLTokenSetFeesRate
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsSetFeesRate): FormattedParams {
  return {
    newRate: Number(parseUnits(params.newRate.toFixed(3), 3)),
  };
}

function checkParams(params: ParamsSetFeesRate): string | undefined {
  const { newRate } = formatParams(params);

  // Max 10%
  if (newRate < 0 || 20_000 < newRate) {
    return "Invalid rate";
  }

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
  } = useWriteLTokenSetFeesRate();

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
  params: ParamsSetFeesRate,
): Promise<ExecuteReturn> {
  try {
    if (!instance.address) throw Error("Contract address not found");

    // Format parameters for execution
    const { newRate } = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
      address: instance.address,
      args: [newRate],
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

export const configSetFeesRate = {
  makeInstance,
  checkParams,
  execute,
};
