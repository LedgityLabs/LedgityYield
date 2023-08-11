"use client";
import { FC, type ReactNode, useEffect, useState } from "react";
import { Button } from "./Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./Dialog";
import { Spinner } from "./Spinner";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";
import { useContractWrite, usePrepareContractWrite, usePublicClient, useWalletClient } from "wagmi";
import { useSwitchNetwork } from "@/hooks";
import { prettyErrorMessage } from "@/lib/prettyErrorMessage";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { BaseError } from "viem";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
  preparation: ReturnType<typeof usePrepareContractWrite>;
  transactionSummary?: string | ReactNode;
  // This prevents displaying errors when user hasn't interacted with the button or input yet
  hasUserInteracted?: boolean;
}

export const TxButton: FC<Props> = ({
  preparation,
  transactionSummary = "",
  disabled,
  hasUserInteracted = false,
  ...props
}) => {
  const { isSwitching } = useSwitchNetwork();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  //@ts-ignore
  if (!preparation.config.request.value) preparation.config.request.value = 0n;

  const {
    write,
    isLoading: txIsLoading,
    isError: txIsError,
    isSuccess: txIsSuccess,
    error: txError,
  } = useContractWrite(preparation.config);

  // Refetch preparation on wallet or network change
  useEffect(() => {
    if (walletClient) preparation.refetch();
  }, [walletClient, publicClient]);

  const isLoading = preparation.isFetching || preparation.isLoading || txIsLoading;

  // Build tooltip message and error state
  let tooltipMessage = "";
  let tooltipIsError = false;
  if (isLoading) tooltipMessage = "Loading...";
  else if (isSwitching) tooltipMessage = "Switching network...";
  else if (!walletClient) {
    tooltipIsError = true;
    tooltipMessage = "No wallet connected";
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
              hasUserInteracted &&
              (!walletClient || preparation.isError) &&
              !isLoading &&
              !isSwitching
                ? true
                : undefined
            }
          >
            <TooltipTrigger>
              <DialogTrigger asChild>
                <Button
                  {...props}
                  disabled={disabled || !walletClient || !write || isSwitching}
                  isLoading={isLoading}
                  onClick={() => write!()}
                />
              </DialogTrigger>
            </TooltipTrigger>
            {tooltipMessage && (
              <TooltipContent
                variant={tooltipIsError ? "destructive" : "primary"}
                side="bottom"
                sideOffset={4}
              >
                {tooltipMessage}
              </TooltipContent>
            )}
          </Tooltip>
          {/* Transaction dialog */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">
                {txIsLoading && "Approve transaction in your wallet"}
                {txIsError && "Transaction failed"}
                {txIsSuccess && "Transaction succeeded"}
              </DialogTitle>
              <DialogDescription className="flex flex-col justify-center items-center gap-3 pt-4">
                {transactionSummary}
                {txIsLoading && <Spinner />}
                {txIsError && txError && (
                  <div className="flex flex-col justify-center items-center gap-3">
                    <p className="text-lg text-center mb-4">
                      The transaction failed with error : &quot;{prettyErrorMessage(txError)}&quot;
                    </p>
                    <i className="ri-close-circle-fill text-red-500 text-5xl"></i>
                  </div>
                )}
                {txIsSuccess && (
                  <div className="flex flex-col justify-center items-center gap-3">
                    <p className="text-lg text-center mb-4">You can safely close this modal.</p>
                    <i className="ri-checkbox-circle-fill text-green-500 text-5xl"></i>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
