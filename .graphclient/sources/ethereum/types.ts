// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace EthereumTypes {
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
  Int8: any;
  Timestamp: any;
};

export type Aggregation_interval =
  | 'hour'
  | 'day';

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type EpochInvestment = {
  id: Scalars['ID'];
  user: User;
  epochNumber: Scalars['Int'];
  amount: Scalars['BigInt'];
};

export type EpochInvestment_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  user?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_filter>;
  epochNumber?: InputMaybe<Scalars['Int']>;
  epochNumber_not?: InputMaybe<Scalars['Int']>;
  epochNumber_gt?: InputMaybe<Scalars['Int']>;
  epochNumber_lt?: InputMaybe<Scalars['Int']>;
  epochNumber_gte?: InputMaybe<Scalars['Int']>;
  epochNumber_lte?: InputMaybe<Scalars['Int']>;
  epochNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  epochNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<EpochInvestment_filter>>>;
  or?: InputMaybe<Array<InputMaybe<EpochInvestment_filter>>>;
};

export type EpochInvestment_orderBy =
  | 'id'
  | 'user'
  | 'user__id'
  | 'user__totalDeposited'
  | 'user__totalWithdrawn'
  | 'user__totalRewardsClaimed'
  | 'epochNumber'
  | 'amount';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Query = {
  c1_user?: Maybe<User>;
  c1_users: Array<User>;
  c1_userAction?: Maybe<UserAction>;
  c1_userActions: Array<UserAction>;
  c1_epochInvestment?: Maybe<EpochInvestment>;
  c1_epochInvestments: Array<EpochInvestment>;
  /** Access to subgraph metadata */
  c1__meta?: Maybe<_Meta_>;
};


export type Queryc1_userArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc1_usersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<User_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc1_userActionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc1_userActionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserAction_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UserAction_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc1_epochInvestmentArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc1_epochInvestmentsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<EpochInvestment_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<EpochInvestment_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc1__metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  c1_user?: Maybe<User>;
  c1_users: Array<User>;
  c1_userAction?: Maybe<UserAction>;
  c1_userActions: Array<UserAction>;
  c1_epochInvestment?: Maybe<EpochInvestment>;
  c1_epochInvestments: Array<EpochInvestment>;
  /** Access to subgraph metadata */
  c1__meta?: Maybe<_Meta_>;
};


export type Subscriptionc1_userArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc1_usersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<User_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc1_userActionArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc1_userActionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserAction_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UserAction_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc1_epochInvestmentArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc1_epochInvestmentsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<EpochInvestment_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<EpochInvestment_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc1__metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type User = {
  id: Scalars['ID'];
  totalDeposited: Scalars['BigInt'];
  totalWithdrawn: Scalars['BigInt'];
  totalRewardsClaimed: Scalars['BigInt'];
  actions: Array<UserAction>;
  epochInvestments: Array<EpochInvestment>;
};


export type UseractionsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserAction_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<UserAction_filter>;
};


export type UserepochInvestmentsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<EpochInvestment_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<EpochInvestment_filter>;
};

export type UserAction = {
  id: Scalars['ID'];
  user: User;
  epochNumber: Scalars['Int'];
  amount: Scalars['BigInt'];
  actionType: Scalars['String'];
  timestamp: Scalars['BigInt'];
};

export type UserAction_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  user?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_filter>;
  epochNumber?: InputMaybe<Scalars['Int']>;
  epochNumber_not?: InputMaybe<Scalars['Int']>;
  epochNumber_gt?: InputMaybe<Scalars['Int']>;
  epochNumber_lt?: InputMaybe<Scalars['Int']>;
  epochNumber_gte?: InputMaybe<Scalars['Int']>;
  epochNumber_lte?: InputMaybe<Scalars['Int']>;
  epochNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  epochNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  actionType?: InputMaybe<Scalars['String']>;
  actionType_not?: InputMaybe<Scalars['String']>;
  actionType_gt?: InputMaybe<Scalars['String']>;
  actionType_lt?: InputMaybe<Scalars['String']>;
  actionType_gte?: InputMaybe<Scalars['String']>;
  actionType_lte?: InputMaybe<Scalars['String']>;
  actionType_in?: InputMaybe<Array<Scalars['String']>>;
  actionType_not_in?: InputMaybe<Array<Scalars['String']>>;
  actionType_contains?: InputMaybe<Scalars['String']>;
  actionType_contains_nocase?: InputMaybe<Scalars['String']>;
  actionType_not_contains?: InputMaybe<Scalars['String']>;
  actionType_not_contains_nocase?: InputMaybe<Scalars['String']>;
  actionType_starts_with?: InputMaybe<Scalars['String']>;
  actionType_starts_with_nocase?: InputMaybe<Scalars['String']>;
  actionType_not_starts_with?: InputMaybe<Scalars['String']>;
  actionType_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  actionType_ends_with?: InputMaybe<Scalars['String']>;
  actionType_ends_with_nocase?: InputMaybe<Scalars['String']>;
  actionType_not_ends_with?: InputMaybe<Scalars['String']>;
  actionType_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UserAction_filter>>>;
  or?: InputMaybe<Array<InputMaybe<UserAction_filter>>>;
};

