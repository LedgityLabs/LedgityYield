"use client";
import { ChangeEvent, FC, useRef, useState, memo } from "react";
import {
  AmountInput,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  AllowanceTxButton,
} from "@/components/ui";
import {
  useGenericErc20BalanceOf,
  useLTokenDecimals,
  useLTokenUnderlying,
  usePrepareLTokenDeposit,
} from "../../generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import { useWalletClient } from "wagmi";

interface Props extends React.ComponentPropsWithoutRef<typeof DialogContent> {
  underlyingSymbol: string;
  onOpenChange?: React.ComponentPropsWithoutRef<typeof Dialog>["onOpenChange"];
}

export const DepositDialog: FC<Props> = ({ children, underlyingSymbol, onOpenChange }) => {
  const { data: walletClient } = useWalletClient();
  const lTokenAddress = useContractAddress(`L${underlyingSymbol}`);
  const { data: decimals } = useLTokenDecimals({ address: lTokenAddress! });
  const { data: underlyingAddress } = useLTokenUnderlying({ address: lTokenAddress! });
  const { data: underlyingBalance } = useGenericErc20BalanceOf({
    address: underlyingAddress,
    args: [walletClient?.account.address || zeroAddress],
    watch: true,
  });

  const inputEl = useRef<HTMLInputElement>(null);
  const [depositedAmount, setDepositedAmount] = useState(0n);
  const preparation = usePrepareLTokenDeposit({
    address: lTokenAddress!,
    args: [depositedAmount],
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
          <DialogTitle>Deposit {underlyingSymbol}</DialogTitle>
          <DialogDescription>
            You will receive L{underlyingSymbol} in a 1:1 ratio.
            <br />
            <br />
            As soon as you hold some L{underlyingSymbol}, you start earning annouced yields on
            those. There is no need to stake or else, your balance will magically grow through time.
            Note that your rewards are auto-compounded.
            <br />
            <br />
            At any time, you&apos;ll be able to withdraw your L{underlyingSymbol} tokens against{" "}
            {underlyingSymbol} in a 1:1 ratio.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="items-end mt-8">
          <AmountInput
            ref={inputEl}
            maxValue={underlyingBalance}
            decimals={decimals}
            symbol={underlyingSymbol}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDepositedAmount(parseUnits(e.target.value, decimals!))
            }
          />
          <AllowanceTxButton
            size="medium"
            preparation={preparation}
            token={underlyingAddress!}
            spender={lTokenAddress}
            amount={depositedAmount}
            transactionSummary={`Deposit ${formatUnits(
              depositedAmount,
              decimals!,
            )} ${underlyingSymbol} against ${formatUnits(
              depositedAmount,
              decimals!,
            )} L${underlyingSymbol}`}
          >
            Deposit
          </AllowanceTxButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
