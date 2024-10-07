import { gql } from 'graphql-request';

export const GET_USER_DATA = gql`
  query GetUserData($userId: ID!) {
    user(id: $userId) {
      id
      totalDeposited
      totalWithdrawn
      totalRewardsClaimed
      actions(orderBy: timestamp, orderDirection: asc) {
        epochNumber
        amount
        actionType
        timestamp
      }
      epochInvestments(orderBy: epochNumber, orderDirection: desc) {
        epochNumber
        amount
      }
    }
  }
`;

export interface UserData {
  id: string;
  totalDeposited: string;
  totalWithdrawn: string;
  totalRewardsClaimed: string;
  actions: {
    epochNumber: number;
    amount: string;
    actionType: string;
    timestamp: string;
  }[];
  epochInvestments: {
    epochNumber: number;
    amount: string;
  }[];
}