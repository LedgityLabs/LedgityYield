// @ts-nocheck
import {
  GraphQLResolveInfo,
  SelectionSetNode,
  FieldNode,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
import type { GetMeshOptions } from "@graphql-mesh/runtime";
import type { YamlConfig } from "@graphql-mesh/types";
import { PubSub } from "@graphql-mesh/utils";
import { DefaultLogger } from "@graphql-mesh/utils";
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from "@whatwg-node/fetch";

import { MeshResolvedSource } from "@graphql-mesh/runtime";
import { MeshTransform, MeshPlugin } from "@graphql-mesh/types";
import GraphqlHandler from "@graphql-mesh/graphql";
import PrefixTransform from "@graphql-mesh/transform-prefix";
import StitchingMerger from "@graphql-mesh/merger-stitching";
import { createMeshHTTPHandler, MeshHTTPHandler } from "@graphql-mesh/http";
import {
  getMesh,
  ExecuteMeshFn,
  SubscribeMeshFn,
  MeshContext as BaseMeshContext,
  MeshInstance,
} from "@graphql-mesh/runtime";
import { MeshStore, FsStoreStorageAdapter } from "@graphql-mesh/store";
import { path as pathModule } from "@graphql-mesh/cross-helpers";
import { ImportFn } from "@graphql-mesh/types";
import type { LineaTypes } from "./sources/linea/types";
import type { ArbitrumTypes } from "./sources/arbitrum/types";
import type { OkxX1TestnetTypes } from "./sources/OKX_X1_Testnet/types";
import * as importedModule$0 from "./sources/OKX_X1_Testnet/introspectionSchema";
import * as importedModule$1 from "./sources/linea/introspectionSchema";
import * as importedModule$2 from "./sources/arbitrum/introspectionSchema";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};

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
};

export type Query = {
  c195_ltoken?: Maybe<LToken>;
  c195_ltokens: Array<LToken>;
  c195_tvlchange?: Maybe<TVLChange>;
  c195_tvlchanges: Array<TVLChange>;
  c195_aprchange?: Maybe<APRChange>;
  c195_aprchanges: Array<APRChange>;
  c195_activity?: Maybe<Activity>;
  c195_activities: Array<Activity>;
  c195_rewardsMint?: Maybe<RewardsMint>;
  c195_rewardsMints: Array<RewardsMint>;
  c195_preMiningLock?: Maybe<PreMiningLock>;
  c195_preMiningLocks: Array<PreMiningLock>;
  /** Access to subgraph metadata */
  c195__meta?: Maybe<_Meta_>;
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
  /** Access to subgraph metadata */
  c42161__meta?: Maybe<_Meta_>;
};

export type Queryc195_ltokenArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc195_ltokensArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc195_tvlchangeArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc195_tvlchangesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TVLChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc195_aprchangeArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc195_aprchangesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<APRChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc195_activityArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc195_activitiesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc195_rewardsMintArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc195_rewardsMintsArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc195_preMiningLockArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc195_preMiningLocksArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PreMiningLock_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PreMiningLock_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc195__metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Queryc59144_ltokenArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc59144_ltokensArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc59144_tvlchangeArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc59144_tvlchangesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TVLChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc59144_aprchangeArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc59144_aprchangesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<APRChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc59144_activityArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc59144_activitiesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc59144_rewardsMintArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc59144_rewardsMintsArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc59144_preMiningLockArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc59144_preMiningLocksArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PreMiningLock_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PreMiningLock_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc59144__metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Queryc42161_ltokenArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc42161_ltokensArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc42161_tvlchangeArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc42161_tvlchangesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TVLChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc42161_aprchangeArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc42161_aprchangesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<APRChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc42161_activityArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc42161_activitiesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc42161_rewardsMintArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc42161_rewardsMintsArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc42161_preMiningLockArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc42161_preMiningLocksArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PreMiningLock_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PreMiningLock_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Queryc42161__metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  c195_ltoken?: Maybe<LToken>;
  c195_ltokens: Array<LToken>;
  c195_tvlchange?: Maybe<TVLChange>;
  c195_tvlchanges: Array<TVLChange>;
  c195_aprchange?: Maybe<APRChange>;
  c195_aprchanges: Array<APRChange>;
  c195_activity?: Maybe<Activity>;
  c195_activities: Array<Activity>;
  c195_rewardsMint?: Maybe<RewardsMint>;
  c195_rewardsMints: Array<RewardsMint>;
  c195_preMiningLock?: Maybe<PreMiningLock>;
  c195_preMiningLocks: Array<PreMiningLock>;
  /** Access to subgraph metadata */
  c195__meta?: Maybe<_Meta_>;
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
  /** Access to subgraph metadata */
  c42161__meta?: Maybe<_Meta_>;
};

export type Subscriptionc195_ltokenArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc195_ltokensArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc195_tvlchangeArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc195_tvlchangesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TVLChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc195_aprchangeArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc195_aprchangesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<APRChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc195_activityArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc195_activitiesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc195_rewardsMintArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc195_rewardsMintsArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc195_preMiningLockArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc195_preMiningLocksArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PreMiningLock_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PreMiningLock_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc195__metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscriptionc59144_ltokenArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc59144_ltokensArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc59144_tvlchangeArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc59144_tvlchangesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TVLChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc59144_aprchangeArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc59144_aprchangesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<APRChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc59144_activityArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc59144_activitiesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc59144_rewardsMintArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc59144_rewardsMintsArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc59144_preMiningLockArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc59144_preMiningLocksArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PreMiningLock_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PreMiningLock_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc59144__metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscriptionc42161_ltokenArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc42161_ltokensArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc42161_tvlchangeArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc42161_tvlchangesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TVLChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc42161_aprchangeArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc42161_aprchangesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<APRChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRChange_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc42161_activityArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc42161_activitiesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc42161_rewardsMintArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc42161_rewardsMintsArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc42161_preMiningLockArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc42161_preMiningLocksArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PreMiningLock_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PreMiningLock_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type Subscriptionc42161__metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type APRChange = {
  id: Scalars["ID"];
  ltoken: LToken;
  timestamp: Scalars["BigInt"];
  apr: Scalars["BigDecimal"];
};

