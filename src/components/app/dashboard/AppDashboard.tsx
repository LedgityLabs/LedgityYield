import { FC } from "react";
import { AppDashboardBalances } from "./AppDashboardBalances";
import { AppDashboardRevenue } from "./AppDashboardRevenue";
import { AppDashboardChart } from "./AppDashboardChart";
import { AppDashboardActivity } from "./AppDashboardActivity";
import { Amount, Button, Card, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { useWalletClient } from "wagmi";
import { useContractAddress } from "@/hooks/useContractAddress";
import { useLTokenBalanceOf, useLTokenDecimals } from "@/generated";
import { WithdrawDialog } from "../WithdrawDialog";
import { DepositDialog } from "../DepositDialog";
import { AppDashboardGrowth } from "./AppDashboardGrowth";

export const AppDashboard: FC = () => {
  const { data: walletClient } = useWalletClient();
  const address = useContractAddress("LUSDC");
  const { data: balance } = useLTokenBalanceOf({
    address: address!,
    args: [walletClient ? walletClient.account.address : "0x0"],
    watch: true,
  });
  const decimals = 6;
  const underlyingSymbol = "USDC";

  return (
    <>
      <div className="lg:w-[900px] w-full flex flex-col gap-10 justify-center items-center mb-10">
        <Card
          circleIntensity={0.07}
          defaultGradient={true}
          className="w-full flex gap-2 justify-between "
        >
          <AppDashboardChart className="h-[680px] w-full" />
          <div className="p-10 flex-col justify-between gap-10 h-full self-stretch flex-grow -mt-3">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2 items-end">
                <h3 className="font-bold text-lg text-fg/50 whitespace-nowrap">Total growth</h3>
                <AppDashboardGrowth className="text-[1.92rem] text-fg font-heading font-bold" />
              </div>
              <div className="flex flex-col gap-2 items-end">
                <h3 className="font-bold text-lg text-fg/50 whitespace-nowrap">Total revenues</h3>
                <AppDashboardRevenue className="text-[1.92rem] text-fg font-heading font-bold" />
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex flex-col gap-2 items-end opacity-60 cursor-not-allowed grayscale ">
                    <h3 className="font-bold text-lg text-fg/50 whitespace-nowrap">LDY balance</h3>
                    <div className="flex gap-5 items-center">
                      <Button size="tiny" className="-mt-1 pointer-events-none">
                        Stake
                      </Button>
                      <span className="text-[1.92rem] text-fg font-heading font-bold -none inline-flex item-center align-bottom">
                        0
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="font-semibold">Available after TGE</TooltipContent>
              </Tooltip>
              <div className="flex flex-col gap-2 items-end">
                <h3 className="font-bold text-lg text-fg/50 whitespace-nowrap">LUSDC balance</h3>
                <div className="flex items-center gap-5">
                  <div className="flex justify-center items-center gap-2 -mt-1">
                    <Tooltip>
                      <TooltipTrigger>
                        <DepositDialog underlyingSymbol={underlyingSymbol}>
                          <Button size="tiny" className="h-8 w-8">
                            <i className="ri-add-fill text-lg"></i>
                          </Button>
                        </DepositDialog>
                      </TooltipTrigger>
                      <TooltipContent className="font-heading font-semibold text-bg">
                        Deposit {underlyingSymbol} against LUSDC
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <WithdrawDialog underlyingSymbol={underlyingSymbol}>
                          <Button variant="outline" size="tiny" className="h-8 w-8">
                            <i className="ri-subtract-fill text-lg"></i>
                          </Button>
                        </WithdrawDialog>
                      </TooltipTrigger>
                      <TooltipContent className="font-heading font-semibold text-bg">
                        Withdraw {underlyingSymbol} from LUSDC
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Amount
                    value={balance!}
                    decimals={decimals}
                    className="text-[1.92rem] text-fg font-heading font-bold"
                    suffix="LUSDC"
                    displaySymbol={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
        <AppDashboardActivity className="w-full" />
      </div>
    </>
  );
};
