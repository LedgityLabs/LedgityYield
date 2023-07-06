// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace LocalhostSubgraphTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type APRUpdate = {
  id: Scalars['ID'];
  ltoken: LToken;
  timestamp: Scalars['BigInt'];
  apr: Scalars['BigDecimal'];
};

export type APRUpdate_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  ltoken?: InputMaybe<Scalars['String']>;
  ltoken_not?: InputMaybe<Scalars['String']>;
  ltoken_gt?: InputMaybe<Scalars['String']>;
  ltoken_lt?: InputMaybe<Scalars['String']>;
  ltoken_gte?: InputMaybe<Scalars['String']>;
  ltoken_lte?: InputMaybe<Scalars['String']>;
  ltoken_in?: InputMaybe<Array<Scalars['String']>>;
  ltoken_not_in?: InputMaybe<Array<Scalars['String']>>;
  ltoken_contains?: InputMaybe<Scalars['String']>;
  ltoken_contains_nocase?: InputMaybe<Scalars['String']>;
  ltoken_not_contains?: InputMaybe<Scalars['String']>;
  ltoken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ltoken_starts_with?: InputMaybe<Scalars['String']>;
  ltoken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_not_starts_with?: InputMaybe<Scalars['String']>;
  ltoken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_ends_with?: InputMaybe<Scalars['String']>;
  ltoken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_not_ends_with?: InputMaybe<Scalars['String']>;
  ltoken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_?: InputMaybe<LToken_filter>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  apr?: InputMaybe<Scalars['BigDecimal']>;
  apr_not?: InputMaybe<Scalars['BigDecimal']>;
  apr_gt?: InputMaybe<Scalars['BigDecimal']>;
  apr_lt?: InputMaybe<Scalars['BigDecimal']>;
  apr_gte?: InputMaybe<Scalars['BigDecimal']>;
  apr_lte?: InputMaybe<Scalars['BigDecimal']>;
  apr_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  apr_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<APRUpdate_filter>>>;
  or?: InputMaybe<Array<InputMaybe<APRUpdate_filter>>>;
};

export type APRUpdate_orderBy =
  | 'id'
  | 'ltoken'
  | 'ltoken__id'
  | 'ltoken__symbol'
  | 'ltoken__totalMintedRewards'
  | 'timestamp'
  | 'apr';

export type Activity = {
  id: Scalars['ID'];
  ltoken: LToken;
  timestamp: Scalars['BigInt'];
  account: Scalars['Bytes'];
  action: ActivityAction;
  amount: Scalars['BigDecimal'];
  status: ActivityStatus;
};

export type ActivityAction =
  | 'Deposit'
  | 'Withdraw';

export type ActivityStatus =
  | 'Queued'
  | 'Cancelled'
  | 'Success'
  | 'Fulfilled';

export type Activity_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  ltoken?: InputMaybe<Scalars['String']>;
  ltoken_not?: InputMaybe<Scalars['String']>;
  ltoken_gt?: InputMaybe<Scalars['String']>;
  ltoken_lt?: InputMaybe<Scalars['String']>;
  ltoken_gte?: InputMaybe<Scalars['String']>;
  ltoken_lte?: InputMaybe<Scalars['String']>;
  ltoken_in?: InputMaybe<Array<Scalars['String']>>;
  ltoken_not_in?: InputMaybe<Array<Scalars['String']>>;
  ltoken_contains?: InputMaybe<Scalars['String']>;
  ltoken_contains_nocase?: InputMaybe<Scalars['String']>;
  ltoken_not_contains?: InputMaybe<Scalars['String']>;
  ltoken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ltoken_starts_with?: InputMaybe<Scalars['String']>;
  ltoken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_not_starts_with?: InputMaybe<Scalars['String']>;
  ltoken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_ends_with?: InputMaybe<Scalars['String']>;
  ltoken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_not_ends_with?: InputMaybe<Scalars['String']>;
  ltoken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_?: InputMaybe<LToken_filter>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  account?: InputMaybe<Scalars['Bytes']>;
  account_not?: InputMaybe<Scalars['Bytes']>;
  account_gt?: InputMaybe<Scalars['Bytes']>;
  account_lt?: InputMaybe<Scalars['Bytes']>;
  account_gte?: InputMaybe<Scalars['Bytes']>;
  account_lte?: InputMaybe<Scalars['Bytes']>;
  account_in?: InputMaybe<Array<Scalars['Bytes']>>;
  account_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  account_contains?: InputMaybe<Scalars['Bytes']>;
  account_not_contains?: InputMaybe<Scalars['Bytes']>;
  action?: InputMaybe<ActivityAction>;
  action_not?: InputMaybe<ActivityAction>;
  action_in?: InputMaybe<Array<ActivityAction>>;
  action_not_in?: InputMaybe<Array<ActivityAction>>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  status?: InputMaybe<ActivityStatus>;
  status_not?: InputMaybe<ActivityStatus>;
  status_in?: InputMaybe<Array<ActivityStatus>>;
  status_not_in?: InputMaybe<Array<ActivityStatus>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Activity_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Activity_filter>>>;
};