export type APRChange_filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  ltoken?: InputMaybe<Scalars["String"]>;
  ltoken_not?: InputMaybe<Scalars["String"]>;
  ltoken_gt?: InputMaybe<Scalars["String"]>;
  ltoken_lt?: InputMaybe<Scalars["String"]>;
  ltoken_gte?: InputMaybe<Scalars["String"]>;
  ltoken_lte?: InputMaybe<Scalars["String"]>;
  ltoken_in?: InputMaybe<Array<Scalars["String"]>>;
  ltoken_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ltoken_contains?: InputMaybe<Scalars["String"]>;
  ltoken_contains_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_not_contains?: InputMaybe<Scalars["String"]>;
  ltoken_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_starts_with?: InputMaybe<Scalars["String"]>;
  ltoken_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_not_starts_with?: InputMaybe<Scalars["String"]>;
  ltoken_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_ends_with?: InputMaybe<Scalars["String"]>;
  ltoken_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_not_ends_with?: InputMaybe<Scalars["String"]>;
  ltoken_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_?: InputMaybe<LToken_filter>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  apr?: InputMaybe<Scalars["BigDecimal"]>;
  apr_not?: InputMaybe<Scalars["BigDecimal"]>;
  apr_gt?: InputMaybe<Scalars["BigDecimal"]>;
  apr_lt?: InputMaybe<Scalars["BigDecimal"]>;
  apr_gte?: InputMaybe<Scalars["BigDecimal"]>;
  apr_lte?: InputMaybe<Scalars["BigDecimal"]>;
  apr_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  apr_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<APRChange_filter>>>;
  or?: InputMaybe<Array<InputMaybe<APRChange_filter>>>;
};

export type APRChange_orderBy =
  | "id"
  | "ltoken"
  | "timestamp"
  | "apr"
  | "ltoken__id"
  | "ltoken__symbol"
  | "ltoken__decimals"
  | "ltoken__totalMintedRewards";

export type Activity = {
  id: Scalars["ID"];
  requestId: Scalars["BigInt"];
  ltoken: LToken;
  timestamp: Scalars["BigInt"];
  account: Scalars["Bytes"];
  action: ActivityAction;
  amount: Scalars["BigDecimal"];
  amountAfterFees: Scalars["BigDecimal"];
  status: ActivityStatus;
};

export type ActivityAction = "Deposit" | "Withdraw";

export type ActivityStatus = "Queued" | "Cancelled" | "Success" | "Fulfilled";

export type Activity_filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  requestId?: InputMaybe<Scalars["BigInt"]>;
  requestId_not?: InputMaybe<Scalars["BigInt"]>;
  requestId_gt?: InputMaybe<Scalars["BigInt"]>;
  requestId_lt?: InputMaybe<Scalars["BigInt"]>;
  requestId_gte?: InputMaybe<Scalars["BigInt"]>;
  requestId_lte?: InputMaybe<Scalars["BigInt"]>;
  requestId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  requestId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  ltoken?: InputMaybe<Scalars["String"]>;
  ltoken_not?: InputMaybe<Scalars["String"]>;
  ltoken_gt?: InputMaybe<Scalars["String"]>;
  ltoken_lt?: InputMaybe<Scalars["String"]>;
  ltoken_gte?: InputMaybe<Scalars["String"]>;
  ltoken_lte?: InputMaybe<Scalars["String"]>;
  ltoken_in?: InputMaybe<Array<Scalars["String"]>>;
  ltoken_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ltoken_contains?: InputMaybe<Scalars["String"]>;
  ltoken_contains_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_not_contains?: InputMaybe<Scalars["String"]>;
  ltoken_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_starts_with?: InputMaybe<Scalars["String"]>;
  ltoken_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_not_starts_with?: InputMaybe<Scalars["String"]>;
  ltoken_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_ends_with?: InputMaybe<Scalars["String"]>;
  ltoken_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_not_ends_with?: InputMaybe<Scalars["String"]>;
  ltoken_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_?: InputMaybe<LToken_filter>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  account?: InputMaybe<Scalars["Bytes"]>;
  account_not?: InputMaybe<Scalars["Bytes"]>;
  account_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  account_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  account_contains?: InputMaybe<Scalars["Bytes"]>;
  account_not_contains?: InputMaybe<Scalars["Bytes"]>;
  action?: InputMaybe<ActivityAction>;
  action_not?: InputMaybe<ActivityAction>;
  action_in?: InputMaybe<Array<ActivityAction>>;
  action_not_in?: InputMaybe<Array<ActivityAction>>;
  amount?: InputMaybe<Scalars["BigDecimal"]>;
  amount_not?: InputMaybe<Scalars["BigDecimal"]>;
  amount_gt?: InputMaybe<Scalars["BigDecimal"]>;
  amount_lt?: InputMaybe<Scalars["BigDecimal"]>;
  amount_gte?: InputMaybe<Scalars["BigDecimal"]>;
  amount_lte?: InputMaybe<Scalars["BigDecimal"]>;
  amount_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  amount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  amountAfterFees?: InputMaybe<Scalars["BigDecimal"]>;
  amountAfterFees_not?: InputMaybe<Scalars["BigDecimal"]>;
  amountAfterFees_gt?: InputMaybe<Scalars["BigDecimal"]>;
  amountAfterFees_lt?: InputMaybe<Scalars["BigDecimal"]>;
  amountAfterFees_gte?: InputMaybe<Scalars["BigDecimal"]>;
  amountAfterFees_lte?: InputMaybe<Scalars["BigDecimal"]>;
  amountAfterFees_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  amountAfterFees_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  status?: InputMaybe<ActivityStatus>;
  status_not?: InputMaybe<ActivityStatus>;
  status_in?: InputMaybe<Array<ActivityStatus>>;
  status_not_in?: InputMaybe<Array<ActivityStatus>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account_gt?: InputMaybe<Scalars["Bytes"]>;
  account_lt?: InputMaybe<Scalars["Bytes"]>;
  account_gte?: InputMaybe<Scalars["Bytes"]>;
  account_lte?: InputMaybe<Scalars["Bytes"]>;
  and?: InputMaybe<Array<InputMaybe<Activity_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Activity_filter>>>;
};

export type Activity_orderBy =
  | "id"
  | "requestId"
  | "ltoken"
  | "timestamp"
  | "account"
  | "action"
  | "amount"
  | "amountAfterFees"
  | "status"
  | "ltoken__id"
  | "ltoken__symbol"
  | "ltoken__decimals"
  | "ltoken__totalMintedRewards";

