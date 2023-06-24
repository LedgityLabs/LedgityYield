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
import { TokenSymbol } from "@/lib/tokens";
import React from "react";
import { twMerge } from "tailwind-merge";
import { DepositDialog } from "../DepositDialog";
import { WithdrawDialog } from "../WithdrawDialog";

export const AppDashboardBalances: React.PropsWithoutRef<typeof Card> = ({ className }) => {
  interface InvestmentData {
    symbol: `L${TokenSymbol}`;
    wrappedSymbol: TokenSymbol;
    balance: number;
  }
  const investmentData: InvestmentData[] = [
    {
      symbol: "LUSDC",
      wrappedSymbol: "USDC",
      balance: 87330,
    },
    {
      symbol: "LEUROC",
      wrappedSymbol: "EUROC",
      balance: 0,
    },
  ];

  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex flex-col justify-center items-center p-4", className)}
    >
      <h2 className="text-center text-lg font-medium text-indigo-900/80">L-Tokens balances</h2>
      <ul className="w-full h-full flex flex-col justify-center gap-5 pl-3 pr-2">
        {investmentData.map((token) => (
          <li key={token.symbol} className="flex justify-between  items-center w-full ">
            <div className="flex gap-2 items-center font-medium text-fg/[0.85]">
              <TokenLogo symbol={token.wrappedSymbol} wrapped={true} size={30} />
              {token.symbol}
            </div>
            <div className="flex gap-2 items-center">
              <Amount value={token.balance} className="font-bold pr-2" />
              <Tooltip>
                <TooltipTrigger>
                  <DepositDialog tokenSymbol={token.wrappedSymbol}>
                    <Button size="tiny" className="w-8 h-8">
                      <i className="ri-add-fill text-lg"></i>
                    </Button>
                  </DepositDialog>
                </TooltipTrigger>
                <TooltipContent>
                  Deposit {token.wrappedSymbol} against {token.symbol}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <WithdrawDialog tokenSymbol={token.wrappedSymbol}>
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
                  Withdraw {token.wrappedSymbol} from {token.symbol}
                </TooltipContent>
              </Tooltip>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};
