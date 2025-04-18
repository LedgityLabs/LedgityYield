"use client";

// Components
import { DepositTx, DepositAndWrapTx } from "@/components/contracts";
import {
  AmountInput,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Spinner,
  TokenLogo,
} from "@/components/ui";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
// Hooks
import { useAppDataContext } from "@/hooks/context/AppDataContextProvider";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useBalanceOf } from "@/hooks/contracts";
import useRestricted from "@/hooks/useRestricted";
import { useRef, useState } from "react";
import { ReactNode } from "react";
// Function
import { formatUnits, parseUnits } from "viem";
// Types
import { LTokenInfo, WLTokenInfo, TokenInfo } from "@/types";

export function DepositDialog({
  isOpen,
  setIsOpen,
  lTokenData,
  wLTokenData,
  underlyingTokenData,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: ReactNode;
  lTokenData: LTokenInfo | undefined;
  wLTokenData: WLTokenInfo | undefined;
  underlyingTokenData: TokenInfo | undefined;
}) {
  const { referralCode } = useAppDataContext();
  const { currentAccount } = useWeb3Context();
  const underlyingBalance = useBalanceOf(
    underlyingTokenData?.address,
    currentAccount,
  );

  wLTokenData = {
    chainId: 1,
    totalSupply: 10000000000000n,
    lToken: "0x0000000000000000000000000000000000000000" as any,
    address: "0x0000000000000000000000000000000000000000" as any,
    decimals: 6,
    symbol: "lyUSD",
    name: "Wrapped LUSDC",
    exchangeRate: 1030000000000000000000000000n,
    balance: 0n,
  };

  const inputEl = useRef<HTMLInputElement>(null);
  const [depositedAmount, setDepositedAmount] = useState(0n);
  const [toWrapped, setToWrapped] = useState(true);

  // Fetch restriction status
  const { isRestricted, isLoading: isRestrictionLoading } = useRestricted();

  const isLoading = isRestrictionLoading || !lTokenData || !underlyingTokenData;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <VisuallyHidden id="deposit modal">
        <DialogTitle> </DialogTitle>
      </VisuallyHidden>

      <DialogContent aria-describedby={"deposit modal"}>
        {isLoading && (
          <div className="py-8 px-16 text-2xl">
            <Spinner />
          </div>
        )}

        {!isLoading && isRestricted && (
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

        {!isLoading && !isRestricted && (
          <>
            <DialogHeader>
              <DialogTitle>Deposit {underlyingTokenData.symbol}</DialogTitle>
              <DialogDescription>
                <div className="text-sm">
                  Choose what asset you want to receive:
                </div>

                <div className="flex items-center space-x-4 w-full">
                  {wLTokenData && (
                    <Button
                      variant={toWrapped ? "primary" : "outline"}
                      onClick={() => setToWrapped(true)}
                      className={`flex-1 flex items-center justify-center`}
                    >
                      <TokenLogo
                        symbol={wLTokenData.symbol}
                        size={35}
                        className="mx-1 p-1"
                      />
                      <span className="ml-1">{wLTokenData.symbol}</span>
                    </Button>
                  )}

                  <Button
                    variant={!toWrapped ? "primary" : "outline"}
                    onClick={() => setToWrapped(false)}
                    className={`flex-1 flex items-center justify-center`}
                  >
                    <TokenLogo
                      symbol={lTokenData.symbol}
                      size={35}
                      className="mx-1 p-1"
                    />
                    <span className="ml-1">{lTokenData.symbol}</span>
                  </Button>
                </div>

                <div className="flex gap-2 justify-stretch items-stretch bg-fg/[7%] text-fg/80 rounded-2xl p-4">
                  <div className="flex justify-center items-center pr-4 border-r border-r-fg/20">
                    <i className="ri-information-line text-2xl" />
                  </div>
                  {wLTokenData && toWrapped ? (
                    <div className="pl-4 text-left">
                      <span className="font-bold">
                        You will receive {wLTokenData.symbol}, the non rebasing
                        Liquid Yield Token.
                      </span>{" "}
                      Your yield is reflected directly in the increasing value
                      of
                      {wLTokenData.symbol} over time. There’s no need to stake,
                      lock, or claim — rewards are automatically accrued through
                      the token's price appreciation.
                    </div>
                  ) : (
                    <div className="pl-4 text-left">
                      <span className="font-bold">
                        You will receive {lTokenData.symbol} in a 1:1 ratio.
                      </span>{" "}
                      Your {lTokenData.symbol} balance will automatically grow
                      through time to reflect your rewards. There is no need to
                      stake, lock or claim anything.
                    </div>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <div className="mt-6 flex items-end justify-between gap-4 mb-3 w-full">
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

                {wLTokenData && toWrapped ? (
                  <DepositAndWrapTx
                    buttonText="Deposit"
                    contractAddress={wLTokenData.address}
                    disabled={!depositedAmount}
                    params={{
                      symbol: underlyingTokenData.symbol,
                      amount: formatUnits(
                        depositedAmount,
                        underlyingTokenData.decimals,
                      ),
                      tokenDecimals: underlyingTokenData.decimals,
                    }}
                    approveChecks={[
                      {
                        token: underlyingTokenData.address,
                        symbol: underlyingTokenData.symbol,
                        tokenDecimals: underlyingTokenData.decimals,
                        spender: wLTokenData.address,
                        amount: formatUnits(
                          depositedAmount,
                          underlyingTokenData.decimals,
                        ),
                      },
                    ]}
                  />
                ) : (
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
                        token: underlyingTokenData.address,
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
                )}
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