export type BlockChangedFilter = {
  number_gte: Scalars["Int"];
};

export type Block_height = {
  hash?: InputMaybe<Scalars["Bytes"]>;
  number?: InputMaybe<Scalars["Int"]>;
  number_gte?: InputMaybe<Scalars["Int"]>;
};

export type LToken = {
  id: Scalars["ID"];
  symbol: Scalars["String"];
  decimals: Scalars["Int"];
  totalMintedRewards: Scalars["BigDecimal"];
  tvlUpdates?: Maybe<Array<TVLChange>>;
  aprUpdates?: Maybe<Array<APRChange>>;
  activities?: Maybe<Array<Activity>>;
  rewardsMints?: Maybe<Array<RewardsMint>>;
};

export type LTokentvlUpdatesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TVLChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLChange_filter>;
};

export type LTokenaprUpdatesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<APRChange_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRChange_filter>;
};

export type LTokenactivitiesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
};

export type LTokenrewardsMintsArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
};

export type LToken_filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  symbol?: InputMaybe<Scalars["String"]>;
  symbol_not?: InputMaybe<Scalars["String"]>;
  symbol_gt?: InputMaybe<Scalars["String"]>;
  symbol_lt?: InputMaybe<Scalars["String"]>;
  symbol_gte?: InputMaybe<Scalars["String"]>;
  symbol_lte?: InputMaybe<Scalars["String"]>;
  symbol_in?: InputMaybe<Array<Scalars["String"]>>;
  symbol_not_in?: InputMaybe<Array<Scalars["String"]>>;
  symbol_contains?: InputMaybe<Scalars["String"]>;
  symbol_contains_nocase?: InputMaybe<Scalars["String"]>;
  symbol_not_contains?: InputMaybe<Scalars["String"]>;
  symbol_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  symbol_starts_with?: InputMaybe<Scalars["String"]>;
  symbol_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  symbol_not_starts_with?: InputMaybe<Scalars["String"]>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  symbol_ends_with?: InputMaybe<Scalars["String"]>;
  symbol_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  symbol_not_ends_with?: InputMaybe<Scalars["String"]>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  decimals?: InputMaybe<Scalars["Int"]>;
  decimals_not?: InputMaybe<Scalars["Int"]>;
  decimals_gt?: InputMaybe<Scalars["Int"]>;
  decimals_lt?: InputMaybe<Scalars["Int"]>;
  decimals_gte?: InputMaybe<Scalars["Int"]>;
  decimals_lte?: InputMaybe<Scalars["Int"]>;
  decimals_in?: InputMaybe<Array<Scalars["Int"]>>;
  decimals_not_in?: InputMaybe<Array<Scalars["Int"]>>;
  totalMintedRewards?: InputMaybe<Scalars["BigDecimal"]>;
  totalMintedRewards_not?: InputMaybe<Scalars["BigDecimal"]>;
  totalMintedRewards_gt?: InputMaybe<Scalars["BigDecimal"]>;
  totalMintedRewards_lt?: InputMaybe<Scalars["BigDecimal"]>;
  totalMintedRewards_gte?: InputMaybe<Scalars["BigDecimal"]>;
  totalMintedRewards_lte?: InputMaybe<Scalars["BigDecimal"]>;
  totalMintedRewards_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  totalMintedRewards_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
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
  | "id"
  | "symbol"
  | "decimals"
  | "totalMintedRewards"
  | "tvlUpdates"
  | "aprUpdates"
  | "activities"
  | "rewardsMints";

/** Defines the order direction, either ascending or descending */
export type OrderDirection = "asc" | "desc";

export type PreMiningLock = {
  id: Scalars["ID"];
  amount: Scalars["BigDecimal"];
  duration: Scalars["Int"];
};

export type PreMiningLock_filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  amount?: InputMaybe<Scalars["BigDecimal"]>;
  amount_not?: InputMaybe<Scalars["BigDecimal"]>;
  amount_gt?: InputMaybe<Scalars["BigDecimal"]>;
  amount_lt?: InputMaybe<Scalars["BigDecimal"]>;
  amount_gte?: InputMaybe<Scalars["BigDecimal"]>;
  amount_lte?: InputMaybe<Scalars["BigDecimal"]>;
  amount_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  amount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  duration?: InputMaybe<Scalars["Int"]>;
  duration_not?: InputMaybe<Scalars["Int"]>;
  duration_gt?: InputMaybe<Scalars["Int"]>;
  duration_lt?: InputMaybe<Scalars["Int"]>;
  duration_gte?: InputMaybe<Scalars["Int"]>;
  duration_lte?: InputMaybe<Scalars["Int"]>;
  duration_in?: InputMaybe<Array<Scalars["Int"]>>;
  duration_not_in?: InputMaybe<Array<Scalars["Int"]>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PreMiningLock_filter>>>;
  or?: InputMaybe<Array<InputMaybe<PreMiningLock_filter>>>;
};

export type PreMiningLock_orderBy = "id" | "amount" | "duration";

export type RewardsMint = {
  id: Scalars["ID"];
  ltoken: LToken;
  timestamp: Scalars["BigInt"];
  account: Scalars["Bytes"];
  balanceBefore: Scalars["BigDecimal"];
  revenue: Scalars["BigDecimal"];
  growth: Scalars["BigDecimal"];
};

