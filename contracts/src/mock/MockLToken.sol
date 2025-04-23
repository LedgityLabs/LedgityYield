// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { LToken } from "../LToken.sol";

contract MockLToken is LToken {
  function mint(address to, uint256 amount) public {
    _mint(to, amount);
  }
}
