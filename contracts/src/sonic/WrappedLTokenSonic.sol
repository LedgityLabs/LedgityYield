// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { WrappedLToken } from "../WrappedLToken.sol";
import { SonicFeeMRegister } from "../libs/SonicFeeMRegister.sol";

contract WrappedLTokenSonic is WrappedLToken {
  function initializeAndRegister(
    address globalOwner_,
    address globalPause_,
    address globalBlacklist_,
    address lToken_,
    string calldata name_,
    string calldata symbol_
  ) public {
    SonicFeeMRegister.registerContract();

    WrappedLToken.initialize(
      globalOwner_,
      globalPause_,
      globalBlacklist_,
      lToken_,
      name_,
      symbol_
    );
  }
}
