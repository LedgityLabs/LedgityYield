"use client";

import {
  Amount,
  Button,
  TokenLogo,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { DepositDialog } from "../DepositDialog";
import { WithdrawDialog } from "../WithdrawDialog";
// Context
import { useAppDataContext } from "@/hooks/context/AppDataContextProvider";
// Types
import { LTokenInfo } from "@/types";

export function AppDashboardBalances({ className }: { className?: string }) {
  const { lTokenInfosCurrentChain, tokenInfos } = useAppDataContext();

  const underlyingTokenInfos = lTokenInfosCurrentChain
    .map((lTokenInfo) =>
      tokenInfos.find((tokenInfo) => tokenInfo.symbol === lTokenInfo.symbol),
    )
    .filter((el) => !!el);

  return !underlyingTokenInfos.length ? (
    <p>No balances on this chain.</p>
  ) : (
    <ul className="flex h-full w-full flex-col gap-7">
      {underlyingTokenInfos.map((underlyingTokenInfo, i) => {
        // @dev Safe to cast as we found token infos based on lTokenInfos
        const lTokenInfo = lTokenInfosCurrentChain.find(
          (token) =>
            token.address.toLowerCase() ===
            underlyingTokenInfo.address.toLowerCase(),
        ) as LTokenInfo;

        return (
          <li
            key={i}
            className="flex w-full gap-4 items-center justify-between"
          >
            <div className="flex items-center gap-2 font-semibold text-fg/80">
              <TokenLogo symbol={lTokenInfo.symbol} size={30} />
              {lTokenInfo.symbol}
            </div>
            <div className="flex items-center gap-2">
              <Amount
                value={lTokenInfo.balance}
                decimals={lTokenInfo.decimals}
                className="pr-2 font-semibold"
                suffix={lTokenInfo.symbol}
                displaySymbol={false}
              />
              <Tooltip>
                <TooltipTrigger>
                  <DepositDialog
                    lTokenData={lTokenInfo}
                    underlyingTokenData={underlyingTokenInfo}
                  >
                    <Button size="tiny" className="h-8 w-8">
                      <i className="ri-add-fill text-lg"></i>
                    </Button>
                  </DepositDialog>
                </TooltipTrigger>
                <TooltipContent className="font-heading font-semibold text-bg">
                  Deposit {underlyingTokenInfo.symbol} against{" "}
                  {lTokenInfo.symbol}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <WithdrawDialog
                    lTokenData={lTokenInfo}
                    underlyingTokenData={underlyingTokenInfo}
                  >
                    <Button variant="outline" size="tiny" className="h-8 w-8">
                      <i className="ri-subtract-fill text-lg"></i>
                    </Button>
                  </WithdrawDialog>
                </TooltipTrigger>
                <TooltipContent className="font-heading font-semibold text-bg">
                  Withdraw {underlyingTokenInfo.symbol} from {lTokenInfo.symbol}
                </TooltipContent>
              </Tooltip>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
