import { AFFILIATE_URL } from "@/constants/constant";
import { env } from "../../../env.mjs";

import { Address } from "viem";

export interface RequestParams {
  walletAddress: Address;
}

export interface QuotoV2Response {
  deprecated: string;
  inTokens: string[];
  outTokens: string[];
  inAmounts: string[];
  outAmounts: string[];
  gasEstimate: number;
  dataGasEstimate: number;
  gweiPerGas: number;
  gasEstimateValue: number;
  inValues: number[];
  outValues: number[];
  netOutValue: number;
  priceImpact: number;
  percentDiff: number;
  partnerFeePercent: number;
  pathId: string | null;
  pathViz: object;
  pathVizImage: string;
  blockNumber: number;
}

export const createAffiliateCode = (params: RequestParams) => {
  const option = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  };
  console.log("AFFILIATE_URL: ", AFFILIATE_URL);
  return fetch(AFFILIATE_URL + "/affiliate/create", option)
    .then(async (res) => {
      // if (!res.ok) throw new Error();
      if (!res.ok) console.log("failed: ", res);
      const data: any = await res.json();
      console.log("data: ", data);
      // return {
      //   deprecated: data.deprecated,
      //   inTokens: data.inTokens,
      //   outTokens: data.outTokens,
      //   inAmounts: data.inAmounts,
      //   outAmounts: data.outAmounts,
      //   gasEstimate: data.gasEstimate,
      //   dataGasEstimate: data.dataGasEstimate,
      //   gweiPerGas: data.gweiPerGas,
      //   gasEstimateValue: data.gasEstimateValue,
      //   inValues: data.inValues,
      //   outValues: data.outValues,
      //   netOutValue: data.netOutValue,
      //   priceImpact: data.priceImpact,
      //   percentDiff: data.percentDiff,
      //   partnerFeePercent: data.partnerFeePercent,
      //   pathId: data.pathId,
      //   pathViz: data.pathViz,
      //   pathVizImage: data.pathVizImage,
      //   blockNumber: data.blockNumber,
      // };
    })
    .catch((error) => {
      console.log(error);
      return undefined;
    });
};
