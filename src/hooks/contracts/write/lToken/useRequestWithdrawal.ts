import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  ExecuteReturn,
  TransactionStatus,
  useWriteLTokenRequestWithdrawal,
} from "@/types";
import { Address, Hash, parseUnits } from "viem";

export type ParamsRequestWithdrawal = {
  symbol: string;
  amount: string;
  tokenDecimals: number;
  msgValue: bigint | undefined;
};

type FormattedParams = {
  amount: bigint;
  msgValue: bigint | undefined;
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
    msgValue: params.msgValue,
  };
}

function checkParams(params: ParamsRequestWithdrawal): string | undefined {
  const { amount, msgValue } = formatParams(params);

  if (amount < 0n) {
    return "Invalid amount";
  }

  if (msgValue === undefined) {
    return "Invalid msgValue";
  }

  return;
}

function makeInstance(address: Address | undefined): Instance {
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
    const { amount, msgValue } = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
      address: instance.address,
      args: [amount],
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

export const configRequestWithdrawal = {
  makeInstance,
  checkParams,
  execute,
};
