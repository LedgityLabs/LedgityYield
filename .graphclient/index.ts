// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from "@graphql-mesh/graphql"
import PrefixTransform from "@graphql-mesh/transform-prefix";
import StitchingMerger from "@graphql-mesh/merger-stitching";
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { EthereumTypes } from './sources/ethereum/types';
import type { ArbitrumTypes } from './sources/arbitrum/types';
import type { BaseTypes } from './sources/base/types';
import type { LineaTypes } from './sources/linea/types';
import * as importedModule$0 from "./sources/ethereum/introspectionSchema";
import * as importedModule$1 from "./sources/linea/introspectionSchema";
import * as importedModule$2 from "./sources/arbitrum/introspectionSchema";
import * as importedModule$3 from "./sources/base/introspectionSchema";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



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

export type Query = {
  c1_user?: Maybe<User>;
  c1_users: Array<User>;
  c1_userAction?: Maybe<UserAction>;
  c1_userActions: Array<UserAction>;
  c1_epochInvestment?: Maybe<EpochInvestment>;
  c1_epochInvestments: Array<EpochInvestment>;
  /** Access to subgraph metadata */
  c1__meta?: Maybe<_Meta_>;
  c59144_ltoken?: Maybe<LToken>;
  c59144_ltokens: Array<LToken>;
  c59144_tvlchange?: Maybe<TVLChange>;
  c59144_tvlchanges: Array<TVLChange>;
  c59144_aprchange?: Maybe<APRChange>;
  c59144_aprchanges: Array<APRChange>;
  c59144_activity?: Maybe<Activity>;
  c59144_activities: Array<Activity>;
  c59144_rewardsMint?: Maybe<RewardsMint>;
  c59144_rewardsMints: Array<RewardsMint>;
  c59144_preMiningLock?: Maybe<PreMiningLock>;
  c59144_preMiningLocks: Array<PreMiningLock>;
  c59144_stakingUser?: Maybe<StakingUser>;
  c59144_stakingUsers: Array<StakingUser>;
  c59144_stakingAPRInfo?: Maybe<StakingAPRInfo>;
  c59144_stakingAPRInfos: Array<StakingAPRInfo>;
  c59144_affiliateUser?: Maybe<AffiliateUser>;
  c59144_affiliateUsers: Array<AffiliateUser>;
  c59144_affiliateActivity?: Maybe<AffiliateActivity>;
  c59144_affiliateActivities: Array<AffiliateActivity>;
  /** Access to subgraph metadata */
  c59144__meta?: Maybe<_Meta_>;
  c42161_ltoken?: Maybe<LToken>;
  c42161_ltokens: Array<LToken>;
  c42161_tvlchange?: Maybe<TVLChange>;
  c42161_tvlchanges: Array<TVLChange>;
  c42161_aprchange?: Maybe<APRChange>;
  c42161_aprchanges: Array<APRChange>;
  c42161_activity?: Maybe<Activity>;
  c42161_activities: Array<Activity>;
  c42161_rewardsMint?: Maybe<RewardsMint>;
  c42161_rewardsMints: Array<RewardsMint>;
  c42161_preMiningLock?: Maybe<PreMiningLock>;
  c42161_preMiningLocks: Array<PreMiningLock>;
  c42161_stakingUser?: Maybe<StakingUser>;
  c42161_stakingUsers: Array<StakingUser>;
  c42161_stakingAPRInfo?: Maybe<StakingAPRInfo>;
  c42161_stakingAPRInfos: Array<StakingAPRInfo>;
  c42161_affiliateUser?: Maybe<AffiliateUser>;
  c42161_affiliateUsers: Array<AffiliateUser>;
  c42161_affiliateActivity?: Maybe<AffiliateActivity>;
  c42161_affiliateActivities: Array<AffiliateActivity>;
  /** Access to subgraph metadata */
  c42161__meta?: Maybe<_Meta_>;
  c8453_ltoken?: Maybe<LToken>;
  c8453_ltokens: Array<LToken>;
  c8453_tvlchange?: Maybe<TVLChange>;
  c8453_tvlchanges: Array<TVLChange>;
  c8453_aprchange?: Maybe<APRChange>;
  c8453_aprchanges: Array<APRChange>;
  c8453_activity?: Maybe<Activity>;
  c8453_activities: Array<Activity>;
  c8453_rewardsMint?: Maybe<RewardsMint>;
  c8453_rewardsMints: Array<RewardsMint>;
  c8453_preMiningLock?: Maybe<PreMiningLock>;
  c8453_preMiningLocks: Array<PreMiningLock>;
  c8453_stakingUser?: Maybe<StakingUser>;
  c8453_stakingUsers: Array<StakingUser>;
  c8453_stakingAPRInfo?: Maybe<StakingAPRInfo>;
  c8453_stakingAPRInfos: Array<StakingAPRInfo>;
  c8453_affiliateUser?: Maybe<AffiliateUser>;
  c8453_affiliateUsers: Array<AffiliateUser>;
  c8453_affiliateActivity?: Maybe<AffiliateActivity>;
  c8453_affiliateActivities: Array<AffiliateActivity>;
  c8453_affiliateInfo?: Maybe<AffiliateInfo>;
  c8453_affiliateInfos: Array<AffiliateInfo>;
  /** Access to subgraph metadata */
  c8453__meta?: Maybe<_Meta_>;
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


export type Queryc59144_ltokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_ltokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_tvlchangeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_tvlchangesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TVLChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_aprchangeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_aprchangesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<APRChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_activityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_activitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_rewardsMintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_rewardsMintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_preMiningLockArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_preMiningLocksArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PreMiningLock_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PreMiningLock_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_stakingUserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_stakingUsersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakingUser_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<StakingUser_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_stakingAPRInfoArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_stakingAPRInfosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakingAPRInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<StakingAPRInfo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_affiliateUserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_affiliateUsersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffiliateUser_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AffiliateUser_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_affiliateActivityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144_affiliateActivitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffiliateActivity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AffiliateActivity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc59144__metaArgs = {
  block?: InputMaybe<Block_height>;
};


export type Queryc42161_ltokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_ltokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_tvlchangeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_tvlchangesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TVLChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_aprchangeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_aprchangesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<APRChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_activityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_activitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_rewardsMintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_rewardsMintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_preMiningLockArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_preMiningLocksArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PreMiningLock_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PreMiningLock_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_stakingUserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_stakingUsersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakingUser_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<StakingUser_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_stakingAPRInfoArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_stakingAPRInfosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakingAPRInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<StakingAPRInfo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_affiliateUserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_affiliateUsersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffiliateUser_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AffiliateUser_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_affiliateActivityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161_affiliateActivitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffiliateActivity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AffiliateActivity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc42161__metaArgs = {
  block?: InputMaybe<Block_height>;
};


export type Queryc8453_ltokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_ltokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_tvlchangeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_tvlchangesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TVLChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_aprchangeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_aprchangesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<APRChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_activityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_activitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_rewardsMintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_rewardsMintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_preMiningLockArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_preMiningLocksArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PreMiningLock_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PreMiningLock_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_stakingUserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_stakingUsersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakingUser_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<StakingUser_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_stakingAPRInfoArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_stakingAPRInfosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakingAPRInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<StakingAPRInfo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_affiliateUserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_affiliateUsersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffiliateUser_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AffiliateUser_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_affiliateActivityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_affiliateActivitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffiliateActivity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AffiliateActivity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_affiliateInfoArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453_affiliateInfosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffiliateInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AffiliateInfo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryc8453__metaArgs = {
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
  c59144_ltoken?: Maybe<LToken>;
  c59144_ltokens: Array<LToken>;
  c59144_tvlchange?: Maybe<TVLChange>;
  c59144_tvlchanges: Array<TVLChange>;
  c59144_aprchange?: Maybe<APRChange>;
  c59144_aprchanges: Array<APRChange>;
  c59144_activity?: Maybe<Activity>;
  c59144_activities: Array<Activity>;
  c59144_rewardsMint?: Maybe<RewardsMint>;
  c59144_rewardsMints: Array<RewardsMint>;
  c59144_preMiningLock?: Maybe<PreMiningLock>;
  c59144_preMiningLocks: Array<PreMiningLock>;
  c59144_stakingUser?: Maybe<StakingUser>;
  c59144_stakingUsers: Array<StakingUser>;
  c59144_stakingAPRInfo?: Maybe<StakingAPRInfo>;
  c59144_stakingAPRInfos: Array<StakingAPRInfo>;
  c59144_affiliateUser?: Maybe<AffiliateUser>;
  c59144_affiliateUsers: Array<AffiliateUser>;
  c59144_affiliateActivity?: Maybe<AffiliateActivity>;
  c59144_affiliateActivities: Array<AffiliateActivity>;
  /** Access to subgraph metadata */
  c59144__meta?: Maybe<_Meta_>;
  c42161_ltoken?: Maybe<LToken>;
  c42161_ltokens: Array<LToken>;
  c42161_tvlchange?: Maybe<TVLChange>;
  c42161_tvlchanges: Array<TVLChange>;
  c42161_aprchange?: Maybe<APRChange>;
  c42161_aprchanges: Array<APRChange>;
  c42161_activity?: Maybe<Activity>;
  c42161_activities: Array<Activity>;
  c42161_rewardsMint?: Maybe<RewardsMint>;
  c42161_rewardsMints: Array<RewardsMint>;
  c42161_preMiningLock?: Maybe<PreMiningLock>;
  c42161_preMiningLocks: Array<PreMiningLock>;
  c42161_stakingUser?: Maybe<StakingUser>;
  c42161_stakingUsers: Array<StakingUser>;
  c42161_stakingAPRInfo?: Maybe<StakingAPRInfo>;
  c42161_stakingAPRInfos: Array<StakingAPRInfo>;
  c42161_affiliateUser?: Maybe<AffiliateUser>;
  c42161_affiliateUsers: Array<AffiliateUser>;
  c42161_affiliateActivity?: Maybe<AffiliateActivity>;
  c42161_affiliateActivities: Array<AffiliateActivity>;
  /** Access to subgraph metadata */
  c42161__meta?: Maybe<_Meta_>;
  c8453_ltoken?: Maybe<LToken>;
  c8453_ltokens: Array<LToken>;
  c8453_tvlchange?: Maybe<TVLChange>;
  c8453_tvlchanges: Array<TVLChange>;
  c8453_aprchange?: Maybe<APRChange>;
  c8453_aprchanges: Array<APRChange>;
  c8453_activity?: Maybe<Activity>;
  c8453_activities: Array<Activity>;
  c8453_rewardsMint?: Maybe<RewardsMint>;
  c8453_rewardsMints: Array<RewardsMint>;
  c8453_preMiningLock?: Maybe<PreMiningLock>;
  c8453_preMiningLocks: Array<PreMiningLock>;
  c8453_stakingUser?: Maybe<StakingUser>;
  c8453_stakingUsers: Array<StakingUser>;
  c8453_stakingAPRInfo?: Maybe<StakingAPRInfo>;
  c8453_stakingAPRInfos: Array<StakingAPRInfo>;
  c8453_affiliateUser?: Maybe<AffiliateUser>;
  c8453_affiliateUsers: Array<AffiliateUser>;
  c8453_affiliateActivity?: Maybe<AffiliateActivity>;
  c8453_affiliateActivities: Array<AffiliateActivity>;
  c8453_affiliateInfo?: Maybe<AffiliateInfo>;
  c8453_affiliateInfos: Array<AffiliateInfo>;
  /** Access to subgraph metadata */
  c8453__meta?: Maybe<_Meta_>;
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


export type Subscriptionc59144_ltokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_ltokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_tvlchangeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_tvlchangesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TVLChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_aprchangeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_aprchangesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<APRChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_activityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_activitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_rewardsMintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_rewardsMintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_preMiningLockArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_preMiningLocksArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PreMiningLock_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PreMiningLock_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_stakingUserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_stakingUsersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakingUser_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<StakingUser_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_stakingAPRInfoArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_stakingAPRInfosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakingAPRInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<StakingAPRInfo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_affiliateUserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_affiliateUsersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffiliateUser_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AffiliateUser_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_affiliateActivityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144_affiliateActivitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffiliateActivity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AffiliateActivity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc59144__metaArgs = {
  block?: InputMaybe<Block_height>;
};


export type Subscriptionc42161_ltokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_ltokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_tvlchangeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_tvlchangesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TVLChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_aprchangeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_aprchangesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<APRChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_activityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_activitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_rewardsMintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_rewardsMintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_preMiningLockArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_preMiningLocksArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PreMiningLock_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PreMiningLock_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_stakingUserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_stakingUsersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakingUser_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<StakingUser_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_stakingAPRInfoArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_stakingAPRInfosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakingAPRInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<StakingAPRInfo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_affiliateUserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_affiliateUsersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffiliateUser_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AffiliateUser_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_affiliateActivityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161_affiliateActivitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffiliateActivity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AffiliateActivity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc42161__metaArgs = {
  block?: InputMaybe<Block_height>;
};


export type Subscriptionc8453_ltokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_ltokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_tvlchangeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_tvlchangesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TVLChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_aprchangeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_aprchangesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<APRChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_activityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_activitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_rewardsMintArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_rewardsMintsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_preMiningLockArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_preMiningLocksArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PreMiningLock_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PreMiningLock_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_stakingUserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_stakingUsersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakingUser_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<StakingUser_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_stakingAPRInfoArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_stakingAPRInfosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakingAPRInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<StakingAPRInfo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_affiliateUserArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_affiliateUsersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffiliateUser_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AffiliateUser_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_affiliateActivityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_affiliateActivitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffiliateActivity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AffiliateActivity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_affiliateInfoArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453_affiliateInfosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffiliateInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AffiliateInfo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionc8453__metaArgs = {
  block?: InputMaybe<Block_height>;
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

export type APRChange = {
  id: Scalars['ID'];
  ltoken: LToken;
  timestamp: Scalars['BigInt'];
  apr: Scalars['BigDecimal'];
};

export type APRChange_filter = {
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
  and?: InputMaybe<Array<InputMaybe<APRChange_filter>>>;
  or?: InputMaybe<Array<InputMaybe<APRChange_filter>>>;
};

export type APRChange_orderBy =
  | 'id'
  | 'ltoken'
  | 'ltoken__id'
  | 'ltoken__symbol'
  | 'ltoken__decimals'
  | 'ltoken__totalMintedRewards'
  | 'timestamp'
  | 'apr';

export type Activity = {
  id: Scalars['ID'];
  requestId: Scalars['BigInt'];
  ltoken: LToken;
  timestamp: Scalars['BigInt'];
  account: Scalars['Bytes'];
  action: ActivityAction;
  amount: Scalars['BigDecimal'];
  amountAfterFees: Scalars['BigDecimal'];
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
  requestId?: InputMaybe<Scalars['BigInt']>;
  requestId_not?: InputMaybe<Scalars['BigInt']>;
  requestId_gt?: InputMaybe<Scalars['BigInt']>;
  requestId_lt?: InputMaybe<Scalars['BigInt']>;
  requestId_gte?: InputMaybe<Scalars['BigInt']>;
  requestId_lte?: InputMaybe<Scalars['BigInt']>;
  requestId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  requestId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  amountAfterFees?: InputMaybe<Scalars['BigDecimal']>;
  amountAfterFees_not?: InputMaybe<Scalars['BigDecimal']>;
  amountAfterFees_gt?: InputMaybe<Scalars['BigDecimal']>;
  amountAfterFees_lt?: InputMaybe<Scalars['BigDecimal']>;
  amountAfterFees_gte?: InputMaybe<Scalars['BigDecimal']>;
  amountAfterFees_lte?: InputMaybe<Scalars['BigDecimal']>;
  amountAfterFees_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amountAfterFees_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
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
  | 'requestId'
  | 'ltoken'
  | 'ltoken__id'
  | 'ltoken__symbol'
  | 'ltoken__decimals'
  | 'ltoken__totalMintedRewards'
  | 'timestamp'
  | 'account'
  | 'action'
  | 'amount'
  | 'amountAfterFees'
  | 'status';

export type AffiliateActivity = {
  id: Scalars['ID'];
  affiliateCode: Scalars['String'];
  ltoken: LToken;
  action: ActivityAction;
  account: Scalars['Bytes'];
  amount: Scalars['BigInt'];
  amountAfterFees: Scalars['BigInt'];
  txHash: Scalars['Bytes'];
  logIndex: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  affiliateInfo: AffiliateInfo;
};

export type AffiliateActivity_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  affiliateCode?: InputMaybe<Scalars['String']>;
  affiliateCode_not?: InputMaybe<Scalars['String']>;
  affiliateCode_gt?: InputMaybe<Scalars['String']>;
  affiliateCode_lt?: InputMaybe<Scalars['String']>;
  affiliateCode_gte?: InputMaybe<Scalars['String']>;
  affiliateCode_lte?: InputMaybe<Scalars['String']>;
  affiliateCode_in?: InputMaybe<Array<Scalars['String']>>;
  affiliateCode_not_in?: InputMaybe<Array<Scalars['String']>>;
  affiliateCode_contains?: InputMaybe<Scalars['String']>;
  affiliateCode_contains_nocase?: InputMaybe<Scalars['String']>;
  affiliateCode_not_contains?: InputMaybe<Scalars['String']>;
  affiliateCode_not_contains_nocase?: InputMaybe<Scalars['String']>;
  affiliateCode_starts_with?: InputMaybe<Scalars['String']>;
  affiliateCode_starts_with_nocase?: InputMaybe<Scalars['String']>;
  affiliateCode_not_starts_with?: InputMaybe<Scalars['String']>;
  affiliateCode_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  affiliateCode_ends_with?: InputMaybe<Scalars['String']>;
  affiliateCode_ends_with_nocase?: InputMaybe<Scalars['String']>;
  affiliateCode_not_ends_with?: InputMaybe<Scalars['String']>;
  affiliateCode_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
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
  action?: InputMaybe<ActivityAction>;
  action_not?: InputMaybe<ActivityAction>;
  action_in?: InputMaybe<Array<ActivityAction>>;
  action_not_in?: InputMaybe<Array<ActivityAction>>;
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
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountAfterFees?: InputMaybe<Scalars['BigInt']>;
  amountAfterFees_not?: InputMaybe<Scalars['BigInt']>;
  amountAfterFees_gt?: InputMaybe<Scalars['BigInt']>;
  amountAfterFees_lt?: InputMaybe<Scalars['BigInt']>;
  amountAfterFees_gte?: InputMaybe<Scalars['BigInt']>;
  amountAfterFees_lte?: InputMaybe<Scalars['BigInt']>;
  amountAfterFees_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountAfterFees_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_gt?: InputMaybe<Scalars['Bytes']>;
  txHash_lt?: InputMaybe<Scalars['Bytes']>;
  txHash_gte?: InputMaybe<Scalars['Bytes']>;
  txHash_lte?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  logIndex?: InputMaybe<Scalars['BigInt']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  and?: InputMaybe<Array<InputMaybe<AffiliateActivity_filter>>>;
  or?: InputMaybe<Array<InputMaybe<AffiliateActivity_filter>>>;
  affiliateInfo?: InputMaybe<Scalars['String']>;
  affiliateInfo_not?: InputMaybe<Scalars['String']>;
  affiliateInfo_gt?: InputMaybe<Scalars['String']>;
  affiliateInfo_lt?: InputMaybe<Scalars['String']>;
  affiliateInfo_gte?: InputMaybe<Scalars['String']>;
  affiliateInfo_lte?: InputMaybe<Scalars['String']>;
  affiliateInfo_in?: InputMaybe<Array<Scalars['String']>>;
  affiliateInfo_not_in?: InputMaybe<Array<Scalars['String']>>;
  affiliateInfo_contains?: InputMaybe<Scalars['String']>;
  affiliateInfo_contains_nocase?: InputMaybe<Scalars['String']>;
  affiliateInfo_not_contains?: InputMaybe<Scalars['String']>;
  affiliateInfo_not_contains_nocase?: InputMaybe<Scalars['String']>;
  affiliateInfo_starts_with?: InputMaybe<Scalars['String']>;
  affiliateInfo_starts_with_nocase?: InputMaybe<Scalars['String']>;
  affiliateInfo_not_starts_with?: InputMaybe<Scalars['String']>;
  affiliateInfo_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  affiliateInfo_ends_with?: InputMaybe<Scalars['String']>;
  affiliateInfo_ends_with_nocase?: InputMaybe<Scalars['String']>;
  affiliateInfo_not_ends_with?: InputMaybe<Scalars['String']>;
  affiliateInfo_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  affiliateInfo_?: InputMaybe<AffiliateInfo_filter>;
};

export type AffiliateActivity_orderBy =
  | 'id'
  | 'affiliateCode'
  | 'ltoken'
  | 'ltoken__id'
  | 'ltoken__symbol'
  | 'ltoken__decimals'
  | 'ltoken__totalMintedRewards'
  | 'action'
  | 'account'
  | 'amount'
  | 'amountAfterFees'
  | 'txHash'
  | 'logIndex'
  | 'timestamp'
  | 'affiliateInfo'
  | 'affiliateInfo__id'
  | 'affiliateInfo__affiliateCode'
  | 'affiliateInfo__lastTimestamp'
  | 'affiliateInfo__totalAmount'
  | 'affiliateInfo__totalAmountAfterFees';

export type AffiliateUser = {
  id: Scalars['ID'];
  walletAddress: Scalars['Bytes'];
  affiliateCode: Scalars['String'];
};

export type AffiliateUser_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  walletAddress?: InputMaybe<Scalars['Bytes']>;
  walletAddress_not?: InputMaybe<Scalars['Bytes']>;
  walletAddress_gt?: InputMaybe<Scalars['Bytes']>;
  walletAddress_lt?: InputMaybe<Scalars['Bytes']>;
  walletAddress_gte?: InputMaybe<Scalars['Bytes']>;
  walletAddress_lte?: InputMaybe<Scalars['Bytes']>;
  walletAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  walletAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  walletAddress_contains?: InputMaybe<Scalars['Bytes']>;
  walletAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  affiliateCode?: InputMaybe<Scalars['String']>;
  affiliateCode_not?: InputMaybe<Scalars['String']>;
  affiliateCode_gt?: InputMaybe<Scalars['String']>;
  affiliateCode_lt?: InputMaybe<Scalars['String']>;
  affiliateCode_gte?: InputMaybe<Scalars['String']>;
  affiliateCode_lte?: InputMaybe<Scalars['String']>;
  affiliateCode_in?: InputMaybe<Array<Scalars['String']>>;
  affiliateCode_not_in?: InputMaybe<Array<Scalars['String']>>;
  affiliateCode_contains?: InputMaybe<Scalars['String']>;
  affiliateCode_contains_nocase?: InputMaybe<Scalars['String']>;
  affiliateCode_not_contains?: InputMaybe<Scalars['String']>;
  affiliateCode_not_contains_nocase?: InputMaybe<Scalars['String']>;
  affiliateCode_starts_with?: InputMaybe<Scalars['String']>;
  affiliateCode_starts_with_nocase?: InputMaybe<Scalars['String']>;
  affiliateCode_not_starts_with?: InputMaybe<Scalars['String']>;
  affiliateCode_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  affiliateCode_ends_with?: InputMaybe<Scalars['String']>;
  affiliateCode_ends_with_nocase?: InputMaybe<Scalars['String']>;
  affiliateCode_not_ends_with?: InputMaybe<Scalars['String']>;
  affiliateCode_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AffiliateUser_filter>>>;
  or?: InputMaybe<Array<InputMaybe<AffiliateUser_filter>>>;
};

export type AffiliateUser_orderBy =
  | 'id'
  | 'walletAddress'
  | 'affiliateCode';

export type LToken = {
  id: Scalars['ID'];
  symbol: Scalars['String'];
  decimals: Scalars['Int'];
  totalMintedRewards: Scalars['BigDecimal'];
  tvlUpdates?: Maybe<Array<TVLChange>>;
  aprUpdates?: Maybe<Array<APRChange>>;
  activities?: Maybe<Array<Activity>>;
  rewardsMints?: Maybe<Array<RewardsMint>>;
};


export type LTokentvlUpdatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TVLChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLChange_filter>;
};


export type LTokenaprUpdatesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<APRChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRChange_filter>;
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
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  totalMintedRewards?: InputMaybe<Scalars['BigDecimal']>;
  totalMintedRewards_not?: InputMaybe<Scalars['BigDecimal']>;
  totalMintedRewards_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalMintedRewards_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalMintedRewards_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalMintedRewards_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalMintedRewards_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalMintedRewards_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tvlUpdates_?: InputMaybe<TVLChange_filter>;
  aprUpdates_?: InputMaybe<APRChange_filter>;
  activities_?: InputMaybe<Activity_filter>;
  rewardsMints_?: InputMaybe<RewardsMint_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<LToken_filter>>>;
  or?: InputMaybe<Array<InputMaybe<LToken_filter>>>;
};

