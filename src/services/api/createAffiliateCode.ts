import { AFFILIATE_URL } from "@/constants/constant";
import { env } from "../../../env.mjs";

import { Address } from "viem";

export interface RequestParams {
  walletAddress: Address;
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
  return fetch(AFFILIATE_URL + "/affiliate/create", option).then(
    async (res) => {
      const data: any = await res.json();
      return {
        isSuccess: res.ok,
        message: data.message,
        referralUrl: data.referralUrl,
      };
    },
  );
};
