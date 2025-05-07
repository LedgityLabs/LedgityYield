// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { GlobalPause } from "../GlobalPause.sol";
import { SonicFeeMRegister } from "../libs/SonicFeeMRegister.sol";

contract GlobalPauseSonic is GlobalPause {
  function initializeAndRegister(address globalOwner_) public {
    SonicFeeMRegister.registerContract();

    GlobalPause.initialize(globalOwner_);
  }
}
