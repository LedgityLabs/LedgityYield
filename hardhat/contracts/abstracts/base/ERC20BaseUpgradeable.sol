// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BaseUpgradeable.sol";
import {ERC20PausableUpgradeable} from "../pausable/ERC20PausableUpgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

abstract contract ERC20BaseUpgradeable is BaseUpgradeable, ERC20Upgradeable, ERC20PausableUpgradeable {
    /**
     * @dev Initializer function ...
     */
    function __ERC20Base_init(string memory name_, string memory symbol_) internal onlyInitializing {
        __Base_init();
        __ERC20_init(name_, symbol_);
    }

    // Required override
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20Upgradeable, ERC20PausableUpgradeable) {
        ERC20PausableUpgradeable._beforeTokenTransfer(from, to, amount);
    }
}
