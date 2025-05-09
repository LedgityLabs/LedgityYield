// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { LDYStaking } from "../LDYStaking.sol";
import { SonicFeeMRegister } from "../misc/SonicFeeMRegister.sol";

contract LDYStakingSonic is LDYStaking, SonicFeeMRegister {
  function initializeAndRegister(
    address globalOwner_,
    address globalPause_,
    address globalBlacklist_,
    address stakeRewardToken_,
    StakeDurationInfo[] memory stakeDurationInfos_,
    uint256 stakeDurationForPerks_,
    uint256 stakeAmountForPerks_
  ) public {
    registerContract();

    LDYStaking.initialize(
      globalOwner_,
      globalPause_,
      globalBlacklist_,
      stakeRewardToken_,
      stakeDurationInfos_,
      stakeDurationForPerks_,
      stakeAmountForPerks_
    );
  }
}