export type Activity_orderBy =
  | 'id'
  | 'ltoken'
  | 'ltoken__id'
  | 'ltoken__symbol'
  | 'ltoken__totalMintedRewards'
  | 'timestamp'
  | 'account'
  | 'action'
  | 'amount'
  | 'status';

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type LTYStaking = {
  id: Scalars['ID'];
  totalStakedUpdates?: Maybe<Array<TotalStakedUpdate>>;
};


export type LTYStakingtotalStakedUpdatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TotalStakedUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TotalStakedUpdate_filter>;
};

export type LTYStaking_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  totalStakedUpdates_?: InputMaybe<TotalStakedUpdate_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<LTYStaking_filter>>>;
  or?: InputMaybe<Array<InputMaybe<LTYStaking_filter>>>;
};

export type LTYStaking_orderBy =
  | 'id'
  | 'totalStakedUpdates';

export type LToken = {
  id: Scalars['ID'];
  symbol: Scalars['String'];
  tvlUpdates?: Maybe<Array<TVLUpdate>>;
  aprUpdates?: Maybe<Array<APRUpdate>>;
  activities?: Maybe<Array<Activity>>;
  rewardsMints?: Maybe<Array<RewardsMint>>;
  totalMintedRewards: Scalars['BigDecimal'];
};


export type LTokentvlUpdatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TVLUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLUpdate_filter>;
};


export type LTokenaprUpdatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<APRUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRUpdate_filter>;
};


export type LTokenactivitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
};


export type LTokenrewardsMintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
};

export type LToken_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tvlUpdates_?: InputMaybe<TVLUpdate_filter>;
  aprUpdates_?: InputMaybe<APRUpdate_filter>;
  activities_?: InputMaybe<Activity_filter>;
  rewardsMints_?: InputMaybe<RewardsMint_filter>;
  totalMintedRewards?: InputMaybe<Scalars['BigDecimal']>;
  totalMintedRewards_not?: InputMaybe<Scalars['BigDecimal']>;
  totalMintedRewards_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalMintedRewards_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalMintedRewards_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalMintedRewards_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalMintedRewards_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalMintedRewards_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<LToken_filter>>>;
  or?: InputMaybe<Array<InputMaybe<LToken_filter>>>;
};

