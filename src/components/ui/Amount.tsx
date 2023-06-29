import { FC } from "react";
import * as d3 from "d3-format";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { twMerge } from "tailwind-merge";
import { formatUnits } from "viem";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  value: bigint | undefined;
  decimals?: number;
  tooltip?: boolean;
  prefix?: string;
  suffix?: string;
  displaySymbol?: boolean;
}

export const Amount: FC<Props> = ({
  className,
  value,
  prefix = "",
  suffix = "",
  displaySymbol = true,
  decimals = 0,
  tooltip = true,
  ...props
}) => {
  const numberValue = Number(formatUnits(value || 0n, decimals));
  let formattedAmount = numberValue < 1 ? d3.format(",")(numberValue) : d3.format(".3s")(numberValue);
  formattedAmount = formattedAmount.replace("G", "B");
  suffix = suffix !== "" && !suffix.startsWith(" ") ? " " + suffix : suffix;
  if (!tooltip)
    return (
      <span className={className} {...props}>
        {displaySymbol && prefix}
        {formattedAmount}
        {displaySymbol && suffix}
      </span>
    );
  else
    return (
      <Tooltip>
        <TooltipTrigger className={twMerge("cursor-help", className)}>
          {displaySymbol && prefix}
          {formattedAmount}
          {displaySymbol && suffix}
        </TooltipTrigger>
        <TooltipContent>
          {prefix}
          {d3.format(",")(numberValue)}
          {suffix}
        </TooltipContent>
      </Tooltip>
    );
};
