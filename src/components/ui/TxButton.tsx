"use client";
import { FC, type ReactNode, useEffect } from "react";
import { Button } from "./Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";
import { Spinner } from "./Spinner";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";
import { useContractWrite, usePrepareContractWrite, useWalletClient } from "wagmi";
import { useSwitchNetwork } from "@/hooks";
import { prettyContractsErrors } from "@/lib/exceptions";

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
    isError,
    isSuccess,
    error: txError,
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
    tooltipMessage = "No wallet connected";
    tooltipIsError = true;
  } else if (preparation.error) {
    // @ts-ignore
    tooltipMessage = preparation.error.details
      ? // @ts-ignore
        preparation.error.details!.split("'")[1]
      : preparation.error.message;
    const prettyError = prettyContractsErrors[tooltipMessage];
    if (prettyError) tooltipMessage = prettyError;

    tooltipIsError = true;
  }

  return (
    <Dialog>
      <div className="relative flex flex-col">
        <Tooltip
          open={walletClient && preparation.isError && !isLoading && !isSwitching ? true : undefined}
        >
          <TooltipTrigger>
            <DialogTrigger asChild>
              <Button
                {...props}
                disabled={disabled || !walletClient || !write || isSwitching}
                isLoading={isLoading}
                isError={isError}
                isSuccess={isSuccess}
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
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve transaction in your wallet</DialogTitle>
          <DialogDescription className="flex flex-col justify-center items-center gap-3 pt-4">
            {transactionSummary}
            <Spinner />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
