import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  ExecuteReturn,
  TransactionStatus,
  useWriteLTokenSetWithdrawer,
} from "@/types";
import { Address, Hash, zeroAddress } from "viem";

export type ParamsSetWithdrawer = {
  withdrawerAddress: Address;
};

type FormattedParams = {
  withdrawerAddress: Address;
};

type Instance = {
  writeContract: ReturnType<
    typeof useWriteLTokenSetWithdrawer
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsSetWithdrawer): FormattedParams {
  return {
    withdrawerAddress: params.withdrawerAddress,
  };
}

function checkParams(params: ParamsSetWithdrawer): string | undefined {
  const { withdrawerAddress } = formatParams(params);

  if (withdrawerAddress === zeroAddress) {
    return "Invalid address";
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
  } = useWriteLTokenSetWithdrawer();

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
  params: ParamsSetWithdrawer,
): Promise<ExecuteReturn> {
  try {
    if (!instance.address) throw Error("Contract address not found");

    // Format parameters for execution
    const { withdrawerAddress } = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
      address: instance.address,
      args: [withdrawerAddress],
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

export const configSetWithdrawer = {
  makeInstance,
  checkParams,
  execute,
};
