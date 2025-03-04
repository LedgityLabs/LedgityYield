import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  ExecuteReturn,
  TransactionStatus,
  useWriteLTokenDeposit,
} from "@/types";
import { Address, Hash, parseUnits } from "viem";

export type ParamsDeposit = {
  symbol: string;
  amount: bigint;
  tokenDecimals: number;
  refCode: string;
};

type FormattedParams = {
  amount: bigint;
  refCode: string;
};

type Instance = {
  writeContract: ReturnType<typeof useWriteLTokenDeposit>["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsDeposit): FormattedParams {
  return {
    amount: parseUnits(params.amount.toString(), params.tokenDecimals),
    refCode: params.refCode,
  };
}

function checkParams(params: ParamsDeposit): string | undefined {
  const { amount } = formatParams(params);

  if (amount < 0n) {
    return "Invalid amount";
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
  } = useWriteLTokenDeposit();

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
  params: ParamsDeposit,
): Promise<ExecuteReturn> {
  try {
    if (!instance.address) throw Error("Contract address not found");

    // Format parameters for execution
    const { amount, refCode } = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
      address: instance.address,
      args: [amount, refCode],
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

export const configDeposit = {
  makeInstance,
  checkParams,
  execute,
};