export type LToken_orderBy =
  | 'id'
  | 'symbol'
  | 'tvlUpdates'
  | 'aprUpdates'
  | 'activities'
  | 'rewardsMints'
  | 'totalMintedRewards';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Query = {
  ltoken?: Maybe<LToken>;
  ltokens: Array<LToken>;
  tvlupdate?: Maybe<TVLUpdate>;
  tvlupdates: Array<TVLUpdate>;
  aprupdate?: Maybe<APRUpdate>;
  aprupdates: Array<APRUpdate>;
  activity?: Maybe<Activity>;
  activities: Array<Activity>;
  rewardsMint?: Maybe<RewardsMint>;
  rewardsMints: Array<RewardsMint>;
  ltystaking?: Maybe<LTYStaking>;
  ltystakings: Array<LTYStaking>;
  totalStakedUpdate?: Maybe<TotalStakedUpdate>;
  totalStakedUpdates: Array<TotalStakedUpdate>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryltokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryltokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytvlupdateArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytvlupdatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TVLUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLUpdate_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryaprupdateArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryaprupdatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<APRUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRUpdate_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryactivityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryactivitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryrewardsMintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryrewardsMintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryltystakingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryltystakingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LTYStaking_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LTYStaking_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytotalStakedUpdateArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytotalStakedUpdatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TotalStakedUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TotalStakedUpdate_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type RewardsMint = {
  id: Scalars['ID'];
  ltoken: LToken;
  timestamp: Scalars['BigInt'];
  account: Scalars['Bytes'];
  balanceBefore: Scalars['BigDecimal'];
  revenue: Scalars['BigDecimal'];
  growth: Scalars['BigDecimal'];
};

export type RewardsMint_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  ltoken?: InputMaybe<Scalars['String']>;
  ltoken_not?: InputMaybe<Scalars['String']>;
  ltoken_gt?: InputMaybe<Scalars['String']>;
  ltoken_lt?: InputMaybe<Scalars['String']>;
  ltoken_gte?: InputMaybe<Scalars['String']>;
  ltoken_lte?: InputMaybe<Scalars['String']>;
  ltoken_in?: InputMaybe<Array<Scalars['String']>>;
  ltoken_not_in?: InputMaybe<Array<Scalars['String']>>;
  ltoken_contains?: InputMaybe<Scalars['String']>;
  ltoken_contains_nocase?: InputMaybe<Scalars['String']>;
  ltoken_not_contains?: InputMaybe<Scalars['String']>;
  ltoken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ltoken_starts_with?: InputMaybe<Scalars['String']>;
  ltoken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_not_starts_with?: InputMaybe<Scalars['String']>;
  ltoken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_ends_with?: InputMaybe<Scalars['String']>;
  ltoken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_not_ends_with?: InputMaybe<Scalars['String']>;
  ltoken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_?: InputMaybe<LToken_filter>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  account?: InputMaybe<Scalars['Bytes']>;
  account_not?: InputMaybe<Scalars['Bytes']>;
  account_gt?: InputMaybe<Scalars['Bytes']>;
  account_lt?: InputMaybe<Scalars['Bytes']>;
  account_gte?: InputMaybe<Scalars['Bytes']>;
  account_lte?: InputMaybe<Scalars['Bytes']>;
  account_in?: InputMaybe<Array<Scalars['Bytes']>>;
  account_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  account_contains?: InputMaybe<Scalars['Bytes']>;
  account_not_contains?: InputMaybe<Scalars['Bytes']>;
  balanceBefore?: InputMaybe<Scalars['BigDecimal']>;
  balanceBefore_not?: InputMaybe<Scalars['BigDecimal']>;
  balanceBefore_gt?: InputMaybe<Scalars['BigDecimal']>;
  balanceBefore_lt?: InputMaybe<Scalars['BigDecimal']>;
  balanceBefore_gte?: InputMaybe<Scalars['BigDecimal']>;
  balanceBefore_lte?: InputMaybe<Scalars['BigDecimal']>;
  balanceBefore_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  balanceBefore_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  revenue?: InputMaybe<Scalars['BigDecimal']>;
  revenue_not?: InputMaybe<Scalars['BigDecimal']>;
  revenue_gt?: InputMaybe<Scalars['BigDecimal']>;
  revenue_lt?: InputMaybe<Scalars['BigDecimal']>;
  revenue_gte?: InputMaybe<Scalars['BigDecimal']>;
  revenue_lte?: InputMaybe<Scalars['BigDecimal']>;
  revenue_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  revenue_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  growth?: InputMaybe<Scalars['BigDecimal']>;
  growth_not?: InputMaybe<Scalars['BigDecimal']>;
  growth_gt?: InputMaybe<Scalars['BigDecimal']>;
  growth_lt?: InputMaybe<Scalars['BigDecimal']>;
  growth_gte?: InputMaybe<Scalars['BigDecimal']>;
  growth_lte?: InputMaybe<Scalars['BigDecimal']>;
  growth_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  growth_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RewardsMint_filter>>>;
  or?: InputMaybe<Array<InputMaybe<RewardsMint_filter>>>;
};

export type RewardsMint_orderBy =
  | 'id'
  | 'ltoken'
  | 'ltoken__id'
  | 'ltoken__symbol'
  | 'ltoken__totalMintedRewards'
  | 'timestamp'
  | 'account'
  | 'balanceBefore'
  | 'revenue'
  | 'growth';

