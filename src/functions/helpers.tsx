import { LTokenInfo } from "@/types";
import { formatUnits } from "viem";

export type TvlMetrics = {
  total: number;
  byToken: { [symbol: string]: number };
  byChain: { [chainId: number]: number };
};

export function computeTvlMetrics(
  lTokenInfos: LTokenInfo[],
  tokenPrices: { [symbol: string]: number },
): TvlMetrics {
  // Calculate the TVL of the protocol
  return lTokenInfos.reduce(
    (acc: TvlMetrics, lToken) => {
      acc.byToken[lToken.symbol] ??= 0;
      acc.byChain[lToken.chainId] ??= 0;

      const underlyingSymbol = lToken.symbol.slice(1).toLowerCase();
      const price = tokenPrices[underlyingSymbol] || 0;
      const tokenAmount = Number(
        formatUnits(lToken.totalSupply, lToken.decimals),
      );
      const valueUsd = tokenAmount * price;

      acc.byToken[lToken.symbol] += valueUsd;
      acc.byChain[lToken.chainId] += valueUsd;
      acc.total += valueUsd;

      return acc;
    },
    {
      total: 0,
      byToken: {},
      byChain: {},
    },
  );
}

export function getSortIcon(sortOrder: "asc" | "desc" | false): JSX.Element {
  switch (sortOrder) {
    case "asc":
      return <i className="ri-sort-desc"></i>;
    case "desc":
      return <i className="ri-sort-asc"></i>;
    default:
      return <i className="ri-expand-up-down-fill"></i>;
  }
}

export function subtractMonths(date: Date, months: number) {
  const result = new Date(date); // Clone the date to avoid mutating the original
  result.setDate(result.getDate() - 30 * months); // Subtract the days
  return result;
}
