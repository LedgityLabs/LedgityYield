// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BaseUpgradeable.sol";
import {ERC20PausableUpgradeable} from "../pausable/ERC20PausableUpgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

abstract contract ERC20BaseUpgradeable is BaseUpgradeable, ERC20Upgradeable, ERC20PausableUpgradeable {
    /**
     * @dev Initializer function of the contract. It replaces the constructor() function
     * in context of upgradeable contracts.
     * See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     */
    function __ERC20Base_init(
        address _globalOwner,
        string memory name_,
        string memory symbol_
    ) internal onlyInitializing {
        __Base_init(_globalOwner);
        __ERC20_init(name_, symbol_);
    }

    /**
     * Required override of _beforeTokenTransfer() because the function is implemented
     * in both ERC20Upgradeable and ERC20PausableUpgradeable contracts.
     * The ERC20PausableUpgradeable version is used as it prevents tokens transfer
     * when contract is paused.
     * @inheritdoc ERC20PausableUpgradeable
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20Upgradeable, ERC20PausableUpgradeable) {
        ERC20PausableUpgradeable._beforeTokenTransfer(from, to, amount);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
