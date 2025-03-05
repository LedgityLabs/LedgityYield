"use client";

import {
  Amount,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Spinner,
} from "@/components/ui";

export function TxModal({
  isOpen,
  setIsOpen,
  txStates,
  txContent = "",
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  txStates: {
    isWriteError: boolean;
    isWriteSuccess: boolean;
    isConfirming: boolean;
    isConfirmError: boolean;
    isConfirmSuccess: boolean;
  };
  txContent?: string | React.ReactNode;
}) {
  const {
    isWriteError,
    isWriteSuccess,
    isConfirming,
    isConfirmError,
    isConfirmSuccess,
  } = txStates;

  if (!isOpen) return <></>;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative flex flex-col w-full">
        <DialogContent className="px-0 sm:px-0">
          <DialogHeader>
            <DialogTitle>Ongoing transaction</DialogTitle>
            <DialogDescription className="flex flex-col items-center justify-center gap-3 px-3">
              <div className="mb-2 w-[calc(100%-4px)] whitespace-normal bg-fg/90 px-10 py-10 text-center text-lg font-semibold text-bg">
                {txContent || "Transaction in progress"}
              </div>

              <ul className="relative my-5 flex flex-col gap-8 before:-z-1 before:absolute before:bottom-10 before:left-[calc(1.25rem-1.5px)] before:top-10 before:border-l-[3px] before:border-slate-300">
                <li className="flex items-center justify-start gap-2">
                  {/* Write Transaction - Pending State */}
                  {!isWriteError && !isWriteSuccess && (
                    <>
                      <Card
                        radius="full"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-xl before:bg-slate-300 before:bg-primary/75"
                      >
                        <span className="font-bold text-primary-fg">
                          <Spinner />
                        </span>
                      </Card>
                      <p className="text-lg font-medium text-slate-400 text-fg/90">
                        Sign transaction from your wallet
                      </p>
                    </>
                  )}

                  {/* Write Transaction - Error State */}
                  {isWriteError && !isWriteSuccess && (
                    <>
                      <Card
                        radius="full"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-xl before:bg-slate-300 before:bg-red-500/75"
                      >
                        <span className="font-bold text-primary-fg">
                          <i className="ri-close-fill text-xl" />
                        </span>
                      </Card>
                      <p className="text-lg font-medium text-slate-400 text-red-600/75">
                        Wallet rejected the request
                      </p>
                    </>
                  )}

                  {/* Write Transaction - Success State */}
                  {isWriteSuccess && (
                    <>
                      <Card
                        radius="full"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-xl before:bg-slate-300 before:bg-green-500/75"
                      >
                        <span className="font-bold text-primary-fg">
                          <i className="ri-check-fill text-xl" />
                        </span>
                      </Card>
                      <p className="text-lg font-medium text-slate-400 opacity-80 grayscale-[100%]">
                        Wallet signature successful
                      </p>
                    </>
                  )}
                </li>

                <li className="flex items-center justify-start gap-2">
                  {/* Confirmation - Pending State */}
                  {isConfirming && !isConfirmError && !isConfirmSuccess && (
                    <>
                      <Card
                        radius="full"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-xl before:bg-slate-300 before:bg-primary/75"
                      >
                        <span className="font-bold text-primary-fg">
                          <Spinner />
                        </span>
                      </Card>
                      <p className="text-lg font-medium text-slate-400 text-fg/90">
                        Wait for network confirmation
                      </p>
                    </>
                  )}

                  {/* Confirmation - Error State */}
                  {isConfirmError && !isConfirmSuccess && (
                    <>
                      <Card
                        radius="full"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-xl before:bg-slate-300 before:bg-red-500/75"
                      >
                        <span className="font-bold text-primary-fg">
                          <i className="ri-close-fill text-xl" />
                        </span>
                      </Card>
                      <p className="text-lg font-medium text-slate-400 text-red-600/75">
                        Transaction failed
                      </p>
                    </>
                  )}

                  {/* Confirmation - Success State */}
                  {isConfirmSuccess && (
                    <>
                      <Card
                        radius="full"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-xl before:bg-slate-300 before:bg-green-500/75"
                      >
                        <span className="font-bold text-primary-fg">
                          <i className="ri-check-fill text-xl" />
                        </span>
                      </Card>
                      <p className="text-lg font-medium text-slate-400 opacity-80 grayscale-[100%]">
                        Transaction succeeded
                      </p>
                    </>
                  )}
                </li>
              </ul>

              {((isWriteSuccess && isConfirmSuccess) ||
                (!isWriteSuccess && (isWriteError || isConfirmError))) && (
                <p className="font-semibold">
                  You can now safely close this modal
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </div>
    </Dialog>
  );
}
