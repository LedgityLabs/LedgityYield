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
  Amount,
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
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

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
            <span className="text-primary font-semibold text-xl">
              You will receive L{underlyingSymbol} in a 1:1 ratio.
            </span>
            <br />
            <br />
            <div className="flex gap-2 justify-stretch items-stretch bg-fg/[7%] text-fg/80 rounded-2xl p-4">
              <div className="flex justify-center items-center pr-4 border-r border-r-fg/20">
                <i className="ri-information-line text-2xl" />
              </div>
              <div className="pl-4">
                <span className="font-bold">How to get the yield?</span> Your L{underlyingSymbol}{" "}
                balance will magically grow through time to reflect your rewards. There is no need
                to stake, lock or claim anything.
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex gap-4 flex-nowrap items-end justify-center mt-6">
            <AmountInput
              ref={inputEl}
              maxValue={underlyingBalance}
              decimals={decimals}
              symbol={underlyingSymbol}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDepositedAmount(parseUnits(e.target.value, decimals!));
                if (hasUserInteracted === false) setHasUserInteracted(true);
                if (e.target.value === "") setHasUserInteracted(false);
              }}
            />
            <AllowanceTxButton
              size="medium"
              preparation={preparation}
              token={underlyingAddress!}
              spender={lTokenAddress}
              amount={depositedAmount}
              disabled={depositedAmount === 0n}
              transactionSummary={
                <span>
                  Deposit{" "}
                  <Amount
                    value={depositedAmount}
                    decimals={decimals}
                    suffix={underlyingSymbol}
                    displaySymbol={true}
                    className="text-indigo-300 underline underline-offset-4 decoration-indigo-300 decoration-2"
                  />{" "}
                  against{" "}
                  <Amount
                    value={depositedAmount}
                    decimals={decimals}
                    suffix={"L" + underlyingSymbol}
                    displaySymbol={true}
                    className="text-indigo-300 underline underline-offset-4 decoration-indigo-300 decoration-2"
                  />
                </span>
              }
            >
              Deposit
            </AllowanceTxButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
