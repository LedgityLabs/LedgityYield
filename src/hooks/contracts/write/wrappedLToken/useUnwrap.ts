import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  ExecuteReturn,
  TransactionStatus,
  useWriteWrappedLTokenUnwrap,
} from "@/types";
import { Address, Hash, parseUnits } from "viem";

export type ParamsUnwrap = {
  symbol: string;
  amount: string;
  tokenDecimals: number;
};

type FormattedParams = {
  amount: bigint;
};

type Instance = {
  writeContract: ReturnType<
    typeof useWriteWrappedLTokenUnwrap
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsUnwrap): FormattedParams {
  return {
    amount: parseUnits(params.amount.toString(), params.tokenDecimals),
  };
}

function checkParams(params: ParamsUnwrap): string | undefined {
  const { amount } = formatParams(params);

  if (amount < 0n) {
    return "Invalid amount";
  }

  return;
}

function useMakeInstance(address: Address | undefined): Instance {
  const { appChainId } = useWeb3Context();

  if (!address)
    console.warn(
      `Contract address of token not found for chainId ${appChainId}`,
    );

  const {
    data: hash,
    error,
    writeContractAsync,
    status,
  } = useWriteWrappedLTokenUnwrap();

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
  params: ParamsUnwrap,
): Promise<ExecuteReturn> {
  try {
    if (!instance.address) throw Error("Contract address not found");

    const { amount } = formatParams(params);
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
      address: instance.address,
      args: [amount],
    });

    return {
      hash,
      status: instance.status,
    };
  } catch (err: any) {
    return {
      status: "error",
      error: err.message || "Operation failed",
    };
  }
}

export const configUnwrap = {
  useMakeInstance,
  checkParams,
  execute,
};
