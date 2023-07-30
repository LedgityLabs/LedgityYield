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
import BareMerger from "@graphql-mesh/merger-bare";
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
import type { LocalhostSubgraphTypes } from "./sources/localhost-subgraph/types";
import * as importedModule$0 from "./sources/localhost-subgraph/introspectionSchema";
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
};

export type APRUpdate = {
  id: Scalars["ID"];
  ltoken: LToken;
  timestamp: Scalars["BigInt"];
  apr: Scalars["BigDecimal"];
};

export type APRUpdate_filter = {
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
  and?: InputMaybe<Array<InputMaybe<APRUpdate_filter>>>;
  or?: InputMaybe<Array<InputMaybe<APRUpdate_filter>>>;
};

export type APRUpdate_orderBy =
  | "id"
  | "ltoken"
  | "ltoken__id"
  | "ltoken__symbol"
  | "ltoken__decimals"
  | "ltoken__totalMintedRewards"
  | "timestamp"
  | "apr";

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
  account_gt?: InputMaybe<Scalars["Bytes"]>;
  account_lt?: InputMaybe<Scalars["Bytes"]>;
  account_gte?: InputMaybe<Scalars["Bytes"]>;
  account_lte?: InputMaybe<Scalars["Bytes"]>;
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
  and?: InputMaybe<Array<InputMaybe<Activity_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Activity_filter>>>;
};

export type Activity_orderBy =
  | "id"
  | "requestId"
  | "ltoken"
  | "ltoken__id"
  | "ltoken__symbol"
  | "ltoken__decimals"
  | "ltoken__totalMintedRewards"
  | "timestamp"
  | "account"
  | "action"
  | "amount"
  | "amountAfterFees"
  | "status";

export type BlockChangedFilter = {
  number_gte: Scalars["Int"];
};

export type Block_height = {
  hash?: InputMaybe<Scalars["Bytes"]>;
  number?: InputMaybe<Scalars["Int"]>;
  number_gte?: InputMaybe<Scalars["Int"]>;
};

export type LDYStaking = {
  id: Scalars["ID"];
  totalStakedUpdates?: Maybe<Array<TotalStakedUpdate>>;
};

export type LDYStakingtotalStakedUpdatesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TotalStakedUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TotalStakedUpdate_filter>;
};

export type LDYStaking_filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  totalStakedUpdates_?: InputMaybe<TotalStakedUpdate_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<LDYStaking_filter>>>;
  or?: InputMaybe<Array<InputMaybe<LDYStaking_filter>>>;
};

export type LDYStaking_orderBy = "id" | "totalStakedUpdates";

export type LToken = {
  id: Scalars["ID"];
  symbol: Scalars["String"];
  decimals: Scalars["Int"];
  tvlUpdates?: Maybe<Array<TVLUpdate>>;
  aprUpdates?: Maybe<Array<APRUpdate>>;
  activities?: Maybe<Array<Activity>>;
  rewardsMints?: Maybe<Array<RewardsMint>>;
  totalMintedRewards: Scalars["BigInt"];
};

export type LTokentvlUpdatesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TVLUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLUpdate_filter>;
};

export type LTokenaprUpdatesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<APRUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRUpdate_filter>;
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
  tvlUpdates_?: InputMaybe<TVLUpdate_filter>;
  aprUpdates_?: InputMaybe<APRUpdate_filter>;
  activities_?: InputMaybe<Activity_filter>;
  rewardsMints_?: InputMaybe<RewardsMint_filter>;
  totalMintedRewards?: InputMaybe<Scalars["BigInt"]>;
  totalMintedRewards_not?: InputMaybe<Scalars["BigInt"]>;
  totalMintedRewards_gt?: InputMaybe<Scalars["BigInt"]>;
  totalMintedRewards_lt?: InputMaybe<Scalars["BigInt"]>;
  totalMintedRewards_gte?: InputMaybe<Scalars["BigInt"]>;
  totalMintedRewards_lte?: InputMaybe<Scalars["BigInt"]>;
  totalMintedRewards_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  totalMintedRewards_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<LToken_filter>>>;
  or?: InputMaybe<Array<InputMaybe<LToken_filter>>>;
};

export type LToken_orderBy =
  | "id"
  | "symbol"
  | "decimals"
  | "tvlUpdates"
  | "aprUpdates"
  | "activities"
  | "rewardsMints"
  | "totalMintedRewards";

