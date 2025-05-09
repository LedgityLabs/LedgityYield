// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { LTokenSignaler } from "../LTokenSignaler.sol";
import { SonicFeeMRegister } from "../misc/SonicFeeMRegister.sol";

contract LTokenSignalerSonic is LTokenSignaler, SonicFeeMRegister {
  function initializeAndRegister(address globalOwner_) public {
    registerContract();

    LTokenSignaler.initialize(globalOwner_);
  }
}
