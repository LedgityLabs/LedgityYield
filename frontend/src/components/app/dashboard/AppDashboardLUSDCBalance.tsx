"use client";
import { FC, useEffect, useMemo } from "react";
import { useContractAddress } from "@/hooks/useContractAddress";
import { useReadLTokenBalanceOf } from "@/generated";
import { WithdrawDialog } from "../WithdrawDialog";
import { DepositDialog } from "../DepositDialog";
import { Amount, Button, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import Image from "next/image";
import lusdcIcon from "~/assets/tokens/lusdc.png";
import { useAccount, useBlockNumber } from "wagmi";
import { zeroAddress } from "viem";
import { useQueryClient } from "@tanstack/react-query";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const AppDashboardLUSDCBalance: FC<Props> = (props) => {
  const account = useAccount();
  const address = useContractAddress("LUSDC");
  const { data: balance, queryKey } = useReadLTokenBalanceOf({
    address: address!,
    args: [account.address || zeroAddress],
  });
  const decimals = 6;
  const underlyingSymbol = "USDC";

  // Memoize queryKeys array
  const queryKeys = useMemo(() => 
    queryKey ? [queryKey] : [],
    [queryKey]
  );

  const { data: blockNumber } = useBlockNumber({ watch: true });
  const queryClient = useQueryClient();

  // Refresh data every 5 blocks
  useEffect(() => {
    if (blockNumber && blockNumber % 5n === 0n && queryClient && queryKeys.length > 0) {
      queryKeys.forEach(k => {
        if (k) queryClient.invalidateQueries({ queryKey: k });
      });
    }
  }, [blockNumber, queryClient, queryKeys]);

  return (
    <div className="flex items-center gap-5" {...props}>
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

      <div className="text-[1.92rem] text-fg font-heading font-bold -none inline-flex items-center justify-center align-bottom gap-2">
        <Amount
          value={balance ?? 0n}
          decimals={decimals}
          className="text-[1.92rem] text-fg font-heading font-bold"
          suffix="LUSDC"
          displaySymbol={false}
        />
        <Image 
          src={lusdcIcon} 
          alt="LUSDC icon" 
          width={20} 
          height={20} 
          className="w-7 h-7 -mt-1"
          priority
        />
      </div>
    </div>
  );
};

export default AppDashboardLUSDCBalance;