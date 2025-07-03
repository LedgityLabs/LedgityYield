// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { LTokenHedera } from "../hedera/LTokenHedera.sol";

contract MockHederaLToken is LTokenHedera {
  function mint(address to, uint256 amount) public {
    _mint(to, amount);
  }
}
