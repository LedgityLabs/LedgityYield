// Components
import {
  Amount,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import Image from "next/image";
import lusdcIcon from "~/assets/tokens/lusdc.png";
import { DepositDialog } from "@/components/app/DepositDialog";
import { WithdrawDialog } from "@/components/app/WithdrawDialog";
// Hooks
import { useState } from "react";
import { useAppDataContext } from "@/hooks/context/AppDataContextProvider";

export function AppDashboardLUSDCBalance({}) {
  const { lTokenInfosCurrentChain, tokenInfos } = useAppDataContext();
  const [openModal, setOpenModal] = useState<"deposit" | "withdraw">();

  const lTokenData = lTokenInfosCurrentChain.find(
    (token) => token.symbol === "LUSDC",
  );
  const underlyingTokenInfo = tokenInfos.find(
    (tokenInfo) =>
      tokenInfo.address.toLowerCase() === lTokenData?.underlying.toLowerCase(),
  );

  if (!lTokenData || !underlyingTokenInfo) return <></>;

  function handleSetOpenModal(modal: "deposit" | "withdraw", isOpen: boolean) {
    if (openModal === modal && !isOpen) {
      setOpenModal(undefined);
    } else {
      setOpenModal(modal);
    }
  }

  return (
    <>
      <div className="flex items-center gap-5">
        <div className="flex justify-center items-center gap-2 -mt-1">
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={() => handleSetOpenModal("deposit", true)}
                size="tiny"
                className="h-8 w-8"
              >
                <i className="ri-add-fill text-lg"></i>
              </Button>
            </TooltipTrigger>

            <TooltipContent className="font-heading font-semibold text-bg">
              Deposit {underlyingTokenInfo.symbol} against LUSDC
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={() => handleSetOpenModal("withdraw", true)}
                variant="outline"
                size="tiny"
                className="h-8 w-8"
              >
                <i className="ri-subtract-fill text-lg"></i>
              </Button>
            </TooltipTrigger>

            <TooltipContent className="font-heading font-semibold text-bg">
              Withdraw {underlyingTokenInfo.symbol} from LUSDC
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="text-[1.92rem] text-fg font-heading font-bold -none inline-flex items-center justify-center align-bottom gap-2">
          <Amount
            value={lTokenData.balance}
            decimals={lTokenData.decimals}
            className="text-[1.92rem] text-fg font-heading font-bold"
            suffix="LUSDC"
            displaySymbol={false}
          />{" "}
          <Image
            src={lusdcIcon}
            alt="LUSDC icon"
            width={20}
            className="w-7 h-7 -mt-1"
          />
        </div>
      </div>

      <DepositDialog
        isOpen={openModal === "deposit"}
        setIsOpen={(isOpen) => handleSetOpenModal("deposit", isOpen)}
        lTokenData={lTokenData}
        underlyingTokenData={underlyingTokenInfo}
      />
      <WithdrawDialog
        isOpen={openModal === "withdraw"}
        setIsOpen={(isOpen) => handleSetOpenModal("withdraw", isOpen)}
        lTokenData={lTokenData}
        underlyingTokenData={underlyingTokenInfo}
      />
    </>
  );
}