export type Subscription = {
  ltoken?: Maybe<LToken>;
  ltokens: Array<LToken>;
  tvlupdate?: Maybe<TVLUpdate>;
  tvlupdates: Array<TVLUpdate>;
  aprupdate?: Maybe<APRUpdate>;
  aprupdates: Array<APRUpdate>;
  activity?: Maybe<Activity>;
  activities: Array<Activity>;
  rewardsMint?: Maybe<RewardsMint>;
  rewardsMints: Array<RewardsMint>;
  ltystaking?: Maybe<LTYStaking>;
  ltystakings: Array<LTYStaking>;
  totalStakedUpdate?: Maybe<TotalStakedUpdate>;
  totalStakedUpdates: Array<TotalStakedUpdate>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionltokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionltokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontvlupdateArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontvlupdatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TVLUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLUpdate_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionaprupdateArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionaprupdatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<APRUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRUpdate_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionactivityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionactivitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionrewardsMintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionrewardsMintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionltystakingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionltystakingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LTYStaking_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LTYStaking_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontotalStakedUpdateArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontotalStakedUpdatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TotalStakedUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TotalStakedUpdate_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type TVLUpdate = {
  id: Scalars['ID'];
  ltoken: LToken;
  timestamp: Scalars['BigInt'];
  amount: Scalars['BigDecimal'];
};

export type TVLUpdate_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  ltoken?: InputMaybe<Scalars['String']>;
  ltoken_not?: InputMaybe<Scalars['String']>;
  ltoken_gt?: InputMaybe<Scalars['String']>;
  ltoken_lt?: InputMaybe<Scalars['String']>;
  ltoken_gte?: InputMaybe<Scalars['String']>;
  ltoken_lte?: InputMaybe<Scalars['String']>;
  ltoken_in?: InputMaybe<Array<Scalars['String']>>;
  ltoken_not_in?: InputMaybe<Array<Scalars['String']>>;
  ltoken_contains?: InputMaybe<Scalars['String']>;
  ltoken_contains_nocase?: InputMaybe<Scalars['String']>;
  ltoken_not_contains?: InputMaybe<Scalars['String']>;
  ltoken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ltoken_starts_with?: InputMaybe<Scalars['String']>;
  ltoken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_not_starts_with?: InputMaybe<Scalars['String']>;
  ltoken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_ends_with?: InputMaybe<Scalars['String']>;
  ltoken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_not_ends_with?: InputMaybe<Scalars['String']>;
  ltoken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ltoken_?: InputMaybe<LToken_filter>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TVLUpdate_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TVLUpdate_filter>>>;
};

export type TVLUpdate_orderBy =
  | 'id'
  | 'ltoken'
  | 'ltoken__id'
  | 'ltoken__symbol'
  | 'ltoken__totalMintedRewards'
  | 'timestamp'
  | 'amount';

export type TotalStakedUpdate = {
  id: Scalars['ID'];
  staking: LTYStaking;
  timestamp: Scalars['BigInt'];
  amount: Scalars['BigDecimal'];
};

export type TotalStakedUpdate_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  staking?: InputMaybe<Scalars['String']>;
  staking_not?: InputMaybe<Scalars['String']>;
  staking_gt?: InputMaybe<Scalars['String']>;
  staking_lt?: InputMaybe<Scalars['String']>;
  staking_gte?: InputMaybe<Scalars['String']>;
  staking_lte?: InputMaybe<Scalars['String']>;
  staking_in?: InputMaybe<Array<Scalars['String']>>;
  staking_not_in?: InputMaybe<Array<Scalars['String']>>;
  staking_contains?: InputMaybe<Scalars['String']>;
  staking_contains_nocase?: InputMaybe<Scalars['String']>;
  staking_not_contains?: InputMaybe<Scalars['String']>;
  staking_not_contains_nocase?: InputMaybe<Scalars['String']>;
  staking_starts_with?: InputMaybe<Scalars['String']>;
  staking_starts_with_nocase?: InputMaybe<Scalars['String']>;
  staking_not_starts_with?: InputMaybe<Scalars['String']>;
  staking_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  staking_ends_with?: InputMaybe<Scalars['String']>;
  staking_ends_with_nocase?: InputMaybe<Scalars['String']>;
  staking_not_ends_with?: InputMaybe<Scalars['String']>;
  staking_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  staking_?: InputMaybe<LTYStaking_filter>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TotalStakedUpdate_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TotalStakedUpdate_filter>>>;
};

