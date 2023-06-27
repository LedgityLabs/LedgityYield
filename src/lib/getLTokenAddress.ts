import { LTokenId, contracts } from "../../hardhat/deployments";

export const getLTokenAddress = (symbol: LTokenId, networkId: number) =>
  contracts[symbol].address[networkId];
