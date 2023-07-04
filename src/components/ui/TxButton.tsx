"use client";
import { FC, type ReactNode, useEffect } from "react";
import { Button } from "./Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./Dialog";
import { Spinner } from "./Spinner";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";
import { useContractWrite, usePrepareContractWrite, useWalletClient } from "wagmi";
import { useSwitchNetwork } from "@/hooks";
import { prettyErrorMessage } from "@/lib/prettyErrorMessage";
import { DialogTrigger } from "@radix-ui/react-dialog";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
  preparation: ReturnType<typeof usePrepareContractWrite>;
  transactionSummary?: string | ReactNode;
}

export const TxButton: FC<Props> = ({ preparation, transactionSummary = "", disabled, ...props }) => {
  const { isSwitching } = useSwitchNetwork();
  const { data: walletClient } = useWalletClient();
  const {
    write,
    isLoading: txIsLoading,
    isError: txIsError,
    isSuccess: txIsSuccess,
    error: txError,
    status: txStatus,
  } = useContractWrite(preparation.config);
  useEffect(() => {
    if (walletClient) preparation.refetch();
  }, [walletClient]);

  const isLoading = preparation.isFetching || preparation.isLoading || txIsLoading;

  // Build tooltip message and error state
  let tooltipMessage = "";
  let tooltipIsError = false;
  if (isLoading) tooltipMessage = "Loading...";
  else if (isSwitching) tooltipMessage = "Switching network...";
  else if (!walletClient) {
    tooltipIsError = true;
    tooltipMessage = "No wallet connected";
  } else if (preparation.error) {
    tooltipIsError = true;
    tooltipMessage = prettyErrorMessage(preparation.error);
  }

  return (
    <>
      <div className="relative flex flex-col">
        <Dialog>
          <Tooltip
            open={walletClient && preparation.isError && !isLoading && !isSwitching ? true : undefined}
          >
            <TooltipTrigger>
              <DialogTrigger asChild>
                <Button
                  {...props}
                  disabled={disabled || !walletClient || !write || isSwitching}
                  isLoading={isLoading}
                  // isError={isError}
                  // isSuccess={isSuccess}
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