export type LToken_orderBy =
  | 'id'
  | 'symbol'
  | 'decimals'
  | 'totalMintedRewards'
  | 'tvlUpdates'
  | 'aprUpdates'
  | 'activities'
  | 'rewardsMints';

export type PreMiningLock = {
  id: Scalars['ID'];
  amount: Scalars['BigDecimal'];
  duration: Scalars['Int'];
};

export type PreMiningLock_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  duration?: InputMaybe<Scalars['Int']>;
  duration_not?: InputMaybe<Scalars['Int']>;
  duration_gt?: InputMaybe<Scalars['Int']>;
  duration_lt?: InputMaybe<Scalars['Int']>;
  duration_gte?: InputMaybe<Scalars['Int']>;
  duration_lte?: InputMaybe<Scalars['Int']>;
  duration_in?: InputMaybe<Array<Scalars['Int']>>;
  duration_not_in?: InputMaybe<Array<Scalars['Int']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PreMiningLock_filter>>>;
  or?: InputMaybe<Array<InputMaybe<PreMiningLock_filter>>>;
};

export type PreMiningLock_orderBy =
  | 'id'
  | 'amount'
  | 'duration';

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
  | 'ltoken__decimals'
  | 'ltoken__totalMintedRewards'
  | 'timestamp'
  | 'account'
  | 'balanceBefore'
  | 'revenue'
  | 'growth';

