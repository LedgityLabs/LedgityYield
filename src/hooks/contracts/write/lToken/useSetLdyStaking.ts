import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  ExecuteReturn,
  TransactionStatus,
  useWriteLTokenSetLdyStaking,
} from "@/types";
import { Address, Hash, zeroAddress } from "viem";

export type ParamsSetLdyStaking = {
  ldyStakingAddress: Address;
};

type FormattedParams = {
  ldyStakingAddress: Address;
};

type Instance = {
  writeContract: ReturnType<
    typeof useWriteLTokenSetLdyStaking
  >["writeContractAsync"];
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};

function formatParams(params: ParamsSetLdyStaking): FormattedParams {
  return {
    ldyStakingAddress: params.ldyStakingAddress,
  };
}

function checkParams(params: ParamsSetLdyStaking): string | undefined {
  const { ldyStakingAddress } = formatParams(params);

  if (ldyStakingAddress === zeroAddress) {
    return "Invalid address";
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
  } = useWriteLTokenSetLdyStaking();

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
  params: ParamsSetLdyStaking,
): Promise<ExecuteReturn> {
  try {
    if (!instance.address) throw Error("Contract address not found");

    // Format parameters for execution
    const { ldyStakingAddress } = formatParams(params);
    // Execute the transaction
    const hash = await instance.writeContract({
      // @dev Chain ID typesafety doing its job but getting in the way here
      chainId: instance.chainId as any,
      address: instance.address,
      args: [ldyStakingAddress],
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

export const configSetLdyStaking = {
  makeInstance,
  checkParams,
  execute,
};
