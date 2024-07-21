import { AFFILIATE_URL } from "@/constants/constant";
import { env } from "../../../env.mjs";

import { Address } from "viem";

export interface SearchAffiliateActivityParams {
  walletAddress?: Address;
  affiliateCode: string;
  searchYear: number;
  searchQuarter: number;
}

export interface AffiliateActivityResponse {
  code: string;
  walletAddress: string;
  amount: string;
}

export const searchAffiliateActivity = (
  params: SearchAffiliateActivityParams,
): Promise<AffiliateActivityResponse[]> => {
  const option = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  };
  return fetch(AFFILIATE_URL + "/affiliate/search", option).then(async (res) => {
    const data: any = await res.json();
    return data;
  });
};
