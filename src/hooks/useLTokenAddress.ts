import { getLTokenAddress } from "@/lib/getLTokenAddress";
import { LTokenId } from "../../hardhat/deployments";
import { useDApp } from "./useDApp";

export const useLTokenAddress = (symbol: LTokenId) => {
  const { chain } = useDApp();
  return getLTokenAddress(symbol, chain.id);
};
