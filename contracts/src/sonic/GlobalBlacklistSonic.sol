// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { GlobalBlacklist } from "../GlobalBlacklist.sol";
import { SonicFeeMRegister } from "../misc/SonicFeeMRegister.sol";

contract GlobalBlacklistSonic is GlobalBlacklist, SonicFeeMRegister {
  function initializeAndRegister(address globalOwner_) public {
    registerContract();

    GlobalBlacklist.initialize(globalOwner_);
  }
}
