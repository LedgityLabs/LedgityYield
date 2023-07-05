import {
  TVLUpdateEvent,
  APRUpdateEvent,
  ActivityEvent,
  MintedRewardsEvent,
} from "./generated/templates/LToken/LToken";
import { LToken as LTokenFactory } from "./generated/templates";
import {
  LToken,
  TVLUpdate,
  Activity,
  APRUpdate,
  RewardsMint,
  LTYStaking,
  TotalStakedUpdate,
} from "./generated/schema";
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { TotalStakedUpdateEvent } from "./generated/LTYStaking/LTYStaking";
import { LTokenSignalEvent } from "./generated/LTokenSignaler/LTokenSignaler";

export function handleSignaledLToken(event: LTokenSignalEvent): void {
  // Start indexing the signaled LToken
  LTokenFactory.create(event.params.lTokenAddress);

  const ltokenAddress = event.address.toHexString();
  let ltoken = LToken.load(ltokenAddress);
  if (ltoken == null) ltoken = new LToken(ltokenAddress);
  ltoken.save();
}

export function handleTVLUpdateEvent(event: TVLUpdateEvent): void {
  let ltoken = LToken.load(event.address.toHexString())!;

  let tvlUpdate = new TVLUpdate(event.transaction.hash.toHexString());
  tvlUpdate.ltoken = ltoken.id;
  tvlUpdate.timestamp = event.block.timestamp;
  tvlUpdate.amount = event.params.newTVL.toBigDecimal();

  tvlUpdate.save();
  ltoken.save();
}

export function handleAPRUpdateEvent(event: APRUpdateEvent): void {
  let ltoken = LToken.load(event.address.toHexString())!;

  let aprUpdate = new APRUpdate(event.transaction.hash.toHexString());
  aprUpdate.ltoken = ltoken.id;
  aprUpdate.timestamp = event.block.timestamp;
  aprUpdate.apr = BigInt.fromI32(event.params.newAPR).toBigDecimal();

  aprUpdate.save();
  ltoken.save();
}

export function handleActivityEvent(event: ActivityEvent): void {
  let ltoken = LToken.load(event.address.toHexString())!;

  const activityID =
    event.params.id < new BigInt(0) ? event.params.id.toString() : event.transaction.hash.toString();
  let activity = Activity.load(activityID);
  if (activity == null) activity = new Activity(activityID);
  activity.ltoken = ltoken.id;
  activity.timestamp = event.block.timestamp;
  activity.account = event.params.account;
  activity.action = BigInt.fromI32(event.params.action).toString();
  activity.amount = event.params.amount.toBigDecimal();
  activity.status = BigInt.fromI32(event.params.newStatus).toString();

  activity.save();
  ltoken.save();
}

export function handleMintedRewardsEvent(event: MintedRewardsEvent): void {
  let ltoken = LToken.load(event.address.toHexString())!;

  let rewardsMint = new RewardsMint(event.transaction.hash.toHexString());
  rewardsMint.ltoken = ltoken.id;
  rewardsMint.timestamp = event.block.timestamp;
  rewardsMint.account = event.params.account;
  const balanceBefore = event.params.balanceBefore.toBigDecimal();
  rewardsMint.balanceBefore = balanceBefore;
  const rewards = event.params.rewards.toBigDecimal();
  rewardsMint.revenue = rewards;
  let growth = BigDecimal.fromString("0");
  if (balanceBefore.notEqual(BigDecimal.fromString("0"))) {
    growth = rewards.div(balanceBefore);
  }
  rewardsMint.growth = growth;

  rewardsMint.save();
  ltoken.save();
}

export function handleTotalStakedEvent(event: TotalStakedUpdateEvent): void {
  const ltyStakingAddress = event.address.toHexString();
  let ltyStaking = LTYStaking.load(ltyStakingAddress);
  if (ltyStaking == null) ltyStaking = new LTYStaking(ltyStakingAddress);

  let totalStakedUpdate = new TotalStakedUpdate(event.transaction.hash.toHexString());
  totalStakedUpdate.staking = ltyStaking.id;
  totalStakedUpdate.timestamp = event.block.timestamp;
  totalStakedUpdate.amount = event.params.newTotalStaked.toBigDecimal();

  totalStakedUpdate.save();
  ltyStaking.save();
}
