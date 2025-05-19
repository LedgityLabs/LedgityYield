import * as d3 from "d3-format";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { formatUnits } from "viem";

function getFloatValue(value: bigint | number | undefined, decimals?: number) {
  value = value || 0n;
  return typeof value === "number"
    ? value
    : Number(formatUnits(value, decimals || 0));
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

function formatAmount(value: bigint | number | undefined, decimals?: number) {
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

function longFormatAmount(
  value: bigint | number | undefined,
  decimals?: number,
) {
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

export function AmountWithValue({
  tokenValue = 0n,
  tokenDecimals = 0,
  tokenSymbol = "",
  usdValue = 0,
  usdDecimals = 0,
}: {
  tokenValue: bigint;
  tokenDecimals: number;
  tokenSymbol: string;
  usdValue: bigint | number;
  usdDecimals: number;
}) {
  const formattedTokenAmount = formatAmount(tokenValue, tokenDecimals);
  const formattedUsdAmount = formatAmount(usdValue, usdDecimals);
  const exactUsdAmount = longFormatAmount(usdValue, usdDecimals);

  return (
    <Tooltip>
      <TooltipTrigger className="flex flex-col cursor-help">
        <span className="text-lg font-semibold text-fg/90">
          {formattedTokenAmount} {tokenSymbol}
        </span>
        <span className="text-sm text-fg/60">$ {formattedUsdAmount}</span>
      </TooltipTrigger>
      <TooltipContent className="font-heading font-bold inline-flex flex-col justify-center items-center gap-2 whitespace-nowrap">
        <span>$ {exactUsdAmount}</span>
      </TooltipContent>
    </Tooltip>
  );
}
