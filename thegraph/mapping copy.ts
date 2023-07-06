import {
  // LToken,
  TVLUpdateEvent,
  APRUpdateEvent,
  ActivityEvent,
  MintedRewardsEvent,
} from "./generated/templates/LToken/LToken";
// import { LToken as LTokenTemplate } from "./generated/templates";
import {
  LToken as LTokenSchema,
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
import { log } from "@graphprotocol/graph-ts";

export function handleSignaledLToken(event: LTokenSignalEvent): void {
  const ltokenAddress = event.params.lTokenAddress;
  let ltoken = LTokenSchema.load(ltokenAddress.toHexString());
  if (ltoken == null) {
    // Start indexing the signaled LToken
    // LTokenTemplate.create(ltokenAddress);
    ltoken = new LTokenSchema(ltokenAddress.toHexString());
    // ltoken.symbol = LToken.bind(ltokenAddress).symbol();
    ltoken.symbol = "TEST";
    ltoken.totalMintedRewards = BigDecimal.fromString("0");
    ltoken.save();
  }
}

export function handleTVLUpdateEvent(event: TVLUpdateEvent): void {
  let ltoken = LTokenSchema.load(event.address.toHexString())!;

  let tvlUpdate = new TVLUpdate(event.transaction.hash.toHexString());
  tvlUpdate.ltoken = ltoken.id;
  tvlUpdate.timestamp = event.block.timestamp;
  tvlUpdate.amount = event.params.newTVL.toBigDecimal();

  tvlUpdate.save();
  ltoken.save();
}

export function handleAPRUpdateEvent(event: APRUpdateEvent): void {
  let ltoken = LTokenSchema.load(event.address.toHexString())!;

  let aprUpdate = new APRUpdate(event.transaction.hash.toHexString());
  aprUpdate.ltoken = ltoken.id;
  aprUpdate.timestamp = event.block.timestamp;
  aprUpdate.apr = BigInt.fromI32(event.params.newAPR).toBigDecimal();

  aprUpdate.save();
  ltoken.save();
}

/**
 * Required, see:
 * https://ethereum.stackexchange.com/questions/139078/how-to-use-subgraph-enums-in-the-mapping
 */
class ActivityStatus {
  static Success: string = "Null";
  static Fulfilled: string = "Submitted";
  static Cancelled: string = "Executed";
  static Queued: string = "Rejected";
}
class ActivityAction {
  static Withdraw: string = "Withdraw";
  static Deposit: string = "Deposit";
}

export function handleActivityEvent(event: ActivityEvent): void {
  let ltoken = LTokenSchema.load(event.address.toHexString())!;

  const activityID =
    event.params.id < new BigInt(0) ? event.params.id.toString() : event.transaction.hash.toString();
  let activity = Activity.load(activityID);
  if (activity == null) activity = new Activity(activityID);
  activity.ltoken = ltoken.id;
  activity.timestamp = event.block.timestamp;
  activity.account = event.params.account;
  const action = event.params.action;
  log.info("Activity: {}", [action.toString()]);
  console.log("Activity: " + action.toString());
  switch (action) {
    case 0:
      activity.action = ActivityAction.Deposit;
      break;
    case 1:
      activity.action = ActivityAction.Withdraw;
      break;
  }
  activity.amount = event.params.amount.toBigDecimal();
  const status = event.params.newStatus;
  log.info("Status: {}", [status.toString()]);
  console.log("Status: " + status.toString());
  switch (status) {
    case 0:
      activity.status = ActivityStatus.Queued;
      break;
    case 1:
      activity.status = ActivityStatus.Cancelled;
      break;
    case 2:
      if (activity.action == ActivityAction.Deposit) {
        activity.status = ActivityStatus.Success;
      } else activity.status = ActivityStatus.Fulfilled;
      break;
  }

  activity.save();
  ltoken.save();
}

export function handleMintedRewardsEvent(event: MintedRewardsEvent): void {
  let ltoken = LTokenSchema.load(event.address.toHexString())!;

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
