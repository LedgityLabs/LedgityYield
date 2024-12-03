import { env } from "../../../env.mjs";

export interface SearchAffiliateActivityParams {
  walletAddress?: string;
  affiliateCode?: string;
  searchYear: number;
  searchQuarter: number;
}

export interface AffiliateActivityResponse {
  code: string;
  walletAddress: string;
  amount: string;
  commissionAmount: string;
}

export interface SearchAffiliateActivityResponse {
  isSuccess: boolean;
  message?: string;
  data: AffiliateActivityResponse[];
}

export const searchAffiliateActivity = (
  params: SearchAffiliateActivityParams,
): Promise<SearchAffiliateActivityResponse> => {
  const option = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  };
  return fetch(env.NEXT_PUBLIC_AFFILIATE_API_URL + "/affiliate/search", option).then(
    async (res) => {
      const data: any = await res.json();
      if (!res.ok) {
        return { isSuccess: res.ok, message: data.message, data: [] };
      }
      return { isSuccess: res.ok, data };
    },
  );
};
