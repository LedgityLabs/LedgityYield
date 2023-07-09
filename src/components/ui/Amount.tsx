import { FC } from "react";
import * as d3 from "d3-format";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { twMerge } from "tailwind-merge";
import { formatUnits } from "viem";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  value: bigint | number | undefined;
  decimals?: number;
  tooltip?: boolean;
  prefix?: string;
  suffix?: string;
  displaySymbol?: boolean;
  tooltipChildren?: React.ReactNode;
}

function getFloatValue(value: bigint | number | undefined, decimals?: number) {
  value = value || 0n;
  return typeof value === "number" ? value : Number(formatUnits(value, decimals || 0));
}

function removeLeadingZeroes(value: string) {
  if (value.includes(".")) {
    const lastChar = value.slice(-1);
    const lastCharIsNumber = /[0-9]/.test(lastChar);
    if (!lastCharIsNumber) value = value.slice(0, -1);
    while (value.endsWith("0")) value = value.slice(0, -1);
    if (value.endsWith(".")) value = value.slice(0, -1);
    if (!lastCharIsNumber) value += lastChar;
  }
  return value;
}

export function formatAmount(value: bigint | number | undefined, decimals?: number) {
  const floatValue = getFloatValue(value, decimals);

  let formattedAmount = "";
  if (floatValue === 0) formattedAmount = "0";
  else if (floatValue < 0.01) formattedAmount = "<0.01";
  else if (floatValue < 1) formattedAmount = floatValue.toFixed(2);
  else if (floatValue < 1000) formattedAmount = floatValue.toFixed(1);
  else formattedAmount = d3.format(".3s")(floatValue);

  // Replace "G" with "B" for billions
  formattedAmount = formattedAmount.replace("G", "B");

  // If decimal number, remove leading zeroes
  formattedAmount = removeLeadingZeroes(formattedAmount);

  return formattedAmount;
}

function longFormatAmount(value: bigint | number | undefined, decimals?: number) {
  const floatValue = getFloatValue(value, decimals);
  let longFormattedAmount = "";
  if (floatValue === 0) longFormattedAmount = "0";
  else if (floatValue < 0.00001) longFormattedAmount = "<0.00001";
  if (floatValue < 1) longFormattedAmount = d3.format(",.5f")(floatValue);
  if (floatValue < 1000) longFormattedAmount = d3.format(",.4f")(floatValue);
  else longFormattedAmount = d3.format(",.3f")(floatValue);

  // If decimal number, remove leading zeroes
  longFormattedAmount = removeLeadingZeroes(longFormattedAmount);

  return longFormattedAmount;
}

export const Amount: FC<Props> = ({
  className,
  value,
  prefix = "",
  suffix = "",
  displaySymbol = true,
  decimals = 0,
  tooltip = true,
  tooltipChildren,
  ...props
}) => {
  let formattedAmount = formatAmount(value, decimals);

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
        <TooltipContent className="font-heading font-bold inline-flex flex-col justify-center items-center gap-2">
          <span>
            {prefix}
            {longFormatAmount(value, decimals)}
            {suffix}
          </span>
          {tooltipChildren}
        </TooltipContent>
      </Tooltip>
    );
};
