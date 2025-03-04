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
import { useAppDataContext } from "@/hooks/context/AppDataContextProvider";

export function AppDashboardLUSDCBalance({}) {
  const { lTokenInfosCurrentChain, tokenInfos } = useAppDataContext();

  const tokenData = lTokenInfosCurrentChain.find(
    (token) => token.symbol === "LUSDC",
  );
  const underlyingTokenInfo = tokenInfos.find(
    (tokenInfo) => tokenInfo.symbol === tokenData?.symbol,
  );

  if (!tokenData || !underlyingTokenInfo) return <></>;

  return (
    <div className="flex items-center gap-5">
      <div className="flex justify-center items-center gap-2 -mt-1">
        <Tooltip>
          <TooltipTrigger>
            <DepositDialog
              lTokenData={tokenData}
              underlyingTokenData={underlyingTokenInfo}
            >
              <Button size="tiny" className="h-8 w-8">
                <i className="ri-add-fill text-lg"></i>
              </Button>
            </DepositDialog>
          </TooltipTrigger>
          <TooltipContent className="font-heading font-semibold text-bg">
            Deposit {underlyingTokenInfo.symbol} against LUSDC
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <WithdrawDialog
              lTokenData={tokenData}
              underlyingTokenData={underlyingTokenInfo}
            >
              <Button variant="outline" size="tiny" className="h-8 w-8">
                <i className="ri-subtract-fill text-lg"></i>
              </Button>
            </WithdrawDialog>
          </TooltipTrigger>
          <TooltipContent className="font-heading font-semibold text-bg">
            Withdraw {underlyingTokenInfo.symbol} from LUSDC
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="text-[1.92rem] text-fg font-heading font-bold -none inline-flex items-center justify-center align-bottom gap-2">
        <Amount
          value={tokenData.balance}
          decimals={tokenData.decimals}
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
  );
}
