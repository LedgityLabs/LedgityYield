import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  ExecuteReturn,
  TransactionStatus,
  useWriteGenericErc20Mint,
} from "@/types";
import { Address, Hash, parseUnits } from "viem";

export type ParamsMint = {
  amount: string;
  tokenDecimals: number;
};

type FormattedParams = {
  amount: bigint;
};

type Instance = {
  writeContract: ReturnType<
    typeof useWriteGenericErc20Mint
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsMint): FormattedParams {
  return {
    amount: parseUnits(params.amount, params.tokenDecimals),
  };
}

function checkParams(params: ParamsMint): string | undefined {
  const { amount } = formatParams(params);

  if (!amount || amount === 0n) {
    return "Missing amount input";
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
  } = useWriteGenericErc20Mint();

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
  params: ParamsMint,
): Promise<ExecuteReturn> {
  try {
    if (!instance.address) throw Error("Contract address not found");

    // Format parameters for execution
    const { amount } = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      chainId: instance.chainId,
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

export const configMint = {
  makeInstance,
  checkParams,
  execute,
};
