"use client";
import { FC, type ReactNode, useEffect, useState } from "react";
import { Button } from "./Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./Dialog";
import { Spinner } from "./Spinner";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";
import {
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
  useWaitForTransaction,
  useWalletClient,
} from "wagmi";
import { useSwitchNetwork } from "@/hooks";
import { prettyErrorMessage } from "@/lib/prettyErrorMessage";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { BaseError } from "viem";
import { Card } from "./Card";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
  preparation: ReturnType<typeof usePrepareContractWrite>;
  transactionSummary?: string | ReactNode;
  // This prevents displaying errors when user hasn't interacted with the button or input yet
  hasUserInteracted?: boolean;

  // Allow to force hide tooltips
  hideTooltips?: boolean;

  // Allow parent to force error state
  parentIsError?: boolean;
  parentError?: string;
}

export const TxButton: FC<Props> = ({
  preparation,
  transactionSummary = "",
  disabled,
  hasUserInteracted = false,
  hideTooltips = false,
  parentIsError = false,
  parentError = undefined,
  ...props
}) => {
  const { isSwitching } = useSwitchNetwork();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // @ts-ignore
  if (preparation.config.request && !preparation.config.request.value) {
    // @ts-ignore
    preparation.config.request.value = 0n;
  }

  const {
    data: writeData,
    write,
    isLoading: txIsLoading,
    isError: txIsError,
    isSuccess: txIsSuccess,
  } = useContractWrite(preparation.config);

  const {
    isLoading: waitIsLoading,
    isError: waitIsError,
    isSuccess: waitIsSuccess,
  } = useWaitForTransaction({
    hash: writeData?.hash,
  });

  // Refetch preparation on wallet or network change
  useEffect(() => {
    if (walletClient) preparation.refetch();
  }, [walletClient, publicClient]);

  const isLoading = preparation.isFetching || preparation.isLoading || txIsLoading;

  // Build tooltip message and error state
  let tooltipMessage = "";
  let tooltipIsError = false;
  if (isLoading) {
    tooltipMessage = "Loading...";
  } else if (isSwitching) {
    tooltipMessage = "Switching network...";
  } else if (!walletClient) {
    tooltipIsError = true;
    tooltipMessage = "No wallet connected";
  } else if (parentIsError && parentError) {
    tooltipIsError = true;
    tooltipMessage = parentError;
  } else if (preparation.isError) {
    tooltipIsError = true;
    tooltipMessage = prettyErrorMessage(preparation.error as BaseError);
  }

  return (
    <>
      <div className="relative flex flex-col">
        <Dialog>
          <Tooltip
            open={
              hasUserInteracted && tooltipIsError && !isLoading && !isSwitching ? true : undefined
            }
          >
            <TooltipTrigger>
              <DialogTrigger asChild>
                <Button
                  {...props}
                  disabled={disabled || tooltipIsError || !write || isSwitching}
                  isLoading={isLoading}
                  onClick={() => write!()}
                />
              </DialogTrigger>
            </TooltipTrigger>
            {tooltipMessage && !hideTooltips && (
              <TooltipContent
                className="font-semibold"
                variant={tooltipIsError ? "destructive" : "primary"}
                side="bottom"
                sideOffset={4}
              >
                {tooltipMessage}
              </TooltipContent>
            )}
          </Tooltip>
          {/* Transaction dialog */}
          <DialogContent className="!px-0 !sm:px-0">
            <DialogHeader>
              <DialogTitle>Ongoing transaction</DialogTitle>
              <DialogDescription className="flex flex-col items-center justify-center gap-3">
                <div className="mb-2 w-[calc(100%-4px)] whitespace-normal bg-fg/90 px-10 py-10 text-center text-lg font-semibold text-bg">
                  {transactionSummary}
                </div>

                <ul
                  className={clsx(
                    "relative my-5 flex flex-col gap-8",
                    "before:-z-1 before:absolute before:bottom-10 before:left-[calc(1.25rem-1.5px)] before:top-10 before:border-l-[3px] before:border-slate-300",
                  )}
                >
                  <li className={twMerge("flex items-center justify-start gap-2")}>
                    <Card
                      radius="full"
                      className={twMerge(
                        "flex h-10 w-10 items-center justify-center rounded-full text-xl before:bg-slate-300",
                        txIsLoading && "before:bg-primary/75",
                        txIsError && "before:bg-red-500/75",
                        txIsSuccess && "before:bg-green-500/75",
                      )}
                    >
                      <span className="font-bold text-primary-fg">
                        {txIsLoading && <Spinner />}
                        {txIsError && <i className="ri-close-fill text-xl" />}
                        {txIsSuccess && <i className="ri-check-fill text-xl" />}
                      </span>
                    </Card>
                    <p
                      className={twMerge(
                        "text-lg font-medium text-slate-400",
                        txIsLoading && "text-fg/90",
                        txIsError && "text-red-600/75",
                        txIsSuccess && "opacity-80 grayscale-[100%]",
                      )}
                    >
                      {(() => {
                        if (txIsLoading) return "Sign transaction from your wallet";
                        else if (txIsError) return "Wallet rejected the request";
                        else if (txIsSuccess) return "Wallet signature successful";
                      })()}
                    </p>
                  </li>
                  <li className={twMerge("flex items-center justify-start gap-2")}>
                    <Card
                      radius="full"
                      className={twMerge(
                        "flex h-10 w-10 items-center justify-center rounded-full text-xl before:bg-slate-300",
                        waitIsLoading && "before:bg-primary/75",
                        waitIsError && "before:bg-red-500/75",
                        waitIsSuccess && "before:bg-green-500/75",
                      )}
                    >
                      <span className="font-bold text-primary-fg">
                        {waitIsLoading && <Spinner />}
                        {waitIsError && <i className="ri-close-fill text-xl" />}
                        {waitIsSuccess && <i className="ri-check-fill text-xl" />}
                      </span>
                    </Card>
                    <p
                      className={twMerge(
                        "text-lg font-medium text-slate-400",
                        waitIsLoading && "text-fg/90",
                        waitIsError && "text-red-600/75",
                        waitIsSuccess && "opacity-80 grayscale-[100%]",
                      )}
                    >
                      {(() => {
                        if (waitIsError) return "Transaction failed";
                        else if (waitIsSuccess) return "Transaction succeeded";
                        else return "Wait for network confirmation";
                      })()}
                    </p>
                  </li>
                </ul>
                {(txIsSuccess && waitIsSuccess) ||
                  ((txIsError || waitIsError) && (
                    <p className="font-semibold ">You can now safely close this modal</p>
                  ))}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
