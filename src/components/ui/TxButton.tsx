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

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
  preparation: ReturnType<typeof usePrepareContractWrite>;
  transactionSummary?: string | ReactNode;
  // This prevents displaying errors when user hasn't interacted with the button or input yet
  hasUserInteracted?: boolean;

  // Allow to force hide tooltips
  hideTooltips?: boolean;
}

export const TxButton: FC<Props> = ({
  preparation,
  transactionSummary = "",
  disabled,
  hasUserInteracted = false,
  hideTooltips = false,
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
    error: txError,
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
          <DialogContent className="px-0">
            <DialogHeader>
              <DialogTitle className="text-center text-fg/90">Ongoing transaction</DialogTitle>
              <DialogDescription className="flex flex-col justify-center items-center gap-3">
                <div className="text-lg bg-fg/90 text-bg px-10 py-10 font-semibold text-center mb-4 mt-2 whitespace-normal w-[calc(100%-4px)]">
                  {transactionSummary}
                </div>

                <ul className="flex flex-col gap-8 py-5">
                  <li
                    className={twMerge(
                      "flex gap-2 justify-start items-center",
                      txIsSuccess && "grayscale opacity-50",
                    )}
                  >
                    <Card
                      radius="full"
                      className="text-xl h-10 w-10 before:bg-primary/75 rounded-full flex justify-center items-center"
                    >
                      <span className="text-primary-fg font-bold">1</span>
                    </Card>
                    <p className="text-lg font-medium">
                      {(() => {
                        if (txIsLoading) return "Sign transaction from your wallet";
                        else if (txIsError) return "Wallet rejected the request";
                        else if (txIsSuccess) return "Wallet signature successful";
                      })()}
                    </p>
                    {txIsLoading && <Spinner />}
                  </li>
                  <li
                    className={twMerge(
                      "flex gap-2 justify-start items-center",
                      !txIsSuccess && "grayscale opacity-50",
                    )}
                  >
                    <Card
                      radius="full"
                      className="text-xl h-10 w-10 before:bg-primary/75 rounded-full flex justify-center items-center"
                    >
                      <span className="text-primary-fg font-bold">2</span>
                    </Card>
                    <p className="text-lg font-medium">
                      {(() => {
                        if (waitIsError) return "Transaction failed";
                        else if (waitIsSuccess) return "Transaction succeeded";
                        else return "Wait until transaction is mined";
                      })()}
                    </p>
                    {waitIsLoading && <Spinner />}
                  </li>
                </ul>
                {/* {txIsError && txError && (
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
                )} */}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
