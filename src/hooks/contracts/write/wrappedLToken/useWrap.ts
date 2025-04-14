import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  ExecuteReturn,
  TransactionStatus,
  useWriteWrappedLTokenWrap,
} from "@/types";
import { Address, Hash, parseUnits } from "viem";

export type ParamsWrap = {
  symbol: string;
  amount: string;
  tokenDecimals: number;
  to?: Address;
};

type FormattedParams = {
  amount: bigint;
  to?: Address;
};

type Instance = {
  writeContract: ReturnType<
    typeof useWriteWrappedLTokenWrap
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsWrap): FormattedParams {
  return {
    amount: parseUnits(params.amount.toString(), params.tokenDecimals),
    to: params.to,
  };
}

function checkParams(params: ParamsWrap): string | undefined {
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
  } = useWriteWrappedLTokenWrap();

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
  params: ParamsWrap,
): Promise<ExecuteReturn> {
  try {
    if (!instance.address) throw Error("Contract address not found");

    const { amount, to } = formatParams(params);
    const hash = await instance.writeContract({
      chainId: instance.chainId as any,
      address: instance.address,
      args: to ? [amount, to] : [amount],
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

export const configWrap = {
  useMakeInstance,
  checkParams,
  execute,
};