export type StakingAPRInfo = {
  id: Scalars['ID'];
  rewardPerSec: Scalars['BigInt'];
  totalStaked: Scalars['BigInt'];
  interestRate: Scalars['BigDecimal'];
};

export type StakingAPRInfo_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  rewardPerSec?: InputMaybe<Scalars['BigInt']>;
  rewardPerSec_not?: InputMaybe<Scalars['BigInt']>;
  rewardPerSec_gt?: InputMaybe<Scalars['BigInt']>;
  rewardPerSec_lt?: InputMaybe<Scalars['BigInt']>;
  rewardPerSec_gte?: InputMaybe<Scalars['BigInt']>;
  rewardPerSec_lte?: InputMaybe<Scalars['BigInt']>;
  rewardPerSec_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardPerSec_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStaked?: InputMaybe<Scalars['BigInt']>;
  totalStaked_not?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_lt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_lte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  interestRate?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_not?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_gt?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_lt?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_gte?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_lte?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  interestRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StakingAPRInfo_filter>>>;
  or?: InputMaybe<Array<InputMaybe<StakingAPRInfo_filter>>>;
};

export type StakingAPRInfo_orderBy =
  | 'id'
  | 'rewardPerSec'
  | 'totalStaked'
  | 'interestRate';

export type StakingUser = {
  id: Scalars['ID'];
  user: Scalars['Bytes'];
  stakeIndex: Scalars['BigInt'];
  stakedAmount: Scalars['BigInt'];
  earnedAmount: Scalars['BigInt'];
};

export type StakingUser_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  user?: InputMaybe<Scalars['Bytes']>;
  user_not?: InputMaybe<Scalars['Bytes']>;
  user_gt?: InputMaybe<Scalars['Bytes']>;
  user_lt?: InputMaybe<Scalars['Bytes']>;
  user_gte?: InputMaybe<Scalars['Bytes']>;
  user_lte?: InputMaybe<Scalars['Bytes']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_contains?: InputMaybe<Scalars['Bytes']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']>;
  stakeIndex?: InputMaybe<Scalars['BigInt']>;
  stakeIndex_not?: InputMaybe<Scalars['BigInt']>;
  stakeIndex_gt?: InputMaybe<Scalars['BigInt']>;
  stakeIndex_lt?: InputMaybe<Scalars['BigInt']>;
  stakeIndex_gte?: InputMaybe<Scalars['BigInt']>;
  stakeIndex_lte?: InputMaybe<Scalars['BigInt']>;
  stakeIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stakeIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stakedAmount?: InputMaybe<Scalars['BigInt']>;
  stakedAmount_not?: InputMaybe<Scalars['BigInt']>;
  stakedAmount_gt?: InputMaybe<Scalars['BigInt']>;
  stakedAmount_lt?: InputMaybe<Scalars['BigInt']>;
  stakedAmount_gte?: InputMaybe<Scalars['BigInt']>;
  stakedAmount_lte?: InputMaybe<Scalars['BigInt']>;
  stakedAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stakedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  earnedAmount?: InputMaybe<Scalars['BigInt']>;
  earnedAmount_not?: InputMaybe<Scalars['BigInt']>;
  earnedAmount_gt?: InputMaybe<Scalars['BigInt']>;
  earnedAmount_lt?: InputMaybe<Scalars['BigInt']>;
  earnedAmount_gte?: InputMaybe<Scalars['BigInt']>;
  earnedAmount_lte?: InputMaybe<Scalars['BigInt']>;
  earnedAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  earnedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StakingUser_filter>>>;
  or?: InputMaybe<Array<InputMaybe<StakingUser_filter>>>;
};

