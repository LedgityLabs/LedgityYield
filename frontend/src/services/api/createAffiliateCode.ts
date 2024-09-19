import { env } from "@/env.mjs";


export interface RequestParams {
  walletAddress: string;
}

export interface AffiliateResponse {
  isSuccess: boolean;
  message: string;
  referralUrl: string;
}

export const createAffiliateCode = (params: RequestParams) => {
  const option = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  };
  return fetch(env.NEXT_PUBLIC_AFFILIATE_API_URL + "/affiliate/create", option).then(
    async (res) => {
      const data: any = await res.json();
      return {
        isSuccess: res.ok,
        message: data.message,
        referralUrl: env.NEXT_PUBLIC_FRONTEND_URL + "?referral=" + data.referralCode,
      };
    },
  );
};
