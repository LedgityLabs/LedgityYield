import {
  LToken,
  TVLUpdateEvent,
  APRUpdateEvent,
  ActivityEvent,
  MintedRewardsEvent,
} from "./generated/templates/LToken/LToken";
import { LToken as LTokenTemplate } from "./generated/templates";
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

export function handleSignaledLToken(event: LTokenSignalEvent): void {
  // Start indexing the signaled LToken

  const ltokenAddress = event.params.lTokenAddress.toHexString();
  let ltoken = LTokenSchema.load(ltokenAddress);
  if (ltoken == null) {
    LTokenTemplate.create(event.params.lTokenAddress);
    ltoken = new LTokenSchema(ltokenAddress);
    ltoken.symbol = LToken.bind(event.params.lTokenAddress).symbol();
    ltoken.decimals = LToken.bind(event.params.lTokenAddress).decimals();
    ltoken.totalMintedRewards = BigDecimal.fromString("0");
    ltoken.save();
  }
}

export function handleTVLUpdateEvent(event: TVLUpdateEvent): void {
  let ltoken = LTokenSchema.load(event.address.toHexString());
  if (ltoken) {
    let tvlUpdate = new TVLUpdate(event.transaction.hash.toHexString());
    tvlUpdate.ltoken = ltoken.id;
    tvlUpdate.timestamp = event.block.timestamp;
    tvlUpdate.amount = event.params.newTVL.toBigDecimal();

    tvlUpdate.save();
    ltoken.save();
  }
}

export function handleAPRUpdateEvent(event: APRUpdateEvent): void {
  let ltoken = LTokenSchema.load(event.address.toHexString());
  if (ltoken) {
    let aprUpdate = new APRUpdate(event.transaction.hash.toHexString());
    aprUpdate.ltoken = ltoken.id;
    aprUpdate.timestamp = event.block.timestamp;
    aprUpdate.apr = BigInt.fromI32(event.params.newAPR).toBigDecimal();

    aprUpdate.save();
    ltoken.save();
  }
}

/**
 * Required, see:
 * https://ethereum.stackexchange.com/questions/139078/how-to-use-subgraph-enums-in-the-mapping
 */
class ActivityStatus {
  static Success: string = "Success";
  static Fulfilled: string = "Fulfilled";
  static Cancelled: string = "Cancelled";
  static Queued: string = "Queued";
}
class ActivityAction {
  static Withdraw: string = "Withdraw";
  static Deposit: string = "Deposit";
}

export function handleActivityEvent(event: ActivityEvent): void {
  let ltoken = LTokenSchema.load(event.address.toHexString());
  if (ltoken) {
    let action: string = "";
    switch (event.params.action) {
      case 0:
        action = ActivityAction.Deposit;
        break;
      case 1:
        action = ActivityAction.Withdraw;
        break;
      default:
        action = "Unknown";
        break;
    }
    const activityID =
      event.params.id.toString() +
      "-" +
      event.params.account.toString() +
      "-" +
      action +
      "-" +
      event.params.amount.toString() +
      "-" +
      ltoken.symbol;
    let activity = Activity.load(activityID);
    if (activity == null) activity = new Activity(event.transaction.hash.toHexString());

    activity.ltoken = ltoken.id;
    activity.requestId = event.params.id;
    activity.timestamp = event.block.timestamp;
    activity.account = event.params.account;
    activity.action = action;
    activity.amount = event.params.amount.toBigDecimal();
    activity.amountAfterFees = event.params.amountAfterFees.toBigDecimal();
    switch (event.params.newStatus) {
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
      default:
        activity.status = "Unknown";
        break;
    }

    activity.save();
    ltoken.save();
  }
}

export function handleMintedRewardsEvent(event: MintedRewardsEvent): void {
  let ltoken = LTokenSchema.load(event.address.toHexString());

  if (ltoken) {
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
