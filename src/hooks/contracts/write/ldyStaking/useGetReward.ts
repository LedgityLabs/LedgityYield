import { getTypedContractAddress } from "@/functions/getContractAddress";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  useWriteLdyStakingGetReward,
  ExecuteReturn,
  TransactionStatus,
} from "@/types";
import { Address, Hash, parseUnits } from "viem";

export type ParamsGetReward = {
  stakeIndex: bigint;
};

type FormattedParams = {
  stakeIndex: bigint;
};

type Instance = {
  writeContract: ReturnType<
    typeof useWriteLdyStakingGetReward
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsGetReward): FormattedParams {
  return {
    stakeIndex: params.stakeIndex,
  };
}

function checkParams(params: ParamsGetReward): string | undefined {
  const { stakeIndex } = formatParams(params);

  if (stakeIndex < 0) {
    return "Invalid stake index";
  }

  return;
}

function makeInstance(): Instance {
  const { appChainId } = useWeb3Context();
  const address = getTypedContractAddress("LDYStaking");

  if (!address)
    console.error(
      `Contract address of ${"LdyStaking"} not found for chainId ${appChainId}`,
    );

  // Hook for transaction execution only
  const {
    data: hash,
    error,
    writeContractAsync,
    status,
  } = useWriteLdyStakingGetReward();

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
  params: ParamsGetReward,
): Promise<ExecuteReturn> {
  try {
    // Format parameters for execution
    const { stakeIndex } = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
      args: [stakeIndex],
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

export const configGetReward = {
  makeInstance,
  checkParams,
  execute,
};
