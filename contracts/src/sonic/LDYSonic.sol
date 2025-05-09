// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

// Contracts
import { LDY } from "../LDY.sol";
// Libraries
import { SonicFeeMRegister } from "../misc/SonicFeeMRegister.sol";

contract LDYSonic is LDY, SonicFeeMRegister {
  constructor() LDY() {
    registerContract();
  }
}
