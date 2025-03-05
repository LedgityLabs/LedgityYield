import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  ExecuteReturn,
  TransactionStatus,
  useWriteLTokenSetApr,
} from "@/types";
import { Address, Hash, parseUnits } from "viem";

export type ParamsSetApr = {
  newRate: number; // base 100
};

type FormattedParams = {
  newRate: number;
};

type Instance = {
  writeContract: ReturnType<typeof useWriteLTokenSetApr>["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsSetApr): FormattedParams {
  return {
    newRate: Number(parseUnits(params.newRate.toFixed(3), 3)),
  };
}

function checkParams(params: ParamsSetApr): string | undefined {
  const { newRate } = formatParams(params);

  if (newRate < 0 || 65535 < newRate) {
    return "Invalid rate";
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
  } = useWriteLTokenSetApr();

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
  params: ParamsSetApr,
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

export const configSetApr = {
  useMakeInstance,
  checkParams,
  execute,
};
