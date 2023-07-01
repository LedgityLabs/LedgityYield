import { FC } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { twMerge } from "tailwind-merge";
import { formatUnits, parseUnits } from "viem";
import * as d3 from "d3-format";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  value: number | undefined;
  tooltip?: boolean;
  prefix?: string;
}

export const Rate: FC<Props> = ({ className, value, prefix = "", tooltip = true, ...props }) => {
  value = value || 0;
  const floatValue = Number(formatUnits(BigInt(value), 3));
  let formattedValue: string;
  if (floatValue === 0) formattedValue = "0.0";
  else if (floatValue < 0.01) formattedValue = "<0.01";
  else if (floatValue < 0.1) formattedValue = d3.format(".1r")(floatValue);
  else if (floatValue < 1) formattedValue = d3.format(".2r")(floatValue);
  else if (floatValue < 1000) formattedValue = d3.format(".3r")(floatValue);
  else formattedValue = ">999";
  if (!tooltip)
    return (
      <span className={className} {...props}>
        {prefix}
        {formattedValue}%
      </span>
    );
  else
    return (
      <Tooltip>
        <TooltipTrigger className={twMerge("cursor-help", className)}>
          {prefix}
          {formattedValue}%
        </TooltipTrigger>
        <TooltipContent className="font-heading font-bold">
          {prefix}
          {floatValue}%
        </TooltipContent>
      </Tooltip>
    );
};
