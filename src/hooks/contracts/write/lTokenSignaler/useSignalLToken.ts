import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  ExecuteReturn,
  TransactionStatus,
  useWriteLTokenSignalerSignalLToken,
} from "@/types";
import { Address, Hash, zeroAddress } from "viem";
import { useGetContractAddress } from "@/hooks/useGetContractAddress";

export type ParamsSignalLToken = {
  lTokenAddress: Address;
};

type FormattedParams = {
  lTokenAddress: Address;
};

type Instance = {
  writeContract: ReturnType<
    typeof useWriteLTokenSignalerSignalLToken
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsSignalLToken): FormattedParams {
  return {
    lTokenAddress: params.lTokenAddress,
  };
}

function checkParams(params: ParamsSignalLToken): string | undefined {
  const { lTokenAddress } = formatParams(params);

  if (lTokenAddress === zeroAddress) {
    return "Invalid lToken address";
  }

  return;
}

function useMakeInstance(): Instance {
  const { appChainId } = useWeb3Context();
  const address = useGetContractAddress("LTokenSignaler");

  if (!address)
    console.warn(
      `Contract address of ${"LTokenSignaler"} not found for chainId ${appChainId}`,
    );

  // Hook for transaction execution only
  const {
    data: hash,
    error,
    writeContractAsync,
    status,
  } = useWriteLTokenSignalerSignalLToken();

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
  params: ParamsSignalLToken,
): Promise<ExecuteReturn> {
  try {
    if (!instance.address) throw Error("Contract address not found");

    // Format parameters for execution
    const { lTokenAddress } = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
      args: [lTokenAddress],
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

export const configSignalLToken = {
  useMakeInstance,
  checkParams,
  execute,
};
