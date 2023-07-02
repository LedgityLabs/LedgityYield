// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @notice Used for testing purposes only.
 * It represents:
 * - a FIAT-based stablecoin when used to test the LToken contract,
 * - the $LTY token when used to test the LTYStaking contract.
 * This contract accept decimals as constructor argument, so it can be used to to
 * easily test different decimals scenarios.
 */
contract GenericERC20 is ERC20 {
    uint8 private _decimals;

    constructor(string memory name, string memory symbol, uint8 decimals_) ERC20(name, symbol) {
        _decimals = decimals_;
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}
