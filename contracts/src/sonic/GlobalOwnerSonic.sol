// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { GlobalOwner } from "../GlobalOwner.sol";
import { SonicFeeMRegister } from "../misc/SonicFeeMRegister.sol";

contract GlobalOwnerSonic is GlobalOwner, SonicFeeMRegister {
  function initializeAndRegister() public {
    // Register on FeeM
    registerContract();

    // Initialize
    GlobalOwner.initialize();
  }
}
