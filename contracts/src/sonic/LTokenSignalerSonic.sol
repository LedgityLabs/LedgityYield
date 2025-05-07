// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { LTokenSignaler } from "../LTokenSignaler.sol";
import { SonicFeeMRegister } from "../libs/SonicFeeMRegister.sol";

contract LTokenSignalerSonic is LTokenSignaler {
  function initializeAndRegister(address globalOwner_) public {
    SonicFeeMRegister.registerContract();

    LTokenSignaler.initialize(globalOwner_);
  }
}
