// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { WrappedLToken } from "../WrappedLToken.sol";
import { SonicFeeMRegister } from "../misc/SonicFeeMRegister.sol";

contract WrappedLTokenSonic is WrappedLToken, SonicFeeMRegister {
  function initializeAndRegister(
    address globalOwner_,
    address globalPause_,
    address globalBlacklist_,
    address lToken_,
    string calldata name_,
    string calldata symbol_
  ) public {
    registerContract();

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
