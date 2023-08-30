import { FC } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { twMerge } from "tailwind-merge";
import { formatUnits } from "viem";
import * as d3 from "d3-format";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  value: number | undefined;
  tooltip?: boolean;
  prefix?: string;
  isUD7x3?: boolean;
  highPrecision?: boolean;
}

function getFloatValue(value: number | undefined, isUD7x3: boolean) {
  if (!value) return 0;
  return isUD7x3 ? Number(formatUnits(BigInt(value), 3)) : value;
}

export function formatRate(
  value: number,
  isUD7x3: boolean = false,
  highPrecision: boolean = false,
) {
  const floatValue = getFloatValue(value, isUD7x3);

  let formattedRate = "";
  if (highPrecision) {
    if (floatValue === 0) formattedRate = "0";
    else if (floatValue < 0.001) formattedRate = "<0.001";
    else if (floatValue < 0.01) formattedRate = d3.format(",.3f")(floatValue);
    else if (floatValue < 1) formattedRate = floatValue.toFixed(2);
    else if (floatValue < 100) formattedRate = floatValue.toFixed(1);
    else if (floatValue < 1000) formattedRate = floatValue.toFixed(0);
    else formattedRate = ">999";
  } else {
    if (floatValue === 0) formattedRate = "0";
    else if (floatValue < 0.01) formattedRate = "<0.01";
    else if (floatValue < 1) formattedRate = floatValue.toFixed(2);
    else if (floatValue < 100) formattedRate = floatValue.toFixed(1);
    else if (floatValue < 1000) formattedRate = floatValue.toFixed(0);
    else formattedRate = ">999";
  }
  return formattedRate;
}

function longFormatRate(value: number, isUD7x3: boolean = false) {
  const floatValue = getFloatValue(value, isUD7x3);
  let longFormattedRate = "";
  if (floatValue === 0) longFormattedRate = "0";
  else if (floatValue < 0.001) longFormattedRate = "<0.001";
  if (floatValue < 1) longFormattedRate = d3.format(",.3f")(floatValue);
  else longFormattedRate = d3.format(",.3f")(floatValue);
  return longFormattedRate;
}

export const Rate: FC<Props> = ({
  className,
  value,
  prefix = "",
  tooltip = true,
  isUD7x3 = true,
  highPrecision = false,
  ...props
}) => {
  const formattedValue = formatRate(value || 0, isUD7x3, highPrecision);

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
          {longFormatRate(value || 0, isUD7x3)}%
        </TooltipContent>
      </Tooltip>
    );
};
