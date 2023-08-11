import { ChangeEvent, FC, useRef, useState } from "react";
import {
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
    value: parseEther("0.004"),
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
            You will receive {underlyingSymbol} in a 1:1 ratio.
            <br />
            <br />
            {/* If instant withdrawal is not posssible actually, display info message */}
            {instantWithdrawalalPreparation.isError && (
              <span className="inline-block bg-blue-100 rounded-2xl p-6 pt-4">
                <h4 className="text-blue-500 text-lg font-semibold mb-2">
                  <i className="ri-information-line"></i> Your request will be queued
                </h4>
                <p>
                  Only a small portion of deposited funds are kept on the contract as they are
                  invested off-chain. Actually, the contract doesn&apos;t hold enough funds to cover
                  your request plus already queued ones.
                  <br />
                  <br />
                  Once a request has been queued, it will be automatically processed as soon as the
                  Ledgity financial team would have repatriated required funds on the contract.
                  <br />
                  <br />
                  <span className="font-semibold">
                    You&apos;ll be invited to pay a small 0.004ETH
                  </span>{" "}
                  fee to cover the gas cost of the transaction that will process your withdrawal
                  when the time comes.
                </p>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="items-end mt-8 flex-nowrap">
          <AmountInput
            ref={inputEl}
            maxValue={balance}
            decimals={decimals}
            symbol={`L${underlyingSymbol}`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setWithdrawnAmount(parseUnits(e.target.value, decimals!));
              if (hasUserInteracted === false) setHasUserInteracted(true);
              if (e.target.value === "") setHasUserInteracted(false);
            }}
          />
          {/* If instant withdrawal is possible actually */}
          {(!instantWithdrawalalPreparation.isError && (
            <TxButton
              size="medium"
              preparation={instantWithdrawalalPreparation}
              className="relative -top-[1.5px]"
              disabled={withdrawnAmount === 0n}
              transactionSummary={
                <p>
                  Withdraw {formatUnits(withdrawnAmount, decimals!)} L{underlyingSymbol} against{" "}
                  {formatUnits(withdrawnAmount, decimals!)} {underlyingSymbol}
                </p>
              }
              hasUserInteracted={hasUserInteracted}
            >
              Withdraw
            </TxButton>
          )) || (
            <TxButton
              size="medium"
              //@ts-ignore
              preparation={requestWithdrawalPreparation}
              className="relative -top-[1.5px]"
              disabled={withdrawnAmount === 0n}
              transactionSummary={
                <p>
                  Withdraw {formatUnits(withdrawnAmount, decimals!)} L{underlyingSymbol} against{" "}
                  {formatUnits(withdrawnAmount, decimals!)} {underlyingSymbol}
                </p>
              }
              hasUserInteracted={hasUserInteracted}
            >
              Request
            </TxButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
