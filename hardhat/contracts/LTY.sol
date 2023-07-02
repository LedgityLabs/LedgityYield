// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20BurnableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import {ERC20CappedUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import {ERC20BaseUpgradeable} from "./abstracts/base/ERC20BaseUpgradeable.sol";

/**
 * @dev
 */
contract LTY is ERC20BaseUpgradeable, ERC20BurnableUpgradeable, ERC20CappedUpgradeable {
    function initialize(address _globalOwner) public initializer {
        __ERC20Base_init(_globalOwner, "Ledgity Token", "LTY");
        __ERC20Burnable_init();
        __ERC20Capped_init(100_000_000 * 10 ** 18);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    /** @dev Required override of ERC20._mint() because of conflict between ERC20 and Capped extension */
    function _mint(
        address account,
        uint256 amount
    ) internal virtual override(ERC20Upgradeable, ERC20CappedUpgradeable) {
        ERC20CappedUpgradeable._mint(account, amount);
    }

    function mint(uint256 amount) public onlyOwner {
        _mint(msg.sender, amount);
    }

    // Required override
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20BaseUpgradeable, ERC20Upgradeable) {
        ERC20BaseUpgradeable._beforeTokenTransfer(from, to, amount);
    }
}
