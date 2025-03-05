import { useGetContractAddress } from "@/hooks/useGetContractAddress";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  useWriteLdyStakingUnstake,
  ExecuteReturn,
  TransactionStatus,
} from "@/types";
import { Address, Hash, parseUnits } from "viem";

export type ParamsUnstake = {
  amount: string;
  tokenDecimals: number;
  stakeIndex: bigint;
};

type FormattedParams = {
  amount: bigint;
  stakeIndex: bigint;
};

type Instance = {
  writeContract: ReturnType<
    typeof useWriteLdyStakingUnstake
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsUnstake): FormattedParams {
  return {
    amount: parseUnits(params.amount, params.tokenDecimals),
    stakeIndex: params.stakeIndex,
  };
}

function checkParams(params: ParamsUnstake): string | undefined {
  const { amount, stakeIndex } = formatParams(params);

  if (!amount || amount === 0n) {
    return "Missing amount input";
  }

  if (stakeIndex < 0) {
    return "Invalid stake index";
  }

  return;
}

function useMakeInstance(): Instance {
  const { appChainId } = useWeb3Context();
  const address = useGetContractAddress("LDYStaking");

  if (!address)
    console.warn(
      `Contract address of ${"LdyStaking"} not found for chainId ${appChainId}`,
    );

  // Hook for transaction execution only
  const {
    data: hash,
    error,
    writeContractAsync,
    status,
  } = useWriteLdyStakingUnstake();

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
  params: ParamsUnstake,
): Promise<ExecuteReturn> {
  try {
    // Format parameters for execution
    const { amount, stakeIndex } = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
      args: [amount, stakeIndex],
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

export const configUnstake = {
  useMakeInstance,
  checkParams,
  execute,
};
