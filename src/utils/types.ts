// types.ts

export interface UserAction {
  epochNumber: number;
  amount: string;
  actionType: 'DEPOSIT' | 'WITHDRAW';
  timestamp: string;
}

export interface EpochInvestment {
  epochNumber: number;
  amount: string;
}

export interface User {
  id: string;
  totalDeposited: string;
  totalWithdrawn: string;
  totalRewardsClaimed: string;
  actions: UserAction[];
  epochInvestments: EpochInvestment[];
}

export interface Epoch {
  id: string;
  number: number;
  totalValueLocked: string;
  totalEpochRewards: string;
}

export interface UserData {
  user: User | null;
}

export interface EpochsData {
  epochs: Epoch[];
}

// Keep this if you're still using it somewhere, otherwise you can remove it
export interface Stake {
  amount: string;
  epochNumber: number;
}