export type StakingUser_orderBy =
  | 'id'
  | 'user'
  | 'stakeIndex'
  | 'stakedAmount'
  | 'earnedAmount';

export type TVLChange = {
  id: Scalars['ID'];
  ltoken: LToken;
  timestamp: Scalars['BigInt'];
  amount: Scalars['BigDecimal'];
};

export type TVLChange_filter = {
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
  and?: InputMaybe<Array<InputMaybe<TVLChange_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TVLChange_filter>>>;
};

export type TVLChange_orderBy =
  | 'id'
  | 'ltoken'
  | 'ltoken__id'
  | 'ltoken__symbol'
  | 'ltoken__decimals'
  | 'ltoken__totalMintedRewards'
  | 'timestamp'
  | 'amount';

export type AffiliateInfo = {
  id: Scalars['ID'];
  affiliateCode: Scalars['String'];
  ltoken: LToken;
  lastTimestamp: Scalars['BigInt'];
  account: AffiliateUser;
  totalAmount: Scalars['BigInt'];
  totalAmountAfterFees: Scalars['BigInt'];
  activities?: Maybe<Array<AffiliateActivity>>;
};


export type AffiliateInfoactivitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AffiliateActivity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AffiliateActivity_filter>;
};

export type AffiliateInfo_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  affiliateCode?: InputMaybe<Scalars['String']>;
  affiliateCode_not?: InputMaybe<Scalars['String']>;
  affiliateCode_gt?: InputMaybe<Scalars['String']>;
  affiliateCode_lt?: InputMaybe<Scalars['String']>;
  affiliateCode_gte?: InputMaybe<Scalars['String']>;
  affiliateCode_lte?: InputMaybe<Scalars['String']>;
  affiliateCode_in?: InputMaybe<Array<Scalars['String']>>;
  affiliateCode_not_in?: InputMaybe<Array<Scalars['String']>>;
  affiliateCode_contains?: InputMaybe<Scalars['String']>;
  affiliateCode_contains_nocase?: InputMaybe<Scalars['String']>;
  affiliateCode_not_contains?: InputMaybe<Scalars['String']>;
  affiliateCode_not_contains_nocase?: InputMaybe<Scalars['String']>;
  affiliateCode_starts_with?: InputMaybe<Scalars['String']>;
  affiliateCode_starts_with_nocase?: InputMaybe<Scalars['String']>;
  affiliateCode_not_starts_with?: InputMaybe<Scalars['String']>;
  affiliateCode_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  affiliateCode_ends_with?: InputMaybe<Scalars['String']>;
  affiliateCode_ends_with_nocase?: InputMaybe<Scalars['String']>;
  affiliateCode_not_ends_with?: InputMaybe<Scalars['String']>;
  affiliateCode_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
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
  lastTimestamp?: InputMaybe<Scalars['BigInt']>;
  lastTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  lastTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  lastTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  lastTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  lastTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  lastTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  account?: InputMaybe<Scalars['String']>;
  account_not?: InputMaybe<Scalars['String']>;
  account_gt?: InputMaybe<Scalars['String']>;
  account_lt?: InputMaybe<Scalars['String']>;
  account_gte?: InputMaybe<Scalars['String']>;
  account_lte?: InputMaybe<Scalars['String']>;
  account_in?: InputMaybe<Array<Scalars['String']>>;
  account_not_in?: InputMaybe<Array<Scalars['String']>>;
  account_contains?: InputMaybe<Scalars['String']>;
  account_contains_nocase?: InputMaybe<Scalars['String']>;
  account_not_contains?: InputMaybe<Scalars['String']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']>;
  account_starts_with?: InputMaybe<Scalars['String']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']>;
  account_not_starts_with?: InputMaybe<Scalars['String']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  account_ends_with?: InputMaybe<Scalars['String']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']>;
  account_not_ends_with?: InputMaybe<Scalars['String']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  account_?: InputMaybe<AffiliateUser_filter>;
  totalAmount?: InputMaybe<Scalars['BigInt']>;
  totalAmount_not?: InputMaybe<Scalars['BigInt']>;
  totalAmount_gt?: InputMaybe<Scalars['BigInt']>;
  totalAmount_lt?: InputMaybe<Scalars['BigInt']>;
  totalAmount_gte?: InputMaybe<Scalars['BigInt']>;
  totalAmount_lte?: InputMaybe<Scalars['BigInt']>;
  totalAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmountAfterFees?: InputMaybe<Scalars['BigInt']>;
  totalAmountAfterFees_not?: InputMaybe<Scalars['BigInt']>;
  totalAmountAfterFees_gt?: InputMaybe<Scalars['BigInt']>;
  totalAmountAfterFees_lt?: InputMaybe<Scalars['BigInt']>;
  totalAmountAfterFees_gte?: InputMaybe<Scalars['BigInt']>;
  totalAmountAfterFees_lte?: InputMaybe<Scalars['BigInt']>;
  totalAmountAfterFees_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmountAfterFees_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  activities_?: InputMaybe<AffiliateActivity_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AffiliateInfo_filter>>>;
  or?: InputMaybe<Array<InputMaybe<AffiliateInfo_filter>>>;
};

export type AffiliateInfo_orderBy =
  | 'id'
  | 'affiliateCode'
  | 'ltoken'
  | 'ltoken__id'
  | 'ltoken__symbol'
  | 'ltoken__decimals'
  | 'ltoken__totalMintedRewards'
  | 'lastTimestamp'
  | 'account'
  | 'account__id'
  | 'account__walletAddress'
  | 'account__affiliateCode'
  | 'totalAmount'
  | 'totalAmountAfterFees'
  | 'activities';

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  Aggregation_interval: Aggregation_interval;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  EpochInvestment: ResolverTypeWrapper<EpochInvestment>;
  EpochInvestment_filter: EpochInvestment_filter;
  EpochInvestment_orderBy: EpochInvestment_orderBy;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Int8: ResolverTypeWrapper<Scalars['Int8']>;
  OrderDirection: OrderDirection;
  String: ResolverTypeWrapper<Scalars['String']>;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']>;
  User: ResolverTypeWrapper<User>;
  UserAction: ResolverTypeWrapper<UserAction>;
  UserAction_filter: UserAction_filter;
  UserAction_orderBy: UserAction_orderBy;
  User_filter: User_filter;
  User_orderBy: User_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
  APRChange: ResolverTypeWrapper<APRChange>;
  APRChange_filter: APRChange_filter;
  APRChange_orderBy: APRChange_orderBy;
  Activity: ResolverTypeWrapper<Activity>;
  ActivityAction: ActivityAction;
  ActivityStatus: ActivityStatus;
  Activity_filter: Activity_filter;
  Activity_orderBy: Activity_orderBy;
  AffiliateActivity: ResolverTypeWrapper<AffiliateActivity>;
  AffiliateActivity_filter: AffiliateActivity_filter;
  AffiliateActivity_orderBy: AffiliateActivity_orderBy;
  AffiliateUser: ResolverTypeWrapper<AffiliateUser>;
  AffiliateUser_filter: AffiliateUser_filter;
  AffiliateUser_orderBy: AffiliateUser_orderBy;
  LToken: ResolverTypeWrapper<LToken>;
  LToken_filter: LToken_filter;
  LToken_orderBy: LToken_orderBy;
  PreMiningLock: ResolverTypeWrapper<PreMiningLock>;
  PreMiningLock_filter: PreMiningLock_filter;
  PreMiningLock_orderBy: PreMiningLock_orderBy;
  RewardsMint: ResolverTypeWrapper<RewardsMint>;
  RewardsMint_filter: RewardsMint_filter;
  RewardsMint_orderBy: RewardsMint_orderBy;
  StakingAPRInfo: ResolverTypeWrapper<StakingAPRInfo>;
  StakingAPRInfo_filter: StakingAPRInfo_filter;
  StakingAPRInfo_orderBy: StakingAPRInfo_orderBy;
  StakingUser: ResolverTypeWrapper<StakingUser>;
  StakingUser_filter: StakingUser_filter;
  StakingUser_orderBy: StakingUser_orderBy;
  TVLChange: ResolverTypeWrapper<TVLChange>;
  TVLChange_filter: TVLChange_filter;
  TVLChange_orderBy: TVLChange_orderBy;
  AffiliateInfo: ResolverTypeWrapper<AffiliateInfo>;
  AffiliateInfo_filter: AffiliateInfo_filter;
  AffiliateInfo_orderBy: AffiliateInfo_orderBy;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Subscription: {};
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean'];
  Bytes: Scalars['Bytes'];
  EpochInvestment: EpochInvestment;
  EpochInvestment_filter: EpochInvestment_filter;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Int8: Scalars['Int8'];
  String: Scalars['String'];
  Timestamp: Scalars['Timestamp'];
  User: User;
  UserAction: UserAction;
  UserAction_filter: UserAction_filter;
  User_filter: User_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
  APRChange: APRChange;
  APRChange_filter: APRChange_filter;
  Activity: Activity;
  Activity_filter: Activity_filter;
  AffiliateActivity: AffiliateActivity;
  AffiliateActivity_filter: AffiliateActivity_filter;
  AffiliateUser: AffiliateUser;
  AffiliateUser_filter: AffiliateUser_filter;
  LToken: LToken;
  LToken_filter: LToken_filter;
  PreMiningLock: PreMiningLock;
  PreMiningLock_filter: PreMiningLock_filter;
  RewardsMint: RewardsMint;
  RewardsMint_filter: RewardsMint_filter;
  StakingAPRInfo: StakingAPRInfo;
  StakingAPRInfo_filter: StakingAPRInfo_filter;
  StakingUser: StakingUser;
  StakingUser_filter: StakingUser_filter;
  TVLChange: TVLChange;
  TVLChange_filter: TVLChange_filter;
  AffiliateInfo: AffiliateInfo;
  AffiliateInfo_filter: AffiliateInfo_filter;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String'];
};

