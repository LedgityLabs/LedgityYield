import { env } from "../../../env.mjs";

export interface CreateCommissionResponse {
  isSuccess: boolean;
  message: string;
  percent?: number;
}

export const createCommission = (
  newPercent: number,
  authToken: string,
): Promise<CreateCommissionResponse> => {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };
  return fetch(
    env.NEXT_PUBLIC_AFFILIATE_API_URL + "/affiliate/commission/create/" + newPercent,
    option,
  ).then(async (res) => {
    const data: any = await res.json();
    if (!res.ok) {
      return { isSuccess: res.ok, message: data.message };
    }
    return { isSuccess: res.ok, message: data.message, percent: data.percent };
  });
};