/** Defines the order direction, either ascending or descending */
export type OrderDirection = "asc" | "desc";

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
  ldystaking?: Maybe<LDYStaking>;
  ldystakings: Array<LDYStaking>;
  totalStakedUpdate?: Maybe<TotalStakedUpdate>;
  totalStakedUpdates: Array<TotalStakedUpdate>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};

export type QueryltokenArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryltokensArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerytvlupdateArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerytvlupdatesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TVLUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLUpdate_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryaprupdateArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryaprupdatesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<APRUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRUpdate_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryactivityArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryactivitiesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryrewardsMintArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryrewardsMintsArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryldystakingArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryldystakingsArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<LDYStaking_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LDYStaking_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerytotalStakedUpdateArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerytotalStakedUpdatesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
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
  account_gt?: InputMaybe<Scalars["Bytes"]>;
  account_lt?: InputMaybe<Scalars["Bytes"]>;
  account_gte?: InputMaybe<Scalars["Bytes"]>;
  account_lte?: InputMaybe<Scalars["Bytes"]>;
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
  and?: InputMaybe<Array<InputMaybe<RewardsMint_filter>>>;
  or?: InputMaybe<Array<InputMaybe<RewardsMint_filter>>>;
};

export type RewardsMint_orderBy =
  | "id"
  | "ltoken"
  | "ltoken__id"
  | "ltoken__symbol"
  | "ltoken__decimals"
  | "ltoken__totalMintedRewards"
  | "timestamp"
  | "account"
  | "balanceBefore"
  | "revenue"
  | "growth";

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
  ldystaking?: Maybe<LDYStaking>;
  ldystakings: Array<LDYStaking>;
  totalStakedUpdate?: Maybe<TotalStakedUpdate>;
  totalStakedUpdates: Array<TotalStakedUpdate>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};

export type SubscriptionltokenArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionltokensArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<LToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptiontvlupdateArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptiontvlupdatesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TVLUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TVLUpdate_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionaprupdateArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionaprupdatesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<APRUpdate_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<APRUpdate_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionactivityArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionactivitiesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Activity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Activity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionrewardsMintArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionrewardsMintsArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<RewardsMint_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RewardsMint_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionldystakingArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionldystakingsArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<LDYStaking_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LDYStaking_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptiontotalStakedUpdateArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptiontotalStakedUpdatesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
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
  id: Scalars["ID"];
  ltoken: LToken;
  timestamp: Scalars["BigInt"];
  amount: Scalars["BigDecimal"];
};

export type TVLUpdate_filter = {
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
  and?: InputMaybe<Array<InputMaybe<TVLUpdate_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TVLUpdate_filter>>>;
};

export type TVLUpdate_orderBy =
  | "id"
  | "ltoken"
  | "ltoken__id"
  | "ltoken__symbol"
  | "ltoken__decimals"
  | "ltoken__totalMintedRewards"
  | "timestamp"
  | "amount";

export type TotalStakedUpdate = {
  id: Scalars["ID"];
  staking: LDYStaking;
  timestamp: Scalars["BigInt"];
  amount: Scalars["BigDecimal"];
};

export type TotalStakedUpdate_filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  staking?: InputMaybe<Scalars["String"]>;
  staking_not?: InputMaybe<Scalars["String"]>;
  staking_gt?: InputMaybe<Scalars["String"]>;
  staking_lt?: InputMaybe<Scalars["String"]>;
  staking_gte?: InputMaybe<Scalars["String"]>;
  staking_lte?: InputMaybe<Scalars["String"]>;
  staking_in?: InputMaybe<Array<Scalars["String"]>>;
  staking_not_in?: InputMaybe<Array<Scalars["String"]>>;
  staking_contains?: InputMaybe<Scalars["String"]>;
  staking_contains_nocase?: InputMaybe<Scalars["String"]>;
  staking_not_contains?: InputMaybe<Scalars["String"]>;
  staking_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  staking_starts_with?: InputMaybe<Scalars["String"]>;
  staking_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  staking_not_starts_with?: InputMaybe<Scalars["String"]>;
  staking_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  staking_ends_with?: InputMaybe<Scalars["String"]>;
  staking_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  staking_not_ends_with?: InputMaybe<Scalars["String"]>;
  staking_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  staking_?: InputMaybe<LDYStaking_filter>;
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
  and?: InputMaybe<Array<InputMaybe<TotalStakedUpdate_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TotalStakedUpdate_filter>>>;
};

