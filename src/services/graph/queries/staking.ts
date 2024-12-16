import { gql } from "graphql-request";

export const USER_STAKING_QUERY = gql`
  query getUserStakingQuery($userAddress: String) {
    stakingUsers(
      orderBy: stakeIndex
      orderDirection: asc
      where: { user: $userAddress }
    ) {
      id
      user
      earnedAmount
      stakedAmount
      stakeIndex
    }
  }
`;

export const STAKING_APR_INFO_QUERY = gql`
  query getStakingAPRInfo($stakeAprId: String!) {
    stakingAPRInfo(id: $stakeAprId) {
      rewardPerSec
      totalStaked
      interestRate
      id
    }
  }
`;
