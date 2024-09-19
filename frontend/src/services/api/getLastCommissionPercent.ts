import { env } from "@/env.mjs";

export const getLastCommissionPercent = () => {
  return fetch(env.NEXT_PUBLIC_AFFILIATE_API_URL + "/affiliate/commission/last").then(
    async (res) => {
      const data: any = await res.json();
      if (!res.ok) {
        return 0;
      }
      return data;
    },
  );
};
