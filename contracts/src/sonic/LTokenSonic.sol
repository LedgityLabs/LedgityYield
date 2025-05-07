// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

// Contracts
import { LToken } from "../LToken.sol";
// Libraries
import { SonicFeeMRegister } from "../libs/SonicFeeMRegister.sol";

contract LTokenSonic is LToken {
  function initializeAndRegister(
    address globalOwner_,
    address globalPause_,
    address globalBlacklist_,
    address ldyStaking_,
    address underlyingToken,
    string calldata name,
    string calldata symbol
  ) public {
    SonicFeeMRegister.registerContract();

    LToken.initialize(
      globalOwner_,
      globalPause_,
      globalBlacklist_,
      ldyStaking_,
      underlyingToken,
      name,
      symbol
    );
  }
}
