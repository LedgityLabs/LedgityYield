import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { StakingAPRInfo } from "./generated/schema";

export const STAKING_APR_INFO_ID = "STAKING_APR_INFO_ID";
export const SECONDS_PER_YEAR = BigInt.fromI32(365 * 24 * 60 * 60);

export function getOrCreateStakingAPRInfo(): StakingAPRInfo {
  let stakingAprInfo = StakingAPRInfo.load(STAKING_APR_INFO_ID);
  if (stakingAprInfo == null) {
    stakingAprInfo = new StakingAPRInfo(STAKING_APR_INFO_ID);
    stakingAprInfo.rewardPerSec = BigInt.fromI32(0);
    stakingAprInfo.totalStaked = BigInt.fromI32(0);
    stakingAprInfo.APR = BigDecimal.fromString("0");
  }
  return stakingAprInfo;
}

export function updateStakingAPRInfo(): void {
  const stakingAPRInfo = getOrCreateStakingAPRInfo();
  if (stakingAPRInfo.totalStaked == BigInt.fromI32(0)) {
    stakingAPRInfo.APR = BigDecimal.fromString("0");
  } else {
    stakingAPRInfo.APR = new BigDecimal(stakingAPRInfo.rewardPerSec)
      .times(new BigDecimal(SECONDS_PER_YEAR))
      .div(new BigDecimal(stakingAPRInfo.totalStaked));
  }
  stakingAPRInfo.save();
}
