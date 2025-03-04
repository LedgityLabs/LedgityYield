"use client";

// Components
import { DepositTx } from "@/components/contracts";
import {
  AmountInput,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Spinner,
} from "@/components/ui";
// Hooks
import { useAppDataContext } from "@/hooks/context/AppDataContextProvider";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useBalanceOf } from "@/hooks/contracts";
import useRestricted from "@/hooks/useRestricted";
import { useRef, useState } from "react";
// Function
import { formatUnits, parseUnits } from "viem";
// Types
import { LTokenInfo, TokenInfo } from "@/types";

export function DepositDialog({
  children,
  lTokenData,
  underlyingTokenData,
}: {
  children: React.ReactNode;
  lTokenData: LTokenInfo;
  underlyingTokenData: TokenInfo;
}) {
  const { referralCode } = useAppDataContext();
  const { currentAccount } = useWeb3Context();
  const underlyingBalance = useBalanceOf(
    underlyingTokenData.address,
    currentAccount,
  );

  const inputEl = useRef<HTMLInputElement>(null);
  const [depositedAmount, setDepositedAmount] = useState(0n);

  // Fetch restriction status
  const { isRestricted, isLoading: isRestrictionLoading } = useRestricted();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputEl.current?.focus();
        }}
      >
        {isRestrictionLoading && (
          <div className="py-8 px-16 text-2xl">
            <Spinner />
          </div>
        )}

        {!isRestrictionLoading && isRestricted && (
          <div className="flex flex-col gap-5 text-lg justify-center items-center">
            <span className="text-[5rem] leading-[5rem]">🤷</span>
            <span className="text-center font-semibold">
              Oops, you're not authorized to access this feature
            </span>
            <span className="text-base">
              This may be due to your location or on-chain activity. <br />
              If you think this is an error, please contact our support team at{" "}
              <a
                href="mailto:contact@ledgity.com"
                className="text-primary underline"
              >
                contact@ledgity.com
              </a>
            </span>
          </div>
        )}

        {!isRestrictionLoading && !isRestricted && (
          <>
            <DialogHeader>
              <DialogTitle>Deposit {underlyingTokenData.symbol}</DialogTitle>
              <DialogDescription>
                <span className="text-primary font-semibold text-xl">
                  You will receive {lTokenData.symbol} in a 1:1 ratio.
                </span>
                <div className="flex gap-2 justify-stretch items-stretch bg-fg/[7%] text-fg/80 rounded-2xl p-4">
                  <div className="flex justify-center items-center pr-4 border-r border-r-fg/20">
                    <i className="ri-information-line text-2xl" />
                  </div>
                  <div className="pl-4 text-left">
                    <span className="font-bold">How to get the yield?</span>{" "}
                    Your {lTokenData.symbol} balance will automatically grow
                    through time to reflect your rewards. There is no need to
                    stake, lock or claim anything.
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className="flex gap-4 flex-nowrap items-end justify-center mt-6 mb-3 mr-3 ml-3">
                <AmountInput
                  ref={inputEl}
                  maxValue={underlyingBalance}
                  decimals={underlyingTokenData.decimals}
                  symbol={underlyingTokenData.symbol}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDepositedAmount(
                      parseUnits(e.target.value, underlyingTokenData.decimals),
                    )
                  }
                />
                <DepositTx
                  buttonText="Deposit"
                  contractAddress={lTokenData.address}
                  disabled={!depositedAmount}
                  params={{
                    symbol: underlyingTokenData.symbol,
                    amount: formatUnits(
                      depositedAmount,
                      underlyingTokenData.decimals,
                    ),
                    tokenDecimals: underlyingTokenData.decimals,
                    refCode: referralCode,
                  }}
                  approveChecks={[
                    {
                      symbol: underlyingTokenData.symbol,
                      tokenDecimals: underlyingTokenData.decimals,
                      spender: lTokenData.address,
                      amount: formatUnits(
                        depositedAmount,
                        underlyingTokenData.decimals,
                      ),
                    },
                  ]}
                />
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
