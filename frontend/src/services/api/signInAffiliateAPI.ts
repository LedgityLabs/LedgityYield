import { env } from "@/env.mjs";

export interface SignInRequestParams {
  chainId: number;
  walletAddress: string;
  rawMessage: string;
  signedMessage: string;
}

export interface SignInResponse {
  isSuccess: boolean;
  token?: string;
  exp?: any;
  message?: string;
}

export const signInAffiliate = (params: SignInRequestParams): Promise<SignInResponse> => {
  const option = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  };
  return fetch(env.NEXT_PUBLIC_AFFILIATE_API_URL + "/affiliate/signin", option).then(
    async (res) => {
      const data: any = await res.json();
      if (!res.ok) {
        return { isSuccess: res.ok, message: data.message };
      }
      return { isSuccess: res.ok, token: data.token, exp: data.exp };
    },
  );
};
