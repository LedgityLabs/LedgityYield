// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

// Contracts
import { LDY } from "../LDY.sol";
// Libraries
import { SonicFeeMRegister } from "../libs/SonicFeeMRegister.sol";

contract LDYSonic is LDY {
  constructor() LDY() {
    SonicFeeMRegister.registerContract();
  }
}
