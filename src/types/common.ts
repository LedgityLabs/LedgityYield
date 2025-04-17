import { Address, Hash } from "viem";

export type TokenInfo = {
  name: string;
  symbol: string;
  decimals: number;
  address: Address;
  chainId?: number;
};

export type LTokenInfo = TokenInfo & {
  chainId: number;
  apr: number;
  totalSupply: bigint;
  underlying: Address;
  balance: bigint;
};

export type WLTokenInfo = TokenInfo & {
  chainId: number;
  exchangeRate: number;
  totalSupply: bigint;
  lToken: Address;
  balance: bigint;
};

export type ERC20TokenType = {
  address: Address;
  symbol: string;
  decimals: number;
  image?: string;
};

export type UserStakeData = {
  stakeIndex: bigint;
  stakedAmount: bigint;
  unStakeAt: bigint;
  duration: bigint;
  rewardPerTokenPaid: bigint;
  rewards: bigint;
};

// ================= WRITE TX ================= //

export type TransactionStatus = "error" | "idle" | "pending" | "success";

export type ExecuteReturn = {
  status: TransactionStatus;
  hash?: Hash;
  error?: string;
};

export type UseCallInstance = {
  writeContract: (...args: any[]) => Promise<Hash>;
  hash: Hash | undefined;
  error: Error | null;
  chainId: number;
  address: Address | undefined;
  status: TransactionStatus;
};
