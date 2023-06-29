"use client";
import { FC, type ReactNode, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Spinner,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
  preparation: ReturnType<typeof usePrepareContractWrite>;
  transactionSummary?: string | ReactNode;
}

export const TxButton: FC<Props> = ({ preparation, transactionSummary = "", disabled, ...props }) => {
  const {
    write,
    isLoading: txIsLoading,
    isError,
    isSuccess,
    error: txError,
  } = useContractWrite(preparation.config);
  useEffect(() => {
    preparation.refetch();
  }, []);
  const isLoading = preparation.isFetching || preparation.isLoading || txIsLoading;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative flex flex-col">
          <Tooltip open={preparation.isError}>
            <TooltipTrigger>
              <Button
                {...props}
                disabled={disabled || !write}
                isLoading={isLoading}
                isError={isError}
                isSuccess={isSuccess}
                onClick={() => write!()}
              />
            </TooltipTrigger>
            {!isLoading && preparation.error && (
              <TooltipContent variant="destructive" side="bottom" sideOffset={4}>
                {/* @ts-ignore */}
                {preparation.error.details
                  ? // @ts-ignore
                    preparation.error.details!.split("'")[1]
                  : preparation.error.message}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </DialogTrigger>
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