export type TotalStakedUpdate_orderBy = "id" | "staking" | "staking__id" | "timestamp" | "amount";

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

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
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

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  APRUpdate: ResolverTypeWrapper<APRUpdate>;
  APRUpdate_filter: APRUpdate_filter;
  APRUpdate_orderBy: APRUpdate_orderBy;
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
  LDYStaking: ResolverTypeWrapper<LDYStaking>;
  LDYStaking_filter: LDYStaking_filter;
  LDYStaking_orderBy: LDYStaking_orderBy;
  LToken: ResolverTypeWrapper<LToken>;
  LToken_filter: LToken_filter;
  LToken_orderBy: LToken_orderBy;
  OrderDirection: OrderDirection;
  Query: ResolverTypeWrapper<{}>;
  RewardsMint: ResolverTypeWrapper<RewardsMint>;
  RewardsMint_filter: RewardsMint_filter;
  RewardsMint_orderBy: RewardsMint_orderBy;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Subscription: ResolverTypeWrapper<{}>;
  TVLUpdate: ResolverTypeWrapper<TVLUpdate>;
  TVLUpdate_filter: TVLUpdate_filter;
  TVLUpdate_orderBy: TVLUpdate_orderBy;
  TotalStakedUpdate: ResolverTypeWrapper<TotalStakedUpdate>;
  TotalStakedUpdate_filter: TotalStakedUpdate_filter;
  TotalStakedUpdate_orderBy: TotalStakedUpdate_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  APRUpdate: APRUpdate;
  APRUpdate_filter: APRUpdate_filter;
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
  LDYStaking: LDYStaking;
  LDYStaking_filter: LDYStaking_filter;
  LToken: LToken;
  LToken_filter: LToken_filter;
  Query: {};
  RewardsMint: RewardsMint;
  RewardsMint_filter: RewardsMint_filter;
  String: Scalars["String"];
  Subscription: {};
  TVLUpdate: TVLUpdate;
  TVLUpdate_filter: TVLUpdate_filter;
  TotalStakedUpdate: TotalStakedUpdate;
  TotalStakedUpdate_filter: TotalStakedUpdate_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
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

