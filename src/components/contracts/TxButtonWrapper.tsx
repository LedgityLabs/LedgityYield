import { waitForTransactionReceipt } from "@wagmi/core";
import { parseUnits, Address, Hash } from "viem";
import { wagmiConfig } from "@/config/wagmi";
// Hooks
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useCallback, useReducer, useState } from "react";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useAllowances, configApprove } from "@/hooks/contracts";
// Components
import { WalletIcon } from "@/components/icons/WalletIcon";
import { ArrowTopRightIcon } from "@/components/icons/ArrowTopRightIcon";
import { Spinner } from "@/components/ui";
import { TxModal } from "@/components/contracts/TxModal";
import { Amount } from "@/components/ui";
// Types
import { UseCallInstance, ExecuteReturn } from "@/types";

// @dev the typing of params is purposefully abstracted from the wrapper
// the config of each button manages adequate typing
type ButtonConfig<T> = {
  checkParams: (params: T) => string | undefined;
  makeInstance: () => UseCallInstance;
  simulate?: (
    instance: UseCallInstance,
    params: T,
  ) => Promise<string | undefined>;
  execute: (instance: UseCallInstance, params: T) => Promise<ExecuteReturn>;
};

type ApprovalOperation = {
  instance: UseCallInstance;
  symbol: string;
  simulate?: () => Promise<string | undefined>;
  execute: () => Promise<ExecuteReturn>;
  parameters: {
    spender: Address;
    amount: string;
    tokenDecimals: number;
  };
};

type TransactionState = {
  isLoading: boolean;
  executedOnSuccess: boolean;
  hash: Hash | undefined;
  error: string | undefined;
  pendingApprove: boolean;
  pendingAllowanceUpdate: boolean;
};

export type ERC20ApproveCheck = {
  symbol: string;
  token?: Address;
  spender?: Address;
  tokenDecimals: number;
  amount: string;
};

export type TxButtonWrapperProps<T> = {
  buttonConfig: ButtonConfig<T>;
  makeDescription: (params: T) => string | React.ReactNode;
  params?: any;
  buttonText: string;
  approveChecks?: ERC20ApproveCheck[];
  className?: string;
  disabled?: boolean;
  errorOverride?: string;
  onSubmit?: () => void;
  onSubmitReject?: () => void;
  onSuccess?: () => void;
  showLink?: boolean;
  // True will display approve button separately from main tx button
  splitApprove?: boolean;
};

