import {
  LToken,
  TVLChangeEvent,
  APRChangeEvent,
  ActivityEvent,
  MintedRewardsEvent,
} from "./generated/templates/LToken/LToken";
import { LToken as LTokenTemplate } from "./generated/templates";
import {
  LToken as LTokenSchema,
  TVLChange,
  Activity,
  APRChange,
  RewardsMint,
} from "./generated/schema";
import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { LTokenSignalEvent } from "./generated/LTokenSignaler/LTokenSignaler";
import { log } from "@graphprotocol/graph-ts";
import { store } from "@graphprotocol/graph-ts";

export function handleSignaledLToken(event: LTokenSignalEvent): void {
  // Start indexing the signaled LToken
  const ltokenAddress = event.params.lTokenAddress.toHexString();
  let ltoken = LTokenSchema.load(ltokenAddress);
  if (ltoken == null) {
    LTokenTemplate.create(event.params.lTokenAddress);
    ltoken = new LTokenSchema(ltokenAddress);
    ltoken.symbol = LToken.bind(event.params.lTokenAddress).symbol();
    ltoken.decimals = LToken.bind(event.params.lTokenAddress).decimals();
    ltoken.totalMintedRewards = BigDecimal.fromString("1");
    ltoken.save();
  }
}

export function handleTVLChangeEvent(event: TVLChangeEvent): void {
  let ltoken = LTokenSchema.load(event.address.toHexString());
  if (ltoken) {
    let tvlUpdate = new TVLChange(event.transaction.hash.toHexString());
    tvlUpdate.ltoken = ltoken.id;
    tvlUpdate.timestamp = event.block.timestamp;
    tvlUpdate.amount = event.params.newTVL.toBigDecimal();

    tvlUpdate.save();
    ltoken.save();
  }
}

export function handleAPRChangeEvent(event: APRChangeEvent): void {
  let ltoken = LTokenSchema.load(event.address.toHexString());
  if (ltoken) {
    let aprUpdate = new APRChange(event.transaction.hash.toHexString());
    aprUpdate.ltoken = ltoken.id;
    aprUpdate.timestamp = event.block.timestamp;
    aprUpdate.apr = BigInt.fromI32(event.params.newAPRUD7x3).toBigDecimal();

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
  static Moved: string = "Moved";
}
class ActivityAction {
  static Withdraw: string = "Withdraw";
  static Deposit: string = "Deposit";
}

function buildActivityID(
  id: BigInt,
  account: Address,
  action: string,
  amount: BigInt,
  symbol: string,
): string {
  return (
    id.toString() +
    "-" +
    account.toHexString() +
    "-" +
    action +
    "-" +
    amount.toString() +
    "-" +
    symbol
  );
}

export function handleActivityEvent(event: ActivityEvent): void {
  let ltoken = LTokenSchema.load(event.address.toHexString());
  if (ltoken) {
    // Retrieve activity action
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

    // Build activity ID
    const activityID = buildActivityID(
      event.params.id,
      event.params.account,
      action,
      event.params.amount,
      ltoken.symbol,
    );

    // Try loading existing activity entry from this ID
    let activity = Activity.load(activityID);

    // If the activity exists and this is a "Moved" activity status, move activity data to the new one
    if (activity !== null && event.params.newStatus == 3) {
      // Create the new request activity
      const newActitivityID = buildActivityID(
        event.params.newId,
        event.params.account,
        action,
        event.params.amount,
        ltoken.symbol,
      );
      const newActivity = new Activity(newActitivityID);

      // Copy data from the old request
      newActivity.ltoken = ltoken.id;
      newActivity.timestamp = activity.timestamp;
      newActivity.account = activity.account;
      newActivity.action = activity.action;
      newActivity.amount = activity.amount;
      newActivity.amountAfterFees = activity.amountAfterFees;
      newActivity.status = activity.status;

      // Set new activity's request id
      newActivity.requestId = event.params.newId;

      // Delete the old request activity
      store.remove("Activity", activityID);

      // Save the new request activity
      newActivity.save();
    }

    // Else, set activity data
    else if (event.params.newStatus != 3) {
      // Create activity entry if null
      if (activity == null) activity = new Activity(activityID);

      // Fill activity data
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

      // Save the activity
      activity.save();
    }
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
    ltoken.totalMintedRewards = ltoken.totalMintedRewards.plus(rewards);

    rewardsMint.save();
    ltoken.save();
  }
}
