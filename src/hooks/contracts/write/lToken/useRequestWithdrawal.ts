import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  ExecuteReturn,
  TransactionStatus,
  useWriteLTokenRequestWithdrawal,
} from "@/types";
import { Address, Hash, parseUnits } from "viem";

export type ParamsRequestWithdrawal = {
  amount: bigint;
  tokenDecimals: number;
};

type FormattedParams = {
  amount: bigint;
};

type Instance = {
  writeContract: ReturnType<
    typeof useWriteLTokenRequestWithdrawal
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsRequestWithdrawal): FormattedParams {
  return {
    amount: parseUnits(params.amount.toString(), params.tokenDecimals),
  };
}

function checkParams(params: ParamsRequestWithdrawal): string | undefined {
  const { amount } = formatParams(params);

  if (amount < 0n) {
    return "Invalid amount";
  }

  return;
}

function makeInstance(address: Address): Instance {
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
  } = useWriteLTokenRequestWithdrawal();

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
  params: ParamsRequestWithdrawal,
): Promise<ExecuteReturn> {
  try {
    if (!instance.address) throw Error("Contract address not found");

    // Format parameters for execution
    const { amount } = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
      address: instance.address,
      args: [amount],
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

export const configRequestWithdrawal = {
  makeInstance,
  checkParams,
  execute,
};
