import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { StakingAPRInfo } from "./generated/schema";

export const STAKING_APR_INFO_ID = "STAKING_APR_INFO_ID";

export function bigDecimalExp18(): BigDecimal {
  return BigDecimal.fromString("1000000000000000000");
}

export function getOrCreateStakingAPRInfo(): StakingAPRInfo {
  let stakingAprInfo = StakingAPRInfo.load(STAKING_APR_INFO_ID);
  if (stakingAprInfo == null) {
    stakingAprInfo = new StakingAPRInfo(STAKING_APR_INFO_ID);
    stakingAprInfo.rewardPerSec = BigInt.fromI32(0);
    stakingAprInfo.totalStaked = BigInt.fromI32(0);
    stakingAprInfo.interestRate = BigDecimal.fromString("0");
  }
  return stakingAprInfo;
}

export function updateStakingAPRInfo(): void {
  const stakingAPRInfo = getOrCreateStakingAPRInfo();
  if (stakingAPRInfo.totalStaked == BigInt.fromI32(0)) {
    stakingAPRInfo.interestRate = BigDecimal.fromString("0");
  } else {
    stakingAPRInfo.interestRate = new BigDecimal(stakingAPRInfo.rewardPerSec)
      .times(bigDecimalExp18())
      .div(stakingAPRInfo.totalStaked.toBigDecimal());
  }
  stakingAPRInfo.save();
}
