// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title
 * @author
 * @notice Used for testing purposes only.
 * It represents FIAT-based stablecoin when used to test the LToken contract, or
 * the $LTY token when used to test the LTYStaking contract.
 * This contract accept decimals as constructor argument, so it can be used to to
 * easily test different decimals scenarios.
 */
contract GenericToken is ERC20 {
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
