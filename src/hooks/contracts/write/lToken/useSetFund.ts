import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  ExecuteReturn,
  TransactionStatus,
  useWriteLTokenSetFund,
} from "@/types";
import { Address, Hash, zeroAddress } from "viem";

export type ParamsSetFund = {
  fundAddress: Address;
};

type FormattedParams = {
  fundAddress: Address;
};

type Instance = {
  writeContract: ReturnType<typeof useWriteLTokenSetFund>["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsSetFund): FormattedParams {
  return {
    fundAddress: params.fundAddress,
  };
}

function checkParams(params: ParamsSetFund): string | undefined {
  const { fundAddress } = formatParams(params);

  if (fundAddress === zeroAddress) {
    return "Invalid address";
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
  } = useWriteLTokenSetFund();

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
  params: ParamsSetFund,
): Promise<ExecuteReturn> {
  try {
    if (!instance.address) throw Error("Contract address not found");

    // Format parameters for execution
    const { fundAddress } = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
      address: instance.address,
      args: [fundAddress],
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

export const configSetFund = {
  makeInstance,
  checkParams,
  execute,
};
