// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./BaseUpgradeable.sol";
import {ERC20PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {GlobalPausableUpgradeable} from "../GlobalPausableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

/**
 * @title ERC20BaseUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice This abstract contracts is an extension of BaseUpgradeable intended to be used
 * as a base for ERC20 tokens contracts.
 * @dev For further details, see "ERC20BaseUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract ERC20BaseUpgradeable is ERC20Upgradeable, BaseUpgradeable, ERC20PausableUpgradeable {
    /**
     * @dev Initializer functions of the contract. They replace the constructor() function
     * in context of upgradeable contracts.
     * See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param globalOwner_ The address of the GlobalOwner contract
     * @param globalPause_ The address of the GlobalPause contract
     * @param globalBlacklist_ The address of the GlobalBlacklist contract
     * @param name_ The display name of the token
     * @param symbol_ The symbol of the token
     */
    function __ERC20Base_init(
        address globalOwner_,
        address globalPause_,
        address globalBlacklist_,
        string memory name_,
        string memory symbol_
    ) internal onlyInitializing {
        __Base_init(globalOwner_, globalPause_, globalBlacklist_);
        __ERC20_init(name_, symbol_);
        __ERC20Pausable_init_unchained();
    }

    function __ERC20Base_init_unchained() internal onlyInitializing {}

    /**
     * @dev Required override of paused() which is implemented by both
     * GlobalPausableUpgradeable and PausableUpgradeable parent contracts.
     * The GlobalPausableUpgradeable version is preferred because it checks the pause
     * state from the GlobalPause contract instead of locally.
     * @inheritdoc GlobalPausableUpgradeable
     */
    function paused()
        public
        view
        virtual
        override(GlobalPausableUpgradeable, PausableUpgradeable)
        returns (bool)
    {
        return GlobalPausableUpgradeable.paused();
    }

    /**
     * @dev Required override of _beforeTokenTransfer() which is implemented by both
     * ERC20PausableUpgradeable and ERC20Upgradeable parent contracts.
     * The ERC20PausableUpgradeable version is preferred because it also checks that
     * the contract is not paused before allowing the transfer.
     * @inheritdoc ERC20PausableUpgradeable
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    )
        internal
        virtual
        override(ERC20PausableUpgradeable, ERC20Upgradeable)
        whenNotPaused
        notBlacklisted(from)
        notBlacklisted(to)
    {
        ERC20PausableUpgradeable._beforeTokenTransfer(from, to, amount);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
