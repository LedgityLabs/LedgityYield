"use client";

import {
  Amount,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { TokenLogo } from "@/components/icons/TokenLogo";
import { DepositDialog } from "../DepositDialog";
import { WithdrawDialog } from "../WithdrawDialog";
// Hooks
import { useState } from "react";
import { useAppDataContext } from "@/hooks/context/AppDataContextProvider";
// Types
import { LTokenInfo } from "@/types";
import { Address } from "viem";

// @bw @dev was intended to replace AppDashboardLUSDCBalance I think
export function AppDashboardBalances({ className }: { className?: string }) {
  const { lTokenInfosCurrentChain, wLTokenInfosCurrentChain, tokenInfos } =
    useAppDataContext();
  const [openModal, setOpenModal] = useState<"deposit" | "withdraw">();
  const [modalToken, setModalToken] = useState<Address>();

  const lTokenData = lTokenInfosCurrentChain.find(
    (token) => token.address === modalToken,
  );
  const wLTokenData = wLTokenInfosCurrentChain.find(
    (token) =>
      token.address.toLowerCase() === lTokenData?.address.toLowerCase(),
  );
  const underlyingTokenData = tokenInfos.find(
    (token) =>
      token.address.toLowerCase() === lTokenData?.underlying.toLowerCase(),
  );

  function handleSetOpenModal(
    modal: "deposit" | "withdraw",
    token: Address | undefined,
    isOpen: boolean,
  ) {
    if (openModal === modal && !isOpen) {
      setOpenModal(undefined);
      setModalToken(undefined);
      return;
    }

    if (openModal !== modal) {
      setOpenModal(modal);
    }
    if (modalToken !== token) {
      setModalToken(token);
    }
  }

  const underlyingTokenInfos = lTokenInfosCurrentChain
    .map((lTokenInfo) =>
      tokenInfos.find(
        (tokenInfo) =>
          tokenInfo.address.toLowerCase() === lTokenInfo.address.toLowerCase(),
      ),
    )
    .filter((el) => !!el);

  return !underlyingTokenInfos.length ? (
    <p>No balances on this chain.</p>
  ) : (
    <>
      <ul className="flex h-full w-full flex-col gap-7">
        {underlyingTokenInfos.map((underlyingTokenInfo, i) => {
          // @dev Safe to cast as we found token infos based on lTokenInfos
          const tokenData = lTokenInfosCurrentChain.find(
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
                <TokenLogo symbol={tokenData.symbol} size={30} />
                {tokenData.symbol}
              </div>
              <div className="flex items-center gap-2">
                <Amount
                  value={tokenData.balance}
                  decimals={tokenData.decimals}
                  className="pr-2 font-semibold"
                  suffix={tokenData.symbol}
                  displaySymbol={false}
                />
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={() =>
                        handleSetOpenModal("deposit", tokenData.address, true)
                      }
                      size="tiny"
                      className="h-8 w-8"
                    >
                      <i className="ri-add-fill text-lg"></i>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent className="font-heading font-semibold text-bg">
                    Deposit {underlyingTokenInfo.symbol} against{" "}
                    {tokenData.symbol}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={() =>
                        handleSetOpenModal("withdraw", tokenData.address, true)
                      }
                      variant="outline"
                      size="tiny"
                      className="h-8 w-8"
                    >
                      <i className="ri-subtract-fill text-lg"></i>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent className="font-heading font-semibold text-bg">
                    Withdraw {underlyingTokenInfo.symbol} from{" "}
                    {tokenData.symbol}
                  </TooltipContent>
                </Tooltip>
              </div>
            </li>
          );
        })}
      </ul>

      <DepositDialog
        isOpen={openModal === "deposit"}
        setIsOpen={(isOpen) =>
          handleSetOpenModal("deposit", lTokenData?.address, isOpen)
        }
        lTokenData={lTokenData}
        wLTokenData={wLTokenData}
        underlyingTokenData={underlyingTokenData}
      />
      <WithdrawDialog
        isOpen={openModal === "withdraw"}
        setIsOpen={(isOpen) =>
          handleSetOpenModal("withdraw", lTokenData?.address, isOpen)
        }
        lTokenData={lTokenData}
        underlyingTokenData={underlyingTokenData}
      />
    </>
  );
}
