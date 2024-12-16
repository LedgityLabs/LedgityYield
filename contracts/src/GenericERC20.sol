// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @notice Used for testing purposes only, and used to generate ABIs for Wagmi contracts calls.
 * It represents:
 * - a FIAT-based stablecoin when used to test the LToken contract,
 * - the $LDY token when used to test the LDYStaking contract.
 * This contract accept decimals as constructor argument, so it can be used to to
 * easily test different decimals scenarios.
 */
contract GenericERC20 is ERC20, ERC20Burnable {
  uint8 private _decimals;

  constructor(
    string memory name,
    string memory symbol,
    uint8 decimals_
  ) ERC20(name, symbol) {
    _decimals = decimals_;
  }

  function mint(uint256 amount) public {
    _mint(msg.sender, amount);
  }

  function decimals() public view virtual override returns (uint8) {
    return _decimals;
  }

  /**
   * Used in tests to test different decimals scenarios.
   */
  function setDecimals(uint8 decimals_) public {
    _decimals = decimals_;
  }
}
