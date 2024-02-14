import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import {
  Amount,
  AmountInput,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import {
  useReadLTokenBalanceOf,
  useReadLTokenDecimals,
  useSimulateLTokenInstantWithdrawal,
  useSimulateLTokenRequestWithdrawal,
} from "@/generated";
import { formatUnits, parseEther, parseUnits, zeroAddress } from "viem";
import { useContractAddress } from "@/hooks/useContractAddress";
import { TxButton } from "../ui/TxButton";
import { UseSimulateContractReturnType, useAccount, useBlockNumber } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { SimulateContractReturnType } from "@wagmi/core";

interface Props extends React.ComponentPropsWithoutRef<typeof Dialog> {
  underlyingSymbol: string;
  onOpenChange?: React.ComponentPropsWithoutRef<typeof Dialog>["onOpenChange"];
}

export const WithdrawDialog: FC<Props> = ({ children, underlyingSymbol, onOpenChange }) => {
  const account = useAccount();
  const lTokenAddress = useContractAddress(`L${underlyingSymbol}`);
  const { data: decimals } = useReadLTokenDecimals({ address: lTokenAddress! });
  const { data: balance, queryKey } = useReadLTokenBalanceOf({
    address: lTokenAddress!,
    args: [account.address || zeroAddress],
  });
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const inputEl = useRef<HTMLInputElement>(null);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0n);
  const instantWithdrawalPreparation = useSimulateLTokenInstantWithdrawal({
    address: lTokenAddress!,
    args: [withdrawnAmount],
  });
  const requestWithdrawalPreparation = useSimulateLTokenRequestWithdrawal({
    address: lTokenAddress!,
    args: [withdrawnAmount],
    value: parseEther("0.003"),
  });

  // Refresh some data every 5 blocks
  const queryKeys = [queryKey];
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const queryClient = useQueryClient();
  useEffect(() => {
    if (blockNumber && blockNumber % 5n === 0n)
      queryKeys.forEach((k) => queryClient.invalidateQueries({ queryKey: k }));
  }, [blockNumber, ...queryKeys]);

  if (!lTokenAddress) return null;
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputEl.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>Witdhraw {underlyingSymbol}</DialogTitle>
          <DialogDescription>
            <div>
              <span className="mb-1 inline-block text-xl font-semibold text-primary">
                You will receive {underlyingSymbol} in a 1:1 ratio.
              </span>
              <br />
              Note that you won&apos;t receive yield anymore.
            </div>
            {/* If instant withdrawal is not posssible actually, display info message */}
            {instantWithdrawalPreparation.isError && (
              <div className="flex items-stretch justify-stretch gap-2 rounded-2xl bg-fg/[7%] p-4 text-fg/80">
                <div className="flex items-center justify-center border-r border-r-fg/20 pr-4">
                  <i className="ri-information-line text-2xl" />
                </div>
                <div className="pl-4 text-left">
                  Your request will be <span className="font-semibold">queued</span> and
                  auto-processed in <span className="font-semibold">1-2 working days</span>.
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="mt-6 flex flex-nowrap items-end justify-center gap-4 mb-3 mr-3 ml-3">
            <AmountInput
              ref={inputEl}
              maxValue={balance}
              decimals={decimals}
              symbol={`L${underlyingSymbol}`}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setWithdrawnAmount(parseUnits(e.target.value, decimals!));
                if (hasUserInteracted === true && e.target.value === "")
                  setHasUserInteracted(false);
                else if (hasUserInteracted === false) setHasUserInteracted(true);
              }}
            />
            {/* If instant withdrawal is possible actually */}
            {(!instantWithdrawalPreparation.isError && (
              <TxButton
                size="medium"
                preparation={instantWithdrawalPreparation as UseSimulateContractReturnType}
                className="relative -top-[1.5px]"
                disabled={withdrawnAmount === 0n}
                hasUserInteracted={hasUserInteracted}
                transactionSummary={
                  <span>
                    Withdraw{" "}
                    <Amount
                      value={withdrawnAmount}
                      decimals={decimals}
                      suffix={"L" + underlyingSymbol}
                      displaySymbol={true}
                      className="whitespace-nowrap text-indigo-300 underline decoration-indigo-300 decoration-2 underline-offset-4"
                    />{" "}
                    against{" "}
                    <Amount
                      value={withdrawnAmount}
                      decimals={decimals}
                      suffix={underlyingSymbol}
                      displaySymbol={true}
                      className="whitespace-nowrap text-indigo-300 underline decoration-indigo-300 decoration-2 underline-offset-4"
                    />{" "}
                  </span>
                }
              >
                Withdraw
              </TxButton>
            )) || (
              <TxButton
                size="medium"
                preparation={requestWithdrawalPreparation as UseSimulateContractReturnType}
                className="relative -top-[1.5px]"
                disabled={withdrawnAmount === 0n}
                hasUserInteracted={hasUserInteracted}
                transactionSummary={
                  <span>
                    Request withdrawal of{" "}
                    <Amount
                      value={withdrawnAmount}
                      decimals={decimals}
                      suffix={"L" + underlyingSymbol}
                      displaySymbol={true}
                      className="whitespace-nowrap text-indigo-300 underline decoration-indigo-300 decoration-2 underline-offset-4"
                    />{" "}
                    against{" "}
                    <Amount
                      value={withdrawnAmount}
                      decimals={decimals}
                      suffix={underlyingSymbol}
                      displaySymbol={true}
                      className="whitespace-nowrap text-indigo-300 underline decoration-indigo-300 decoration-2 underline-offset-4"
                    />{" "}
                  </span>
                }
              >
                Request
              </TxButton>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