export type TotalStakedUpdate_orderBy =
  | 'id'
  | 'staking'
  | 'staking__id'
  | 'timestamp'
  | 'amount';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  ltoken: InContextSdkMethod<Query['ltoken'], QueryltokenArgs, MeshContext>,
  /** null **/
  ltokens: InContextSdkMethod<Query['ltokens'], QueryltokensArgs, MeshContext>,
  /** null **/
  tvlupdate: InContextSdkMethod<Query['tvlupdate'], QuerytvlupdateArgs, MeshContext>,
  /** null **/
  tvlupdates: InContextSdkMethod<Query['tvlupdates'], QuerytvlupdatesArgs, MeshContext>,
  /** null **/
  aprupdate: InContextSdkMethod<Query['aprupdate'], QueryaprupdateArgs, MeshContext>,
  /** null **/
  aprupdates: InContextSdkMethod<Query['aprupdates'], QueryaprupdatesArgs, MeshContext>,
  /** null **/
  activity: InContextSdkMethod<Query['activity'], QueryactivityArgs, MeshContext>,
  /** null **/
  activities: InContextSdkMethod<Query['activities'], QueryactivitiesArgs, MeshContext>,
  /** null **/
  rewardsMint: InContextSdkMethod<Query['rewardsMint'], QueryrewardsMintArgs, MeshContext>,
  /** null **/
  rewardsMints: InContextSdkMethod<Query['rewardsMints'], QueryrewardsMintsArgs, MeshContext>,
  /** null **/
  ltystaking: InContextSdkMethod<Query['ltystaking'], QueryltystakingArgs, MeshContext>,
  /** null **/
  ltystakings: InContextSdkMethod<Query['ltystakings'], QueryltystakingsArgs, MeshContext>,
  /** null **/
  totalStakedUpdate: InContextSdkMethod<Query['totalStakedUpdate'], QuerytotalStakedUpdateArgs, MeshContext>,
  /** null **/
  totalStakedUpdates: InContextSdkMethod<Query['totalStakedUpdates'], QuerytotalStakedUpdatesArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  ltoken: InContextSdkMethod<Subscription['ltoken'], SubscriptionltokenArgs, MeshContext>,
  /** null **/
  ltokens: InContextSdkMethod<Subscription['ltokens'], SubscriptionltokensArgs, MeshContext>,
  /** null **/
  tvlupdate: InContextSdkMethod<Subscription['tvlupdate'], SubscriptiontvlupdateArgs, MeshContext>,
  /** null **/
  tvlupdates: InContextSdkMethod<Subscription['tvlupdates'], SubscriptiontvlupdatesArgs, MeshContext>,
  /** null **/
  aprupdate: InContextSdkMethod<Subscription['aprupdate'], SubscriptionaprupdateArgs, MeshContext>,
  /** null **/
  aprupdates: InContextSdkMethod<Subscription['aprupdates'], SubscriptionaprupdatesArgs, MeshContext>,
  /** null **/
  activity: InContextSdkMethod<Subscription['activity'], SubscriptionactivityArgs, MeshContext>,
  /** null **/
  activities: InContextSdkMethod<Subscription['activities'], SubscriptionactivitiesArgs, MeshContext>,
  /** null **/
  rewardsMint: InContextSdkMethod<Subscription['rewardsMint'], SubscriptionrewardsMintArgs, MeshContext>,
  /** null **/
  rewardsMints: InContextSdkMethod<Subscription['rewardsMints'], SubscriptionrewardsMintsArgs, MeshContext>,
  /** null **/
  ltystaking: InContextSdkMethod<Subscription['ltystaking'], SubscriptionltystakingArgs, MeshContext>,
  /** null **/
  ltystakings: InContextSdkMethod<Subscription['ltystakings'], SubscriptionltystakingsArgs, MeshContext>,
  /** null **/
  totalStakedUpdate: InContextSdkMethod<Subscription['totalStakedUpdate'], SubscriptiontotalStakedUpdateArgs, MeshContext>,
  /** null **/
  totalStakedUpdates: InContextSdkMethod<Subscription['totalStakedUpdates'], SubscriptiontotalStakedUpdatesArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["localhost-subgraph"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