export type RewardsMint_filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  ltoken?: InputMaybe<Scalars["String"]>;
  ltoken_not?: InputMaybe<Scalars["String"]>;
  ltoken_gt?: InputMaybe<Scalars["String"]>;
  ltoken_lt?: InputMaybe<Scalars["String"]>;
  ltoken_gte?: InputMaybe<Scalars["String"]>;
  ltoken_lte?: InputMaybe<Scalars["String"]>;
  ltoken_in?: InputMaybe<Array<Scalars["String"]>>;
  ltoken_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ltoken_contains?: InputMaybe<Scalars["String"]>;
  ltoken_contains_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_not_contains?: InputMaybe<Scalars["String"]>;
  ltoken_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_starts_with?: InputMaybe<Scalars["String"]>;
  ltoken_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_not_starts_with?: InputMaybe<Scalars["String"]>;
  ltoken_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_ends_with?: InputMaybe<Scalars["String"]>;
  ltoken_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_not_ends_with?: InputMaybe<Scalars["String"]>;
  ltoken_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_?: InputMaybe<LToken_filter>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  account?: InputMaybe<Scalars["Bytes"]>;
  account_not?: InputMaybe<Scalars["Bytes"]>;
  account_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  account_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  account_contains?: InputMaybe<Scalars["Bytes"]>;
  account_not_contains?: InputMaybe<Scalars["Bytes"]>;
  balanceBefore?: InputMaybe<Scalars["BigDecimal"]>;
  balanceBefore_not?: InputMaybe<Scalars["BigDecimal"]>;
  balanceBefore_gt?: InputMaybe<Scalars["BigDecimal"]>;
  balanceBefore_lt?: InputMaybe<Scalars["BigDecimal"]>;
  balanceBefore_gte?: InputMaybe<Scalars["BigDecimal"]>;
  balanceBefore_lte?: InputMaybe<Scalars["BigDecimal"]>;
  balanceBefore_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  balanceBefore_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  revenue?: InputMaybe<Scalars["BigDecimal"]>;
  revenue_not?: InputMaybe<Scalars["BigDecimal"]>;
  revenue_gt?: InputMaybe<Scalars["BigDecimal"]>;
  revenue_lt?: InputMaybe<Scalars["BigDecimal"]>;
  revenue_gte?: InputMaybe<Scalars["BigDecimal"]>;
  revenue_lte?: InputMaybe<Scalars["BigDecimal"]>;
  revenue_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  revenue_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  growth?: InputMaybe<Scalars["BigDecimal"]>;
  growth_not?: InputMaybe<Scalars["BigDecimal"]>;
  growth_gt?: InputMaybe<Scalars["BigDecimal"]>;
  growth_lt?: InputMaybe<Scalars["BigDecimal"]>;
  growth_gte?: InputMaybe<Scalars["BigDecimal"]>;
  growth_lte?: InputMaybe<Scalars["BigDecimal"]>;
  growth_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  growth_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account_gt?: InputMaybe<Scalars["Bytes"]>;
  account_lt?: InputMaybe<Scalars["Bytes"]>;
  account_gte?: InputMaybe<Scalars["Bytes"]>;
  account_lte?: InputMaybe<Scalars["Bytes"]>;
  and?: InputMaybe<Array<InputMaybe<RewardsMint_filter>>>;
  or?: InputMaybe<Array<InputMaybe<RewardsMint_filter>>>;
};

export type RewardsMint_orderBy =
  | "id"
  | "ltoken"
  | "timestamp"
  | "account"
  | "balanceBefore"
  | "revenue"
  | "growth"
  | "ltoken__id"
  | "ltoken__symbol"
  | "ltoken__decimals"
  | "ltoken__totalMintedRewards";

export type TVLChange = {
  id: Scalars["ID"];
  ltoken: LToken;
  timestamp: Scalars["BigInt"];
  amount: Scalars["BigDecimal"];
};

export type TVLChange_filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  ltoken?: InputMaybe<Scalars["String"]>;
  ltoken_not?: InputMaybe<Scalars["String"]>;
  ltoken_gt?: InputMaybe<Scalars["String"]>;
  ltoken_lt?: InputMaybe<Scalars["String"]>;
  ltoken_gte?: InputMaybe<Scalars["String"]>;
  ltoken_lte?: InputMaybe<Scalars["String"]>;
  ltoken_in?: InputMaybe<Array<Scalars["String"]>>;
  ltoken_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ltoken_contains?: InputMaybe<Scalars["String"]>;
  ltoken_contains_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_not_contains?: InputMaybe<Scalars["String"]>;
  ltoken_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_starts_with?: InputMaybe<Scalars["String"]>;
  ltoken_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_not_starts_with?: InputMaybe<Scalars["String"]>;
  ltoken_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_ends_with?: InputMaybe<Scalars["String"]>;
  ltoken_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_not_ends_with?: InputMaybe<Scalars["String"]>;
  ltoken_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ltoken_?: InputMaybe<LToken_filter>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  amount?: InputMaybe<Scalars["BigDecimal"]>;
  amount_not?: InputMaybe<Scalars["BigDecimal"]>;
  amount_gt?: InputMaybe<Scalars["BigDecimal"]>;
  amount_lt?: InputMaybe<Scalars["BigDecimal"]>;
  amount_gte?: InputMaybe<Scalars["BigDecimal"]>;
  amount_lte?: InputMaybe<Scalars["BigDecimal"]>;
  amount_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  amount_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TVLChange_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TVLChange_filter>>>;
};

export type TVLChange_orderBy =
  | "id"
  | "ltoken"
  | "timestamp"
  | "amount"
  | "ltoken__id"
  | "ltoken__symbol"
  | "ltoken__decimals"
  | "ltoken__totalMintedRewards";

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars["Bytes"]>;
  /** The block number */
  number: Scalars["Int"];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars["Int"]>;
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
  deployment: Scalars["String"];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars["Boolean"];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | "allow"
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | "deny";

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
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  APRChange: ResolverTypeWrapper<APRChange>;
  APRChange_filter: APRChange_filter;
  APRChange_orderBy: APRChange_orderBy;
  Activity: ResolverTypeWrapper<Activity>;
  ActivityAction: ActivityAction;
  ActivityStatus: ActivityStatus;
  Activity_filter: Activity_filter;
  Activity_orderBy: Activity_orderBy;
  BigDecimal: ResolverTypeWrapper<Scalars["BigDecimal"]>;
  BigInt: ResolverTypeWrapper<Scalars["BigInt"]>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Bytes: ResolverTypeWrapper<Scalars["Bytes"]>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  LToken: ResolverTypeWrapper<LToken>;
  LToken_filter: LToken_filter;
  LToken_orderBy: LToken_orderBy;
  OrderDirection: OrderDirection;
  PreMiningLock: ResolverTypeWrapper<PreMiningLock>;
  PreMiningLock_filter: PreMiningLock_filter;
  PreMiningLock_orderBy: PreMiningLock_orderBy;
  RewardsMint: ResolverTypeWrapper<RewardsMint>;
  RewardsMint_filter: RewardsMint_filter;
  RewardsMint_orderBy: RewardsMint_orderBy;
  String: ResolverTypeWrapper<Scalars["String"]>;
  TVLChange: ResolverTypeWrapper<TVLChange>;
  TVLChange_filter: TVLChange_filter;
  TVLChange_orderBy: TVLChange_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
  Int8: ResolverTypeWrapper<Scalars["Int8"]>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Subscription: {};
  APRChange: APRChange;
  APRChange_filter: APRChange_filter;
  Activity: Activity;
  Activity_filter: Activity_filter;
  BigDecimal: Scalars["BigDecimal"];
  BigInt: Scalars["BigInt"];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars["Boolean"];
  Bytes: Scalars["Bytes"];
  Float: Scalars["Float"];
  ID: Scalars["ID"];
  Int: Scalars["Int"];
  LToken: LToken;
  LToken_filter: LToken_filter;
  PreMiningLock: PreMiningLock;
  PreMiningLock_filter: PreMiningLock_filter;
  RewardsMint: RewardsMint;
  RewardsMint_filter: RewardsMint_filter;
  String: Scalars["String"];
  TVLChange: TVLChange;
  TVLChange_filter: TVLChange_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
  Int8: Scalars["Int8"];
}>;

