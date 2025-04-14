import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  ExecuteReturn,
  TransactionStatus,
  useWriteWrappedLTokenDepositAndWrap,
} from "@/types";
import { Address, Hash, parseUnits } from "viem";

export type ParamsDepositAndWrap = {
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
    typeof useWriteWrappedLTokenDepositAndWrap
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsDepositAndWrap): FormattedParams {
  return {
    amount: parseUnits(params.amount.toString(), params.tokenDecimals),
    to: params.to,
  };
}

function checkParams(params: ParamsDepositAndWrap): string | undefined {
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
  } = useWriteWrappedLTokenDepositAndWrap();

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
  params: ParamsDepositAndWrap,
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

export const configDepositAndWrap = {
  useMakeInstance,
  checkParams,
  execute,
};
