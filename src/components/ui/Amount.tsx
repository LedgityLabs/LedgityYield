import { FC } from "react";
import * as d3 from "d3-format";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { twMerge } from "tailwind-merge";
import { formatUnits } from "viem";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  value: bigint | undefined;
  decimals?: number;
  tooltip?: boolean;
}

export const Amount: FC<Props> = ({ className, value, decimals = 0, tooltip = true, ...props }) => {
  const numberValue = Number(formatUnits(value || 0n, decimals));
  let formattedAmount = numberValue < 1 ? numberValue.toLocaleString() : d3.format(".3s")(numberValue);
  formattedAmount = formattedAmount.replace("G", "B");
  if (!tooltip)
    return (
      <span className={className} {...props}>
        {formattedAmount}
      </span>
    );
  else
    return (
      <Tooltip>
        <TooltipTrigger className={twMerge("cursor-help", className)}>{formattedAmount}</TooltipTrigger>
        <TooltipContent>{numberValue.toLocaleString()}</TooltipContent>
      </Tooltip>
    );
};