export function TxButtonWrapper<T>({
  buttonConfig,
  makeDescription,
  params,
  buttonText,
  approveChecks = [],
  className,
  disabled,
  errorOverride,
  onSubmit,
  onSubmitReject,
  onSuccess,
  showLink,
  splitApprove = false,
}: TxButtonWrapperProps<T>) {
  const { openConnectModal } = useConnectModal();
  const { currentNetworkConfig, currentAccount } = useWeb3Context();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [txState, dispatchTxState] = useReducer(
    (prev: TransactionState, next: Partial<TransactionState>) => ({
      ...prev,
      ...next,
    }),
    {
      isLoading: false,
      executedOnSuccess: false,
      hash: undefined,
      error: undefined,
      pendingApprove: false,
      pendingAllowanceUpdate: false,
    },
  );

  const { allowances, lastUpdate: lastAllowanceUpdate } = useAllowances(
    approveChecks.map((approve) => approve.token),
    currentAccount,
    approveChecks[0]?.spender,
  );

  /**
   * Checks if the user needs to approve a token before executing the transaction
   */
  const getApprovalERC20 = useCallback((): ApprovalOperation | undefined => {
    const approveInstances = approveChecks.map((check) => ({
      token: check.token,
      instance: configApprove.makeInstance(check.token),
    }));

    if (!approveChecks.length || !allowances?.length) return;

    for (const check of approveChecks) {
      const allowance = allowances.find(
        (allowance) => allowance.address === check.token,
      );

      if (!allowance || !check.spender) continue;

      const requiredAllowance = parseUnits(check.amount, check.tokenDecimals);

      if (requiredAllowance <= allowance?.amount) continue;

      const instance = approveInstances?.find(
        (instance) => instance.token === check.token,
      )?.instance;

      if (!instance) continue;

      const approvalParameters = {
        symbol: check.symbol,
        spender: check.spender,
        amount: check.amount,
        tokenDecimals: check.tokenDecimals,
      };

      return {
        instance,
        symbol: check.symbol,
        simulate: () => configApprove.simulate(instance, approvalParameters),
        execute: () => configApprove.execute(instance, approvalParameters),
        parameters: approvalParameters,
      };
    }
  }, [approveChecks, allowances, lastAllowanceUpdate]);

  /**
   * These are transaction hook instances for approval or the main transaction
   */
  const approveAction = getApprovalERC20();
  const baseInstance = buttonConfig.makeInstance();
  const currentInstance = txState.pendingApprove
    ? approveAction?.instance
    : baseInstance;

  // Update the allowances when the user approves a token
  useEffect(() => {
    if (txState.pendingAllowanceUpdate) {
      dispatchTxState({ pendingAllowanceUpdate: false });
    }
  }, [allowances, lastAllowanceUpdate]);

  // Update the error state
  useEffect(() => {
    if (errorOverride !== txState.error) {
      dispatchTxState({ error: errorOverride });
    }
  }, [errorOverride]);

  // Check if the transaction was successful
  useEffect(() => {
    if (
      !txState.executedOnSuccess &&
      !txState.pendingApprove &&
      currentInstance?.status === "success"
    ) {
      onSuccess?.();
      dispatchTxState({ executedOnSuccess: true });
    }
  }, [currentInstance?.status, txState.pendingApprove, onSuccess]);

  // Update the state when the approve action changes
  useEffect(() => {
    if (!!approveAction !== txState.pendingApprove) {
      dispatchTxState({ pendingApprove: !!approveAction });
    }
  }, [approveAction]);

  /**
   * Handles the transaction execution
   */
  const handleTransaction = useCallback(async () => {
    if (!currentInstance || !currentAccount) return;

    setIsDialogOpen(true);

    const isApprove = txState.pendingApprove && !!approveAction;
    if (!isApprove && onSubmit) onSubmit();

    dispatchTxState({
      isLoading: true,
      executedOnSuccess: false,
      hash: undefined,
      error: undefined,
      pendingApprove: !!approveAction,
      pendingAllowanceUpdate: isApprove,
    });

    try {
      const argError = buttonConfig.checkParams(params);
      if (argError) throw new Error(argError);

      const sent = await (isApprove
        ? approveAction.execute()
        : buttonConfig.execute(currentInstance, params));

      if (sent.error) {
        const userRejected =
          sent.error?.includes("User rejected") ||
          sent.error?.includes("User denied");
        if (!userRejected) throw Error("Failed to create transaction");
      }

      if (!sent.hash) throw Error("Transaction hash not found");

      await waitForTransactionReceipt(wagmiConfig, {
        confirmations: 2,
        hash: sent.hash,
      });

      dispatchTxState({
        hash: sent.hash,
        isLoading: false,
      });
    } catch (err: any) {
      if (!isApprove && onSubmitReject) onSubmitReject();

      dispatchTxState({
        error: err.message || "Operation failed",
        isLoading: false,
        pendingAllowanceUpdate: false,
      });
    }
  }, [
    currentInstance,
    approveAction,
    buttonConfig,
    params,
    txState.pendingApprove,
  ]);

  const hasApproveChecks = approveChecks.length > 0;
  const approvedTokenName = approveChecks[0]?.symbol;

  const explorerLink =
    txState.hash && currentNetworkConfig.explorerLinkBuilder
      ? currentNetworkConfig.explorerLinkBuilder({ tx: txState.hash })
      : "";

  const isPendingApprove = txState.pendingApprove && !!approveAction;
  const isLoading = txState.isLoading || txState.pendingAllowanceUpdate;
  const isDisabled = disabled || isLoading;

  return (
    <>
      <div className="w-full flex flex-col items-center">
        {/* User is not connected */}
        {!currentAccount && (
          <button
            className={`font-bold flex items-center justify-center ${className} theme-highlight theme-highlight-border`}
            onClick={openConnectModal}
          >
            <WalletIcon className="mr-2" />
            <span className="theme-gradient">Connect</span>
          </button>
        )}

        {/* Transaction is being processed */}
        {currentAccount && isLoading && (
          <button
            className={`font-bold flex items-center justify-center theme-disabled-bg-dark disabled:brightness-100 ${className}`}
            disabled
          >
            <Spinner className="mr-2" />
            <span className="theme-gradient">Sending</span>
          </button>
        )}

        {/* Approve button */}
        {currentAccount &&
          hasApproveChecks &&
          ((!isLoading && isPendingApprove) || splitApprove) && (
            <button
              className={`font-bold flex items-center justify-center ${className} ${
                isDisabled || !isPendingApprove
                  ? "theme-disabled-bg-dark disabled:brightness-100"
                  : ""
              }`}
              disabled={isDisabled || !isPendingApprove}
              onClick={handleTransaction}
            >
              <span className="theme-gradient">
                {`Approve ${approvedTokenName}`}
              </span>
            </button>
          )}

        {currentAccount && splitApprove && (
          <div
            className={`h-8 w-2 my-2 bg-gradient-to-b from-transparent via-slate-100 to-slate-100 ${
              isPendingApprove ? "animate-pulse" : ""
            }`}
          />
        )}

        {/* Transaction button */}
        {currentAccount &&
          ((!isLoading && !isPendingApprove) || splitApprove) && (
            <button
              className={`font-bold flex items-center justify-center ${className} ${
                isDisabled || isPendingApprove
                  ? "theme-disabled-bg-dark disabled:brightness-100"
                  : ""
              }`}
              disabled={isDisabled || isPendingApprove}
              onClick={handleTransaction}
            >
              <span className={`${isDisabled ? "" : "theme-gradient"}`}>
                {buttonText}
              </span>
            </button>
          )}

        {/* Error and chain explorer link */}
        <div className="mt-2 min-h-5">
          {txState.error && (
            <div className="text-center text-sm theme-error-light">
              {txState.error}
            </div>
          )}

          {showLink && explorerLink && !txState.error && !isLoading && (
            <a href={explorerLink} target="_blank" rel="noreferrer">
              <button className="group min-h-5 flex flex-1 justify-center items-center theme-highlight space-x-1 whitespace-nowrap underline-offset-2 text-sm">
                <span className="theme-highlight group-hover:text-slate-100">
                  View transaction
                </span>
                <ArrowTopRightIcon className="theme-highlight group-hover:text-slate-100 h-4 w-4" />
              </button>
            </a>
          )}
        </div>
      </div>

      <TxModal
        isOpen={!!isDialogOpen}
        setIsOpen={setIsDialogOpen}
        txContent={
          txState.pendingApprove && approveAction ? (
            <span>
              Allow Ledgity Yield to use{" "}
              <Amount
                value={parseUnits(
                  approveAction.parameters.amount,
                  approveAction.parameters.tokenDecimals,
                )}
                decimals={approveAction.parameters.tokenDecimals}
                suffix={approveAction.symbol}
                displaySymbol={true}
                className="text-indigo-300 underline decoration-indigo-300 decoration-2 underline-offset-4 whitespace-nowrap"
              />
            </span>
          ) : (
            makeDescription(params)
          )
        }
        txStates={{
          isWriteError: !!txState.error && !txState.hash,
          isWriteSuccess: !!txState.hash,
          isConfirming: txState.isLoading && !!txState.hash,
          isConfirmError: !!txState.error && !!txState.hash,
          isConfirmSuccess:
            !!txState.hash && !txState.isLoading && !txState.error,
        }}
      />
    </>
  );
}
