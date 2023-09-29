import { ChangeEvent, FC, useRef, useState } from "react";
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
  useLTokenBalanceOf,
  useLTokenDecimals,
  usePrepareLTokenInstantWithdrawal,
  usePrepareLTokenRequestWithdrawal,
} from "@/generated";
import { formatUnits, parseEther, parseUnits, zeroAddress } from "viem";
import { useContractAddress } from "@/hooks/useContractAddress";
import { TxButton } from "../ui/TxButton";
import { useWalletClient } from "wagmi";

interface Props extends React.ComponentPropsWithoutRef<typeof Dialog> {
  underlyingSymbol: string;
  onOpenChange?: React.ComponentPropsWithoutRef<typeof Dialog>["onOpenChange"];
}

export const WithdrawDialog: FC<Props> = ({ children, underlyingSymbol, onOpenChange }) => {
  const { data: walletClient } = useWalletClient();
  const lTokenAddress = useContractAddress(`L${underlyingSymbol}`);
  const { data: decimals } = useLTokenDecimals({ address: lTokenAddress! });
  const { data: balance } = useLTokenBalanceOf({
    address: lTokenAddress!,
    args: [walletClient?.account.address || zeroAddress],
    watch: true,
  });
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const inputEl = useRef<HTMLInputElement>(null);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0n);
  const instantWithdrawalalPreparation = usePrepareLTokenInstantWithdrawal({
    address: lTokenAddress!,
    args: [withdrawnAmount],
  });
  const requestWithdrawalPreparation = usePrepareLTokenRequestWithdrawal({
    address: lTokenAddress!,
    args: [withdrawnAmount],
    value: parseEther("0.003"),
  });

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
            {instantWithdrawalalPreparation.isError && (
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
            {(!instantWithdrawalalPreparation.isError && (
              <TxButton
                size="medium"
                preparation={instantWithdrawalalPreparation}
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
                // @ts-ignore
                preparation={requestWithdrawalPreparation}
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
