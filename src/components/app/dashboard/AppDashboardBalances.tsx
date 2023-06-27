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
import { useLToken } from "@/hooks/useLTokenAddress";
import { useLTokenBalanceOf, useLTokenDecimals, useLTokenUnderlying } from "@/generated";
import { useDApp } from "@/hooks";
import { LTokenId } from "../../../../hardhat/deployments";

const LTokenBalance: FC<{ lTokenId: LTokenId }> = ({ lTokenId, ...props }) => {
  const { walletClient } = useDApp();
  const address = useLToken(lTokenId);
  const { data: balance } = useLTokenBalanceOf({
    address: address,
    args: [walletClient ? walletClient.account.address : "0x0"],
  });
  const { data: decimals } = useLTokenDecimals({ address: address });
  const underlyingSymbol = lTokenId.slice(1);

  return (
    <li className="flex justify-between  items-center w-full" {...props}>
      <div className="flex gap-2 items-center font-medium text-fg/[0.85]">
        <TokenLogo symbol={lTokenId} wrapped={true} size={30} />
        {lTokenId}
      </div>
      <div className="flex gap-2 items-center">
        <Amount value={balance!} decimals={decimals} className="font-bold pr-2" />
        <Tooltip>
          <TooltipTrigger>
            <DepositDialog tokenSymbol={underlyingSymbol}>
              <Button size="tiny" className="w-8 h-8">
                <i className="ri-add-fill text-lg"></i>
              </Button>
            </DepositDialog>
          </TooltipTrigger>
          <TooltipContent>
            Deposit {underlyingSymbol} against {lTokenId}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <WithdrawDialog tokenSymbol={underlyingSymbol}>
              <Button variant="outline" size="tiny" className="w-[calc(2rem+3px)] h-[calc(2rem+3px)]">
                <i className="ri-subtract-fill text-lg"></i>
              </Button>
            </WithdrawDialog>
          </TooltipTrigger>
          <TooltipContent>
            Withdraw {underlyingSymbol} from {lTokenId}
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
      <ul className="w-full h-full flex flex-col justify-center gap-5 pl-3 pr-2">
        {lTokens.map((lToken) => (
          <LTokenBalance key={lToken} lTokenId={lToken} />
        ))}
      </ul>
    </Card>
  );
};