export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  c1_user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<Queryc1_userArgs, 'id' | 'subgraphError'>>;
  c1_users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<Queryc1_usersArgs, 'skip' | 'first' | 'subgraphError'>>;
  c1_userAction?: Resolver<Maybe<ResolversTypes['UserAction']>, ParentType, ContextType, RequireFields<Queryc1_userActionArgs, 'id' | 'subgraphError'>>;
  c1_userActions?: Resolver<Array<ResolversTypes['UserAction']>, ParentType, ContextType, RequireFields<Queryc1_userActionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  c1_epochInvestment?: Resolver<Maybe<ResolversTypes['EpochInvestment']>, ParentType, ContextType, RequireFields<Queryc1_epochInvestmentArgs, 'id' | 'subgraphError'>>;
  c1_epochInvestments?: Resolver<Array<ResolversTypes['EpochInvestment']>, ParentType, ContextType, RequireFields<Queryc1_epochInvestmentsArgs, 'skip' | 'first' | 'subgraphError'>>;
  c1__meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Queryc1__metaArgs>>;
  c59144_ltoken?: Resolver<Maybe<ResolversTypes['LToken']>, ParentType, ContextType, RequireFields<Queryc59144_ltokenArgs, 'id' | 'subgraphError'>>;
  c59144_ltokens?: Resolver<Array<ResolversTypes['LToken']>, ParentType, ContextType, RequireFields<Queryc59144_ltokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_tvlchange?: Resolver<Maybe<ResolversTypes['TVLChange']>, ParentType, ContextType, RequireFields<Queryc59144_tvlchangeArgs, 'id' | 'subgraphError'>>;
  c59144_tvlchanges?: Resolver<Array<ResolversTypes['TVLChange']>, ParentType, ContextType, RequireFields<Queryc59144_tvlchangesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_aprchange?: Resolver<Maybe<ResolversTypes['APRChange']>, ParentType, ContextType, RequireFields<Queryc59144_aprchangeArgs, 'id' | 'subgraphError'>>;
  c59144_aprchanges?: Resolver<Array<ResolversTypes['APRChange']>, ParentType, ContextType, RequireFields<Queryc59144_aprchangesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_activity?: Resolver<Maybe<ResolversTypes['Activity']>, ParentType, ContextType, RequireFields<Queryc59144_activityArgs, 'id' | 'subgraphError'>>;
  c59144_activities?: Resolver<Array<ResolversTypes['Activity']>, ParentType, ContextType, RequireFields<Queryc59144_activitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_rewardsMint?: Resolver<Maybe<ResolversTypes['RewardsMint']>, ParentType, ContextType, RequireFields<Queryc59144_rewardsMintArgs, 'id' | 'subgraphError'>>;
  c59144_rewardsMints?: Resolver<Array<ResolversTypes['RewardsMint']>, ParentType, ContextType, RequireFields<Queryc59144_rewardsMintsArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_preMiningLock?: Resolver<Maybe<ResolversTypes['PreMiningLock']>, ParentType, ContextType, RequireFields<Queryc59144_preMiningLockArgs, 'id' | 'subgraphError'>>;
  c59144_preMiningLocks?: Resolver<Array<ResolversTypes['PreMiningLock']>, ParentType, ContextType, RequireFields<Queryc59144_preMiningLocksArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_stakingUser?: Resolver<Maybe<ResolversTypes['StakingUser']>, ParentType, ContextType, RequireFields<Queryc59144_stakingUserArgs, 'id' | 'subgraphError'>>;
  c59144_stakingUsers?: Resolver<Array<ResolversTypes['StakingUser']>, ParentType, ContextType, RequireFields<Queryc59144_stakingUsersArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_stakingAPRInfo?: Resolver<Maybe<ResolversTypes['StakingAPRInfo']>, ParentType, ContextType, RequireFields<Queryc59144_stakingAPRInfoArgs, 'id' | 'subgraphError'>>;
  c59144_stakingAPRInfos?: Resolver<Array<ResolversTypes['StakingAPRInfo']>, ParentType, ContextType, RequireFields<Queryc59144_stakingAPRInfosArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_affiliateUser?: Resolver<Maybe<ResolversTypes['AffiliateUser']>, ParentType, ContextType, RequireFields<Queryc59144_affiliateUserArgs, 'id' | 'subgraphError'>>;
  c59144_affiliateUsers?: Resolver<Array<ResolversTypes['AffiliateUser']>, ParentType, ContextType, RequireFields<Queryc59144_affiliateUsersArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_affiliateActivity?: Resolver<Maybe<ResolversTypes['AffiliateActivity']>, ParentType, ContextType, RequireFields<Queryc59144_affiliateActivityArgs, 'id' | 'subgraphError'>>;
  c59144_affiliateActivities?: Resolver<Array<ResolversTypes['AffiliateActivity']>, ParentType, ContextType, RequireFields<Queryc59144_affiliateActivitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144__meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Queryc59144__metaArgs>>;
  c42161_ltoken?: Resolver<Maybe<ResolversTypes['LToken']>, ParentType, ContextType, RequireFields<Queryc42161_ltokenArgs, 'id' | 'subgraphError'>>;
  c42161_ltokens?: Resolver<Array<ResolversTypes['LToken']>, ParentType, ContextType, RequireFields<Queryc42161_ltokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_tvlchange?: Resolver<Maybe<ResolversTypes['TVLChange']>, ParentType, ContextType, RequireFields<Queryc42161_tvlchangeArgs, 'id' | 'subgraphError'>>;
  c42161_tvlchanges?: Resolver<Array<ResolversTypes['TVLChange']>, ParentType, ContextType, RequireFields<Queryc42161_tvlchangesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_aprchange?: Resolver<Maybe<ResolversTypes['APRChange']>, ParentType, ContextType, RequireFields<Queryc42161_aprchangeArgs, 'id' | 'subgraphError'>>;
  c42161_aprchanges?: Resolver<Array<ResolversTypes['APRChange']>, ParentType, ContextType, RequireFields<Queryc42161_aprchangesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_activity?: Resolver<Maybe<ResolversTypes['Activity']>, ParentType, ContextType, RequireFields<Queryc42161_activityArgs, 'id' | 'subgraphError'>>;
  c42161_activities?: Resolver<Array<ResolversTypes['Activity']>, ParentType, ContextType, RequireFields<Queryc42161_activitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_rewardsMint?: Resolver<Maybe<ResolversTypes['RewardsMint']>, ParentType, ContextType, RequireFields<Queryc42161_rewardsMintArgs, 'id' | 'subgraphError'>>;
  c42161_rewardsMints?: Resolver<Array<ResolversTypes['RewardsMint']>, ParentType, ContextType, RequireFields<Queryc42161_rewardsMintsArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_preMiningLock?: Resolver<Maybe<ResolversTypes['PreMiningLock']>, ParentType, ContextType, RequireFields<Queryc42161_preMiningLockArgs, 'id' | 'subgraphError'>>;
  c42161_preMiningLocks?: Resolver<Array<ResolversTypes['PreMiningLock']>, ParentType, ContextType, RequireFields<Queryc42161_preMiningLocksArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_stakingUser?: Resolver<Maybe<ResolversTypes['StakingUser']>, ParentType, ContextType, RequireFields<Queryc42161_stakingUserArgs, 'id' | 'subgraphError'>>;
  c42161_stakingUsers?: Resolver<Array<ResolversTypes['StakingUser']>, ParentType, ContextType, RequireFields<Queryc42161_stakingUsersArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_stakingAPRInfo?: Resolver<Maybe<ResolversTypes['StakingAPRInfo']>, ParentType, ContextType, RequireFields<Queryc42161_stakingAPRInfoArgs, 'id' | 'subgraphError'>>;
  c42161_stakingAPRInfos?: Resolver<Array<ResolversTypes['StakingAPRInfo']>, ParentType, ContextType, RequireFields<Queryc42161_stakingAPRInfosArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_affiliateUser?: Resolver<Maybe<ResolversTypes['AffiliateUser']>, ParentType, ContextType, RequireFields<Queryc42161_affiliateUserArgs, 'id' | 'subgraphError'>>;
  c42161_affiliateUsers?: Resolver<Array<ResolversTypes['AffiliateUser']>, ParentType, ContextType, RequireFields<Queryc42161_affiliateUsersArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_affiliateActivity?: Resolver<Maybe<ResolversTypes['AffiliateActivity']>, ParentType, ContextType, RequireFields<Queryc42161_affiliateActivityArgs, 'id' | 'subgraphError'>>;
  c42161_affiliateActivities?: Resolver<Array<ResolversTypes['AffiliateActivity']>, ParentType, ContextType, RequireFields<Queryc42161_affiliateActivitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161__meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Queryc42161__metaArgs>>;
  c8453_ltoken?: Resolver<Maybe<ResolversTypes['LToken']>, ParentType, ContextType, RequireFields<Queryc8453_ltokenArgs, 'id' | 'subgraphError'>>;
  c8453_ltokens?: Resolver<Array<ResolversTypes['LToken']>, ParentType, ContextType, RequireFields<Queryc8453_ltokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_tvlchange?: Resolver<Maybe<ResolversTypes['TVLChange']>, ParentType, ContextType, RequireFields<Queryc8453_tvlchangeArgs, 'id' | 'subgraphError'>>;
  c8453_tvlchanges?: Resolver<Array<ResolversTypes['TVLChange']>, ParentType, ContextType, RequireFields<Queryc8453_tvlchangesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_aprchange?: Resolver<Maybe<ResolversTypes['APRChange']>, ParentType, ContextType, RequireFields<Queryc8453_aprchangeArgs, 'id' | 'subgraphError'>>;
  c8453_aprchanges?: Resolver<Array<ResolversTypes['APRChange']>, ParentType, ContextType, RequireFields<Queryc8453_aprchangesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_activity?: Resolver<Maybe<ResolversTypes['Activity']>, ParentType, ContextType, RequireFields<Queryc8453_activityArgs, 'id' | 'subgraphError'>>;
  c8453_activities?: Resolver<Array<ResolversTypes['Activity']>, ParentType, ContextType, RequireFields<Queryc8453_activitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_rewardsMint?: Resolver<Maybe<ResolversTypes['RewardsMint']>, ParentType, ContextType, RequireFields<Queryc8453_rewardsMintArgs, 'id' | 'subgraphError'>>;
  c8453_rewardsMints?: Resolver<Array<ResolversTypes['RewardsMint']>, ParentType, ContextType, RequireFields<Queryc8453_rewardsMintsArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_preMiningLock?: Resolver<Maybe<ResolversTypes['PreMiningLock']>, ParentType, ContextType, RequireFields<Queryc8453_preMiningLockArgs, 'id' | 'subgraphError'>>;
  c8453_preMiningLocks?: Resolver<Array<ResolversTypes['PreMiningLock']>, ParentType, ContextType, RequireFields<Queryc8453_preMiningLocksArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_stakingUser?: Resolver<Maybe<ResolversTypes['StakingUser']>, ParentType, ContextType, RequireFields<Queryc8453_stakingUserArgs, 'id' | 'subgraphError'>>;
  c8453_stakingUsers?: Resolver<Array<ResolversTypes['StakingUser']>, ParentType, ContextType, RequireFields<Queryc8453_stakingUsersArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_stakingAPRInfo?: Resolver<Maybe<ResolversTypes['StakingAPRInfo']>, ParentType, ContextType, RequireFields<Queryc8453_stakingAPRInfoArgs, 'id' | 'subgraphError'>>;
  c8453_stakingAPRInfos?: Resolver<Array<ResolversTypes['StakingAPRInfo']>, ParentType, ContextType, RequireFields<Queryc8453_stakingAPRInfosArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_affiliateUser?: Resolver<Maybe<ResolversTypes['AffiliateUser']>, ParentType, ContextType, RequireFields<Queryc8453_affiliateUserArgs, 'id' | 'subgraphError'>>;
  c8453_affiliateUsers?: Resolver<Array<ResolversTypes['AffiliateUser']>, ParentType, ContextType, RequireFields<Queryc8453_affiliateUsersArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_affiliateActivity?: Resolver<Maybe<ResolversTypes['AffiliateActivity']>, ParentType, ContextType, RequireFields<Queryc8453_affiliateActivityArgs, 'id' | 'subgraphError'>>;
  c8453_affiliateActivities?: Resolver<Array<ResolversTypes['AffiliateActivity']>, ParentType, ContextType, RequireFields<Queryc8453_affiliateActivitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_affiliateInfo?: Resolver<Maybe<ResolversTypes['AffiliateInfo']>, ParentType, ContextType, RequireFields<Queryc8453_affiliateInfoArgs, 'id' | 'subgraphError'>>;
  c8453_affiliateInfos?: Resolver<Array<ResolversTypes['AffiliateInfo']>, ParentType, ContextType, RequireFields<Queryc8453_affiliateInfosArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453__meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Queryc8453__metaArgs>>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  c1_user?: SubscriptionResolver<Maybe<ResolversTypes['User']>, "c1_user", ParentType, ContextType, RequireFields<Subscriptionc1_userArgs, 'id' | 'subgraphError'>>;
  c1_users?: SubscriptionResolver<Array<ResolversTypes['User']>, "c1_users", ParentType, ContextType, RequireFields<Subscriptionc1_usersArgs, 'skip' | 'first' | 'subgraphError'>>;
  c1_userAction?: SubscriptionResolver<Maybe<ResolversTypes['UserAction']>, "c1_userAction", ParentType, ContextType, RequireFields<Subscriptionc1_userActionArgs, 'id' | 'subgraphError'>>;
  c1_userActions?: SubscriptionResolver<Array<ResolversTypes['UserAction']>, "c1_userActions", ParentType, ContextType, RequireFields<Subscriptionc1_userActionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  c1_epochInvestment?: SubscriptionResolver<Maybe<ResolversTypes['EpochInvestment']>, "c1_epochInvestment", ParentType, ContextType, RequireFields<Subscriptionc1_epochInvestmentArgs, 'id' | 'subgraphError'>>;
  c1_epochInvestments?: SubscriptionResolver<Array<ResolversTypes['EpochInvestment']>, "c1_epochInvestments", ParentType, ContextType, RequireFields<Subscriptionc1_epochInvestmentsArgs, 'skip' | 'first' | 'subgraphError'>>;
  c1__meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "c1__meta", ParentType, ContextType, Partial<Subscriptionc1__metaArgs>>;
  c59144_ltoken?: SubscriptionResolver<Maybe<ResolversTypes['LToken']>, "c59144_ltoken", ParentType, ContextType, RequireFields<Subscriptionc59144_ltokenArgs, 'id' | 'subgraphError'>>;
  c59144_ltokens?: SubscriptionResolver<Array<ResolversTypes['LToken']>, "c59144_ltokens", ParentType, ContextType, RequireFields<Subscriptionc59144_ltokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_tvlchange?: SubscriptionResolver<Maybe<ResolversTypes['TVLChange']>, "c59144_tvlchange", ParentType, ContextType, RequireFields<Subscriptionc59144_tvlchangeArgs, 'id' | 'subgraphError'>>;
  c59144_tvlchanges?: SubscriptionResolver<Array<ResolversTypes['TVLChange']>, "c59144_tvlchanges", ParentType, ContextType, RequireFields<Subscriptionc59144_tvlchangesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_aprchange?: SubscriptionResolver<Maybe<ResolversTypes['APRChange']>, "c59144_aprchange", ParentType, ContextType, RequireFields<Subscriptionc59144_aprchangeArgs, 'id' | 'subgraphError'>>;
  c59144_aprchanges?: SubscriptionResolver<Array<ResolversTypes['APRChange']>, "c59144_aprchanges", ParentType, ContextType, RequireFields<Subscriptionc59144_aprchangesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_activity?: SubscriptionResolver<Maybe<ResolversTypes['Activity']>, "c59144_activity", ParentType, ContextType, RequireFields<Subscriptionc59144_activityArgs, 'id' | 'subgraphError'>>;
  c59144_activities?: SubscriptionResolver<Array<ResolversTypes['Activity']>, "c59144_activities", ParentType, ContextType, RequireFields<Subscriptionc59144_activitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_rewardsMint?: SubscriptionResolver<Maybe<ResolversTypes['RewardsMint']>, "c59144_rewardsMint", ParentType, ContextType, RequireFields<Subscriptionc59144_rewardsMintArgs, 'id' | 'subgraphError'>>;
  c59144_rewardsMints?: SubscriptionResolver<Array<ResolversTypes['RewardsMint']>, "c59144_rewardsMints", ParentType, ContextType, RequireFields<Subscriptionc59144_rewardsMintsArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_preMiningLock?: SubscriptionResolver<Maybe<ResolversTypes['PreMiningLock']>, "c59144_preMiningLock", ParentType, ContextType, RequireFields<Subscriptionc59144_preMiningLockArgs, 'id' | 'subgraphError'>>;
  c59144_preMiningLocks?: SubscriptionResolver<Array<ResolversTypes['PreMiningLock']>, "c59144_preMiningLocks", ParentType, ContextType, RequireFields<Subscriptionc59144_preMiningLocksArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_stakingUser?: SubscriptionResolver<Maybe<ResolversTypes['StakingUser']>, "c59144_stakingUser", ParentType, ContextType, RequireFields<Subscriptionc59144_stakingUserArgs, 'id' | 'subgraphError'>>;
  c59144_stakingUsers?: SubscriptionResolver<Array<ResolversTypes['StakingUser']>, "c59144_stakingUsers", ParentType, ContextType, RequireFields<Subscriptionc59144_stakingUsersArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_stakingAPRInfo?: SubscriptionResolver<Maybe<ResolversTypes['StakingAPRInfo']>, "c59144_stakingAPRInfo", ParentType, ContextType, RequireFields<Subscriptionc59144_stakingAPRInfoArgs, 'id' | 'subgraphError'>>;
  c59144_stakingAPRInfos?: SubscriptionResolver<Array<ResolversTypes['StakingAPRInfo']>, "c59144_stakingAPRInfos", ParentType, ContextType, RequireFields<Subscriptionc59144_stakingAPRInfosArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_affiliateUser?: SubscriptionResolver<Maybe<ResolversTypes['AffiliateUser']>, "c59144_affiliateUser", ParentType, ContextType, RequireFields<Subscriptionc59144_affiliateUserArgs, 'id' | 'subgraphError'>>;
  c59144_affiliateUsers?: SubscriptionResolver<Array<ResolversTypes['AffiliateUser']>, "c59144_affiliateUsers", ParentType, ContextType, RequireFields<Subscriptionc59144_affiliateUsersArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144_affiliateActivity?: SubscriptionResolver<Maybe<ResolversTypes['AffiliateActivity']>, "c59144_affiliateActivity", ParentType, ContextType, RequireFields<Subscriptionc59144_affiliateActivityArgs, 'id' | 'subgraphError'>>;
  c59144_affiliateActivities?: SubscriptionResolver<Array<ResolversTypes['AffiliateActivity']>, "c59144_affiliateActivities", ParentType, ContextType, RequireFields<Subscriptionc59144_affiliateActivitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c59144__meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "c59144__meta", ParentType, ContextType, Partial<Subscriptionc59144__metaArgs>>;
  c42161_ltoken?: SubscriptionResolver<Maybe<ResolversTypes['LToken']>, "c42161_ltoken", ParentType, ContextType, RequireFields<Subscriptionc42161_ltokenArgs, 'id' | 'subgraphError'>>;
  c42161_ltokens?: SubscriptionResolver<Array<ResolversTypes['LToken']>, "c42161_ltokens", ParentType, ContextType, RequireFields<Subscriptionc42161_ltokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_tvlchange?: SubscriptionResolver<Maybe<ResolversTypes['TVLChange']>, "c42161_tvlchange", ParentType, ContextType, RequireFields<Subscriptionc42161_tvlchangeArgs, 'id' | 'subgraphError'>>;
  c42161_tvlchanges?: SubscriptionResolver<Array<ResolversTypes['TVLChange']>, "c42161_tvlchanges", ParentType, ContextType, RequireFields<Subscriptionc42161_tvlchangesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_aprchange?: SubscriptionResolver<Maybe<ResolversTypes['APRChange']>, "c42161_aprchange", ParentType, ContextType, RequireFields<Subscriptionc42161_aprchangeArgs, 'id' | 'subgraphError'>>;
  c42161_aprchanges?: SubscriptionResolver<Array<ResolversTypes['APRChange']>, "c42161_aprchanges", ParentType, ContextType, RequireFields<Subscriptionc42161_aprchangesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_activity?: SubscriptionResolver<Maybe<ResolversTypes['Activity']>, "c42161_activity", ParentType, ContextType, RequireFields<Subscriptionc42161_activityArgs, 'id' | 'subgraphError'>>;
  c42161_activities?: SubscriptionResolver<Array<ResolversTypes['Activity']>, "c42161_activities", ParentType, ContextType, RequireFields<Subscriptionc42161_activitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_rewardsMint?: SubscriptionResolver<Maybe<ResolversTypes['RewardsMint']>, "c42161_rewardsMint", ParentType, ContextType, RequireFields<Subscriptionc42161_rewardsMintArgs, 'id' | 'subgraphError'>>;
  c42161_rewardsMints?: SubscriptionResolver<Array<ResolversTypes['RewardsMint']>, "c42161_rewardsMints", ParentType, ContextType, RequireFields<Subscriptionc42161_rewardsMintsArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_preMiningLock?: SubscriptionResolver<Maybe<ResolversTypes['PreMiningLock']>, "c42161_preMiningLock", ParentType, ContextType, RequireFields<Subscriptionc42161_preMiningLockArgs, 'id' | 'subgraphError'>>;
  c42161_preMiningLocks?: SubscriptionResolver<Array<ResolversTypes['PreMiningLock']>, "c42161_preMiningLocks", ParentType, ContextType, RequireFields<Subscriptionc42161_preMiningLocksArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_stakingUser?: SubscriptionResolver<Maybe<ResolversTypes['StakingUser']>, "c42161_stakingUser", ParentType, ContextType, RequireFields<Subscriptionc42161_stakingUserArgs, 'id' | 'subgraphError'>>;
  c42161_stakingUsers?: SubscriptionResolver<Array<ResolversTypes['StakingUser']>, "c42161_stakingUsers", ParentType, ContextType, RequireFields<Subscriptionc42161_stakingUsersArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_stakingAPRInfo?: SubscriptionResolver<Maybe<ResolversTypes['StakingAPRInfo']>, "c42161_stakingAPRInfo", ParentType, ContextType, RequireFields<Subscriptionc42161_stakingAPRInfoArgs, 'id' | 'subgraphError'>>;
  c42161_stakingAPRInfos?: SubscriptionResolver<Array<ResolversTypes['StakingAPRInfo']>, "c42161_stakingAPRInfos", ParentType, ContextType, RequireFields<Subscriptionc42161_stakingAPRInfosArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_affiliateUser?: SubscriptionResolver<Maybe<ResolversTypes['AffiliateUser']>, "c42161_affiliateUser", ParentType, ContextType, RequireFields<Subscriptionc42161_affiliateUserArgs, 'id' | 'subgraphError'>>;
  c42161_affiliateUsers?: SubscriptionResolver<Array<ResolversTypes['AffiliateUser']>, "c42161_affiliateUsers", ParentType, ContextType, RequireFields<Subscriptionc42161_affiliateUsersArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161_affiliateActivity?: SubscriptionResolver<Maybe<ResolversTypes['AffiliateActivity']>, "c42161_affiliateActivity", ParentType, ContextType, RequireFields<Subscriptionc42161_affiliateActivityArgs, 'id' | 'subgraphError'>>;
  c42161_affiliateActivities?: SubscriptionResolver<Array<ResolversTypes['AffiliateActivity']>, "c42161_affiliateActivities", ParentType, ContextType, RequireFields<Subscriptionc42161_affiliateActivitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c42161__meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "c42161__meta", ParentType, ContextType, Partial<Subscriptionc42161__metaArgs>>;
  c8453_ltoken?: SubscriptionResolver<Maybe<ResolversTypes['LToken']>, "c8453_ltoken", ParentType, ContextType, RequireFields<Subscriptionc8453_ltokenArgs, 'id' | 'subgraphError'>>;
  c8453_ltokens?: SubscriptionResolver<Array<ResolversTypes['LToken']>, "c8453_ltokens", ParentType, ContextType, RequireFields<Subscriptionc8453_ltokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_tvlchange?: SubscriptionResolver<Maybe<ResolversTypes['TVLChange']>, "c8453_tvlchange", ParentType, ContextType, RequireFields<Subscriptionc8453_tvlchangeArgs, 'id' | 'subgraphError'>>;
  c8453_tvlchanges?: SubscriptionResolver<Array<ResolversTypes['TVLChange']>, "c8453_tvlchanges", ParentType, ContextType, RequireFields<Subscriptionc8453_tvlchangesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_aprchange?: SubscriptionResolver<Maybe<ResolversTypes['APRChange']>, "c8453_aprchange", ParentType, ContextType, RequireFields<Subscriptionc8453_aprchangeArgs, 'id' | 'subgraphError'>>;
  c8453_aprchanges?: SubscriptionResolver<Array<ResolversTypes['APRChange']>, "c8453_aprchanges", ParentType, ContextType, RequireFields<Subscriptionc8453_aprchangesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_activity?: SubscriptionResolver<Maybe<ResolversTypes['Activity']>, "c8453_activity", ParentType, ContextType, RequireFields<Subscriptionc8453_activityArgs, 'id' | 'subgraphError'>>;
  c8453_activities?: SubscriptionResolver<Array<ResolversTypes['Activity']>, "c8453_activities", ParentType, ContextType, RequireFields<Subscriptionc8453_activitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_rewardsMint?: SubscriptionResolver<Maybe<ResolversTypes['RewardsMint']>, "c8453_rewardsMint", ParentType, ContextType, RequireFields<Subscriptionc8453_rewardsMintArgs, 'id' | 'subgraphError'>>;
  c8453_rewardsMints?: SubscriptionResolver<Array<ResolversTypes['RewardsMint']>, "c8453_rewardsMints", ParentType, ContextType, RequireFields<Subscriptionc8453_rewardsMintsArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_preMiningLock?: SubscriptionResolver<Maybe<ResolversTypes['PreMiningLock']>, "c8453_preMiningLock", ParentType, ContextType, RequireFields<Subscriptionc8453_preMiningLockArgs, 'id' | 'subgraphError'>>;
  c8453_preMiningLocks?: SubscriptionResolver<Array<ResolversTypes['PreMiningLock']>, "c8453_preMiningLocks", ParentType, ContextType, RequireFields<Subscriptionc8453_preMiningLocksArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_stakingUser?: SubscriptionResolver<Maybe<ResolversTypes['StakingUser']>, "c8453_stakingUser", ParentType, ContextType, RequireFields<Subscriptionc8453_stakingUserArgs, 'id' | 'subgraphError'>>;
  c8453_stakingUsers?: SubscriptionResolver<Array<ResolversTypes['StakingUser']>, "c8453_stakingUsers", ParentType, ContextType, RequireFields<Subscriptionc8453_stakingUsersArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_stakingAPRInfo?: SubscriptionResolver<Maybe<ResolversTypes['StakingAPRInfo']>, "c8453_stakingAPRInfo", ParentType, ContextType, RequireFields<Subscriptionc8453_stakingAPRInfoArgs, 'id' | 'subgraphError'>>;
  c8453_stakingAPRInfos?: SubscriptionResolver<Array<ResolversTypes['StakingAPRInfo']>, "c8453_stakingAPRInfos", ParentType, ContextType, RequireFields<Subscriptionc8453_stakingAPRInfosArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_affiliateUser?: SubscriptionResolver<Maybe<ResolversTypes['AffiliateUser']>, "c8453_affiliateUser", ParentType, ContextType, RequireFields<Subscriptionc8453_affiliateUserArgs, 'id' | 'subgraphError'>>;
  c8453_affiliateUsers?: SubscriptionResolver<Array<ResolversTypes['AffiliateUser']>, "c8453_affiliateUsers", ParentType, ContextType, RequireFields<Subscriptionc8453_affiliateUsersArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_affiliateActivity?: SubscriptionResolver<Maybe<ResolversTypes['AffiliateActivity']>, "c8453_affiliateActivity", ParentType, ContextType, RequireFields<Subscriptionc8453_affiliateActivityArgs, 'id' | 'subgraphError'>>;
  c8453_affiliateActivities?: SubscriptionResolver<Array<ResolversTypes['AffiliateActivity']>, "c8453_affiliateActivities", ParentType, ContextType, RequireFields<Subscriptionc8453_affiliateActivitiesArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453_affiliateInfo?: SubscriptionResolver<Maybe<ResolversTypes['AffiliateInfo']>, "c8453_affiliateInfo", ParentType, ContextType, RequireFields<Subscriptionc8453_affiliateInfoArgs, 'id' | 'subgraphError'>>;
  c8453_affiliateInfos?: SubscriptionResolver<Array<ResolversTypes['AffiliateInfo']>, "c8453_affiliateInfos", ParentType, ContextType, RequireFields<Subscriptionc8453_affiliateInfosArgs, 'skip' | 'first' | 'subgraphError'>>;
  c8453__meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "c8453__meta", ParentType, ContextType, Partial<Subscriptionc8453__metaArgs>>;
}>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type EpochInvestmentResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['EpochInvestment'] = ResolversParentTypes['EpochInvestment']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  epochNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Int8'], any> {
  name: 'Int8';
}

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type UserResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  totalDeposited?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalWithdrawn?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalRewardsClaimed?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  actions?: Resolver<Array<ResolversTypes['UserAction']>, ParentType, ContextType, RequireFields<UseractionsArgs, 'skip' | 'first'>>;
  epochInvestments?: Resolver<Array<ResolversTypes['EpochInvestment']>, ParentType, ContextType, RequireFields<UserepochInvestmentsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserActionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['UserAction'] = ResolversParentTypes['UserAction']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  epochNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  actionType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  parentHash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type APRChangeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['APRChange'] = ResolversParentTypes['APRChange']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ltoken?: Resolver<ResolversTypes['LToken'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  apr?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ActivityResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Activity'] = ResolversParentTypes['Activity']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  requestId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  ltoken?: Resolver<ResolversTypes['LToken'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  account?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  action?: Resolver<ResolversTypes['ActivityAction'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  amountAfterFees?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ActivityStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AffiliateActivityResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['AffiliateActivity'] = ResolversParentTypes['AffiliateActivity']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  affiliateCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ltoken?: Resolver<ResolversTypes['LToken'], ParentType, ContextType>;
  action?: Resolver<ResolversTypes['ActivityAction'], ParentType, ContextType>;
  account?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  amountAfterFees?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  txHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  logIndex?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  affiliateInfo?: Resolver<ResolversTypes['AffiliateInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AffiliateUserResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['AffiliateUser'] = ResolversParentTypes['AffiliateUser']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  walletAddress?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  affiliateCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LTokenResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['LToken'] = ResolversParentTypes['LToken']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalMintedRewards?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  tvlUpdates?: Resolver<Maybe<Array<ResolversTypes['TVLChange']>>, ParentType, ContextType, RequireFields<LTokentvlUpdatesArgs, 'skip' | 'first'>>;
  aprUpdates?: Resolver<Maybe<Array<ResolversTypes['APRChange']>>, ParentType, ContextType, RequireFields<LTokenaprUpdatesArgs, 'skip' | 'first'>>;
  activities?: Resolver<Maybe<Array<ResolversTypes['Activity']>>, ParentType, ContextType, RequireFields<LTokenactivitiesArgs, 'skip' | 'first'>>;
  rewardsMints?: Resolver<Maybe<Array<ResolversTypes['RewardsMint']>>, ParentType, ContextType, RequireFields<LTokenrewardsMintsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PreMiningLockResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PreMiningLock'] = ResolversParentTypes['PreMiningLock']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  duration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RewardsMintResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['RewardsMint'] = ResolversParentTypes['RewardsMint']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ltoken?: Resolver<ResolversTypes['LToken'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  account?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  balanceBefore?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  revenue?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  growth?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StakingAPRInfoResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['StakingAPRInfo'] = ResolversParentTypes['StakingAPRInfo']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  rewardPerSec?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalStaked?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  interestRate?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StakingUserResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['StakingUser'] = ResolversParentTypes['StakingUser']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  stakeIndex?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  stakedAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  earnedAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TVLChangeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['TVLChange'] = ResolversParentTypes['TVLChange']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ltoken?: Resolver<ResolversTypes['LToken'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AffiliateInfoResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['AffiliateInfo'] = ResolversParentTypes['AffiliateInfo']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  affiliateCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ltoken?: Resolver<ResolversTypes['LToken'], ParentType, ContextType>;
  lastTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  account?: Resolver<ResolversTypes['AffiliateUser'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalAmountAfterFees?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  activities?: Resolver<Maybe<Array<ResolversTypes['AffiliateActivity']>>, ParentType, ContextType, RequireFields<AffiliateInfoactivitiesArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  EpochInvestment?: EpochInvestmentResolvers<ContextType>;
  Int8?: GraphQLScalarType;
  Timestamp?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserAction?: UserActionResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
  APRChange?: APRChangeResolvers<ContextType>;
  Activity?: ActivityResolvers<ContextType>;
  AffiliateActivity?: AffiliateActivityResolvers<ContextType>;
  AffiliateUser?: AffiliateUserResolvers<ContextType>;
  LToken?: LTokenResolvers<ContextType>;
  PreMiningLock?: PreMiningLockResolvers<ContextType>;
  RewardsMint?: RewardsMintResolvers<ContextType>;
  StakingAPRInfo?: StakingAPRInfoResolvers<ContextType>;
  StakingUser?: StakingUserResolvers<ContextType>;
  TVLChange?: TVLChangeResolvers<ContextType>;
  AffiliateInfo?: AffiliateInfoResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = EthereumTypes.Context & LineaTypes.Context & ArbitrumTypes.Context & BaseTypes.Context & BaseMeshContext;


import { fileURLToPath } from '@graphql-mesh/utils';
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclient/sources/ethereum/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;
    
    case ".graphclient/sources/linea/introspectionSchema":
      return Promise.resolve(importedModule$1) as T;
    
    case ".graphclient/sources/arbitrum/introspectionSchema":
      return Promise.resolve(importedModule$2) as T;
    
    case ".graphclient/sources/base/introspectionSchema":
      return Promise.resolve(importedModule$3) as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("GraphClient");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const arbitrumTransforms = [];
const lineaTransforms = [];
const ethereumTransforms = [];
const baseTransforms = [];
const additionalTypeDefs = [] as any[];
const arbitrumHandler = new GraphqlHandler({
              name: "arbitrum",
              config: {"endpoint":"https://subgraph.satsuma-prod.com/8a26f33a279b/ledgity--128781/ledgity-subgraph/api"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("arbitrum"),
              logger: logger.child("arbitrum"),
              importFn,
            });
const lineaHandler = new GraphqlHandler({
              name: "linea",
              config: {"endpoint":"https://subgraph.satsuma-prod.com/8a26f33a279b/ledgity--128781/ledgity-linea/api"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("linea"),
              logger: logger.child("linea"),
              importFn,
            });
const ethereumHandler = new GraphqlHandler({
              name: "ethereum",
              config: {"endpoint":"https://subgraph.satsuma-prod.com/8a26f33a279b/ledgity--128781/eth-vault/api"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("ethereum"),
              logger: logger.child("ethereum"),
              importFn,
            });
const baseHandler = new GraphqlHandler({
              name: "base",
              config: {"endpoint":"https://subgraph.satsuma-prod.com/8a26f33a279b/ledgity--128781/ledgity-yield-base/api"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("base"),
              logger: logger.child("base"),
              importFn,
            });
arbitrumTransforms[0] = new PrefixTransform({
                  apiName: "arbitrum",
                  config: {"mode":"wrap","value":"c42161_","includeRootOperations":true,"includeTypes":false},
                  baseDir,
                  cache,
                  pubsub,
                  importFn,
                  logger,
                });
lineaTransforms[0] = new PrefixTransform({
                  apiName: "linea",
                  config: {"mode":"wrap","value":"c59144_","includeRootOperations":true,"includeTypes":false},
                  baseDir,
                  cache,
                  pubsub,
                  importFn,
                  logger,
                });
ethereumTransforms[0] = new PrefixTransform({
                  apiName: "ethereum",
                  config: {"mode":"wrap","value":"c1_","includeRootOperations":true,"includeTypes":false},
                  baseDir,
                  cache,
                  pubsub,
                  importFn,
                  logger,
                });
baseTransforms[0] = new PrefixTransform({
                  apiName: "base",
                  config: {"mode":"wrap","value":"c8453_","includeRootOperations":true,"includeTypes":false},
                  baseDir,
                  cache,
                  pubsub,
                  importFn,
                  logger,
                });
sources[0] = {
          name: 'arbitrum',
          handler: arbitrumHandler,
          transforms: arbitrumTransforms
        }
sources[1] = {
          name: 'linea',
          handler: lineaHandler,
          transforms: lineaTransforms
        }
sources[2] = {
          name: 'ethereum',
          handler: ethereumHandler,
          transforms: ethereumTransforms
        }
sources[3] = {
          name: 'base',
          handler: baseHandler,
          transforms: baseTransforms
        }
const additionalResolvers = [] as any[]
const merger = new(StitchingMerger as any)({
        cache,
        pubsub,
        logger: logger.child('stitchingMerger'),
        store: rootStore.child('stitchingMerger')
      })

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));