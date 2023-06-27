import { getLTokenAddress } from "@/lib/getLTokenAddress";
import { LTokenId } from "../../hardhat/deployments";
import { useDApp } from "./useDApp";

export const useLToken = (symbol: LTokenId) => {
  const { chain } = useDApp();
  return getLTokenAddress(symbol, chain.id);
};
