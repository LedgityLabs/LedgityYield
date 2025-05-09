// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { GlobalPause } from "../GlobalPause.sol";
import { SonicFeeMRegister } from "../misc/SonicFeeMRegister.sol";

contract GlobalPauseSonic is GlobalPause, SonicFeeMRegister {
  function initializeAndRegister(address globalOwner_) public {
    registerContract();

    GlobalPause.initialize(globalOwner_);
  }
}
