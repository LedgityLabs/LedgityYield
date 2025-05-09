// Components
import {
  Amount,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { TokenLogo } from "@/components/icons/TokenLogo";
import { DepositDialog } from "@/components/app/DepositDialog";
import { WithdrawDialog } from "@/components/app/WithdrawDialog";
// Hooks
import { useState } from "react";
import { useAppDataContext } from "@/hooks/context/AppDataContextProvider";
import { useTokenPricesUsd } from "@/hooks/api/useTokenPricesUsd";

const RAY = 1000000000000000000000000000n;

export function AppDashboardTokenBalances({}) {
  const { lTokenInfosCurrentChain, wLTokenInfosCurrentChain, tokenInfos } =
    useAppDataContext();
  const [openModal, setOpenModal] = useState<{
    token: string;
    type: "deposit" | "withdraw";
  }>();

  // Get USD prices for all underlying tokens
  const underlyingSymbols = lTokenInfosCurrentChain.map((token) =>
    token.symbol.slice(1),
  );
  const tokenPriceUsd = useTokenPricesUsd(underlyingSymbols);

  if (!lTokenInfosCurrentChain.length) return <></>;

  function handleSetOpenModal(
    token: string,
    type: "deposit" | "withdraw",
    isOpen: boolean,
  ) {
    if (openModal?.token === token && openModal?.type === type && !isOpen) {
      setOpenModal(undefined);
    } else {
      setOpenModal({ token, type });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {lTokenInfosCurrentChain.map((token) => {
        const wLToken = wLTokenInfosCurrentChain.find(
          (wlt) => wlt.lToken.toLowerCase() === token.address.toLowerCase(),
        );
        const underlyingToken = tokenInfos.find(
          (t) => t.address.toLowerCase() === token.underlying.toLowerCase(),
        );

        if (!underlyingToken) return null;

        // Get USD price for the underlying token
        const usdRate = tokenPriceUsd[token.symbol.slice(1)] || 0;

        // Calculate total invested including wrapped tokens
        const wrappedBalance = wLToken?.balance || 0n;
        const exchangeRate = wLToken?.exchangeRate || RAY;
        const unwrappedBalance = (wrappedBalance * exchangeRate) / RAY;
        const totalInvested = token.balance + unwrappedBalance;
        const investedUsd =
          (Number(totalInvested) / 10 ** token.decimals) * usdRate;

        return (
          <div key={token.address} className="flex items-center gap-5">
            <div className="flex justify-center items-center gap-2 -mt-1">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={() =>
                      handleSetOpenModal(token.symbol, "withdraw", true)
                    }
                    variant="outline"
                    size="tiny"
                    className="h-8 w-8"
                  >
                    <i className="ri-subtract-fill text-lg"></i>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="font-heading font-semibold text-bg">
                  Withdraw {underlyingToken.symbol} from {token.symbol}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={() =>
                      handleSetOpenModal(token.symbol, "deposit", true)
                    }
                    size="tiny"
                    className="h-8 w-8"
                  >
                    <i className="ri-add-fill text-lg"></i>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="font-heading font-semibold text-bg">
                  Deposit {underlyingToken.symbol} against {token.symbol}
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex flex-col gap-1">
              <div className="text-fg font-heading font-bold -none inline-flex items-center justify-center align-bottom gap-2">
                <Amount
                  value={totalInvested}
                  decimals={token.decimals}
                  prefix="$ "
                  className="text-xl text-fg font-heading font-bold"
                />
                <TokenLogo
                  symbol={underlyingToken.symbol}
                  size={25}
                  className="border border-bg/80 -mt-1"
                />
              </div>
            </div>

            {openModal?.token === token.symbol && (
              <>
                <DepositDialog
                  isOpen={openModal.type === "deposit"}
                  setIsOpen={(isOpen) =>
                    handleSetOpenModal(token.symbol, "deposit", isOpen)
                  }
                  lTokenData={token}
                  wLTokenData={wLToken}
                  underlyingTokenData={underlyingToken}
                />
                <WithdrawDialog
                  isOpen={openModal.type === "withdraw"}
                  setIsOpen={(isOpen) =>
                    handleSetOpenModal(token.symbol, "withdraw", isOpen)
                  }
                  lTokenData={token}
                  wLTokenData={wLToken}
                  underlyingTokenData={underlyingToken}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
