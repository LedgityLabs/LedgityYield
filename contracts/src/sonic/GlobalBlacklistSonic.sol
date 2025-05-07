// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { GlobalBlacklist } from "../GlobalBlacklist.sol";
import { SonicFeeMRegister } from "../libs/SonicFeeMRegister.sol";

contract GlobalBlacklistSonic is GlobalBlacklist {
  function initializeAndRegister(address globalOwner_) public {
    SonicFeeMRegister.registerContract();

    GlobalBlacklist.initialize(globalOwner_);
  }
}
