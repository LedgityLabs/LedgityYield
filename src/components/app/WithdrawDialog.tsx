"use client";

// Components
import {
  InstantWithdrawalTx,
  RequestWithdrawalTx,
} from "@/components/contracts";
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
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  useBalanceOf,
  useCanInstantWithdraw,
  useLTokenWithdrawalFeeInEth,
} from "@/hooks/contracts";
import useRestricted from "@/hooks/useRestricted";
import { useRef, useState } from "react";
// Function
import { formatUnits, parseUnits } from "viem";
// Types
import { LTokenInfo, TokenInfo } from "@/types";

export function WithdrawDialog({
  children,
  lTokenData,
  underlyingTokenData,
}: {
  children: React.ReactNode;
  lTokenData: LTokenInfo;
  underlyingTokenData: TokenInfo;
}) {
  const { currentAccount } = useWeb3Context();
  const lTokenBalance = useBalanceOf(lTokenData.address, currentAccount);

  const withdrawalFeeInEth = useLTokenWithdrawalFeeInEth(lTokenData.address);

  const inputEl = useRef<HTMLInputElement>(null);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0n);

  const canInstantWithdraw = useCanInstantWithdraw(
    lTokenData.address,
    currentAccount,
    withdrawnAmount,
  );

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
              <DialogTitle>Withdraw {underlyingTokenData.symbol}</DialogTitle>
              <DialogDescription>
                <div>
                  <span className="mb-1 inline-block text-xl font-semibold text-primary">
                    You will receive {underlyingTokenData.symbol} in a 1:1
                    ratio.
                  </span>
                  <br />
                  Note that you won't receive yield anymore.
                </div>

                {!canInstantWithdraw && (
                  <div className="flex items-stretch justify-stretch gap-2 rounded-2xl bg-fg/[7%] p-4 text-fg/80">
                    <div className="flex items-center justify-center border-r border-r-fg/20 pr-4">
                      <i className="ri-information-line text-2xl" />
                    </div>
                    <div className="pl-4 text-left">
                      Your request will be{" "}
                      <span className="font-semibold">queued</span> and
                      auto-processed in{" "}
                      <span className="font-semibold">1-2 working days</span>.
                    </div>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <div className="mt-6 flex flex-nowrap items-end justify-center gap-4 mb-3 mr-3 ml-3">
                <AmountInput
                  ref={inputEl}
                  maxValue={lTokenBalance}
                  decimals={lTokenData.decimals}
                  symbol={lTokenData.symbol}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setWithdrawnAmount(
                      parseUnits(e.target.value, lTokenData.decimals),
                    )
                  }
                />

                {canInstantWithdraw ? (
                  <InstantWithdrawalTx
                    buttonText="Withdraw now"
                    contractAddress={lTokenData.address}
                    disabled={!withdrawnAmount}
                    params={{
                      symbol: lTokenData.symbol,
                      amount: formatUnits(withdrawnAmount, lTokenData.decimals),
                      tokenDecimals: lTokenData.decimals,
                    }}
                    approveChecks={[
                      {
                        symbol: lTokenData.symbol,
                        tokenDecimals: lTokenData.decimals,
                        spender: lTokenData.address,
                        amount: formatUnits(
                          withdrawnAmount,
                          lTokenData.decimals,
                        ),
                      },
                    ]}
                  />
                ) : (
                  <RequestWithdrawalTx
                    buttonText="Request Withdrawal"
                    contractAddress={lTokenData.address}
                    disabled={!withdrawnAmount}
                    params={{
                      symbol: lTokenData.symbol,
                      amount: formatUnits(withdrawnAmount, lTokenData.decimals),
                      tokenDecimals: lTokenData.decimals,
                      msgValue: withdrawalFeeInEth,
                    }}
                    approveChecks={[
                      {
                        symbol: lTokenData.symbol,
                        tokenDecimals: lTokenData.decimals,
                        spender: lTokenData.address,
                        amount: formatUnits(
                          withdrawnAmount,
                          lTokenData.decimals,
                        ),
                      },
                    ]}
                  />
                )}
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