export type APRUpdateResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["APRUpdate"] = ResolversParentTypes["APRUpdate"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  ltoken?: Resolver<ResolversTypes["LToken"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  apr?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ActivityResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Activity"] = ResolversParentTypes["Activity"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  requestId?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  ltoken?: Resolver<ResolversTypes["LToken"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  account?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  action?: Resolver<ResolversTypes["ActivityAction"], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  amountAfterFees?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["ActivityStatus"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigDecimalScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["BigDecimal"], any> {
  name: "BigDecimal";
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["BigInt"], any> {
  name: "BigInt";
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Bytes"], any> {
  name: "Bytes";
}

export type LDYStakingResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["LDYStaking"] = ResolversParentTypes["LDYStaking"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  totalStakedUpdates?: Resolver<
    Maybe<Array<ResolversTypes["TotalStakedUpdate"]>>,
    ParentType,
    ContextType,
    RequireFields<LDYStakingtotalStakedUpdatesArgs, "skip" | "first">
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LTokenResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["LToken"] = ResolversParentTypes["LToken"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  tvlUpdates?: Resolver<
    Maybe<Array<ResolversTypes["TVLUpdate"]>>,
    ParentType,
    ContextType,
    RequireFields<LTokentvlUpdatesArgs, "skip" | "first">
  >;
  aprUpdates?: Resolver<
    Maybe<Array<ResolversTypes["APRUpdate"]>>,
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
  totalMintedRewards?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = ResolversObject<{
  ltoken?: Resolver<
    Maybe<ResolversTypes["LToken"]>,
    ParentType,
    ContextType,
    RequireFields<QueryltokenArgs, "id" | "subgraphError">
  >;
  ltokens?: Resolver<
    Array<ResolversTypes["LToken"]>,
    ParentType,
    ContextType,
    RequireFields<QueryltokensArgs, "skip" | "first" | "subgraphError">
  >;
  tvlupdate?: Resolver<
    Maybe<ResolversTypes["TVLUpdate"]>,
    ParentType,
    ContextType,
    RequireFields<QuerytvlupdateArgs, "id" | "subgraphError">
  >;
  tvlupdates?: Resolver<
    Array<ResolversTypes["TVLUpdate"]>,
    ParentType,
    ContextType,
    RequireFields<QuerytvlupdatesArgs, "skip" | "first" | "subgraphError">
  >;
  aprupdate?: Resolver<
    Maybe<ResolversTypes["APRUpdate"]>,
    ParentType,
    ContextType,
    RequireFields<QueryaprupdateArgs, "id" | "subgraphError">
  >;
  aprupdates?: Resolver<
    Array<ResolversTypes["APRUpdate"]>,
    ParentType,
    ContextType,
    RequireFields<QueryaprupdatesArgs, "skip" | "first" | "subgraphError">
  >;
  activity?: Resolver<
    Maybe<ResolversTypes["Activity"]>,
    ParentType,
    ContextType,
    RequireFields<QueryactivityArgs, "id" | "subgraphError">
  >;
  activities?: Resolver<
    Array<ResolversTypes["Activity"]>,
    ParentType,
    ContextType,
    RequireFields<QueryactivitiesArgs, "skip" | "first" | "subgraphError">
  >;
  rewardsMint?: Resolver<
    Maybe<ResolversTypes["RewardsMint"]>,
    ParentType,
    ContextType,
    RequireFields<QueryrewardsMintArgs, "id" | "subgraphError">
  >;
  rewardsMints?: Resolver<
    Array<ResolversTypes["RewardsMint"]>,
    ParentType,
    ContextType,
    RequireFields<QueryrewardsMintsArgs, "skip" | "first" | "subgraphError">
  >;
  ldystaking?: Resolver<
    Maybe<ResolversTypes["LDYStaking"]>,
    ParentType,
    ContextType,
    RequireFields<QueryldystakingArgs, "id" | "subgraphError">
  >;
  ldystakings?: Resolver<
    Array<ResolversTypes["LDYStaking"]>,
    ParentType,
    ContextType,
    RequireFields<QueryldystakingsArgs, "skip" | "first" | "subgraphError">
  >;
  totalStakedUpdate?: Resolver<
    Maybe<ResolversTypes["TotalStakedUpdate"]>,
    ParentType,
    ContextType,
    RequireFields<QuerytotalStakedUpdateArgs, "id" | "subgraphError">
  >;
  totalStakedUpdates?: Resolver<
    Array<ResolversTypes["TotalStakedUpdate"]>,
    ParentType,
    ContextType,
    RequireFields<QuerytotalStakedUpdatesArgs, "skip" | "first" | "subgraphError">
  >;
  _meta?: Resolver<Maybe<ResolversTypes["_Meta_"]>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type RewardsMintResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["RewardsMint"] = ResolversParentTypes["RewardsMint"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  ltoken?: Resolver<ResolversTypes["LToken"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  account?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  balanceBefore?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  revenue?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  growth?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Subscription"] = ResolversParentTypes["Subscription"],
> = ResolversObject<{
  ltoken?: SubscriptionResolver<
    Maybe<ResolversTypes["LToken"]>,
    "ltoken",
    ParentType,
    ContextType,
    RequireFields<SubscriptionltokenArgs, "id" | "subgraphError">
  >;
  ltokens?: SubscriptionResolver<
    Array<ResolversTypes["LToken"]>,
    "ltokens",
    ParentType,
    ContextType,
    RequireFields<SubscriptionltokensArgs, "skip" | "first" | "subgraphError">
  >;
  tvlupdate?: SubscriptionResolver<
    Maybe<ResolversTypes["TVLUpdate"]>,
    "tvlupdate",
    ParentType,
    ContextType,
    RequireFields<SubscriptiontvlupdateArgs, "id" | "subgraphError">
  >;
  tvlupdates?: SubscriptionResolver<
    Array<ResolversTypes["TVLUpdate"]>,
    "tvlupdates",
    ParentType,
    ContextType,
    RequireFields<SubscriptiontvlupdatesArgs, "skip" | "first" | "subgraphError">
  >;
  aprupdate?: SubscriptionResolver<
    Maybe<ResolversTypes["APRUpdate"]>,
    "aprupdate",
    ParentType,
    ContextType,
    RequireFields<SubscriptionaprupdateArgs, "id" | "subgraphError">
  >;
  aprupdates?: SubscriptionResolver<
    Array<ResolversTypes["APRUpdate"]>,
    "aprupdates",
    ParentType,
    ContextType,
    RequireFields<SubscriptionaprupdatesArgs, "skip" | "first" | "subgraphError">
  >;
  activity?: SubscriptionResolver<
    Maybe<ResolversTypes["Activity"]>,
    "activity",
    ParentType,
    ContextType,
    RequireFields<SubscriptionactivityArgs, "id" | "subgraphError">
  >;
  activities?: SubscriptionResolver<
    Array<ResolversTypes["Activity"]>,
    "activities",
    ParentType,
    ContextType,
    RequireFields<SubscriptionactivitiesArgs, "skip" | "first" | "subgraphError">
  >;
  rewardsMint?: SubscriptionResolver<
    Maybe<ResolversTypes["RewardsMint"]>,
    "rewardsMint",
    ParentType,
    ContextType,
    RequireFields<SubscriptionrewardsMintArgs, "id" | "subgraphError">
  >;
  rewardsMints?: SubscriptionResolver<
    Array<ResolversTypes["RewardsMint"]>,
    "rewardsMints",
    ParentType,
    ContextType,
    RequireFields<SubscriptionrewardsMintsArgs, "skip" | "first" | "subgraphError">
  >;
  ldystaking?: SubscriptionResolver<
    Maybe<ResolversTypes["LDYStaking"]>,
    "ldystaking",
    ParentType,
    ContextType,
    RequireFields<SubscriptionldystakingArgs, "id" | "subgraphError">
  >;
  ldystakings?: SubscriptionResolver<
    Array<ResolversTypes["LDYStaking"]>,
    "ldystakings",
    ParentType,
    ContextType,
    RequireFields<SubscriptionldystakingsArgs, "skip" | "first" | "subgraphError">
  >;
  totalStakedUpdate?: SubscriptionResolver<
    Maybe<ResolversTypes["TotalStakedUpdate"]>,
    "totalStakedUpdate",
    ParentType,
    ContextType,
    RequireFields<SubscriptiontotalStakedUpdateArgs, "id" | "subgraphError">
  >;
  totalStakedUpdates?: SubscriptionResolver<
    Array<ResolversTypes["TotalStakedUpdate"]>,
    "totalStakedUpdates",
    ParentType,
    ContextType,
    RequireFields<SubscriptiontotalStakedUpdatesArgs, "skip" | "first" | "subgraphError">
  >;
  _meta?: SubscriptionResolver<
    Maybe<ResolversTypes["_Meta_"]>,
    "_meta",
    ParentType,
    ContextType,
    Partial<Subscription_metaArgs>
  >;
}>;

export type TVLUpdateResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["TVLUpdate"] = ResolversParentTypes["TVLUpdate"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  ltoken?: Resolver<ResolversTypes["LToken"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TotalStakedUpdateResolvers<
  ContextType = MeshContext,
  ParentType extends
    ResolversParentTypes["TotalStakedUpdate"] = ResolversParentTypes["TotalStakedUpdate"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  staking?: Resolver<ResolversTypes["LDYStaking"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes["BigDecimal"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["_Block_"] = ResolversParentTypes["_Block_"],
> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes["Bytes"]>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["_Meta_"] = ResolversParentTypes["_Meta_"],
> = ResolversObject<{
  block?: Resolver<ResolversTypes["_Block_"], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  APRUpdate?: APRUpdateResolvers<ContextType>;
  Activity?: ActivityResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  LDYStaking?: LDYStakingResolvers<ContextType>;
  LToken?: LTokenResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RewardsMint?: RewardsMintResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TVLUpdate?: TVLUpdateResolvers<ContextType>;
  TotalStakedUpdate?: TotalStakedUpdateResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = LocalhostSubgraphTypes.Context & BaseMeshContext;

const baseDir = pathModule.join(typeof __dirname === "string" ? __dirname : "/", "..");

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (
    pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId
  )
    .split("\\")
    .join("/")
    .replace(baseDir + "/", "");
  switch (relativeModuleId) {
    case ".graphclient/sources/localhost-subgraph/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;

    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
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
  const localhostSubgraphTransforms = [];
  const additionalTypeDefs = [] as any[];
  const localhostSubgraphHandler = new GraphqlHandler({
    name: "localhost-subgraph",
    config: { endpoint: "http://0.0.0.0:8000/subgraphs/name/localhost-subgraph" },
    baseDir,
    cache,
    pubsub,
    store: sourcesStore.child("localhost-subgraph"),
    logger: logger.child("localhost-subgraph"),
    importFn,
  });
  sources[0] = {
    name: "localhost-subgraph",
    handler: localhostSubgraphHandler,
    transforms: localhostSubgraphTransforms,
  };
  const additionalResolvers = [] as any[];
  const merger = new (BareMerger as any)({
    cache,
    pubsub,
    logger: logger.child("bareMerger"),
    store: rootStore.child("bareMerger"),
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

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
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