export type UserAction_orderBy =
  | 'id'
  | 'user'
  | 'user__id'
  | 'user__totalDeposited'
  | 'user__totalWithdrawn'
  | 'user__totalRewardsClaimed'
  | 'epochNumber'
  | 'amount'
  | 'actionType'
  | 'timestamp';

export type User_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  totalDeposited?: InputMaybe<Scalars['BigInt']>;
  totalDeposited_not?: InputMaybe<Scalars['BigInt']>;
  totalDeposited_gt?: InputMaybe<Scalars['BigInt']>;
  totalDeposited_lt?: InputMaybe<Scalars['BigInt']>;
  totalDeposited_gte?: InputMaybe<Scalars['BigInt']>;
  totalDeposited_lte?: InputMaybe<Scalars['BigInt']>;
  totalDeposited_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalDeposited_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalWithdrawn?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawn_not?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawn_gt?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawn_lt?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawn_gte?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawn_lte?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawn_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalWithdrawn_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalRewardsClaimed?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_not?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_gt?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_lt?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_gte?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_lte?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalRewardsClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  actions_?: InputMaybe<UserAction_filter>;
  epochInvestments_?: InputMaybe<EpochInvestment_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<User_filter>>>;
  or?: InputMaybe<Array<InputMaybe<User_filter>>>;
};

export type User_orderBy =
  | 'id'
  | 'totalDeposited'
  | 'totalWithdrawn'
  | 'totalRewardsClaimed'
  | 'actions'
  | 'epochInvestments';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']>;
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
  c1_user: InContextSdkMethod<Query['c1_user'], Queryc1_userArgs, MeshContext>,
  /** null **/
  c1_users: InContextSdkMethod<Query['c1_users'], Queryc1_usersArgs, MeshContext>,
  /** null **/
  c1_userAction: InContextSdkMethod<Query['c1_userAction'], Queryc1_userActionArgs, MeshContext>,
  /** null **/
  c1_userActions: InContextSdkMethod<Query['c1_userActions'], Queryc1_userActionsArgs, MeshContext>,
  /** null **/
  c1_epochInvestment: InContextSdkMethod<Query['c1_epochInvestment'], Queryc1_epochInvestmentArgs, MeshContext>,
  /** null **/
  c1_epochInvestments: InContextSdkMethod<Query['c1_epochInvestments'], Queryc1_epochInvestmentsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  c1__meta: InContextSdkMethod<Query['c1__meta'], Queryc1__metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  c1_user: InContextSdkMethod<Subscription['c1_user'], Subscriptionc1_userArgs, MeshContext>,
  /** null **/
  c1_users: InContextSdkMethod<Subscription['c1_users'], Subscriptionc1_usersArgs, MeshContext>,
  /** null **/
  c1_userAction: InContextSdkMethod<Subscription['c1_userAction'], Subscriptionc1_userActionArgs, MeshContext>,
  /** null **/
  c1_userActions: InContextSdkMethod<Subscription['c1_userActions'], Subscriptionc1_userActionsArgs, MeshContext>,
  /** null **/
  c1_epochInvestment: InContextSdkMethod<Subscription['c1_epochInvestment'], Subscriptionc1_epochInvestmentArgs, MeshContext>,
  /** null **/
  c1_epochInvestments: InContextSdkMethod<Subscription['c1_epochInvestments'], Subscriptionc1_epochInvestmentsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  c1__meta: InContextSdkMethod<Subscription['c1__meta'], Subscriptionc1__metaArgs, MeshContext>
  };

  export type Context = {
      ["ethereum"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
