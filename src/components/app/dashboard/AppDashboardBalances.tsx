"use client";
import {
  Amount,
  Card,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TokenLogo,
  Button,
} from "@/components/ui";
import React, { FC } from "react";
import { twMerge } from "tailwind-merge";
import { DepositDialog } from "../DepositDialog";
import { WithdrawDialog } from "../WithdrawDialog";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { useContractAddress } from "@/hooks/useContractAddress";
import { useLTokenBalanceOf, useLTokenDecimals, useLTokenUnderlying } from "@/generated";
import { useWalletClient } from "wagmi";

const LTokenBalance: FC<{ lTokenSymbol: string }> = ({ lTokenSymbol, ...props }) => {
  const { data: walletClient } = useWalletClient();
  const address = useContractAddress(lTokenSymbol);
  const { data: balance } = useLTokenBalanceOf({
    address: address!,
    args: [walletClient ? walletClient.account.address : "0x0"],
    watch: true,
  });
  const { data: decimals } = useLTokenDecimals({ address: address! });
  const underlyingSymbol = lTokenSymbol.slice(1);

  return (
    <li className="flex justify-between  items-center w-full" {...props}>
      <div className="flex gap-2 items-center font-medium text-fg/[0.85]">
        <TokenLogo symbol={lTokenSymbol} wrapped={true} size={30} />
        {lTokenSymbol}
      </div>
      <div className="flex gap-2 items-center">
        <Amount
          value={balance!}
          decimals={decimals}
          className="font-bold pr-2"
          suffix={lTokenSymbol}
          displaySymbol={false}
        />
        <Tooltip>
          <TooltipTrigger>
            <DepositDialog underlyingSymbol={underlyingSymbol}>
              <Button size="tiny" className="w-8 h-8">
                <i className="ri-add-fill text-lg"></i>
              </Button>
            </DepositDialog>
          </TooltipTrigger>
          <TooltipContent>
            Deposit {underlyingSymbol} against {lTokenSymbol}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <WithdrawDialog underlyingSymbol={underlyingSymbol}>
              <Button
                variant="outline"
                size="tiny"
                className="w-[calc(2rem+3px)] h-[calc(2rem+3px)]"
              >
                <i className="ri-subtract-fill text-lg"></i>
              </Button>
            </WithdrawDialog>
          </TooltipTrigger>
          <TooltipContent>
            Withdraw {underlyingSymbol} from {lTokenSymbol}
          </TooltipContent>
        </Tooltip>
      </div>
    </li>
  );
};
export const AppDashboardBalances: React.PropsWithoutRef<typeof Card> = ({ className }) => {
  const lTokens = useAvailableLTokens();

  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex flex-col justify-center items-center p-4", className)}
    >
      <h2 className="text-center text-lg font-medium text-indigo-900/80">L-Tokens balances</h2>
      {(lTokens.length !== 0 && (
        <ul className="w-full h-full flex flex-col justify-center gap-5 pl-3 pr-2">
          {lTokens.map((lToken) => (
            <LTokenBalance key={lToken} lTokenSymbol={lToken} />
          ))}
        </ul>
      )) ||
        "No L-Tokens available"}
    </Card>
  );
};
