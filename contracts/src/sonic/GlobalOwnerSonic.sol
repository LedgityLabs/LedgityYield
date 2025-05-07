// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { GlobalOwner } from "../GlobalOwner.sol";
import { SonicFeeMRegister } from "../libs/SonicFeeMRegister.sol";

contract GlobalOwnerSonic is GlobalOwner {
  function initializeAndRegister() public {
    SonicFeeMRegister.registerContract();

    GlobalOwner.initialize();
  }
}