export type entityDirectiveArgs = {};

export type entityDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext,
  Args = entityDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars["String"];
};

export type subgraphIdDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext,
  Args = subgraphIdDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars["String"];
};

export type derivedFromDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext,
  Args = derivedFromDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type QueryResolvers<
  ContextType = MeshContext,
  ParentType extends
    ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = ResolversObject<{
  c195_ltoken?: Resolver<
    Maybe<ResolversTypes["LToken"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc195_ltokenArgs, "id" | "subgraphError">
  >;
  c195_ltokens?: Resolver<
    Array<ResolversTypes["LToken"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc195_ltokensArgs, "skip" | "first" | "subgraphError">
  >;
  c195_tvlchange?: Resolver<
    Maybe<ResolversTypes["TVLChange"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc195_tvlchangeArgs, "id" | "subgraphError">
  >;
  c195_tvlchanges?: Resolver<
    Array<ResolversTypes["TVLChange"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc195_tvlchangesArgs, "skip" | "first" | "subgraphError">
  >;
  c195_aprchange?: Resolver<
    Maybe<ResolversTypes["APRChange"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc195_aprchangeArgs, "id" | "subgraphError">
  >;
  c195_aprchanges?: Resolver<
    Array<ResolversTypes["APRChange"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc195_aprchangesArgs, "skip" | "first" | "subgraphError">
  >;
  c195_activity?: Resolver<
    Maybe<ResolversTypes["Activity"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc195_activityArgs, "id" | "subgraphError">
  >;
  c195_activities?: Resolver<
    Array<ResolversTypes["Activity"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc195_activitiesArgs, "skip" | "first" | "subgraphError">
  >;
  c195_rewardsMint?: Resolver<
    Maybe<ResolversTypes["RewardsMint"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc195_rewardsMintArgs, "id" | "subgraphError">
  >;
  c195_rewardsMints?: Resolver<
    Array<ResolversTypes["RewardsMint"]>,
    ParentType,
    ContextType,
    RequireFields<
      Queryc195_rewardsMintsArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c195_preMiningLock?: Resolver<
    Maybe<ResolversTypes["PreMiningLock"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc195_preMiningLockArgs, "id" | "subgraphError">
  >;
  c195_preMiningLocks?: Resolver<
    Array<ResolversTypes["PreMiningLock"]>,
    ParentType,
    ContextType,
    RequireFields<
      Queryc195_preMiningLocksArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c195__meta?: Resolver<
    Maybe<ResolversTypes["_Meta_"]>,
    ParentType,
    ContextType,
    Partial<Queryc195__metaArgs>
  >;
  c59144_ltoken?: Resolver<
    Maybe<ResolversTypes["LToken"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc59144_ltokenArgs, "id" | "subgraphError">
  >;
  c59144_ltokens?: Resolver<
    Array<ResolversTypes["LToken"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc59144_ltokensArgs, "skip" | "first" | "subgraphError">
  >;
  c59144_tvlchange?: Resolver<
    Maybe<ResolversTypes["TVLChange"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc59144_tvlchangeArgs, "id" | "subgraphError">
  >;
  c59144_tvlchanges?: Resolver<
    Array<ResolversTypes["TVLChange"]>,
    ParentType,
    ContextType,
    RequireFields<
      Queryc59144_tvlchangesArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c59144_aprchange?: Resolver<
    Maybe<ResolversTypes["APRChange"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc59144_aprchangeArgs, "id" | "subgraphError">
  >;
  c59144_aprchanges?: Resolver<
    Array<ResolversTypes["APRChange"]>,
    ParentType,
    ContextType,
    RequireFields<
      Queryc59144_aprchangesArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c59144_activity?: Resolver<
    Maybe<ResolversTypes["Activity"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc59144_activityArgs, "id" | "subgraphError">
  >;
  c59144_activities?: Resolver<
    Array<ResolversTypes["Activity"]>,
    ParentType,
    ContextType,
    RequireFields<
      Queryc59144_activitiesArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c59144_rewardsMint?: Resolver<
    Maybe<ResolversTypes["RewardsMint"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc59144_rewardsMintArgs, "id" | "subgraphError">
  >;
  c59144_rewardsMints?: Resolver<
    Array<ResolversTypes["RewardsMint"]>,
    ParentType,
    ContextType,
    RequireFields<
      Queryc59144_rewardsMintsArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c59144_preMiningLock?: Resolver<
    Maybe<ResolversTypes["PreMiningLock"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc59144_preMiningLockArgs, "id" | "subgraphError">
  >;
  c59144_preMiningLocks?: Resolver<
    Array<ResolversTypes["PreMiningLock"]>,
    ParentType,
    ContextType,
    RequireFields<
      Queryc59144_preMiningLocksArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c59144__meta?: Resolver<
    Maybe<ResolversTypes["_Meta_"]>,
    ParentType,
    ContextType,
    Partial<Queryc59144__metaArgs>
  >;
  c42161_ltoken?: Resolver<
    Maybe<ResolversTypes["LToken"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc42161_ltokenArgs, "id" | "subgraphError">
  >;
  c42161_ltokens?: Resolver<
    Array<ResolversTypes["LToken"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc42161_ltokensArgs, "skip" | "first" | "subgraphError">
  >;
  c42161_tvlchange?: Resolver<
    Maybe<ResolversTypes["TVLChange"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc42161_tvlchangeArgs, "id" | "subgraphError">
  >;
  c42161_tvlchanges?: Resolver<
    Array<ResolversTypes["TVLChange"]>,
    ParentType,
    ContextType,
    RequireFields<
      Queryc42161_tvlchangesArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c42161_aprchange?: Resolver<
    Maybe<ResolversTypes["APRChange"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc42161_aprchangeArgs, "id" | "subgraphError">
  >;
  c42161_aprchanges?: Resolver<
    Array<ResolversTypes["APRChange"]>,
    ParentType,
    ContextType,
    RequireFields<
      Queryc42161_aprchangesArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c42161_activity?: Resolver<
    Maybe<ResolversTypes["Activity"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc42161_activityArgs, "id" | "subgraphError">
  >;
  c42161_activities?: Resolver<
    Array<ResolversTypes["Activity"]>,
    ParentType,
    ContextType,
    RequireFields<
      Queryc42161_activitiesArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c42161_rewardsMint?: Resolver<
    Maybe<ResolversTypes["RewardsMint"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc42161_rewardsMintArgs, "id" | "subgraphError">
  >;
  c42161_rewardsMints?: Resolver<
    Array<ResolversTypes["RewardsMint"]>,
    ParentType,
    ContextType,
    RequireFields<
      Queryc42161_rewardsMintsArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c42161_preMiningLock?: Resolver<
    Maybe<ResolversTypes["PreMiningLock"]>,
    ParentType,
    ContextType,
    RequireFields<Queryc42161_preMiningLockArgs, "id" | "subgraphError">
  >;
  c42161_preMiningLocks?: Resolver<
    Array<ResolversTypes["PreMiningLock"]>,
    ParentType,
    ContextType,
    RequireFields<
      Queryc42161_preMiningLocksArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c42161__meta?: Resolver<
    Maybe<ResolversTypes["_Meta_"]>,
    ParentType,
    ContextType,
    Partial<Queryc42161__metaArgs>
  >;
}>;

export type SubscriptionResolvers<
  ContextType = MeshContext,
  ParentType extends
    ResolversParentTypes["Subscription"] = ResolversParentTypes["Subscription"],
> = ResolversObject<{
  c195_ltoken?: SubscriptionResolver<
    Maybe<ResolversTypes["LToken"]>,
    "c195_ltoken",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc195_ltokenArgs, "id" | "subgraphError">
  >;
  c195_ltokens?: SubscriptionResolver<
    Array<ResolversTypes["LToken"]>,
    "c195_ltokens",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc195_ltokensArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c195_tvlchange?: SubscriptionResolver<
    Maybe<ResolversTypes["TVLChange"]>,
    "c195_tvlchange",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc195_tvlchangeArgs, "id" | "subgraphError">
  >;
  c195_tvlchanges?: SubscriptionResolver<
    Array<ResolversTypes["TVLChange"]>,
    "c195_tvlchanges",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc195_tvlchangesArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c195_aprchange?: SubscriptionResolver<
    Maybe<ResolversTypes["APRChange"]>,
    "c195_aprchange",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc195_aprchangeArgs, "id" | "subgraphError">
  >;
  c195_aprchanges?: SubscriptionResolver<
    Array<ResolversTypes["APRChange"]>,
    "c195_aprchanges",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc195_aprchangesArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c195_activity?: SubscriptionResolver<
    Maybe<ResolversTypes["Activity"]>,
    "c195_activity",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc195_activityArgs, "id" | "subgraphError">
  >;
  c195_activities?: SubscriptionResolver<
    Array<ResolversTypes["Activity"]>,
    "c195_activities",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc195_activitiesArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c195_rewardsMint?: SubscriptionResolver<
    Maybe<ResolversTypes["RewardsMint"]>,
    "c195_rewardsMint",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc195_rewardsMintArgs, "id" | "subgraphError">
  >;
  c195_rewardsMints?: SubscriptionResolver<
    Array<ResolversTypes["RewardsMint"]>,
    "c195_rewardsMints",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc195_rewardsMintsArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c195_preMiningLock?: SubscriptionResolver<
    Maybe<ResolversTypes["PreMiningLock"]>,
    "c195_preMiningLock",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc195_preMiningLockArgs, "id" | "subgraphError">
  >;
  c195_preMiningLocks?: SubscriptionResolver<
    Array<ResolversTypes["PreMiningLock"]>,
    "c195_preMiningLocks",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc195_preMiningLocksArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c195__meta?: SubscriptionResolver<
    Maybe<ResolversTypes["_Meta_"]>,
    "c195__meta",
    ParentType,
    ContextType,
    Partial<Subscriptionc195__metaArgs>
  >;
  c59144_ltoken?: SubscriptionResolver<
    Maybe<ResolversTypes["LToken"]>,
    "c59144_ltoken",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc59144_ltokenArgs, "id" | "subgraphError">
  >;
  c59144_ltokens?: SubscriptionResolver<
    Array<ResolversTypes["LToken"]>,
    "c59144_ltokens",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc59144_ltokensArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c59144_tvlchange?: SubscriptionResolver<
    Maybe<ResolversTypes["TVLChange"]>,
    "c59144_tvlchange",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc59144_tvlchangeArgs, "id" | "subgraphError">
  >;
  c59144_tvlchanges?: SubscriptionResolver<
    Array<ResolversTypes["TVLChange"]>,
    "c59144_tvlchanges",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc59144_tvlchangesArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c59144_aprchange?: SubscriptionResolver<
    Maybe<ResolversTypes["APRChange"]>,
    "c59144_aprchange",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc59144_aprchangeArgs, "id" | "subgraphError">
  >;
  c59144_aprchanges?: SubscriptionResolver<
    Array<ResolversTypes["APRChange"]>,
    "c59144_aprchanges",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc59144_aprchangesArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c59144_activity?: SubscriptionResolver<
    Maybe<ResolversTypes["Activity"]>,
    "c59144_activity",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc59144_activityArgs, "id" | "subgraphError">
  >;
  c59144_activities?: SubscriptionResolver<
    Array<ResolversTypes["Activity"]>,
    "c59144_activities",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc59144_activitiesArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c59144_rewardsMint?: SubscriptionResolver<
    Maybe<ResolversTypes["RewardsMint"]>,
    "c59144_rewardsMint",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc59144_rewardsMintArgs, "id" | "subgraphError">
  >;
  c59144_rewardsMints?: SubscriptionResolver<
    Array<ResolversTypes["RewardsMint"]>,
    "c59144_rewardsMints",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc59144_rewardsMintsArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c59144_preMiningLock?: SubscriptionResolver<
    Maybe<ResolversTypes["PreMiningLock"]>,
    "c59144_preMiningLock",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc59144_preMiningLockArgs, "id" | "subgraphError">
  >;
  c59144_preMiningLocks?: SubscriptionResolver<
    Array<ResolversTypes["PreMiningLock"]>,
    "c59144_preMiningLocks",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc59144_preMiningLocksArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c59144__meta?: SubscriptionResolver<
    Maybe<ResolversTypes["_Meta_"]>,
    "c59144__meta",
    ParentType,
    ContextType,
    Partial<Subscriptionc59144__metaArgs>
  >;
  c42161_ltoken?: SubscriptionResolver<
    Maybe<ResolversTypes["LToken"]>,
    "c42161_ltoken",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc42161_ltokenArgs, "id" | "subgraphError">
  >;
  c42161_ltokens?: SubscriptionResolver<
    Array<ResolversTypes["LToken"]>,
    "c42161_ltokens",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc42161_ltokensArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c42161_tvlchange?: SubscriptionResolver<
    Maybe<ResolversTypes["TVLChange"]>,
    "c42161_tvlchange",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc42161_tvlchangeArgs, "id" | "subgraphError">
  >;
  c42161_tvlchanges?: SubscriptionResolver<
    Array<ResolversTypes["TVLChange"]>,
    "c42161_tvlchanges",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc42161_tvlchangesArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c42161_aprchange?: SubscriptionResolver<
    Maybe<ResolversTypes["APRChange"]>,
    "c42161_aprchange",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc42161_aprchangeArgs, "id" | "subgraphError">
  >;
  c42161_aprchanges?: SubscriptionResolver<
    Array<ResolversTypes["APRChange"]>,
    "c42161_aprchanges",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc42161_aprchangesArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c42161_activity?: SubscriptionResolver<
    Maybe<ResolversTypes["Activity"]>,
    "c42161_activity",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc42161_activityArgs, "id" | "subgraphError">
  >;
  c42161_activities?: SubscriptionResolver<
    Array<ResolversTypes["Activity"]>,
    "c42161_activities",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc42161_activitiesArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c42161_rewardsMint?: SubscriptionResolver<
    Maybe<ResolversTypes["RewardsMint"]>,
    "c42161_rewardsMint",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc42161_rewardsMintArgs, "id" | "subgraphError">
  >;
  c42161_rewardsMints?: SubscriptionResolver<
    Array<ResolversTypes["RewardsMint"]>,
    "c42161_rewardsMints",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc42161_rewardsMintsArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c42161_preMiningLock?: SubscriptionResolver<
    Maybe<ResolversTypes["PreMiningLock"]>,
    "c42161_preMiningLock",
    ParentType,
    ContextType,
    RequireFields<Subscriptionc42161_preMiningLockArgs, "id" | "subgraphError">
  >;
  c42161_preMiningLocks?: SubscriptionResolver<
    Array<ResolversTypes["PreMiningLock"]>,
    "c42161_preMiningLocks",
    ParentType,
    ContextType,
    RequireFields<
      Subscriptionc42161_preMiningLocksArgs,
      "skip" | "first" | "subgraphError"
    >
  >;
  c42161__meta?: SubscriptionResolver<
    Maybe<ResolversTypes["_Meta_"]>,
    "c42161__meta",
    ParentType,
    ContextType,
    Partial<Subscriptionc42161__metaArgs>
  >;
}>;

export type APRChangeResolvers<
  ContextType = MeshContext,
  ParentType extends
    ResolversParentTypes["APRChange"] = ResolversParentTypes["APRChange"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  ltoken?: Resolver<ResolversTypes["LToken"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  apr?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ActivityResolvers<
  ContextType = MeshContext,
  ParentType extends
    ResolversParentTypes["Activity"] = ResolversParentTypes["Activity"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  requestId?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  ltoken?: Resolver<ResolversTypes["LToken"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  account?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  action?: Resolver<ResolversTypes["ActivityAction"], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  amountAfterFees?: Resolver<
    ResolversTypes["BigDecimal"],
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["ActivityStatus"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigDecimalScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["BigDecimal"], any> {
  name: "BigDecimal";
}

export interface BigIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["BigInt"], any> {
  name: "BigInt";
}

export interface BytesScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Bytes"], any> {
  name: "Bytes";
}

export type LTokenResolvers<
  ContextType = MeshContext,
  ParentType extends
    ResolversParentTypes["LToken"] = ResolversParentTypes["LToken"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  totalMintedRewards?: Resolver<
    ResolversTypes["BigDecimal"],
    ParentType,
    ContextType
  >;
  tvlUpdates?: Resolver<
    Maybe<Array<ResolversTypes["TVLChange"]>>,
    ParentType,
    ContextType,
    RequireFields<LTokentvlUpdatesArgs, "skip" | "first">
  >;
  aprUpdates?: Resolver<
    Maybe<Array<ResolversTypes["APRChange"]>>,
    ParentType,
    ContextType,
    RequireFields<LTokenaprUpdatesArgs, "skip" | "first">
  >;
  activities?: Resolver<
    Maybe<Array<ResolversTypes["Activity"]>>,
    ParentType,
    ContextType,
    RequireFields<LTokenactivitiesArgs, "skip" | "first">
  >;
  rewardsMints?: Resolver<
    Maybe<Array<ResolversTypes["RewardsMint"]>>,
    ParentType,
    ContextType,
    RequireFields<LTokenrewardsMintsArgs, "skip" | "first">
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PreMiningLockResolvers<
  ContextType = MeshContext,
  ParentType extends
    ResolversParentTypes["PreMiningLock"] = ResolversParentTypes["PreMiningLock"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  duration?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RewardsMintResolvers<
  ContextType = MeshContext,
  ParentType extends
    ResolversParentTypes["RewardsMint"] = ResolversParentTypes["RewardsMint"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  ltoken?: Resolver<ResolversTypes["LToken"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  account?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  balanceBefore?: Resolver<
    ResolversTypes["BigDecimal"],
    ParentType,
    ContextType
  >;
  revenue?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  growth?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TVLChangeResolvers<
  ContextType = MeshContext,
  ParentType extends
    ResolversParentTypes["TVLChange"] = ResolversParentTypes["TVLChange"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  ltoken?: Resolver<ResolversTypes["LToken"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<
  ContextType = MeshContext,
  ParentType extends
    ResolversParentTypes["_Block_"] = ResolversParentTypes["_Block_"],
> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes["Bytes"]>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<
  ContextType = MeshContext,
  ParentType extends
    ResolversParentTypes["_Meta_"] = ResolversParentTypes["_Meta_"],
> = ResolversObject<{
  block?: Resolver<ResolversTypes["_Block_"], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface Int8ScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Int8"], any> {
  name: "Int8";
}

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  APRChange?: APRChangeResolvers<ContextType>;
  Activity?: ActivityResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  LToken?: LTokenResolvers<ContextType>;
  PreMiningLock?: PreMiningLockResolvers<ContextType>;
  RewardsMint?: RewardsMintResolvers<ContextType>;
  TVLChange?: TVLChangeResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
  Int8?: GraphQLScalarType;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = OkxX1TestnetTypes.Context &
  LineaTypes.Context &
  ArbitrumTypes.Context &
  BaseMeshContext;

import { fileURLToPath } from "@graphql-mesh/utils";
const baseDir = pathModule.join(
  pathModule.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (
    pathModule.isAbsolute(moduleId)
      ? pathModule.relative(baseDir, moduleId)
      : moduleId
  )
    .split("\\")
    .join("/")
    .replace(baseDir + "/", "");
  switch (relativeModuleId) {
    case ".graphclient/sources/OKX_X1_Testnet/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;

    case ".graphclient/sources/linea/introspectionSchema":
      return Promise.resolve(importedModule$1) as T;

    case ".graphclient/sources/arbitrum/introspectionSchema":
      return Promise.resolve(importedModule$2) as T;

    default:
      return Promise.reject(
        new Error(`Cannot find module '${relativeModuleId}'.`),
      );
  }
};

const rootStore = new MeshStore(
  ".graphclient",
  new FsStoreStorageAdapter({
    cwd: baseDir,
    importFn,
    fileType: "ts",
  }),
  {
    readonly: true,
    validate: false,
  },
);

export const rawServeConfig: YamlConfig.Config["serve"] = undefined as any;
export async function getMeshOptions(): Promise<GetMeshOptions> {
  const pubsub = new PubSub();
  const sourcesStore = rootStore.child("sources");
  const logger = new DefaultLogger("GraphClient");
  const cache = new (MeshCache as any)({
    ...({} as any),
    importFn,
    store: rootStore.child("cache"),
    pubsub,
    logger,
  } as any);

  const sources: MeshResolvedSource[] = [];
  const transforms: MeshTransform[] = [];
  const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
  const arbitrumTransforms = [];
  const lineaTransforms = [];
  const okxX1TestnetTransforms = [];
  const additionalTypeDefs = [] as any[];
  const arbitrumHandler = new GraphqlHandler({
    name: "arbitrum",
    config: {
      endpoint:
        "https://gateway-arbitrum.network.thegraph.com/api/cfd41a9b70fcff12512d9fafecc0387d/subgraphs/id/eVibF32AJuoYG4DorvFTrJ6hH7ZxZdpMj1Jg6iAfbHb",
    },
    baseDir,
    cache,
    pubsub,
    store: sourcesStore.child("arbitrum"),
    logger: logger.child("arbitrum"),
    importFn,
  });
  const lineaHandler = new GraphqlHandler({
    name: "linea",
    config: {
      endpoint:
        "https://graph-query.linea.build/subgraphs/name/LedgityLabs/LedgityYield",
    },
    baseDir,
    cache,
    pubsub,
    store: sourcesStore.child("linea"),
    logger: logger.child("linea"),
    importFn,
  });
  const okxX1TestnetHandler = new GraphqlHandler({
    name: "OKX_X1_Testnet",
    config: {
      endpoint:
        "https://www.okx.com/api/v1/x1-testnet/index/subgraphs/name/LedgityLabs/LedgityYield",
    },
    baseDir,
    cache,
    pubsub,
    store: sourcesStore.child("OKX_X1_Testnet"),
    logger: logger.child("OKX_X1_Testnet"),
    importFn,
  });
  arbitrumTransforms[0] = new PrefixTransform({
    apiName: "arbitrum",
    config: {
      mode: "wrap",
      value: "c42161_",
      includeRootOperations: true,
      includeTypes: false,
    },
    baseDir,
    cache,
    pubsub,
    importFn,
    logger,
  });
  lineaTransforms[0] = new PrefixTransform({
    apiName: "linea",
    config: {
      mode: "wrap",
      value: "c59144_",
      includeRootOperations: true,
      includeTypes: false,
    },
    baseDir,
    cache,
    pubsub,
    importFn,
    logger,
  });
  okxX1TestnetTransforms[0] = new PrefixTransform({
    apiName: "OKX_X1_Testnet",
    config: {
      mode: "wrap",
      value: "c195_",
      includeRootOperations: true,
      includeTypes: false,
    },
    baseDir,
    cache,
    pubsub,
    importFn,
    logger,
  });
  sources[0] = {
    name: "arbitrum",
    handler: arbitrumHandler,
    transforms: arbitrumTransforms,
  };
  sources[1] = {
    name: "linea",
    handler: lineaHandler,
    transforms: lineaTransforms,
  };
  sources[2] = {
    name: "OKX_X1_Testnet",
    handler: okxX1TestnetHandler,
    transforms: okxX1TestnetTransforms,
  };
  const additionalResolvers = [] as any[];
  const merger = new (StitchingMerger as any)({
    cache,
    pubsub,
    logger: logger.child("stitchingMerger"),
    store: rootStore.child("stitchingMerger"),
  });

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
      return [];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<
  TServerContext = {},
>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  });
}

let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions()
      .then((meshOptions) => getMesh(meshOptions))
      .then((mesh) => {
        const id = mesh.pubsub.subscribe("destroy", () => {
          meshInstance$ = undefined;
          mesh.pubsub.unsubscribe(id);
        });
        return mesh;
      });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) =>
  getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) =>
  getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
